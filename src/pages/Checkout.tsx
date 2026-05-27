import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  CreditCard, ShieldCheck, Lock, ArrowLeft, ArrowRight,
  Loader2, Shield, Clock, Headphones, Award, CheckCircle,
  Smartphone, Globe
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';

/* ── Secure payment UI ── */
const paymentMethods = [
  { name: 'Visa', icon: '💳' },
  { name: 'Mastercard', icon: '💳' },
  { name: 'Mada', icon: '🏦' },
  { name: 'Apple Pay', icon: '📱' },
];

const trustItems = [
  { icon: <Shield className="w-4 h-4" />, textAr: 'دفع آمن مشفر', textEn: 'Encrypted Secure Payment' },
  { icon: <Clock className="w-4 h-4" />, textAr: 'توصيل فوري', textEn: 'Instant Delivery' },
  { icon: <Award className="w-4 h-4" />, textAr: 'ضمان استرجاع 30 يوم', textEn: '30-Day Money Back' },
  { icon: <Headphones className="w-4 h-4" />, textAr: 'دعم فني على مدار الساعة', textEn: '24/7 Support' },
];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const isRTL = lang === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const tax = Math.round(totalPrice * 0.15);
  const total = totalPrice + tax;

  // If order was just completed, navigate to thank-you page
  if (orderCompleted) {
    navigate('/thank-you');
    return null;
  }

  // Redirect old success URLs
  if (window.location.hash.includes('/checkout/success')) {
    navigate('/thank-you', { replace: true });
    return null;
  }

  // If cart is empty, redirect to cart page
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleCheckout = async () => {
    if (!form.email || !form.name) {
      toast.error(lang === 'ar' ? 'يرجى ملء الاسم والبريد الإلكتروني' : 'Please fill in name and email');
      return;
    }

    setLoading(true);

    // Simulate a brief processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const orderId = `DZ${Date.now().toString(36).toUpperCase()}`;
      const orderData = {
        id: orderId,
        items: items.map(item => ({ product: item, quantity: item.quantity })),
        customer: { name: form.name, email: form.email, phone: form.phone },
        total: total,
        tax: tax,
        subtotal: totalPrice,
        status: 'completed',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('lastOrder', JSON.stringify(orderData.items));
      const history = JSON.parse(localStorage.getItem('digzoom_orders') || '[]');
      history.unshift(orderData);
      localStorage.setItem('digzoom_orders', JSON.stringify(history));

      setOrderCompleted(true);
      toast.success(lang === 'ar' ? 'تم الطلب بنجاح!' : 'Order placed successfully!');
      clearCart();
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || (lang === 'ar' ? 'فشل في إتمام الطلب' : 'Failed to complete order'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 md:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-6 overflow-x-auto whitespace-nowrap">
          <span
            className="cursor-pointer hover:text-blue-400 transition-colors flex-shrink-0"
            onClick={() => navigate('/cart')}
          >
            {t.cart.title}
          </span>
          <Arrow className="w-3 h-3 flex-shrink-0" />
          <span className="text-gray-300 flex-shrink-0">{t.checkout.title}</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">{t.checkout.title}</h1>

        {/* Trust badges row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-[#151520] rounded-xl px-3 md:px-4 py-2.5 md:py-3 border border-white/[0.04]"
            >
              <span className="text-emerald-400 flex-shrink-0">{item.icon}</span>
              <span className="text-gray-300 text-xs md:text-sm">
                {lang === 'ar' ? item.textAr : item.textEn}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Personal Info */}
            <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-4 md:p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm md:text-base">
                <span className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                {t.checkout.personalInfo}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-gray-500 text-xs md:text-sm mb-1.5 md:mb-2">{t.checkout.name}</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-colors placeholder:text-gray-700"
                    placeholder={t.checkout.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs md:text-sm mb-1.5 md:mb-2">{t.checkout.email}</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-colors placeholder:text-gray-700"
                    dir="ltr"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-500 text-xs md:text-sm mb-1.5 md:mb-2">{t.checkout.phone}</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-colors placeholder:text-gray-700"
                    placeholder={t.checkout.phonePlaceholder}
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Secure Payment Preview */}
            <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-4 md:p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm md:text-base">
                <span className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                {lang === 'ar' ? 'دفع آمن' : 'Secure Payment'}
              </h3>

              {/* Virtual secure card */}
              <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-xl p-4 md:p-6 text-white border border-white/[0.06] mb-4">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {lang === 'ar' ? 'بوابة دفع آمنة' : 'Secure Payment Gateway'}
                      </p>
                      <p className="text-xs opacity-60">
                        {lang === 'ar' ? '256-bit SSL تشفير' : '256-bit SSL Encrypted'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                <div className="bg-black/20 rounded-lg p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-6 h-6 md:w-8 md:h-8 opacity-60" />
                    <div className="flex items-center gap-1.5 md:gap-2">
                      {paymentMethods.map((pm, i) => (
                        <span
                          key={i}
                          className="text-lg md:text-xl opacity-60"
                          title={pm.name}
                        >
                          {pm.icon}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs md:text-sm opacity-50 font-mono tracking-widest">
                    •••• •••• •••• ••••
                  </div>
                </div>
              </div>

              {/* Accepted methods */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-500 text-xs md:text-sm mb-3">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" /> Apple Pay
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Visa
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Mastercard
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Mada
                </span>
              </div>

              <p className="text-gray-500 text-xs md:text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {lang === 'ar'
                  ? 'بياناتك مشفرة بالكامل. لا نحتفظ بأي معلومات دفع.'
                  : 'Your data is fully encrypted. We never store payment information.'}
              </p>
            </div>

            {/* Secure note */}
            <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 md:p-4">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-300 text-xs md:text-sm font-medium">
                  {lang === 'ar' ? 'ضمان استرجاع المبلغ خلال 30 يوم' : '30-Day Money-Back Guarantee'}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {lang === 'ar'
                    ? 'إذا لم تكن راضياً عن المنتج، سنسترجع المبلغ بالكامل بدون أسئلة.'
                    : 'If you\'re not satisfied, we\'ll refund you in full - no questions asked.'}
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-4 md:p-6 h-fit lg:sticky lg:top-24">
              <h3 className="text-white font-semibold mb-4 md:mb-6 text-sm md:text-base">{t.checkout.summary}</h3>
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 max-h-40 md:max-h-60 overflow-y-auto custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 md:w-14 md:h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs md:text-sm line-clamp-1">{item.title}</p>
                      <p className="text-gray-600 text-xs">x{item.quantity}</p>
                    </div>
                    <span className="text-gray-300 text-xs md:text-sm flex-shrink-0">
                      {item.price * item.quantity} {t.cart.currency}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 md:space-y-3 border-t border-white/[0.06] pt-3 md:pt-4">
                <div className="flex justify-between text-gray-400 text-xs md:text-sm">
                  <span>{t.cart.subtotal}</span>
                  <span>{totalPrice} {t.cart.currency}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs md:text-sm">
                  <span>{t.cart.tax}</span>
                  <span>{tax} {t.cart.currency}</span>
                </div>
                <div className="flex justify-between text-white font-bold border-t border-white/[0.06] pt-2 md:pt-3">
                  <span className="text-sm md:text-base">{t.cart.total}</span>
                  <span className="text-lg md:text-xl">{total} {t.cart.currency}</span>
                </div>
              </div>
            </div>

            {/* Pay button (mobile bottom) */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 active:scale-[0.98] text-white py-3.5 md:py-4 rounded-xl text-base md:text-lg font-medium transition-all shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {lang === 'ar' ? 'جاري معالجة الطلب...' : 'Processing order...'}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {t.checkout.pay} {total} {t.cart.currency}
                </>
              )}
            </button>

            <p className="text-gray-600 text-xs text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              {lang === 'ar' ? 'دفع آمن ومحمي' : 'Secure & Protected Payment'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
