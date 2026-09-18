import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, Loader2 } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function ForgotPassword() {
  const { resetPassword } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setMessage('');
    const result = await resetPassword(email.trim());
    setMessage(result.error || 'إذا كان البريد مسجلاً فسيصلك رابط آمن لإعادة كلمة المرور.');
    setLoading(false);
  };

  return <main className="min-h-screen bg-[#0a0a0f] pt-28 px-4">
    <form onSubmit={submit} className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#151520] p-7" dir="rtl">
      <Mail className="mx-auto mb-4 text-blue-400" />
      <h1 className="text-center text-2xl font-bold text-white">استعادة كلمة المرور</h1>
      <p className="mt-2 text-center text-sm text-gray-400">أدخل بريد حسابك وسنرسل رابطًا مؤقتًا.</p>
      <input required type="email" dir="ltr" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
      {message && <p className="mt-3 text-sm text-blue-300">{message}</p>}
      <button disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white disabled:opacity-50">{loading && <Loader2 className="h-4 w-4 animate-spin" />}إرسال الرابط</button>
      <Link to="/login" className="mt-4 block text-center text-sm text-gray-400 hover:text-white">العودة لتسجيل الدخول</Link>
    </form>
  </main>;
}
