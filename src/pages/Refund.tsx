import { Link } from 'react-router';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Clock, HelpCircle } from 'lucide-react';

export default function Refund() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 md:pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-400 transition-colors">الرئيسية</Link>
          <ArrowLeft className="w-3 h-3" />
          <span className="text-gray-300">سياسة الاسترجاع</span>
        </div>

        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
            <RefreshCw className="w-7 h-7 md:w-8 md:h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">سياسة الاسترجاع</h1>
          <p className="text-gray-400 text-sm md:text-base">ضمان استرجاع لمدة 30 يوماً</p>
        </div>

        {/* Guarantee Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl border border-emerald-500/20 p-5 md:p-6 mb-8 md:mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-white font-bold text-lg md:text-xl mb-2">
            ضمان استرجاع المبلغ خلال 30 يوماً
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
            نحن واثقون من جودة منتجاتنا. إذا لم تكن راضياً عن مشترياتك لأي سبب، 
            سنقوم باسترجاع المبلغ بالكامل بدون أسئلة أو تعقيدات.
          </p>
        </div>

        <div className="space-y-8 md:space-y-10">
          <Section icon={<CheckCircle className="w-5 h-5" />} title="حالات القبول" color="emerald">
            <ul className="space-y-3 text-gray-400 text-sm md:text-base">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>المنتج لا يعمل كما هو موضح في الوصف</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>جودة المنتج أقل من المتوقع</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>لم يتم تسليم المنتج بعد إتمام الدفع</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>طلبت بالخطأ ولم تقم بتحميل المنتج</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>الملفات تالفة أو غير قابلة للفتح</span>
              </li>
            </ul>
          </Section>

          <Section icon={<XCircle className="w-5 h-5" />} title="حالات الرفض" color="red">
            <ul className="space-y-3 text-gray-400 text-sm md:text-base">
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                <span>مر أكثر من 30 يوماً على عملية الشراء</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                <span>تم تحميل المنتج واستخدامه بالكامل</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                <span>إعادة البيع أو مشاركة المنتج مع الغير</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                <span>طلب الاسترجاع أكثر من مرة لنفس المنتج</span>
              </li>
            </ul>
          </Section>

          <Section icon={<Clock className="w-5 h-5" />} title="مدة الاسترجاع" color="blue">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              بعد الموافقة على طلب الاسترجاع، يتم إرجاع المبلغ خلال 
              <span className="text-white font-medium"> 3-5 أيام عمل</span> 
              إلى نفس وسيلة الدفع المستخدمة في الشراء. 
              قد يستغرق ظهور المبلغ في حسابك فترة إضافية حسب سياسة البنك.
            </p>
          </Section>

          <Section icon={<HelpCircle className="w-5 h-5" />} title="كيف تطلب استرجاع؟" color="purple">
            <ol className="space-y-3 text-gray-400 text-sm md:text-base">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <span>أرسل طلب الاسترجاع عبر البريد support@digzoom.com أو واتساب</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <span>اذكر رقم الطلب وسبب الاسترجاع (اختياري)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <span>سيتم مراجعة طلبك خلال 24 ساعة</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                <span>بعد الموافقة، يتم إرجاع المبلغ خلال 3-5 أيام عمل</span>
              </li>
            </ol>
          </Section>

          <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-5 md:p-6 mt-10">
            <h3 className="text-white font-semibold mb-3 text-sm md:text-base">للتواصل بخصوص الاسترجاع</h3>
            <div className="space-y-1 text-gray-300 text-sm">
              <p>البريد الإلكتروني: support@digzoom.com</p>
              <p>واتساب: +966 56 988 8456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children, color }: { icon: React.ReactNode; title: string; children: React.ReactNode; color: string }) {
  const colorClasses: Record<string, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  };
  const c = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-5 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <h2 className="text-white font-semibold text-base md:text-lg">{title}</h2>
      </div>
      {children}
    </div>
  );
}
