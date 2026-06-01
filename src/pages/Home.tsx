import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  ArrowLeft, ArrowRight, Sparkles, Download, ShieldCheck, Zap,
  ShoppingCart, Instagram, Youtube, Twitter, MessageSquare,
  Send, Globe, Video, Ghost, Facebook, Radio, Heart,
  BookOpen, Layout, Type, Palette, Star, TrendingUp,
  Users, Box, Headphones, ChevronDown, Menu, X,
  Award, Clock, HeadphonesIcon, Lock, RefreshCw, ChevronLeft,
  LogIn, UserPlus
} from 'lucide-react';

/* ───────── data ───────── */
const platforms = [
  { id: 'instagram', name: 'انستقرام', icon: <Instagram className="w-5 h-5" />, color: 'from-pink-500 to-purple-600' },
  { id: 'tiktok', name: 'تيك توك', icon: <Video className="w-5 h-5" />, color: 'from-gray-800 to-black' },
  { id: 'youtube', name: 'يوتيوب', icon: <Youtube className="w-5 h-5" />, color: 'from-red-500 to-red-700' },
  { id: 'twitter', name: 'تويتر / X', icon: <Twitter className="w-5 h-5" />, color: 'from-blue-400 to-blue-600' },
  { id: 'snapchat', name: 'سناب شات', icon: <Ghost className="w-5 h-5" />, color: 'from-yellow-400 to-yellow-600' },
  { id: 'facebook', name: 'فيسبوك', icon: <Facebook className="w-5 h-5" />, color: 'from-blue-600 to-blue-800' },
  { id: 'whatsapp', name: 'واتساب', icon: <MessageSquare className="w-5 h-5" />, color: 'from-green-500 to-green-700' },
  { id: 'telegram', name: 'تيليجرام', icon: <Send className="w-5 h-5" />, color: 'from-blue-400 to-cyan-500' },
  { id: 'jaco', name: 'جاكو', icon: <Radio className="w-5 h-5" />, color: 'from-orange-400 to-red-500' },
  { id: 'likee', name: 'لايكي', icon: <Heart className="w-5 h-5" />, color: 'from-rose-500 to-pink-600' },
];

const categories = [
  { id: 'pdf', name: 'كتب PDF', icon: <BookOpen className="w-6 h-6" />, count: '45+ منتج', color: 'from-blue-500/20 to-blue-900/10 border-blue-500/20 text-blue-400' },
  { id: 'templates', name: 'قوالب', icon: <Layout className="w-6 h-6" />, count: '60+ منتج', color: 'from-purple-500/20 to-purple-900/10 border-purple-500/20 text-purple-400' },
  { id: 'fonts', name: 'خطوط', icon: <Type className="w-6 h-6" />, count: '30+ منتج', color: 'from-pink-500/20 to-pink-900/10 border-pink-500/20 text-pink-400' },
  { id: 'graphics', name: 'جرافيكس', icon: <Palette className="w-6 h-6" />, count: '50+ منتج', color: 'from-amber-500/20 to-amber-900/10 border-amber-500/20 text-amber-400' },
  { id: 'videos', name: 'فيديوهات', icon: <Video className="w-6 h-6" />, count: '40+ منتج', color: 'from-red-500/20 to-red-900/10 border-red-500/20 text-red-400' },
  { id: 'code', name: 'أكواد', icon: <Zap className="w-6 h-6" />, count: '25+ منتج', color: 'from-orange-500/20 to-orange-900/10 border-orange-500/20 text-orange-400' },
  { id: 'audio', name: 'صوتيات', icon: <Headphones className="w-6 h-6" />, count: '20+ منتج', color: 'from-cyan-500/20 to-cyan-900/10 border-cyan-500/20 text-cyan-400' },
  { id: 'web', name: 'ويب', icon: <Globe className="w-6 h-6" />, count: '15+ منتج', color: 'from-indigo-500/20 to-indigo-900/10 border-indigo-500/20 text-indigo-400' },
];

const stats = [
  { icon: <Box className="w-6 h-6" />, value: '300+', label: 'منتج رقمي' },
  { icon: <Users className="w-6 h-6" />, value: '10K+', label: 'عميل سعيد' },
  { icon: <ShieldCheck className="w-6 h-6" />, value: '99.9%', label: 'ضمان الجودة' },
  { icon: <Download className="w-6 h-6" />, value: '50K+', label: 'تحميل' },
];

