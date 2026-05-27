-- ============================================================
-- DigZoom Phase A: Complete Database Schema v2
-- Run this in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. ENUMS
-- ============================================================

create type order_status as enum (
  'pending', 'paid', 'processing', 'completed', 'refunded', 'cancelled'
);

create type user_role as enum ('user', 'admin', 'support');

create type product_type as enum (
  'digital_download', 'code_delivery', 'subscription_account', 'smm_service', 'manual_service'
);

create type delivery_type as enum (
  'instant_download', 'auto_code', 'account_credentials', 'api_webhook', 'manual_delivery'
);

create type audit_action as enum (
  'product_created', 'product_updated', 'product_price_changed', 'product_stock_changed',
  'product_toggled_stock', 'product_toggled_active', 'product_deleted',
  'order_status_changed', 'order_refunded',
  'coupon_created', 'coupon_updated', 'coupon_deleted',
  'user_role_changed', 'user_blocked'
);

-- ============================================================
-- 2. CORE TABLES
-- ============================================================

-- 2.1 Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  phone text,
  role user_role default 'user',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on column profiles.role is 'Primary role: user, admin, or support. Checked by RLS and middleware.';
comment on column profiles.is_active is 'If false, user cannot login or access any resource';

-- 2.2 User Roles (expandable roles)
create table public.user_roles (
  id serial primary key,
  user_id uuid references auth.users on delete cascade not null,
  role user_role not null,
  granted_by uuid references auth.users,
  granted_at timestamptz default now(),
  revoked_at timestamptz,
  is_active boolean default true,
  unique(user_id, role)
);
comment on table user_roles is 'Expandable roles. A user can have multiple roles. RLS checks both profiles.role and user_roles.';

