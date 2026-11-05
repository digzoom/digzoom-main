import { Link, useSearchParams } from 'react-router';
import { Clock, Home } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function SharedPaymentComplete() {
  const { lang } = useLanguage();
  const [params] = useSearchParams();
  const cancelled = params.get('payment') === 'cancelled';

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 pb-16 pt-32">
      <section className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#151520] p-7 text-center">
        <Clock className="mx-auto mb-4 h-10 w-10 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">
          {cancelled
            ? (lang === 'ar' ? 'لم يكتمل الدفع' : 'Payment not completed')
            : (lang === 'ar' ? 'وصلنا إلى صفحة تأكيد الدفع' : 'Payment return received')}
        </h1>
        <p className="mt-4 leading-7 text-gray-400">
          {cancelled
            ? (lang === 'ar' ? 'لم يتم تأكيد دفع هذا الطلب. يمكن لصاحب الطلب إرسال رابط الدفع من جديد إذا ظل صالحًا.' : 'This order is not paid. Ask the recipient to share the link again if it is still valid.')
            : (lang === 'ar' ? 'يستطيع صاحب الطلب استلام المنتج عبر رابطه الخاص بعد تأكيد الدفع. رابط الدفع لا يمنح الدافع حق تنزيل المنتج.' : 'The recipient can access the product using their private link after payment verification. This payment link does not grant the payer access to downloads.')}
        </p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-blue-300 hover:underline"><Home className="h-4 w-4" />{lang === 'ar' ? 'العودة للرئيسية' : 'Back to home'}</Link>
      </section>
    </main>
  );
}
