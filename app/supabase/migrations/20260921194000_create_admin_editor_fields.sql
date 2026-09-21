create table if not exists public.admin_editor_fields (
  id uuid primary key default gen_random_uuid(),
  project text not null,
  page_slug text not null,
  page_label text not null,
  page_path text not null,
  field_key text not null,
  field_label text not null,
  field_kind text not null default 'textarea',
  text_value text not null default '',
  reference_value text not null default '',
  status text not null default 'draft',
  action_archive jsonb not null default '[]'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project, page_slug, field_key)
);

create index if not exists admin_editor_fields_project_idx on public.admin_editor_fields(project);
create index if not exists admin_editor_fields_status_idx on public.admin_editor_fields(status);

alter table public.admin_editor_fields enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_editor_fields'
      and policyname = 'Service role manages admin editor fields'
  ) then
    create policy "Service role manages admin editor fields"
      on public.admin_editor_fields
      for all
      using (auth.role() = 'service_role')
      with check (auth.role() = 'service_role');
  end if;
end $$;
