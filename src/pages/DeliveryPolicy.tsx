import { useLanguage } from '@/hooks/useLanguage';
import { Package, Clock, Download, Mail } from 'lucide-react';

export default function DeliveryPolicy() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const sections = [
    {
      icon: <Download className="w-6 h-6 text-blue-400" />,
      title: isAr ? 'تسليم بعد تأكيد الدفع' : 'Delivery after payment confirmation',
      text: isAr
        ? 'منتجات المتجر رقمية. بعد تأكيد الدفع، تحصل على رابط تنزيل آمن في صفحة تأكيد الطلب، وتظهر مشتريات الحساب في «طلباتي». لا تُشحن منتجات المتجر ماديًا.'
        : 'Store products are digital. After payment is verified, a secure download is available on the order confirmation page. Account purchases also appear in My Orders. Store products are not physically shipped.',
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-400" />,
      title: isAr ? 'وقت التسليم' : 'Delivery Time',
      text: isAr
        ? 'المنتجات الرقمية المؤهلة: خلال دقائق من تأكيد الدفع. الخدمات: حسب المدة المكتوبة في الباقة أو العرض المعتمد. لا توجد اشتراكات منتجات مفعّلة حالياً.'
        : 'Eligible digital products: within minutes of verified payment. Services: according to the plan or approved proposal. Product subscriptions are not currently active.',
    },
    {
      icon: <Package className="w-6 h-6 text-emerald-400" />,
      title: isAr ? 'طريقة التسليم' : 'Delivery Method',
      text: isAr
        ? 'يمكنك التنزيل من صفحة تأكيد الطلب دون إنشاء حساب، أو من «طلباتي» إذا اشتريت بحسابك. الرابط مؤقت لمدة دقيقتين، ويسمح لكل منتج بخمس محاولات تنزيل ما لم يذكر وصفه خلاف ذلك.'
        : 'Download from the order confirmation page without creating an account, or from My Orders if you purchased while signed in. Each link expires after two minutes, with five download attempts per product unless stated otherwise.',
    },
    {
      icon: <Mail className="w-6 h-6 text-amber-400" />,
      title: isAr ? 'الدعم والمساعدة' : 'Support & Assistance',
      text: isAr
        ? 'في حال واجهت أي مشكلة في التنزيل أو الوصول للمنتج، يرجى التواصل معنا على info@digzoom.com. تُراجع رسائل الدعم خلال ساعات العمل.'
        : 'If you encounter any issues downloading or accessing your product, please contact us at info@digzoom.com. Support messages are reviewed during business hours.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            {isAr ? 'سياسة التسليم' : 'Delivery Policy'}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {isAr
              ? 'جميع منتجاتنا رقمية — ويبدأ التسليم الآلي عند تفعيل الدفع'
              : 'All our products are digital — automated delivery starts when payments go live'}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-4 py-2 text-sm">
            <Package className="w-4 h-4" />
            {isAr ? 'لا يوجد شحن — منتجات رقمية فقط' : 'No shipping — digital products only'}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((s, i) => (
            <div key={i} className="bg-[#151520] rounded-2xl p-6 border border-white/[0.04]">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/[0.03] flex-shrink-0">{s.icon}</div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{s.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Note */}
        <div className="mt-8 bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6">
          <h3 className="text-blue-400 font-bold mb-2">{isAr ? 'ملاحظة مهمة' : 'Important Note'}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isAr
              ? 'DigZoom لا يبيع منتجات فيزيائية. لا يمكن تنزيل الملف قبل تأكيد الدفع، وتخضع الإلغاءات والاسترجاعات للحالات المكتوبة في سياسة الاسترجاع. يمكن للضيف تنزيل ملفاته بأمان من صفحة تأكيد الدفع، بينما يلزم تسجيل الدخول فقط للوصول لاحقًا إلى «طلباتي».'
              : 'DigZoom sells no physical goods. Files cannot be downloaded before payment confirmation, and cancellations or refunds follow the published Refund Policy. Guests can securely download from the payment-confirmation page; sign-in is only required for later access through “My Orders”.'}
          </p>
        </div>
      </div>
    </div>
  );
}
