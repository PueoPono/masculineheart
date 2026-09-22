create extension if not exists pg_cron;
create extension if not exists pg_net;

alter table if exists public.outbound_emails
  add column if not exists provider text,
  add column if not exists attempt_count integer not null default 0,
  add column if not exists last_attempt_at timestamptz;

create index if not exists outbound_emails_status_schedule_idx
  on public.outbound_emails (status, scheduled_for);

create index if not exists email_sequence_enrollments_due_idx
  on public.email_sequence_enrollments (status, next_send_at);
