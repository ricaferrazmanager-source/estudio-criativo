-- Estúdio Criativo: preparação local, NÃO aplicada ao Supabase.
begin;
create schema if not exists private;

create table public.organizations (
 id uuid primary key default gen_random_uuid(),
 name text not null check (length(btrim(name)) > 0),
 created_at timestamptz not null default now()
);
create table public.memberships (
 organization_id uuid not null references public.organizations(id),
 user_id uuid not null references auth.users(id),
 role text not null check (role in ('admin','member')),
 active boolean not null default true,
 created_at timestamptz not null default now(),
 primary key (organization_id,user_id)
);
create index memberships_user_org_idx on public.memberships(user_id,organization_id);
create table public.products (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.organizations(id),
 sku text not null check (length(btrim(sku)) > 0),
 name text not null check (length(btrim(name)) > 0),
 created_at timestamptz not null default now(),
 unique (organization_id,sku), unique (organization_id,id)
);
create table public.product_versions (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null,
 product_id uuid not null,
 version integer not null check (version > 0),
 dna jsonb not null default '{}'::jsonb check (jsonb_typeof(dna) = 'object'),
 created_at timestamptz not null default now(),
 foreign key (organization_id,product_id) references public.products(organization_id,id),
 unique (organization_id,product_id,version), unique (organization_id,id)
);
create table public.assets (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.organizations(id),
 product_version_id uuid,
 bucket text not null check (length(btrim(bucket)) > 0),
 object_key text not null check (length(btrim(object_key)) > 0),
 mime_type text not null check (length(btrim(mime_type)) > 0),
 byte_size bigint not null check (byte_size > 0),
 sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
 created_at timestamptz not null default now(),
 foreign key (organization_id,product_version_id) references public.product_versions(organization_id,id),
 unique (bucket,object_key)
);
create index assets_org_version_idx on public.assets(organization_id,product_version_id);

-- Sem parâmetros de identidade: somente o usuário autenticado pelo Supabase.
create function private.user_organization_ids() returns setof uuid
 language sql stable security definer set search_path = '' as $$
 select organization_id from public.memberships
 where user_id = (select auth.uid()) and active
$$;
revoke all on function private.user_organization_ids() from public, anon;
grant usage on schema private to authenticated, service_role;
grant execute on function private.user_organization_ids() to authenticated;

alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.products enable row level security;
alter table public.product_versions enable row level security;
alter table public.assets enable row level security;
create policy organizations_read on public.organizations for select to authenticated
 using (id in (select private.user_organization_ids()));
create policy memberships_read on public.memberships for select to authenticated
 using (user_id = (select auth.uid()) and active);
create policy products_read on public.products for select to authenticated
 using (organization_id in (select private.user_organization_ids()));
create policy product_versions_read on public.product_versions for select to authenticated
 using (organization_id in (select private.user_organization_ids()));
create policy assets_read on public.assets for select to authenticated
 using (organization_id in (select private.user_organization_ids()));

revoke all on public.organizations, public.memberships, public.products,
 public.product_versions, public.assets from public, anon, authenticated, service_role;
grant select on public.organizations, public.memberships, public.products,
 public.product_versions, public.assets to authenticated;
-- Escrita futura somente pelo backend confiável, após autorização por equipe.
grant select, insert, update, delete on public.organizations, public.memberships,
 public.products, public.product_versions, public.assets to service_role;

create function private.reject_snapshot_change() returns trigger
 language plpgsql set search_path = '' as $$
 begin
 raise exception 'Registro imutável: crie uma nova versão.' using errcode = '55000';
 end
$$;
revoke all on function private.reject_snapshot_change() from public, anon, authenticated;
create trigger product_versions_immutable before update or delete on public.product_versions
 for each row execute function private.reject_snapshot_change();
create trigger assets_immutable before update or delete on public.assets
 for each row execute function private.reject_snapshot_change();
commit;
