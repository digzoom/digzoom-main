import { Link } from "react-router";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Box,
  BriefcaseBusiness,
  CheckCircle2,
  Cloud,
  Gamepad2,
  Gift,
  Headphones,
  Laptop2,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Tag,
  UploadCloud,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { useCart } from "@/hooks/useCart";
import { productDescription, productTitle } from "@/lib/i18n";
import { toast } from "sonner";

const categoryCards = [
  { icon: Bot, ar: "الذكاء الاصطناعي", en: "AI Tools", slug: "ai" },
  { icon: Cloud, ar: "الاشتراكات", en: "Subscriptions", slug: "subscriptions" },
  { icon: Laptop2, ar: "البرامج", en: "Software", slug: "software" },
  { icon: Gamepad2, ar: "الألعاب", en: "Gaming", slug: "gaming" },
  { icon: Box, ar: "المنتجات الرقمية", en: "Digital Products", slug: "templates" },
];

export default function DigitalHubHome() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const Arrow = ar ? ArrowLeft : ArrowRight;
  const { products, categories, loading } = useSupabaseProducts();
  const { addToCart } = useCart();

  const actualProducts = [...products]
    .sort(
      (a, b) =>
        Number(b.is_featured) - Number(a.is_featured) ||
        Number(b.is_trending) - Number(a.is_trending) ||
        b.id - a.id,
    );

  const featured = actualProducts.slice(0, 8);
  const discounted = actualProducts
    .filter(
      p =>
        typeof p.original_price === "number" &&
        p.original_price > p.price,
    )
    .slice(0, 6);
  const freeProducts = actualProducts.filter(p => p.price === 0).slice(0, 6);

  const categoryCounts = Object.fromEntries(
    categories.map(category => [
      category.slug,
      actualProducts.filter(product => product.category_id === category.id).length,
    ]),
  ) as Record<string, number>;

  const add = (product: (typeof products)[0]) => {
    addToCart(product as any);
    toast.success(ar ? "تمت الإضافة إلى السلة" : "Added to cart");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      <section className="relative isolate border-b border-white/10 pb-12 pt-28 md:pb-16 md:pt-36">
        <div className="absolute inset-0 -z-20 bg-[#05070d]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(0,149,255,.20),transparent_28%),radial-gradient(circle_at_85%_25%,rgba(168,85,247,.18),transparent_24%),radial-gradient(circle_at_50%_80%,rgba(14,165,233,.10),transparent_32%)]" />
        <div className="absolute inset-0 -z-10 opacity-[.05] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">
              <Sparkles className="h-4 w-4" />
              {ar ? "متجر رقمي + حلول أعمال" : "Digital store + business solutions"}
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-[-.04em] sm:text-6xl lg:text-7xl">
              {ar ? "كل ما تحتاجه رقميًا" : "Everything digital you need"}
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                {ar ? "في مكان واحد." : "in one place."}
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              {ar
                ? "منتجات رقمية وقوالب وأدوات أعمال، ومعها أقسام للاشتراكات والبرامج والذكاء الاصطناعي والألعاب نفعّلها عند اكتمال الموردين المعتمدين."
                : "Digital products, templates, and business tools, with AI, subscriptions, software, and gaming sections activated as verified suppliers come online."}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/shop" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 font-black shadow-[0_18px_60px_rgba(59,130,246,.25)] transition hover:scale-[1.01]">
                <ShoppingBag className="h-5 w-5" />
                {ar ? "تسوق الآن" : "Shop now"}
                <Arrow className="h-5 w-5" />
              </Link>
              <Link to="/marketing" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[.04] px-7 font-bold transition hover:bg-white/[.08]">
                <BriefcaseBusiness className="h-5 w-5" />
                {ar ? "خدمات DigZoom" : "DigZoom services"}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-400">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" />{ar ? "شراء واضح وآمن" : "Clear, secure purchase"}</span>
              <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-amber-300" />{ar ? "تسليم رقمي" : "Digital delivery"}</span>
              <span className="inline-flex items-center gap-2"><Headphones className="h-4 w-4 text-cyan-300" />{ar ? "دعم مباشر" : "Direct support"}</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[40px] bg-gradient-to-br from-blue-600/25 via-violet-500/15 to-cyan-400/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[.055] p-2 shadow-2xl backdrop-blur-xl">
              <img src="/images/digzoom/digital-products-live.webp" alt={ar ? "عالم DigZoom للمنتجات الرقمية" : "DigZoom digital products"} className="aspect-[16/11] w-full rounded-[24px] object-cover" />
              <div className="absolute inset-x-5 bottom-5 grid grid-cols-3 gap-2">
                {categoryCards.slice(0, 3).map(({ icon: Icon, ar: arName, en, slug }) => (
                  <Link key={slug} to={`/shop?category=${slug}`} className="rounded-2xl border border-white/10 bg-black/65 p-3 text-center backdrop-blur-xl transition hover:bg-black/80">
                    <Icon className="mx-auto h-5 w-5 text-cyan-200" />
                    <div className="mt-2 text-[11px] font-extrabold text-white sm:text-xs">{ar ? arName : en}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#080b13]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-5 sm:px-6 md:grid-cols-3 lg:grid-cols-6 lg:px-8">
          {categoryCards.map(({ icon: Icon, ar: arName, en, slug }) => {
            const count = categoryCounts[slug] || 0;
            return (
              <Link key={slug} to={`/shop?category=${slug}`} className="group rounded-2xl border border-white/10 bg-white/[.035] p-4 transition hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[.06]">
                <Icon className="h-6 w-6 text-blue-300" />
                <div className="mt-3 text-sm font-black">{ar ? arName : en}</div>
                <div className="mt-1 text-[11px] text-slate-500">{count > 0 ? (ar ? `${count} منتج` : `${count} products`) : (ar ? "قريبًا" : "Coming soon")}</div>
              </Link>
            );
          })}
          <Link to="/partners" className="group rounded-2xl border border-cyan-400/20 bg-cyan-400/[.06] p-4 transition hover:-translate-y-1 hover:bg-cyan-400/[.1]">
            <UploadCloud className="h-6 w-6 text-cyan-300" />
            <div className="mt-3 text-sm font-black">{ar ? "بيع منتجاتك معنا" : "Sell with us"}</div>
            <div className="mt-1 text-[11px] text-slate-500">{ar ? "قدّم منتجك" : "Submit your product"}</div>
          </Link>
        </div>
      </section>

      <ProductSection
        ar={ar}
        title={ar ? "منتجات متاحة الآن" : "Available now"}
        subtitle={ar ? "منتجات منشورة فعليًا في متجر DigZoom." : "Products currently published in the DigZoom store."}
        products={featured}
        loading={loading}
        add={add}
        lang={lang}
      />

      {discounted.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[30px] border border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-950/60 via-[#111329] to-blue-950/60 p-7 md:p-9">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-sm font-black text-fuchsia-300"><Tag className="h-4 w-4" />{ar ? "عروض فعلية" : "Live offers"}</div>
                <h2 className="mt-3 text-3xl font-black">{ar ? "منتجات عليها خصم الآن" : "Products discounted now"}</h2>
              </div>
              <Link to="/shop" className="inline-flex items-center gap-2 font-bold text-fuchsia-200">{ar ? "عرض المتجر" : "Browse store"}<Arrow className="h-4 w-4" /></Link>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {discounted.map(product => (
                <ProductCard key={product.id} product={product} ar={ar} lang={lang} add={add} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-white/10 bg-white/[.02] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="text-sm font-black uppercase tracking-[.18em] text-cyan-300">DIGZOOM CATEGORIES</div>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">{ar ? "الأقسام القادمة" : "Upcoming categories"}</h2>
            <p className="mt-4 max-w-3xl text-slate-400">
              {ar ? "نجهّز هذه الأقسام، لكن لن نعرض منتجات فيها قبل اكتمال المورد والترخيص وطريقة التسليم." : "These sections are being prepared, but products will not be listed until supplier, licensing, and delivery are confirmed."}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categoryCards.slice(0, 4).map(({ icon: Icon, ar: arName, en, slug }) => {
              const count = categoryCounts[slug] || 0;
              return (
                <Link key={slug} to={`/shop?category=${slug}`} className="rounded-3xl border border-white/10 bg-[#0d111b] p-6 transition hover:border-blue-400/30">
                  <Icon className="h-8 w-8 text-blue-300" />
                  <h3 className="mt-5 text-xl font-black">{ar ? arName : en}</h3>
                  <p className="mt-2 text-sm text-slate-500">{count > 0 ? (ar ? `${count} منتج متاح` : `${count} available`) : (ar ? "قريبًا — بانتظار الموردين المعتمدين" : "Coming soon — verified suppliers pending")}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[32px] border border-violet-400/20 bg-gradient-to-br from-blue-950/70 via-[#111329] to-violet-950/50 p-7 md:p-8">
            <div className="grid items-center gap-7 md:grid-cols-[.9fr_1.1fr]">
              <img src="/images/digzoom/growth-hero-live-v3.webp" alt={ar ? "خدمات DigZoom" : "DigZoom services"} className="aspect-[16/11] w-full rounded-[22px] object-cover" loading="lazy" />
              <div>
                <div className="text-sm font-black uppercase tracking-[.18em] text-violet-300">DIGZOOM BUSINESS</div>
                <h2 className="mt-3 text-3xl font-black">{ar ? "إدارة المواقع والتسويق" : "Website & marketing management"}</h2>
                <p className="mt-4 leading-7 text-slate-300">{ar ? "ندير موقعك ومنتجاتك ومحتواك ضمن خدمة مستقلة داخل DigZoom." : "We manage your site, products, and content as a dedicated DigZoom service."}</p>
                <Link to="/marketing" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-black text-[#090b12]">{ar ? "شاهد الخدمات" : "View services"}<Arrow className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-950/50 via-[#0d1422] to-blue-950/60 p-7 md:p-8">
            <div className="grid items-center gap-7 md:grid-cols-[1.1fr_.9fr]">
              <div>
                <div className="text-sm font-black uppercase tracking-[.18em] text-cyan-300">DIGZOOM PARTNERS</div>
                <h2 className="mt-3 text-3xl font-black">{ar ? "عندك منتج رقمي؟ بعْه معنا." : "Have a digital product? Sell it with us."}</h2>
                <p className="mt-4 leading-7 text-slate-300">{ar ? "نراجع الجودة وحقوق البيع ثم نتفق على العمولة والتسوية قبل النشر." : "We review quality and rights, then agree commission and settlement before publishing."}</p>
                <Link to="/partners" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-300 px-5 font-black text-[#07111d]">{ar ? "بيع منتجاتك معنا" : "Sell with DigZoom"}<Arrow className="h-4 w-4" /></Link>
              </div>
              <img src="/images/digzoom/creator-partner-live.webp" alt={ar ? "بيع منتج رقمي عبر DigZoom" : "Sell through DigZoom"} className="aspect-[16/11] w-full rounded-[22px] object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {freeProducts.length > 0 && (
        <ProductSection
          ar={ar}
          title={ar ? "منتجات مجانية" : "Free products"}
          subtitle={ar ? "منتجات سعرها صفر فعليًا داخل المتجر." : "Products genuinely priced at zero in the store."}
          products={freeProducts}
          loading={false}
          add={add}
          lang={lang}
          icon={<Gift className="h-6 w-6 text-emerald-300" />}
        />
      )}

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[30px] border border-violet-400/20 bg-gradient-to-r from-violet-950/70 via-[#12142a] to-blue-950/70 p-7 md:p-9">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="text-sm font-black uppercase tracking-[.18em] text-violet-300">DIGZOOM PASS</div>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">{ar ? "برنامج مزايا DigZoom — قريبًا" : "DigZoom benefits program — coming soon"}</h2>
              <p className="mt-4 max-w-3xl leading-7 text-slate-300">{ar ? "لن نعرض سعرًا أو اشتراكًا قبل تحديد المزايا الحقيقية ونموذج التسعير." : "No pricing or subscription will be shown until real benefits and pricing are finalized."}</p>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-400/10 ring-1 ring-violet-300/20"><Gift className="h-9 w-9 text-violet-300" /></div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#080b13]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { icon: Zap, title: ar ? "تسليم رقمي" : "Digital delivery", text: ar ? "حسب نوع المنتج" : "By product type" },
            { icon: ShieldCheck, title: ar ? "منتجات موثوقة" : "Verified listings", text: ar ? "تفاصيل واضحة قبل الشراء" : "Clear details before purchase" },
            { icon: Headphones, title: ar ? "دعم سريع" : "Fast support", text: ar ? "قبل وبعد الطلب" : "Before and after purchase" },
            { icon: PackageCheck, title: ar ? "كتالوج منظم" : "Organized catalog", text: ar ? "بحث وتصنيفات واضحة" : "Clear search and categories" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
              <Icon className="h-6 w-6 text-blue-300" />
              <h3 className="mt-4 font-black">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductSection({
  ar,
  title,
  subtitle,
  products,
  loading,
  add,
  lang,
  icon,
}: {
  ar: boolean;
  title: string;
  subtitle: string;
  products: any[];
  loading: boolean;
  add: (product: any) => void;
  lang: string;
  icon?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">{icon}<h2 className="text-3xl font-black md:text-5xl">{title}</h2></div>
          <p className="mt-3 text-slate-500">{subtitle}</p>
        </div>
        <Link to="/shop" className="inline-flex items-center gap-2 font-bold text-blue-300">{ar ? "عرض الكل" : "View all"}<ArrowRight className="h-4 w-4" /></Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0,1,2,3].map(i => <div key={i} className="h-72 animate-pulse rounded-3xl bg-white/[.05]" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[.03] px-6 py-14 text-center text-slate-400">{ar ? "لا توجد منتجات منشورة في هذا القسم بعد." : "No published products in this section yet."}</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {products.map(product => <ProductCard key={product.id} product={product} ar={ar} lang={lang} add={add} />)}
        </div>
      )}
    </section>
  );
}

function ProductCard({
  product,
  ar,
  lang,
  add,
  compact = false,
}: {
  product: any;
  ar: boolean;
  lang: string;
  add: (product: any) => void;
  compact?: boolean;
}) {
  const hasDiscount = typeof product.original_price === "number" && product.original_price > product.price;
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#10141e] transition hover:-translate-y-1 hover:border-blue-400/30">
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden bg-[#151a25]">
        <img src={product.image_url || "/images/placeholder.jpg"} alt={productTitle(product, lang)} loading="lazy" className={`w-full object-cover transition duration-500 group-hover:scale-105 ${compact ? "aspect-[16/10]" : "aspect-[4/3]"}`} />
        {hasDiscount && <span className="absolute start-3 top-3 rounded-full bg-fuchsia-600 px-2.5 py-1 text-[10px] font-black text-white">{ar ? "خصم" : "SALE"}</span>}
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="min-h-10 line-clamp-2 text-sm font-black transition group-hover:text-blue-300 md:text-base">{productTitle(product, lang)}</h3>
        </Link>
        {!compact && <p className="mt-2 min-h-8 line-clamp-2 text-xs text-slate-500">{productDescription(product, lang)}</p>}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <strong className="text-base">{product.price} {ar ? "ر.س" : "SAR"}</strong>
            {hasDiscount && <div className="text-xs text-slate-500 line-through">{product.original_price} {ar ? "ر.س" : "SAR"}</div>}
          </div>
          <button onClick={() => add(product)} aria-label={ar ? "أضف إلى السلة" : "Add to cart"} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 transition hover:brightness-110">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
