import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, RefreshCw, CheckCircle, XCircle, Clock, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function Refund() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const copy = isAr ? {
    home: 'الرئيسية', title: 'سياسة الاسترجاع', updated: 'آخر تحديث: 17 سبتمبر 2026',
    introTitle: 'طلبات الاسترجاع خلال 30 يومًا',
    intro: 'يمكن تقديم طلب استرجاع خلال 30 يومًا من تاريخ الشراء. تتم مراجعة كل طلب وفق أهلية المنتج الرقمي وحالة التسليم والتنزيل.',
    accepted: 'الحالات المؤهلة', rejected: 'الحالات غير المؤهلة', timing: 'مدة معالجة الاسترجاع', how: 'طريقة طلب الاسترجاع',
    acceptedItems: ['لم يتم تسليم المنتج بعد نجاح الدفع', 'الملف تالف أو لا يمكن فتحه', 'المنتج يختلف جوهريًا عن الوصف المنشور', 'تم تحصيل المبلغ مرتين لنفس الطلب', 'تم الشراء بالخطأ ولم يتم تنزيل المنتج أو استخدامه'],
    rejectedItems: ['مر أكثر من 30 يومًا على الشراء', 'تم تنزيل المنتج واستخدامه ولا توجد مشكلة فنية أو اختلاف جوهري عن الوصف', 'تمت مشاركة المنتج أو إعادة بيعه أو إساءة استخدام ترخيصه', 'الخدمة الرقمية بدأت بعد موافقة العميل وتم تنفيذ جزء جوهري منها'],
    timingText: 'نراجع الطلب عادةً خلال يومي عمل. بعد الموافقة، نعيد المبلغ إلى وسيلة الدفع الأصلية، وقد يستغرق ظهوره من 5 إلى 10 أيام عمل حسب البنك أو جهة إصدار البطاقة.',
    steps: ['أرسل الطلب إلى info@digzoom.com', 'أرفق رقم الطلب والبريد المستخدم في الشراء', 'اشرح المشكلة وأرفق صورة أو ملفًا عند وجود خلل فني', 'سنرسل نتيجة المراجعة وتعليمات المعالجة عبر البريد'],
    contact: 'التواصل بخصوص الاسترجاع', contactText: 'البريد الإلكتروني: info@digzoom.com — واتساب: +966 56 988 8456',
  } : {
    home: 'Home', title: 'Refund Policy', updated: 'Last updated: September 17, 2026',
    introTitle: 'Refund requests within 30 days',
    intro: 'You may submit a refund request within 30 days of purchase. Each request is reviewed based on eligibility, delivery status, and whether the digital product was downloaded or used.',
    accepted: 'Eligible cases', rejected: 'Non-eligible cases', timing: 'Refund processing time', how: 'How to request a refund',
    acceptedItems: ['The product was not delivered after successful payment', 'The delivered file is corrupted or cannot be opened', 'The product materially differs from its published description', 'You were charged twice for the same order', 'The purchase was accidental and the product has not been downloaded or used'],
    rejectedItems: ['More than 30 days have passed since purchase', 'The product was downloaded and used without a technical defect or material mismatch', 'The product was shared, resold, or used outside its license', 'A digital service began with your approval and a substantial part has already been delivered'],
    timingText: 'We normally review requests within two business days. Approved refunds are returned to the original payment method and may take 5–10 business days to appear, depending on your bank or card issuer.',
    steps: ['Email your request to info@digzoom.com', 'Include the order number and purchase email', 'Explain the issue and attach supporting evidence for technical problems', 'We will email the review outcome and next steps'],
    contact: 'Refund contact', contactText: 'Email: info@digzoom.com — WhatsApp: +966 56 988 8456',
  };

  return <div className="min-h-screen bg-[#0a0a0f] pt-20 md:pt-24 pb-16" dir={isAr ? 'rtl' : 'ltr'}>
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-8"><Link to="/" className="hover:text-blue-400">{copy.home}</Link><Arrow className="w-3 h-3" /><span className="text-gray-300">{copy.title}</span></div>
      <div className="text-center mb-12"><div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4"><RefreshCw className="w-8 h-8" /></div><h1 className="text-3xl font-bold text-white mb-3">{copy.title}</h1><p className="text-gray-400">{copy.updated}</p></div>
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl border border-emerald-500/20 p-6 mb-8 text-center"><h2 className="text-white font-bold text-xl mb-2">{copy.introTitle}</h2><p className="text-gray-400 leading-7">{copy.intro}</p></div>
      <div className="space-y-8">
        <PolicySection icon={<CheckCircle className="w-5 h-5" />} title={copy.accepted} color="emerald" items={copy.acceptedItems} />
        <PolicySection icon={<XCircle className="w-5 h-5" />} title={copy.rejected} color="red" items={copy.rejectedItems} />
        <TextSection icon={<Clock className="w-5 h-5" />} title={copy.timing} text={copy.timingText} />
        <PolicySection icon={<HelpCircle className="w-5 h-5" />} title={copy.how} color="purple" items={copy.steps} ordered />
        <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6"><h3 className="text-white font-semibold mb-3">{copy.contact}</h3><p className="text-gray-300 text-sm" dir="ltr">{copy.contactText}</p></div>
      </div>
    </div>
  </div>;
}

function PolicySection({ icon, title, items, color, ordered = false }: { icon: React.ReactNode; title: string; items: string[]; color: 'emerald' | 'red' | 'purple'; ordered?: boolean }) {
  const colors = { emerald: 'text-emerald-400 bg-emerald-500/10', red: 'text-red-400 bg-red-500/10', purple: 'text-purple-400 bg-purple-500/10' };
  return <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6"><div className="flex items-center gap-3 mb-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>{icon}</div><h2 className="text-white font-semibold text-lg">{title}</h2></div><ul className="space-y-3 text-gray-400">{items.map((item, i) => <li key={item} className="flex items-start gap-3"><span className={`mt-0.5 flex-shrink-0 ${colors[color].split(' ')[0]}`}>{ordered ? `${i + 1}.` : '•'}</span><span>{item}</span></li>)}</ul></div>;
}

function TextSection({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6"><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">{icon}</div><h2 className="text-white font-semibold text-lg">{title}</h2></div><p className="text-gray-300 leading-7">{text}</p></div>;
}
