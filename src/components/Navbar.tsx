import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { ShoppingCart, Menu, X, Globe, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const getNavLinks = (t: { navbar: { home: string; shop: string; about: string; contact: string } }) => [
  { name: t.navbar.home, path: '/' },
  { name: t.navbar.shop, path: '/shop' },
  { name: t.navbar.about, path: '/about' },
  { name: t.navbar.contact, path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { lang, t, toggleLang } = useLanguage();
  const { user, isAdmin, logout } = useSupabaseAuth();
  const location = useLocation();
  const isAr = lang === 'ar';

  const navLinks = getNavLinks(t);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all">
              <img src="/images/logo-light.jpg" alt="digzoom" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight leading-none">
                dig<span className="text-blue-400">zoom</span>
              </span>
              <span className="text-[8px] text-gray-500 tracking-[0.2em] uppercase mt-0.5">
                {isAr ? 'ديجي زوم' : 'Digital Products'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path.split('?')[0] ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                }`}>
                {link.name}
                {location.pathname === link.path.split('?')[0] && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                <ShieldCheck className="w-4 h-4" /> ADMIN
              </Link>
            )}
            {/* Language Switcher */}
            <button onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              <Globe className="w-4 h-4" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <button onClick={logout}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm">
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link to="/login"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all text-sm font-bold shadow-lg shadow-blue-500/20">
                <LogIn className="w-4 h-4" />
                <span>{lang === 'ar' ? 'دخول' : 'Login'}</span>
              </Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0f0f1a]/98 backdrop-blur-xl border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.path.split('?')[0] ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                {link.name}
              </Link>
            ))}
            <button onClick={toggleLang}
              className="w-full text-right px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            </button>
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="block px-4 py-3 rounded-xl text-sm font-medium text-blue-400 hover:bg-blue-500/10 transition-all flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> {lang === 'ar' ? 'لوحة التحكم' : 'Admin'}
                  </Link>
                )}
                <button onClick={logout} className="w-full text-right px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <Link to="/login" className="block px-4 py-3 rounded-xl text-sm font-medium text-blue-400 hover:bg-blue-500/10 transition-all flex items-center gap-2">
                  <LogIn className="w-4 h-4" /> {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
