import { useLanguage } from '@/hooks/useLanguage';
import { Shield, CheckCircle, XCircle, FileText, AlertTriangle } from 'lucide-react';

export default function AcceptableUsePolicy() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const allowedItems = isAr ? [
    'القوالب والتصاميم الرقمية الأصلية',
    'الكتب الإلكترونية والأدلة التعليمية',
    'الملفات الصوتية والموسيقى التجارية المرخصة',
    'خطط الأعمال والنماذج الاحترافية',
    'البرامج والأدوات الرقمية الأصلية',
    'فيديوهات تعليمية وقوالب فيديو',
    'خدمات التسويق الرقمي والإعلانات الممولة',
    'خدمات إدارة حسابات السوشال ميديا',
  ] : [
    'Original digital templates and designs',
    'Ebooks and educational guides',
    'Licensed audio files and commercial music',
    'Business plans and professional templates',
    'Original software and digital tools',
    'Educational videos and video templates',
    'Digital marketing and paid advertising services',
    'Social media account management services',
  ];

  const prohibitedItems = isAr ? [
    'بيع حسابات تابعة لأطراف ثالثة (Netflix, Spotify, ChatGPT, إلخ)',
    'بيع بيانات شخصية أو معلومات خاصة',
    'منتجات تنتهك حقوق الملكية الفكرية',
    'منتجات مخالفة لشروط خدمة منصات أخرى',
    'برامج قرصنة أو أدوات اختراق',
    'منتجات إباحية أو غير أخلاقية',
    'بوتات مضللة أو برامج تلاعب بالخوارزميات',
    'منتجات محظورة قانونياً في أي دولة',
  ] : [
    'Selling third-party accounts (Netflix, Spotify, ChatGPT, etc.)',
    'Selling personal data or private information',
    'Products that infringe intellectual property rights',
    'Products that violate other platforms\' terms of service',
    'Hacking software or penetration tools',
    'Adult or unethical content',
    'Deceptive bots or algorithm manipulation software',
    'Products legally prohibited in any country',
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            {isAr ? 'سياسة الاستخدام المقبول' : 'Acceptable Use Policy'}
          </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {isAr
              ? 'تعرف على ما هو مسموح وما هو ممنوع في منصة ديجي زوم'
              : 'Learn what is permitted and prohibited on the DigZoom platform'}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-[#151520] rounded-2xl p-6 border border-white/[0.04] mb-6">
          <div className="flex items-start gap-4">
            <FileText className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-bold text-lg mb-2">{isAr ? 'مقدمة' : 'Introduction'}</h3>
              <p className="text-gray-400 leading-relaxed">
                {isAr
                  ? 'تهدف ديجي زوم إلى توفير سوق رقمي آمن وموثوق لمنتجات الأعمال والتصميمات والملفات الرقمية الأصلية. يجب على جميع المستخدمين والبائعين الالتزام بهذه السياسة لضمان تجربة آمنة للجميع.'
                  : 'DigZoom aims to provide a safe and trusted digital marketplace for business products, designs, and original digital files. All users and sellers must comply with this policy to ensure a safe experience for everyone.'}
              </p>
            </div>
          </div>
        </div>

        {/* Allowed */}
        <div className="bg-[#151520] rounded-2xl p-6 border border-emerald-500/10 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <h3 className="text-white font-bold text-lg">{isAr ? 'المنتجات والخدمات المسموحة' : 'Permitted Products & Services'}</h3>
          </div>
          <ul className="space-y-3">
            {allowedItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prohibited */}
        <div className="bg-[#151520] rounded-2xl p-6 border border-red-500/10 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-6 h-6 text-red-400" />
            <h3 className="text-white font-bold text-lg">{isAr ? 'المنتجات والخدمات المحظورة' : 'Prohibited Products & Services'}</h3>
          </div>
          <ul className="space-y-3">
            {prohibitedItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enforcement */}
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-amber-400 font-bold text-lg mb-2">{isAr ? 'الإنفاذ والعقوبات' : 'Enforcement & Penalties'}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {isAr
                  ? 'في حال اكتشاف أي منتج أو خدمة مخالفة لهذه السياسة، تحتفظ ديجي زوم بالحق في: إزالة المنتج فوراً — تعليق حساب البائع — إلغاء جميع المدفوعات المرتبطة — الإبلاغ عن السلطات المختصة عند الضرورة — حظر المستخدم بشكل دائم من المنصة. إذا كنت غير متأكد مما إذا كان منتجك مسموحاً به، يرجى التواصل معنا على info@digzoom.com قبل الإدراج.'
                  : 'If any product or service violating this policy is discovered, DigZoom reserves the right to: Remove the product immediately — Suspend the seller account — Cancel all related payments — Report to relevant authorities when necessary — Permanently ban the user from the platform. If you are unsure whether your product is allowed, please contact us at info@digzoom.com before listing.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
