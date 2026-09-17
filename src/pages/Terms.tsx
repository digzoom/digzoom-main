import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, FileText, UserCheck, ShoppingBag, Copyright, AlertTriangle, Briefcase } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function Terms() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const c = isAr ? {
    home:'الرئيسية', title:'شروط الاستخدام', updated:'آخر تحديث: 17 سبتمبر 2026',
    sections:[
      ['قبول الشروط','باستخدام digzoom.com فإنك توافق على هذه الشروط وسياسة الخصوصية والاسترجاع والتسليم. إذا لم توافق، فلا تستخدم الموقع أو تشترِ منه.'],
      ['المنتجات والأسعار والدفع','نبيع منتجات رقمية ونقدم خدمات تسويق رقمية. تُعرض الأسعار والعملة بوضوح قبل الشراء. الضرائب القانونية المطبقة، إن وجدت، تظهر قبل الدفع. لا تتم أي عملية دفع إلا عبر بوابة دفع معتمدة عند تفعيلها.'],
      ['التسليم والإلغاء والاسترجاع','تُسلّم المنتجات الرقمية المؤهلة عبر رابط تنزيل آمن بعد تأكيد الدفع. لا يمكن إلغاء المنتج بعد تنزيله إلا إذا انطبقت حالات سياسة الاسترجاع. تخضع الخدمات للنطاق والمدة والمخرجات المتفق عليها قبل البدء.'],
      ['الترخيص والملكية الفكرية','الشراء يمنحك ترخيص الاستخدام المبين في صفحة المنتج، ولا ينقل ملكية حقوق النشر. يُمنع نسخ الملفات أو مشاركتها أو إعادة بيعها ما لم يذكر ترخيص المنتج صراحةً خلاف ذلك.'],
      ['الخدمات الرقمية','قبل بدء أي خدمة، يتم توضيح السعر والنطاق والمخرجات والمدة والمتطلبات. أي تغيير خارج النطاق قد يتطلب عرضًا ومدة إضافيين.'],
      ['الاستخدام المقبول والمسؤولية','يُمنع استخدام الموقع أو منتجاته في نشاط غير قانوني أو محاولة الوصول غير المصرح به. نقدم المنتجات كما وُصفت، وفي حدود ما يسمح به القانون لا نتحمل خسائر غير مباشرة ناشئة عن إساءة الاستخدام.'],
    ],
    contact:'الجهة القانونية والتواصل', contactText:'DIGZOOM LIMITED LIABILITY COMPANY — Wyoming, United States. للاستفسارات: legal@digzoom.com أو info@digzoom.com.',
  }:{
    home:'Home', title:'Terms of Service', updated:'Last updated: September 17, 2026',
    sections:[
      ['Acceptance of terms','By using digzoom.com, you agree to these Terms and our Privacy, Refund, and Delivery Policies. If you do not agree, do not use the website or make a purchase.'],
      ['Products, pricing, and payment','We sell digital products and provide digital marketing services. Prices and currency are displayed before purchase. Any legally applicable taxes are shown before payment. Payments are processed only through an approved payment provider when checkout is enabled.'],
      ['Delivery, cancellation, and refunds','Eligible digital products are delivered through a secure download link after payment confirmation. A downloaded product cannot be cancelled unless it qualifies under our Refund Policy. Services follow the scope, timeline, and deliverables agreed before work begins.'],
      ['License and intellectual property','A purchase grants the license stated on the product page and does not transfer copyright ownership. Files may not be copied, shared, or resold unless the specific product license expressly allows it.'],
      ['Digital services','Before a service begins, we define the price, scope, deliverables, timeline, and customer requirements. Work outside the agreed scope may require a separate quote and timeline.'],
      ['Acceptable use and liability','You may not use the website or products for unlawful activity or attempt unauthorized access. We provide products as described and, to the extent permitted by law, are not responsible for indirect losses caused by misuse.'],
    ],
    contact:'Legal entity and contact', contactText:'DIGZOOM LIMITED LIABILITY COMPANY — Wyoming, United States. Contact: legal@digzoom.com or info@digzoom.com.',
  };
  const icons=[<UserCheck/>,<ShoppingBag/>,<FileText/>,<Copyright/>,<Briefcase/>,<AlertTriangle/>];
  return <div className="min-h-screen bg-[#0a0a0f] pt-20 md:pt-24 pb-16" dir={isAr?'rtl':'ltr'}><div className="max-w-3xl mx-auto px-4 sm:px-6">
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-8"><Link to="/" className="hover:text-blue-400">{c.home}</Link><Arrow className="w-3 h-3"/><span className="text-gray-300">{c.title}</span></div>
    <div className="text-center mb-12"><div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4"><FileText className="w-8 h-8"/></div><h1 className="text-3xl font-bold text-white mb-3">{c.title}</h1><p className="text-gray-400">{c.updated}</p></div>
    <div className="space-y-8">{c.sections.map(([title,text],i)=><Section key={title} icon={icons[i]} title={title} text={text}/>)}
      <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6"><h2 className="text-white font-semibold mb-3">{c.contact}</h2><p className="text-gray-300 leading-7">{c.contactText}</p></div>
    </div>
  </div></div>;
}

function Section({icon,title,text}:{icon:React.ReactNode;title:string;text:string}) { return <section className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6"><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">{icon}</div><h2 className="text-white font-semibold text-lg">{title}</h2></div><p className="text-gray-300 leading-7">{text}</p></section>; }
