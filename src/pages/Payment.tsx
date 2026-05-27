import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Loader2, CreditCard } from 'lucide-react';

const MOYASAR_KEY = import.meta.env.VITE_MOYASAR_KEY || 'pk_test_PLACEHOLDER';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const amount = searchParams.get('amount') || '99';
  const orderId = searchParams.get('order') || '';

  useEffect(() => {
    if (MOYASAR_KEY === 'pk_test_PLACEHOLDER') {
      setLoading(false);
      return;
    }

    // Load Moyasar script
    const script = document.createElement('script');
    script.src = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.js';
    script.onload = () => setLoading(false);
    script.onerror = () => setLoading(false);
    document.body.appendChild(script);

    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    if (loading || MOYASAR_KEY === 'pk_test_PLACEHOLDER' || !(window as any).Moyasar) return;

    (window as any).Moyasar.init({
      element: '.moyasar-payment',
      amount: parseInt(amount) * 100, // halalas
      currency: 'SAR',
      description: `digzoom Order #${orderId}`,
      publishable_api_key: MOYASAR_KEY,
      callback_url: `${window.location.origin}/#/thank-you`,
      methods: ['creditcard', 'applepay', 'stcpay'],
      apple_pay: {
        country: 'SA',
        label: 'digzoom',
        validate_merchant_url: '/api/apple-pay/validate',
      },
      on_completed: (payment: any) => {
        console.log('Payment completed:', payment);
        window.location.href = '/#/thank-you?status=success';
      },
      on_failed: (error: any) => {
        console.error('Payment failed:', error);
      },
    });
  }, [loading, amount, orderId]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">الدفع الآمن</h1>
          <p className="text-gray-400">ادفع بأمان عبر Moyasar</p>
        </div>

        <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">المبلغ</span>
            <span className="text-2xl font-bold text-white">{amount} ر.س</span>
          </div>
          {orderId && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">رقم الطلب</span>
              <span className="text-white font-mono">{orderId}</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : MOYASAR_KEY === 'pk_test_PLACEHOLDER' ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
            <p className="text-yellow-400 mb-2">⚠️ مفتاح Moyasar غير مضبوط</p>
            <p className="text-gray-400 text-sm">
              أضف VITE_MOYASAR_KEY في Netlify Environment Variables
            </p>
            <div className="mt-4 p-3 bg-black/30 rounded-lg text-left text-xs text-gray-500 font-mono">
              VITE_MOYASAR_KEY=pk_test_xxxxxxxx
            </div>
          </div>
        ) : (
          <div className="moyasar-payment" />
        )}
      </div>
    </div>
  );
}
