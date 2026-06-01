import { useLanguage } from '@/hooks/useLanguage';
import { Building2, MapPin, Mail, Calendar, Shield, FileText } from 'lucide-react';

export default function CompanyInformation() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const details = [
    {
      icon: <Building2 className="w-6 h-6 text-blue-400" />,
      label: isAr ? 'اسم الشركة' : 'Company Name',
      value: 'DIGZOOM LIMITED LIABILITY COMPANY',
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      label: isAr ? 'نوع الكيان' : 'Entity Type',
      value: isAr ? 'شركة ذات مسؤولية محدودة (LLC)' : 'Limited Liability Company (LLC)',
    },
    {
      icon: <MapPin className="w-6 h-6 text-red-400" />,
      label: isAr ? 'الولاية القضائية' : 'Jurisdiction',
      value: isAr ? 'وايومنغ، الولايات المتحدة' : 'Wyoming, United States',
    },
    {
      icon: <Calendar className="w-6 h-6 text-purple-400" />,
      label: isAr ? 'تاريخ التأسيس' : 'Formation Date',
      value: 'December 3, 2025',
    },
    {
      icon: <MapPin className="w-6 h-6 text-amber-400" />,
      label: isAr ? 'عنوان الشركة' : 'Business Address',
      value: '30 N Gould St Ste N\nSheridan, WY 82801\nUnited States',
    },
    {
      icon: <FileText className="w-6 h-6 text-cyan-400" />,
      label: isAr ? 'رقم التسجيل' : 'Registration Number',
      value: '2025-001830637',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <Building2 className="w-16 h-16 text-blue-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">
            {isAr ? 'معلومات الشركة' : 'Company Information'}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {isAr
              ? 'شركة DIGZOOM LIMITED LIABILITY COMPANY مسجلة قانونياً في ولاية وايومنغ، الولايات المتحدة الأمريكية'
              : 'DIGZOOM LIMITED LIABILITY COMPANY is a legally registered company in the State of Wyoming, United States of America'}
          </p>
        </div>

        {/* Company Details */}
        <div className="space-y-4 mb-12">
          {details.map((item, i) => (
            <div key={i} className="bg-[#151520] rounded-2xl p-6 border border-white/[0.04] hover:border-white/[0.08] transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/[0.03] flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">{item.label}</div>
                  <div className="text-white font-semibold text-lg whitespace-pre-line">{item.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-8 text-center">
          <Mail className="w-8 h-8 text-blue-400 mx-auto mb-4" />
          <h3 className="text-white font-bold text-xl mb-2">
            {isAr ? 'معلومات التواصل' : 'Contact Information'}
          </h3>
          <a href="mailto:info@digzoom.com" className="text-blue-400 hover:text-blue-300 text-lg font-medium transition-colors">
            info@digzoom.com
          </a>
          <p className="text-gray-500 text-sm mt-4">
            {isAr
              ? 'للاستفسارات التجارية والقانونية، يرجى التواصل عبر البريد الإلكتروني'
              : 'For business and legal inquiries, please contact us via email'}
          </p>
        </div>
      </div>
    </div>
  );
}