-- 2.3 Categories
create table public.categories (
  id serial primary key,
  slug text unique not null,
  name_ar text not null,
  name_en text not null,
  icon text default 'Package',
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2.4 Products (v2 with types)
create table public.products (
  id serial primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  long_description text,
  price int not null check (price >= 0),
  original_price int check (original_price is null or original_price >= price),
  category_id int references categories(id),
  product_type product_type not null default 'digital_download',
  delivery_type delivery_type not null default 'instant_download',
  image_url text not null,
  file_type text default 'ZIP',
  file_size text default '10 MB',
  features jsonb default '[]',
  rating numeric(3,2) default 5.0 check (rating >= 0 and rating <= 5),
  reviews_count int default 0 check (reviews_count >= 0),
  in_stock boolean default true,
  stock_quantity int default null,
  is_active boolean default true,
  is_featured boolean default false,
  is_trending boolean default false,
  requires_customer_input boolean default false,
  customer_input_schema jsonb default '{}',
  delivery_config jsonb default '{}',
  download_url text,
  storage_path text,
  created_by uuid references auth.users,
  updated_by uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on column products.stock_quantity is 'For limited items. NULL = unlimited (digital files)';
comment on column products.customer_input_schema is 'JSON schema for customer inputs before checkout';
comment on column products.delivery_config is 'Type-specific config (codes, API, manual instructions)';

-- 2.5 Coupons
create table public.coupons (
  id serial primary key,
  code text unique not null,
  discount_percent int not null check (discount_percent between 1 and 100),
  max_uses int,
  used_count int default 0 check (used_count >= 0),
  valid_from timestamptz default now(),
  valid_until timestamptz,
  is_active boolean default true,
  is_public boolean default false,
  min_order_amount int default 0,
  applicable_categories int[] default '{}',
  created_by uuid references auth.users,
  created_at timestamptz default now()
);

-- 2.6 Orders
create table public.orders (
  id text primary key,
  user_id uuid references auth.users,
  status order_status default 'pending',
  total_amount int not null check (total_amount >= 0),
  tax_amount int not null check (tax_amount >= 0),
  subtotal int not null check (subtotal >= 0),
  discount_amount int default 0,
  payment_method text default 'pending',
  payment_reference text,
  payment_payload jsonb default '{}',
  paid_at timestamptz,
  coupon_id int references coupons(id),
  coupon_code text,
  coupon_discount int default 0,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  customer_input jsonb default '{}',
  customer_notes text,
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2.7 Order Items
create table public.order_items (
  id serial primary key,
  order_id text references orders(id) on delete cascade,
  product_id int references products(id),
  quantity int not null default 1 check (quantity > 0),
  price_at_time int not null check (price_at_time >= 0),
  product_title text not null,
  product_type product_type not null,
  delivery_status text default 'pending',
  delivered_at timestamptz,
  delivery_payload jsonb default '{}',
  download_count int default 0 check (download_count >= 0),
  max_downloads int default 5,
  created_at timestamptz default now()
);

-- 2.8 Order Status History
create table public.order_status_history (
  id serial primary key,
  order_id text references orders(id) on delete cascade,
  status order_status not null,
  changed_by uuid references auth.users,
  reason text,
  created_at timestamptz default now()
);

-- 2.9 Download Logs
create table public.download_logs (
  id serial primary key,
  order_item_id int references order_items(id),
  user_id uuid references auth.users,
  ip_address inet,
  user_agent text,
  downloaded_at timestamptz default now()
);

-- 2.10 Admin Audit Logs
create table public.admin_audit_logs (
  id serial primary key,
  admin_id uuid references auth.users not null,
  action audit_action not null,
  entity_type text not null,
  entity_id text not null,
  old_values jsonb default '{}',
  new_values jsonb default '{}',
  reason text,
  ip_address inet,
  created_at timestamptz default now()
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

create index idx_products_category on products(category_id);
create index idx_products_type on products(product_type);
create index idx_products_delivery on products(delivery_type);
create index idx_products_featured on products(is_featured) where is_featured = true;
create index idx_products_trending on products(is_trending) where is_trending = true;
create index idx_products_active on products(is_active) where is_active = true;
create index idx_products_slug on products(slug);

create index idx_orders_user on orders(user_id);
create index idx_orders_status on orders(status);
create index idx_orders_created on orders(created_at desc);
create index idx_orders_payment_ref on orders(payment_reference) where payment_reference is not null;

create index idx_order_items_order on order_items(order_id);
create index idx_order_items_product on order_items(product_id);
create index idx_order_items_delivery on order_items(delivery_status);

create index idx_coupons_code on coupons(code);
create index idx_coupons_active on coupons(is_active) where is_active = true;

create index idx_status_history_order on order_status_history(order_id);
create index idx_downloads_order_item on download_logs(order_item_id);
create index idx_downloads_user on download_logs(user_id);
create index idx_audit_admin on admin_audit_logs(admin_id);
create index idx_audit_action on admin_audit_logs(action);
create index idx_audit_entity on admin_audit_logs(entity_type, entity_id);
create index idx_audit_created on admin_audit_logs(created_at desc);

-- Full-text search indexes
create index idx_products_search_ar on products 
  using gin(to_tsvector('arabic', coalesce(title, '') || ' ' || coalesce(description, '')));
create index idx_products_search_simple on products 
  using gin(to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, '')));

-- ============================================================
-- 4. HELPER FUNCTIONS
-- ============================================================

-- 4.1 is_admin: checks both profiles.role and user_roles
create or replace function public.is_admin(p_user_id uuid default auth.uid())
returns boolean as $$
begin
  if exists (
    select 1 from profiles
    where id = p_user_id and role = 'admin' and is_active = true
  ) then return true; end if;

  if exists (
    select 1 from user_roles
    where user_id = p_user_id and role = 'admin' and is_active = true
  ) then return true; end if;

  return false;
end;
$$ language plpgsql security definer;

-- 4.2 has_role: check any role
create or replace function public.has_role(p_user_id uuid, p_role user_role)
returns boolean as $$
begin
  if exists (
    select 1 from profiles
    where id = p_user_id and role = p_role and is_active = true
  ) then return true; end if;

  if exists (
    select 1 from user_roles
    where user_id = p_user_id and role = p_role and is_active = true
  ) then return true; end if;

  return false;
end;
$$ language plpgsql security definer;

-- 4.3 is_support: support or admin
create or replace function public.is_support_or_admin(p_user_id uuid default auth.uid())
returns boolean as $$
begin
  if is_admin(p_user_id) then return true; end if;

  if exists (
    select 1 from profiles
    where id = p_user_id and role = 'support' and is_active = true
  ) then return true; end if;

  if exists (
    select 1 from user_roles
    where user_id = p_user_id and role = 'support' and is_active = true
  ) then return true; end if;

  return false;
end;
$$ language plpgsql security definer;

-- 4.4 set_updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_products_updated_at before update on products
  for each row execute function set_updated_at();
create trigger set_orders_updated_at before update on orders
  for each row execute function set_updated_at();
create trigger set_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger set_coupons_updated_at before update on coupons
  for each row execute function set_updated_at();

-- 4.5 Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4.6 Log order status change
create or replace function public.log_order_status_change()
returns trigger as $$
begin
  if old.status is distinct from new.status then
    insert into order_status_history (order_id, status, changed_by, reason)
    values (new.id, new.status, auth.uid(), coalesce(new.admin_notes, 'Status updated'));
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_order_status_change
  before update on orders
  for each row execute function public.log_order_status_change();

-- 4.7 Search products
create or replace function public.search_products(
  search_query text,
  p_category_id int default null,
  p_product_type product_type default null
)
returns setof products as $$
begin
  return query
  select *
  from products
  where is_active = true
  and (
    to_tsvector('arabic', coalesce(title, '') || ' ' || coalesce(description, ''))
      @@ plainto_tsquery('arabic', search_query)
    or to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''))
      @@ plainto_tsquery('simple', search_query)
    or title ilike '%' || search_query || '%'
    or description ilike '%' || search_query || '%'
  )
  and (p_category_id is null or category_id = p_category_id)
  and (p_product_type is null or product_type = p_product_type)
  order by
    case when title ilike '%' || search_query || '%' then 0 else 1 end,
    rating desc,
    reviews_count desc;
