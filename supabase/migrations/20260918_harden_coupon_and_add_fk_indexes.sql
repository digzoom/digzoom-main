revoke execute on function public.validate_coupon(text, integer) from public, anon, authenticated;
grant execute on function public.validate_coupon(text, integer) to service_role;

drop policy if exists profiles_update_own on public.profiles;

create index if not exists coupons_created_by_idx on public.coupons(created_by);
create index if not exists order_status_history_changed_by_idx on public.order_status_history(changed_by);
create index if not exists orders_coupon_id_idx on public.orders(coupon_id);
create index if not exists products_added_by_idx on public.products(added_by);
create index if not exists products_created_by_idx on public.products(created_by);
create index if not exists products_updated_by_idx on public.products(updated_by);
create index if not exists store_settings_updated_by_idx on public.store_settings(updated_by);
create index if not exists user_roles_granted_by_idx on public.user_roles(granted_by);
