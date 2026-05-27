import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, Zap, ShieldCheck, Headphones, RefreshCw, Star, ShoppingCart, BookOpen, Layout, Type, Palette, Video, Music, Globe, Code, Camera, Box, TrendingUp, Instagram, Youtube, MessageCircle, Play, Twitter, MessageSquare } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { categories } from '@/data/products';
import { toast } from 'sonner';
import Hero from '@/components/Hero';
import type { Product } from '@/types';

const catIcons: Record<string, React.ReactNode> = {
  pdf: <BookOpen className="w-6 h-6" />, templates: <Layout className="w-6 h-6" />,
  fonts: <Type className="w-6 h-6" />, graphics: <Palette className="w-6 h-6" />,
  videos: <Video className="w-6 h-6" />, audio: <Music className="w-6 h-6" />,
  web: <Globe className="w-6 h-6" />, code: <Code className="w-6 h-6" />,
  photos: <Camera className="w-6 h-6" />, '3d': <Box className="w-6 h-6" />,
};
const catColors: Record<string, string> = {
  pdf: 'from-blue-500/20 to-blue-900/10 border-blue-500/20 text-blue-400',
  templates: 'from-purple-500/20 to-purple-900/10 border-purple-500/20 text-purple-400',
  fonts: 'from-pink-500/20 to-pink-900/10 border-pink-500/20 text-pink-400',
  graphics: 'from-amber-500/20 to-amber-900/10 border-amber-500/20 text-amber-400',
  videos: 'from-red-500/20 to-red-900/10 border-red-500/20 text-red-400',
  audio: 'from-cyan-500/20 to-cyan-900/10 border-cyan-500/20 text-cyan-400',
  web: 'from-indigo-500/20 to-indigo-900/10 border-indigo-500/20 text-indigo-400',
  code: 'from-orange-500/20 to-orange-900/10 border-orange-500/20 text-orange-400',
  photos: 'from-emerald-500/20 to-emerald-900/10 border-emerald-500/20 text-emerald-400',
  '3d': 'from-teal-500/20 to-teal-900/10 border-teal-500/20 text-teal-400',
};
export default function Home() {
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();
  const { featured, subscriptions } = useProducts();
  const displayFeatured = featured.slice(0, 4);
  const isRTL = lang === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const handleAdd = (product: Product) => {
    addToCart(product);
    toast.success(lang === 'ar' ? `تمت إضافة "${product.title}" إلى السلة` : `"${product.title}" added to cart`);
  };

  return (
    <>
      <Hero />

      {/* BEST SELLERS - Social Media Services */}
      <section className="py-16 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a1a] to-[#0a0a0f] border-y border-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/20 rounded-full px-4 py-1.5 mb-4">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-xs font-bold tracking-wider uppercase">{lang === 'ar' ? 'الأكثر مبيعاً' : 'BEST SELLERS'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {lang === 'ar' ? 'خدمات السوشيال ميديا الأكثر طلباً' : 'Most Requested Social Media Services'}
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              {lang === 'ar' ? 'أفضل خدمات المتابعين واللايكات والمشاهدات بأسعار تنافسية وسرعة تنفيذ' : 'Best followers, likes & views services at competitive prices with fast delivery'}
            </p>
          </div>

          {/* Social Service Cards - Clickable */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {[
              { icon: <Instagram className="w-8 h-8" />, name: lang === 'ar' ? 'متابعين انستقرام' : 'Instagram Followers', color: 'from-purple-600 to-pink-600', border: 'border-purple-500/30', shadow: 'shadow-purple-500/20', price: '49', desc: lang === 'ar' ? '1000 متابع حقيقي' : '1000 Real Followers', link: '/social' },
              { icon: <Play className="w-8 h-8" />, name: lang === 'ar' ? 'مشاهدات تيك توك' : 'TikTok Views', color: 'from-cyan-500 to-blue-600', border: 'border-cyan-500/30', shadow: 'shadow-cyan-500/20', price: '29', desc: lang === 'ar' ? '10,000 مشاهدة' : '10,000 Views', link: '/social' },
              { icon: <Youtube className="w-8 h-8" />, name: lang === 'ar' ? 'مشتركين يوتيوب' : 'YouTube Subs', color: 'from-red-600 to-orange-600', border: 'border-red-500/30', shadow: 'shadow-red-500/20', price: '79', desc: lang === 'ar' ? '1000 مشترك' : '1000 Subscribers', link: '/social' },
              { icon: <MessageCircle className="w-8 h-8" />, name: lang === 'ar' ? 'لايكات واتساب' : 'WhatsApp Status', color: 'from-green-500 to-emerald-600', border: 'border-green-500/30', shadow: 'shadow-green-500/20', price: '39', desc: lang === 'ar' ? '500 مشاهدة' : '500 Views', link: '/social' },
              { icon: <Twitter className="w-8 h-8" />, name: lang === 'ar' ? 'متابعين تويتر' : 'X Followers', color: 'from-blue-500 to-indigo-600', border: 'border-blue-500/30', shadow: 'shadow-blue-500/20', price: '59', desc: lang === 'ar' ? '1000 متابع' : '1000 Followers', link: '/social' },
            ].map((service, i) => (
              <Link key={i} to={service.link} className={`group relative bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border ${service.border} p-5 hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:${service.shadow} block`}>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-4 shadow-lg mx-auto`}>
                  {service.icon}
                </div>
                <h3 className="text-white font-bold text-sm text-center mb-1">{service.name}</h3>
                <p className="text-gray-500 text-xs text-center mb-3">{service.desc}</p>
                <div className="text-center">
                  <span className="text-xl font-bold text-white">{service.price} {t.featured.currency}</span>
                </div>
                <div className={`absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-r ${service.color} animate-pulse`} />
              </Link>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/social" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-purple-500/20 transition-all">
              {lang === 'ar' ? 'تصفح جميع الخدمات' : 'Browse All Services'} <Arrow className="w-4 h-4" />
            </Link>
            <a href="https://wa.me/00966569888456" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-green-500/30 text-green-400 hover:bg-green-500/10 px-8 py-3 rounded-xl font-medium transition-all">
              <MessageSquare className="w-4 h-4" /> {lang === 'ar' ? 'طلب عبر واتساب' : 'Order via WhatsApp'}
            </a>
          </div>
        </div>
      </section>

      {/* DIGITAL MARKETING SERVICES */}
      <section className="py-16 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a1a] to-[#0a0a0f] border-y border-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-xs font-bold tracking-wider uppercase">{lang === 'ar' ? 'خدمات احترافية' : 'PROFESSIONAL SERVICES'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {lang === 'ar' ? 'خدمات التسويق الرقمي' : 'Digital Marketing Services'}
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              {lang === 'ar' ? 'خدمات تسويقية احترافية لنمو علامتك التجارية وزيادة مبيعاتك' : 'Professional marketing services to grow your brand and increase sales'}
            </p>
          </div>

          {/* Marketing Service Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {[
              { icon: <Layout className="w-8 h-8" />, name: lang === 'ar' ? 'إدارة حسابات' : 'Account Management', color: 'from-blue-600 to-indigo-600', border: 'border-blue-500/30', shadow: 'shadow-blue-500/20', price: '500', desc: lang === 'ar' ? 'إدارة كاملة شهرياً' : 'Full monthly management' },
              { icon: <Zap className="w-8 h-8" />, name: lang === 'ar' ? 'إعلانات ممولة' : 'Paid Ads', color: 'from-orange-500 to-red-600', border: 'border-orange-500/30', shadow: 'shadow-orange-500/20', price: '300', desc: lang === 'ar' ? 'حملة إعلانية واحدة' : 'One ad campaign' },
              { icon: <Palette className="w-8 h-8" />, name: lang === 'ar' ? 'تصميم محتوى' : 'Content Design', color: 'from-pink-500 to-rose-600', border: 'border-pink-500/30', shadow: 'shadow-pink-500/20', price: '200', desc: lang === 'ar' ? '10 تصاميم بوستات' : '10 post designs' },
              { icon: <Type className="w-8 h-8" />, name: lang === 'ar' ? 'كتابة محتوى' : 'Copywriting', color: 'from-emerald-500 to-teal-600', border: 'border-emerald-500/30', shadow: 'shadow-emerald-500/20', price: '150', desc: lang === 'ar' ? '20 كابشن إبداعي' : '20 creative captions' },
              { icon: <Globe className="w-8 h-8" />, name: lang === 'ar' ? 'SEO تحسين' : 'SEO Optimization', color: 'from-violet-500 to-purple-600', border: 'border-violet-500/30', shadow: 'shadow-violet-500/20', price: '250', desc: lang === 'ar' ? 'تحسين شامل للموقع' : 'Full site optimization' },
            ].map((service, i) => (
              <Link key={i} to="/marketing" className={`group relative bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border ${service.border} p-5 hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:${service.shadow} block`}>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-4 shadow-lg mx-auto`}>
                  {service.icon}
                </div>
                <h3 className="text-white font-bold text-sm text-center mb-1">{service.name}</h3>
                <p className="text-gray-500 text-xs text-center mb-3">{service.desc}</p>
                <div className="text-center">
                  <span className="text-xl font-bold text-white">{service.price} {t.featured.currency}</span>
                </div>
                <div className={`absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-r ${service.color} animate-pulse`} />
              </Link>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/marketing" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all">
              {lang === 'ar' ? 'تصفح كل الخدمات' : 'Browse All Services'} <Arrow className="w-4 h-4" />
            </Link>
            <a href="https://wa.me/00966569888456" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-green-500/30 text-green-400 hover:bg-green-500/10 px-8 py-3 rounded-xl font-medium transition-all">
              <MessageSquare className="w-4 h-4" /> {lang === 'ar' ? 'استشارة مجانية' : 'Free Consultation'}
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-orange-900/10 border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{t.stats.productsValue}</div>
              <div className="text-gray-500 text-xs">{t.stats.products}</div>
            </div>
            <div className="group">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{t.stats.customersValue}</div>
              <div className="text-gray-500 text-xs">{t.stats.customers}</div>
            </div>
            <div className="group">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{t.stats.downloadsValue}</div>
              <div className="text-gray-500 text-xs">{t.stats.downloads}</div>
            </div>
            <div className="group">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{t.stats.ratingValue}</div>
              <div className="text-gray-500 text-xs">{t.stats.rating}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t.categories.title}</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">{t.categories.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.filter(c => c.id !== 'all').map(cat => (
              <Link key={cat.id} to={`/shop?category=${cat.id}`}
                className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-b ${catColors[cat.id]} border hover:-translate-y-1 transition-all duration-300`}>
                <div className="transition-transform group-hover:scale-110">{catIcons[cat.id]}</div>
                <span className="text-white font-semibold text-sm">{lang === 'ar' ? cat.nameAr : cat.name}</span>
                <span className="text-gray-500 text-xs">{cat.count} {t.shop.products}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#0f0f1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{t.featured.title}</h2>
              <p className="text-gray-400 text-sm">{t.featured.subtitle}</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
              {t.featured.viewAll} <Arrow className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayFeatured.map(p => (
              <div key={p.id} className="group bg-[#151520] rounded-2xl border border-white/[0.04] overflow-hidden hover:border-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5">
                <Link to={`/product/${p.id}`} className="block relative">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  {p.originalPrice && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {t.shop.discount} {Math.round((1 - p.price / p.originalPrice) * 100)}%
                    </div>
                  )}
                </Link>
                <div className="p-5">
                  <Link to={`/product/${p.id}`}><h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors text-sm leading-relaxed">{p.title}</h3></Link>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-gray-300 text-xs">{p.rating}</span>
                    <span className="text-gray-600 text-xs">({p.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{p.price} {t.featured.currency}</span>
                      {p.originalPrice && <span className="text-xs text-gray-600 line-through">{p.originalPrice}</span>}
                    </div>
                    <button onClick={() => handleAdd(p)} className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center justify-center text-white transition-all">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/shop" className="text-blue-400 text-sm font-medium inline-flex items-center gap-2">
              {t.featured.viewAll} <Arrow className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t.whyUs.title}</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">{t.whyUs.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Zap className="w-6 h-6 text-blue-400" />, title: t.whyUs.f1Title, desc: t.whyUs.f1Desc },
              { icon: <ShieldCheck className="w-6 h-6 text-purple-400" />, title: t.whyUs.f2Title, desc: t.whyUs.f2Desc },
              { icon: <Headphones className="w-6 h-6 text-cyan-400" />, title: t.whyUs.f3Title, desc: t.whyUs.f3Desc },
              { icon: <RefreshCw className="w-6 h-6 text-emerald-400" />, title: t.whyUs.f4Title, desc: t.whyUs.f4Desc },
            ].map((f, i) => (
              <div key={i} className="bg-[#151520] rounded-2xl p-6 border border-white/[0.04] hover:border-white/[0.08] transition-all text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.03] mb-4 group-hover:bg-white/[0.06] transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscriptions */}
      <section className="py-16 bg-[#0f0f1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{lang === 'ar' ? 'الاشتراكات' : 'Subscriptions'}</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">{lang === 'ar' ? 'اشترك واحصل على كل المنتجات بدون حدود' : 'Subscribe and get all products with no limits'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
              <div key={sub.id} className={`bg-[#151520] rounded-2xl border p-6 ${sub.id === 'pro' ? 'border-blue-500/30 ring-2 ring-blue-500/10' : 'border-white/[0.04]'}`}>
                <h3 className="text-white font-bold text-xl mb-1">{lang === 'ar' ? sub.nameAr : sub.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{sub.desc[lang]}</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-white">{sub.monthlyPrice}</span>
                  <span className="text-gray-500">{t.featured.currency}/{lang === 'ar' ? 'شهر' : 'mo'}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {sub.features[lang].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                      <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-medium transition-all ${sub.id === 'pro' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'border border-white/10 text-white hover:bg-white/5'}`}>
                  {lang === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-orange-900/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{t.cta.title}</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">{t.cta.subtitle}</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all font-medium">
            {t.cta.btn} <Arrow className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
