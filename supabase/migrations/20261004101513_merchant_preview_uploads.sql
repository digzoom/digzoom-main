create table public.partner_preview_assets (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 name text not null, mime_type text not null, size_bytes bigint not null check(size_bytes between 1 and 26214400),
 storage_path text not null unique, status text not null default 'pending' check(status in('pending','uploaded')),
 created_at timestamptz not null default now()
);
create index on public.partner_preview_assets(user_id,created_at);
alter table public.partner_preview_assets enable row level security;
revoke all on public.partner_preview_assets from anon,authenticated;
grant select on public.partner_preview_assets to authenticated;
grant all on public.partner_preview_assets to service_role;
create policy preview_owner_read on public.partner_preview_assets for select to authenticated using(user_id=(select auth.uid()));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('partner-previews','partner-previews',false,26214400,array['image/jpeg','image/png','image/webp','video/mp4','video/webm','application/pdf','application/zip','application/octet-stream','application/postscript','application/msword','application/vnd.ms-excel','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation']);
-- No browser Storage policies: uploads and previews require narrowly scoped server signatures.
alter table public.partner_applications alter column preview_url drop not null;
alter table public.partner_applications add column preview_asset_ids uuid[] not null default '{}';
alter table public.merchant_offers alter column preview_url drop not null;
alter table public.merchant_offers add column preview_asset_ids uuid[] not null default '{}';
alter table public.merchant_offers add column product_kind text not null default 'other' check(product_kind in('template','book','video','image','course','software','asset','other'));

alter table public.partner_applications add column product_title text;
