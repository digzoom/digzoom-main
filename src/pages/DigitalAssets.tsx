import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileText,
  Globe2,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Store,
  UploadCloud,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const assetTypes = [
  { icon: Globe2, ar: "مواقع ومتاجر", en: "Websites & stores" },
  { icon: KeyRound, ar: "دومينات", en: "Domains" },
  { icon: Mail, ar: "نشرات بريدية", en: "Newsletters" },
  { icon: FileText, ar: "أصول رقمية", en: "Digital assets" },
];

export default function DigitalAssets() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const Arrow = ar ? ArrowLeft : ArrowRight;

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <section className="relative overflow-hidden bg-[#07101c] pb-20 pt-32 text-white md:pb-24 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(37,99,235,.28),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(124,58,237,.2),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-200">
              <Store className="h-4 w-4" />
              {ar ? "سوق الأصول الرقمية" : "Digital Asset Marketplace"}
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.05] tracking-[-.04em] sm:text-6xl">
              {ar ? "بع واشترِ أصولًا رقمية" : "Buy and sell digital assets"}
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                {ar ? "قابلة للنقل والتحقق." : "that can be transferred and verified."}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {ar
                ? "مواقع، دومينات، نشرات بريدية وأصول رقمية أخرى بعد التحقق من الملكية وإمكانية النقل."
                : "Websites, domains, newsletters, and other digital assets after ownership and transferability checks."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/partners" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 font-black">
                <UploadCloud className="h-5 w-5" />
                {ar ? "اعرض أصلك للبيع" : "List your asset"}
                <Arrow className="h-5 w-5" />
              </Link>
              <a href="#how-it-works" className="inline-flex min-h-14 items-center rounded-2xl border border-white/15 bg-white/[.05] px-7 font-bold">
                {ar ? "كيف تعمل الصفقة؟" : "How it works"}
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[.05] p-2 shadow-2xl">
            <img src="/images/brand-mockup.jpg" alt={ar ? "سوق أصول رقمية" : "Digital asset marketplace"} className="aspect-[16/11] w-full rounded-[24px] object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[.18em] text-blue-600">DIGZOOM ASSETS</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">{ar ? "أنواع الأصول التي نستقبلها" : "Asset types we accept"}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {assetTypes.map(({ icon: Icon, ar: arName, en }) => (
              <div key={en} className="rounded-3xl border border-slate-200 bg-[#f8fafc] p-6">
                <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600"><Icon className="h-6 w-6" /></div>
                <h3 className="mt-5 text-xl font-black">{ar ? arName : en}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {ar ? "تخضع للمراجعة والتحقق قبل الإدراج." : "Reviewed and verified before listing."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f0f3f8]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <BadgeCheck className="h-7 w-7 text-emerald-600" />
              <h3 className="mt-5 text-xl font-black">{ar ? "ملكية موثقة" : "Verified ownership"}</h3>
              <p className="mt-3 leading-7 text-slate-600">{ar ? "نطلب إثبات الملكية قبل نشر أي أصل." : "Ownership proof is required before any listing goes live."}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <LockKeyhole className="h-7 w-7 text-blue-600" />
              <h3 className="mt-5 text-xl font-black">{ar ? "نقل منظم" : "Structured transfer"}</h3>
              <p className="mt-3 leading-7 text-slate-600">{ar ? "يتم تحديد خطوات النقل والتحقق قبل إتمام الصفقة." : "Transfer and verification steps are defined before closing."}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <ShieldCheck className="h-7 w-7 text-violet-600" />
              <h3 className="mt-5 text-xl font-black">{ar ? "التزام شروط المنصة" : "Platform-compliant"}</h3>
              <p className="mt-3 leading-7 text-slate-600">{ar ? "لا ندرج أصلًا إذا كانت الخدمة تمنع بيعه أو نقله." : "Assets are not listed when the service prohibits sale or transfer."}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-black uppercase tracking-[.18em] text-violet-600">HOW IT WORKS</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">{ar ? "طريقة البيع عبر DigZoom" : "How selling works"}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              [ar ? "قدّم الأصل" : "Submit", ar ? "أرسل بيانات الأصل ورابط المعاينة." : "Share the asset details and preview."],
              [ar ? "التحقق" : "Verify", ar ? "نراجع الملكية وإمكانية النقل." : "We review ownership and transferability."],
              [ar ? "الاتفاق" : "Agree", ar ? "نحدد السعر والعمولة وآلية التسوية." : "Price, commission, and settlement are agreed."],
              [ar ? "النقل" : "Transfer", ar ? "يتم النقل والتحقق ثم إغلاق الصفقة." : "The asset is transferred, verified, then closed."],
            ].map(([title, text], index) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-[#f8fafc] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 font-black text-white">0{index + 1}</div>
                <h3 className="mt-5 text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f0f3f8]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex items-center gap-2 text-sm font-black text-emerald-600"><CheckCircle2 className="h-4 w-4" />{ar ? "إدراج بعد المراجعة فقط" : "Reviewed listings only"}</div>
                <h2 className="mt-4 text-3xl font-black">{ar ? "جاهز تعرض أصلك؟" : "Ready to list your asset?"}</h2>
                <p className="mt-4 max-w-2xl leading-7 text-slate-600">{ar ? "أرسل بياناته من نموذج الشركاء وسنراجع الملاءمة والحقوق قبل النشر." : "Submit it through the partner form and we will review fit and rights before publishing."}</p>
              </div>
              <Link to="/partners" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-slate-950 px-7 font-black text-white">
                {ar ? "ابدأ التقديم" : "Start submission"}<Arrow className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
