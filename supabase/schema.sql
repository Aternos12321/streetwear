-- Run this whole file once in Supabase > SQL Editor.
create table if not exists public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
create or replace function public.is_admin() returns boolean language sql security definer stable set search_path=public as
$$ select exists(select 1 from public.admin_users where user_id = auth.uid()) $$;
alter table public.admin_users enable row level security;
drop policy if exists "read own admin row" on public.admin_users;
create policy "read own admin row" on public.admin_users for select using (user_id = auth.uid());

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null, brand text not null default '',
  category text not null default 'other' check (category in ('shoes','clothing','accessories','other')),
  price numeric(10,2) not null check (price >= 0),
  original_price numeric(10,2),
  description text not null default '',
  images text[] not null default '{}',
  sizes jsonb not null default '{}'::jsonb,
  colors text[] not null default '{}',
  is_new boolean not null default false, is_featured boolean not null default false,
  is_best_seller boolean not null default false, sold_out boolean not null default false,
  published boolean not null default false, popularity int not null default 0,
  created_at timestamptz not null default now());
alter table public.products enable row level security;
drop policy if exists "public reads published" on public.products;
drop policy if exists "admin all products" on public.products;
create policy "public reads published" on public.products for select using (published = true or public.is_admin());
create policy "admin all products" on public.products for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  store_name text not null default 'Your Store', instagram_username text not null default '',
  contact_email text not null default '', contact_phone text not null default '', contact_address text not null default '',
  announcement text not null default '', delivery text not null default '', returns text not null default '',
  privacy text not null default '', terms text not null default '', faq text not null default '');
insert into public.settings (id) values (1) on conflict do nothing;
alter table public.settings enable row level security;
drop policy if exists "public reads settings" on public.settings;
drop policy if exists "admin writes settings" on public.settings;
create policy "public reads settings" on public.settings for select using (true);
create policy "admin writes settings" on public.settings for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public) values ('product-images','product-images',true) on conflict do nothing;
drop policy if exists "public reads images" on storage.objects;
drop policy if exists "admin manages images" on storage.objects;
create policy "public reads images" on storage.objects for select using (bucket_id = 'product-images');
create policy "admin manages images" on storage.objects for all using (bucket_id='product-images' and public.is_admin()) with check (bucket_id='product-images' and public.is_admin());
