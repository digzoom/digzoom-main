export default function PartnerTerms({ar=true,holdDays=14,minimumSar=1000}:{ar?:boolean;holdDays?:number;minimumSar?:number}){
 const conditions=ar?[
 'يجب أن تملك حقوق بيع المنتج. نراجع المحتوى والجودة قبل نشره، ولا نقبل المنتجات المنسوخة أو ما تمنع منصته بيعه أو نقله.',
 'عمولة الموقع 15% للطلبات القادمة من رابطك على منتجاتك خلال 7 أيام، و25% للطلبات القادمة من DigZoom، وتشمل إدارة التسويق ضمن ميزانيته دون ضمان مبيعات.',
 'تُحسب العمولة على قيمة البيع بعد الخصم، باستبعاد الضرائب وخصم رسوم معالجة الدفع الفعلية. تُخصم رسوم التحويل والسحب الفعلية عند صرف المستحقات.',
 `تُصرف المستحقات شهريًا بعد اعتماد التسليم ومرور ${holdDays} يومًا من الدفع، من ${minimumSar.toLocaleString('ar-SA')} ر.س. قد تُعلق الطلبات المسترجعة أو المتنازع عليها للمراجعة.`,
 'ملفات المعاينة خاصة بك وبالإدارة. نشر المنتج وصورة عرضه يتطلب موافقة الإدارة؛ يظهر المنتج باسم DigZoom، وتبقى هوية التاجر داخلية.'
 ]:[
 'You must own the selling rights. Products are reviewed before publishing. Copied products and platform-prohibited sales or transfers are not accepted.',
 'Commission is 15% for your products purchased through your referral within 7 days, or 25% for DigZoom orders, including marketing management within its budget without guaranteed sales.',
 'Commission applies after discounts, excluding taxes and actual payment processing costs. Actual transfer and withdrawal costs are deducted at settlement.',
 `Monthly settlements follow approved delivery and a ${holdDays}-day payment hold, starting at SAR ${minimumSar}. Refunds and disputes may pause settlement.`,
 'Preview files are private to you and our team. Products and cover images require approval before publication under DigZoom. Merchant identity stays private.'
 ];
 return <details className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700"><summary className="cursor-pointer font-bold text-blue-700">{ar?'شروط الشراكة والبيع':'Partnership and selling terms'}</summary><ul className="mt-4 list-disc space-y-3 px-5 text-sm leading-7">{conditions.map(text=><li key={text}>{text}</li>)}</ul></details>;
}
