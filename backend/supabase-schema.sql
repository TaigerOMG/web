-- LacostaHaus backend inicial para inmuebles online.
-- Antes de ejecutar, sustituye TU_EMAIL_ADMIN@DOMINIO.COM por tu email real de acceso.

create table if not exists public.properties (
  id text primary key,
  status text not null default 'draft' check (status in ('draft', 'published')),
  route text,
  image_url text,
  types text[] not null default '{}',
  card_translations jsonb not null default '{}',
  property_data jsonb not null default '{}',
  show_home boolean not null default true,
  home_hero boolean not null default false,
  sort_order integer not null default 100,
  owner_id uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

alter table public.properties enable row level security;

drop policy if exists "Public can read published properties" on public.properties;
create policy "Public can read published properties"
on public.properties
for select
using (status = 'published');

drop policy if exists "Admin can read all properties" on public.properties;
create policy "Admin can read all properties"
on public.properties
for select
using (auth.email() = 'TU_EMAIL_ADMIN@DOMINIO.COM');

drop policy if exists "Admin can insert properties" on public.properties;
create policy "Admin can insert properties"
on public.properties
for insert
with check (auth.email() = 'TU_EMAIL_ADMIN@DOMINIO.COM');

drop policy if exists "Admin can update properties" on public.properties;
create policy "Admin can update properties"
on public.properties
for update
using (auth.email() = 'TU_EMAIL_ADMIN@DOMINIO.COM')
with check (auth.email() = 'TU_EMAIL_ADMIN@DOMINIO.COM');

drop policy if exists "Admin can delete properties" on public.properties;
create policy "Admin can delete properties"
on public.properties
for delete
using (auth.email() = 'TU_EMAIL_ADMIN@DOMINIO.COM');

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read property images" on storage.objects;
create policy "Public can read property images"
on storage.objects
for select
using (bucket_id = 'property-images');

drop policy if exists "Admin can upload property images" on storage.objects;
create policy "Admin can upload property images"
on storage.objects
for insert
with check (
  bucket_id = 'property-images'
  and auth.email() = 'TU_EMAIL_ADMIN@DOMINIO.COM'
);

drop policy if exists "Admin can update property images" on storage.objects;
create policy "Admin can update property images"
on storage.objects
for update
using (
  bucket_id = 'property-images'
  and auth.email() = 'TU_EMAIL_ADMIN@DOMINIO.COM'
)
with check (
  bucket_id = 'property-images'
  and auth.email() = 'TU_EMAIL_ADMIN@DOMINIO.COM'
);

drop policy if exists "Admin can delete property images" on storage.objects;
create policy "Admin can delete property images"
on storage.objects
for delete
using (
  bucket_id = 'property-images'
  and auth.email() = 'TU_EMAIL_ADMIN@DOMINIO.COM'
);
