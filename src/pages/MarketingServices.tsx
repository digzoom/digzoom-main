import { useState } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import {
  TrendingUp, Package, Zap, Check, CheckCircle,
  Stethoscope, ShoppingBag, Building2, Rocket, GraduationCap,
  BarChart3, Megaphone, Search, PenTool, Store, FileText,
  MessageCircle, ArrowLeft, Sparkles, Phone, User, Briefcase,
  Wallet, ChevronDown, ChevronUp, Users
} from 'lucide-react';

export default function MarketingServices() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [formOpen, setFormOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const t = {
    heroTitle: isAr ? 'نُدير نمو أعمالك رقمياً لتتفرغ لتطوير مشروعك' : 'We Manage Your Digital Growth So You Can Focus on Your Business',
    heroSubtitle: isAr ? 'من إدارة التسويق الرقمي والحملات الإعلانية إلى تطوير المتاجر الإلكترونية وتحسين محركات البحث وصناعة المحتوى، نوفر لك منظومة متكاملة للنمو الرقمي.' : 'From digital marketing and advertising campaigns to e-commerce development, SEO, and content creation — we provide an integrated digital growth ecosystem.',
    ctaConsult: isAr ? 'احجز استشارة مجانية' : 'Book Free Consultation',
    ctaQuote: isAr ? 'اطلب عرض سعر' : 'Request a Quote',

    pillar1Title: isAr ? 'المنتجات الرقمية' : 'Digital Products',
    pillar1Desc: isAr ? 'قوالب، كتب، أدوات، دورات — آلاف المنتجات الجاهزة' : 'Templates, ebooks, tools, courses — thousands of ready-made products',
    pillar2Title: isAr ? 'الخدمات التسويقية' : 'Marketing Services',
    pillar2Desc: isAr ? 'إدارة حملات، SEO، إعلانات، تحليلات' : 'Campaign management, SEO, ads, analytics',
    pillar3Title: isAr ? 'حلول النمو الرقمي' : 'Growth Solutions',
    pillar3Desc: isAr ? 'تطوير متاجر، تحول رقمي، استشارات' : 'Store development, digital transformation, consulting',

    sectorsTitle: isAr ? 'من نخدم؟' : 'Who We Serve?',
    whyTitle: isAr ? 'لماذا DigZoom؟' : 'Why DigZoom?',
    servicesTitle: isAr ? 'الخدمات التسويقية' : 'Marketing Services',
    howTitle: isAr ? 'كيف نعمل؟' : 'How We Work?',
    pricingTitle: isAr ? 'الباقات الشهرية' : 'Monthly Plans',
    ecosystemTitle: isAr ? 'منظومة DigZoom' : 'The DigZoom Ecosystem',
    processTitle: isAr ? 'ماذا يحدث بعد التواصل معنا؟' : 'What Happens After You Contact Us?',
    faqTitle: isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions',
    formTitle: isAr ? 'نموذج طلب خطة نمو مجانية' : 'Request a Free Growth Plan',
    formSubmit: isAr ? 'اطلب خطة نمو مجانية' : 'Request Free Growth Plan',
  };

  const sectors = [
    { icon: <Stethoscope className="w-7 h-7" />, title: isAr ? 'القطاع الطبي' : 'Healthcare', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { icon: <ShoppingBag className="w-7 h-7" />, title: isAr ? 'المتاجر الإلكترونية' : 'E-commerce', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { icon: <Building2 className="w-7 h-7" />, title: isAr ? 'الشركات والمؤسسات' : 'Corporations', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { icon: <Rocket className="w-7 h-7" />, title: isAr ? 'المشاريع الناشئة' : 'Startups', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { icon: <GraduationCap className="w-7 h-7" />, title: isAr ? 'الخبراء وصناع المحتوى' : 'Experts & Creators', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ];

  const whyItems = [
    isAr ? 'منتجات رقمية وخدمات تسويقية في منصة واحدة' : 'Digital products & marketing in one platform',
    isAr ? 'استراتيجيات مبنية على البيانات' : 'Data-driven strategies',
    isAr ? 'حلول قابلة للتوسع' : 'Scalable solutions',
    isAr ? 'شريك نمو طويل المدى' : 'Long-term growth partner',
  ];

  const services = [
    { icon: <Users className="w-6 h-6" />, title: isAr ? 'إدارة حسابات التواصل الاجتماعي' : 'Social Media Management', desc: isAr ? 'إدارة محترفة لجميع المنصات' : 'Professional management for all platforms' },
    { icon: <Megaphone className="w-6 h-6" />, title: isAr ? 'إدارة الحملات الإعلانية' : 'Ad Campaign Management', desc: isAr ? 'Google Ads, Meta, TikTok, Snapchat' : 'Google Ads, Meta, TikTok, Snapchat' },
    { icon: <Search className="w-6 h-6" />, title: isAr ? 'تحسين محركات البحث SEO' : 'Search Engine Optimization', desc: isAr ? 'تحسين الظهور في نتائج البحث' : 'Improve search visibility' },
    { icon: <PenTool className="w-6 h-6" />, title: isAr ? 'صناعة المحتوى الإبداعي' : 'Creative Content Creation', desc: isAr ? 'تصميم، فيديو، كتابة، وإنتاج' : 'Design, video, writing, production' },
    { icon: <Store className="w-6 h-6" />, title: isAr ? 'تطوير وتحسين المتاجر الإلكترونية' : 'eCommerce Development', desc: isAr ? 'Shopify, WooCommerce, Custom' : 'Shopify, WooCommerce, Custom' },
    { icon: <BarChart3 className="w-6 h-6" />, title: isAr ? 'التحليلات والتقارير' : 'Analytics & Reporting', desc: isAr ? 'تقارير أداء دورية وتحليلات' : 'Periodic performance reports' },
  ];

  const howSteps = [
    { num: '01', title: isAr ? 'تحليل النشاط والمنافسين' : 'Analyze Business & Competitors', desc: isAr ? 'دراسة شاملة لسوقك ومنافسيك' : 'Comprehensive study of your market & competitors' },
    { num: '02', title: isAr ? 'بناء استراتيجية النمو' : 'Build Growth Strategy', desc: isAr ? 'خطة عمل مخصصة لأهدافك' : 'Custom action plan for your goals' },
    { num: '03', title: isAr ? 'التنفيذ والتشغيل' : 'Execution & Launch', desc: isAr ? 'تنفيذ الاستراتيجية بكفاءة' : 'Execute the strategy efficiently' },
    { num: '04', title: isAr ? 'المتابعة والتحسين المستمر' : 'Monitor & Optimize', desc: isAr ? 'تقييم الأداء وتحسين النتائج' : 'Evaluate performance & improve results' },
  ];

  const plans = [
    {
      name: isAr ? 'باقة الانطلاق' : 'Starter Plan',
      price: '2,999',
      period: isAr ? 'ريال / شهر' : 'SAR / month',
      features: [isAr ? 'إدارة منصتين' : '2 Platform Management', isAr ? 'محتوى شهري' : 'Monthly Content', isAr ? 'تقارير أداء' : 'Performance Reports'],
      highlight: false,
    },
    {
      name: isAr ? 'باقة النمو' : 'Growth Plan',
      price: '5,999',
      period: isAr ? 'ريال / شهر' : 'SAR / month',
      features: [isAr ? 'إدارة 4 منصات' : '4 Platform Management', isAr ? 'حملات إعلانية' : 'Ad Campaigns', isAr ? 'SEO أساسي' : 'Basic SEO', isAr ? 'تقارير احترافية' : 'Professional Reports'],
      highlight: true,
      badge: isAr ? 'الأكثر طلباً' : 'Most Popular',
    },
    {
      name: isAr ? 'باقة الشريك الرقمي' : 'Digital Partner',
      price: '9,999',
      period: isAr ? 'ريال / شهر' : 'SAR / month',
      features: [isAr ? 'إدارة كاملة' : 'Full Management', isAr ? 'محتوى متقدم' : 'Advanced Content', isAr ? 'إعلانات' : 'Ads', isAr ? 'SEO' : 'SEO', isAr ? 'مدير حساب مخصص' : 'Dedicated Account Manager', isAr ? 'لوحة متابعة' : 'Dashboard'],
      highlight: false,
    },
  ];

  const processSteps = [
    { num: '1', title: isAr ? 'حجز الاستشارة' : 'Book Consultation' },
    { num: '2', title: isAr ? 'دراسة النشاط' : 'Study Your Business' },
    { num: '3', title: isAr ? 'إعداد الخطة' : 'Prepare the Plan' },
    { num: '4', title: isAr ? 'بدء التنفيذ والمتابعة' : 'Execute & Monitor' },
  ];

  const faqs = [
    { q: isAr ? 'هل العقود شهرية؟' : 'Are contracts monthly?', a: isAr ? 'نعم، جميع باقاتنا شهرية بدون التزام طويل المدى. يمكنك الإلغاء في أي وقت.' : 'Yes, all our plans are monthly with no long-term commitment. You can cancel anytime.' },
    { q: isAr ? 'هل يمكن تخصيص الباقات؟' : 'Can plans be customized?', a: isAr ? 'بالتأكيد! نصمم حلولاً مخصصة تناسب احتياجات عملك و ميزانيتك.' : 'Absolutely! We design custom solutions tailored to your business needs and budget.' },
    { q: isAr ? 'هل تشمل الباقات إدارة الإعلانات؟' : 'Do plans include ad management?', a: isAr ? 'باقة النمو والشريك الرقمي تشمل إدارة الإعلانات. باقة الانطلاق تركز على المحتوى والتنظيم.' : 'Growth and Digital Partner plans include ad management. Starter focuses on content & management.' },
    { q: isAr ? 'متى تظهر نتائج SEO؟' : 'When do SEO results show?', a: isAr ? 'عادة بين 3 إلى 6 أشهر حسب المنافسة والنشاط. نقدم تقارير شهرية توضح التقدم.' : 'Typically 3 to 6 months depending on competition. We provide monthly progress reports.' },
    { q: isAr ? 'كيف أتابع الأداء والتقارير؟' : 'How do I track performance?', a: isAr ? 'نوفر تقارير أداء دورية ولوحة متابعة لباقة الشريك الرقمي.' : 'We provide periodic performance reports and a dashboard for Digital Partner plan.' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-16">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0">
          <div className="absolute w-[600px] h-[600px] top-0 right-0 bg-blue-600/5 rounded-full blur-[120px]" />
          <div className="absolute w-[500px] h-[500px] bottom-0 left-0 bg-purple-600/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm">{isAr ? 'خدمات النمو الرقمي' : 'Digital Growth Services'}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all">
              <Phone className="w-5 h-5" /> {t.ctaConsult} <ArrowLeft className="w-5 h-5" />
            </Link>
            <button onClick={() => setFormOpen(!formOpen)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/15 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/5 transition-all">
              <Briefcase className="w-5 h-5 text-emerald-400" /> {t.ctaQuote}
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════ 3 PILLARS ═══════════ */}
      <section className="py-14 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Package className="w-8 h-8" />, title: t.pillar1Title, desc: t.pillar1Desc, color: 'from-blue-500/10 to-blue-600/5 border-blue-500/10 text-blue-400' },
              { icon: <TrendingUp className="w-8 h-8" />, title: t.pillar2Title, desc: t.pillar2Desc, color: 'from-purple-500/10 to-purple-600/5 border-purple-500/10 text-purple-400' },
              { icon: <Zap className="w-8 h-8" />, title: t.pillar3Title, desc: t.pillar3Desc, color: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/10 text-emerald-400' },
            ].map((p, i) => (
              <div key={i} className={`bg-gradient-to-b ${p.color} rounded-2xl p-6 border text-center`}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.03] mb-4">{p.icon}</div>
                <h3 className="text-white font-bold mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHO WE SERVE ═══════════ */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">{t.sectorsTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {sectors.map((s, i) => (
              <div key={i} className={`${s.color} rounded-2xl p-5 border text-center`}>
                <div className="inline-flex items-center justify-center mb-3">{s.icon}</div>
                <div className="text-white font-semibold text-sm">{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY DIGZOOM ═══════════ */}
      <section className="py-14 bg-gradient-to-b from-[#0a0a0f] to-[#0d0d18]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">{t.whyTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whyItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#151520] rounded-xl p-4 border border-white/[0.04]">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SERVICES ═══════════ */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">{t.servicesTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div key={i} className="bg-[#151520] rounded-2xl p-6 border border-white/[0.04] hover:border-white/[0.08] transition-all group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 text-purple-400 mb-4">{s.icon}</div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW WE WORK ═══════════ */}
      <section className="py-14 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">{t.howTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howSteps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">{step.num}</div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
                {i < 3 && <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">{t.pricingTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-8 border ${plan.highlight ? 'border-purple-500/30 bg-gradient-to-b from-purple-500/[0.05] to-transparent' : 'border-white/[0.04] bg-[#151520]'} text-center`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">{plan.badge}</div>
                )}
                <h3 className="text-xl font-bold text-white mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm block">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 text-right">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setFormOpen(true)} className={`w-full py-3 rounded-xl font-bold transition-all ${plan.highlight ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'border border-white/15 text-white hover:bg-white/5'}`}>
                  {isAr ? 'اختر الباقة' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ECOSYSTEM ═══════════ */}
      <section className="py-14 bg-gradient-to-b from-[#0d0d18] to-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{t.ecosystemTitle}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            {isAr ? 'تجمع منظومتنا بين المنتجات الرقمية والخدمات التسويقية وحلول النمو الرقمي في منصة واحدة متكاملة.' : 'Our ecosystem combines digital products, marketing services, and growth solutions in one integrated platform.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['📦 ' + (isAr ? 'المنتجات الرقمية' : 'Digital Products'), '📈 ' + (isAr ? 'الخدمات التسويقية' : 'Marketing Services'), '🚀 ' + (isAr ? 'حلول النمو' : 'Growth Solutions')].map((item, i) => (
              <div key={i} className="bg-[#151520] rounded-xl px-6 py-3 border border-white/[0.04] text-white font-medium">{item}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PROCESS ═══════════ */}
      <section className="py-14 border-y border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">{t.processTitle}</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {processSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">{step.num}</div>
                <span className="text-gray-300 text-sm font-medium">{step.title}</span>
                {i < 3 && <div className="hidden md:block w-8 h-0.5 bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <section className="py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{isAr ? 'ابدأ نموك الرقمي اليوم' : 'Start Your Digital Growth Today'}</h2>
          <p className="text-gray-400 mb-8">
            {isAr ? 'تواصل معنا مباشرة عبر واتساب أو اطلب استشارة مجانية' : 'Contact us directly via WhatsApp or request a free consultation'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold transition-all">
              <MessageCircle className="w-5 h-5" /> {isAr ? 'تحدث معنا عبر واتساب' : 'Chat on WhatsApp'}
            </a>
            <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold transition-all">
              <Phone className="w-5 h-5" /> {isAr ? 'اطلب استشارة مجانية' : 'Request Free Consultation'}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">{t.faqTitle}</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#151520] rounded-xl border border-white/[0.04] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-right">
                  <span className="text-white font-medium text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ STICKY MOBILE CTA ═══════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/[0.06] px-4 py-3 flex items-center gap-2">
        <Link to="/contact" className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold text-sm">
          <Phone className="w-4 h-4" /> {isAr ? 'استشارة مجانية' : 'Free Consultation'}
        </Link>
        <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 px-4 rounded-xl font-bold text-sm">
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>

      {/* Spacer for mobile sticky CTA */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
