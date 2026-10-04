create or replace function public.publish_merchant_offer(p_offer uuid,p_category integer) returns integer language plpgsql set search_path='' as $$
declare o public.merchant_offers; p integer;
begin
 select * into o from public.merchant_offers where id=p_offer for update;
 if o.id is null or o.status<>'review' or not exists(select 1 from public.merchants where id=o.merchant_id and status='active') then raise exception 'Offer unavailable for approval'; end if;
 insert into public.products(slug,title,title_ar,description,description_ar,price,category_id,product_type,delivery_type,image_url,rating,reviews_count,is_active,in_stock,features)
 values('dz-'||o.id,o.title,o.title,o.description||E'\n\nطريقة ومدة التسليم: '||o.fulfillment_method,o.description||E'\n\nطريقة ومدة التسليم: '||o.fulfillment_method,o.price_sar,p_category,'manual_service','manual_delivery',o.image_url,0,0,true,true,'[]') returning id into p;
 update public.merchant_offers set status='published',product_id=p where id=o.id;
 return p;
end $$;

create function public.hold_refunded_merchant_orders() returns trigger language plpgsql set search_path='' as $$
begin
 if new.status='refunded' and old.status is distinct from new.status then
   update public.merchant_order_items set status='held',hold_reason='Order marked refunded; manual reconciliation required' where order_id=new.id;
 end if;
 return new;
end $$;
revoke all on function public.hold_refunded_merchant_orders() from public,anon,authenticated;
create trigger hold_refunded_merchant_orders after update of status on public.orders for each row execute function public.hold_refunded_merchant_orders();
