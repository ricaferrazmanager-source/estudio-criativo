-- Substitua o UUID de exemplo pelo usuario de teste autorizado antes de executar manualmente.
-- Executar INTEIRO no SQL Editor. Simula identidade SQL; não testa JWT/HTTP.
-- Termina em ROLLBACK: nenhum dado de teste é confirmado.
begin;
set local statement_timeout = '20s';
create temp table studio_probe(user_id uuid,own_org uuid,other_org uuid,own_product uuid,other_product uuid) on commit drop;
insert into studio_probe
select user_id,organization_id,gen_random_uuid(),gen_random_uuid(),gen_random_uuid()
from public.memberships where user_id='00000000-0000-4000-8000-000000000001' and active;
do $$ begin
if (select count(*) from studio_probe) <> 1 then raise exception 'O teste exige exatamente um vínculo ativo.'; end if;
end $$;
insert into public.organizations(id,name) select other_org,'Equipe temporária de verificação' from studio_probe;
insert into public.products(id,organization_id,sku,name)
select own_product,own_org,own_product::text,'Controle temporário próprio' from studio_probe
union all select other_product,other_org,other_product::text,'Controle temporário externo' from studio_probe;
insert into public.product_versions(organization_id,product_id,version,dna)
select own_org,own_product,1,'{}'::jsonb from studio_probe
union all select other_org,other_product,1,'{}'::jsonb from studio_probe;
create temp table studio_probe_results(teste text,aprovado boolean) on commit drop;
grant select on studio_probe to authenticated;
grant select,insert on studio_probe_results to authenticated;
select set_config('request.jwt.claim.sub',user_id::text,true) from studio_probe;
select set_config('request.jwt.claims',json_build_object('sub',user_id,'role','authenticated')::text,true) from studio_probe;
set local role authenticated;
do $$
declare f record; blocked boolean;
begin
if current_user <> 'authenticated' then raise exception 'Papel incorreto'; end if;
select * into strict f from studio_probe;
insert into studio_probe_results values
('Lê produto e versão da própria equipe',
 exists(select 1 from public.products where id=f.own_product)
 and exists(select 1 from public.product_versions where product_id=f.own_product)),
('Não lê produto ou versão da outra equipe',
 not exists(select 1 from public.products where id=f.other_product)
 and not exists(select 1 from public.product_versions where product_id=f.other_product)),
('Não lê a outra equipe',not exists(select 1 from public.organizations where id=f.other_org));
blocked := false;
begin
 perform public.create_catalog_product(gen_random_uuid(),f.other_org,
 '{"schema_version":"entry-1","name":"Teste","sku":"probe","category":"Teste","height":"1","width":"1","depth":"1","unit":"cm","kind":"Produto simples","materials":"Teste","colors":"Teste","fixed":"","variable":"","components":""}'::jsonb);
exception when insufficient_privilege then blocked := true;
end;
insert into studio_probe_results values ('Não salva pela função em outra equipe',blocked);
blocked := false;
begin
 update public.products set name='Tentativa temporária' where id=f.other_product;
exception when insufficient_privilege then blocked := true;
end;
insert into studio_probe_results values ('Não altera produtos diretamente',blocked);
if exists(select 1 from studio_probe_results where not aprovado) then
 raise exception 'Falha de isolamento. Transação abortada; informar ao desenvolvedor.';
end if;
end $$;
reset role;
select teste,aprovado from studio_probe_results order by teste;
rollback;
