import { Link, Navigate, useParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CircleCheckBig,
  Clock3,
  Megaphone,
  PenTool,
  Search,
  Store,
  Target,
  Users,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const services = {
  "growth-strategy": {
    icon: Target,
    image: "/images/services/strategy-session.jpg",
    ar: { title: "استراتيجية النمو الرقمي", intro: "خطة عملية تربط أهداف النشاط بالقنوات والرسائل ومؤشرات الأداء.", includes: ["مراجعة النشاط والحضور الحالي", "تحليل الجمهور والمنافسين", "تحديد الأولويات والقنوات", "خطة تنفيذ ومؤشرات قياس"], fit: "للأنشطة التي تنفذ أعمالاً متفرقة وتحتاج إلى اتجاه واضح قبل زيادة الإنفاق.", timeline: "تُحدد بعد جلسة التشخيص بحسب حجم النشاط والبيانات المتاحة." },
    en: { title: "Digital growth strategy", intro: "An actionable plan connecting business goals with channels, messages, and KPIs.", includes: ["Business and presence audit", "Audience and competitor review", "Channel prioritization", "Action plan and KPIs"], fit: "For businesses doing disconnected activities that need direction before increasing spend.", timeline: "Confirmed after discovery based on business size and available data." },
  },
  "paid-campaigns": {
    icon: Megaphone,
    image: "/images/services/analytics-dashboard.jpg",
    ar: { title: "إدارة الحملات الإعلانية", intro: "تخطيط وتشغيل وتحسين الحملات حول هدف تجاري وميزانية محددين.", includes: ["إعداد هيكل الحملة", "صياغة الرسائل الإعلانية", "اختبار المواد والجمهور", "متابعة وتحسين وتقارير"], fit: "للأنشطة التي تملك عرضاً واضحاً وصفحة جاهزة لاستقبال العملاء.", timeline: "مدة التشغيل والاختبار تُحدد في العرض، وميزانية الإعلان منفصلة عن أتعاب الإدارة." },
    en: { title: "Paid campaign management", intro: "Plan, launch, and optimize campaigns around a defined business goal and budget.", includes: ["Campaign structure", "Advertising messages", "Creative and audience testing", "Optimization and reporting"], fit: "For businesses with a clear offer and a destination ready to receive customers.", timeline: "The operating period is defined in the proposal; media spend is separate from management fees." },
  },
  "social-presence": {
    icon: Users,
    image: "/images/services/growth-team.jpg",
    ar: { title: "إدارة الحضور الاجتماعي", intro: "حضور منظم يعكس هوية النشاط ويخدم هدفاً واضحاً بدلاً من النشر العشوائي.", includes: ["تحديد محاور المحتوى", "تقويم نشر", "تصميم وكتابة المحتوى", "متابعة الأداء"], fit: "للشركات والعلامات التي تحتاج إلى انتظام وهوية ورسائل موحدة.", timeline: "النطاق الشهري وعدد المنصات والمخرجات يحدد بعد التشخيص." },
    en: { title: "Social presence management", intro: "A consistent presence built around brand identity and a clear objective.", includes: ["Content pillars", "Publishing calendar", "Design and copy", "Performance review"], fit: "For brands that need consistency, identity, and unified messaging.", timeline: "Monthly scope, platforms, and deliverables are confirmed after discovery." },
  },
  "creative-content": {
    icon: PenTool,
    image: "/images/services/content-production.jpg",
    ar: { title: "المحتوى الإبداعي", intro: "محتوى مكتوب وبصري يشرح القيمة ويقود العميل نحو الخطوة التالية.", includes: ["رسائل وهوية لفظية", "كتابة صفحات وحملات", "تصميمات رقمية", "محتوى منصات التواصل"], fit: "للأنشطة التي تملك خدمة جيدة لكن عرضها الحالي لا يوضح قيمتها.", timeline: "يعتمد على عدد القطع ونوعها ومتطلبات الإنتاج." },
    en: { title: "Creative content", intro: "Written and visual content that explains value and guides customers to the next step.", includes: ["Messaging and tone", "Page and campaign copy", "Digital design", "Social content"], fit: "For businesses with a strong offer that is not yet communicated clearly.", timeline: "Timing depends on content volume, formats, and production requirements." },
  },
  "ecommerce-development": {
    icon: Store,
    image: "/images/services/ecommerce-workspace.jpg",
    ar: { title: "تطوير المتاجر الإلكترونية", intro: "تحسين الواجهة ورحلة الشراء وصفحات المنتجات لرفع الوضوح والثقة.", includes: ["مراجعة تجربة المستخدم", "تحسين الصفحة الرئيسية", "تحسين صفحات المنتجات", "تهيئة القياس والتحويل"], fit: "للمتاجر القائمة التي تعاني من ضعف الوضوح أو صعوبة رحلة الشراء.", timeline: "تحدد المدة بعد مراجعة المنصة وعدد الصفحات والتكاملات المطلوبة." },
    en: { title: "E-commerce development", intro: "Improve storefront clarity, buying journeys, and product pages.", includes: ["User experience review", "Homepage improvements", "Product page improvements", "Measurement setup"], fit: "For existing stores with unclear offers or a difficult buying journey.", timeline: "Timing is confirmed after reviewing the platform, pages, and integrations." },
  },
  "search-analytics": {
    icon: Search,
    image: "/images/services/creative-work.jpg",
    ar: { title: "الظهور والتحليلات", intro: "أساس تقني ومحتوى قابل للقياس يساعدك على فهم الظهور وسلوك الزوار.", includes: ["مراجعة الظهور في البحث", "تهيئة القياس", "تحديد مؤشرات الأداء", "تقرير فرص وتحسينات"], fit: "للأنشطة التي تريد قرارات مبنية على بيانات بدلاً من الانطباعات.", timeline: "يتغير حسب حجم الموقع وحالة أدوات القياس الحالية." },
    en: { title: "Search and analytics", intro: "A measurable technical and content foundation for visibility and visitor behavior.", includes: ["Search visibility review", "Measurement setup", "KPI definition", "Opportunity report"], fit: "For businesses that want decisions based on evidence rather than assumptions.", timeline: "Timing depends on site size and the current analytics setup." },
  },
} as const;

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const service = slug ? services[slug as keyof typeof services] : undefined;

  if (!service) return <Navigate to="/" replace />;

  const copy = service[isAr ? "ar" : "en"];
  const Icon = service.icon;

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-[#10131a]">
      <section className="bg-[#080b12] text-white pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-blue-300 mb-7 hover:text-white transition"><Arrow className="w-4 h-4" />{isAr ? "كل الخدمات" : "All services"}</Link>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400 mb-6"><Icon className="w-6 h-6" /></div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">{copy.title}</h1>
            <p className="text-lg leading-8 text-gray-300 mb-8 max-w-2xl">{copy.intro}</p>
            <Link to={`/contact?service=${slug}`} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-black hover:bg-blue-500 transition">{isAr ? "اطلب عرضاً لهذه الخدمة" : "Request a proposal"}<Arrow className="w-5 h-5" /></Link>
          </div>
          <img src={service.image} alt={copy.title} className="w-full aspect-[4/3] object-cover rounded-[2rem] border border-white/10" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid lg:grid-cols-[1.2fr_.8fr] gap-10">
        <div className="rounded-3xl border border-gray-200 bg-white p-7 md:p-10 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-black mb-7">{isAr ? "ما الذي تتضمنه الخدمة؟" : "What is included?"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {copy.includes.map(item => <div key={item} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 font-semibold"><Check className="w-5 h-5 text-emerald-600 shrink-0" />{item}</div>)}
          </div>
          <div className="mt-9 border-t border-gray-100 pt-8">
            <h3 className="font-black text-lg mb-3">{isAr ? "لمن تناسب؟" : "Who is it for?"}</h3>
            <p className="text-gray-600 leading-8">{copy.fit}</p>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl bg-[#0b0e15] text-white p-7">
            <CircleCheckBig className="w-7 h-7 text-emerald-400 mb-5" />
            <p className="text-sm text-blue-300 font-bold mb-2">{isAr ? "التسعير" : "Pricing"}</p>
            <h2 className="text-2xl font-black mb-4">{isAr ? "عرض مخصص بعد التشخيص" : "Custom proposal after discovery"}</h2>
            <p className="text-gray-400 leading-7 text-sm">{isAr ? "لا نعرض رقماً وهمياً لخدمات تختلف باختلاف النطاق. تحصل قبل البدء على السعر والمخرجات والمدة وطريقة الدفع مكتوبة بوضوح." : "We do not publish a made-up price for variable work. Before starting, you receive the cost, deliverables, timeline, and payment terms in writing."}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-7">
            <Clock3 className="w-6 h-6 text-blue-600 mb-4" />
            <h3 className="font-black mb-2">{isAr ? "المدة المتوقعة" : "Expected timing"}</h3>
            <p className="text-gray-600 text-sm leading-7">{copy.timeline}</p>
          </div>
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-7">
            <BarChart3 className="w-6 h-6 text-blue-700 mb-4" />
            <h3 className="font-black mb-2">{isAr ? "ما قبل الموافقة" : "Before approval"}</h3>
            <p className="text-gray-700 text-sm leading-7">{isAr ? "نوضح الهدف والنطاق والمخرجات وآلية القياس. لا يبدأ التنفيذ ولا يطلب أي دفع قبل موافقتك على العرض." : "We define the goal, scope, deliverables, and measurement. Work and payment do not begin before you approve the proposal."}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
