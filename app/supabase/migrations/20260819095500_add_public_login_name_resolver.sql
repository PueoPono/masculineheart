create or replace function public.resolve_login_profile(login_name text)
returns table (
  email text,
  full_name text
)
language sql
security definer
set search_path = public
as $$
  select p.email, p.full_name
  from public.profiles p
  where p.enrolled = true
    and lower(coalesce(p.full_name, '')) = lower(trim(login_name))
  order by p.created_at asc
  limit 2;
$$;

revoke all on function public.resolve_login_profile(text) from public;
grant execute on function public.resolve_login_profile(text) to anon;
grant execute on function public.resolve_login_profile(text) to authenticated;
