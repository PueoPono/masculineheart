alter table public.profiles
  add column if not exists time_zone text,
  add column if not exists time_zone_confirmed boolean not null default false;
