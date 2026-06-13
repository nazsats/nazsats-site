-- Nazsats blog schema.
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  description text not null default '',
  body        text not null default '',
  author      text not null default 'Nazsats',
  tags        text[] not null default '{}',
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Keep updated_at fresh on every change.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Row Level Security: locked down by default.
-- Public reads go through the SERVICE ROLE key on the server (which bypasses
-- RLS), and all admin writes are gated behind login in the app. So we enable
-- RLS with no public policies — the anon key can't read or write directly.
alter table public.posts enable row level security;