/* ── Why DigZoom ── */
const whyFeatures = [
  { icon: <Download className="w-6 h-6" />, titleAr: 'تحميل فوري', titleEn: 'Instant Download', descAr: 'احصل على منتجاتك مباشرة بعد الدفع بدون انتظار', descEn: 'Get your products immediately after payment, no waiting' },
  { icon: <ShieldCheck className="w-6 h-6" />, titleAr: 'ضمان 30 يوم', titleEn: '30-Day Guarantee', descAr: 'استرجاع كامل المبلغ إذا لم تكن راضياً', descEn: 'Full refund if you are not satisfied' },
  { icon: <RefreshCw className="w-6 h-6" />, titleAr: 'تحديثات مجانية', titleEn: 'Free Updates', descAr: 'تحديثات مستمرة لجميع المنتجات بدون تكلفة إضافية', descEn: 'Continuous updates for all products at no extra cost' },
  { icon: <Lock className="w-6 h-6" />, titleAr: 'دفع آمن', titleEn: 'Secure Payment', descAr: 'كل المعاملات مشفرة ومحمية بالكامل', descEn: 'All transactions are fully encrypted and protected' },
  { icon: <HeadphonesIcon className="w-6 h-6" />, titleAr: 'دعم على مدار الساعة', titleEn: '24/7 Support', descAr: 'فريق دعم جاهز لمساعدتك في أي وقت', descEn: 'Support team ready to help you anytime' },
  { icon: <Award className="w-6 h-6" />, titleAr: 'منتجات متميزة', titleEn: 'Premium Products', descAr: 'نختار أفضل المنتجات بعناية لضمان أعلى جودة', descEn: 'We carefully select the best products for highest quality' },
];

/* ── Testimonials ── */
const testimonials = [
  { name: 'محمد السيد', role: 'صانع محتوى', avatar: 'م', text: 'أفضل سوق عربي للمنتجات الرقمية. جودة المنتجات ممتازة والدعم سريع جداً. أنصح الجميع بالتجربة!' },
  { name: 'سارة أحمد', role: 'مصممة جرافيك', avatar: 'س', text: 'قوالب التصميم رائعة وتوفر عليّ ساعات طويلة من العمل. أسعار منافسة جداً مقارنة بالمواقع الأجنبية.' },
  { name: 'عبدالله الخالد', role: 'مسوق إلكتروني', avatar: 'ع', text: 'منتجات PLR ساعدتني في بناء مشروعي الخاص بسرعة. التحميل فوري والجودة ممتازة. شكراً digzoom!' },
  { name: 'نورة الفهد', role: 'مدونة', avatar: 'ن', text: 'القوالب والتصاميم الرقمية ممتازة والجودة عالية. وفرت عليّ الكثير من الوقت في إعداد محتوى احترافي.' },
  { name: 'خالد المنصور', role: 'مطور تطبيقات', avatar: 'خ', text: 'مكتبة الأكواد والتقنيات شاملة ومحدثة. وفرت عليّ الكثير من الوقت في تطوير مشاريعي.' },
  { name: 'فاطمة الزهراء', role: 'صاحبة متجر', avatar: 'ف', text: 'الكتب الإلكترونية والقوالب ساعدتني في تطوير متجري الإلكتروني. تجربة شراء سلسة ودعم رائع.' },
];

