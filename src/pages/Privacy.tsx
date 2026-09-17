import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, Shield, Lock, Eye, Server, Trash2, Share2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function Privacy() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const c = isAr ? {
    home: 'الرئيسية', title: 'سياسة الخصوصية', updated: 'آخر تحديث: 17 سبتمبر 2026',
    sections: [
      ['المعلومات التي نجمعها', 'قد نجمع الاسم والبريد ورقم الهاتف ومعلومات الطلب والتنزيل، إضافة إلى بيانات تقنية محدودة مثل نوع المتصفح وعنوان IP وسجلات الأمان. لا نخزن بيانات البطاقة الكاملة.'],
      ['كيف نستخدم المعلومات', 'نستخدم البيانات لإنشاء الحسابات ومعالجة الطلبات وتسليم المنتجات وتقديم الدعم ومنع الاحتيال والوفاء بالالتزامات القانونية وتحسين الموقع.'],
      ['مشاركة البيانات', 'نشارك الحد الأدنى اللازم مع مزودي الاستضافة وقواعد البيانات والبريد والتحليلات وبوابة الدفع عند تفعيلها. لا نبيع بياناتك الشخصية. وقد نفصح عنها إذا طُلب ذلك قانونيًا.'],
      ['أمن البيانات والاحتفاظ بها', 'نستخدم HTTPS وضوابط وصول وروابط تنزيل محدودة. نحتفظ بالبيانات بقدر الحاجة لتقديم الخدمة وحفظ السجلات والامتثال القانوني، ثم نحذفها أو نجعلها مجهولة عند عدم الحاجة.'],
      ['حقوقك', 'يمكنك طلب نسخة من بياناتك أو تصحيحها أو حذفها أو الاعتراض على بعض أوجه معالجتها، مع مراعاة السجلات التي يلزمنا الاحتفاظ بها قانونيًا.'],
      ['ملفات الارتباط', 'نستخدم ملفات ارتباط ضرورية لتسجيل الدخول والسلة واللغة والأمان، وقد نستخدم تحليلات محدودة لتحسين الأداء. يمكنك التحكم بها من إعدادات المتصفح.'],
    ],
    contact: 'طلبات الخصوصية', contactText: 'لأي طلب متعلق بالخصوصية، تواصل عبر info@digzoom.com. شركة DIGZOOM LIMITED LIABILITY COMPANY، وايومنغ، الولايات المتحدة.',
  } : {
    home: 'Home', title: 'Privacy Policy', updated: 'Last updated: September 17, 2026',
    sections: [
      ['Information we collect', 'We may collect your name, email, phone number, order and download information, plus limited technical data such as browser type, IP address, and security logs. We do not store complete card details.'],
      ['How we use information', 'We use data to create accounts, process orders, deliver products, provide support, prevent fraud, meet legal obligations, and improve the website.'],
      ['Data sharing', 'We share only what is necessary with hosting, database, email, analytics, and payment providers when enabled. We do not sell personal data. We may disclose data when legally required.'],
      ['Security and retention', 'We use HTTPS, access controls, and time-limited download links. We retain information only as needed to provide services, keep business records, and meet legal obligations, then delete or anonymize it.'],
      ['Your rights', 'You may request access, correction, or deletion of personal data, or object to certain processing, subject to records we must retain by law.'],
      ['Cookies', 'We use necessary cookies for sign-in, cart, language, and security, and may use limited analytics to improve performance. You can control cookies in your browser settings.'],
    ],
    contact: 'Privacy requests', contactText: 'For privacy requests, contact info@digzoom.com. DIGZOOM LIMITED LIABILITY COMPANY, Wyoming, United States.',
  };
  const icons = [<Eye />, <Lock />, <Share2 />, <Server />, <Trash2 />, <Shield />];
  return <div className="min-h-screen bg-[#0a0a0f] pt-20 md:pt-24 pb-16" dir={isAr ? 'rtl' : 'ltr'}><div className="max-w-3xl mx-auto px-4 sm:px-6">
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-8"><Link to="/" className="hover:text-blue-400">{c.home}</Link><Arrow className="w-3 h-3"/><span className="text-gray-300">{c.title}</span></div>
    <div className="text-center mb-12"><div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4"><Shield className="w-8 h-8"/></div><h1 className="text-3xl font-bold text-white mb-3">{c.title}</h1><p className="text-gray-400">{c.updated}</p></div>
    <div className="space-y-8">{c.sections.map(([title,text], i)=><Section key={title} icon={icons[i]} title={title} text={text}/>)}
      <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6"><h2 className="text-white font-semibold mb-3">{c.contact}</h2><p className="text-gray-300 leading-7">{c.contactText}</p></div>
    </div>
  </div></div>;
}

function Section({icon,title,text}:{icon:React.ReactNode;title:string;text:string}) { return <section className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6"><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">{icon}</div><h2 className="text-white font-semibold text-lg">{title}</h2></div><p className="text-gray-300 leading-7">{text}</p></section>; }