end;
$$ language plpgsql stable;

-- 4.8 Validate coupon (secure RPC - no direct table access)
create or replace function public.validate_coupon(
  p_code text,
  p_order_amount int default 0
)
returns table (
  valid boolean,
  coupon_id int,
  discount_percent int,
  message text
) as $$
declare
  v_coupon record;
begin
  select * into v_coupon from coupons
  where code = p_code and is_active = true
  and (valid_from is null or valid_from <= now())
  and (valid_until is null or valid_until >= now())
  for update skip locked;

  if v_coupon is null then
    return query select false, null::int, null::int, 'Coupon not found or expired'::text;
    return;
  end if;

  if v_coupon.max_uses is not null and v_coupon.used_count >= v_coupon.max_uses then
    return query select false, v_coupon.id, v_coupon.discount_percent, 'Coupon usage limit reached'::text;
    return;
  end if;

  if v_coupon.min_order_amount > 0 and p_order_amount < v_coupon.min_order_amount then
    return query select false, v_coupon.id, v_coupon.discount_percent,
      'Minimum order amount is ' || v_coupon.min_order_amount::text;
    return;
  end if;

  return query select true, v_coupon.id, v_coupon.discount_percent, 'Valid'::text;
end;
$$ language plpgsql security definer;

-- 4.9 Log audit (for admin actions)
create or replace function public.log_audit(
  p_action audit_action,
  p_entity_type text,
  p_entity_id text,
  p_old_values jsonb default '{}',
  p_new_values jsonb default '{}',
  p_reason text default null
)
returns void as $$
begin
  if is_admin() then
    insert into admin_audit_logs (admin_id, action, entity_type, entity_id, old_values, new_values, reason, ip_address)
    values (auth.uid(), p_action, p_entity_type, p_entity_id, p_old_values, p_new_values, p_reason, inet_client_addr());
  end if;
end;
$$ language plpgsql security definer;

-- ============================================================
-- 5. ENABLE RLS
-- ============================================================

alter table profiles enable row level security;
alter table user_roles enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;
alter table coupons enable row level security;
alter table download_logs enable row level security;
alter table admin_audit_logs enable row level security;

-- ============================================================
-- 6. RLS POLICIES
-- ============================================================

