import { Link } from 'react-router';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
  const { lang, t } = useLanguage();

  const storeLinks = [
    { name: t.categories.pdf, path: '/shop?category=pdf' },
    { name: t.categories.templates, path: '/shop?category=templates' },
    { name: t.categories.graphics, path: '/shop?category=graphics' },
    { name: t.categories.videos, path: '/shop?category=videos' },
  ];
  const companyLinks = [
    { name: t.navbar.about, path: '/about' },
    { name: t.navbar.contact, path: '/contact' },
  ];
  const legalLinks = [
    { name: lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', path: '/privacy' },
    { name: lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Service', path: '/terms' },
    { name: lang === 'ar' ? 'سياسة الاسترجاع' : 'Refund Policy', path: '/refund' },
    { name: lang === 'ar' ? 'سياسة التسليم' : 'Delivery Policy', path: '/delivery' },
    { name: lang === 'ar' ? 'سياسة الاستخدام المقبول' : 'Acceptable Use Policy', path: '/acceptable-use' },
  ];

  return (
    <footer className="bg-[#07070d] border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-lg overflow-hidden ring-2 ring-white/10">
                <img src="/images/logo-light.jpg" alt="digzoom" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-none">dig<span className="text-blue-400">zoom</span></span>
                <span className="text-[9px] text-gray-500 tracking-[0.2em] mt-0.5">Digital Products Marketplace</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed text-sm">
              {lang === 'ar'
                ? 'ديجي زوم — سوق رقمي لمنتجات التصميم والأعمال الإبداعية والقوالب والكتب الإلكترونية والملفات الرقمية.'
                : 'DigZoom — a digital marketplace for design assets, business resources, templates, ebooks, and digital downloads.'}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm"><Mail className="w-4 h-4 text-blue-400" /><span>info@digzoom.com</span></div>
              <div className="flex items-center gap-3 text-gray-400 text-sm" dir="ltr"><Phone className="w-4 h-4 text-purple-400" /><span>+966 56 988 8456</span></div>
              <a href="https://wa.me/00966569888456" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 text-sm hover:text-emerald-400 transition-colors" dir="ltr"><MessageCircle className="w-4 h-4 text-emerald-400" /><span>+966 56 988 8456</span></a>
            </div>
          </div>
          {/* Store Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t.footer.store}</h4>
            <ul className="space-y-3">
              {storeLinks.map(l => <li key={l.name}><Link to={l.path} className="text-gray-400 hover:text-blue-400 transition-colors text-sm">{l.name}</Link></li>)}
            </ul>
          </div>
          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t.footer.company}</h4>
            <ul className="space-y-3">
              {companyLinks.map(l => <li key={l.name}><Link to={l.path} className="text-gray-400 hover:text-blue-400 transition-colors text-sm">{l.name}</Link></li>)}
            </ul>
          </div>
          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{lang === 'ar' ? 'الصفحات القانونية' : 'Legal Pages'}</h4>
            <ul className="space-y-3">
              {legalLinks.map(l => <li key={l.path}><Link to={l.path} className="text-gray-400 hover:text-blue-400 transition-colors text-sm">{l.name}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} DigZoom. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-sm">info@digzoom.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
