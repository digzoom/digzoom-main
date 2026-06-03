import { useState, useEffect } from 'react';
import { Target, Users, Globe, Zap, Award, TrendingUp, Mail, Download, Briefcase, Layers, Building2, Headphones, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const sections = [
  { id: 'who', labelAr: 'من نحن', labelEn: 'Who We Are' },
  { id: 'offer', labelAr: 'ماذا نقدم', labelEn: 'What We Offer' },
  { id: 'identity', labelAr: 'الهوية', labelEn: 'Identity' },
  { id: 'mission', labelAr: 'الرسالة والرؤية', labelEn: 'Mission & Vision' },
  { id: 'values', labelAr: 'القيم', labelEn: 'Values' },
  { id: 'stats', labelAr: 'الإحصائيات', labelEn: 'Stats' },
];

export default function About() {
  const { t, lang } = useLanguage();
  const [activeSection, setActiveSection] = useState('who');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => ({
        id: s.id,
        el: document.getElementById(s.id),
      })).filter(s => s.el);

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const rect = sectionElements[i].el!.getBoundingClientRect();
        if (rect.top <= 120) {
          setActiveSection(sectionElements[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

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

        {/* Hero — New Logo Front */}
        <div className="text-center mb-12" id="who">
          <div className="relative inline-block mb-8">
            <img
              src="/images/digzoom-logo-front-new.jpg"
              alt="DigZoom"
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto object-contain rounded-2xl"
            />
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-orange-600/10 rounded-3xl blur-2xl -z-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t.about.title}</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed mb-4">
            {lang === 'ar'
              ? 'ديج زوم (DigZoom) منصة نمو رقمي متكاملة تجمع بين المنتجات الرقمية والخدمات التسويقية الاحترافية تحت سقف واحد.'
              : 'DigZoom is an integrated Digital Growth Platform combining digital products and professional marketing services under one roof.'}
          </p>
          <p className="text-gray-400 text-base max-w-3xl mx-auto leading-relaxed mb-4">
            {lang === 'ar'
              ? 'نساعد الأفراد والشركات على بناء حضور رقمي أقوى وتحقيق نمو مستدام من خلال المنتجات الرقمية، إدارة التسويق الرقمي، الحملات الإعلانية، تحسين محركات البحث (SEO)، تطوير المتاجر الإلكترونية، وصناعة المحتوى.'
              : 'We help individuals and businesses build a stronger digital presence and achieve sustainable growth through digital products, digital marketing management, advertising campaigns, SEO, e-commerce development, and content creation.'}
          </p>
          <p className="text-gray-400 text-base max-w-3xl mx-auto leading-relaxed mb-6">
            {lang === 'ar'
              ? 'نعمل على توفير حلول عملية تساعد عملاءنا على زيادة الظهور الرقمي وتحقيق نتائج قابلة للقياس من خلال استراتيجيات واضحة وتنفيذ احترافي ومتابعة مستمرة.'
              : 'We provide practical solutions that help our clients increase their digital visibility and achieve measurable results through clear strategies, professional execution, and continuous follow-up.'}
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-4 py-2 text-sm">
            <Mail className="w-4 h-4" /> info@digzoom.com
          </div>
        </div>

        {/* Who We Are — Quick Facts */}
        <div className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {(lang === 'ar' ? [
              { icon: <Building2 className="w-6 h-6 text-blue-400" />, title: 'شركة أمريكية مسجلة', desc: 'LLC في وايومنغ' },
              { icon: <Download className="w-6 h-6 text-emerald-400" />, title: 'تسليم رقمي آمن', desc: 'تحميل فوري بعد الدفع' },
              { icon: <Headphones className="w-6 h-6 text-purple-400" />, title: 'دعم احترافي', desc: 'رد خلال 24 ساعة' },
              { icon: <Layers className="w-6 h-6 text-cyan-400" />, title: 'منتجات رقمية', desc: 'قوالب، كتب، ملفات' },
              { icon: <ShieldCheck className="w-6 h-6 text-amber-400" />, title: 'ممارسات شفافة', desc: 'أمان وموثوقية' },
            ] : [
              { icon: <Building2 className="w-6 h-6 text-blue-400" />, title: 'U.S. Registered', desc: 'Wyoming LLC' },
              { icon: <Download className="w-6 h-6 text-emerald-400" />, title: 'Secure Delivery', desc: 'Instant downloads' },
              { icon: <Headphones className="w-6 h-6 text-purple-400" />, title: 'Pro Support', desc: '24-hour response' },
              { icon: <Layers className="w-6 h-6 text-cyan-400" />, title: 'Digital Products', desc: 'Templates, ebooks' },
              { icon: <ShieldCheck className="w-6 h-6 text-amber-400" />, title: 'Transparent', desc: 'Safe & trusted' },
            ]).map((item, i) => (
              <div key={i} className="bg-[#151520] rounded-2xl p-5 border border-white/[0.04] text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.03] mb-3">{item.icon}</div>
                <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Navigation Tabs */}
        <div className="sticky top-16 z-40 bg-[#0a0a0f]/90 backdrop-blur-xl border-y border-white/[0.04] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === s.id
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {lang === 'ar' ? s.labelAr : s.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-20" id="offer">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            {lang === 'ar' ? 'ماذا نقدم' : 'What We Offer'}
          </h2>
          <p className="text-gray-400 text-center max-w-xl mx-auto mb-10">
            {lang === 'ar'
              ? 'منصة نمو رقمي متكاملة — نجمع بين المنتجات الرقمية والخدمات التسويقية والحلول التقنية'
              : 'An integrated Digital Growth Platform — combining digital products, marketing services, and technical solutions'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Download className="w-6 h-6 text-blue-400" />, title: lang === 'ar' ? 'المنتجات الرقمية' : 'Digital Products', desc: lang === 'ar' ? 'قوالب، كتب، أدوات، دورات — آلاف المنتجات الجاهزة' : 'Templates, ebooks, tools, courses — thousands of ready products' },
              { icon: <Briefcase className="w-6 h-6 text-purple-400" />, title: lang === 'ar' ? 'التسويق الرقمي' : 'Digital Marketing', desc: lang === 'ar' ? 'إدارة حملات، SEO، إعلانات، تحليلات' : 'Campaign management, SEO, ads, analytics' },
              { icon: <Layers className="w-6 h-6 text-cyan-400" />, title: lang === 'ar' ? 'حلول النمو' : 'Growth Solutions', desc: lang === 'ar' ? 'تطوير متاجر، تحول رقمي، استشارات' : 'Store development, digital transformation, consulting' },
              { icon: <Globe className="w-6 h-6 text-emerald-400" />, title: lang === 'ar' ? 'دعم عالمي' : 'Global Support', desc: lang === 'ar' ? 'نخدم الأفراد والشركات في جميع أنحاء العالم' : 'Serving individuals and businesses worldwide' },
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
        <div className="mb-20" id="identity">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            {lang === 'ar' ? 'هوية digzoom' : 'The digzoom Identity'}
          </h2>
          <p className="text-gray-400 text-center max-w-xl mx-auto mb-10">
            {lang === 'ar'
              ? 'النمر الرقمي — رمز القوة والتقنية في عالم النمو الرقمي'
              : 'The Digital Tiger — a symbol of power and technology in digital growth'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
              <img src="/images/digzoom-logo-front-new.jpg" alt="digzoom logo front" className="w-full h-auto" />
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
              <img src="/images/digzoom-logo-side-new.jpg" alt="digzoom logo side" className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20" id="mission">
          <div className="bg-[#151520] rounded-2xl p-8 border border-white/[0.04]">
            <h2 className="text-2xl font-bold text-white mb-4">{lang === 'ar' ? 'رسالتنا' : 'Our Mission'}</h2>
            <p className="text-gray-400 leading-relaxed">
              {lang === 'ar'
                ? 'تمكين الأفراد والشركات من النمو رقمياً عبر حلول رقمية وتسويقية حديثة تجمع بين الابتكار والنتائج العملية.'
                : 'Empowering individuals and businesses to grow digitally through modern digital and marketing solutions that combine innovation with practical results.'}
            </p>
          </div>
          <div className="bg-[#151520] rounded-2xl p-8 border border-white/[0.04]">
            <h2 className="text-2xl font-bold text-white mb-4">{lang === 'ar' ? 'رؤيتنا' : 'Our Vision'}</h2>
            <p className="text-gray-400 leading-relaxed">
              {lang === 'ar'
                ? 'أن تصبح DigZoom الوجهة العربية والعالمية الرائدة للحلول الرقمية المتكاملة والشريك الموثوق للنمو الرقمي.'
                : 'To make DigZoom the leading Arabic and global destination for integrated digital solutions and the trusted partner for digital growth.'}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20" id="values">
          <h2 className="text-3xl font-bold text-white text-center mb-12">{t.about.valuesTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-[#151520] rounded-2xl p-6 border border-white/[0.04] text-center hover:border-white/[0.08] transition-all group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.03] mb-4 group-hover:bg-white/[0.06] transition-colors">{v.icon}</div>
                <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-orange-900/10 rounded-3xl border border-white/[0.04] p-10" id="stats">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {highlights.map((h, i) => (
              <div key={i} className="group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] mb-4 group-hover:bg-white/[0.06] transition-colors">{h.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{h.value}</div>
                <div className="text-gray-500 text-sm">{h.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Top */}
        <div className="text-center mt-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <TrendingUp className="w-4 h-4" />
            {lang === 'ar' ? 'العودة للأعلى' : 'Back to Top'}
          </button>
        </div>

      </div>
    </div>
  );
}
