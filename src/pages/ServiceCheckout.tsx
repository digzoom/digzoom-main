import { useState } from 'react';
import { Check, Clock3, CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { Navigate, useParams } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { getServicePlan } from '@/data/servicePlans';

const CHECKOUT_ENABLED = import.meta.env.VITE_CHECKOUT_ENABLED === 'true';

export default function ServiceCheckout() {
  const { planId } = useParams();
  const { lang } = useLanguage();
  const ar = lang === 'ar';
  const plan = getServicePlan(planId);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [accepted, setAccepted] = useState(false);
  if (!plan) return <Navigate to="/" replace />;
  const selectedPlan = plan;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accepted) return;
    setSending(true);
    const form = e.currentTarget;
    try {
      const data = Object.fromEntries(new FormData(form));
      if (CHECKOUT_ENABLED) {
        const res = await fetch('/api/service-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, plan_id: selectedPlan.id, accepted }) });
        const result = await res.json();
        if (!res.ok || !result.checkoutUrl) throw new Error(result.error || 'Unable to start payment');
        window.location.assign(result.checkoutUrl);
      } else {
        const res = await fetch('/api/growth-audit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, service_interest: selectedPlan.id, plan_name: ar ? selectedPlan.nameAr : selectedPlan.nameEn, amount: selectedPlan.price, goal: 'service-order', lang }) });
        if (!res.ok) throw new Error();
        setSent(true);
      }
    } catch { alert(ar ? 'تعذر فتح الدفع الآمن الآن. لم يُخصم أي مبلغ؛ حاول مرة أخرى.' : 'Secure checkout could not open. Nothing was charged; please retry.'); }
    finally { setSending(false); }
  }

  return <main className="min-h-screen bg-[#080d16] pb-20 pt-28 text-white"><div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-8"><aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[.04] p-7 lg:sticky lg:top-24"><p className="text-sm font-black text-blue-400">{ar ? 'ملخص الطلب' : 'ORDER SUMMARY'}</p><h1 className="mt-3 text-3xl font-black">{ar ? plan.nameAr : plan.nameEn}</h1><p className="mt-3 leading-7 text-slate-400">{ar ? plan.summaryAr : plan.summaryEn}</p><p className="mt-4 text-sm leading-6 text-blue-200">{ar ? "الدفع الآن للشهر الأول فقط؛ لا يتجدد تلقائيًا." : "Pay for the first month only; no automatic renewal."}</p><div className="mt-7 border-y border-white/10 py-5"><div className="flex items-end justify-between"><span className="text-slate-400">{ar ? 'شهريًا' : 'Monthly'}</span><span className="text-3xl font-black">{plan.price.toLocaleString()} {ar ? 'ر.س' : 'SAR'}</span></div></div><p className="mt-5 flex gap-2 text-sm leading-6 text-blue-200"><Check className="mt-0.5 h-4 w-4 shrink-0" />{ar ? plan.productsAr : plan.productsEn}</p><p className="mt-3 flex gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="h-4 w-4 shrink-0" />{ar ? 'لا يتم الخصم دون موافقتك والانتقال إلى بوابة الدفع.' : 'No charge occurs until you accept and continue to the gateway.'}</p></aside>
    <section className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 sm:p-9">{sent ? <div className="py-20 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15"><Check className="h-8 w-8 text-emerald-400" /></div><h2 className="mt-6 text-3xl font-black">{ar ? 'تم استلام طلبك' : 'Order request received'}</h2><p className="mx-auto mt-4 max-w-lg leading-8 text-slate-400">{ar ? 'بوابة الدفع قيد التفعيل، لذلك لم يُخصم أي مبلغ. سنراجع جاهزية البدء ونتواصل معك دون تغيير سعر الباقة.' : 'The payment gateway is being activated, so no charge was made. We will review onboarding readiness and contact you.'}</p></div> : <><h2 className="text-3xl font-black">{ar ? 'بيانات بدء الخدمة' : 'Service onboarding details'}</h2><p className="mt-3 leading-7 text-slate-400">{ar ? 'هذه المعلومات تمنع التأخير بعد الدفع وتحدد ما إذا كانت الصلاحيات والمواد جاهزة.' : 'This information prevents delays after payment and confirms your assets are ready.'}</p>{!CHECKOUT_ENABLED && <div className="mt-6 flex gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><p className="text-sm leading-6 text-amber-100">{ar ? 'الدفع الإلكتروني غير مفعل حاليًا. يمكنك إرسال طلب الباقة الآن، ولن يتم خصم أي مبلغ.' : 'Online payment is not enabled yet. You can submit the plan request now and no amount will be charged.'}</p></div>}<form onSubmit={submit} className="mt-8 grid gap-5 sm:grid-cols-2"><Field label={ar ? 'الاسم' : 'Name'}><input name="name" required /></Field><Field label={ar ? 'رقم الجوال' : 'Phone'}><input name="phone" required dir="ltr" /></Field><Field label={ar ? 'البريد الإلكتروني' : 'Email'} wide><input name="email" type="email" required dir="ltr" /></Field><Field label={ar ? 'اسم المنشأة' : 'Business name'}><input name="company" required /></Field><Field label={ar ? 'الموقع أو الحساب الرئيسي' : 'Website or main account'}><input name="website" dir="ltr" /></Field><Field label={ar ? 'هل الصلاحيات جاهزة؟' : 'Is access ready?'}><select name="access_ready" required defaultValue=""><option value="" disabled>{ar ? 'اختر' : 'Select'}</option><option value="yes">{ar ? 'نعم' : 'Yes'}</option><option value="partial">{ar ? 'جزئيًا' : 'Partially'}</option><option value="no">{ar ? 'لا' : 'No'}</option></select></Field><Field label={ar ? 'موعد البدء المطلوب' : 'Preferred start date'}><input name="start_date" type="date" /></Field><Field label={ar ? 'ملاحظات أو روابط المواد' : 'Notes or asset links'} wide><textarea name="notes" rows={4} /></Field><label className="sm:col-span-2 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-4"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-1 h-4 w-4" /><span className="text-sm leading-7 text-slate-300">{ar ? 'قرأت تفاصيل الباقة، وما يشمله الاشتراك، والمطلوب مني، والحدود والاستثناءات، وأوافق على هذا النطاق.' : 'I have read and accept the plan deliverables, my responsibilities, limits, and exclusions.'}</span></label><button disabled={!accepted || sending} className="sm:col-span-2 flex min-h-14 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-black hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">{sending ? <Loader2 className="h-5 w-5 animate-spin" /> : CHECKOUT_ENABLED ? <CreditCard className="h-5 w-5" /> : <Check className="h-5 w-5" />}{CHECKOUT_ENABLED ? (ar ? 'المتابعة إلى الدفع الآمن' : 'Continue to secure payment') : (ar ? 'إرسال طلب الباقة دون دفع' : 'Submit plan request without payment')}</button></form></>}</section>
  </div></main>;
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={`text-sm font-bold text-slate-300 ${wide ? 'sm:col-span-2' : ''}`}><span>{label}</span><div className="mt-2 [&>input]:h-12 [&>input]:w-full [&>input]:rounded-xl [&>input]:border [&>input]:border-white/10 [&>input]:bg-[#0b1220] [&>input]:px-4 [&>input]:text-white [&>input]:outline-none [&>select]:h-12 [&>select]:w-full [&>select]:rounded-xl [&>select]:border [&>select]:border-white/10 [&>select]:bg-[#0b1220] [&>select]:px-4 [&>select]:text-white [&>textarea]:w-full [&>textarea]:rounded-xl [&>textarea]:border [&>textarea]:border-white/10 [&>textarea]:bg-[#0b1220] [&>textarea]:p-4 [&>textarea]:text-white">{children}</div></label>;
}
