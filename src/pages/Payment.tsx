import { CreditCard, LockKeyhole, Mail, Store } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';

export default function Payment() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <main className="min-h-screen bg-[#08090d] px-4 pb-20 pt-32 text-white">
      <section className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-[#111622] p-7 text-center shadow-2xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-300/20">
          <LockKeyhole className="h-8 w-8" />
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-blue-400">
          {isAr ? 'حالة الدفع' : 'Payment status'}
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          {isAr ? 'هذا رابط دفع قديم' : 'This payment link is outdated'}
        </h1>
        <p className="mt-5 leading-8 text-slate-300">
          {isAr
            ? 'لا يمكن الدفع من رابط يحتوي على مبلغ مكتوب يدويًا. اختر الباقة من الموقع وأكمل بيانات الطلب لفتح صفحة الدفع الآمن بالسعر المعتمد.'
            : 'A link with a manually entered amount cannot start a payment. Select a plan on the site and complete the order details to open secure checkout at the verified price.'}
        </p>

        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[.03] p-5 text-start">
          <div className="flex items-start gap-3">
            <CreditCard className="mt-1 h-5 w-5 shrink-0 text-blue-400" />
            <p className="text-sm leading-7 text-slate-400">
              {isAr
                ? 'لم تُنشأ عملية دفع من هذا الرابط، ولم يُخصم أي مبلغ.'
                : 'No payment was created from this link and nothing was charged.'}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link to="/#plans" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-bold hover:bg-blue-500">
            <Store className="h-4 w-4" />
            {isAr ? 'شاهد الباقات' : 'See plans'}
          </Link>
          <Link to="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 font-bold hover:bg-white/5">
            <Mail className="h-4 w-4" />
            {isAr ? 'تواصل معنا' : 'Contact us'}
          </Link>
        </div>
      </section>
    </main>
  );
}
