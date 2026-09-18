import { useState } from 'react';
import { Link } from 'react-router';
import { KeyRound, Loader2 } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function ResetPassword() {
  const { updatePassword, loading: authLoading } = useSupabaseAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) return setMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
    if (password !== confirm) return setMessage('كلمتا المرور غير متطابقتين.');
    setLoading(true); const result = await updatePassword(password); setLoading(false);
    if (result.error) setMessage(result.error); else { setDone(true); setMessage('تم تحديث كلمة المرور بنجاح.'); }
  };

  return <main className="min-h-screen bg-[#0a0a0f] pt-28 px-4">
    <form onSubmit={submit} className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#151520] p-7" dir="rtl">
      <KeyRound className="mx-auto mb-4 text-blue-400" />
      <h1 className="text-center text-2xl font-bold text-white">تعيين كلمة مرور جديدة</h1>
      {!done && <><input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور الجديدة" className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" /><input required minLength={8} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="تأكيد كلمة المرور" className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" /></>}
      {message && <p className={`mt-3 text-sm ${done ? 'text-emerald-400' : 'text-amber-300'}`}>{message}</p>}
      {!done && <button disabled={loading || authLoading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white disabled:opacity-50">{(loading || authLoading) && <Loader2 className="h-4 w-4 animate-spin" />}حفظ كلمة المرور</button>}
      {done && <Link to="/login" className="mt-5 block rounded-xl bg-blue-600 py-3 text-center font-bold text-white">تسجيل الدخول</Link>}
    </form>
  </main>;
}
