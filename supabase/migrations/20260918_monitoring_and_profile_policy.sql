create table if not exists public.client_error_logs (
  id bigint generated always as identity primary key,
  message text not null,
  source text,
  stack text,
  page_url text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.client_error_logs enable row level security;
revoke all on table public.client_error_logs from anon, authenticated;
revoke all on sequence public.client_error_logs_id_seq from anon, authenticated;

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create index if not exists client_error_logs_created_at_idx
on public.client_error_logs (created_at desc);
