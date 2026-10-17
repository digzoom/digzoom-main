create table if not exists public.freebie_leads (
  id bigint generated always as identity primary key,
  email text not null check (length(email) <= 254),
  phone text not null check (length(phone) <= 30),
  freebie_id text not null check (freebie_id in ('social-square', 'story-background', 'offer-card', 'marketing-checklist')),
  marketing_consent boolean not null default false,
  consent_at timestamptz,
  source text not null default 'freebies' check (length(source) <= 100),
  ip_hash text,
  created_at timestamptz not null default now(),
  constraint freebie_leads_consent_consistent check (marketing_consent = (consent_at is not null))
);

alter table public.freebie_leads enable row level security;
revoke all on table public.freebie_leads from anon, authenticated;
grant select, insert on table public.freebie_leads to service_role;
revoke all on sequence public.freebie_leads_id_seq from anon, authenticated;
grant usage, select on sequence public.freebie_leads_id_seq to service_role;
create index if not exists freebie_leads_email_created_idx on public.freebie_leads (email, created_at desc);
create index if not exists freebie_leads_ip_created_idx on public.freebie_leads (ip_hash, created_at desc);
