import { Link } from "react-router";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function Footer() {
  const { lang, t } = useLanguage();

  const storeLinks = [
    { name: lang === "ar" ? "جميع المنتجات" : "All Products", path: "/shop" },
    {
      name: lang === "ar" ? "خدمات النمو الرقمي" : "Digital Growth Services",
      path: "/",
    },
    {
      name: lang === "ar" ? "اطلب عرضاً" : "Request a Proposal",
      path: "/contact",
    },
  ];
  const companyLinks = [
    { name: t.navbar.about, path: "/about" },
    { name: t.navbar.contact, path: "/contact" },
    {
      name: lang === "ar" ? "معلومات الشركة" : "Company Information",
      path: "/company",
    },
    {
      name: lang === "ar" ? "الثقة والأمان" : "Trust & Security",
      path: "/trust-security",
    },
  ];
  const legalLinks = [
    {
      name: lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
      path: "/privacy",
    },
    {
      name: lang === "ar" ? "شروط الاستخدام" : "Terms of Service",
      path: "/terms",
    },
    {
      name: lang === "ar" ? "سياسة الاسترجاع" : "Refund Policy",
      path: "/refund",
    },
    {
      name: lang === "ar" ? "سياسة التسليم" : "Delivery Policy",
      path: "/delivery",
    },
    {
      name: lang === "ar" ? "سياسة الاستخدام المقبول" : "Acceptable Use Policy",
      path: "/acceptable-use",
    },
  ];

  return (
    <footer className="bg-[#07070d] border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 overflow-hidden rounded-xl ring-1 ring-white/10">
                <img
                  src="/images/digzoom-logo-side-new.jpg"
                  alt="DigZoom"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed text-sm">
              {lang === "ar"
                ? "ديج زوم لإدارة المواقع والتسويق الرقمي وتجهيز وبيع المنتجات الرقمية، بنطاق وأسعار واضحة قبل البدء."
                : "DigZoom provides website management, digital marketing, and digital product services with clear scope and pricing."}
            </p>
            <div className="space-y-3">
              <a
                href="mailto:info@digzoom.com"
                className="flex items-center gap-3 text-gray-400 text-sm hover:text-blue-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                <span>info@digzoom.com</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>{lang === "ar" ? "اتصال:" : "Call:"}</span>
                <span dir="ltr">+966 56 988 8456</span>
              </div>
              <a
                href="https://wa.me/00966569888456"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 text-sm hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{lang === "ar" ? "واتساب:" : "WhatsApp:"}</span>
                <span dir="ltr">+966 56 988 8456</span>
              </a>
            </div>
          </div>
          {/* Store Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              {t.footer.store}
            </h4>
            <ul className="space-y-3">
              {storeLinks.map((l) => (
                <li key={l.name}>
                  <Link
                    to={l.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              {t.footer.company}
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((l) => (
                <li key={l.name}>
                  <Link
                    to={l.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              {lang === "ar" ? "الصفحات القانونية" : "Legal Pages"}
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/[0.04]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} DigZoom.{" "}
              {lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-500 text-sm">info@digzoom.com</span>
            </div>
          </div>
          <div className="text-center pt-4 border-t border-white/[0.02]">
            <p className="text-gray-600 text-xs uppercase tracking-wider">
              DIGZOOM LIMITED LIABILITY COMPANY &middot; WYOMING, USA &middot;
              info@digzoom.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
