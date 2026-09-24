import { Link } from 'react-router';
import { CheckCircle, Loader2 } from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { useLanguage } from '@/hooks/useLanguage';

export default function ServicePaymentSuccess() {
  const { lang } = useLanguage();
  const ar = lang === 'ar';
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('order_id') || '';
  const sessionId = params.get('session_id') || '';
  const payment = trpc.listOrderDownloads.useQuery(
    { order_id: orderId, session_id: sessionId },
    { enabled: orderId.startsWith('DZ-SRV-') && sessionId.startsWith('cs_'), retry: false }
  );
  const verified = payment.isSuccess;
  return <main className="min-h-screen bg-[#080d16] px-4 pb-20 pt-32 text-white">
    <section className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-[#111827] p-8 text-center">
      {payment.isLoading ? <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-400" /> : verified ? <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" /> : null}
      <h1 className="mt-5 text-3xl font-black">{verified ? (ar ? 'تم تأكيد دفعة الشهر الأول' : 'First month payment confirmed') : (ar ? 'لم يُؤكَّد الدفع بعد' : 'Payment has not been confirmed')}</h1>
      <p className="mt-4 leading-8 text-slate-300">{verified ? (ar ? 'وصلنا طلب الباقة. سنتواصل معك لترتيب بدء العمل؛ التجديد ليس تلقائيًا.' : 'We received your plan order. We will contact you to arrange onboarding; renewal is not automatic.') : (ar ? 'إذا أكملت الدفع للتو، انتظر قليلًا ثم حدّث الصفحة. لا نبدأ العمل قبل تأكيد الدفع.' : 'If you just paid, wait briefly and refresh. We do not start work until payment is confirmed.')}</p>
      {verified && <p className="mt-4 text-sm text-slate-400">{ar ? 'رقم الطلب' : 'Order ID'}: {orderId}</p>}
      <Link to="/" className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold">{ar ? 'العودة للرئيسية' : 'Back to home'}</Link>
    </section>
  </main>;
}
