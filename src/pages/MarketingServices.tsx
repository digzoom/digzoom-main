import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  CircleCheckBig,
  Lightbulb,
  Loader2,
  Megaphone,
  PackageOpen,
  PenTool,
  Search,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Store,
  Target,
  Users,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { productDescription, productTitle } from "@/lib/i18n";

type Service = {
  slug: string;
  icon: typeof Target;
  title: string;
  description: string;
  deliverables: string[];
  image: string;
};

export default function MarketingServices() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { products, loading: productsLoading } = useSupabaseProducts();
  const featuredProducts = [...products]
    .sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.id - b.id)
    .slice(0, 4);

  const services: Service[] = isAr
    ? [
        {
          slug: "growth-strategy",
          icon: Target,
          title: "استراتيجية النمو الرقمي",
          description: "نحوّل أهداف النشاط إلى أولويات وقنوات ومؤشرات أداء قابلة للقياس.",
          deliverables: ["مراجعة الوضع الحالي", "خريطة فرص واضحة", "خطة تنفيذ مرحلية"],
          image: "/images/services/strategy-session.jpg",
        },
        {
          slug: "paid-campaigns",
          icon: Megaphone,
          title: "الحملات الإعلانية",
          description: "تخطيط وتشغيل وتحسين الحملات بحسب الهدف والميزانية الفعلية.",
          deliverables: ["هيكلة الحملات", "اختبار الرسائل", "تقارير أداء مفهومة"],
          image: "/images/services/analytics-dashboard.jpg",
        },
        {
          slug: "social-presence",
          icon: Users,
          title: "إدارة الحضور الاجتماعي",
          description: "تقويم محتوى واتجاه بصري ونشر منظم يخدم هوية النشاط.",
          deliverables: ["خطة محتوى", "تصاميم ونسخ", "متابعة الأداء"],
          image: "/images/services/growth-team.jpg",
        },
        {
          slug: "creative-content",
          icon: PenTool,
          title: "المحتوى الإبداعي",
          description: "محتوى مكتوب وبصري يشرح القيمة ويهيئ العميل لاتخاذ القرار.",
          deliverables: ["رسائل تسويقية", "تصميمات رقمية", "محتوى الحملات"],
          image: "/images/services/content-production.jpg",
        },
        {
          slug: "ecommerce-development",
          icon: Store,
          title: "تطوير المتاجر الإلكترونية",
          description: "تحسين الواجهة ورحلة الشراء وصفحات المنتجات لرفع الوضوح والثقة.",
          deliverables: ["مراجعة تجربة المستخدم", "تحسين الصفحات", "تهيئة القياس"],
          image: "/images/services/ecommerce-workspace.jpg",
        },
        {
          slug: "search-analytics",
          icon: Search,
          title: "الظهور والتحليلات",
          description: "تهيئة أساسية للبحث وقياس السلوك حتى تكون القرارات مبنية على بيانات.",
          deliverables: ["مراجعة الظهور", "إعداد القياس", "لوحة مؤشرات"],
          image: "/images/services/creative-work.jpg",
        },
      ]
    : [
        {
          slug: "growth-strategy",
          icon: Target,
          title: "Digital growth strategy",
          description: "We translate business goals into measurable priorities, channels, and KPIs.",
          deliverables: ["Current-state audit", "Opportunity map", "Phased action plan"],
          image: "/images/services/strategy-session.jpg",
        },
        {
          slug: "paid-campaigns",
          icon: Megaphone,
          title: "Paid campaigns",
          description: "Campaign planning, operation, and optimization around real goals and budgets.",
          deliverables: ["Campaign structure", "Message testing", "Clear reporting"],
          image: "/images/services/analytics-dashboard.jpg",
        },
        {
          slug: "social-presence",
          icon: Users,
          title: "Social presence",
          description: "A focused content calendar, visual direction, and consistent publishing.",
          deliverables: ["Content plan", "Design and copy", "Performance tracking"],
          image: "/images/services/growth-team.jpg",
        },
        {
          slug: "creative-content",
          icon: PenTool,
          title: "Creative content",
          description: "Written and visual content that explains value and supports decisions.",
          deliverables: ["Marketing messages", "Digital creative", "Campaign content"],
          image: "/images/services/content-production.jpg",
        },
        {
          slug: "ecommerce-development",
          icon: Store,
          title: "E-commerce development",
          description: "Sharper storefronts, buying journeys, and product pages that build confidence.",
          deliverables: ["UX review", "Page improvements", "Analytics setup"],
          image: "/images/services/ecommerce-workspace.jpg",
        },
        {
          slug: "search-analytics",
          icon: Search,
          title: "Search and analytics",
          description: "Search foundations and behavior tracking for evidence-based decisions.",
          deliverables: ["Visibility review", "Measurement setup", "KPI dashboard"],
          image: "/images/services/creative-work.jpg",
        },
      ];

  const sectors = [
    { icon: ShoppingBag, ar: "المتاجر الإلكترونية", en: "E-commerce" },
    { icon: Building2, ar: "الشركات", en: "Companies" },
    { icon: Stethoscope, ar: "القطاع الطبي", en: "Healthcare" },
    { icon: Sparkles, ar: "العلامات الناشئة", en: "Emerging brands" },
  ];
  const steps = isAr
    ? [
        ["01", "نفهم مشروعك", "نتعرف على نشاطك وجمهورك وأهدافك والموارد المتاحة."],
        ["02", "نحدد الأولويات", "نختار الأعمال الأعلى أثراً ونوضح نطاق التنفيذ."],
        ["03", "ننفذ ونقيس", "نبدأ العمل، نتابع المؤشرات، ونشاركك النتائج بوضوح."],
      ]
    : [
        ["01", "Understand your business", "We learn about your business, audience, goals, and available resources."],
        ["02", "Set priorities", "We choose the highest-impact work and define the scope."],
        ["03", "Launch and measure", "We execute, track the right signals, and report clearly."],
      ];
  const faqs = isAr
    ? [
        ["هل توجد باقات ثابتة؟", "نقدم عرضاً مخصصاً لأن احتياج كل مشروع مختلف. ستعرف نطاق العمل والسعر والمدة قبل أن نبدأ."],
        ["هل ميزانية الإعلانات ضمن أتعاب الإدارة؟", "تُفصل ميزانية المنصات الإعلانية عن أتعاب الإدارة، ويُوضح الاثنان في العرض."],
        ["هل يمكن البدء بخدمة واحدة؟", "نعم. يمكن البدء بمشروع محدد ثم التوسع بناءً على النتائج والأولوية."],
        ["كيف تتم متابعة العمل؟", "نحدد مؤشرات الأداء وآلية التواصل والتقارير ضمن نطاق المشروع المتفق عليه."],
      ]
    : [
        ["Do you offer fixed packages?", "We tailor the scope and price to your business. You receive the deliverables, timeline, and cost before work starts."],
        ["Is ad spend included?", "Platform spend is separate from management fees, and both are stated in the proposal."],
        ["Can we start with one service?", "Yes. We can start with a focused project, then expand based on priority and results."],
        ["How is work tracked?", "KPIs, communication, and reporting are defined in the agreed project scope."],
      ];

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-[#10131a] overflow-hidden">
      <section className="relative bg-[#080b12] text-white pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(31,120,255,.22),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(107,72,255,.17),transparent_36%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.02fr_.98fr] gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 mb-7">
              <Sparkles className="w-4 h-4" />
              {isAr ? "خدمات النمو الرقمي" : "Digital growth services"}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-6">
              {isAr ? "نحوّل التسويق من أعمال متفرقة" : "Turn scattered marketing"}
              <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mt-2">
                {isAr ? "إلى خطة نمو واضحة." : "into a clear growth plan."}
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-gray-300 mb-9">
              {isAr
                ? "استراتيجية، حملات، محتوى، متاجر وتحليلات تعمل معاً بحسب احتياج مشروعك—بنطاق واضح ومؤشرات يمكن متابعتها."
                : "Strategy, campaigns, content, commerce, and analytics working together around your business—with a clear scope and measurable signals."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold shadow-lg shadow-blue-900/30 hover:bg-blue-500 transition">
                {isAr ? "اطلب استشارة أولية" : "Request an initial consultation"}
                <Arrow className="w-5 h-5" />
              </Link>
              <button type="button" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[.04] px-7 py-4 font-semibold hover:bg-white/[.08] transition">
                {isAr ? "استكشف الخدمات" : "Explore services"}
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-7 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.04] p-3 shadow-2xl">
              <img src="/images/services/growth-team.jpg" alt={isAr ? "فريق عمل يناقش خطة نمو رقمية" : "Team discussing a digital growth plan"} className="aspect-[4/3] w-full rounded-[1.4rem] object-cover" />
              <div className="absolute inset-x-7 bottom-7 rounded-2xl border border-white/10 bg-black/75 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <CircleCheckBig className="w-5 h-5 text-emerald-400 shrink-0" />
                  {isAr ? "نفهم مشروعك أولاً، ثم نبني خطة تناسب أهدافك وميزانيتك" : "We understand your business first, then build a plan around your goals and budget"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-9">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-3 md:gap-5">
          <span className="w-full md:w-auto text-center text-sm font-bold text-gray-500">{isAr ? "نخدم" : "Built for"}</span>
          {sectors.map(({ icon: Icon, ar, en }) => (
            <div key={en} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700">
              <Icon className="w-4 h-4 text-blue-600" /> {isAr ? ar : en}
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl mb-12">
          <p className="text-blue-600 text-sm font-black tracking-widest mb-3">DIGZOOM GROWTH</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-5">{isAr ? "ما الذي يمكننا تنفيذه؟" : "What can we execute?"}</h2>
          <p className="text-gray-600 text-lg leading-8">{isAr ? "نبدأ بما يحتاجه مشروعك فعلاً، لا بقائمة خدمات جاهزة. اختر المجال وسنحدد النطاق والنتيجة المتوقعة قبل التنفيذ." : "We start with what your business actually needs—not a preset bundle. Choose an area and we will define scope and expected outcomes before execution."}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ slug, icon: Icon, title, description, deliverables, image }) => (
            <Link to={`/services/${slug}`} key={slug} className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200">
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute bottom-4 start-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-lg"><Icon className="w-5 h-5" /></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black mb-3">{title}</h3>
                <p className="text-gray-600 leading-7 mb-5">{description}</p>
                <ul className="space-y-2">
                  {deliverables.map(item => <li key={item} className="flex items-center gap-2 text-sm text-gray-700"><Check className="w-4 h-4 text-emerald-600 shrink-0" />{item}</li>)}
                </ul>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-blue-700">
                  {isAr ? "التفاصيل والتسعير" : "Details and pricing"}<Arrow className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-black text-violet-700">
                <PackageOpen className="h-4 w-4" />
                {isAr ? "منتجات رقمية عملية" : "Practical digital products"}
              </div>
              <h2 className="mb-4 text-3xl font-black tracking-tight md:text-5xl">
                {isAr ? "أدوات جاهزة تختصر عليك وقت التنفيذ" : "Ready-made tools that save execution time"}
              </h2>
              <p className="text-lg leading-8 text-slate-600">
                {isAr
                  ? "قوالب ولوحات متابعة قابلة للتعديل تساعدك على التخطيط والقياس والعمل بصورة أوضح. يمكنك استعراض التفاصيل الآن، وسيُفتح الشراء بعد اكتمال بوابة الدفع."
                  : "Editable templates and tracking dashboards for clearer planning and measurement. Explore the details now; purchasing will open once the payment gateway is ready."}
              </p>
            </div>
            <Link to="/shop" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-black text-slate-900 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
              {isAr ? "عرض جميع المنتجات" : "View all products"}
              <Arrow className="h-5 w-5" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="flex min-h-48 items-center justify-center rounded-3xl border border-slate-200 bg-slate-50">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img src={product.image_url} alt={productTitle(product, lang)} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute start-3 top-3 rounded-full border border-white/20 bg-slate-950/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                      {isAr ? "الشراء يفتح قريباً" : "Purchasing soon"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 line-clamp-2 text-lg font-black text-slate-950">{productTitle(product, lang)}</h3>
                    <p className="mb-5 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">{productDescription(product, lang)}</p>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span className="text-lg font-black text-blue-700">{product.price} {isAr ? "ر.س" : "SAR"}</span>
                      <span className="inline-flex items-center gap-1 text-sm font-black text-slate-700 group-hover:text-blue-700">
                        {isAr ? "التفاصيل" : "Details"}<Arrow className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
              {isAr ? "سيتم عرض المنتجات الرقمية هنا عند نشرها من لوحة التحكم." : "Digital products will appear here when published from the admin dashboard."}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#0b0e15] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <img src="/images/services/strategy-session.jpg" alt={isAr ? "جلسة تخطيط استراتيجية" : "Strategy planning session"} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-[2rem]" />
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400 mb-6"><Lightbulb className="w-6 h-6" /></div>
            <h2 className="text-3xl md:text-4xl font-black mb-5">{isAr ? "من الفكرة إلى نتائج قابلة للقياس" : "From ideas to measurable results"}</h2>
            <p className="text-gray-400 leading-8 mb-9">{isAr ? "ثلاث مراحل بسيطة تقلل التخمين، وتربط كل عمل بهدف ومقياس واضح." : "Three simple stages reduce guesswork and connect every activity to a clear goal and measure."}</p>
            <div className="space-y-7">
              {steps.map(([num, title, description]) => (
                <div key={num} className="grid grid-cols-[3rem_1fr] gap-4">
                  <span className="text-blue-400 font-black text-xl">{num}</span>
                  <div><h3 className="font-bold text-lg mb-1">{title}</h3><p className="text-sm leading-6 text-gray-400">{description}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-12">
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 mb-6"><BarChart3 className="w-6 h-6" /></div>
            <h2 className="text-3xl md:text-4xl font-black mb-5">{isAr ? "عرض مخصص حسب احتياج مشروعك" : "A proposal tailored to your business"}</h2>
            <p className="text-gray-600 leading-8 mb-7">{isAr ? "بعد فهم أهدافك، نرسل عرضاً واضحاً يحدد الأعمال والمخرجات والمدة والتكلفة، حتى تعرف ما ستحصل عليه قبل الموافقة." : "After understanding your goals, we send a clear proposal covering the work, deliverables, timeline, and cost so you know exactly what to expect before approving it."}</p>
            <Link to="/contact" className="inline-flex items-center gap-2 font-bold text-blue-700">{isAr ? "اطلب عرضاً لمشروعك" : "Request a proposal"}<Arrow className="w-4 h-4" /></Link>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-7 md:p-9 shadow-sm">
            <h3 className="text-xl font-black mb-6">{isAr ? "يتضمن العرض قبل الموافقة" : "Your proposal includes"}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {(isAr ? ["الهدف والنطاق", "المخرجات المتفق عليها", "المدة ومراحل التسليم", "التكلفة وطريقة الدفع", "المسؤوليات المطلوبة", "آلية القياس والتقارير"] : ["Goal and scope", "Agreed deliverables", "Timeline and milestones", "Cost and payment terms", "Required responsibilities", "Measurement and reporting"]).map(item => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 text-sm font-semibold"><CircleCheckBig className="w-5 h-5 text-emerald-600 shrink-0" />{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10"><h2 className="text-3xl md:text-4xl font-black mb-3">{isAr ? "أسئلة قبل البدء" : "Before we begin"}</h2><p className="text-gray-600">{isAr ? "إجابات مباشرة بلا وعود مبالغ فيها." : "Straight answers without inflated promises."}</p></div>
          <div className="space-y-3">
            {faqs.map(([question, answer], index) => (
              <div key={question} className="rounded-2xl border border-gray-200 overflow-hidden">
                <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between gap-4 p-5 text-start font-bold">
                  {question}<ChevronDown className={`w-5 h-5 text-gray-400 transition ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                {openFaq === index && <p className="px-5 pb-5 text-gray-600 leading-7">{answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#080b12] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-5">{isAr ? "خلّنا نعرف أين تريد أن تصل" : "Tell us where you want to go"}</h2>
          <p className="text-gray-400 text-lg leading-8 mb-8">{isAr ? "شاركنا هدفك والتحدي الذي تواجهه الآن، وسنقترح عليك الخطوة الأنسب بوضوح." : "Share your goal and current challenge, and we will recommend the clearest next step."}</p>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-black text-[#0b0e15] hover:bg-blue-50 transition">{isAr ? "تواصل مع DigZoom" : "Talk to DigZoom"}<Arrow className="w-5 h-5" /></Link>
        </div>
      </section>
    </main>
  );
}
