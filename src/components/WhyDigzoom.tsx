import { Zap, Shield, Headphones, RefreshCw } from 'lucide-react';

const features = [
  { icon: Zap, titleAr: 'تحميل فوري', titleEn: 'Instant Download', descAr: 'احصل على منتجاتك فوراً بعد إتمام الدفع — لا انتظار', descEn: 'Get your products immediately after payment' },
  { icon: Shield, titleAr: 'ضمان استرجاع', titleEn: 'Money Back Guarantee', descAr: '30 يوم ضمان استرجاع كامل إذا لم تكن راضياً', descEn: '30-day full refund if not satisfied' },
  { icon: Headphones, titleAr: 'دعم 24/7', titleEn: '24/7 Support', descAr: 'فريق دعم متاح على مدار الساعة لمساعدتك', descEn: 'Support team available around the clock' },
  { icon: RefreshCw, titleAr: 'تحديثات مجانية', titleEn: 'Free Updates', descAr: 'احصل على كل التحديثات الجديدة بدون أي تكلفة إضافية', descEn: 'Get all new updates at no extra cost' },
];

export default function WhyDigzoom({ lang }: { lang: 'ar' | 'en' }) {
  const t = (a: string, e?: string) => lang === 'ar' ? a : e || a;
  return (
    <section className="py-16 px-4 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">{t('لماذا digzoom؟', 'Why digzoom?')}</h2>
          <p className="text-gray-400">{t('نقدم تجربة شراء سلسة ومميزات حصارية لكل عملائنا', 'We offer a seamless shopping experience and exclusive features')}</p>
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
