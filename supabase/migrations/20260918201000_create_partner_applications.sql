create table if not exists public.partner_applications (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text not null,
  brand text,
  product_type text not null,
  preview_url text not null,
  suggested_price numeric(12,2) check (suggested_price is null or suggested_price between 0 and 100000),
  description text not null,
  rights_confirmed boolean not null check (rights_confirmed = true),
  status text not null default 'new' check (status in ('new','reviewing','approved','rejected','onboarding')),
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.partner_applications enable row level security;
revoke all on table public.partner_applications from anon, authenticated;
revoke all on sequence public.partner_applications_id_seq from anon, authenticated;
create index if not exists partner_applications_status_created_idx on public.partner_applications(status, created_at desc);
create index if not exists partner_applications_ip_created_idx on public.partner_applications(ip_address, created_at desc);
