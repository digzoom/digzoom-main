import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { Loader2, Save, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/providers/trpc';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function Profile() {
  const { user, loading } = useSupabaseAuth();
  const profile = trpc.getMyProfile.useQuery(undefined, { enabled: !!user });
  const utils = trpc.useUtils();
  const [form, setForm] = useState({ full_name: '', phone: '', avatar_url: '' });
  useEffect(() => { if (profile.data) setForm({ full_name: profile.data.full_name || '', phone: profile.data.phone || '', avatar_url: profile.data.avatar_url || '' }); }, [profile.data]);
  const update = trpc.updateMyProfile.useMutation({ onSuccess: async () => { toast.success('تم حفظ الملف الشخصي'); await utils.getMyProfile.invalidate(); }, onError: e => toast.error(e.message) });
  if (loading) return <div className="min-h-screen bg-[#0a0a0f] pt-32 text-center text-gray-400">جاري التحميل…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <main className="min-h-screen bg-[#0a0a0f] pt-28 pb-16 px-4" dir="rtl"><section className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#151520] p-7">
    <div className="mb-6 flex items-center gap-3"><UserRound className="text-blue-400" /><div><h1 className="text-2xl font-bold text-white">الملف الشخصي</h1><p className="text-sm text-gray-400" dir="ltr">{user.email}</p></div></div>
    {profile.isLoading ? <Loader2 className="mx-auto animate-spin text-blue-400" /> : <form onSubmit={e => { e.preventDefault(); update.mutate(form); }} className="space-y-4">
      <label className="block text-sm text-gray-300">الاسم الكامل<input required minLength={2} maxLength={100} value={form.full_name} onChange={e => setForm({...form, full_name:e.target.value})} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" /></label>
      <label className="block text-sm text-gray-300">رقم الهاتف<input maxLength={30} dir="ltr" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" /></label>
      <label className="block text-sm text-gray-300">رابط الصورة (اختياري)<input type="url" dir="ltr" value={form.avatar_url} onChange={e => setForm({...form, avatar_url:e.target.value})} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" /></label>
      <button disabled={update.isPending} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white disabled:opacity-50"><Save className="h-4 w-4" />حفظ التغييرات</button>
    </form>}
  </section></main>;
}
