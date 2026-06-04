import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { ShieldCheck } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAdmin, loading } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-gray-500 text-sm">جاري التحميل...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">يجب تسجيل الدخول أولاً</div>
          <button onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold">
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
            <ShieldCheck className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            ليس لديك صلاحية الدخول
          </h1>
          <p className="text-gray-400 mb-6">
            لوحة الإدارة متاحة فقط للمستخدمين ذوي صلاحية المسؤول.
            إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم.
          </p>
          <button onClick={() => navigate('/')}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all">
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
