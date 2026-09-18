import { ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, FileCheck2, ShieldCheck, Users } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { getServicePlan } from '@/data/servicePlans';

export default function ServicePlanDetail() {
  const { planId } = useParams();
  const { lang } = useLanguage();
  const ar = lang === 'ar';
  const plan = getServicePlan(planId);
  if (!plan) return <Navigate to="/" replace />;
  const Arrow = ar ? ArrowLeft : ArrowRight;
  const included = ar ? plan.includedAr : plan.includedEn;
  const client = ar ? plan.clientAr : plan.clientEn;
  const digzoom = ar ? plan.digzoomAr : plan.digzoomEn;
  const limits = ar ? plan.limitsAr : plan.limitsEn;
  const counting = ar ? plan.countingAr : plan.countingEn;

  return <main className="min-h-screen bg-[#f5f7fb] pb-24 pt-28 text-slate-950">
    <section className="bg-[#07101e] py-16 text-white"><div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8"><div><p className="text-sm font-black tracking-[.18em] text-blue-400">{ar ? 'تفاصيل الباقة' : 'PLAN DETAILS'}</p><h1 className="mt-4 text-4xl font-black md:text-6xl">{ar ? plan.nameAr : plan.nameEn}</h1><p className="mt-6 max-w-2xl text-xl leading-9 text-slate-300">{ar ? plan.summaryAr : plan.summaryEn}</p><div className="mt-7 inline-flex rounded-2xl bg-blue-500/15 px-5 py-3 font-black text-blue-200">{ar ? plan.productsAr : plan.productsEn}</div></div><div className="rounded-[2rem] border border-white/10 bg-white/[.05] p-8"><p className="text-sm text-slate-400">{ar ? 'الاشتراك الشهري' : 'Monthly subscription'}</p><div className="mt-2 flex items-end gap-2"><span className="text-5xl font-black">{plan.price.toLocaleString()}</span><span className="pb-1 text-slate-400">{ar ? 'ر.س / شهر' : 'SAR / month'}</span></div><Link to={`/service-checkout/${plan.id}`} className="mt-7 flex min-h-14 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-black hover:bg-blue-500">{ar ? 'المتابعة للطلب والدفع' : 'Continue to order and payment'}<Arrow className="h-5 w-5" /></Link><p className="mt-3 text-center text-xs leading-5 text-slate-500">{ar ? 'لن يتم الخصم قبل مراجعة التفاصيل والموافقة عليها.' : 'You will not be charged before reviewing and accepting the details.'}</p></div></div></section>

    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><div className="rounded-[2rem] border border-blue-100 bg-blue-50 p-7 md:p-10"><p className="text-sm font-black text-blue-700">{ar ? 'النتيجة التي نعمل عليها' : 'THE OUTCOME'}</p><h2 className="mt-3 text-2xl font-black leading-10 md:text-3xl">{ar ? plan.resultAr : plan.resultEn}</h2><div className="mt-6 rounded-2xl bg-white/80 p-5"><p className="text-sm font-black text-slate-900">{ar ? 'لمن تناسب هذه الباقة؟' : 'WHO IS THIS FOR?'}</p><p className="mt-2 leading-7 text-slate-600">{ar ? plan.bestForAr : plan.bestForEn}</p></div></div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2"><Info title={ar ? 'ما تشمل الباقة' : 'What is included'} icon={<Check className="h-6 w-6" />} items={included} tone="blue" /><Info title={ar ? 'طريقة التنفيذ والنشر' : 'How publishing works'} icon={<Clock3 className="h-6 w-6" />} items={ar ? ['استلام الصلاحيات والمواد', 'إعداد خطة الشهر وجدول النشر', 'إرسال المواد للاعتماد', 'النشر والتنفيذ بعد الاعتماد', 'المتابعة والتقرير في نهاية الدورة'] : ['Receive access and assets', 'Prepare the monthly plan and schedule', 'Send work for approval', 'Publish after approval', 'Monitor and report at cycle end']} tone="violet" /><Info title={ar ? 'المطلوب من العميل' : 'What we need from you'} icon={<Users className="h-6 w-6" />} items={client} tone="amber" /><Info title={ar ? 'التزام DigZoom' : 'DigZoom responsibilities'} icon={<ShieldCheck className="h-6 w-6" />} items={digzoom} tone="emerald" /></div>
      <div className="mt-6"><Info title={ar ? 'كيف نحسب المنشورات والقصص والتسليمات؟' : 'How deliverables are counted'} icon={<FileCheck2 className="h-6 w-6" />} items={counting} tone="violet" /></div>
      <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-7 md:p-9"><div className="flex items-center gap-3"><CircleAlert className="h-6 w-6 text-rose-500" /><h2 className="text-2xl font-black">{ar ? 'الحدود والاستثناءات' : 'Limits and exclusions'}</h2></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{limits.map(x => <p key={x} className="flex gap-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600"><FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />{x}</p>)}</div></div>
      <div className="mt-10 rounded-[2rem] bg-slate-950 p-8 text-center text-white md:p-12"><h2 className="text-3xl font-black">{ar ? 'واضح ما ستحصل عليه؟' : 'Ready to proceed?'}</h2><p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-400">{ar ? 'راجع بيانات المنشأة، وافق على نطاق العمل، ثم انتقل إلى الدفع الآمن عند تفعيل البوابة.' : 'Review your business details, accept the scope, then continue to secure payment once the gateway is enabled.'}</p><Link to={`/service-checkout/${plan.id}`} className="mt-7 inline-flex min-h-14 items-center gap-2 rounded-xl bg-blue-600 px-8 font-black hover:bg-blue-500">{ar ? 'ابدأ طلب الباقة' : 'Start plan order'}<Arrow className="h-5 w-5" /></Link></div>
    </section>
  </main>;
}

function Info({ title, icon, items, tone }: { title: string; icon: React.ReactNode; items: string[]; tone: 'blue' | 'violet' | 'amber' | 'emerald' }) {
  const colors = { blue: 'bg-blue-50 text-blue-700', violet: 'bg-violet-50 text-violet-700', amber: 'bg-amber-50 text-amber-700', emerald: 'bg-emerald-50 text-emerald-700' };
  return <article className="rounded-[2rem] border border-slate-200 bg-white p-7"><div className={`inline-flex rounded-xl p-3 ${colors[tone]}`}>{icon}</div><h2 className="mt-5 text-2xl font-black">{title}</h2><ul className="mt-6 space-y-3">{items.map(x => <li key={x} className="flex gap-3 leading-7 text-slate-600"><Check className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />{x}</li>)}</ul></article>;
}
