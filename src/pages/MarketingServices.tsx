import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  Gauge,
  Layers3,
  Loader2,
  Megaphone,
  PackageOpen,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { servicePlans } from "@/data/servicePlans";

type Need = "website" | "social" | "complete" | "scale" | "catalog";
type PillarKind = "website" | "marketing" | "products";
const scrollTo = (id: string) =>
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function MarketingServices() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const Arrow = ar ? ArrowLeft : ArrowRight;
  const [need, setNeed] = useState<Need>("complete");
  const [faq, setFaq] = useState(0);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string }>();

  const pillars = ar
    ? [
        {
          visual: "website" as PillarKind,
          icon: Wrench,
          title: "إدارة المواقع",
          text: "صيانة وتحديث المحتوى والمنتجات ومراقبة الأعطال، مع تقرير واضح بما تم.",
          points: [
            "تحديثات وصيانة",
            "إدارة صفحات المنتجات",
            "نسخ احتياطي ومتابعة",
          ],
          href: "/plans/website-stability",
          cta: "شاهد باقة إدارة الموقع",
        },
        {
          visual: "marketing" as PillarKind,
          icon: Megaphone,
          title: "التسويق الرقمي",
          text: "محتوى وإعلانات وقياس أداء، ضمن خطة شهرية تحدد ما سننشره وما سنقيسه.",
          points: ["محتوى وتصميم ونشر", "حملات إعلانية", "تحليلات وتقارير"],
          href: "/plans/social-presence",
          cta: "شاهد باقات التسويق",
        },
        {
          visual: "products" as PillarKind,
          icon: PackageOpen,
          title: "المنتجات الرقمية",
          text: "منتجات جاهزة للشراء، وخدمة تجهيز منتجاتك، وفرصة عرض منتجك كشريك.",
          points: [
            "متجر منتجات رقمية",
            "تجهيز صفحات البيع",
            "استقبال منتجات الشركاء",
          ],
          href: "/shop",
          cta: "تصفح المنتجات الرقمية",
        },
      ]
    : [
        {
          visual: "website" as PillarKind,
          icon: Wrench,
          title: "Website management",
          text: "Maintenance, content and product updates, incident monitoring, and a clear work report.",
          points: [
            "Updates and maintenance",
            "Product page management",
            "Backups and monitoring",
          ],
          href: "/plans/website-stability",
          cta: "View website plan",
        },
        {
          visual: "marketing" as PillarKind,
          icon: Megaphone,
          title: "Digital marketing",
          text: "Content, advertising, and measurement through a monthly plan with clear deliverables.",
          points: [
            "Content, design, and publishing",
            "Paid campaigns",
            "Analytics and reporting",
          ],
          href: "/plans/social-presence",
          cta: "View marketing plans",
        },
        {
          visual: "products" as PillarKind,
          icon: PackageOpen,
          title: "Digital products",
          text: "Ready-to-buy products, product-page preparation, and a partner route for creators.",
          points: [
            "Digital product store",
            "Sales-page preparation",
            "Creator partnerships",
          ],
          href: "/shop",
          cta: "Browse digital products",
        },
      ];

  const needOptions: Array<{ id: Need; label: string; icon: typeof Wrench }> =
    ar
      ? [
          { id: "website", label: "إدارة موقعي", icon: Wrench },
          { id: "social", label: "إدارة منصات التواصل", icon: Megaphone },
          { id: "complete", label: "الموقع والتسويق معًا", icon: Layers3 },
          { id: "scale", label: "تنفيذ أكبر وحملات", icon: BarChart3 },
          { id: "catalog", label: "تجهيز المنتجات", icon: PackageOpen },
        ]
      : [
          { id: "website", label: "Manage my website", icon: Wrench },
          { id: "social", label: "Manage social channels", icon: Megaphone },
          { id: "complete", label: "Website and marketing", icon: Layers3 },
          { id: "scale", label: "Scale execution and ads", icon: BarChart3 },
          {
            id: "catalog",
            label: "Prepare product listings",
            icon: PackageOpen,
          },
        ];

  const recommendations = ar
    ? {
        website: {
          title: "باقة استقرار الموقع",
          text: "الأنسب إذا كان موقعك قائمًا وتحتاج شخصًا يتولى الصيانة والتحديثات البسيطة.",
          price: "1,490 ر.س شهريًا",
          href: "/plans/website-stability",
        },
        social: {
          title: "باقة حضور اجتماعي",
          text: "الأنسب إذا كان موقعك جاهزًا وتحتاج محتوى وتصميمًا ونشرًا منتظمًا على منصتين.",
          price: "2,990 ر.س شهريًا",
          href: "/plans/social-presence",
        },
        complete: {
          title: "باقة الإدارة المتكاملة",
          text: "الأنسب إذا أردت فريقًا واحدًا يدير الموقع ومنصتين والمحتوى وصفحات المنتجات والقياس.",
          price: "4,990 ر.س شهريًا",
          href: "/plans/growth-system",
        },
        scale: {
          title: "باقة الإدارة الموسعة",
          text: "للمنشأة الجاهزة بحملات وعروض وتحتاج حجم تنفيذ أعلى عبر الموقع وثلاث منصات.",
          price: "7,990 ر.س شهريًا",
          href: "/plans/digital-scale",
        },
        catalog: {
          title: "خدمة تجهيز المنتجات",
          text: "إذا كانت مشكلتك في الصور والوصف والتصنيف وإدخال المنتجات، ابدأ بالكتالوج دون اشتراك شهري.",
          price: "ابتداءً من 490 ر.س",
          href: "#catalog",
        },
      }
    : {
        website: {
          title: "Website Stability",
          text: "Best when your site is live and needs ongoing care and small content updates.",
          price: "SAR 1,490/month",
          href: "/plans/website-stability",
        },
        social: {
          title: "Social Presence",
          text: "Best when your website is ready and you need consistent content on two platforms.",
          price: "SAR 2,990/month",
          href: "/plans/social-presence",
        },
        complete: {
          title: "Integrated Management",
          text: "Best when one team should manage your website, two channels, content, products, and measurement.",
          price: "SAR 4,990/month",
          href: "/plans/growth-system",
        },
        scale: {
          title: "Expanded Management",
          text: "For a business with ready offers and campaigns that needs higher-volume execution.",
          price: "SAR 7,990/month",
          href: "/plans/digital-scale",
        },
        catalog: {
          title: "Product preparation",
          text: "Start here when product images, copy, categories, and publishing are the main problem.",
          price: "From SAR 490",
          href: "#catalog",
        },
      };
  const recommendation = recommendations[need];

  const workSamples = ar
    ? [
        {
          image: "/images/products/content-calendar-90-days-realistic.webp",
          title: "نظام تخطيط محتوى لمدة 90 يومًا",
          text: "نموذج فعلي من منتجات DigZoom لتنظيم الأفكار والمنصات والمواعيد وحالة النشر.",
          tag: "منتج DigZoom",
        },
        {
          image: "/images/products/campaign-performance-realistic.webp",
          title: "لوحة متابعة أداء الحملات",
          text: "نموذج قياس منظم للإنفاق والنقرات والتحويلات وتكلفة النتيجة والعائد.",
          tag: "منتج DigZoom",
        },
        {
          image: "/images/products/marketing-budget-roi-realistic.webp",
          title: "متتبع الميزانية والعائد",
          text: "نموذج عملي لمقارنة الميزانية المخططة بالمصروف الفعلي ونتائج كل قناة.",
          tag: "منتج DigZoom",
        },
      ]
    : [
        {
          image: "/images/products/content-calendar-90-days-realistic.webp",
          title: "90-day content planning system",
          text: "A real DigZoom product for organizing topics, channels, dates, and publishing status.",
          tag: "DigZoom product",
        },
        {
          image: "/images/products/campaign-performance-realistic.webp",
          title: "Campaign performance dashboard",
          text: "A structured measurement model for spend, clicks, conversions, cost per result, and return.",
          tag: "DigZoom product",
        },
        {
          image: "/images/products/marketing-budget-roi-realistic.webp",
          title: "Budget and ROI tracker",
          text: "A practical model comparing planned budget, actual spend, and results by channel.",
          tag: "DigZoom product",
        },
      ];

  const productPacks = ar
    ? [
        ["إدخال 10 منتجات", "بيانات وصور جاهزة من العميل", "490"],
        ["تجهيز 10 منتجات", "وصف وصور وتصنيف وSEO أساسي", "990"],
        ["تجهيز 25 منتجًا", "إعداد كامل وجاهز للنشر", "1,990"],
        ["تجهيز 50 منتجًا", "إعداد كامل للكتالوج", "3,490"],
      ]
    : [
        ["List 10 products", "Client provides ready copy and images", "490"],
        [
          "Prepare 10 products",
          "Copy, images, categories, and basic SEO",
          "990",
        ],
        ["Prepare 25 products", "Complete publish-ready setup", "1,990"],
        ["Prepare 50 products", "Complete catalog setup", "3,490"],
      ];

  const faqs = ar
    ? [
        [
          "هل المنشورات لكل منصة؟",
          "لا. العدد هو عدد المواد الأصلية خلال الشهر، ثم نهيئ المقاس والنص وننشر المادة على المنصات المشمولة في الباقة.",
        ],
        [
          "هل التصوير وميزانية الإعلان داخل السعر؟",
          "لا. التصوير الميداني والإنتاج الاحترافي وميزانية المنصات الإعلانية تُحسب منفصلة بعد موافقتك.",
        ],
        [
          "هل أستطيع طلب خدمة واحدة دون اشتراك؟",
          "نعم. تجهيز المنتجات وبعض المشاريع المحددة تُنفذ بسعر مستقل. الأعمال غير المعتادة تحصل على نطاق وسعر قبل البدء.",
        ],
        [
          "متى يبدأ التنفيذ؟",
          "بعد استلام الصلاحيات والمواد واعتماد نطاق العمل. نرسل لك جدول التنفيذ والاعتماد قبل النشر.",
        ],
        [
          "هل تضمنون رقم مبيعات؟",
          "لا نعد برقم لا نتحكم فيه. نحدد ما سننفذه، مؤشرات القياس، وما نستطيع تحسينه بوضوح.",
        ],
      ]
    : [
        [
          "Is the post count per platform?",
          "No. It is the number of original monthly assets, then each asset is adapted and published on the included platforms.",
        ],
        [
          "Are filming and ad spend included?",
          "No. On-location production and platform media spend are quoted or paid separately after approval.",
        ],
        [
          "Can I order one service without a subscription?",
          "Yes. Product preparation and defined projects can be purchased separately with a written scope.",
        ],
        [
          "When does work begin?",
          "After access, assets, and scope approval. You receive the execution and approval schedule before publishing.",
        ],
        [
          "Do you guarantee sales?",
          "We do not promise numbers outside our control. We define execution, measurement, and optimization clearly.",
        ],
      ];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setNotice(undefined);
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const goalByNeed: Record<Need, string> = {
      website: "conversion",
      social: "visibility",
      complete: "sales",
      scale: "sales",
      catalog: "launch",
    };
    try {
      const response = await fetch("/api/growth-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          business_type: data.business_type,
          website: data.website,
          company: "",
          budget: "unsure",
          goal: goalByNeed[need],
          challenge: `${ar ? "الخدمة المطلوبة" : "Requested service"}: ${data.service_interest}`,
          lang,
        }),
      });
      if (!response.ok) throw new Error();
      setNotice({
        ok: true,
        text: ar
          ? "وصل طلبك. سنراجعه ونتواصل معك لتأكيد الخدمة والنطاق المناسب."
          : "Your request is in. We will contact you to confirm the right service and scope.",
      });
      form.reset();
    } catch {
      setNotice({
        ok: false,
        text: ar
          ? "تعذر إرسال الطلب الآن. حاول مرة أخرى أو تواصل عبر البريد."
          : "We could not send the request. Please retry or contact us by email.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f7fb] text-[#0c1220]">
      <section className="relative isolate bg-[#060a12] pb-16 pt-28 text-white md:pb-20 md:pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_22%,rgba(37,99,235,.24),transparent_30%),radial-gradient(circle_at_84%_65%,rgba(124,58,237,.18),transparent_32%)]" />
        <div className="absolute inset-0 -z-10 opacity-[.08] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.06fr_.94fr] lg:px-8">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-200">
              <Sparkles className="h-4 w-4" />
              {ar
                ? "حلول رقمية بنطاق وأسعار واضحة"
                : "Digital services with clear scope and pricing"}
            </div>
            <h1 className="text-[2.7rem] font-black leading-[1.06] tracking-[-.04em] sm:text-6xl lg:text-7xl">
              {ar ? "إدارة المواقع والتسويق" : "Website management, marketing"}
              <span className="mt-2 block bg-gradient-to-r from-[#55a7ff] via-[#737cff] to-[#b165ff] bg-clip-text text-transparent">
                {ar ? "والمنتجات الرقمية." : "and digital products."}
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              {ar
                ? "نحدد الخدمة، وما سنسلّمه، وما نحتاجه منك، والسعر قبل البدء. ثم ندير التنفيذ والنشر والمتابعة دون وعود مبهمة."
                : "We define the service, deliverables, client inputs, and price before work begins—then manage execution, publishing, and reporting without vague promises."}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => scrollTo("services")}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 font-black shadow-[0_18px_50px_rgba(37,99,235,.3)] hover:bg-blue-500"
              >
                {ar ? "اختر الخدمة المناسبة" : "Choose the right service"}
                <Arrow className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollTo("plans")}
                className="min-h-14 rounded-2xl border border-white/15 bg-white/[.04] px-7 font-bold hover:bg-white/[.08]"
              >
                {ar ? "استعرض الباقات والأسعار" : "View plans and pricing"}
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {ar
                  ? "لا دفع قبل اعتماد النطاق"
                  : "No payment before scope approval"}
              </span>
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-400" />
                DigZoom LLC · Wyoming, USA
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-8 rounded-full bg-blue-500/15 blur-3xl" />
            <figure className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1422] p-2 shadow-2xl">
              <img
                src="/images/digzoom/growth-hero-live-v3.webp"
                alt={
                  ar
                    ? "فريق يراجع مؤشرات أداء مشروع رقمي"
                    : "Team reviewing digital business performance"
                }
                fetchPriority="high"
                className="aspect-[16/12] w-full rounded-[1.55rem] object-cover object-center"
              />
              <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-[#07101e]/90 p-4 shadow-2xl backdrop-blur-xl sm:left-5 sm:right-auto sm:w-[66%]">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-blue-500/20 p-2 text-blue-300">
                    <Gauge className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black">
                      {ar
                        ? "متابعة العمل والنتائج"
                        : "Work and outcome tracking"}
                    </p>
                    <p className="mt-1 text-[10px] leading-5 text-slate-400">
                      {ar
                        ? "نموذج توضيحي؛ تظهر بيانات مشروعك بعد ربط أدوات القياس."
                        : "Illustrative model; your data appears after analytics setup."}
                    </p>
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-20 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black tracking-[.18em] text-blue-600">
              {ar ? "ثلاث خدمات واضحة" : "THREE CLEAR SERVICES"}
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              {ar
                ? "اختر ما تحتاجه دون شراء أعمال لا تفيدك"
                : "Choose what you need—without paying for what you do not"}
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {ar
                ? "يمكنك الاشتراك في إدارة شهرية، طلب تجهيز منتجات فقط، أو شراء منتج رقمي جاهز."
                : "Use monthly management, order product preparation only, or buy a ready-made digital product."}
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {pillars.map(
              ({ visual, icon: Icon, title, text, points, href, cta }) => (
                <article
                  key={title}
                  className="group flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f8fafc] transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <PillarVisual kind={visual} ar={ar} />
                  <div className="flex flex-1 flex-col p-7">
                    <span className="inline-flex w-fit rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-600/20">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-2xl font-black">{title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{text}</p>
                    <ul className="mt-6 flex-1 space-y-3">
                      {points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-2 text-sm text-slate-600"
                        >
                          <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={href}
                      className="mt-7 inline-flex items-center gap-2 font-black text-blue-700"
                    >
                      {cta}
                      <Arrow className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#eef3ff] py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
          <div>
            <p className="text-sm font-black tracking-[.18em] text-blue-700">
              {ar ? "توصية مباشرة" : "DIRECT RECOMMENDATION"}
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              {ar
                ? "ما الذي تريد أن نتولاه؟"
                : "What should we manage for you?"}
            </h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {needOptions.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setNeed(id)}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-start font-bold transition ${need === id ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "border-blue-100 bg-white text-slate-700 hover:border-blue-300"}`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center rounded-[2rem] bg-[#07101e] p-8 text-white">
            <p className="text-sm font-black text-blue-300">
              {ar ? "الاختيار الأنسب لك" : "BEST MATCH"}
            </p>
            <h3 className="mt-3 text-3xl font-black">{recommendation.title}</h3>
            <p className="mt-4 leading-8 text-slate-300">
              {recommendation.text}
            </p>
            <p className="mt-5 text-xl font-black text-blue-300">
              {recommendation.price}
            </p>
            {recommendation.href.startsWith("#") ? (
              <button
                onClick={() => scrollTo(recommendation.href.slice(1))}
                className="mt-7 inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-black hover:bg-blue-500"
              >
                {ar ? "شاهد التفاصيل" : "View details"}
                <Arrow className="h-5 w-5" />
              </button>
            ) : (
              <Link
                to={recommendation.href}
                className="mt-7 inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-black hover:bg-blue-500"
              >
                {ar ? "شاهد التفاصيل" : "View details"}
                <Arrow className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section
        id="work"
        className="scroll-mt-20 bg-[#080d16] py-16 text-white md:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-sm font-black tracking-[.18em] text-blue-400">
                {ar ? "نماذج من أعمالنا ومنتجاتنا" : "WORK AND PRODUCT SAMPLES"}
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                {ar
                  ? "شاهد شكل العمل قبل أن تبدأ"
                  : "See the work before you begin"}
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">
                {ar
                  ? "هذه نماذج تنفيذية ومنتجات طورتها DigZoom وليست ادعاءات لنتائج عملاء. حالات العملاء تُنشر فقط بعد التوثيق والموافقة."
                  : "These are DigZoom-built products and execution samples—not claims about client results. Client case studies are published only after verification and approval."}
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <TrustItem
                  text={
                    ar
                      ? "نطاق وتسليمات مكتوبة"
                      : "Written scope and deliverables"
                  }
                />
                <TrustItem
                  text={
                    ar
                      ? "الحسابات والبيانات ملك للعميل"
                      : "Client owns accounts and data"
                  }
                />
                <TrustItem
                  text={
                    ar
                      ? "تقارير عربية أو إنجليزية"
                      : "Arabic or English reporting"
                  }
                />
                <TrustItem
                  text={
                    ar
                      ? "أي تكلفة إضافية تُعتمد قبل التنفيذ"
                      : "Extra costs require approval"
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {workSamples.map(({ image, title, text, tag }) => (
                <article
                  key={title}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.045]"
                >
                  <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-5">
                    <span className="text-xs font-black text-blue-300">
                      {tag}
                    </span>
                    <h3 className="mt-3 text-xl font-black">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="scroll-mt-20 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black tracking-[.18em] text-blue-600">
              {ar ? "اشتراكات شهرية" : "MONTHLY MANAGEMENT"}
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              {ar
                ? "أربع باقات، والفرق بينها واضح"
                : "Four plans with clear differences"}
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {ar
                ? "البطاقات تعرض المختصر فقط. صفحة كل باقة تشرح طريقة حساب المنشورات والقصص، وما نحتاجه منك، وما لا يشمله السعر."
                : "Cards show the essentials. Each plan page explains counting, client inputs, and exclusions."}
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-2">
            {servicePlans.map((plan) => {
              const popular = plan.id === "growth-system";
              const included = ar ? plan.includedAr : plan.includedEn;
              return (
                <article
                  key={plan.id}
                  className={`relative flex flex-col rounded-[2rem] border p-7 md:p-8 ${popular ? "border-blue-500 bg-[#07101e] text-white shadow-2xl shadow-blue-600/15" : "border-slate-200 bg-[#f8fafc]"}`}
                >
                  {popular && (
                    <span className="absolute -top-3 start-7 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-black text-white">
                      {ar ? "الأكثر توازنًا" : "BEST BALANCE"}
                    </span>
                  )}
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-3xl font-black">
                        {ar ? plan.nameAr : plan.nameEn}
                      </h3>
                      <p
                        className={`mt-3 max-w-xl leading-7 ${popular ? "text-slate-300" : "text-slate-600"}`}
                      >
                        {ar ? plan.summaryAr : plan.summaryEn}
                      </p>
                    </div>
                    <div className="shrink-0 sm:text-end">
                      <span className="text-4xl font-black">
                        {plan.price.toLocaleString(ar ? "ar-SA" : "en-US")}
                      </span>
                      <p
                        className={`mt-1 text-sm ${popular ? "text-slate-400" : "text-slate-500"}`}
                      >
                        {ar ? "ر.س / شهريًا" : "SAR / month"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`mt-5 rounded-xl border px-4 py-3 text-sm leading-6 ${popular ? "border-white/10 bg-white/[.05] text-slate-300" : "border-slate-200 bg-white text-slate-600"}`}
                  >
                    {ar ? plan.bestForAr : plan.bestForEn}
                  </div>
                  <div
                    className={`mt-4 rounded-xl px-4 py-3 text-sm font-black ${popular ? "bg-blue-500/15 text-blue-200" : "bg-blue-50 text-blue-700"}`}
                  >
                    <PackageOpen className="me-2 inline h-4 w-4" />
                    {ar ? plan.productsAr : plan.productsEn}
                  </div>
                  <ul className="mt-6 grid flex-1 gap-3 sm:grid-cols-2">
                    {included.slice(0, 4).map((item) => (
                      <li
                        key={item}
                        className={`flex gap-2 text-sm leading-6 ${popular ? "text-slate-300" : "text-slate-600"}`}
                      >
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/plans/${plan.id}`}
                    className={`mt-7 inline-flex min-h-13 items-center justify-center gap-2 rounded-xl px-6 font-black ${popular ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-slate-950 text-white hover:bg-slate-800"}`}
                  >
                    {ar ? "الشرح الكامل وطلب الباقة" : "Full details and order"}
                    <Arrow className="h-5 w-5" />
                  </Link>
                </article>
              );
            })}
          </div>
          <p className="mt-6 text-center text-sm leading-7 text-slate-500">
            {ar
              ? "الأسعار لا تشمل ضريبة القيمة المضافة أو ميزانية الإعلانات أو التصوير الميداني. لا تُرحّل الحصص غير المستخدمة للشهر التالي."
              : "Prices exclude VAT, ad spend, and on-location production. Unused capacity does not roll over."}
          </p>
        </div>
      </section>

      <section
        id="catalog"
        className="scroll-mt-20 bg-[#08101d] py-16 text-white md:py-20"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl">
            <img
              src="/images/digzoom/product-catalog-service-live-v1.webp"
              alt={
                ar
                  ? "مختص يجهز صفحات المنتجات للنشر"
                  : "Specialist preparing product listings"
              }
              loading="lazy"
              className="aspect-[16/11] w-full rounded-[1.55rem] object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-black tracking-[.18em] text-blue-400">
              {ar ? "خدمة مستقلة دون اشتراك" : "STANDALONE SERVICE"}
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              {ar
                ? "نحوّل ملفاتك وصورك إلى صفحات منتجات جاهزة"
                : "Turn files and images into publish-ready product pages"}
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              {ar
                ? "نرتب البيانات، نكتب الوصف، نجهز الصور، ننظم المواصفات والتصنيفات، ونضيف أساسيات الظهور في البحث."
                : "We organize data, write copy, prepare images, structure specifications and categories, and add basic search optimization."}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {productPacks.map(([name, text, price]) => (
                <div
                  key={name}
                  className="rounded-2xl border border-white/10 bg-white/[.045] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-black">{name}</h3>
                    <span className="whitespace-nowrap font-black text-blue-300">
                      {price} {ar ? "ر.س" : "SAR"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {text}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              {ar
                ? "المتجر ثنائي اللغة: إضافة 40%. البحث الخارجي عن الصور أو البيانات والمنتجات كثيرة المتغيرات تُسعّر بعد فحص الملفات."
                : "Bilingual stores: add 40%. External research and complex variants are quoted after file review."}
            </p>
            <button
              onClick={() => scrollTo("contact")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-black hover:bg-blue-500"
            >
              {ar ? "أرسل الكتالوج للتقييم" : "Send your catalog for review"}
              <Arrow className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section
        id="partners"
        className="scroll-mt-20 bg-[#f4f7ff] py-16 md:py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <img
              src="/images/digzoom/digital-products-live.webp"
              alt={
                ar
                  ? "منتجات رقمية عربية على أجهزة متعددة"
                  : "Arabic digital products on multiple devices"
              }
              loading="lazy"
              className="h-44 w-full object-cover md:h-52"
            />
            <div className="p-6 md:p-7">
              <p className="text-sm font-black text-violet-600">
                {ar ? "للشراء والاستخدام" : "BUY AND USE"}
              </p>
              <h2 className="mt-3 text-3xl font-black">
                {ar ? "منتجات رقمية جاهزة" : "Ready-made digital products"}
              </h2>
              <p className="mt-4 leading-8 text-slate-600">
                {ar
                  ? "قوالب وأدلة وأدوات رقمية مع وصف واضح لما ستحصل عليه وشروط الاستخدام."
                  : "Templates, guides, and tools with clear deliverables and usage terms."}
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-4 font-black text-white"
              >
                {ar ? "تصفح المتجر" : "Browse store"}
                <Arrow className="h-5 w-5" />
              </Link>
            </div>
          </article>
          <article className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-sm">
            <img
              src="/images/digzoom/creator-partner-live.webp"
              alt={
                ar
                  ? "صانع منتجات رقمية يعمل على منتجه"
                  : "Digital product creator working"
              }
              loading="lazy"
              className="h-44 w-full object-cover md:h-52"
            />
            <div className="p-6 md:p-7">
              <p className="text-sm font-black text-blue-600">
                {ar ? "لديك منتج رقمي؟" : "HAVE A DIGITAL PRODUCT?"}
              </p>
              <h2 className="mt-3 text-3xl font-black">
                {ar ? "اعرض منتجك كشريك" : "List your product as a partner"}
              </h2>
              <p className="mt-4 leading-8 text-slate-600">
                {ar
                  ? "نراجع الجودة والحقوق، ونتفق على الشروط قبل النشر. لا نقبل الملفات مجهولة المصدر."
                  : "We review quality and rights and agree terms before publishing. Unverified files are not accepted."}
              </p>
              <Link
                to="/partners"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-black text-white"
              >
                {ar ? "شروط وتقديم الشراكة" : "Partner terms and application"}
                <Arrow className="h-5 w-5" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-20 bg-[#070b13] py-16 text-white md:py-20"
      >
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-black tracking-[.18em] text-blue-400">
              {ar ? "طلب مبدئي بلا دفع" : "INITIAL REQUEST — NO PAYMENT"}
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              {ar
                ? "أرسل المطلوب وسنؤكد لك الخدمة المناسبة"
                : "Tell us what you need and we will confirm the right service"}
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              {ar
                ? "هذه ليست صفحة دفع. نراجع موقعك أو حسابك، نثبت النطاق والتسليمات، ثم نرسل لك الخطوة التالية."
                : "This is not a payment page. We review your site or account, confirm scope and deliverables, then send the next step."}
            </p>
            <div className="mt-8 space-y-3">
              <TrustItem
                text={
                  ar
                    ? "لن نطلب كلمات المرور عبر النموذج"
                    : "We will not request passwords in this form"
                }
              />
              <TrustItem
                text={
                  ar
                    ? "لن يبدأ أي عمل قبل موافقتك"
                    : "No work begins before approval"
                }
              />
              <TrustItem
                text={ar ? "لن تُضاف تكاليف غير معتمدة" : "No unapproved costs"}
              />
            </div>
          </div>
          <form
            onSubmit={submit}
            className="rounded-[2rem] border border-white/10 bg-white/[.045] p-5 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={ar ? "الاسم" : "Name"}>
                <input
                  name="name"
                  required
                  maxLength={100}
                  autoComplete="name"
                />
              </Field>
              <Field label={ar ? "رقم الجوال" : "Phone"}>
                <input
                  name="phone"
                  required
                  maxLength={30}
                  autoComplete="tel"
                  dir="ltr"
                />
              </Field>
              <Field label={ar ? "البريد الإلكتروني" : "Email"}>
                <input
                  name="email"
                  required
                  type="email"
                  maxLength={160}
                  autoComplete="email"
                  dir="ltr"
                />
              </Field>
              <Field label={ar ? "نوع النشاط" : "Business type"}>
                <select name="business_type" required defaultValue="">
                  <option value="" disabled>
                    {ar ? "اختر نوع النشاط" : "Select business type"}
                  </option>
                  {(ar
                    ? [
                        "متجر إلكتروني",
                        "شركة خدمات",
                        "عيادة أو مركز",
                        "علامة ناشئة",
                        "أخرى",
                      ]
                    : [
                        "E-commerce",
                        "Service business",
                        "Clinic or center",
                        "Emerging brand",
                        "Other",
                      ]
                  ).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field label={ar ? "الخدمة المطلوبة" : "Service needed"} wide>
                <select name="service_interest" required defaultValue="">
                  <option value="" disabled>
                    {ar ? "اختر الخدمة أو الباقة" : "Select a service or plan"}
                  </option>
                  {(ar
                    ? [
                        "إدارة الموقع — 1,490 ر.س",
                        "إدارة منصات التواصل — 2,990 ر.س",
                        "إدارة متكاملة — 4,990 ر.س",
                        "إدارة موسعة — 7,990 ر.س",
                        "تجهيز المنتجات دون اشتراك",
                        "منتج رقمي أو شراكة",
                      ]
                    : [
                        "Website management — SAR 1,490",
                        "Social management — SAR 2,990",
                        "Integrated management — SAR 4,990",
                        "Expanded management — SAR 7,990",
                        "Standalone product preparation",
                        "Digital product or partnership",
                      ]
                  ).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field
                label={
                  ar
                    ? "رابط الموقع أو الحساب (اختياري)"
                    : "Website or account link (optional)"
                }
                wide
              >
                <input name="website" maxLength={250} dir="ltr" />
              </Field>
            </div>
            {notice && (
              <div
                className={`mt-5 rounded-xl border p-4 text-sm ${notice.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-red-500/30 bg-red-500/10 text-red-200"}`}
              >
                {notice.text}
              </div>
            )}
            <button
              disabled={sending}
              className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-black hover:bg-blue-500 disabled:opacity-60"
            >
              {sending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {ar ? "جارٍ الإرسال..." : "Sending..."}
                </>
              ) : (
                <>
                  {ar ? "إرسال الطلب للمراجعة" : "Send request for review"}
                  <Arrow className="h-5 w-5" />
                </>
              )}
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">
              {ar
                ? "نستخدم بياناتك للرد على هذا الطلب فقط."
                : "We use your details only to respond to this request."}
            </p>
          </form>
        </div>
      </section>

      <section className="bg-[#f5f7fb] py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <p className="text-sm font-black tracking-[.18em] text-blue-600">
              {ar ? "قبل أن تبدأ" : "BEFORE YOU START"}
            </p>
            <h2 className="mt-4 text-4xl font-black">
              {ar
                ? "أسئلة واضحة وإجابات مباشرة"
                : "Clear questions, direct answers"}
            </h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map(([question, answer], index) => (
              <div
                key={question}
                className="rounded-2xl border border-slate-200 bg-white"
              >
                <button
                  onClick={() => setFaq(faq === index ? -1 : index)}
                  className="flex w-full items-center justify-between gap-5 p-6 text-start font-black"
                >
                  {question}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition ${faq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {faq === index && (
                  <p className="px-6 pb-6 leading-8 text-slate-600">{answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function PillarVisual({ kind, ar }: { kind: PillarKind; ar: boolean }) {
  if (kind === "website") {
    return (
      <div
        role="img"
        aria-label={
          ar
            ? "لوحة متابعة وصيانة موقع إلكتروني"
            : "Website maintenance and monitoring dashboard"
        }
        className="relative h-52 overflow-hidden bg-gradient-to-br from-[#06101e] via-[#0b2042] to-[#123b78] p-5 text-white"
      >
        <div className="absolute -end-10 -top-12 h-36 w-36 rounded-full bg-blue-400/20 blur-2xl" />
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#07111f]/95 shadow-2xl transition duration-500 group-hover:scale-[1.025]">
          <div className="flex h-8 items-center gap-1.5 border-b border-white/10 px-3">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="ms-auto h-2 w-20 rounded-full bg-white/10" />
          </div>
          <div className="grid grid-cols-[1.12fr_.88fr] gap-3 p-3">
            <div className="rounded-xl bg-white/[.06] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-300">
                  {ar ? "حالة الموقع" : "Site status"}
                </span>
                <span className="flex items-center gap-1 text-[9px] font-black text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {ar ? "يعمل" : "ONLINE"}
                </span>
              </div>
              <div className="mt-3 flex h-14 items-end gap-1">
                {[35, 55, 42, 68, 57, 82, 74, 92].map((height, index) => (
                  <span
                    key={index}
                    className="flex-1 rounded-t bg-gradient-to-t from-blue-600 to-cyan-300"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {[
                ar ? "نسخة احتياطية" : "Backup",
                ar ? "تحديثات" : "Updates",
                ar ? "حماية" : "Security",
              ].map((label, index) => (
                <div
                  key={label}
                  className="rounded-lg bg-white/[.06] px-2.5 py-2"
                >
                  <div className="flex items-center justify-between text-[9px] text-slate-300">
                    <span>{label}</span>
                    <Check className="h-3 w-3 text-emerald-300" />
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${88 - index * 8}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (kind === "marketing") {
    return (
      <div
        role="img"
        aria-label={
          ar
            ? "تقويم محتوى ولوحة أداء حملة تسويقية"
            : "Content calendar and marketing campaign dashboard"
        }
        className="relative h-52 overflow-hidden bg-gradient-to-br from-[#100b28] via-[#28145b] to-[#6a29b8] p-5 text-white"
      >
        <div className="absolute -start-8 bottom-0 h-32 w-32 rounded-full bg-fuchsia-400/20 blur-2xl" />
        <div className="relative grid h-full grid-cols-[.85fr_1.15fr] gap-3 transition duration-500 group-hover:scale-[1.025]">
          <div className="grid grid-cols-2 gap-2">
            {[
              "from-cyan-400 to-blue-600",
              "from-fuchsia-400 to-violet-600",
              "from-amber-300 to-orange-500",
              "from-emerald-300 to-teal-600",
            ].map((gradient) => (
              <div
                key={gradient}
                className="rounded-xl border border-white/15 bg-white/10 p-2 shadow-lg"
              >
                <div
                  className={`aspect-square rounded-lg bg-gradient-to-br ${gradient} opacity-90`}
                />
                <div className="mt-2 h-1.5 rounded bg-white/25" />
                <div className="mt-1 h-1.5 w-2/3 rounded bg-white/15" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/15 bg-[#0b1020]/90 p-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-200">
                {ar ? "أداء الحملة" : "Campaign"}
              </span>
              <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[9px] font-black text-emerald-300">
                +28%
              </span>
            </div>
            <div className="mt-3 flex h-16 items-end gap-1.5">
              {[30, 48, 39, 65, 54, 76, 88].map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-t bg-gradient-to-t from-violet-700 to-fuchsia-300"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white/[.06] p-2">
                <div className="text-[8px] text-slate-400">
                  {ar ? "العملاء" : "LEADS"}
                </div>
                <div className="mt-1 text-sm font-black">184</div>
              </div>
              <div className="rounded-lg bg-white/[.06] p-2">
                <div className="text-[8px] text-slate-400">ROAS</div>
                <div className="mt-1 text-sm font-black">4.2×</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={
        ar
          ? "مجموعة منتجات رقمية جاهزة للبيع والتنزيل"
          : "Digital products ready for sale and download"
      }
      className="relative h-52 overflow-hidden bg-gradient-to-br from-[#071a20] via-[#073d44] to-[#087a75] p-5 text-white"
    >
      <div className="absolute -end-6 bottom-0 h-36 w-36 rounded-full bg-emerald-300/20 blur-2xl" />
      <div className="relative flex h-full items-center justify-center transition duration-500 group-hover:scale-[1.025]">
        <div className="absolute start-5 top-7 w-28 -rotate-6 rounded-2xl border border-white/20 bg-[#0d1728] p-3 shadow-2xl">
          <div className="flex h-16 items-end gap-1 rounded-lg bg-emerald-400/10 p-2">
            {[45, 72, 58, 88].map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-t bg-emerald-300"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-2 text-[9px] font-black">XLSX</div>
        </div>
        <div className="z-10 w-32 rounded-2xl border border-white/25 bg-white p-3 text-slate-900 shadow-2xl">
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 p-3 text-white">
            <Layers3 className="h-7 w-7" />
            <div className="mt-5 text-[10px] font-black leading-4">
              {ar ? "منتج رقمي" : "DIGITAL PRODUCT"}
            </div>
          </div>
          <div className="mt-2 h-1.5 rounded bg-slate-200" />
          <div className="mt-1 h-1.5 w-2/3 rounded bg-slate-100" />
        </div>
        <div className="absolute end-4 top-9 w-28 rotate-6 rounded-2xl border border-white/20 bg-[#11182a] p-3 shadow-2xl">
          <div className="flex h-16 items-center justify-center rounded-lg bg-blue-400/10">
            <PackageOpen className="h-8 w-8 text-blue-300" />
          </div>
          <div className="mt-2 flex items-center justify-between text-[9px] font-black">
            <span>PDF</span>
            <span className="text-emerald-300">↓</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustItem({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm font-bold text-slate-300">
      <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
      {text}
    </p>
  );
}

function Field({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      className={`text-sm font-bold text-slate-300 ${wide ? "sm:col-span-2" : ""}`}
    >
      <span>{label}</span>
      <div className="mt-2 [&>input]:h-12 [&>input]:w-full [&>input]:rounded-xl [&>input]:border [&>input]:border-white/10 [&>input]:bg-[#111827] [&>input]:px-4 [&>input]:text-white [&>input]:outline-none [&>select]:h-12 [&>select]:w-full [&>select]:rounded-xl [&>select]:border [&>select]:border-white/10 [&>select]:bg-[#111827] [&>select]:px-4 [&>select]:text-white [&>select]:outline-none">
        {children}
      </div>
    </label>
  );
}
