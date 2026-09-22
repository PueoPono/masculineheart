create unique index if not exists email_sequence_enrollments_email_raw_sequence_idx
  on public.email_sequence_enrollments (email, sequence_slug);
