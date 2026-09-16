-- Pin lookup paths for privileged functions so objects cannot be shadowed.
alter function public.handle_new_user() set search_path = pg_catalog, public;
alter function public.has_role(uuid, public.user_role) set search_path = pg_catalog, public;
alter function public.is_admin(uuid) set search_path = pg_catalog, public;
alter function public.is_support_or_admin(uuid) set search_path = pg_catalog, public;
alter function public.log_audit(public.audit_action, text, text, jsonb, jsonb, text) set search_path = pg_catalog, public;
alter function public.log_order_status_change() set search_path = pg_catalog, public;
alter function public.validate_coupon(text, integer) set search_path = pg_catalog, public;

-- Trigger/event-trigger helpers are internal implementation details and must
-- not be exposed through the Data API as callable RPC endpoints.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.log_order_status_change() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Authorization helpers are needed by authenticated-user RLS policies only.
revoke execute on function public.has_role(uuid, public.user_role) from public, anon;
revoke execute on function public.is_admin(uuid) from public, anon;
revoke execute on function public.is_support_or_admin(uuid) from public, anon;
revoke execute on function public.log_audit(public.audit_action, text, text, jsonb, jsonb, text) from public, anon;

grant execute on function public.has_role(uuid, public.user_role) to authenticated, service_role;
grant execute on function public.is_admin(uuid) to authenticated, service_role;
grant execute on function public.is_support_or_admin(uuid) to authenticated, service_role;
grant execute on function public.log_audit(public.audit_action, text, text, jsonb, jsonb, text) to authenticated, service_role;

-- Coupon validation intentionally remains callable by guests. It exposes only
-- a validity result and discount metadata, not the coupons table itself.
grant execute on function public.validate_coupon(text, integer) to anon, authenticated, service_role;
