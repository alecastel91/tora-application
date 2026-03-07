-- Simple waitlist table — no auth required.
-- Run this in your Supabase SQL editor.

create table if not exists public.waitlist (
  id           uuid primary key default gen_random_uuid(),
  role         text,
  full_name    text not null,
  email        text not null,
  city         text,
  portfolio    text,
  created_at   timestamptz default now()
);

-- Allow anyone (anon) to insert — no login required
alter table public.waitlist enable row level security;

create policy "Allow anon insert" on public.waitlist
  for insert to anon with check (true);

-- Prevent public reads (only admins via service_role can view)
create policy "No public select" on public.waitlist
  for select using (false);
