import { useLanguage } from '@/hooks/useLanguage';
import { Package, Clock, Download, Mail } from 'lucide-react';

export default function DeliveryPolicy() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const sections = [
    {
      icon: <Download className="w-6 h-6 text-blue-400" />,
      title: isAr ? 'تسليم فوري' : 'Instant Delivery',
      text: isAr
        ? 'جميع منتجاتنا رقمية 100٪. بمجرد إتمام عملية الدفع بنجاح، يتم إرسال رابط التنزيل إلى بريدك الإلكتروني فوراً. لا توجد منتجات فيزيائية يتم شحنها.'
        : 'All our products are 100% digital. Upon successful payment, a download link is sent to your email immediately. No physical products are shipped.',
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-400" />,
      title: isAr ? 'وقت التسليم' : 'Delivery Time',
      text: isAr
        ? 'المنتجات الرقمية: فوري — خلال دقائق من الدفع. الخدمات الرقمية: يتم تحديد المدة عند الطلب. الاشتراكات: فورية عند الدفع.'
        : 'Digital products: Instant — within minutes of payment. Digital services: Duration specified at order. Subscriptions: Instant upon payment.',
    },
    {
      icon: <Package className="w-6 h-6 text-emerald-400" />,
      title: isAr ? 'طريقة التسليم' : 'Delivery Method',
      text: isAr
        ? 'يتم التسليم عبر: رابط تنزيل مباشر في صفحة تأكيد الطلب — نسخة احتياطية مرسلة إلى البريد الإلكتروني — دخول دائم عبر حسابك في قسم "طلباتي"'
        : 'Delivery via: Direct download link on order confirmation page — Backup copy sent to your email — Permanent access through your account under "My Orders"',
    },
    {
      icon: <Mail className="w-6 h-6 text-amber-400" />,
      title: isAr ? 'الدعم والمساعدة' : 'Support & Assistance',
      text: isAr
        ? 'في حال واجهت أي مشكلة في التنزيل أو الوصول للمنتج، يرجى التواصل معنا على info@digzoom.com — نرد خلال 24 ساعة عمل.'
        : 'If you encounter any issues downloading or accessing your product, please contact us at info@digzoom.com — we respond within 24 business hours.',
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
              ? 'جميع منتجاتنا رقمية — تسليم فوري بعد الدفع'
              : 'All our products are digital — instant delivery after payment'}
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
              ? 'DigZoom لا يبيع أي منتجات فيزيائية. جميع المنتجات رقمية وقابلة للتحميل. بمجرد إتمام عملية الدفع، لا يمكن إلغاء الطلب أو استرجاع المبلغ باستثناء الحالات المذكورة في سياسة الاسترجاع. تأكد من صحة بريدك الإلكتروني قبل إتمام عملية الشراء.'
              : 'DigZoom does not sell any physical products. All products are digital and downloadable. Once payment is complete, orders cannot be cancelled or refunded except in cases outlined in our Refund Policy. Please ensure your email address is correct before completing your purchase.'}
          </p>
        </div>
      </div>
    </div>
  );
}
