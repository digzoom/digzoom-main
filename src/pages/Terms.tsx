import { Link } from 'react-router';
import { ArrowLeft, FileText, UserCheck, ShoppingBag, Copyright, AlertTriangle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 md:pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-400 transition-colors">الرئيسية</Link>
          <ArrowLeft className="w-3 h-3" />
          <span className="text-gray-300">شروط الاستخدام</span>
        </div>

        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4">
            <FileText className="w-7 h-7 md:w-8 md:h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">شروط الاستخدام</h1>
          <p className="text-gray-400 text-sm md:text-base">آخر تحديث: مايو 2025</p>
        </div>

        <div className="space-y-8 md:space-y-10">
          <Section icon={<UserCheck className="w-5 h-5" />} title="قبول الشروط">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              باستخدامك لموقع digzoom، فإنك توافق على الالتزام بهذه الشروط. 
              إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام الموقع. 
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إشعارك بالتغييرات الجوهرية.
            </p>
          </Section>

          <Section icon={<ShoppingBag className="w-5 h-5" />} title="الشراء والدفع">
            <ul className="space-y-2 text-gray-400 text-sm md:text-base">
              <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span> جميع الأسعار معروضة بالريال السعودي (ر.س) وشاملة الضريبة</li>
              <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span> الدفع يتم عبر بوابات دفع آمنة معتمدة</li>
              <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span> بعد إتمام الدفع، يتم تسليم المنتج الرقمي فوراً</li>
              <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span> لا يمكن إلغاء الطلب بعد تحميل المنتج الرقمي</li>
              <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span> يحق لك طلب استرجاع خلال 30 يوماً إذا لم تكن راضياً</li>
            </ul>
          </Section>

          <Section icon={<Copyright className="w-5 h-5" />} title="الملكية الفكرية">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              جميع المنتجات الرقمية المعروضة على digzoom محمية بحقوق الملكية الفكرية. 
              عند الشراء، تحصل على ترخيص استخدام شخصي. يُمنع:
            </p>
            <ul className="space-y-2 text-gray-400 text-sm md:text-base mt-3">
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">•</span> إعادة بيع المنتجات كما هي بدون تعديل</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">•</span> مشاركة الملفات مباشرة مع الغير</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">•</span> استخدام المنتجات في أنشطة غير قانونية</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">•</span> نشر المنتجات على مواقع التنزيل المجانية</li>
            </ul>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-3">
              منتجات PLR (الحقوق الخاصة) تسمح بإعادة البيع بعد التعديل. 
              يرجى قراءة ترخيص كل منتج بعناية قبل الشراء.
            </p>
          </Section>

          <Section icon={<AlertTriangle className="w-5 h-5" />} title="قيود الاستخدام">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              يُحظر استخدام الموقع لأي غرض غير قانوني أو غير مصرح به. 
              يُحظر محاولة الوصول غير المصرح به إلى أنظمتنا أو تعطيل 
              خدماتنا. نحتفظ بالحق في تعليق أو إنهاء حساب أي مستخدم 
              يخالف هذه الشروط.
            </p>
          </Section>

          <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-5 md:p-6 mt-10">
            <h3 className="text-white font-semibold mb-3 text-sm md:text-base">للاستفسارات القانونية</h3>
            <p className="text-gray-400 text-sm mb-3">
              إذا كان لديك أي استفسار حول شروط الاستخدام:
            </p>
            <div className="space-y-1 text-gray-300 text-sm">
              <p>البريد الإلكتروني: legal@digzoom.com</p>
              <p>واتساب: +966 56 988 8456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-5 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-white font-semibold text-base md:text-lg">{title}</h2>
      </div>
      {children}
    </div>
  );
}
