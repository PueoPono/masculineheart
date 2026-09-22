create extension if not exists pgcrypto;

create table if not exists public.lead_magnets (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  delivery_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  source_page text,
  lead_magnet_slug text not null references public.lead_magnets(slug) on update cascade,
  tags jsonb not null default '[]'::jsonb,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create unique index if not exists lead_submissions_email_slug_idx
  on public.lead_submissions (lower(email), lead_magnet_slug);

create table if not exists public.email_sequences (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.email_sequence_steps (
  id uuid primary key default gen_random_uuid(),
  sequence_slug text not null references public.email_sequences(slug) on update cascade,
  step_index integer not null,
  delay_hours integer not null default 0,
  subject text not null,
  body_markdown text not null,
  created_at timestamptz not null default now(),
  unique(sequence_slug, step_index)
);

create table if not exists public.email_sequence_enrollments (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  lead_submission_id uuid references public.lead_submissions(id) on delete set null,
  sequence_slug text not null references public.email_sequences(slug) on update cascade,
  current_step integer not null default 0,
  status text not null default 'active',
  next_send_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists email_sequence_enrollments_email_sequence_idx
  on public.email_sequence_enrollments (lower(email), sequence_slug);

create table if not exists public.outbound_emails (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'one_off',
  to_email text not null,
  to_name text,
  from_email text not null default 'ponopauko@gmail.com',
  from_name text not null default 'Paul Cropper',
  subject text not null,
  body_markdown text not null,
  body_html text,
  body_text text,
  related_sequence_slug text,
  related_enrollment_id uuid references public.email_sequence_enrollments(id) on delete set null,
  status text not null default 'queued',
  scheduled_for timestamptz not null default now(),
  sent_at timestamptz,
  provider_message_id text,
  error_text text,
  created_at timestamptz not null default now()
);
