import { Link } from 'react-router';

export default function CTASection({ lang }: { lang: 'ar' | 'en' }) {
  const t = (a: string, e?: string) => lang === 'ar' ? a : e || a;
  return (
    <section className="py-16 px-4 border-t border-white/[0.04]">
      <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-12">
        <h2 className="text-3xl font-bold text-white mb-4">{t('جاهز تبدأ رحلتك الرقمية؟', 'Ready to start your digital journey?')}</h2>
        <p className="text-gray-400 mb-8">{t('انضم لآلاف العملاء السعداء واكتشف عالم المنتجات الرقمية اليوم', 'Join thousands of happy customers and discover digital products today')}</p>
        <Link to="/shop" className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all">
          {t('ابدأ التسوق الآن', 'Start Shopping Now')}
        </Link>
      </div>
    </section>
  );
}
