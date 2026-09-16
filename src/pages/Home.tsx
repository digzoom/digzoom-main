import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, CheckCircle2, Headphones, Languages, PackageCheck, Search, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { productDescription, productTitle } from '@/lib/i18n';
import { toast } from 'sonner';

export default function Home() {
  const { lang } = useLanguage();
  const { addToCart } = useCart();
  const addProduct = addToCart as (product: any) => void;
  const { products, categories, loading } = useSupabaseProducts();
  const isAr = lang === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const curated = [...products].sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || Number(b.is_trending) - Number(a.is_trending) || b.id - a.id).slice(0, 8);
  const copy = isAr ? {
    eyebrow: 'منتجات رقمية تساعدك على الإنجاز', titleA: 'كل ما يحتاجه مشروعك،', titleB: 'في متجر رقمي واحد.',
    intro: 'قوالب وملفات وأدوات رقمية مختارة بعناية، بمعلومات واضحة وتجربة عربية وإنجليزية سهلة.',
    shop: 'استكشف المنتجات', contact: 'تحدث معنا', curated: 'منتجات مختارة', curatedSub: 'ابدأ بمجموعة واضحة من أحدث المنتجات المتاحة في المتجر.',
    all: 'عرض كل المنتجات', categories: 'تصفح حسب احتياجك', categoriesSub: 'وصول أسرع إلى النوع المناسب من المنتجات الرقمية.',
    why: 'تجربة شراء واضحة من البداية', whySub: 'نعرض ما نعرفه عن كل منتج بوضوح، ونبقي الدعم قريباً عند الحاجة.',
    cta: 'هل تبحث عن حل رقمي محدد؟', ctaSub: 'تصفح المتجر أو تواصل معنا وسنساعدك في الوصول إلى الخيار المناسب.', add: 'تمت الإضافة إلى السلة', loading: 'جاري تجهيز المنتجات…',
  } : {
    eyebrow: 'Digital products built for real work', titleA: 'Everything your project needs,', titleB: 'in one digital store.',
    intro: 'Carefully selected templates, files, and digital tools with clear information and an easy bilingual experience.',
    shop: 'Explore products', contact: 'Talk to us', curated: 'Curated products', curatedSub: 'Start with a focused selection of the latest available products.',
    all: 'View all products', categories: 'Browse by need', categoriesSub: 'Find the right kind of digital product faster.',
    why: 'A clear buying experience', whySub: 'We present what we know about each product clearly and keep support within reach.',
    cta: 'Looking for a specific digital solution?', ctaSub: 'Browse the store or contact us and we will help point you in the right direction.', add: 'Added to cart', loading: 'Preparing products…',
  };
  const benefits = isAr ? [
    { icon: ShieldCheck, title: 'معلومات واضحة', text: 'السعر والصيغة والتفاصيل المهمة ظاهرة قبل الشراء.' },
    { icon: Languages, title: 'عربي وإنجليزي', text: 'تصفح المحتوى باللغة الأنسب لك من أي صفحة.' },
    { icon: Headphones, title: 'دعم مباشر', text: 'تواصل معنا عند وجود سؤال عن المنتج أو الطلب.' },
    { icon: PackageCheck, title: 'منتجات منظمة', text: 'تصنيفات وبحث يساعدانك على الوصول بسرعة.' },
  ] : [
    { icon: ShieldCheck, title: 'Clear information', text: 'Price, format, and key details are visible before purchase.' },
    { icon: Languages, title: 'Arabic and English', text: 'Browse in the language that works best for you.' },
    { icon: Headphones, title: 'Direct support', text: 'Reach us with questions about a product or an order.' },
    { icon: PackageCheck, title: 'Organized catalog', text: 'Categories and search help you find products faster.' },
  ];

  return <main className="min-h-screen bg-[#08090d] text-white overflow-hidden">
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(91,82,255,.18),transparent_36%),radial-gradient(circle_at_20%_60%,rgba(0,163,255,.12),transparent_32%)]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_.9fr] gap-14 items-center">
        <div><div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 mb-7"><Sparkles className="w-4 h-4" />{copy.eyebrow}</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.08] tracking-tight mb-6">{copy.titleA}<br /><span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">{copy.titleB}</span></h1>
          <p className="text-gray-400 text-lg leading-8 max-w-2xl mb-9">{copy.intro}</p>
          <div className="flex flex-col sm:flex-row gap-3"><Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-7 py-4 font-bold hover:brightness-110 transition"><Search className="w-5 h-5" />{copy.shop}<Arrow className="w-4 h-4" /></Link><Link to="/contact" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[.03] px-7 py-4 font-semibold text-gray-200 hover:bg-white/[.07] transition">{copy.contact}</Link></div>
        </div>
        <div className="relative hidden md:block"><div className="absolute -inset-8 bg-blue-500/10 blur-3xl rounded-full" /><div className="relative rounded-[2rem] border border-white/10 bg-[#11131b]/90 p-3 shadow-2xl shadow-blue-950/40 rotate-1"><img src="/images/digzoom-logo-side-new.jpg" alt="DigZoom digital store" className="w-full aspect-[4/3] object-cover rounded-[1.4rem] opacity-90" /><div className="absolute bottom-7 inset-x-7 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl p-5"><div className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-400" /><span className="font-semibold">{isAr ? 'تسوق واضح، سريع، وثنائي اللغة' : 'Clear, focused, bilingual shopping'}</span></div></div></div></div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-9"><div><p className="text-blue-400 text-sm font-bold mb-2">DIGZOOM STORE</p><h2 className="text-3xl md:text-4xl font-bold mb-3">{copy.curated}</h2><p className="text-gray-500">{copy.curatedSub}</p></div><Link to="/shop" className="text-blue-400 inline-flex items-center gap-2 text-sm font-semibold">{copy.all}<Arrow className="w-4 h-4" /></Link></div>
      {loading ? <div className="py-20 text-center text-gray-500">{copy.loading}</div> : <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">{curated.map(product => <article key={product.id} className="group rounded-2xl border border-white/[.06] bg-[#12141c] overflow-hidden hover:border-blue-400/30 hover:-translate-y-1 transition duration-300"><Link to={`/product/${product.id}`} className="block overflow-hidden aspect-[4/3] bg-[#171a24]"><img src={product.image_url} alt={productTitle(product, lang)} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></Link><div className="p-4"><Link to={`/product/${product.id}`}><h3 className="font-bold text-sm md:text-base line-clamp-2 group-hover:text-blue-400 transition min-h-10">{productTitle(product, lang)}</h3></Link><p className="text-gray-500 text-xs mt-2 line-clamp-2 min-h-8">{productDescription(product, lang)}</p><div className="mt-4 flex items-center justify-between gap-2"><strong>{product.price} {isAr ? 'ر.س' : 'SAR'}</strong><button aria-label={copy.add} onClick={() => { addProduct(product); toast.success(copy.add); }} className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 hover:bg-blue-500 hover:text-white transition flex items-center justify-center"><ShoppingCart className="w-4 h-4" /></button></div></div></article>)}</div>}
    </section>

    <section className="border-y border-white/[.05] bg-white/[.018] py-20"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center max-w-2xl mx-auto mb-10"><h2 className="text-3xl font-bold mb-3">{copy.categories}</h2><p className="text-gray-500">{copy.categoriesSub}</p></div><div className="flex flex-wrap justify-center gap-3">{categories.slice(0, 10).map(category => <Link key={category.id} to={`/shop?category=${category.slug}`} className="rounded-xl border border-white/[.07] bg-[#12141c] px-5 py-3 text-sm text-gray-300 hover:text-white hover:border-purple-400/30 transition">{isAr ? category.name_ar : category.name_en}</Link>)}</div></div></section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"><div className="text-center max-w-2xl mx-auto mb-10"><h2 className="text-3xl font-bold mb-3">{copy.why}</h2><p className="text-gray-500">{copy.whySub}</p></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{benefits.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-white/[.06] bg-[#12141c] p-6"><div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 flex items-center justify-center mb-5"><Icon className="w-5 h-5" /></div><h3 className="font-bold mb-2">{title}</h3><p className="text-sm text-gray-500 leading-6">{text}</p></div>)}</div></section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"><div className="rounded-3xl border border-blue-400/15 bg-gradient-to-br from-blue-600/15 to-purple-600/15 p-8 md:p-14 text-center"><h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.cta}</h2><p className="text-gray-400 mb-8 max-w-2xl mx-auto">{copy.ctaSub}</p><div className="flex flex-col sm:flex-row justify-center gap-3"><Link to="/shop" className="rounded-xl bg-white text-gray-950 px-7 py-3.5 font-bold">{copy.shop}</Link><Link to="/contact" className="rounded-xl border border-white/15 px-7 py-3.5 font-semibold">{copy.contact}</Link></div></div></section>
  </main>;
}
