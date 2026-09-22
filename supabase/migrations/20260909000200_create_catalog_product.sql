-- Preparação local: aplicar somente com autorização específica.
begin;
create function public.create_catalog_product(p_id uuid, p_organization_id uuid, p_dna jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare field text; value text; inserted uuid; existing jsonb;
begin
 -- A identidade vem do JWT verificado, nunca de um parâmetro do cliente.
 perform 1 from public.memberships where organization_id=p_organization_id
 and user_id=(select auth.uid()) and active for share;
 if not found then raise exception 'Membership required' using errcode='42501'; end if;
 if p_id is null or p_dna is null or jsonb_typeof(p_dna) <> 'object' then
 raise exception 'Invalid draft' using errcode='22023'; end if;
 if p_dna->>'schema_version' is distinct from 'entry-1' then
 raise exception 'Invalid schema' using errcode='22023'; end if;
 foreach field in array array['schema_version','name','sku','category','height','width','depth','unit','kind','materials','colors','fixed','variable','components'] loop
   if jsonb_typeof(p_dna->field) is distinct from 'string' then raise exception 'Invalid field' using errcode='22023'; end if;
   value := p_dna->>field;
   if length(value)>(case when field in ('fixed','variable','components') then 2000 when field in ('height','width','depth') then 20 else 160 end)
   or value <> btrim(value) then raise exception 'Invalid length or whitespace' using errcode='22023'; end if;
   if field in ('name','sku','category','materials','colors') and length(value)=0 then raise exception 'Required field' using errcode='22023'; end if;
   if field in ('height','width','depth') then
     if value !~ '^[0-9]+([.][0-9]+)?$' then raise exception 'Invalid measure' using errcode='22023'; end if;
     if value::numeric <= 0 then raise exception 'Invalid measure' using errcode='22023'; end if;
   end if;
 end loop;
 if (select count(*) from jsonb_object_keys(p_dna)) <> 14
 or p_dna->>'unit' not in ('cm','mm','m')
 or p_dna->>'kind' not in ('Produto simples','Kit / conjunto')
 or (p_dna->>'kind'='Kit / conjunto' and p_dna->>'components'='')
 or (p_dna->>'kind'='Produto simples' and p_dna->>'components'<>'') then
 raise exception 'Invalid draft' using errcode='22023'; end if;
 insert into public.products(id,organization_id,sku,name)
 values(p_id,p_organization_id,p_dna->>'sku',p_dna->>'name')
 on conflict(id) do nothing returning id into inserted;
 if inserted is null then
   select dna into existing from public.product_versions
   where organization_id=p_organization_id and product_id=p_id and version=1;
   if existing is distinct from p_dna then raise exception 'Conflicting submission' using errcode='23505'; end if;
 else
   insert into public.product_versions(organization_id,product_id,version,dna)
   values(p_organization_id,p_id,1,p_dna);
 end if;
 return p_id;
end
$$;
revoke all on function public.create_catalog_product(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.create_catalog_product(uuid,uuid,jsonb) to authenticated;
commit;
