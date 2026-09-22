import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("roteiro detecta vazamento e desfaz os dados fictícios", async () => {
 const db = new PGlite();
 try {
 await db.exec("create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema public,auth to authenticated,anon,service_role;");
 for (const file of ["20260909000100_catalog_foundation.sql","20260909000200_create_catalog_product.sql"])
 await db.exec(await readFile(new URL("../migrations/"+file,import.meta.url),"utf8"));
 await db.exec("insert into auth.users values ('00000000-0000-4000-8000-000000000001'); insert into public.organizations(id,name) values ('00000000-0000-4000-8000-000000000010','Existente'); insert into public.memberships(organization_id,user_id,role) values ('00000000-0000-4000-8000-000000000010','00000000-0000-4000-8000-000000000001','member');");
 const script = await readFile(new URL("../checks/catalog-isolation.sql",import.meta.url),"utf8");
 const results = await db.exec(script);
 const checks = results.find(result => result.rows?.[0]?.teste)?.rows;
 assert.equal(checks?.length,5);
 assert.ok(checks.every(row => row.aprovado));
 assert.equal((await db.query("select count(*)::int n from public.products")).rows[0].n,0);
 assert.equal((await db.query("select count(*)::int n from public.organizations")).rows[0].n,1);
 await db.exec("alter table public.products disable row level security");
 await assert.rejects(() => db.exec(script), /Falha de isolamento/);
 await db.exec("rollback");
 assert.equal((await db.query("select count(*)::int n from public.products")).rows[0].n,0);
 assert.equal((await db.query("select count(*)::int n from public.organizations")).rows[0].n,1);
 } finally { await db.close(); }
});
