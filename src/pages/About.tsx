import { Target, Users, Globe, Zap, Award, TrendingUp, Mail, Download, Briefcase, Layers } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function About() {
  const { t } = useLanguage();

  const values = [
    { icon: <Target className="w-6 h-6 text-blue-400" />, title: t.about.v1Title, desc: t.about.v1Desc },
    { icon: <Users className="w-6 h-6 text-purple-400" />, title: t.about.v2Title, desc: t.about.v2Desc },
    { icon: <Globe className="w-6 h-6 text-cyan-400" />, title: t.about.v3Title, desc: t.about.v3Desc },
    { icon: <Zap className="w-6 h-6 text-orange-400" />, title: t.about.v4Title, desc: t.about.v4Desc },
  ];
  const highlights = [
    { icon: <Award className="w-8 h-8 text-blue-400" />, value: t.about.stat1Value, label: t.about.stat1 },
    { icon: <Users className="w-8 h-8 text-purple-400" />, value: t.about.stat2Value, label: t.about.stat2 },
    { icon: <TrendingUp className="w-8 h-8 text-emerald-400" />, value: t.about.stat3Value, label: t.about.stat3 },
    { icon: <Globe className="w-8 h-8 text-orange-400" />, value: t.about.stat4Value, label: t.about.stat4 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">{t.about.title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">{t.about.heroText}</p>
          <div className="mt-6 inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-4 py-2 text-sm">
            <Mail className="w-4 h-4" /> info@digzoom.com
          </div>
        </div>

        {/* What We Offer — Stripe Compliance Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            {t.lang === 'ar' ? 'ماذا نقدم' : 'What We Offer'}
          </h2>
          <p className="text-gray-400 text-center max-w-xl mx-auto mb-10">
            {t.lang === 'ar'
              ? 'نحن سوق رقمي متخصص في المنتجات والملفات الرقمية القابلة للتحميل'
              : 'We are a digital marketplace specializing in downloadable digital products and files'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Download className="w-6 h-6 text-blue-400" />, title: t.lang === 'ar' ? 'تنزيلات رقمية' : 'Digital Downloads', desc: t.lang === 'ar' ? 'قوالب، تصاميم، ملفات جرافيك جاهزة للتحميل الفوري' : 'Templates, designs, and graphic files available for instant download' },
              { icon: <Briefcase className="w-6 h-6 text-purple-400" />, title: t.lang === 'ar' ? 'موارد الأعمال' : 'Business Resources', desc: t.lang === 'ar' ? 'خطط أعمال، نماذج احترافية، أدلة تعليمية' : 'Business plans, professional templates, educational guides' },
              { icon: <Layers className="w-6 h-6 text-cyan-400" />, title: t.lang === 'ar' ? 'قوالب وقوالب' : 'Templates & Assets', desc: t.lang === 'ar' ? 'قوالب فيديو، ملفات صوتية، كتب إلكترونية' : 'Video templates, audio files, ebooks' },
              { icon: <Globe className="w-6 h-6 text-emerald-400" />, title: t.lang === 'ar' ? 'دعم عالمي' : 'Global Support', desc: t.lang === 'ar' ? 'نخدم الأفراد والشركات في جميع أنحاء العالم' : 'Serving individuals and businesses worldwide' },
            ].map((item, i) => (
              <div key={i} className="bg-[#151520] rounded-2xl p-6 border border-white/[0.04] text-center hover:border-white/[0.08] transition-all group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.03] mb-4 group-hover:bg-white/[0.06] transition-colors">{item.icon}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Identity */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            {t.lang === 'ar' ? 'هوية digzoom' : 'The digzoom Identity'}
          </h2>
          <p className="text-gray-400 text-center max-w-xl mx-auto mb-10">
            {t.lang === 'ar'
              ? 'النمر الرقمي — رمز القوة والتقنية في عالم المنتجات الرقمية'
              : 'The Digital Tiger — a symbol of power and technology in the digital products world'}
          </p>
          <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden border-2 border-purple-500/20 shadow-2xl shadow-purple-500/10">
            <img
              src="/images/digzoom-brand.jpg"
              alt="digzoom brand identity - Digital Tiger"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">{t.about.mission}</h2>
              <p className="text-gray-400 leading-relaxed">{t.about.missionText}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">{t.about.vision}</h2>
              <p className="text-gray-400 leading-relaxed">{t.about.visionText}</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
            <img src="/images/brand-mockup.jpg" alt="digzoom brand" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">{t.about.valuesTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-[#151520] rounded-2xl p-6 border border-white/[0.04] text-center hover:border-white/[0.08] transition-all group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.03] mb-4 group-hover:bg-white/[0.06] transition-colors">
                  {v.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-orange-900/10 rounded-3xl border border-white/[0.04] p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {highlights.map((h, i) => (
              <div key={i} className="group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] mb-4 group-hover:bg-white/[0.06] transition-colors">
                  {h.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{h.value}</div>
                <div className="text-gray-500 text-sm">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
