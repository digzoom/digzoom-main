import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { subscriptions } from '@/data/products';
import { useNavigate } from 'react-router';

export default function Subscriptions() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const isAr = lang === 'ar';

  const icons: Record<string, React.ReactNode> = {
    basic: <Sparkles className="w-8 h-8" />,
    pro: <Zap className="w-8 h-8" />,
    business: <Building2 className="w-8 h-8" />,
  };

  const gradients: Record<string, string> = {
    basic: 'from-gray-700 to-gray-900 border-gray-600',
    pro: 'from-yellow-700 to-yellow-900 border-yellow-500',
    business: 'from-blue-700 to-blue-900 border-blue-500',
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 text-center py-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {isAr ? 'خطط الاشتراك' : 'Subscription Plans'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {isAr 
              ? 'اختر الخطة المناسبة لك واستمتع بتحميلات غير محدودة من المنتجات الرقمية'
              : 'Choose the plan that fits you and enjoy unlimited downloads of digital products'}
          </p>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-[#151520] rounded-full p-1 flex items-center border border-white/10">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {isAr ? 'شهري' : 'Monthly'}
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {isAr ? 'سنوي' : 'Yearly'}
            <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full">
              {isAr ? 'وفر 20%' : 'Save 20%'}
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {subscriptions.map((sub) => {
            const price = billingCycle === 'monthly' ? sub.monthlyPrice : sub.yearlyPrice;
            const isPro = sub.id === 'pro';
            return (
              <div
                key={sub.id}
                className={`relative rounded-2xl border-2 bg-gradient-to-b p-8 transition-transform hover:scale-105 ${gradients[sub.id]} ${
                  isPro ? 'scale-105 shadow-2xl shadow-orange-900/30' : ''
                }`}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {isAr ? 'الأكثر شيوعاً' : 'MOST POPULAR'}
                  </div>
                )}
                
                <div className="text-orange-400 mb-4">{icons[sub.id]}</div>
                
                <h3 className="text-2xl font-bold mb-1">{isAr ? sub.nameAr : sub.name}</h3>
                <p className="text-gray-400 text-sm mb-6">
                  {isAr ? sub.desc.ar : sub.desc.en}
                </p>
                
                <div className="mb-6">
                  <span className="text-5xl font-extrabold">{price}</span>
                  <span className="text-gray-400 mr-2">{isAr ? 'ر.س' : 'SAR'}</span>
                  <span className="text-gray-500 text-sm">
                    / {billingCycle === 'monthly' ? (isAr ? 'شهر' : 'month') : (isAr ? 'سنة' : 'year')}
                  </span>
                </div>

                <Button
                  className={`w-full mb-8 ${
                    isPro
                      ? 'bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  onClick={() => navigate('/checkout')}
                >
                  {isAr ? 'اشترك الآن' : 'Subscribe Now'}
                </Button>

                <ul className="space-y-3">
                  {(isAr ? sub.features.ar : sub.features.en).map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: isAr ? 'هل يمكنني إلغاء الاشتراك في أي وقت؟' : 'Can I cancel my subscription anytime?',
                a: isAr ? 'نعم، يمكنك إلغاء اشتراكك في أي وقت بدون أي رسوم إضافية.' : 'Yes, you can cancel your subscription anytime without any additional fees.',
              },
              {
                q: isAr ? 'هل المنتجات مرخصة تجارياً؟' : 'Are the products commercially licensed?',
                a: isAr ? 'جميع المنتجات تأتي بترخيص تجاري كامل يتيح لك استخدامها في مشاريعك بدون قيود.' : 'All products come with a full commercial license allowing you to use them in your projects without restrictions.',
              },
              {
                q: isAr ? 'هل يوجد تحديثات مجانية؟' : 'Are there free updates?',
                a: isAr ? 'نعم، تحصل على تحديثات مجانية طوال فترة اشتراكك.' : 'Yes, you get free updates throughout your subscription period.',
              },
              {
                q: isAr ? 'ما هي طرق الدفع المتاحة؟' : 'What payment methods are available?',
                a: isAr ? 'نقبل الدفع ببطاقات Visa/Mastercard، Apple Pay، Google Pay، ومدى.' : 'We accept Visa/Mastercard, Apple Pay, Google Pay, and Mada.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-[#151520] rounded-xl p-6 border border-white/5">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
