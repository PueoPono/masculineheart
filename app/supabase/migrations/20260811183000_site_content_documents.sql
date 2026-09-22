-- Supabase-backed editor content persistence for Masculine Heart Quest.
-- Public-facing routes read content overrides only.
-- Admin routes read and write both content overrides and reference notes through the service role.

create table if not exists public.site_content_documents (
  id text primary key,
  content_overrides jsonb not null default '{}'::jsonb,
  reference_notes jsonb not null default '{}'::jsonb,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_content_documents enable row level security;

insert into public.site_content_documents (id)
values ('main')
on conflict (id) do nothing;
