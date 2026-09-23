import { Zap, Shield, Headphones, RefreshCw } from 'lucide-react';

const features = [
  { icon: Zap, titleAr: 'تسليم رقمي محمي', titleEn: 'Protected Digital Delivery', descAr: 'يظهر رابط مؤقت في حسابك بعد تأكيد الدفع عند إطلاق البوابة', descEn: 'A temporary link appears in your account after verified payment once checkout launches' },
  { icon: Shield, titleAr: 'سياسة استرجاع واضحة', titleEn: 'Clear Refund Policy', descAr: 'طلبات الاسترجاع المؤهلة تُراجع وفق السياسة المنشورة', descEn: 'Eligible refund requests are reviewed under our published policy' },
  { icon: Headphones, titleAr: 'دعم عبر البريد', titleEn: 'Email Support', descAr: 'نراجع رسائل الدعم خلال ساعات العمل', descEn: 'We review support messages during business hours' },
  { icon: RefreshCw, titleAr: 'وصف واضح قبل الشراء', titleEn: 'Clear Before You Buy', descAr: 'تعرف محتوى الملف وصيغته وحدود الاستخدام قبل الطلب', descEn: 'Review the file contents, format, and usage terms before ordering' },
];

export default function WhyDigzoom({ lang }: { lang: 'ar' | 'en' }) {
  const t = (a: string, e?: string) => lang === 'ar' ? a : e || a;
  return (
    <section className="py-16 px-4 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">{t('لماذا digzoom؟', 'Why digzoom?')}</h2>
          <p className="text-gray-400">{t('تفاصيل واضحة، ملفات محمية، ودعم يمكن الوصول إليه عند الحاجة', 'Clear details, protected files, and support when you need it')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-[#151520] border border-white/[0.04] rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-white font-bold mb-2">{lang === 'ar' ? f.titleAr : f.titleEn}</h3>
              <p className="text-gray-400 text-sm">{lang === 'ar' ? f.descAr : f.descEn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
