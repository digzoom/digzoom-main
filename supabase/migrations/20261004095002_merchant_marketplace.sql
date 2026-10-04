-- Private merchant identities never join the public catalog.
alter table public.partner_applications add column if not exists user_id uuid references auth.users(id);
alter table public.partner_applications add column if not exists terms_version text;
create table public.merchants (
 id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id),
 application_id bigint unique references public.partner_applications(id), name text not null,
 email text not null, status text not null default 'active' check(status in ('active','suspended')),
 referral_code text not null unique default encode(extensions.gen_random_bytes(18),'hex'),
 created_at timestamptz not null default now()
);
create table public.merchant_offers (
 id uuid primary key default gen_random_uuid(), merchant_id uuid not null references public.merchants(id),
 title text not null, description text not null, price_sar integer not null check(price_sar between 1 and 100000),
 image_url text not null, preview_url text not null, fulfillment_method text not null,
 rights_confirmed boolean not null check(rights_confirmed),
 status text not null default 'review' check(status in ('draft','review','published','rejected')),
 review_note text, product_id integer unique references public.products(id), created_at timestamptz not null default now()
);
create table public.merchant_settings (
 id boolean primary key default true check(id), minimum_payout_cents integer not null default 100000 check(minimum_payout_cents>=10000),
 hold_days integer not null default 14 check(hold_days between 7 and 90)
);
insert into public.merchant_settings(id) values(true);
create table public.merchant_settlements (
 id uuid primary key default gen_random_uuid(), merchant_id uuid not null references public.merchants(id),
 gross_cents bigint not null check(gross_cents>0), transfer_fee_cents bigint not null check(transfer_fee_cents>=0),
 paid_cents bigint not null check(paid_cents>0), reference text not null unique, recorded_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(), check(paid_cents = gross_cents-transfer_fee_cents)
);
create table public.merchant_order_items (
 id uuid primary key default gen_random_uuid(), merchant_id uuid not null references public.merchants(id),
 offer_id uuid not null references public.merchant_offers(id), order_id text not null references public.orders(id),
 order_item_id integer not null unique references public.order_items(id), product_title text not null, quantity integer not null,
 source text not null check(source in ('merchant','digzoom')), commission_percent integer not null check(commission_percent in(15,25)),
 gross_cents bigint not null check(gross_cents>=0), stripe_fee_cents bigint check(stripe_fee_cents>=0),
 commission_cents bigint check(commission_cents>=0), merchant_cents bigint check(merchant_cents>=0),
 fee_evidence jsonb, paid_at timestamptz, ready_at timestamptz,
 status text not null default 'pending' check(status in ('pending','fee_pending','ready','held','settled')),
 fulfillment_note text, fulfillment_submitted_at timestamptz, delivered_at timestamptz,
 settlement_id uuid references public.merchant_settlements(id), hold_reason text,
 created_at timestamptz not null default now(), check((source='merchant' and commission_percent=15) or (source='digzoom' and commission_percent=25))
);
create index on public.merchant_offers(merchant_id);
create index on public.merchant_order_items(merchant_id,status);
create index on public.merchant_order_items(order_id);
create index on public.merchant_order_items(offer_id);
create index on public.merchant_order_items(settlement_id);
create index on public.merchant_settlements(merchant_id);
create index on public.partner_applications(user_id);
create index on public.merchants(application_id);
create index on public.merchant_settlements(recorded_by);
-- Browser access is read-only and isolated. All writes use the verified server API.
alter table public.merchants enable row level security;
alter table public.merchant_offers enable row level security;
alter table public.merchant_order_items enable row level security;
alter table public.merchant_settlements enable row level security;
alter table public.merchant_settings enable row level security;
revoke all on public.merchants,public.merchant_offers,public.merchant_order_items,public.merchant_settlements,public.merchant_settings from anon,authenticated;
grant select on public.merchants,public.merchant_offers,public.merchant_order_items,public.merchant_settlements,public.merchant_settings to authenticated;
grant all on public.merchants,public.merchant_offers,public.merchant_order_items,public.merchant_settlements,public.merchant_settings to service_role;
create policy merchant_self on public.merchants for select to authenticated using(user_id=(select auth.uid()));
create policy offers_self on public.merchant_offers for select to authenticated using(merchant_id in(select id from public.merchants where user_id=(select auth.uid())));
create policy items_self on public.merchant_order_items for select to authenticated using(merchant_id in(select id from public.merchants where user_id=(select auth.uid())));
create policy settlements_self on public.merchant_settlements for select to authenticated using(merchant_id in(select id from public.merchants where user_id=(select auth.uid())));
create policy settings_read on public.merchant_settings for select to authenticated using(true);
-- Invoker functions with service-role-only EXECUTE keep multi-row changes atomic.
create function public.approve_merchant_application(p_application bigint) returns uuid language plpgsql set search_path='' as $$
declare a public.partner_applications; m uuid;
begin
 select * into a from public.partner_applications where id=p_application for update;
 if a.id is null or a.user_id is null or a.terms_version is distinct from '2026-10-v1' or a.status<>'new' then raise exception 'A registered, consenting application is required'; end if;
 insert into public.merchants(user_id,application_id,name,email) values(a.user_id,a.id,a.name,a.email) returning id into m;
 update public.partner_applications set status='approved',updated_at=now() where id=a.id;
 return m;
