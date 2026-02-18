-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  category text check (category in ('artist','venue','pr')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Index for faster lookups
create index if not exists idx_profiles_category on public.profiles(category);

-- 3. Enable RLS and add policies
alter table public.profiles enable row level security;

-- Allow authenticated users to select their own profile
create policy profiles_select_own on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

-- Allow authenticated users to insert their own profile (id must match auth.uid())
create policy profiles_insert_own on public.profiles
  for insert
  to authenticated
  with check (id = (select auth.uid()) and category in ('artist','venue','pr'));

-- Allow authenticated users to update their own profile
create policy profiles_update_own on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()) and (category is null or category in ('artist','venue','pr')));

-- Allow authenticated users to delete their own profile if required
create policy profiles_delete_own on public.profiles
  for delete
  to authenticated
  using (id = (select auth.uid()));
