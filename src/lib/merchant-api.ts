export async function merchantApi(body?:unknown,admin=false) {
 const token=localStorage.getItem('sb_access_token');
 const response=await fetch('/api/merchant'+(admin?'?admin=true':''),{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});
 const data=await response.json();if(!response.ok)throw new Error(data.error||'تعذر الاتصال');return data;
}
export const money=(cents:number|null|undefined)=>cents==null?'بانتظار الرسوم':`${(Number(cents)/100).toLocaleString('ar-SA',{minimumFractionDigits:2,maximumFractionDigits:2})} ر.س`;
export const partnerStatus:Record<string,string>={new:'قيد مراجعة الطلب',approved:'معتمد',rejected:'مرفوض',active:'نشط',suspended:'موقوف',draft:'مسودة',review:'قيد المراجعة',published:'منشور',pending:'بانتظار الدفع',fee_pending:'بانتظار رسوم Stripe',ready:'احتساب مكتمل',held:'معلّق للمراجعة',settled:'تمت التسوية'};
