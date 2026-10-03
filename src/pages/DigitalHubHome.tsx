import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Gift,
  Headphones,
  ShieldCheck,
  ShoppingCart,
  Tag,
  UploadCloud,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { useCart } from "@/hooks/useCart";
import { productDescription, productTitle } from "@/lib/i18n";
import { toast } from "sonner";
import { storefrontSections } from "@/data/storefrontSections";
import SectionCard from "@/components/SectionCard";

export default function DigitalHubHome() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const Arrow = ar ? ArrowLeft : ArrowRight;
  const { products, categories: dbCategories, loading } = useSupabaseProducts();
  const { addToCart } = useCart();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      image: "/images/digzoom/digital-products-live.webp",
      eyebrow: ar ? "DIGZOOM STORE" : "DIGZOOM STORE",
      title: ar ? "كل ما تحتاجه رقميًا" : "Everything digital you need",
      accent: ar ? "في مكان واحد." : "in one place.",
      text: ar ? "منتجات رقمية وأدوات أعمال وخدمات تساعدك على الإنجاز والنمو." : "Digital products, business tools, and services that help you work and grow.",
      cta: ar ? "تسوق الآن" : "Shop now",
      href: "/shop",
    },
    {
      image: "/images/business-workspace.jpg",
      eyebrow: ar ? "اشتراكات رقمية" : "DIGITAL SUBSCRIPTIONS",
      title: ar ? "اشتراكاتك الرقمية" : "Your digital subscriptions",
      accent: ar ? "بواجهة أوضح." : "in a clearer store.",
      text: ar ? "تصفح قسم الاشتراكات والعروض والخدمات الرقمية من مكان واحد." : "Browse subscriptions, offers, and digital services from one place.",
      cta: ar ? "استكشف الاشتراكات" : "Explore subscriptions",
      href: "/shop?category=subscriptions",
    },
    {
      image: "/images/ai-technology.jpg",
      eyebrow: ar ? "أدوات الذكاء الاصطناعي" : "AI TOOLS",
      title: ar ? "أدوات تساعدك" : "Tools that help you",
      accent: ar ? "تنجز أسرع." : "move faster.",
      text: ar ? "قسم مستقل لأدوات الذكاء الاصطناعي والحلول الرقمية الحديثة." : "A dedicated section for AI tools and modern digital solutions.",
      cta: ar ? "استكشف الذكاء الاصطناعي" : "Explore AI",
      href: "/shop?category=ai",
    },
    {
      image: "/images/digzoom/growth-hero-live-v3.webp",
      eyebrow: ar ? "خدمات DigZoom" : "DIGZOOM SERVICES",
      title: ar ? "ندير موقعك وتسويقك" : "We manage your site",
      accent: ar ? "بشكل احترافي." : "and your growth.",
      text: ar ? "إدارة مواقع، محتوى، منتجات، وتسويق ضمن خدمة واضحة ومستقلة." : "Website, content, product, and marketing management in one clear service.",
      cta: ar ? "شاهد الخدمات" : "View services",
      href: "/marketing",
    },
    {
      image: "/images/digzoom/creator-partner-live.webp",
      eyebrow: ar ? "بيع منتجاتك معنا" : "SELL WITH DIGZOOM",
      title: ar ? "عندك منتج رقمي؟" : "Have a digital product?",
      accent: ar ? "بعْه معنا." : "Sell it with us.",
      text: ar ? "قدّم منتجك للمراجعة وانضم إلى متجر DigZoom." : "Submit your product for review and join the DigZoom store.",
      cta: ar ? "ابدأ التقديم" : "Start applying",
      href: "/partners",
    },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => setSlide(current => (current + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const sortedProducts = [...products].sort(
    (a, b) =>
      Number(b.is_featured) - Number(a.is_featured) ||
      Number(b.is_trending) - Number(a.is_trending) ||
      b.id - a.id,
  );
  const featured = sortedProducts.slice(0, 8);
  const newArrivals = [...products].sort((a, b) => b.id - a.id).slice(0, 8);
  const discounted = sortedProducts.filter(p => typeof p.original_price === "number" && p.original_price > p.price).slice(0, 8);
  const freeProducts = sortedProducts.filter(p => p.price === 0).slice(0, 8);

  const counts = Object.fromEntries(
    dbCategories.map(category => [
      category.slug,
      products.filter(product => product.category_id === category.id).length,
    ]),
  ) as Record<string, number>;

  const add = (product: (typeof products)[0]) => {
    addToCart(product as any);
    toast.success(ar ? "تمت الإضافة إلى السلة" : "Added to cart");
  };

  const current = slides[slide];

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f7fb] text-slate-950">
      <section className="relative bg-[#05070d] pb-10 pt-24 text-white md:pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative min-h-[500px] overflow-hidden rounded-[30px] border border-white/10 bg-[#09101a] shadow-[0_30px_80px_rgba(0,0,0,.35)] md:min-h-[560px]">
            {slides.map((item, index) => (
              <div key={item.href} className={`absolute inset-0 transition-opacity duration-700 ${index === slide ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/95 via-[#05070d]/75 to-[#05070d]/15 rtl:bg-gradient-to-l" />
              </div>
            ))}

            <div className="relative z-10 flex min-h-[500px] items-center px-7 py-12 sm:px-10 md:min-h-[560px] md:px-14 lg:px-16">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex rounded-full border border-cyan-300/20 bg-black/30 px-4 py-2 text-sm font-black tracking-[.14em] text-cyan-200 backdrop-blur-xl">{current.eyebrow}</div>
                <h1 className="text-5xl font-black leading-[1.02] tracking-[-.04em] sm:text-6xl lg:text-7xl">
                  {current.title}
                  <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">{current.accent}</span>
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{current.text}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to={current.href} className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 font-black shadow-[0_18px_60px_rgba(59,130,246,.25)]">
                    {current.cta}<Arrow className="h-5 w-5" />
                  </Link>
                  <Link to="/shop" className="inline-flex min-h-14 items-center gap-2 rounded-2xl border border-white/15 bg-black/30 px-7 font-bold backdrop-blur-xl">{ar ? "استكشف المتجر" : "Explore store"}</Link>
                </div>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-300">
                  <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-amber-300" />{ar ? "تسليم رقمي" : "Digital delivery"}</span>
                  <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" />{ar ? "دفع آمن" : "Secure checkout"}</span>
                  <span className="inline-flex items-center gap-2"><Headphones className="h-4 w-4 text-cyan-300" />{ar ? "دعم سريع" : "Fast support"}</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-5 start-6 z-20 flex gap-2">
              {slides.map((item, index) => (
                <button key={item.href} onClick={() => setSlide(index)} className={`h-2.5 rounded-full transition-all ${index === slide ? "w-9 bg-white" : "w-2.5 bg-white/35"}`} aria-label={`${ar ? "الشريحة" : "Slide"} ${index + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {storefrontSections.map(section => <SectionCard key={section.slug} section={section} ar={ar} count={counts[section.slug]} />)}
        </div>
      </div></section>

      <section className="border-y border-slate-200 bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {[
              ["STC","bg-violet-50 text-violet-700"],
              ["Mobily","bg-sky-50 text-sky-700"],
              ["Zain","bg-emerald-50 text-emerald-700"],
              ["PlayStation","bg-blue-50 text-blue-700"],
              ["Xbox","bg-green-50 text-green-700"],
              ["Microsoft","bg-cyan-50 text-cyan-700"],
              ["Adobe","bg-rose-50 text-rose-700"],
              ["AI","bg-slate-950 text-white"],
            ].map(([name, tone]) => (
              <div key={name} className={`shrink-0 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black shadow-sm ${tone}`}>{name}</div>
            ))}
          </div>
        </div>
      </section>

      <ProductSection ar={ar} title={ar ? "الأكثر مبيعًا" : "Best sellers"} subtitle={ar ? "مجموعة بارزة من المنتجات المتاحة حاليًا." : "A highlighted selection of products currently available."} products={featured} loading={loading} add={add} lang={lang} />

      <ProductSection ar={ar} title={ar ? "وصل حديثًا" : "New arrivals"} subtitle={ar ? "أحدث المنتجات المضافة إلى متجر DigZoom." : "The latest products added to DigZoom."} products={newArrivals} loading={loading} add={add} lang={lang} />

      <section className="bg-[#f0f3f8]"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[30px] border border-fuchsia-400/20 bg-gradient-to-r from-[#310a32] via-[#17112a] to-[#081b3d] p-7 text-white shadow-xl md:p-10">
          <div className="absolute -end-16 -top-20 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="relative grid items-center gap-7 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-black text-fuchsia-300"><Tag className="h-4 w-4" />{ar ? "عروض DigZoom" : "DIGZOOM OFFERS"}</div>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">{ar ? "اكتشف أفضل العروض الرقمية" : "Discover digital offers"}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">{ar ? "قسم مخصص للعروض والخصومات والباقات المميزة داخل المتجر." : "A dedicated space for offers, discounts, and highlighted bundles."}</p>
            </div>
            <Link to="/shop?sort=offers" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-white px-7 font-black text-[#0a0d14]">{ar ? "شاهد العروض" : "View offers"}<Arrow className="h-5 w-5" /></Link>
          </div>
          {discounted.length > 0 && (
            <div className="relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {discounted.slice(0,4).map(product => <ProductCard key={product.id} product={product} ar={ar} lang={lang} add={add} compact />)}
            </div>
          )}
        </div>
      </div></section>


      <section className="bg-white"><div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[32px] border border-violet-400/20 bg-gradient-to-br from-blue-950/70 via-[#111329] to-violet-950/50 p-7 text-white shadow-xl md:p-8">
            <img src="/images/digzoom/growth-hero-live-v3.webp" alt={ar ? "خدمات DigZoom" : "DigZoom services"} className="aspect-[16/8] w-full rounded-[22px] object-cover" loading="lazy" />
            <div className="mt-6">
              <div className="text-sm font-black uppercase tracking-[.18em] text-violet-300">DIGZOOM BUSINESS</div>
              <h2 className="mt-3 text-3xl font-black">{ar ? "إدارة المواقع والتسويق" : "Website & marketing management"}</h2>
              <p className="mt-4 leading-7 text-slate-300">{ar ? "ندير موقعك ومنتجاتك ومحتواك ضمن خدمة مستقلة وواضحة." : "We manage your site, products, and content as a clear standalone service."}</p>
              <Link to="/marketing" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-black text-[#090b12]">{ar ? "شاهد الخدمات" : "View services"}<Arrow className="h-4 w-4" /></Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-950/50 via-[#0d1422] to-blue-950/60 p-7 text-white shadow-xl md:p-8">
            <img src="/images/digzoom/creator-partner-live.webp" alt={ar ? "بيع منتج رقمي عبر DigZoom" : "Sell through DigZoom"} className="aspect-[16/8] w-full rounded-[22px] object-cover" loading="lazy" />
            <div className="mt-6">
              <div className="text-sm font-black uppercase tracking-[.18em] text-cyan-300">DIGZOOM PARTNERS</div>
              <h2 className="mt-3 text-3xl font-black">{ar ? "عندك منتج رقمي؟ بعْه معنا." : "Have a digital product? Sell it with us."}</h2>
              <p className="mt-4 leading-7 text-slate-300">{ar ? "قدّم منتجك للمراجعة وابدأ مسار البيع عبر DigZoom." : "Submit your product for review and start selling through DigZoom."}</p>
              <Link to="/partners" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-300 px-5 font-black text-[#07111d]"><UploadCloud className="h-4 w-4" />{ar ? "بيع منتجاتك معنا" : "Sell with DigZoom"}<Arrow className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </div></section>

      {freeProducts.length > 0 && <ProductSection ar={ar} title={ar ? "منتجات مجانية" : "Free products"} subtitle={ar ? "منتجات مجانية متاحة حاليًا داخل المتجر." : "Free products currently available in the store."} products={freeProducts} loading={false} add={add} lang={lang} icon={<Gift className="h-6 w-6 text-emerald-300" />} />}

      <section id="digzoom-pass" className="bg-[#f0f3f8]"><div className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[30px] border border-violet-400/20 bg-gradient-to-r from-violet-950/70 via-[#12142a] to-blue-950/70 p-7 text-white shadow-xl md:p-9">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="text-sm font-black uppercase tracking-[.18em] text-violet-300">DIGZOOM PASS</div>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">{ar ? "مزايا أكثر داخل DigZoom" : "More value inside DigZoom"}</h2>
              <p className="mt-4 max-w-3xl leading-7 text-slate-300">{ar ? "قسم مخصص للمزايا والعروض والمنتجات الحصرية التي ستنضم إلى تجربة DigZoom." : "A dedicated area for benefits, offers, and exclusive products within the DigZoom experience."}</p>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-400/10 ring-1 ring-violet-300/20"><Gift className="h-9 w-9 text-violet-300" /></div>
          </div>
        </div>
      </div></section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { icon: Zap, title: ar ? "تسليم رقمي" : "Digital delivery", text: ar ? "حسب نوع المنتج" : "By product type" },
            { icon: ShieldCheck, title: ar ? "دفع آمن" : "Secure checkout", text: ar ? "رحلة شراء واضحة" : "A clear buying journey" },
            { icon: Headphones, title: ar ? "دعم سريع" : "Fast support", text: ar ? "قبل وبعد الطلب" : "Before and after purchase" },
            { icon: CheckCircle2, title: ar ? "منتجات مختارة" : "Curated products", text: ar ? "عرض مرتب وواضح" : "Clear product presentation" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5">
              <Icon className="h-6 w-6 text-blue-600" />
              <h3 className="mt-4 font-black">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductSection({ ar, title, subtitle, products, loading, add, lang, icon }: { ar: boolean; title: string; subtitle: string; products: any[]; loading: boolean; add: (product: any) => void; lang: string; icon?: ReactNode }) {
  return (
    <section className="bg-white"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">{icon}<h2 className="text-3xl font-black md:text-5xl">{title}</h2></div>
          <p className="mt-3 text-slate-500">{subtitle}</p>
        </div>
        <Link to="/shop" className="inline-flex items-center gap-2 font-bold text-blue-600">{ar ? "عرض الكل" : "View all"}<ArrowRight className="h-4 w-4" /></Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{[0,1,2,3,4,5].map(i => <div key={i} className="h-64 animate-pulse rounded-3xl bg-slate-100" />)}</div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-[#f8fafc] px-6 py-14 text-center text-slate-500">{ar ? "استكشف القسم لمعرفة أحدث المنتجات." : "Explore the section for the latest products."}</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{products.map(product => <ProductCard key={product.id} product={product} ar={ar} lang={lang} add={add} />)}</div>
      )}
    </div></section>
  );
}

function ProductCard({ product, ar, lang, add, compact = false }: { product: any; ar: boolean; lang: string; add: (product: any) => void; compact?: boolean }) {
  const hasDiscount = typeof product.original_price === "number" && product.original_price > product.price;
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden bg-slate-100">
        <img src={product.image_url || "/images/placeholder.jpg"} alt={productTitle(product, lang)} loading="lazy" className={`w-full object-cover transition duration-500 group-hover:scale-105 ${compact ? "aspect-[16/10]" : "aspect-square"}`} />
        {hasDiscount && <span className="absolute start-3 top-3 rounded-full bg-fuchsia-600 px-2.5 py-1 text-[10px] font-black text-white">{ar ? "خصم" : "SALE"}</span>}
      </Link>
      <div className="p-3 md:p-4">
        <Link to={`/product/${product.id}`}><h3 className="min-h-10 line-clamp-2 text-sm font-black transition group-hover:text-blue-600">{productTitle(product, lang)}</h3></Link>
        {!compact && <p className="mt-2 min-h-8 line-clamp-2 text-xs text-slate-500">{productDescription(product, lang)}</p>}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <strong className="text-base">{product.price} {ar ? "ر.س" : "SAR"}</strong>
            {hasDiscount && <div className="text-xs text-slate-500 line-through">{product.original_price} {ar ? "ر.س" : "SAR"}</div>}
          </div>
          <button onClick={() => add(product)} aria-label={ar ? "أضف إلى السلة" : "Add to cart"} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 transition hover:brightness-110"><ShoppingCart className="h-4 w-4" /></button>
        </div>
      </div>
    </article>
  );
}

