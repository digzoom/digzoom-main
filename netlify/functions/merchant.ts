import type {Handler} from '@netlify/functions';
import {z} from 'zod';
import {ownedPreviewAssets,PREVIEW_BUCKET} from '../lib/partner-assets';
import {getSupabaseAdmin} from '../lib/supabase-admin';
import {verifySupabaseToken} from '../lib/trpc';
import {signReferral} from '../lib/merchant-accounting';
import {syncMerchantPayment} from '../lib/merchant-ledger';
const db=():any=>getSupabaseAdmin();
const result=(statusCode:number,value:unknown)=>({statusCode,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify(value)});
async function checked(query:any) {const {data,error}=await query;if(error)throw error;return data;}
const url=z.string().url().max(500).refine(v=>v.startsWith('https://'),'HTTPS required');
const offerSchema=z.object({title:z.string().trim().min(3).max(180),description:z.string().trim().min(30).max(4000),price_sar:z.coerce.number().int().min(1).max(100000),image_url:url.optional(),preview_url:url.optional(),preview_asset_ids:z.array(z.uuid()).max(3).default([]),product_kind:z.enum(['template','book','video','image','course','software','asset','other']).default('other'),fulfillment_method:z.string().trim().min(10).max(1000),rights_confirmed:z.literal(true),status:z.enum(['draft','review']).default('review')});
export const handler:Handler=async(event)=>{
 try {
   if(event.httpMethod==='GET' && event.queryStringParameters?.ref) {
     const code=event.queryStringParameters.ref;
     if(!/^[a-f0-9]{36}$/.test(code)||!process.env.STRIPE_SECRET_KEY) return result(404,{error:'الرابط غير متاح'});
     const merchant=await checked(db().from('merchants').select('id').eq('referral_code',code).eq('status','active').maybeSingle());
     if(!merchant)return result(404,{error:'الرابط غير متاح'});
     return {statusCode:302,headers:{Location:'/shop','Cache-Control':'no-store','Set-Cookie':`dz_ref=${signReferral(merchant.id,process.env.STRIPE_SECRET_KEY)}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Lax`},body:''};
   }
   if(!['GET','POST'].includes(event.httpMethod))return result(405,{error:'Method not allowed'});
   const token=(event.headers.authorization||event.headers.Authorization||'').replace(/^Bearer /,'');
   const user=token?await verifySupabaseToken(token):undefined;
   if(!user)return result(401,{error:'سجّل الدخول للمتابعة'});
   const isAdmin=user.role==='admin';
   if(event.httpMethod==='GET') {
     if(event.queryStringParameters?.admin==='true') {
       if(!isAdmin)return result(403,{error:'للإدارة فقط'});
       const [applications,merchants,offers,items,settlements,settings]=await Promise.all([
         checked(db().from('partner_applications').select('id,name,email,brand,product_type,product_title,preview_url,preview_asset_ids,description,status,user_id,terms_version,created_at').order('created_at',{ascending:false}).limit(100)),
         checked(db().from('merchants').select('*').order('created_at',{ascending:false})),
         checked(db().from('merchant_offers').select('*').order('created_at',{ascending:false}).limit(200)),
         checked(db().from('merchant_order_items').select('*').order('created_at',{ascending:false}).limit(500)),
         checked(db().from('merchant_settlements').select('*').order('created_at',{ascending:false}).limit(100)),
         checked(db().from('merchant_settings').select('*').eq('id',true).single())]);
       return result(200,{applications,merchants,offers,items,settlements,settings});
     }
     const merchant=await checked(db().from('merchants').select('*').eq('user_id',user.id).maybeSingle());
     const application=await checked(db().from('partner_applications').select('id,status,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(1).maybeSingle());
     if(!merchant)return result(200,{merchant:null,application});
     const [offers,items,settlements,settings]=await Promise.all([
       checked(db().from('merchant_offers').select('*').eq('merchant_id',merchant.id).order('created_at',{ascending:false}).limit(200)),
       checked(db().from('merchant_order_items').select('id,order_id,product_title,quantity,source,commission_percent,gross_cents,stripe_fee_cents,commission_cents,merchant_cents,status,paid_at,ready_at,fulfillment_note,fulfillment_submitted_at,delivered_at,hold_reason,settlement_id').eq('merchant_id',merchant.id).order('created_at',{ascending:false}).limit(500)),
       checked(db().from('merchant_settlements').select('id,gross_cents,transfer_fee_cents,paid_cents,reference,created_at').eq('merchant_id',merchant.id).order('created_at',{ascending:false}).limit(100)),
       checked(db().from('merchant_settings').select('*').eq('id',true).single())]);
     return result(200,{merchant,application,offers,items,settlements,settings});
   }
   if((event.body?.length||0)>15000)return result(413,{error:'الطلب كبير'});
   const input=JSON.parse(event.body||'{}'), action=z.string().parse(input.action);
   const adminActions=['approve_application','reject_application','publish_offer','reject_offer','merchant_status','approve_delivery','settle','sync_fees','settings'];
   if(adminActions.includes(action)) {
     if(!isAdmin)return result(403,{error:'للإدارة فقط'});
     if(action==='approve_application')await checked(db().rpc('approve_merchant_application',{p_application:z.number().int().positive().parse(input.id)}));
     else if(action==='reject_application')await checked(db().from('partner_applications').update({status:'rejected'}).eq('id',z.number().int().positive().parse(input.id)).eq('status','new'));
     else if(action==='publish_offer') {
       const id=z.uuid().parse(input.id),category=z.number().int().positive().parse(input.category_id);
       const offer=await checked(db().from('merchant_offers').select('*').eq('id',id).eq('status','review').single());
       const merchant=await checked(db().from('merchants').select('user_id,status').eq('id',offer.merchant_id).single());
       if(merchant.status!=='active')throw new Error('التاجر موقوف');
       const assets=await ownedPreviewAssets(offer.preview_asset_ids||[],merchant.user_id,false);
       const cover=assets.find((a:any)=>a.mime_type.startsWith('image/'));
       let publishedCover:string|undefined;
       if(cover){
         const {data:file,error:e}=await db().storage.from(PREVIEW_BUCKET).download(cover.storage_path);if(e)throw e;
         publishedCover=`merchant-covers/${id}.${cover.storage_path.split('.').pop()}`;
         const {error:uploadError}=await db().storage.from('product-images').upload(publishedCover,file,{contentType:cover.mime_type,upsert:true});if(uploadError)throw uploadError;
         const imageUrl=db().storage.from('product-images').getPublicUrl(publishedCover).data.publicUrl;
         await checked(db().from('merchant_offers').update({image_url:imageUrl}).eq('id',id));
       }
       try {await checked(db().rpc('publish_merchant_offer',{p_offer:id,p_category:category}));}
       catch(error){if(publishedCover)await db().storage.from('product-images').remove([publishedCover]);throw error;}
     }
     else if(action==='reject_offer')await checked(db().from('merchant_offers').update({status:'rejected',review_note:z.string().trim().min(3).max(1000).parse(input.note)}).eq('id',z.uuid().parse(input.id)).in('status',['draft','review']));
     else if(action==='merchant_status') {
       const id=z.uuid().parse(input.id), status=z.enum(['active','suspended']).parse(input.status);
       const m=await checked(db().from('merchants').update({status}).eq('id',id).select('id').single());
       const offers=await checked(db().from('merchant_offers').select('product_id').eq('merchant_id',m.id).eq('status','published'));
       if(offers.length)await checked(db().from('products').update({is_active:status==='active'}).in('id',offers.map((o:any)=>o.product_id)));
     } else if(action==='approve_delivery') {
       const item=await checked(db().from('merchant_order_items').select('*').eq('id',z.uuid().parse(input.id)).single());
       if(!item.paid_at||!item.fulfillment_submitted_at||item.status==='held')throw new Error('راجع الدفع والتسليم أولًا');
       await checked(db().from('order_items').update({delivery_status:'delivered',delivered_at:new Date().toISOString(),delivery_payload:{message:item.fulfillment_note}}).eq('id',item.order_item_id));
       await checked(db().from('merchant_order_items').update({delivered_at:new Date().toISOString()}).eq('id',item.id));
     } else if(action==='settings') await checked(db().from('merchant_settings').update({minimum_payout_cents:z.number().int().min(10000).parse(input.minimum_payout_cents),hold_days:z.number().int().min(7).max(90).parse(input.hold_days)}).eq('id',true));
     else if(action==='sync_fees'||action==='settle') {
       const id=z.uuid().parse(input.merchant_id);
       const items=await checked(db().from('merchant_order_items').select('order_id').eq('merchant_id',id).not('paid_at','is',null).in('status',['ready','fee_pending','held']));
       for(const orderId of new Set<string>(items.map((i:any)=>i.order_id))) {
         const order=await checked(db().from('orders').select('payment_payload,paid_at').eq('id',orderId).single());
         await syncMerchantPayment(orderId,order.payment_payload?.payment_intent_id,order.paid_at);
       }
       if(action==='settle')await checked(db().rpc('record_merchant_settlement',{p_merchant:id,p_fee:z.number().int().min(0).parse(input.transfer_fee_cents),p_reference:z.string().trim().min(4).max(200).parse(input.reference),p_admin:user.id,p_expected:z.number().int().positive().parse(input.expected_gross_cents)}));
     }
     return result(200,{ok:true});
   }
   const merchant=await checked(db().from('merchants').select('id,status').eq('user_id',user.id).maybeSingle());
   if(!merchant||merchant.status!=='active')return result(403,{error:'حساب التاجر يحتاج اعتماد الإدارة'});
   if(action==='save_offer') {
     const parsed=offerSchema.parse(input.offer);
     await ownedPreviewAssets(parsed.preview_asset_ids,user.id,!parsed.preview_url);
     const offer={...parsed,image_url:parsed.image_url||'/logo.png',preview_url:parsed.preview_url||null};
     if(input.id) {
       const data=await checked(db().from('merchant_offers').update({...offer,review_note:null}).eq('id',z.uuid().parse(input.id)).eq('merchant_id',merchant.id).in('status',['draft','rejected']).select('id'));
       if(!data?.length)return result(409,{error:'العرض منشور أو تحت المراجعة'});
     } else {
       const {count,error}=await db().from('merchant_offers').select('id',{count:'exact',head:true}).eq('merchant_id',merchant.id).gte('created_at',new Date(Date.now()-86400000).toISOString());
       if(error)throw error;if((count||0)>=20)return result(429,{error:'وصلت للحد اليومي'});
       await checked(db().from('merchant_offers').insert({...offer,merchant_id:merchant.id}));
     }
   } else if(action==='fulfill') {
     const item=await checked(db().from('merchant_order_items').select('id,paid_at,status,delivered_at').eq('id',z.uuid().parse(input.id)).eq('merchant_id',merchant.id).maybeSingle());
     if(!item)return result(404,{error:'الطلب غير موجود'});
     if(!item.paid_at||item.status==='held'||item.delivered_at)return result(409,{error:'هذا الطلب غير متاح للتسليم'});
     await checked(db().from('merchant_order_items').update({fulfillment_note:z.string().trim().min(10).max(3000).parse(input.note),fulfillment_submitted_at:new Date().toISOString()}).eq('id',item.id).eq('merchant_id',merchant.id));
   } else return result(400,{error:'إجراء غير معروف'});
   return result(200,{ok:true});
 }catch(error:any){console.error('[merchant]',error?.message);return result(400,{error:error instanceof z.ZodError?'تحقق من البيانات والروابط والأسعار':'تعذر إتمام العملية؛ تحقق من الشروط أو راجع الإدارة'});}
};
