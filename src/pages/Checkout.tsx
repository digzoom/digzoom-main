import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  CreditCard, ShieldCheck, Lock, ArrowLeft, ArrowRight,
  Loader2, Shield, Clock, Headphones, Award, CheckCircle,
  Smartphone, Globe, Tag, X
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { productTitle } from '@/lib/i18n';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { trpc } from '@/providers/trpc';
import { toast } from 'sonner';

const CHECKOUT_ENABLED = import.meta.env.VITE_CHECKOUT_ENABLED === 'true';

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
  { icon: <Award className="w-4 h-4" />, textAr: 'سياسة استرجاع واضحة', textEn: 'Clear Refund Policy' },
  { icon: <Headphones className="w-4 h-4" />, textAr: 'رد خلال يوم عمل', textEn: 'Reply within one business day' },
];

export default function Checkout() {
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { user } = useSupabaseAuth();
  const isRTL = lang === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<null | {
    code: string;
    discountPercent: number;
    discountAmount: number;
    totalAmount: number;
    subtotal: number;
  }>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Auto-fill from logged-in user
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const createOrder = trpc.createOrder.useMutation({
    onError: (error) => {
      toast.error(lang === 'ar' ? 'فشل في إنشاء الطلب: ' + error.message : 'Failed to create order: ' + error.message);
      setLoading(false);
    },
  });

  const validateCoupon = trpc.validateCoupon.useMutation({
    onError: (error) => {
      setAppliedCoupon(null);
      toast.error(lang === 'ar' ? 'الكوبون غير صالح أو منتهي' : 'Coupon is invalid or expired');
      console.error('Coupon validation error:', error.message);
    },
  });

  // Do not collect Saudi VAT unless the business is registered and legally
  // required to do so. Stripe Tax can replace this when payments go live.
  const tax = 0;
  const discount = appliedCoupon?.discountAmount || 0;
  const total = Math.max(0, totalPrice - discount + tax);

  useEffect(() => {
    if (appliedCoupon && appliedCoupon.subtotal !== totalPrice) {
      setAppliedCoupon(null);
    }
  }, [totalPrice, appliedCoupon]);

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      toast.error(lang === 'ar' ? 'أدخل كود الخصم' : 'Enter a coupon code');
      return;
    }
    try {
      const result = await validateCoupon.mutateAsync({
        code,
        items: items.map(item => ({ product_id: item.id, quantity: item.quantity })),
      });
      setCouponCode(result.code || code);
      setAppliedCoupon({
        code: result.code || code,
        discountPercent: result.discountPercent,
        discountAmount: result.discountAmount,
        totalAmount: result.totalAmount,
        subtotal: result.subtotal,
      });
      toast.success(lang === 'ar' ? `تم تطبيق خصم ${result.discountPercent}%` : `${result.discountPercent}% discount applied`);
    } catch {
      // Error feedback is handled by the mutation callback.
    }
  };

  // Redirect old success URLs
  if (window.location.hash.includes('/checkout/success')) {
    navigate('/thank-you', { replace: true });
    return null;
  }

  // A live checkout should send an empty cart back to the cart page. While
  // payments are disabled, keep this route visible so visitors get a clear,
  // honest status message instead of an apparently blank page.
  if (items.length === 0 && CHECKOUT_ENABLED) {
    navigate('/cart');
    return null;
  }

  const handleCheckout = async () => {
    if (!CHECKOUT_ENABLED) {
      toast.info(
        lang === 'ar'
          ? 'الدفع الإلكتروني غير متاح مؤقتًا. لن يتم إنشاء أي طلب أو خصم أي مبلغ.'
          : 'Online payment is temporarily unavailable. No order or charge will be created.'
      );
      return;
    }

    const finalName = form.name || user?.name || '';
    const finalEmail = form.email || user?.email || '';
    const finalPhone = form.phone.trim();
    if (!finalEmail.trim() || !finalName.trim() || !finalPhone) {
      toast.error(lang === 'ar' ? 'يرجى ملء الاسم والبريد الإلكتروني ورقم الجوال' : 'Please fill in name, email, and phone');
      return;
    }

    setLoading(true);

    try {
      const result = await createOrder.mutateAsync({
        customer_name: finalName.trim(),
        customer_email: finalEmail.trim().toLowerCase(),
        customer_phone: finalPhone,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          title: productTitle(item, lang),
        })),
        subtotal: totalPrice,
        tax_amount: tax,
        total_amount: total,
        discount_amount: discount,
        coupon_code: appliedCoupon?.code,
        coupon_discount: appliedCoupon?.discountPercent || 0,
      });

      // Store minimal order reference for thank-you page
      localStorage.setItem('lastOrderId', result.orderId);
      localStorage.setItem('lastOrderEmail', finalEmail.trim().toLowerCase());
      if (!result.checkoutUrl) throw new Error('Missing secure checkout URL');
      window.location.assign(result.checkoutUrl);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || (lang === 'ar' ? 'فشل في إتمام الطلب' : 'Failed to complete order'));
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

        {/* Trust badges row — shown only when the verified checkout is enabled */}
        {CHECKOUT_ENABLED && <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8">
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
        </div>}

        {!CHECKOUT_ENABLED && (
          <div className="mb-6 md:mb-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 md:p-5">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-300" />
              <div>
                <h2 className="font-semibold text-amber-200">
                  {lang === 'ar' ? 'الدفع الإلكتروني غير متاح مؤقتًا' : 'Online payment is temporarily unavailable'}
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-300">
                  {lang === 'ar'
                    ? 'نعمل على ربط بوابة الدفع. لن يتم إنشاء طلب أو خصم أي مبلغ خلال هذه الفترة.'
                    : 'We are connecting the payment gateway. No order or charge will be created during this time.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {!CHECKOUT_ENABLED && items.length === 0 && (
          <div className="mb-6 rounded-2xl border border-white/[0.06] bg-[#151520] p-5 text-center">
            <p className="text-sm leading-6 text-gray-300">
              {lang === 'ar'
                ? 'يمكنك تصفح المنتجات الآن، وسيُفتح إتمام الطلب بعد تفعيل بوابة الدفع.'
                : 'You can browse products now. Checkout will open after the payment gateway is activated.'}
            </p>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="mt-4 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              {lang === 'ar' ? 'تصفح المنتجات' : 'Browse products'}
            </button>
          </div>
        )}

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
                    readOnly={!!user?.email}
                    className={`w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors placeholder:text-gray-700 ${
                      user?.email
                        ? 'bg-white/[0.01] border border-white/[0.03] text-gray-400 cursor-not-allowed'
                        : 'bg-white/[0.03] border border-white/[0.06] focus:border-blue-500/40'
                    }`}
                    dir="ltr"
                  />
                  {user?.email && (
                    <span className="text-[10px] text-gray-600 mt-1 block">
                      {lang === 'ar' ? 'يتم استخدام بريد حسابك' : 'Using your account email'}
                    </span>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-500 text-xs md:text-sm mb-1.5 md:mb-2">{t.checkout.phone}</label>
                  <input
                    type="tel"
                    required
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
            {CHECKOUT_ENABLED && <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-4 md:p-6">
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
            </div>}

            {/* Secure note */}
            {CHECKOUT_ENABLED && <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 md:p-4">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-300 text-xs md:text-sm font-medium">
                  {lang === 'ar' ? 'طلبات الاسترجاع تخضع للسياسة المنشورة' : 'Refund requests follow the published policy'}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {lang === 'ar'
                    ? 'يمكن طلب الاسترجاع خلال 30 يومًا للحالات المؤهلة الموضحة في سياسة الاسترجاع.'
                    : 'Refunds may be requested within 30 days for eligible cases described in our Refund Policy.'}
                </p>
              </div>
            </div>}
          </div>

          {/* Summary */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-4 md:p-6 h-fit lg:sticky lg:top-24">
              <h3 className="text-white font-semibold mb-4 md:mb-6 text-sm md:text-base">{t.checkout.summary}</h3>
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 max-h-40 md:max-h-60 overflow-y-auto custom-scrollbar">
                {items.map(item => {
                  const title = productTitle(item, lang);
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={title}
                        className="w-10 h-10 md:w-14 md:h-14 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs md:text-sm line-clamp-1">{title}</p>
                        <p className="text-gray-600 text-xs">x{item.quantity}</p>
                      </div>
                      <span className="text-gray-300 text-xs md:text-sm flex-shrink-0">
                        {item.price * item.quantity} {t.cart.currency}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2 md:space-y-3 border-t border-white/[0.06] pt-3 md:pt-4">
                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    {lang === 'ar' ? 'كود الخصم' : 'Coupon code'}
                  </label>
                  <div className="flex gap-2" dir="ltr">
                    <div className="relative min-w-0 flex-1">
                      <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                      <input
                        value={couponCode}
                        onChange={(event) => {
                          setCouponCode(event.target.value.toUpperCase());
                          if (appliedCoupon) setAppliedCoupon(null);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            void handleApplyCoupon();
                          }
                        }}
                        placeholder={lang === 'ar' ? 'أدخل الكود' : 'Enter code'}
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm uppercase text-white outline-none transition focus:border-blue-500/50"
                      />
                    </div>
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponCode('');
                        }}
                        className="rounded-xl border border-white/[0.08] px-3 text-gray-400 transition hover:text-white"
                        aria-label={lang === 'ar' ? 'إزالة الكوبون' : 'Remove coupon'}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={validateCoupon.isPending || items.length === 0}
                        className="rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
                      >
                        {validateCoupon.isPending
                          ? (lang === 'ar' ? 'جاري...' : 'Applying...')
                          : (lang === 'ar' ? 'تطبيق' : 'Apply')}
                      </button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {lang === 'ar'
                        ? `تم تطبيق ${appliedCoupon.code} — خصم ${appliedCoupon.discountPercent}%`
                        : `${appliedCoupon.code} applied — ${appliedCoupon.discountPercent}% off`}
                    </p>
                  )}
                </div>
                <div className="flex justify-between text-gray-400 text-xs md:text-sm">
                  <span>{t.cart.subtotal}</span>
                  <span>{totalPrice} {t.cart.currency}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs md:text-sm">
                  <span>{t.cart.tax}</span>
                  <span>{tax} {t.cart.currency}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400 text-xs md:text-sm">
                    <span>{lang === 'ar' ? `الخصم (${appliedCoupon.discountPercent}%)` : `Discount (${appliedCoupon.discountPercent}%)`}</span>
                    <span>-{discount} {t.cart.currency}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold border-t border-white/[0.06] pt-2 md:pt-3">
                  <span className="text-sm md:text-base">{t.cart.total}</span>
                  <span className="text-lg md:text-xl">{total} {t.cart.currency}</span>
                </div>
              </div>
            </div>

            {/* Pay button (mobile bottom) */}
            <button
              onClick={handleCheckout}
              disabled={loading || !CHECKOUT_ENABLED}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 active:scale-[0.98] text-white py-3.5 md:py-4 rounded-xl text-base md:text-lg font-medium transition-all shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2"
            >
              {!CHECKOUT_ENABLED ? (
                <>
                  <Clock className="w-4 h-4" />
                  {lang === 'ar' ? 'الدفع غير متاح مؤقتًا' : 'Payment temporarily unavailable'}
                </>
              ) : loading ? (
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

            {CHECKOUT_ENABLED && (
              <p className="text-gray-600 text-xs text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {lang === 'ar' ? 'دفع آمن ومحمي' : 'Secure & Protected Payment'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
