import {getSupabaseAdmin} from './supabase-admin';
import {allocateCents,commissionSplit,feeInSar,verifyReferral} from './merchant-accounting';
const db=():any=>getSupabaseAdmin();
export async function snapshotMerchantItems(orderId:string,cookie:string|undefined,totalSar:number) {
 const {data:items,error}=await db().from('order_items').select('id,product_id,product_title,quantity,price_at_time').eq('order_id',orderId).order('id');
 if(error||!items?.length) throw new Error('Unable to prepare merchant items');
 const {data:offers,error:offerError}=await db().from('merchant_offers').select('id,merchant_id,product_id,status,merchants!inner(status)').in('product_id',items.map((i:any)=>i.product_id));
 if(offerError) throw offerError;
 if(!offers?.length) return;
 if(offers.some((o:any)=>o.status!=='published'||o.merchants.status!=='active')) throw new Error('Merchant offer unavailable');
 const token=cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith('dz_ref='))?.slice(7);
 const referral=verifyReferral(token,process.env.STRIPE_SECRET_KEY);
 const gross=allocateCents(Math.round(totalSar*100),items.map((i:any)=>i.price_at_time*i.quantity*100));
 const rows=items.flatMap((item:any,index:number)=>{
   const offer=offers.find((o:any)=>o.product_id===item.product_id); if(!offer) return [];
   const own=offer.merchant_id===referral;
   return [{merchant_id:offer.merchant_id,offer_id:offer.id,order_id:orderId,order_item_id:item.id,product_title:item.product_title,quantity:item.quantity,source:own?'merchant':'digzoom',commission_percent:own?15:25,gross_cents:gross[index]}];
 });
 const {error:insertError}=await db().from('merchant_order_items').insert(rows); if(insertError) throw insertError;
}
export async function syncMerchantPayment(orderId:string,paymentIntent:string|undefined|null,paidAt?:string) {
 const {data:ledger,error}=await db().from('merchant_order_items').select('*').eq('order_id',orderId);
 if(error) throw error; if(!ledger?.length) return;
 const key=process.env.STRIPE_SECRET_KEY; if(!key||!paymentIntent) throw new Error('Missing Stripe payment reference');
 const res=await fetch(`https://api.stripe.com/v1/payment_intents/${encodeURIComponent(paymentIntent)}?expand[]=latest_charge.balance_transaction`,{headers:{Authorization:`Bearer ${key}`},signal:AbortSignal.timeout(10000)});
 if(!res.ok) throw new Error('Unable to verify merchant payment');
 const intent:any=await res.json(), charge=intent.latest_charge;
 const {data:order,error:orderError}=await db().from('orders').select('id,total_amount,status,paid_at').eq('id',orderId).single();
 if(orderError||intent.metadata?.order_id!==orderId||intent.currency!=='sar'||intent.amount_received!==Math.round(order.total_amount*100)||intent.status!=='succeeded') throw new Error('Merchant payment mismatch');
 if(charge?.refunded||charge?.amount_refunded>0||charge?.disputed||order.status==='refunded') {
   const {error:e}=await db().from('merchant_order_items').update({status:'held',hold_reason:'Refund/dispute requires administrator reconciliation'}).eq('order_id',orderId); if(e) throw e; return;
 }
 const fee=feeInSar(charge?.balance_transaction);
 const {data:allItems,error:itemsError}=await db().from('order_items').select('id,price_at_time,quantity').eq('order_id',orderId).order('id');
 if(itemsError) throw itemsError;
 const fees=fee===null?null:allocateCents(fee,allItems.map((i:any)=>i.price_at_time*i.quantity*100));
 const {data:settings,error:settingsError}=await db().from('merchant_settings').select('hold_days').eq('id',true).single(); if(settingsError) throw settingsError;
 for(const row of ledger) {
   if(row.settlement_id||row.status==='held') continue;
   const index=allItems.findIndex((i:any)=>i.id===row.order_item_id), allocated=fees?.[index];
   const confirmed=allocated!==undefined&&allocated<=row.gross_cents;
   const split=confirmed?commissionSplit(row.gross_cents,allocated,row.commission_percent):null;
   const at=order.paid_at||paidAt||new Date().toISOString();
   const {error:e}=await db().from('merchant_order_items').update({paid_at:at,status:confirmed?'ready':'fee_pending',stripe_fee_cents:confirmed?allocated:null,commission_cents:split?.commission??null,merchant_cents:split?.merchant??null,ready_at:new Date(new Date(at).getTime()+settings.hold_days*86400000).toISOString(),fee_evidence:charge?.balance_transaction?{id:charge.balance_transaction.id,currency:charge.balance_transaction.currency,fee:charge.balance_transaction.fee,exchange_rate:charge.balance_transaction.exchange_rate,charge_id:charge.id}:null}).eq('id',row.id).is('settlement_id',null).neq('status','held');
   if(e) throw e;
 }
}
export async function holdMerchantCharge(charge:any,reason:string) {
 if (!charge.payment_intent && typeof charge.charge === 'string') {
   const response=await fetch(`https://api.stripe.com/v1/charges/${encodeURIComponent(charge.charge)}`,{headers:{Authorization:`Bearer ${process.env.STRIPE_SECRET_KEY}`},signal:AbortSignal.timeout(10000)});
   if(!response.ok)throw new Error('Unable to identify disputed order');
   charge=await response.json();
 }
 let orderId=charge.metadata?.order_id;
 if(!orderId&&charge.payment_intent) {const {data,error}=await db().from('orders').select('id').contains('payment_payload',{payment_intent_id:charge.payment_intent}).maybeSingle(); if(error) throw error; orderId=data?.id;}
 if(orderId) {const {error}=await db().from('merchant_order_items').update({status:'held',hold_reason:reason}).eq('order_id',orderId);if(error)throw error;}
}
