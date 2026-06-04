import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { ShoppingCart, Menu, X, LogIn, LogOut, ShieldCheck, User, ChevronDown, Globe } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const getNavLinks = (lang: string) => {
  const isAr = lang === 'ar';
  return [
    { name: isAr ? 'الرئيسية' : 'Home', path: '/' },
    { name: isAr ? 'المتجر' : 'Shop', path: '/shop' },
    { name: isAr ? 'خدمات النمو الرقمي' : 'Growth Services', path: '/marketing' },
    { name: isAr ? 'من نحن' : 'About', path: '/about' },
    { name: isAr ? 'اتصل بنا' : 'Contact', path: '/contact' },
  ];
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { lang, t, toggleLang } = useLanguage();
  const { user, isAdmin, logout } = useSupabaseAuth();
  const location = useLocation();
  const isAr = lang === 'ar';

  const navLinks = getNavLinks(lang);

  // Close user dropdown on route change
  useEffect(() => setUserMenuOpen(false), [location.pathname]);

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
          {/* Logo — new side tiger design */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden ring-1 ring-white/10 group-hover:ring-blue-500/50 transition-all">
              <img
                src="/images/digzoom-logo-side-new.jpg"
                alt="DigZoom"
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
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
            {/* Language Switcher — AR | EN */}
            <button onClick={toggleLang}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/5">
              <span className={lang === 'ar' ? 'text-gray-500' : 'text-white'}>EN</span>
              <span className="text-gray-600">|</span>
              <span className={lang === 'ar' ? 'text-white' : 'text-gray-500'}>AR</span>
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
              <div className="hidden md:relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                      {(user.name || user.email || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate hidden sm:block">{user.name || user.email}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full mt-1 right-0 min-w-[180px] bg-[#131722] border border-white/10 rounded-xl shadow-2xl shadow-black/50 py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-white/5">
                      <div className="text-white text-sm font-medium truncate">{user.name || user.email}</div>
                      <div className="text-gray-500 text-xs truncate">{user.email}</div>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10 transition-all">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{lang === 'ar' ? 'لوحة التحكم' : 'Admin'}</span>
                      </Link>
                    )}
                    <button onClick={() => { setUserMenuOpen(false); logout(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <LogOut className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                    </button>
                  </div>
                )}
              </div>
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
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                      {(user.name || user.email || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{user.name || user.email}</div>
                    <div className="text-gray-500 text-xs truncate">{user.email}</div>
                  </div>
                </div>
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
