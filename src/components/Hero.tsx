import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, Download, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function Hero() {
  const { lang, t } = useLanguage();
  const isRTL = lang === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center">
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-20 pb-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-5 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300 text-sm">
            {lang === 'ar' ? 'أكثر من 300 منتج رقمي مميز' : '300+ Premium Digital Products'}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
          {t.hero.title1}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400">
            {t.hero.titleHighlight}
          </span>
          <br />
          {t.hero.title2}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t.hero.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-base rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5 font-semibold"
          >
            {t.hero.btnShop}
            <Arrow className="w-5 h-5" />
          </Link>
          <Link
            to="/social"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/10 text-white hover:bg-white/5 px-8 py-4 text-base rounded-xl transition-all font-medium"
          >
            {lang === 'ar' ? 'خدمات السوشيال ميديا' : 'Social Media Services'}
          </Link>
        </div>

        {/* Features */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-400" />
            <span>{t.hero.feature1}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>{t.hero.feature2}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span>{t.hero.feature3}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
