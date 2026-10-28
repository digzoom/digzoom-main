import { Building2, MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

type MerchantDisclosureProps = {
  className?: string;
};

export default function MerchantDisclosure({ className = '' }: MerchantDisclosureProps) {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <section
      className={`rounded-2xl border border-blue-400/20 bg-blue-400/[0.06] p-4 ${className}`}
      aria-label={isAr ? 'بيانات البائع' : 'Seller details'}
    >
      <div className="flex items-start gap-3">
        <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
        <div className="space-y-2 text-sm leading-6">
          <div>
            <p className="font-bold text-white">
              {isAr ? 'بيانات البائع' : 'Seller details'}
            </p>
            <p className="text-slate-300">DIGZOOM LIMITED LIABILITY COMPANY</p>
          </div>
          <p className="flex items-start gap-2 text-slate-300">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-blue-300" />
            <span>
              {isAr
                ? 'شركة مسجلة في ولاية وايومنغ، الولايات المتحدة. تُدار أعمال DigZoom من الرياض، المملكة العربية السعودية. العنوان المسجل: 30 N Gould St Ste N, Sheridan, WY 82801, United States.'
                : 'Registered in Wyoming, United States. DigZoom operations are managed from Riyadh, Saudi Arabia. Registered address: 30 N Gould St Ste N, Sheridan, WY 82801, United States.'}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
