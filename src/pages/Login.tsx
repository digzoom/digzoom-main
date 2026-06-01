import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Zap, LogIn, UserPlus, ArrowLeft, Globe } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useLanguage } from '@/hooks/useLanguage';

export default function Login() {
  const { user, login, register, signInWithGoogle, logout } = useSupabaseAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  // If already logged in, show welcome
  if (user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-16 px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-8">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {lang === 'ar' ? 'مرحباً' : 'Welcome'} {user.name || ''}
            </h2>
            <p className="text-gray-400 mb-2">
              {lang === 'ar' ? 'أنت مسجل الدخول بالفعل' : 'You are already logged in'}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              {user.email}
              {user.role === 'admin' && (
                <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full mr-2">
                  Admin
                </span>
              )}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-xl text-sm font-medium transition-all"
              >
                {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center justify-center gap-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 py-3 px-8 rounded-xl text-sm font-medium transition-all"
              >
                {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setConfirmSent(false);
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (result.error) {
          setError(
            result.error.includes('Invalid login') || result.error.includes('Email not confirmed')
              ? (lang === 'ar' ? 'البريد أو كلمة المرور غير صحيحة' : 'Invalid email or password')
              : result.error
          );
        } else {
          navigate('/');
        }
      } else {
        if (!name.trim()) {
          setError(lang === 'ar' ? 'الاسم مطلوب' : 'Name is required');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError(lang === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        const result = await register(email, password, name);
        if (result.error) {
          setError(
            result.error.includes('already registered')
              ? (lang === 'ar' ? 'البريد مستخدم مسبقاً' : 'Email already registered')
              : result.error
          );
        } else {
          setConfirmSent(true);
        }
      }
    } catch (err: any) {
      setError(lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="h-16 w-auto overflow-hidden rounded-xl ring-1 ring-white/10 mx-auto">
              <img
                src="/images/logo-main.jpg"
                alt="DigZoom"
                className="h-full w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </Link>
        </div>

        <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-8">
          <h2 className="text-xl font-bold text-white text-center mb-2">
            {mode === 'login'
              ? (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')
              : (lang === 'ar' ? 'إنشاء حساب' : 'Create Account')}
          </h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            {mode === 'login'
              ? (lang === 'ar' ? 'سجل الدخول للوصول إلى حسابك' : 'Sign in to access your account')
              : (lang === 'ar' ? 'أنشئ حساب جديد مجاناً' : 'Create a new account for free')}
          </p>

          {/* Confirmation message */}
          {confirmSent && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-4">
              <p className="text-green-400 text-sm text-center">
                {lang === 'ar'
                  ? 'تم إرسال رابط التأكيد! تحقق من بريدك الإلكتروني.'
                  : 'Confirmation link sent! Check your email.'}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Google OAuth */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] text-white py-3 rounded-xl text-sm font-medium transition-all mb-4"
          >
            <Globe className="w-4 h-4 text-blue-400" />
            {lang === 'ar' ? 'الدخول بحساب Google' : 'Sign in with Google'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-gray-600 text-xs">{lang === 'ar' ? 'أو' : 'OR'}</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-gray-400 text-sm mb-2">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-colors"
                  placeholder={lang === 'ar' ? 'محمد أحمد' : 'John Doe'}
                />
              </div>
            )}
            <div>
              <label className="block text-gray-400 text-sm mb-2">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-colors"
                placeholder="email@example.com"
                dir="ltr"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-colors"
                placeholder="••••••••"
                dir="ltr"
                required
                minLength={6}
              />
              <p className="text-gray-600 text-xs mt-1">
                {lang === 'ar' ? '6 أحرف على الأقل' : 'At least 6 characters'}
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white py-3.5 rounded-xl text-sm font-medium transition-all"
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : mode === 'login' ? (
                <><LogIn className="w-5 h-5" /> {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</>
              ) : (
                <><UserPlus className="w-5 h-5" /> {lang === 'ar' ? 'إنشاء حساب' : 'Create Account'}</>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-4 text-center">
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setConfirmSent(false); }}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              {mode === 'login'
                ? (lang === 'ar' ? 'ليس لديك حساب؟ سجل الآن' : "Don't have an account? Register")
                : (lang === 'ar' ? 'لديك حساب؟ سجل الدخول' : 'Already have an account? Sign In')}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-500 hover:text-blue-400 text-sm transition-colors inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}
