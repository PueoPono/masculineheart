create extension if not exists pgcrypto;

create table if not exists lead_magnets (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  delivery_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists lead_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  source_page text,
  lead_magnet_slug text not null references lead_magnets(slug) on update cascade,
  tags jsonb not null default '[]'::jsonb,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create unique index if not exists lead_submissions_email_slug_idx
  on lead_submissions (lower(email), lead_magnet_slug);

create table if not exists email_sequences (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists email_sequence_steps (
  id uuid primary key default gen_random_uuid(),
  sequence_slug text not null references email_sequences(slug) on update cascade,
  step_index integer not null,
  delay_hours integer not null default 0,
  subject text not null,
  body_markdown text not null,
  created_at timestamptz not null default now(),
  unique(sequence_slug, step_index)
);

create table if not exists email_sequence_enrollments (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  lead_submission_id uuid references lead_submissions(id) on delete set null,
  sequence_slug text not null references email_sequences(slug) on update cascade,
  current_step integer not null default 0,
  status text not null default 'active',
  next_send_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists email_sequence_enrollments_email_sequence_idx
  on email_sequence_enrollments (lower(email), sequence_slug);

create table if not exists outbound_emails (
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
  related_enrollment_id uuid references email_sequence_enrollments(id) on delete set null,
  status text not null default 'queued',
  scheduled_for timestamptz not null default now(),
  sent_at timestamptz,
  provider_message_id text,
  error_text text,
  created_at timestamptz not null default now()
);

insert into lead_magnets (slug, title, description, delivery_url)
values (
  'guided-meditation',
  'Free Guided Meditation',
  'A calming guided meditation for steadiness, heart, and inner return.',
  'https://pueopono.github.io/paul-homepage/meditation-thank-you.html'
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  delivery_url = excluded.delivery_url,
  active = true;

insert into email_sequences (slug, title, description)
values (
  'guided-meditation-nurture',
  'Guided Meditation Nurture',
  'Follow-up sequence after meditation opt-in.'
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  active = true;

insert into email_sequence_steps (sequence_slug, step_index, delay_hours, subject, body_markdown)
values
  ('guided-meditation-nurture', 1, 0, 'Here is your guided meditation', 'Hi {{first_name|there}},\n\nHere is your guided meditation:\n\nhttps://pueopono.github.io/paul-homepage/meditation-thank-you.html\n\nGive yourself real quiet space when you listen. Let it be an actual pause, not background audio.\n\nWarmly,\nPaul'),
  ('guided-meditation-nurture', 2, 24, 'How to get more from this meditation', 'Hi {{first_name|there}},\n\nA good way to use this meditation is at moments of pressure, transition, or internal noise. Repetition matters. The same meditation often deepens after a few listens.\n\nYou can return to it in the morning, after a difficult interaction, or before sleep.\n\nWarmly,\nPaul'),
  ('guided-meditation-nurture', 3, 72, 'A reflection to bring with the meditation', 'Hi {{first_name|there}},\n\nAs you work with the meditation, notice three things: what softens, what resists, and what becomes more honest.\n\nThat is often where the real work begins.\n\nWarmly,\nPaul'),
  ('guided-meditation-nurture', 4, 120, 'If you want to go deeper', 'Hi {{first_name|there}},\n\nIf this meditation resonates and you feel ready to go deeper, the next step may be more direct support.\n\nYou can explore the coaching site here:\nhttps://pueopono.github.io/paul-homepage/\n\nWarmly,\nPaul')
on conflict (sequence_slug, step_index) do update set
  delay_hours = excluded.delay_hours,
  subject = excluded.subject,
  body_markdown = excluded.body_markdown;
