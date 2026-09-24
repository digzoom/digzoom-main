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
          title: "نعتني بموقعك",
          text: "نراجع عمل الموقع، نحدّث الأسعار والعروض، ونجهز صفحات المنتجات من معلوماتك وصورك.",
          points: [
            "متابعة الأعطال",
            "تجهيز صفحات المنتجات",
            "تحديث الأسعار والعروض",
          ],
          href: "/plans/website-stability",
          cta: "كيف نعتني بموقعك؟",
        },
        {
          visual: "marketing" as PillarKind,
          icon: Megaphone,
          title: "نجهز وننشر محتواك",
          text: "نصمم منشورات وقصصًا، نكتب النصوص، وننشرها على حساباتك وفق جدول نتفق عليه معك.",
          points: ["منشورات وقصص", "جدول نشر واضح", "تقرير عمّا نُشر"],
          href: "/plans/social-presence",
          cta: "كيف ندير حساباتك؟",
        },
        {
          visual: "products" as PillarKind,
          icon: PackageOpen,
          title: "قوالب وملفات جاهزة",
          text: "اشترِ قوالب وملفات يمكنك تنزيلها واستخدامها في عملك مباشرة.",
          points: ["شراء وتنزيل مباشر", "وصف واضح لكل ملف", "قوالب وخطط عملية"],
          href: "/shop",
          cta: "تصفح الملفات الجاهزة",
        },
      ]
    : [
        {
          visual: "website" as PillarKind,
          icon: Wrench,
          title: "We look after your website",
          text: "We check the website, update prices and offers, and prepare product pages using your information and photos.",
          points: [
            "Issue monitoring",
            "Product page preparation",
            "Price and offer updates",
          ],
          href: "/plans/website-stability",
          cta: "How we manage your site",
        },
        {
          visual: "marketing" as PillarKind,
          icon: Megaphone,
          title: "We create and publish content",
          text: "We design posts and stories, write captions, and publish on your accounts to an agreed calendar.",
          points: [
            "Posts and stories",
            "Clear posting calendar",
            "Publishing report",
          ],
          href: "/plans/social-presence",
          cta: "How we manage your accounts",
        },
        {
          visual: "products" as PillarKind,
          icon: PackageOpen,
          title: "Ready-to-use templates and files",
          text: "Buy downloadable templates and files you can put to work right away.",
          points: [
            "Buy and download",
            "Clear description for each file",
            "Practical templates and plans",
          ],
          href: "/shop",
          cta: "Browse ready-to-use files",
        },
      ];

  const needOptions: Array<{ id: Need; label: string; icon: typeof Wrench }> =
    ar
      ? [
          { id: "website", label: "موقعي يحتاج تحديث", icon: Wrench },
          { id: "social", label: "حساباتي تحتاج منشورات", icon: Megaphone },
          { id: "complete", label: "موقعي وحساباتي معًا", icon: Layers3 },
          { id: "scale", label: "أحتاج محتوى وإعلانات أكثر", icon: BarChart3 },
          {
            id: "catalog",
            label: "عندي منتجات أريد إضافتها",
            icon: PackageOpen,
          },
        ]
      : [
          { id: "website", label: "My website needs updates", icon: Wrench },
          { id: "social", label: "My accounts need posts", icon: Megaphone },
          { id: "complete", label: "My website and accounts", icon: Layers3 },
          {
            id: "scale",
            label: "I need more content and ads",
            icon: BarChart3,
          },
          {
            id: "catalog",
            label: "I need to add products",
            icon: PackageOpen,
          },
        ];

  const recommendations = ar
    ? {
        website: {
          title: "باقة استقرار الموقع",
          text: "نراقب موقعك، نحدّث العروض والمعلومات، ونجهز صفحتي منتج كل شهر.",
          price: "1,490 ر.س شهريًا",
          href: "/plans/website-stability",
        },
        social: {
          title: "باقة حضور اجتماعي",
          text: "نجهز 12 منشورًا و12 قصة، وننشرها على حسابين تختارهما كل شهر.",
          price: "2,990 ر.س شهريًا",
          href: "/plans/social-presence",
        },
        complete: {
          title: "إدارة موقعك وتسويقك بالكامل",
          text: "نحدّث موقعك، ندير 3 حسابات، نضيف حتى 20 منتجًا أو خدمة، ونتابع إعلانًا شهريًا.",
          price: "4,990 ر.س شهريًا",
          href: "/plans/growth-system",
        },
        scale: {
          title: "باقة الإدارة الموسعة",
          text: "محتوى أكثر لثلاثة حسابات، حتى 25 منتجًا أو خدمة، وصفحة عرض وحملة إعلانية شهريًا.",
          price: "7,990 ر.س شهريًا",
          href: "/plans/digital-scale",
        },
        catalog: {
          title: "خدمة تجهيز المنتجات",
          text: "أرسل لنا صور المنتجات ومعلوماتها، ونجهز صفحاتها على موقعك دون اشتراك شهري.",
          price: "ابتداءً من 490 ر.س",
          href: "#catalog",
        },
      }
    : {
        website: {
          title: "Website Stability",
          text: "We monitor your site, refresh offers and details, and prepare two product pages each month.",
          price: "SAR 1,490/month",
          href: "/plans/website-stability",
        },
        social: {
          title: "Social Presence",
          text: "We create 12 posts and 12 stories and publish them on two selected accounts every month.",
          price: "SAR 2,990/month",
          href: "/plans/social-presence",
        },
        complete: {
          title: "Website & Marketing Management",
          text: "We update your website, manage three accounts, add up to 20 products or services, and monitor one campaign monthly.",
          price: "SAR 4,990/month",
          href: "/plans/growth-system",
        },
        scale: {
          title: "Expanded Management",
          text: "More content for three accounts, up to 25 listings, an offer page, and one campaign each month.",
          price: "SAR 7,990/month",
          href: "/plans/digital-scale",
        },
        catalog: {
          title: "Product preparation",
          text: "Send us your product photos and details; we prepare the pages on your website without a monthly subscription.",
          price: "From SAR 490",
          href: "#catalog",
        },
      };
  const recommendation = recommendations[need];

  const workSamples = ar
    ? [
        {
          image: "/images/products/content-calendar-90-days-realistic.webp",
          title: "جدول منشورات لمدة 90 يومًا",
          text: "مثال لجدول يوضح ماذا سننشر، وفي أي حساب، ومتى، وما الذي اكتمل.",
          tag: "نموذج تسليم توضيحي",
        },
        {
          image: "/images/products/campaign-performance-realistic.webp",
          title: "تقرير نتائج الإعلان",
          text: "مثال لتقرير يوضح مبلغ الإعلان، وعدد النقرات والطلبات التي أمكن قياسها.",
          tag: "نموذج تسليم توضيحي",
        },
        {
          image: "/images/products/marketing-budget-roi-realistic.webp",
          title: "جدول ميزانية الإعلان ونتائجه",
          text: "مثال لجدول يقارن المبلغ المخطط بما صُرف ونتيجة كل حساب أو إعلان.",
          tag: "نموذج تسليم توضيحي",
        },
      ]
    : [
        {
          image: "/images/products/content-calendar-90-days-realistic.webp",
          title: "90-day posting calendar",
          text: "An example calendar showing what we will post, where, when, and what is complete.",
          tag: "Illustrative deliverable",
        },
        {
          image: "/images/products/campaign-performance-realistic.webp",
          title: "Advertising results report",
          text: "An example report showing ad spend, clicks, and the inquiries or orders we can measure.",
          tag: "Illustrative deliverable",
        },
        {
          image: "/images/products/marketing-budget-roi-realistic.webp",
          title: "Ad budget and results table",
          text: "An example table comparing planned and actual spend with each account or ad result.",
          tag: "Illustrative deliverable",
        },
      ];

  const productPacks = ar
    ? [
        ["إدخال 10 منتجات", "بيانات وصور جاهزة من العميل", "490"],
        ["تجهيز 10 منتجات", "وصف وصور وتصنيف وعنوان واضح للبحث", "990"],
        ["تجهيز 25 منتجًا", "إعداد كامل وجاهز للنشر", "1,990"],
        ["تجهيز 50 منتجًا", "إعداد كامل للكتالوج", "3,490"],
      ]
    : [
        ["List 10 products", "Client provides ready copy and images", "490"],
        [
          "Prepare 10 products",
          "Copy, images, categories, and a clear search title",
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
                ? "للمطاعم والمتاجر والشركات"
                : "For restaurants, shops, and service businesses"}
            </div>
            <h1 className="text-[2.7rem] font-black leading-[1.06] tracking-[-.04em] sm:text-6xl lg:text-7xl">
              {ar
                ? "ندير موقعك وحساباتك،"
                : "We manage your website and social accounts,"}
              <span className="mt-2 block bg-gradient-to-r from-[#55a7ff] via-[#737cff] to-[#b165ff] bg-clip-text text-transparent">
                {ar ? "ونجهّز محتوى يعرّف الناس بعملك." : "and create content that introduces your business."}
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              {ar
                ? "نحدّث موقعك ومنتجاتك وعروضك، ونصمّم وننشر محتوى حساباتك بخطة واضحة كل شهر."
                : "We update your website, products, and offers, then design and publish content for your accounts with a clear monthly plan."}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => scrollTo("services")}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 font-black shadow-[0_18px_50px_rgba(37,99,235,.3)] hover:bg-blue-500"
              >
                {ar ? "اعرف كيف نساعدك" : "See how we can help"}
                <Arrow className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollTo("plans")}
                className="min-h-14 rounded-2xl border border-white/15 bg-white/[.04] px-7 font-bold hover:bg-white/[.08]"
              >
                {ar ? "شاهد الباقات والأسعار" : "See plans and prices"}
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {ar
                  ? "تعرف السعر وما يشمله قبل أن تدفع"
                  : "Know the price and what is included before paying"}
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
                        ? "نوضح ما فعلناه كل شهر"
                        : "See what we did each month"}
                    </p>
                    <p className="mt-1 text-[10px] leading-5 text-slate-400">
                      {ar
                        ? "مثال توضيحي؛ تعرض تقاريرك أرقام مشروعك بعد تجهيز القياس."
                        : "Illustration; your reports use your data after tracking is set up."}
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
              {ar ? "كيف نساعد مشروعك" : "HOW WE HELP"}
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              {ar
                ? "أي جزء من عملك تريدنا أن نتولاه؟"
                : "Which part of the work can we take off your hands?"}
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {ar
                ? "نستطيع متابعة موقعك، تجهيز منشورات حساباتك، أو توفير قوالب وملفات جاهزة لعملك."
                : "We can manage your website, prepare posts for your accounts, or offer ready-to-use templates and files."}
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
                      {points.map(point => (
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
              )
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#eef3ff] py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
          <div>
            <p className="text-sm font-black tracking-[.18em] text-blue-700">
              {ar ? "اختر حاجتك" : "CHOOSE YOUR NEED"}
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              {ar ? "ما الذي يشغلك الآن؟" : "What do you need help with?"}
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
              {ar ? "باقة قد تناسبك" : "A PLAN TO CONSIDER"}
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
                {ar ? "أمثلة توضيحية" : "EXAMPLES"}
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                {ar
                  ? "شاهد أمثلة لما قد تستلمه"
                  : "See examples of what we deliver"}
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">
                {ar
                  ? "هذه أمثلة توضيحية لشكل الجداول والتقارير، وليست نتائج لعملاء. نعرض أعمال العملاء الفعلية بعد توثيقها وموافقتهم."
                  : "These examples show the layout of reports and calendars; they are not client results. We share real client work only after verification and permission."}
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <TrustItem
                  text={
                    ar ? "نعرض لك المهام كتابةً" : "Your tasks are written down"
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
                      ? "نخبرك بأي تكلفة إضافية قبل العمل"
                      : "Extra costs are agreed before work"
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
                ? "اختر الباقة المناسبة لعملك"
                : "Choose a plan for your business"}
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {ar
                ? "افتح أي باقة لترى السعر، وما ننفذه كل شهر، وما نحتاجه منك، وما لا يشمله الاشتراك."
                : "Open any plan to see the price, monthly work, what we need from you, and what is not included."}
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-2">
            {servicePlans.map(plan => {
              const popular = plan.id === "growth-system";
              const included = ar ? plan.includedAr : plan.includedEn;
              const descriptions = ar
                ? plan.includedDescriptionsAr
                : plan.includedDescriptionsEn;
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
                    {included.slice(0, popular ? 9 : 4).map((item, index) => (
                      <li
                        key={item}
                        className={`flex gap-2 text-sm leading-6 ${popular ? "text-slate-300" : "text-slate-600"}`}
                      >
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        <div className="min-w-0">
                          <span className="font-bold">{item}</span>
                          {descriptions?.[index] && (
                            <p
                              className={`mt-1 text-xs leading-6 ${popular ? "text-slate-400" : "text-slate-500"}`}
                            >
                              {descriptions[index]}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/plans/${plan.id}`}
                    className={`mt-7 inline-flex min-h-13 items-center justify-center gap-2 rounded-xl px-6 font-black ${popular ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-slate-950 text-white hover:bg-slate-800"}`}
                  >
                    {ar ? "شاهد تفاصيل الباقة" : "See plan details"}
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
                ? "نضيف منتجاتك إلى موقعك"
                : "We add products to your website"}
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              {ar
                ? "أرسل صور منتجاتك وأسعارها. نكتب وصفًا واضحًا، نرتب الصور والمعلومات، ونجهز الصفحات للنشر على موقعك."
                : "Send your product photos and prices. We write clear descriptions, organize the details and images, and prepare pages for your website."}
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
              {ar
                ? "أرسل منتجاتك لنحدد التكلفة"
                : "Send your products for a quote"}
              <Arrow className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 bg-[#f4f7ff] py-16 md:py-20">
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
                  ? "قوالب وملفات تشتريها وتحملها لتستخدمها بنفسك، مع شرح محتوى كل ملف قبل الدفع."
                  : "Buy and download templates and files you can use yourself, with a clear description before payment."}
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
                ar ? "تجهيز صفحة منتج رقمي" : "Preparing a digital product page"
              }
              loading="lazy"
              className="h-44 w-full object-cover md:h-52"
            />
            <div className="p-6 md:p-7">
              <p className="text-sm font-black text-blue-600">
                {ar ? "خدمة مستقلة" : "STANDALONE SERVICE"}
              </p>
              <h2 className="mt-3 text-3xl font-black">
                {ar ? "جهّز صفحات منتجاتك" : "Prepare your product pages"}
              </h2>
              <p className="mt-4 leading-8 text-slate-600">
                {ar
                  ? "نكتب وصف المنتج، نرتب صوره وسعره ومعلوماته، ثم نضيفه إلى موقعك بعد اعتمادك."
                  : "We write product descriptions and organize photos, prices, and details, then add approved pages to your website."}
              </p>
              <button
                onClick={() => scrollTo("catalog")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-black text-white"
              >
                {ar ? "شاهد أسعار التجهيز" : "View preparation pricing"}
                <Arrow className="h-5 w-5" />
              </button>
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
                ? "قل لنا ما تحتاجه لمشروعك"
                : "Tell us what your business needs"}
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              {ar
                ? "أرسل رابط موقعك أو حسابك وما تحتاجه. نراجع طلبك ونوضح ما سنفعله والسعر قبل أن تبدأ؛ إرسال النموذج لا يتطلب دفعًا."
                : "Share your website or account and what you need. We explain the work and price before you start; sending this form requires no payment."}
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
                  ).map(item => (
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
                        "إدارة موقعك وتسويقك بالكامل — 4,990 ر.س",
                        "إدارة موسعة — 7,990 ر.س",
                        "تجهيز المنتجات دون اشتراك",
                        "شراء منتج رقمي",
                      ]
                    : [
                        "Website management — SAR 1,490",
                        "Social management — SAR 2,990",
                        "Website & marketing management — SAR 4,990",
                        "Expanded management — SAR 7,990",
                        "Standalone product preparation",
                        "Purchase a DigZoom digital product",
                      ]
                  ).map(item => (
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
                  {ar ? "أرسل طلبي" : "Send my request"}
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
            ].map(gradient => (
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
                {ar ? "نموذج" : "SAMPLE"}
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
                  {ar ? "الإنفاق" : "SPEND"}
                </div>
                <div className="mt-1 text-[10px] font-black text-slate-300">
                  {ar ? "بعد الربط" : "After setup"}
                </div>
              </div>
              <div className="rounded-lg bg-white/[.06] p-2">
                <div className="text-[8px] text-slate-400">
                  {ar ? "النتائج" : "RESULTS"}
                </div>
                <div className="mt-1 text-[10px] font-black text-slate-300">
                  {ar ? "بعد الربط" : "After setup"}
                </div>
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
