import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { before, after, test } from "node:test";
import assert from "node:assert/strict";
let db;
const tables = ["assets", "memberships", "organizations", "product_versions", "products"];
before(async () => {
  db = new PGlite(); // In memory only: no URL, filesystem data directory or real keys.
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema public, auth to authenticated, anon, service_role;
    grant execute on function auth.uid() to authenticated;
  `);
  await db.exec(await readFile(new URL("../migrations/20260909000100_catalog_foundation.sql", import.meta.url), "utf8"));
  await db.exec(await readFile(new URL("../migrations/20260909000200_create_catalog_product.sql", import.meta.url), "utf8"));
});

after(async () => { await db?.close(); });
const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12,"0")}`;
async function fixture() {
  await db.exec(`begin;
    insert into auth.users values ('${id(1)}'),('${id(2)}'),('${id(3)}');
    insert into public.organizations (id,name) values ('${id(10)}','Equipe A'),('${id(20)}','Equipe B');
    insert into public.memberships (organization_id,user_id,role) values ('${id(10)}','${id(1)}','member'),('${id(20)}','${id(2)}','admin');
    insert into public.products (id,organization_id,sku,name) values ('${id(11)}','${id(10)}','SKU-1','Produto A'),('${id(21)}','${id(20)}','SKU-1','Produto B');
    insert into public.product_versions (id,organization_id,product_id,version,dna) values ('${id(12)}','${id(10)}','${id(11)}',1,'{"name":"Versão original"}'),('${id(22)}','${id(20)}','${id(21)}',1,'{}');
    insert into public.assets (id,organization_id,product_version_id,bucket,object_key,mime_type,byte_size,sha256) values ('${id(13)}','${id(10)}','${id(12)}','test-assets','a/master.png','image/png',100,repeat('a',64)),('${id(23)}','${id(20)}','${id(22)}','test-assets','b/master.png','image/png',100,repeat('b',64));
  `);
}
async function asUser(user) { await db.query("select set_config('request.jwt.claim.sub', $1, true)", [user ? id(user) : ""]); await db.exec("set local role authenticated"); }
async function isolated(run) { await fixture(); try { await run(); } finally { await db.exec("rollback"); } }
async function rejected(sql, code) {
  await db.exec("savepoint rejection");
  try { await assert.rejects(() => db.exec(sql), error => error.code === code); }
  finally { await db.exec("rollback to savepoint rejection; release savepoint rejection"); }
}
test("cria somente as cinco tabelas previstas com RLS", async () => {
  const { rows } = await db.query("select tablename, rowsecurity from pg_tables where schemaname='public' order by tablename");
  assert.deepEqual(rows.map(row => row.tablename), tables);
  assert.ok(rows.every(row => row.rowsecurity));
});
test("cada equipe lê somente seus próprios produtos, versões e arquivos", () => isolated(async () => {
  for (const [user, org] of [[1,10],[2,20]]) {
    await db.exec("reset role"); await asUser(user);
    for (const table of ["products","product_versions","assets"]) {
      const {rows} = await db.query(`select organization_id from public.${table}`);
      assert.deepEqual(rows, [{organization_id:id(org)}]);
    }
    assert.equal((await db.query("select * from public.organizations")).rows.length,1);
    assert.equal((await db.query("select * from public.memberships")).rows.length,1);
  }
}));
test("usuário sem vínculo e sessão sem identidade não leem dados", () => isolated(async () => {
  for (const user of [3,null]) { await db.exec("reset role"); await asUser(user); for (const table of tables) assert.equal((await db.query(`select * from public.${table}`)).rows.length,0); }
}));
test("acesso anônimo e escrita direta do cliente são negados", () => isolated(async () => {
  await db.exec("set local role anon");
  await rejected("select * from public.products", "42501");
  await db.exec("reset role"); await asUser(1);
  await rejected(`update public.memberships set role='admin' where user_id='${id(1)}'`, "42501");
  await rejected(`insert into public.products(organization_id,sku,name) values ('${id(10)}','NEW','Produto')`, "42501");
}));
test("revogar vínculo corta a leitura sem depender de atualizar JWT", () => isolated(async () => {
  await db.exec(`update public.memberships set active=false where user_id='${id(1)}'`);
  await asUser(1);
  assert.equal((await db.query("select * from public.products")).rows.length,0);
}));
test("chaves compostas rejeitam ligações entre equipes", () => isolated(async () => {
  await rejected(`insert into public.product_versions(organization_id,product_id,version) values ('${id(10)}','${id(21)}',2)`, "23503");
  await rejected(`insert into public.assets(organization_id,product_version_id,bucket,object_key,mime_type,byte_size,sha256) values ('${id(10)}','${id(22)}','test-assets','wrong.png','image/png',100,repeat('c',64))`, "23503");
}));
test("SKU é único por equipe e número de versão é único por produto", () => isolated(async () => {
  await rejected(`insert into public.products(organization_id,sku,name) values ('${id(10)}','SKU-1','Duplicado')`, "23505");
  await rejected(`insert into public.product_versions(organization_id,product_id,version) values ('${id(10)}','${id(11)}',1)`, "23505");
}));
test("snapshots e identificação de arquivos não podem ser sobrescritos ou excluídos", () => isolated(async () => {
  await rejected(`update public.product_versions set dna='{}' where id='${id(12)}'`, "55000");
  await rejected(`delete from public.product_versions where id='${id(12)}'`, "55000");
  await rejected(`update public.assets set object_key='changed.png' where id='${id(13)}'`, "55000");
  await rejected(`delete from public.assets where id='${id(13)}'`, "55000");
  await db.exec(`update public.products set name='Nome atual' where id='${id(11)}'`);
  const { rows } = await db.query(`select dna from public.product_versions where id='${id(12)}'`);
  assert.equal(rows[0].dna.name,"Versão original");
}));
test("rejeita DNA que não seja objeto e metadados de arquivo inválidos", () => isolated(async () => {
  await rejected(`insert into public.product_versions(organization_id,product_id,version,dna) values ('${id(10)}','${id(11)}',2,'[]')`, "23514");
  await rejected(`insert into public.assets(organization_id,bucket,object_key,mime_type,byte_size,sha256) values ('${id(10)}','test-assets','invalid.png','image/png',-1,'invalid')`, "23514");
}));
const productDraft = { schema_version: "entry-1", name: "Vaso", sku: "NEW", category: "Decoração", height: "30.5", width: "20", depth: "20", unit: "cm", kind: "Produto simples", materials: "Cerâmica", colors: "Branco", fixed: "", variable: "", components: "" };
function createSql(productId = 100, org = 10, draft = productDraft) { return `select public.create_catalog_product('${id(productId)}','${id(org)}','${JSON.stringify(draft).replaceAll("'", "''")}')`; }
test("salvamento cria produto e versão uma vez, inclusive na repetição", () => isolated(async () => {
  await asUser(1);
  await db.exec(createSql()); await db.exec(createSql());
  assert.equal((await db.query(`select * from public.products where id='${id(100)}'`)).rows.length, 1);
  const { rows } = await db.query(`select version,dna from public.product_versions where product_id='${id(100)}'`);
  assert.equal(rows.length, 1); assert.equal(rows[0].version, 1); assert.deepEqual(rows[0].dna, productDraft);
}));
test("RPC nega equipe alheia, vínculo revogado e anônimo", () => isolated(async () => {
  await asUser(1); await rejected(createSql(100,20), "42501");
  await db.exec("reset role"); await db.exec(`update public.memberships set active=false where user_id='${id(1)}'`);
  await asUser(1); await rejected(createSql(), "42501");
  await db.exec("set local role anon"); await rejected(createSql(), "42501");
}));
test("RPC rejeita dados inválidos e conflito sem deixar produto incompleto", () => isolated(async () => {
  await asUser(1);
  await rejected(createSql(100,10,{...productDraft,height:"-1"}), "22023");
  await rejected(createSql(100,10,{...productDraft,name:" "}), "22023");
  await rejected(createSql(100,10,{...productDraft,unit:"invalid"}), "22023");
  await rejected(createSql(100,10,{...productDraft,kind:"Kit / conjunto"}), "22023");
  await rejected(createSql(100,10,{...productDraft,sku:"SKU-1"}), "23505");
  assert.equal((await db.query(`select * from public.products where id='${id(100)}'`)).rows.length,0);
  await db.exec(createSql());
  await rejected(createSql(100,10,{...productDraft,name:"Mudou"}), "23505");
  assert.equal((await db.query(`select dna from public.product_versions where product_id='${id(100)}'`)).rows[0].dna.name,"Vaso");
}));

test("falha ao criar versão desfaz também a inserção do produto", () => isolated(async () => {
  await db.exec(`create function private.test_version_failure() returns trigger language plpgsql as $$ begin raise exception 'Test failure' using errcode='23514'; end $$;
  create trigger test_version_failure before insert on public.product_versions for each row execute function private.test_version_failure();`);
  await asUser(1);
  await rejected(createSql(),"23514");
  assert.equal((await db.query(`select * from public.products where id='${id(100)}'`)).rows.length,0);
}));
