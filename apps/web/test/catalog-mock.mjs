// Test-only PostgREST boundary backed by the actual SQL migrations in memory.
import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
const db = new PGlite();
await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
create schema auth; create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema public,auth to authenticated; grant execute on function auth.uid() to authenticated;`);
for (const name of ["20260909000100_catalog_foundation.sql", "20260909000200_create_catalog_product.sql"]) await db.exec(await readFile(new URL(`../../../supabase/migrations/${name}`, import.meta.url), "utf8"));
const uid="00000000-0000-4000-8000-000000000001", org="00000000-0000-4000-8000-000000000010";
await db.query("insert into auth.users values ($1)",[uid]);
await db.query("insert into public.organizations(id,name) values ($1,'Equipe de teste')",[org]);
await db.query("insert into public.memberships(organization_id,user_id,role) values ($1,$2,'member')",[org,uid]);
export async function catalogRequest(path, url, data, email, send) {
  if (!email) return send(401,{code:"42501"});
  try {
    const result = await db.transaction(async tx => {
      await tx.query("select set_config('request.jwt.claim.sub',$1,true)",[uid]);
      await tx.exec("set local role authenticated");
      if (path === "/rest/v1/memberships") return (await tx.query("select organization_id from public.memberships where active")).rows;
      if (path === "/rest/v1/rpc/create_catalog_product") return (await tx.query("select public.create_catalog_product($1,$2,$3) as id",[data.p_id,data.p_organization_id,JSON.stringify(data.p_dna)])).rows[0].id;
      if (path === "/rest/v1/product_versions") return (await tx.query("select product_id,version,dna from public.product_versions where version=1 order by created_at desc,product_id limit 21 offset $1",[Number(url.searchParams.get("offset") ?? 0)])).rows;
      throw new Error("Unknown test route");
    });
    return send(200,result);
  } catch(error) { return send(400,{code:error.code ?? "TEST_FAILURE"}); }
}