end $$;
create function public.publish_merchant_offer(p_offer uuid,p_category integer) returns integer language plpgsql set search_path='' as $$
declare o public.merchant_offers; p integer;
begin
 select * into o from public.merchant_offers where id=p_offer for update;
 if o.id is null or o.status<>'review' or not exists(select 1 from public.merchants where id=o.merchant_id and status='active') then raise exception 'Offer unavailable for approval'; end if;
 insert into public.products(slug,title,title_ar,description,description_ar,price,category_id,product_type,delivery_type,image_url,rating,reviews_count,is_active,in_stock,features)
 values('dz-'||o.id,o.title,o.title,o.description,o.description,o.price_sar,p_category,'manual_service','manual_delivery',o.image_url,0,0,true,true,'[]') returning id into p;
 update public.merchant_offers set status='published',product_id=p where id=o.id;
 return p;
end $$;
create function public.record_merchant_settlement(p_merchant uuid,p_fee bigint,p_reference text,p_admin uuid,p_expected bigint) returns uuid language plpgsql set search_path='' as $$
declare total bigint; s uuid; cfg public.merchant_settings;
begin
 perform 1 from public.merchants where id=p_merchant and status='active' for update;
 if not found then raise exception 'Inactive merchant'; end if;
 select * into cfg from public.merchant_settings where id=true;
 perform 1 from public.merchant_order_items where merchant_id=p_merchant for update;
 if exists(select 1 from public.merchant_order_items where merchant_id=p_merchant and status='held') then raise exception 'Resolve held orders before settlement'; end if;
 select sum(i.merchant_cents) into total from public.merchant_order_items i join public.orders o on o.id=i.order_id
 where i.merchant_id=p_merchant and i.status='ready' and i.settlement_id is null and i.delivered_at is not null and i.ready_at<=now() and o.status in('paid','processing','completed');
 if total is distinct from p_expected or total is null or total<cfg.minimum_payout_cents or p_fee<0 or p_fee>=total or length(trim(p_reference))<4 then raise exception 'Settlement below minimum or invalid fee/reference'; end if;
 insert into public.merchant_settlements(merchant_id,gross_cents,transfer_fee_cents,paid_cents,reference,recorded_by) values(p_merchant,total,p_fee,total-p_fee,p_reference,p_admin) returning id into s;
 update public.merchant_order_items i set status='settled',settlement_id=s where i.merchant_id=p_merchant and i.status='ready' and i.delivered_at is not null and i.ready_at<=now() and exists(select 1 from public.orders o where o.id=i.order_id and o.status in('paid','processing','completed'));
 return s;
end $$;
revoke all on function public.approve_merchant_application(bigint),public.publish_merchant_offer(uuid,integer),public.record_merchant_settlement(uuid,bigint,text,uuid,bigint) from public,anon,authenticated;
grant execute on function public.approve_merchant_application(bigint),public.publish_merchant_offer(uuid,integer),public.record_merchant_settlement(uuid,bigint,text,uuid,bigint) to service_role;
