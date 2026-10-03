import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Box,
  BriefcaseBusiness,
  CheckCircle2,
  Cloud,
  Gamepad2,
  Headphones,
  Laptop2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const categories = [
  { icon: Bot, ar: "الذكاء الاصطناعي", en: "AI Tools", href: "/shop?category=ai" },
  { icon: Cloud, ar: "الاشتراكات", en: "Subscriptions", href: "/shop?category=subscriptions" },
  { icon: Laptop2, ar: "البرامج", en: "Software", href: "/shop?category=software" },
  { icon: Gamepad2, ar: "الألعاب", en: "Gaming", href: "/shop?category=gaming" },
  { icon: Box, ar: "القوالب والملفات", en: "Templates & Files", href: "/shop?category=templates" },
  { icon: BriefcaseBusiness, ar: "حلول الأعمال", en: "Business Solutions", href: "/marketing" },
];

const benefitsAr = [
  ["تسليم رقمي سريع", "المنتجات المؤهلة تُسلّم أو تُجهّز مباشرة بعد تأكيد الدفع."],
  ["دفع آمن", "تجربة شراء واضحة عبر بوابات الدفع المتاحة في DigZoom."],
  ["دعم قبل وبعد الشراء", "نوضح الترخيص وطريقة الاستخدام قبل أن تدفع."],
];

const benefitsEn = [
  ["Fast digital delivery", "Eligible products are delivered or prepared right after payment confirmation."],
  ["Secure checkout", "A clear checkout experience using the payment methods available on DigZoom."],
  ["Support before and after purchase", "We explain licensing and usage before you pay."],
];

export default function DigitalHubHome() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const Arrow = ar ? ArrowLeft : ArrowRight;
  const benefits = ar ? benefitsAr : benefitsEn;

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      <section className="relative isolate border-b border-white/10 pb-20 pt-28 md:pb-28 md:pt-36">
        <div className="absolute inset-0 -z-20 bg-[#05070d]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(0,149,255,.20),transparent_28%),radial-gradient(circle_at_85%_25%,rgba(168,85,247,.18),transparent_24%),radial-gradient(circle_at_50%_80%,rgba(14,165,233,.10),transparent_32%)]" />
        <div className="absolute inset-0 -z-10 opacity-[.05] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
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
                ? "اشتراكات وبرامج وأدوات ذكاء اصطناعي وقوالب رقمية، مع خدمات إدارة المواقع والتسويق للشركات التي تريد تنفيذًا كاملًا."
                : "Subscriptions, software, AI tools, digital templates, plus website and marketing services for businesses that need full execution."}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 font-black shadow-[0_18px_60px_rgba(59,130,246,.25)] transition hover:scale-[1.01]"
              >
                <ShoppingBag className="h-5 w-5" />
                {ar ? "تصفح المتجر" : "Browse the store"}
                <Arrow className="h-5 w-5" />
              </Link>
              <Link
                to="/marketing"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[.04] px-7 font-bold transition hover:bg-white/[.08]"
              >
                <BriefcaseBusiness className="h-5 w-5" />
                {ar ? "خدمات إدارة المواقع" : "Website management services"}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-400">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" />{ar ? "شراء واضح وآمن" : "Clear, secure purchase"}</span>
              <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-amber-300" />{ar ? "منتجات رقمية" : "Digital products"}</span>
              <span className="inline-flex items-center gap-2"><Headphones className="h-4 w-4 text-cyan-300" />{ar ? "دعم مباشر" : "Direct support"}</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[36px] bg-gradient-to-br from-blue-600/20 via-violet-500/10 to-cyan-400/20 blur-3xl" />
            <div className="rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">DIGZOOM</div>
                  <div className="mt-1 text-lg font-black">{ar ? "السوق الرقمي" : "Digital marketplace"}</div>
                </div>
                <div className="rounded-xl bg-white/10 p-3"><ShoppingBag className="h-5 w-5" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.map(({ icon: Icon, ar: arName, en, href }) => (
                  <Link key={href} to={href} className="group rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[.08]">
                    <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 p-3 ring-1 ring-white/10">
                      <Icon className="h-6 w-6 text-blue-200" />
                    </div>
                    <div className="text-sm font-extrabold text-white">{ar ? arName : en}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="text-sm font-black uppercase tracking-[.18em] text-blue-400">{ar ? "الأقسام" : "Categories"}</div>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">{ar ? "ابدأ من حاجتك" : "Start with what you need"}</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 font-bold text-blue-300 hover:text-blue-200">
            {ar ? "عرض جميع المنتجات" : "View all products"}<Arrow className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ icon: Icon, ar: arName, en, href }) => (
            <Link key={href} to={href} className="group rounded-3xl border border-white/10 bg-white/[.035] p-6 transition hover:-translate-y-1 hover:border-blue-400/25 hover:bg-white/[.06]">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-cyan-500/15 to-violet-500/15 p-3 ring-1 ring-white/10"><Icon className="h-7 w-7 text-cyan-200" /></div>
                  <h3 className="text-xl font-black">{ar ? arName : en}</h3>
                </div>
                <Arrow className="mt-2 h-5 w-5 text-slate-500 transition group-hover:text-blue-300" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[.025]">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          {benefits.map(([title, text]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              <h3 className="mt-5 text-lg font-black">{title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-violet-400/20 bg-gradient-to-br from-blue-950/70 via-[#111329] to-violet-950/50 p-7 md:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-3 text-sm font-black uppercase tracking-[.18em] text-violet-300">DIGZOOM BUSINESS</div>
              <h2 className="text-3xl font-black md:text-5xl">{ar ? "ولا نلغي خدمات إدارة المواقع." : "Website management stays."}</h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                {ar
                  ? "إذا كنت صاحب متجر أو شركة وتريد فريقًا يتولى موقعك ومنتجاتك ومحتواك، يبقى هذا المسار موجودًا كخدمة مستقلة داخل DigZoom."
                  : "If you run a store or company and need a team to manage your site, products, and content, that remains a dedicated DigZoom service."}
              </p>
            </div>
            <Link to="/marketing" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-7 font-black text-[#090b12]">
              {ar ? "شاهد خدمات الأعمال" : "View business services"}<Arrow className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
