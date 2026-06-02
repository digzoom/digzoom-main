import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import ChatBot from '@/components/ChatBot';
import { products } from '@/data/products';
import { marketingServices } from '@/data/marketingServices';
import {
  ArrowLeft, ArrowRight, Sparkles, Download, ShieldCheck, Zap,
  ShoppingCart, Star, TrendingUp, Users, Box, Headphones,
  Award, Clock, HeadphonesIcon, Lock, RefreshCw, ChevronLeft,
  LogIn, UserPlus, CheckCircle, Play, Package, BarChart3,
  Globe, Palette, Lightbulb, Camera, Megaphone, Check,
  Flame, Eye, Heart, Smartphone, Tablet, MousePointerClick,
  BookOpen, Layout, Type, Video
} from 'lucide-react';
import { toast } from 'sonner';

/* ── Bestseller products (top 8 by review count) ── */
const bestsellers = [...products]
  .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
  .slice(0, 8);

/* ── Digital Marketing Services for homepage ── */
const getAgencyServices = (lang: string) => lang === 'ar' ? [
  {
    icon: <Users className="w-7 h-7" />,
    title: 'إدارة حسابات التواصل الاجتماعي',
    desc: 'إدارة محتوى احترافية ونشر منظم لحساباتك على المنصات المختلفة',
    color: 'from-purple-600 to-blue-600',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: <Megaphone className="w-7 h-7" />,
    title: 'إدارة الحملات الإعلانية',
    desc: 'إعلانات ممولة على Google, Meta, TikTok بأداء مُحسّن',
    color: 'from-emerald-600 to-teal-600',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: <BarChart3 className="w-7 h-7" />,
    title: 'تحسين محركات البحث SEO',
    desc: 'أول نتائج Google مع استراتيجية محتوى مدروسة',
    color: 'from-blue-600 to-cyan-600',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: <Palette className="w-7 h-7" />,
    title: 'تصميم المحتوى',
    desc: 'تصاميم احترافية لمنشوراتك وStories وReels',
    color: 'from-pink-600 to-rose-600',
    bgColor: 'bg-pink-500/10 border-pink-500/20',
    iconColor: 'text-pink-400',
  },
  {
    icon: <Lightbulb className="w-7 h-7" />,
    title: 'الهوية التجارية Branding',
    desc: 'شعار، ألوان، خطوط، وهوية بصرية متكاملة لعلامتك',
    color: 'from-amber-600 to-orange-600',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: 'تصميم المتاجر الإلكترونية',
    desc: 'متجر احترافي على شوبيفاي أو ووردبريس جاهز للبيع',
    color: 'from-indigo-600 to-violet-600',
    bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
] : [
  {
    icon: <Users className="w-7 h-7" />,
    title: 'Social Media Management',
    desc: 'Professional content management and organized posting for your accounts across platforms',
    color: 'from-purple-600 to-blue-600',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: <Megaphone className="w-7 h-7" />,
    title: 'Ad Campaign Management',
    desc: 'Paid advertising on Google, Meta, TikTok with optimized performance',
    color: 'from-emerald-600 to-teal-600',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: <BarChart3 className="w-7 h-7" />,
    title: 'Search Engine Optimization',
    desc: 'Top Google results with a well-researched content strategy',
    color: 'from-blue-600 to-cyan-600',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: <Palette className="w-7 h-7" />,
    title: 'Content Design',
    desc: 'Professional designs for your posts, Stories, and Reels',
    color: 'from-pink-600 to-rose-600',
    bgColor: 'bg-pink-500/10 border-pink-500/20',
    iconColor: 'text-pink-400',
  },
  {
    icon: <Lightbulb className="w-7 h-7" />,
    title: 'Brand Identity',
    desc: 'Logo, colors, fonts, and a complete visual identity for your brand',
    color: 'from-amber-600 to-orange-600',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: 'E-commerce Store Design',
    desc: 'Professional store on Shopify or WordPress ready for selling',
    color: 'from-indigo-600 to-violet-600',
    bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
];

/* ── Why DigZoom features ── */
const getWhyFeatures = (lang: string) => lang === 'ar' ? [
  { icon: <Download className="w-6 h-6" />, title: 'تحميل فوري', desc: 'احصل على منتجاتك مباشرة بعد الدفع بدون انتظار' },
  { icon: <ShieldCheck className="w-6 h-6" />, title: 'ضمان 30 يوم', desc: 'استرجاع كامل المبلغ إذا لم تكن راضياً' },
  { icon: <RefreshCw className="w-6 h-6" />, title: 'تحديثات مجانية', desc: 'تحديثات مستمرة لجميع المنتجات بدون تكلفة إضافية' },
  { icon: <Lock className="w-6 h-6" />, title: 'دفع آمن', desc: 'كل المعاملات مشفرة ومحمية بالكامل' },
  { icon: <HeadphonesIcon className="w-6 h-6" />, title: 'دعم فني 24/7', desc: 'فريق دعم جاهز لمساعدتك في أي وقت' },
  { icon: <Award className="w-6 h-6" />, title: 'منتجات متميزة', desc: 'نختار أفضل المنتجات بعناية لضمان أعلى جودة' },
] : [
  { icon: <Download className="w-6 h-6" />, title: 'Instant Download', desc: 'Get your products immediately after payment without waiting' },
  { icon: <ShieldCheck className="w-6 h-6" />, title: '30-Day Guarantee', desc: 'Full refund if you are not satisfied' },
  { icon: <RefreshCw className="w-6 h-6" />, title: 'Free Updates', desc: 'Continuous updates for all products at no extra cost' },
  { icon: <Lock className="w-6 h-6" />, title: 'Secure Payment', desc: 'All transactions are fully encrypted and protected' },
  { icon: <HeadphonesIcon className="w-6 h-6" />, title: '24/7 Support', desc: 'Support team ready to help you at any time' },
  { icon: <Award className="w-6 h-6" />, title: 'Premium Products', desc: 'We carefully select the best products to ensure highest quality' },
];

/* ── Customer Expectations (honest first impressions) ── */
const getExpectations = (lang: string) => lang === 'ar' ? [
  { text: 'واجهة واضحة وسهلة تساعد على الوصول للمنتجات بسرعة.' },
  { text: 'المنتجات مرتبة بطريقة تساعد على الاختيار المناسب.' },
  { text: 'فكرة الجمع بين المنتجات والخدمات الرقمية مفيدة لأصحاب المشاريع.' },
  { text: 'تجربة الشراء تبدو مباشرة ومنظمة من البداية للنهاية.' },
  { text: 'التصنيفات واضحة وتسهل البحث عن نوع معين من المحتوى الرقمي.' },
  { text: 'الدعم عبر البريد يعطي إحساس بالمصداقية والاحترافية.' },
] : [
  { text: 'A clear and simple interface that helps reach products quickly.' },
  { text: 'Products are organized in a way that helps with selection.' },
  { text: 'The combination of products and digital services is useful for business owners.' },
  { text: 'The buying experience appears direct and organized from start to finish.' },
  { text: 'Categories are clear and make it easy to search for specific digital content.' },
  { text: 'Support via email gives a sense of credibility and professionalism.' },
];

/* ── Animated Counter Hook ── */
function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

/* ── Stat Counter Card ── */
function StatCounter({ end, suffix, label, icon }: { end: number; suffix: string; label: string; icon: React.ReactNode }) {
  const { count, ref } = useCountUp(end);
  return (
    <div ref={ref} className="text-center p-4 md:p-6">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/10 text-purple-400 mb-3">
        {icon}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1 tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ product, onAdd }: { product: typeof products[0]; onAdd: (p: typeof products[0]) => void }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-[#13131f] rounded-2xl border border-white/[0.04] overflow-hidden hover:border-purple-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/5 flex flex-col">
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-[4/3] overflow-hidden bg-[#1a1a2e]">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            خصم {discount}%
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          {product.rating}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors leading-relaxed min-h-[2.5rem]">
            {product.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs mb-3 line-clamp-1">{product.description}</p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">{product.price} <span className="text-sm font-normal text-gray-400">ر.س</span></span>
            {product.originalPrice && (
              <span className="text-xs text-gray-600 line-through">{product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => onAdd(product)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/20"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Service Card ── */
function ServiceCard({ service }: { service: { icon: React.ReactNode; title: string; desc: string; color: string; bgColor: string; iconColor: string } }) {
  return (
    <div className="group relative p-6 rounded-2xl border border-white/[0.04] bg-[#13131f]/80 hover:bg-[#1a1a2e] transition-all duration-300 hover:border-purple-500/20 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${service.bgColor} ${service.iconColor} mb-4 group-hover:scale-110 transition-transform`}>
        {service.icon}
      </div>
      <h3 className="text-white font-bold text-base mb-2 relative">{service.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed relative">{service.desc}</p>
    </div>
  );
}

/* ── Main Component ── */
export default function Home() {
  const { lang, t, toggleLang } = useLanguage();
  const { addToCart, totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product as any);
    toast.success(`تمت إضافة "${product.title}" إلى السلة`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* ═══════════ NAVBAR ═══════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/images/tiger-main.jpg" alt="DigZoom" className="w-9 h-9 rounded-lg object-cover" />
              <span className="text-2xl font-black tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">dig</span>
                <span className="text-white">zoom</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {[t.navbar.home, t.navbar.shop, 'خدمات التسويق', t.navbar.about].map((item, i) => (
                <Link key={i} to={['/', '/shop', '/marketing', '/about'][i]} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button onClick={toggleLang}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

              {/* Cart with count badge */}
              <Link to="/cart" className="relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Login */}
              <Link to="/login" className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                <LogIn className="w-4 h-4" />
                <span>{lang === 'ar' ? 'دخول' : 'Login'}</span>
              </Link>

              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-300">
                {mobileOpen ? <span className="text-xl">✕</span> : <span className="text-xl">☰</span>}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/5 px-4 py-4 space-y-1">
            {['الرئيسية', 'المتجر', 'خدمات التسويق', 'من نحن'].map((item, i) => (
              <Link key={i} to={['/', '/shop', '/marketing', '/about'][i]} className="block py-2.5 text-gray-300 hover:text-white font-medium" onClick={() => setMobileOpen(false)}>
                {item}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute w-[700px] h-[700px] -top-60 -left-60 bg-purple-600/6 rounded-full blur-[140px]" />
          <div className="absolute w-[600px] h-[600px] top-1/3 right-0 bg-blue-600/6 rounded-full blur-[120px]" />
          <div className="absolute w-[500px] h-[500px] bottom-0 left-1/3 bg-cyan-600/4 rounded-full blur-[100px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
          {/* Center Tiger Logo */}
          <div className="mb-6 flex justify-center">
            <div className="relative group">
              <img
                src="/images/hero-tiger.jpg"
                alt="DigZoom Tiger"
                className="w-40 h-52 sm:w-48 sm:h-60 md:w-56 md:h-72 object-cover rounded-3xl drop-shadow-[0_0_60px_rgba(59,130,246,0.4)] transition-all duration-500 group-hover:drop-shadow-[0_0_80px_rgba(139,92,246,0.6)] group-hover:scale-105"
              />
              <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-orange-600/20 rounded-full blur-3xl -z-10 animate-pulse" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-5 py-2 mb-6">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-gray-300 text-sm">{t.hero.badge || '+50 منتج رقمي مختار'}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-5 leading-[1.15] tracking-tight">
            {t.hero.title1} {t.hero.titleHighlight}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400">
              {t.hero.title2}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-base rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5 font-bold"
            >
              <Package className="w-5 h-5" />
              {t.hero.btnShop}
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link
              to="/marketing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/15 text-white hover:bg-white/5 px-8 py-4 text-base rounded-xl transition-all font-semibold bg-white/[0.02]"
            >
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              {lang === 'ar' ? 'خدمات التسويق الرقمي' : 'Digital Marketing Services'}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-gray-400 text-sm">
            {[
              { icon: <Headphones className="w-4 h-4 text-blue-400" />, text: t.hero.feature3 },
              { icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, text: lang === 'ar' ? 'منتجات رقمية أصلية' : 'Original Digital Products' },
              { icon: <Zap className="w-4 h-4 text-orange-400" />, text: t.hero.feature1 },
              { icon: <Heart className="w-4 h-4 text-pink-400" />, text: lang === 'ar' ? 'ضمان رضا العملاء' : 'Satisfaction Guarantee' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs">{lang === 'ar' ? 'اكتشف المزيد' : 'Discover More'}</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST HIGHLIGHTS ═══════════ */}
      <section className="py-10 border-y border-white/5 bg-gradient-to-b from-[#0a0a0f] to-[#0d0d18]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 md:p-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/10 text-purple-400 mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-white font-semibold text-sm md:text-base">{lang === 'ar' ? 'تجربة شراء رقمية سلسة' : 'Seamless Digital Shopping'}</div>
          </div>
          <div className="text-center p-4 md:p-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/10 text-purple-400 mb-3">
              <Box className="w-6 h-6" />
            </div>
            <div className="text-white font-semibold text-sm md:text-base">{lang === 'ar' ? 'منتجات مختارة بعناية' : 'Carefully Selected Products'}</div>
          </div>
          <div className="text-center p-4 md:p-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/10 text-purple-400 mb-3">
              <Download className="w-6 h-6" />
            </div>
            <div className="text-white font-semibold text-sm md:text-base">{lang === 'ar' ? 'تسليم رقمي منظم' : 'Organized Digital Delivery'}</div>
          </div>
          <div className="text-center p-4 md:p-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/10 text-purple-400 mb-3">
              <Headphones className="w-6 h-6" />
            </div>
            <div className="text-white font-semibold text-sm md:text-base">{lang === 'ar' ? 'دعم سريع عند الحاجة' : 'Fast Support When Needed'}</div>
          </div>
          <div className="text-center p-4 md:p-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/10 text-purple-400 mb-3">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-white font-semibold text-sm md:text-base">{lang === 'ar' ? 'مناسب للأفراد وأصحاب المشاريع' : 'For Individuals & Business Owners'}</div>
          </div>
          <div className="text-center p-4 md:p-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/10 text-purple-400 mb-3">
              <Package className="w-6 h-6" />
            </div>
            <div className="text-white font-semibold text-sm md:text-base">{lang === 'ar' ? 'باقات قابلة للتطوير' : 'Scalable Plans'}</div>
          </div>
        </div>
      </section>

      {/* ═══════════ BESTSELLER PRODUCTS ═══════════ */}
      <section className="py-16 md:py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-300 text-xs font-bold">{t.featured.badge || (lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {lang === 'ar' ? 'منتجاتنا' : 'Our'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">{t.featured.title}</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2 max-w-lg">
                {t.featured.subtitle}
              </p>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium text-sm shrink-0">
              {t.featured.viewAll}
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DIGITAL MARKETING SERVICES ═══════════ */}
      <section className="py-16 md:py-20 border-y border-white/5 bg-gradient-to-b from-[#0a0a0f] via-[#0c0c1a] to-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-xs font-bold">{lang === 'ar' ? 'وكالة تسويق رقمي' : 'Digital Marketing Agency'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              {lang === 'ar' ? 'ننمي علامتك' : 'We Grow Your Brand'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{lang === 'ar' ? 'بشكل احترافي' : 'Professionally'}</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              {lang === 'ar' ? 'لسنا مجرد متجر — نحن شريكك في النمو. فريق متخصص لإدارة حساباتك والتسويق لعلامتك.' : 'More than a store — we are your growth partner. A specialized team to manage your accounts and market your brand.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {getAgencyServices(lang).map((service, i) => (
              <ServiceCard key={i} service={service} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/marketing"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              {lang === 'ar' ? 'استعرض جميع الخدمات' : 'View All Services'}
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ WHY DIGZOOM ═══════════ */}
      <section className="py-16 md:py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
              <Award className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-xs font-bold">{t.whyUs.title}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              {lang === 'ar' ? 'ما الذي' : 'What Makes the Experience'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{lang === 'ar' ? 'يميز التجربة؟' : 'Stand Out?'}</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              {t.whyUs.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {getWhyFeatures(lang).map((f, i) => (
              <div key={i} className="group p-5 md:p-6 rounded-2xl border border-white/[0.04] bg-[#13131f]/60 hover:bg-[#1a1a2e] hover:border-blue-500/10 transition-all">
                <div className="inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/10 text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold text-sm md:text-base mb-1.5">{f.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CUSTOMER EXPECTATIONS ═══════════ */}
      <section className="py-16 md:py-20 border-y border-white/5 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a1a] to-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-4">
              <Eye className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-xs font-bold">{lang === 'ar' ? 'تجربة المستخدم' : 'User Experience'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              {lang === 'ar' ? 'ماذا يتوقع' : 'What Do'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{lang === 'ar' ? 'العملاء' : 'Customers'}</span> {lang === 'ar' ? 'من DigZoom؟' : 'Expect from DigZoom?'}
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              {lang === 'ar' ? 'انطباعات أولية عن تجربة التصفح والشراء' : 'First impressions about browsing and buying'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {getExpectations(lang).map((exp, i) => (
              <div key={i} className="group p-5 md:p-6 rounded-2xl border border-white/[0.04] bg-[#13131f]/60 hover:bg-[#1a1a2e] hover:border-purple-500/10 transition-all flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{exp.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t.categories.title}</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">{t.categories.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { id: 'pdf', name: t.categories.pdf, icon: <BookOpen className="w-6 h-6" />, count: '45+ ' + (lang === 'ar' ? 'منتج' : 'products'), color: 'from-blue-500/20 to-blue-900/10 border-blue-500/20 text-blue-400' },
              { id: 'templates', name: t.categories.templates, icon: <Layout className="w-6 h-6" />, count: '60+ ' + (lang === 'ar' ? 'منتج' : 'products'), color: 'from-purple-500/20 to-purple-900/10 border-purple-500/20 text-purple-400' },
              { id: 'fonts', name: t.categories.fonts, icon: <Type className="w-6 h-6" />, count: '30+ ' + (lang === 'ar' ? 'منتج' : 'products'), color: 'from-pink-500/20 to-pink-900/10 border-pink-500/20 text-pink-400' },
              { id: 'graphics', name: t.categories.graphics, icon: <Palette className="w-6 h-6" />, count: '50+ ' + (lang === 'ar' ? 'منتج' : 'products'), color: 'from-amber-500/20 to-amber-900/10 border-amber-500/20 text-amber-400' },
              { id: 'videos', name: t.categories.videos, icon: <Video className="w-6 h-6" />, count: '40+ ' + (lang === 'ar' ? 'منتج' : 'products'), color: 'from-red-500/20 to-red-900/10 border-red-500/20 text-red-400' },
              { id: 'code', name: t.categories.code, icon: <Zap className="w-6 h-6" />, count: '25+ ' + (lang === 'ar' ? 'منتج' : 'products'), color: 'from-orange-500/20 to-orange-900/10 border-orange-500/20 text-orange-400' },
              { id: 'audio', name: t.categories.audio, icon: <Headphones className="w-6 h-6" />, count: '20+ ' + (lang === 'ar' ? 'منتج' : 'products'), color: 'from-cyan-500/20 to-cyan-900/10 border-cyan-500/20 text-cyan-400' },
              { id: 'web', name: t.categories.web, icon: <Globe className="w-6 h-6" />, count: '15+ ' + (lang === 'ar' ? 'منتج' : 'products'), color: 'from-indigo-500/20 to-indigo-900/10 border-indigo-500/20 text-indigo-400' },
            ].map((cat) => (
              <Link key={cat.id} to={`/shop/${cat.id}`} className={`group p-5 rounded-2xl border bg-gradient-to-br ${cat.color} hover:scale-[1.02] transition-all`}>
                <div className="mb-3">{cat.icon}</div>
                <div className="font-semibold text-white text-sm">{cat.name}</div>
                <div className="text-gray-400 text-xs mt-1">{cat.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600/8 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <img src="/images/tiger-main.jpg" alt="" className="w-16 h-16 mx-auto mb-6 opacity-50 rounded-xl object-cover" />
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            {t.cta.title}
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            {t.cta.subtitle}
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-base rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5 font-bold">
            <MousePointerClick className="w-5 h-5" />
            {t.cta.btn}
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-white/5 bg-[#0a0a0f] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/images/tiger-main.jpg" alt="" className="w-7 h-7 rounded-md object-cover" />
                <span className="text-2xl font-black">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">dig</span>
                  <span className="text-white">zoom</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{t.footer.desc}</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">{lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4>
              <div className="space-y-2 text-sm">
                {[t.navbar.home, t.navbar.shop, t.navbar.about, t.contact.title].map((item, i) => (
                  <Link key={i} to={['/', '/shop', '/about', '/contact'][i]} className="block text-gray-500 hover:text-white transition-colors">{item}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">{lang === 'ar' ? 'خدماتنا' : 'Our Services'}</h4>
              <div className="space-y-2 text-sm">
                <Link to="/marketing" className="block text-gray-500 hover:text-white transition-colors">{lang === 'ar' ? 'التسويق الرقمي' : 'Digital Marketing'}</Link>
                <Link to="/shop?category=templates" className="block text-gray-500 hover:text-white transition-colors">{t.categories.templates}</Link>
                <Link to="/shop?category=code" className="block text-gray-500 hover:text-white transition-colors">{t.categories.code}</Link>
                <Link to="/shop?category=graphics" className="block text-gray-500 hover:text-white transition-colors">{t.categories.graphics}</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">{lang === 'ar' ? 'القانونية' : 'Legal'}</h4>
              <div className="space-y-2 text-sm">
                <Link to="/privacy" className="block text-gray-500 hover:text-white transition-colors">{t.footer.privacy}</Link>
                <Link to="/terms" className="block text-gray-500 hover:text-white transition-colors">{t.footer.terms}</Link>
                <Link to="/refund" className="block text-gray-500 hover:text-white transition-colors">{lang === 'ar' ? 'سياسة الاسترجاع' : 'Refund Policy'}</Link>
                <Link to="/trust-security" className="block text-gray-500 hover:text-white transition-colors">{lang === 'ar' ? 'الأمان والثقة' : 'Trust & Security'}</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">{t.footer.copyright}</p>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/privacy" className="text-gray-600 hover:text-gray-400 transition-colors">{t.footer.privacy}</Link>
              <Link to="/terms" className="text-gray-600 hover:text-gray-400 transition-colors">{t.footer.terms}</Link>
              <Link to="/refund" className="text-gray-600 hover:text-gray-400 transition-colors">{lang === 'ar' ? 'الاسترجاع' : 'Refund'}</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ChatBot Widget */}
      <ChatBot />
    </div>
  );
}
