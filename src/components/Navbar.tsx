import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import {
  ShoppingCart, Menu, X, LogIn, LogOut, ShieldCheck,
  ChevronDown, Globe, Package, UserCircle
} from 'lucide-react';
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
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const { lang, toggleLang } = useLanguage();
  const { user, isAdmin, logout } = useSupabaseAuth();
  const location = useLocation();
  const isAr = lang === 'ar';

  const navLinks = getNavLinks(lang);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setUserMenuOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          {/* Logo — Tiger icon + DigZoom text */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden ring-1 ring-white/10 group-hover:ring-blue-500/50 transition-all">
              <img
                src="/images/digzoom-logo-side-new.jpg"
                alt="DigZoom"
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Dig</span>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Zoom</span>
            </span>
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
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Switcher */}
            <button onClick={toggleLang}
              className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/5">
              <span className={lang === 'ar' ? 'text-gray-500' : 'text-white'}>EN</span>
              <span className="text-gray-600">|</span>
              <span className={lang === 'ar' ? 'text-white' : 'text-gray-500'}>AR</span>
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 sm:p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* === AUTH: Logged In === */}
            {user ? (
              <div ref={userMenuRef} className="relative">
                {/* User Toggle Button */}
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm"
                >
                  {/* Avatar or Initial */}
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                      {(user.name || user.email || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block max-w-[80px] lg:max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className={`absolute top-full mt-2 w-56 bg-[#151520] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 py-2 z-[100] ${
                    isAr ? 'left-0' : 'right-0'
                  }`}>
                    {/* User Info Header */}
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
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-400 mt-0.5">
                            <ShieldCheck className="w-3 h-3" /> ADMIN
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <UserCircle className="w-4 h-4 text-gray-500" />
                        {isAr ? 'الملف الشخصي' : 'Profile'}
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Package className="w-4 h-4 text-gray-500" />
                        {isAr ? 'طلباتي' : 'My Orders'}
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          {isAr ? 'لوحة التحكم' : 'Admin Dashboard'}
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-white/[0.06] pt-1 mt-1">
                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        {isAr ? 'تسجيل الخروج' : 'Logout'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* === AUTH: Not Logged In === */
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all text-sm font-bold shadow-lg shadow-blue-500/20"
              >
                <LogIn className="w-4 h-4" />
                <span>{isAr ? 'دخول' : 'Login'}</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ========== MOBILE MENU ========== */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0f0f1a]/98 backdrop-blur-xl border-t border-white/[0.06] max-h-[80vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {/* Nav Links */}
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.path.split('?')[0] ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                {link.name}
              </Link>
            ))}

            {/* Language */}
            <button onClick={toggleLang}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Globe className="w-4 h-4" />
              {isAr ? 'Switch to English' : 'التبديل للعربية'}
            </button>

            {/* Divider */}
            <div className="border-t border-white/[0.06] pt-2 mt-2" />

            {/* Mobile: Logged In */}
            {user ? (
              <div className="space-y-1">
                {/* User Card */}
                <div className="px-4 py-3 flex items-center gap-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-lg font-bold text-white">
                      {(user.name || user.email || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{user.name || user.email}</div>
                    <div className="text-gray-500 text-xs truncate">{user.email}</div>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 mt-0.5">
                        <ShieldCheck className="w-3 h-3" /> ADMIN
                      </span>
                    )}
                  </div>
                </div>
                {/* Links */}
                <Link to="/profile" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                  <UserCircle className="w-4 h-4 text-gray-500" /> {isAr ? 'الملف الشخصي' : 'Profile'}
                </Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                  <Package className="w-4 h-4 text-gray-500" /> {isAr ? 'طلباتي' : 'My Orders'}
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-purple-400 hover:bg-purple-500/10 transition-all">
                    <ShieldCheck className="w-4 h-4" /> {isAr ? 'لوحة التحكم' : 'Admin Dashboard'}
                  </Link>
                )}
                <button onClick={() => { setMobileOpen(false); logout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut className="w-4 h-4" /> {isAr ? 'تسجيل الخروج' : 'Logout'}
                </button>
              </div>
            ) : (
              /* Mobile: Not Logged In */
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl text-sm font-bold">
                <LogIn className="w-4 h-4" /> {isAr ? 'تسجيل الدخول' : 'Login'}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
