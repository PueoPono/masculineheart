-- Admin password setup/reset storage for Masculine Heart Quest.
-- Stores only salted PBKDF2 password hashes; no plain-text passwords.

create table if not exists public.admin_users (
  email text primary key,
  password_hash text,
  password_salt text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Admin access is server-only through SUPABASE_SERVICE_ROLE_KEY.
-- No browser/client policies are intentionally added.
insert into public.admin_users (email, is_active)
values ('bewildandfree@pm.me', true)
on conflict (email) do update set is_active = true, updated_at = now();
