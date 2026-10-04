import { createHmac, timingSafeEqual } from 'node:crypto';

/** Largest-remainder allocation conserves every cent, including mixed carts. */
export function allocateCents(total: number, weights: number[]) {
  if (!Number.isSafeInteger(total) || total < 0 || weights.some(w => !Number.isSafeInteger(w) || w < 0)) throw new Error('Invalid money');
  const sum = weights.reduce((a,b)=>a+b,0);
  if (!sum) { if(total) throw new Error('Cannot allocate money'); return weights.map(()=>0); }
  const raw=weights.map(w=>total*w/sum), result=raw.map(Math.floor);
  const remaining=total-result.reduce((a,b)=>a+b,0);
  const ranked=raw.map((v,i)=>({i,remainder:v-result[i]})).sort((a,b)=>b.remainder-a.remainder || a.i-b.i);
  for(let i=0;i<remaining;i++) result[ranked[i].i]++;
  return result;
}
export function commissionSplit(gross:number, fee:number, rate:15|25) {
  if(!Number.isSafeInteger(gross)||!Number.isSafeInteger(fee)||gross<0||fee<0||fee>gross||![15,25].includes(rate)) throw new Error('Invalid split');
  const net=gross-fee, commission=Math.round(net*rate/100);
  return {commission,merchant:net-commission};
}
export function feeInSar(transaction:any) {
  if (!transaction || !Number.isSafeInteger(transaction.fee) || transaction.fee<0) return null;
  if(transaction.currency==='sar') return transaction.fee;
  // Support the existing US Stripe balance; fail closed for currencies with different minor units.
  if(transaction.currency==='usd' && Number.isFinite(transaction.exchange_rate) && transaction.exchange_rate>0) return Math.round(transaction.fee/transaction.exchange_rate);
  return null;
}
const signature=(value:string,secret:string)=>createHmac('sha256',secret).update('digzoom-referral-v1:'+value).digest('hex');
export function signReferral(merchantId:string,secret:string,now=Date.now()) {
 const payload=Buffer.from(JSON.stringify({id:merchantId,expires:now+7*86400000})).toString('base64url');
 return payload+'.'+signature(payload,secret);
}
export function verifyReferral(token:string|undefined,secret:string|undefined,now=Date.now()):string|null {
 if(!token||!secret||token.length>500) return null;
 const [payload,sig]=token.split('.'); if(!payload||!sig||!/^[a-f0-9]{64}$/.test(sig)) return null;
 const expected=signature(payload,secret);
 if(!timingSafeEqual(Buffer.from(sig),Buffer.from(expected))) return null;
 try {const data=JSON.parse(Buffer.from(payload,'base64url').toString()); return typeof data.id==='string' && data.expires>now && data.expires<=now+7*86400000 ? data.id : null;} catch{return null;}
}