/* ───────── component ───────── */
export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* ─── Navbar ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-black tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">dig</span>
              <span className="text-white">zoom</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {['الرئيسية', 'المتجر', 'سوشال ميديا', 'من نحن'].map((item, i) => (
                <Link key={i} to={['/', '/shop', '/social', '/about'][i]} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <ShoppingCart className="w-5 h-5" />
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-300">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/5 px-4 py-4">
            {['الرئيسية', 'المتجر', 'سوشال ميديا', 'من نحن'].map((item, i) => (
              <Link key={i} to={['/', '/shop', '/social', '/about'][i]} className="block py-2 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>
                {item}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-[85vh] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] -top-40 -left-40 bg-purple-600/8 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute w-[500px] h-[500px] top-1/2 right-0 bg-blue-600/8 rounded-full blur-[100px]" />
          <div className="absolute w-[400px] h-[400px] bottom-0 left-1/3 bg-cyan-600/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-20 pb-12">
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-5 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300 text-sm">أكثر من 300 منتج رقمي مميز</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            سوق{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400">
              المنتجات الرقمية
            </span>
            <br />
            الأول في العالم العربي
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            اكتشف آلاف المنتجات الرقمية الجاهزة — كتب، قوالب، كورسات، ومنتجات PLR. اشتري مرة واستفيد مدى الحياة.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/shop" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-base rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5 font-semibold">
              تصفح المنتجات
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link to="/about" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/10 text-white hover:bg-white/5 px-8 py-4 text-base rounded-xl transition-all font-medium">
              {lang === 'ar' ? 'تعرف علينا' : 'About Us'}
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2"><Download className="w-4 h-4 text-blue-400" /><span>تحميل فوري</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-purple-400" /><span>ضمان 30 يوم</span></div>
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-orange-400" /><span>تحديثات مجانية</span></div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-12 border-y border-white/5 bg-gradient-to-b from-[#0a0a0f] to-[#0f0a1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/10 text-purple-400 mb-3">
                {s.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">تصفح حسب القسم</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">اختر من بين 10 أقسام متنوعة من المنتجات الرقمية</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/shop/${cat.id}`} className={`group p-5 rounded-2xl border bg-gradient-to-br ${cat.color} hover:scale-[1.02] transition-all`}>
                <div className="mb-3">{cat.icon}</div>
                <div className="font-semibold text-white text-sm">{cat.name}</div>
                <div className="text-gray-400 text-xs mt-1">{cat.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why DigZoom ─── */}
      <section className="py-16 md:py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
              <Award className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-xs font-bold">لماذا digzoom؟</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              سوق المنتجات الرقمية <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">الأول في العالم العربي</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              نقدم لك تجربة شراء سلسة وآمنة مع أفضل المنتجات الرقمية المختارة بعناية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {whyFeatures.map((f, i) => (
              <div key={i} className="group p-5 md:p-6 rounded-2xl border border-white/[0.04] bg-[#151520]/50 hover:bg-[#151520] hover:border-blue-500/10 transition-all">
                <div className="inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/10 text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold text-sm md:text-base mb-1.5">{f.titleAr}</h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{f.descAr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-16 md:py-20 border-y border-white/5 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a1a] to-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-4">
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-xs font-bold">آراء العملاء</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              ما يقوله <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">عملاؤنا</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              انضم لآلاف العملاء السعداء الذين يثقون بـ digzoom
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="group p-5 md:p-6 rounded-2xl border border-white/[0.04] bg-[#151520]/50 hover:bg-[#151520] hover:border-purple-500/10 transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-4 md:mb-5">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { value: '4.9', labelAr: 'متوسط التقييم', labelEn: 'Average Rating', icon: <Star className="w-4 h-4" /> },
              { value: '10K+', labelAr: 'عميل سعيد', labelEn: 'Happy Customers', icon: <Users className="w-4 h-4" /> },
              { value: '300+', labelAr: 'منتج رقمي', labelEn: 'Digital Products', icon: <Box className="w-4 h-4" /> },
              { value: '99.9%', labelAr: 'نسبة الرضا', labelEn: 'Satisfaction Rate', icon: <Heart className="w-4 h-4" /> },
            ].map((s, i) => (
              <div key={i} className="text-center p-4 md:p-5 bg-[#151520]/50 rounded-2xl border border-white/[0.04]">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 text-purple-400 mb-2">
                  {s.icon}
                </div>
                <div className="text-xl md:text-2xl font-bold text-white mb-0.5">{s.value}</div>
                <div className="text-gray-500 text-xs">{s.labelAr}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Auth CTA ─── */}
      <section className="py-16 relative overflow-hidden border-y border-white/5">
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            انضم لـ <span className="text-blue-400">digzoom</span> مجاناً
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            أنشئ حسابك الآن واحصل على خصم 20% على أول طلب
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all text-base">
              <UserPlus className="w-5 h-5" />
              حساب جديد مجاني
            </Link>
            <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 px-8 py-3.5 rounded-xl font-medium transition-all text-base">
              <LogIn className="w-5 h-5" />
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            جاهز تبدأ رحلتك في عالم المنتجات الرقمية؟
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            انضم لأكثر من 10,000 عميل سعيد. اشتري مرة واستفيد مدى الحياة.
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-base rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5 font-semibold">
            تصفح المنتجات الآن
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 bg-[#0a0a0f] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-black mb-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">dig</span>
                <span className="text-white">zoom</span>
              </div>
              <p className="text-gray-500 text-sm">أكبر سوق عربي للمنتجات الرقمية. اشتري مرة واستفيد مدى الحياة.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">روابط سريعة</h4>
              <div className="space-y-2 text-sm">
                {['الرئيسية', 'المتجر', 'من نحن', 'تواصل معنا'].map((item, i) => (
                  <Link key={i} to={['/', '/shop', '/about', '/contact'][i]} className="block text-gray-500 hover:text-white transition-colors">{item}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">المتجر</h4>
              <div className="space-y-2 text-sm">
                <Link to="/shop?category=pdf" className="block text-gray-500 hover:text-white transition-colors">كتب إلكترونية</Link>
                <Link to="/shop?category=templates" className="block text-gray-500 hover:text-white transition-colors">قوالب</Link>
                <Link to="/shop?category=graphics" className="block text-gray-500 hover:text-white transition-colors">تصاميم</Link>
                <Link to="/shop?category=videos" className="block text-gray-500 hover:text-white transition-colors">فيديوهات</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">القانونية</h4>
              <div className="space-y-2 text-sm">
                <Link to="/privacy" className="block text-gray-500 hover:text-white transition-colors">سياسة الخصوصية</Link>
                <Link to="/terms" className="block text-gray-500 hover:text-white transition-colors">شروط الاستخدام</Link>
                <Link to="/refund" className="block text-gray-500 hover:text-white transition-colors">سياسة الاسترجاع</Link>
                <Link to="/delivery" className="block text-gray-500 hover:text-white transition-colors">سياسة التسليم</Link>
                <Link to="/acceptable-use" className="block text-gray-500 hover:text-white transition-colors">سياسة الاستخدام</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© 2025 DigZoom. info@digzoom.com</p>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/privacy" className="text-gray-600 hover:text-gray-400 transition-colors">سياسة الخصوصية</Link>
              <Link to="/terms" className="text-gray-600 hover:text-gray-400 transition-colors">شروط الاستخدام</Link>
              <Link to="/refund" className="text-gray-600 hover:text-gray-400 transition-colors">الاسترجاع</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
