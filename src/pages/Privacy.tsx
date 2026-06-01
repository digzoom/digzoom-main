import { Link } from 'react-router';
import { ArrowLeft, Shield, Lock, Eye, Server, Trash2 } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 md:pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-400 transition-colors">الرئيسية</Link>
          <ArrowLeft className="w-3 h-3" />
          <span className="text-gray-300">سياسة الخصوصية</span>
        </div>

        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
            <Shield className="w-7 h-7 md:w-8 md:h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">سياسة الخصوصية</h1>
          <p className="text-gray-400 text-sm md:text-base">آخر تحديث: مايو 2025</p>
        </div>

        <div className="space-y-8 md:space-y-10">
          <Section icon={<Eye className="w-5 h-5" />} title="المعلومات التي نجمعها">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-3">
              نجمع المعلومات التالية لتقديم أفضل خدمة ممكنة:
            </p>
            <ul className="space-y-2 text-gray-400 text-sm md:text-base">
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span> معلومات الحساب (الاسم، البريد الإلكتروني، رقم الهاتف)</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span> سجل المشتريات والتنزيلات</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span> بيانات الاستخدام والتصفح (مجهولة المصدر)</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span> معلومات الجهاز والمتصفح لتحسين التجربة</li>
            </ul>
          </Section>

          <Section icon={<Lock className="w-5 h-5" />} title="كيف نستخدم معلوماتك">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              نستخدم معلوماتك فقط لتقديم الخدمات التي تطلبها: معالجة الطلبات، 
              تسليم المنتجات الرقمية، تحسين تجربة المستخدم، والتواصل معك بخصوص 
              طلباتك. لا نبيع أو نشارك بياناتك مع أطراف ثالثة للأغراض التجارية.
            </p>
          </Section>

          <Section icon={<Server className="w-5 h-5" />} title="أمن البيانات">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              نستخدم تقنيات تشفير حديثة (SSL/TLS) لحماية جميع البيانات المنقلة. 
              يتم تخزين المعلومات الحساسة في خوادم آمنة مع حماية على مستوى 
              المؤسسات. نجري مراجعات أمنية دورية لضمان أعلى مستويات الحماية.
            </p>
          </Section>

          <Section icon={<Trash2 className="w-5 h-5" />} title="حقوقك">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-3">
              لديك الحق الكامل في:
            </p>
            <ul className="space-y-2 text-gray-400 text-sm md:text-base">
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span> الوصول إلى بياناتك الشخصية</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span> طلب تصحيح أو تحديث معلوماتك</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span> طلب حذف حسابك وبياناتك</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span> الاعتراض على معالجة بياناتك</li>
            </ul>
          </Section>

          <Section icon={<Shield className="w-5 h-5" />} title="الكوكيز (Cookies)">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              نستخدم الكوكيز لتحسين تجربة التصفح وتذكر تفضيلاتك. 
              يمكنك إلغاء تفعيل الكوكيز من إعدادات المتصفح، لكن قد 
              يؤثر ذلك على بعض وظائف الموقع. نحن لا نستخدم الكوكيز 
              لتتبع نشاطك خارج موقعنا.
            </p>
          </Section>

          <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-5 md:p-6 mt-10">
            <h3 className="text-white font-semibold mb-3 text-sm md:text-base">للتواصل بخصوص الخصوصية</h3>
            <p className="text-gray-400 text-sm mb-3">
              إذا كان لديك أي استفسار حول سياسة الخصوصية، يرجى التواصل معنا:
            </p>
            <div className="space-y-1 text-gray-300 text-sm">
              <p>البريد الإلكتروني: info@digzoom.com</p>
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
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-white font-semibold text-base md:text-lg">{title}</h2>
      </div>
      {children}
    </div>
  );
}
