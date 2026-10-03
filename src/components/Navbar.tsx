import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Bot,
  BriefcaseBusiness,
  ChevronDown,
  Cloud,
  Gamepad2,
  Gift,
  Globe,
  Home,
  KeyRound,
  Laptop2,
  LogIn,
  LogOut,
  Menu,
  Package,
  PackageOpen,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
  Tag,
  UploadCloud,
  UserCircle,
  X,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/hooks/useLanguage";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const primaryLinks = (isAr: boolean) => [
  { name: isAr ? "الرئيسية" : "Home", path: "/", icon: Home },
  { name: isAr ? "العروض" : "Offers", path: "/shop?sort=offers", icon: Tag },
  { name: isAr ? "الأكثر مبيعًا" : "Best sellers", path: "/shop?sort=popular", icon: ShoppingBag },
  { name: isAr ? "الاشتراكات" : "Subscriptions", path: "/shop?category=subscriptions", icon: Cloud },
  { name: isAr ? "الذكاء الاصطناعي" : "AI", path: "/shop?category=ai", icon: Bot },
  { name: isAr ? "البرامج" : "Software", path: "/shop?category=software", icon: Laptop2 },
  { name: isAr ? "الألعاب" : "Gaming", path: "/shop?category=gaming", icon: Gamepad2 },
  { name: isAr ? "المنتجات الرقمية" : "Digital products", path: "/shop?category=templates", icon: PackageOpen },
];

const sideLinks = (isAr: boolean) => [
  ...primaryLinks(isAr),
  { name: isAr ? "خدمات DigZoom" : "DigZoom services", path: "/marketing", icon: BriefcaseBusiness },
  { name: isAr ? "سوق الأصول الرقمية" : "Digital assets", path: "/digital-assets", icon: KeyRound },
  { name: isAr ? "بيع منتجاتك معنا" : "Sell with us", path: "/partners", icon: UploadCloud },
  { name: isAr ? "منتجات مجانية" : "Free products", path: "/shop?price=free", icon: Gift },
  { name: "DigZoom Pass", path: "/#digzoom-pass", icon: ShieldCheck },
  { name: isAr ? "المتجر" : "Store", path: "/shop", icon: Store },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const { lang, toggleLang } = useLanguage();
  const { user, isAdmin, logout } = useSupabaseAuth();
  const location = useLocation();
  const isAr = lang === "ar";

  useEffect(() => {
    setDrawerOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const topLinks = primaryLinks(isAr).slice(0, 6);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[rgba(7,10,16,.96)] shadow-[0_4px_30px_rgba(0,0,0,.28)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3 lg:h-20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[.035] px-3 text-sm font-bold text-slate-200 transition hover:bg-white/[.07]"
                aria-label={isAr ? "فتح القائمة" : "Open menu"}
              >
                <Menu className="h-5 w-5" />
                <span className="hidden sm:inline">{isAr ? "القائمة" : "Menu"}</span>
              </button>

              <Link
                to="/"
                className="group flex shrink-0 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] py-1.5 pe-3 ps-1.5 transition hover:border-blue-400/30 hover:bg-white/[0.06]"
                aria-label="DigZoom"
              >
                <div className="h-8 w-8 overflow-hidden rounded-[.7rem] ring-1 ring-blue-400/25 shadow-[0_0_18px_rgba(59,130,246,.2)] sm:h-9 sm:w-9">
                  <img src="/images/digzoom-logo-side-new.jpg" alt="DigZoom" className="h-full w-full object-cover" />
                </div>
                <span className="hidden min-[360px]:inline text-base font-black tracking-tight sm:text-lg">
                  <span className="text-white">Dig</span>
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Zoom</span>
                </span>
              </Link>
            </div>

            <div className="hidden xl:flex items-center gap-1">
              {topLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-white/[.04] hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={toggleLang}
                className="hidden items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 lg:flex"
              >
                <Globe className="h-4 w-4" />
                {isAr ? "EN" : "AR"}
              </button>

              <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/5 hover:text-white" aria-label={isAr ? "السلة" : "Cart"}>
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-1 text-[10px] font-black text-white">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div ref={userMenuRef} className="relative hidden lg:block">
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-black text-white">
                      {(user.name || user.email || "?")[0].toUpperCase()}
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 transition ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {userMenuOpen && (
                    <div className={`absolute top-full mt-2 w-56 rounded-2xl border border-white/[.08] bg-[#121722] py-2 shadow-2xl ${isAr ? "left-0" : "right-0"}`}>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5"><UserCircle className="h-4 w-4" />{isAr ? "الملف الشخصي" : "Profile"}</Link>
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5"><Package className="h-4 w-4" />{isAr ? "طلباتي" : "Orders"}</Link>
                      {isAdmin && <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-purple-300 hover:bg-purple-500/10"><ShieldCheck className="h-4 w-4" />{isAr ? "لوحة التحكم" : "Admin"}</Link>}
                      <button onClick={() => logout()} className="flex w-full items-center gap-3 border-t border-white/[.06] px-4 py-3 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400"><LogOut className="h-4 w-4" />{isAr ? "تسجيل الخروج" : "Logout"}</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-black text-white shadow-lg shadow-blue-500/20 md:flex">
                  <LogIn className="h-4 w-4" />{isAr ? "دخول" : "Login"}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-[100]">
          <button className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} aria-label={isAr ? "إغلاق القائمة" : "Close menu"} />
          <aside className={`absolute top-0 h-full w-[88vw] max-w-[390px] overflow-y-auto border-white/10 bg-[#090d15] shadow-2xl ${isAr ? "right-0 border-l" : "left-0 border-r"}`}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#090d15]/95 px-5 py-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <img src="/images/digzoom-logo-side-new.jpg" alt="DigZoom" className="h-10 w-10 rounded-xl object-cover" />
                <div><div className="font-black text-white">DigZoom</div><div className="text-xs text-slate-500">{isAr ? "كل عالمك الرقمي" : "Your digital world"}</div></div>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-4">
              <div className="mb-3 text-xs font-black uppercase tracking-[.18em] text-blue-400">{isAr ? "تصفح DigZoom" : "Explore DigZoom"}</div>
              <div className="space-y-1">
                {sideLinks(isAr).map(({ name, path, icon: Icon }) => (
                  <Link key={path} to={path} className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/[.05] hover:text-white">
                    <span className="flex items-center gap-3"><Icon className="h-4 w-4 text-blue-300" />{name}</span>
                    <span className="text-slate-600">›</span>
                  </Link>
                ))}
              </div>

              <div className="my-5 border-t border-white/10" />

              <button onClick={toggleLang} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/[.05]"><Globe className="h-4 w-4 text-cyan-300" />{isAr ? "English" : "العربية"}</button>

              {!user && (
                <Link to="/login" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 font-black text-white"><LogIn className="h-4 w-4" />{isAr ? "تسجيل الدخول" : "Login"}</Link>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
