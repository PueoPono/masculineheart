-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  enrolled boolean not null default false,
  reminder_email_opt_in boolean not null default true,
  reminder_sms_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- LESSONS
create table if not exists public.lessons (
  id text primary key,
  day_number integer not null unique,
  arc text not null,
  title text not null,
  slug text not null unique,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- PROGRESS
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  status text not null default 'locked',
  completed_at timestamptz,
  unlock_at timestamptz,
  journal_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create index if not exists lesson_progress_user_idx on public.lesson_progress(user_id);
create index if not exists lesson_progress_lesson_idx on public.lesson_progress(lesson_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_lesson_progress_updated_at on public.lesson_progress;
create trigger set_lesson_progress_updated_at
before update on public.lesson_progress
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, enrolled)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;

drop policy if exists "users can view own profile" on public.profiles;
create policy "users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "authenticated can read published lessons" on public.lessons;
create policy "authenticated can read published lessons"
on public.lessons
for select
to authenticated
using (is_published = true);

drop policy if exists "users can view own progress" on public.lesson_progress;
create policy "users can view own progress"
on public.lesson_progress
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can insert own progress" on public.lesson_progress;
create policy "users can insert own progress"
on public.lesson_progress
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can update own progress" on public.lesson_progress;
create policy "users can update own progress"
on public.lesson_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into public.lessons (id, day_number, arc, title, slug)
values
  ('day-1', 1, 'Unlock the Heart', 'Welcome to the Heart', 'day-1'),
  ('day-2', 2, 'Unlock the Heart', 'Sadness and Scars', 'day-2'),
  ('day-3', 3, 'Unlock the Heart', 'Anger and Defenses', 'day-3'),
  ('day-4', 4, 'Unlock the Heart', 'Numbing and Disconnection', 'day-4'),
  ('day-5', 5, 'Unlock the Heart', 'Shame and Not-Enoughness', 'day-5'),
  ('day-6', 6, 'Unlock the Heart', 'Regret and Consequence', 'day-6'),
  ('day-7', 7, 'Unlock the Heart', 'Choosing to Feel', 'day-7'),
  ('day-8', 8, 'Language of the Heart', 'Entering the Story', 'day-8'),
  ('day-9', 9, 'Language of the Heart', 'The Cage and the False Self', 'day-9'),
  ('day-10', 10, 'Language of the Heart', 'Non-Judgement and Inner Gold', 'day-10'),
  ('day-11', 11, 'Language of the Heart', 'Breath and State Change', 'day-11'),
  ('day-12', 12, 'Language of the Heart', 'Tending the Inner Garden', 'day-12'),
  ('day-13', 13, 'Language of the Heart', 'The Earth and the Masculine Heart', 'day-13'),
  ('day-14', 14, 'Language of the Heart', 'Identity, Shadow, and the Rest of the Story', 'day-14'),
  ('day-15', 15, 'Intentions Worth Planting', 'Intention as Practice', 'day-15'),
  ('day-16', 16, 'Intentions Worth Planting', 'Be Kind', 'day-16'),
  ('day-17', 17, 'Intentions Worth Planting', 'Be Beauty', 'day-17'),
  ('day-18', 18, 'Intentions Worth Planting', 'Be Love', 'day-18'),
  ('day-19', 19, 'Intentions Worth Planting', 'Be Abundance', 'day-19'),
  ('day-20', 20, 'Intentions Worth Planting', 'Be Receptive', 'day-20'),
  ('day-21', 21, 'Intentions Worth Planting', 'Be Ever-Expansive', 'day-21')
on conflict (id) do nothing;
