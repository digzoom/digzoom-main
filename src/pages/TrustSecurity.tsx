import { useLanguage } from '@/hooks/useLanguage';
import { ShieldCheck, Lock, Eye, Headphones, RotateCcw, CreditCard, Building2, CheckCircle } from 'lucide-react';

export default function TrustSecurity() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const features = [
    {
      icon: <Lock className="w-8 h-8 text-emerald-400" />,
      title: isAr ? 'تسليم رقمي آمن' : 'Secure Digital Delivery',
      desc: isAr
        ? 'جميع المنتجات الرقمية يتم تسليمها عبر روابط تحميل مشفرة وآمنة. بمجرد إتمام الدفع، يصلك المنتج فوراً عبر بريدك الإلكتروني وحسابك الشخصي.'
        : 'All digital products are delivered via encrypted and secure download links. Once payment is complete, your product is delivered instantly via email and your personal account.',
    },
    {
      icon: <Eye className="w-8 h-8 text-blue-400" />,
      title: isAr ? 'الخصوصية وحماية البيانات' : 'Privacy & Data Protection',
      desc: isAr
        ? 'نحن نلتزم بأعلى معايير حماية البيانات. لا نشارك بياناتك مع أطراف ثالثة. يتم تشفير جميع المعاملات باستخدام SSL/TLS لضمان أمان معلوماتك.'
        : 'We adhere to the highest data protection standards. We do not share your data with third parties. All transactions are encrypted using SSL/TLS to ensure your information remains secure.',
    },
    {
      icon: <Building2 className="w-8 h-8 text-purple-400" />,
      title: isAr ? 'كيان تجاري موثق' : 'Verified Business Entity',
      desc: isAr
        ? 'DigZoom شركة مسجلة رسمياً في ولاية وايومنغ، الولايات المتحدة الأمريكية. نعمل بشفافية ونلتزم بالقوانين الأمريكية والدولية.'
        : 'DigZoom is an officially registered company in the State of Wyoming, United States. We operate transparently and comply with U.S. and international laws.',
    },
    {
      icon: <Headphones className="w-8 h-8 text-amber-400" />,
      title: isAr ? 'دعم العملاء' : 'Customer Support',
      desc: isAr
        ? 'فريق دعم متخصص جاهز لمساعدتك على مدار الساعة. نرد على جميع الاستفسارات خلال 24 ساعة عمل عبر البريد الإلكتروني.'
        : 'A dedicated support team ready to assist you around the clock. We respond to all inquiries within 24 business hours via email.',
    },
    {
      icon: <RotateCcw className="w-8 h-8 text-cyan-400" />,
      title: isAr ? 'سياسة استرجاع شفافة' : 'Transparent Refund Policy',
      desc: isAr
        ? 'نحن واثقون من جودة منتجاتنا. إذا واجهت أي مشكلة مع منتجك، يرجى مراجعة سياسة الاسترجاع الخاصة بنا للحصول على المساعدة.'
        : 'We are confident in the quality of our products. If you encounter any issues with your purchase, please review our refund policy for assistance.',
    },
    {
      icon: <CreditCard className="w-8 h-8 text-rose-400" />,
      title: isAr ? 'عملية دفع آمنة' : 'Secure Checkout Process',
      desc: isAr
        ? 'تتم جميع المدفوعات عبر بوابات دفع مشفرة وموثوقة. لا نقوم بتخزين بيانات بطاقتك الائتمانية على خوادمنا.'
        : 'All payments are processed through encrypted and trusted payment gateways. We do not store your credit card details on our servers.',
    },
  ];

  const badges = [
    { icon: <ShieldCheck className="w-5 h-5" />, text: isAr ? 'SSL مفعل' : 'SSL Enabled' },
    { icon: <CheckCircle className="w-5 h-5" />, text: isAr ? 'شركة مسجلة أمريكياً' : 'U.S. Registered' },
    { icon: <Lock className="w-5 h-5" />, text: isAr ? 'مدفوعات مشفرة' : 'Encrypted Payments' },
    { icon: <Eye className="w-5 h-5" />, text: isAr ? 'حماية البيانات' : 'Data Protected' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">
            {isAr ? 'الثقة والأمان' : 'Trust & Security'}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {isAr
              ? 'نحن نأخذ أمانك وخصوصيتك على محمل الجد. DigZoom منصة آمنة وموثوقة للتجارة الرقمية'
              : 'We take your security and privacy seriously. DigZoom is a secure and trusted digital commerce platform'}
          </p>
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {badges.map((b, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-2 text-emerald-400 text-sm">
                {b.icon} {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-[#151520] rounded-2xl p-6 border border-white/[0.04] hover:border-white/[0.08] transition-all group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/[0.03] flex-shrink-0 group-hover:bg-white/[0.06] transition-colors">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-white/[0.04] rounded-2xl p-8 text-center">
          <h3 className="text-white font-bold text-xl mb-3">
            {isAr ? 'هل لديك استفسار؟' : 'Have a Question?'}
          </h3>
          <p className="text-gray-400 mb-4">
            {isAr ? 'فريقنا جاهز لمساعدتك في أي استفسار' : 'Our team is ready to help with any inquiry'}
          </p>
          <a href="mailto:info@digzoom.com" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            info@digzoom.com
          </a>
        </div>
      </div>
    </div>
  );
}
