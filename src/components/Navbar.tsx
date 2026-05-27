import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { ShoppingCart, Menu, X, Globe, LogIn, LogOut, ShieldCheck, ChevronDown, Video, Instagram, Youtube, Twitter, Ghost, Facebook, MessageSquare, Radio, Send, Heart, UserPlus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { platforms } from '@/data/socialServices';

const platformIcons: Record<string, React.ReactNode> = {
  tiktok: <Video className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  snapchat: <Ghost className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  whatsapp: <MessageSquare className="w-4 h-4" />,
  jaco: <Radio className="w-4 h-4" />,
  telegram: <Send className="w-4 h-4" />,
  likee: <Heart className="w-4 h-4" />,
};

const getNavLinks = (t: { navbar: { home: string; shop: string; about: string; contact: string } }, isAr: boolean) => [
  { name: t.navbar.home, path: '/' },
  { name: t.navbar.shop, path: '/shop' },
  { name: isAr ? 'سوشال ميديا' : 'Social Media', path: '/social', hasDropdown: true },
  { name: isAr ? 'تسويق حقيقي' : 'Real Marketing', path: '/marketing' },
  { name: t.navbar.about, path: '/about' },
  { name: t.navbar.contact, path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [socialDropdown, setSocialDropdown] = useState(false);
  const [mobileSocialOpen, setMobileSocialOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const { lang, t, toggleLang } = useLanguage();
  const { user, isAdmin, logout } = useSupabaseAuth();
  const location = useLocation();
  const isAr = lang === 'ar';

  const navLinks = getNavLinks(t, isAr);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSocialDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isSocialActive = location.pathname.startsWith('/social');

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
                {isAr ? 'ديجي زوم' : 'Digzoom'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              if (link.hasDropdown) {
                return (
                  <div key={link.path} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setSocialDropdown(!socialDropdown)}
                      onMouseEnter={() => setSocialDropdown(true)}
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                        isSocialActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {link.name}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${socialDropdown ? 'rotate-180' : ''}`} />
                      {isSocialActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-400 rounded-full" />
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {socialDropdown && (
                      <div
                        onMouseLeave={() => setSocialDropdown(false)}
                        className="absolute top-full mt-2 w-72 bg-[#12121e] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                      >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-white/[0.06] bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                          <p className="text-white font-semibold text-sm">{isAr ? 'منصات التواصل الاجتماعي' : 'Social Media Platforms'}</p>
                          <p className="text-gray-500 text-xs">{isAr ? 'اختر المنصة وابدأ التنمية' : 'Choose platform and start growing'}</p>
                        </div>

                        {/* Platform List */}
                        <div className="py-2 max-h-[420px] overflow-y-auto">
                          {platforms.map((platform) => (
                            <Link
                              key={platform.id}
                              to={`/social/${platform.id}`}
                              onClick={() => setSocialDropdown(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
                            >
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                                style={{ backgroundColor: platform.color }}
                              >
                                {platformIcons[platform.id]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">{isAr ? platform.nameAr : platform.name}</p>
                                <p className="text-gray-500 text-xs">{platform.services.length} {isAr ? 'خدمة' : 'services'}</p>
                              </div>
                              <span className="text-gray-600 text-xs">{isAr ? '←' : '→'}</span>
                            </Link>
                          ))}
                        </div>

                        {/* Footer */}
                        <Link
                          to="/social"
                          onClick={() => setSocialDropdown(false)}
                          className="block px-4 py-3 border-t border-white/[0.06] text-center text-blue-400 text-sm font-medium hover:bg-blue-500/5 transition-colors"
                        >
                          {isAr ? 'عرض كل الخدمات →' : 'View All Services →'}
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link key={link.path} to={link.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path.split('?')[0] ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                  }`}>
                  {link.name}
                  {location.pathname === link.path.split('?')[0] && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* TEMP: Admin link for testing */}
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

            {/* Login / Signup */}
            <div className="flex items-center gap-2">
              <Link to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all text-xs md:text-sm font-medium">
                <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>{lang === 'ar' ? 'دخول' : 'Login'}</span>
              </Link>
              <Link to="/signup"
                className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all text-xs md:text-sm font-bold shadow-lg shadow-blue-500/20">
                <UserPlus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>{lang === 'ar' ? 'حساب جديد' : 'Sign Up'}</span>
              </Link>
            </div>

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
            {navLinks.map(link => {
              if (link.hasDropdown) {
                return (
                  <div key={link.path}>
                    <button
                      onClick={() => setMobileSocialOpen(!mobileSocialOpen)}
                      className={`w-full text-right px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                        isSocialActive ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileSocialOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileSocialOpen && (
                      <div className="mr-4 mt-1 space-y-1 border-r border-white/10 pr-3 animate-in slide-in-from-top-1">
                        {platforms.map((platform) => (
                          <Link
                            key={platform.id}
                            to={`/social/${platform.id}`}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                              style={{ backgroundColor: platform.color }}
                            >
                              {platformIcons[platform.id]}
                            </div>
                            <span>{isAr ? platform.nameAr : platform.name}</span>
                          </Link>
                        ))}
                        <Link to="/social" className="block px-4 py-3 rounded-xl text-sm text-blue-400 hover:bg-blue-500/10 transition-all">
                          {isAr ? '← عرض كل الخدمات' : 'View All Services →'}
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link key={link.path} to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path.split('?')[0] ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}>
                  {link.name}
                </Link>
              );
            })}
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
                <Link to="/signup" className="block px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
                  {lang === 'ar' ? 'إنشاء حساب مجاني' : 'Create Free Account'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