-- 6.1 Profiles
-- Visitor: no access (must login)
-- User: read own, update own
-- Support: read all (for customer support)
-- Admin: full access
create policy "profiles_select_own_or_admin" on profiles
  for select to authenticated
  using (id = auth.uid() or is_admin(auth.uid()) or is_support_or_admin(auth.uid()));

create policy "profiles_update_own" on profiles
  for update to authenticated
  using (id = auth.uid());

create policy "profiles_admin_all" on profiles
  for all to authenticated
  using (is_admin(auth.uid()));

-- 6.2 User Roles
-- Admin only
create policy "user_roles_admin_only" on user_roles
  for all to authenticated
  using (is_admin(auth.uid()));

-- 6.3 Categories
-- Visitor + User + Support + Admin: read active
create policy "categories_select_active" on categories
  for select to anon, authenticated
  using (is_active = true);

create policy "categories_admin_all" on categories
  for all to authenticated
  using (is_admin(auth.uid()));

-- 6.4 Products
-- Visitor + User + Support + Admin: read active
create policy "products_select_active" on products
  for select to anon, authenticated
  using (is_active = true);

create policy "products_admin_all" on products
  for all to authenticated
  using (is_admin(auth.uid()));

-- 6.5 Orders
-- User: own orders only
-- Support + Admin: all orders
create policy "orders_select_own" on orders
  for select to authenticated
  using (user_id = auth.uid());

create policy "orders_select_admin_support" on orders
  for select to authenticated
  using (is_support_or_admin(auth.uid()));

create policy "orders_insert_authed" on orders
  for insert to authenticated
  with check (user_id = auth.uid() or user_id is null);

create policy "orders_update_admin" on orders
  for update to authenticated
  using (is_admin(auth.uid()));

-- 6.6 Order Items
create policy "order_items_select_own" on order_items
  for select to authenticated
  using (exists (
    select 1 from orders where orders.id = order_items.order_id
    and (orders.user_id = auth.uid() or is_support_or_admin(auth.uid()))
  ));

create policy "order_items_admin" on order_items
  for all to authenticated
  using (is_admin(auth.uid()));

-- 6.7 Coupons - PROTECTED (no direct select for non-admins)
-- Admin only for CRUD
create policy "coupons_admin_all" on coupons
  for all to authenticated
  using (is_admin(auth.uid()));

-- 6.8 Order Status History
create policy "status_history_select_own" on order_status_history
  for select to authenticated
  using (exists (
    select 1 from orders where orders.id = order_status_history.order_id
    and (orders.user_id = auth.uid() or is_support_or_admin(auth.uid()))
  ));

create policy "status_history_admin" on order_status_history
  for all to authenticated
  using (is_admin(auth.uid()));

-- 6.9 Download Logs - Admin only
create policy "download_logs_admin" on download_logs
  for all to authenticated
  using (is_admin(auth.uid()));

-- 6.10 Admin Audit Logs - Admin only
create policy "audit_logs_admin_only" on admin_audit_logs
  for all to authenticated
  using (is_admin(auth.uid()));

-- ============================================================
-- 7. SEED DATA
-- ============================================================

-- Insert categories
insert into categories (slug, name_ar, name_en, icon, sort_order) values
  ('graphics', 'جرافيكس', 'Graphics', 'Palette', 1),
  ('fonts', 'خطوط', 'Fonts', 'Type', 2),
  ('templates', 'قوالب', 'Templates', 'Layout', 3),
  ('videos', 'فيديوهات', 'Videos', 'Video', 4),
  ('pdf', 'كتب إلكترونية', 'E-Books', 'BookOpen', 5),
  ('audio', 'صوتيات', 'Audio', 'Headphones', 6),
  ('code', 'أكواد', 'Code', 'Code', 7),
  ('web', 'تصميم ويب', 'Web Design', 'Globe', 8),
  ('3d', 'نماذج 3D', '3D Models', 'Box', 9),
  ('photos', 'صور', 'Photos', 'Camera', 10);

-- ============================================================
-- DONE! Run \dt to verify all tables.
-- ============================================================
