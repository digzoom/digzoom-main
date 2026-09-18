create table if not exists public.growth_audit_requests (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text not null,
  company text,
  website text,
  business_type text not null,
  goal text not null check (goal in ('sales','leads','launch','visibility','conversion')),
  budget text not null check (budget in ('under-5k','5k-15k','15k-50k','50k-plus','unsure')),
  challenge text,
  status text not null default 'new' check (status in ('new','reviewed','contacted','proposal','won','lost')),
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.growth_audit_requests enable row level security;
revoke all on table public.growth_audit_requests from anon, authenticated;
revoke all on sequence public.growth_audit_requests_id_seq from anon, authenticated;
create index if not exists growth_audit_requests_status_created_idx on public.growth_audit_requests(status, created_at desc);
create index if not exists growth_audit_requests_ip_created_idx on public.growth_audit_requests(ip_address, created_at desc);
