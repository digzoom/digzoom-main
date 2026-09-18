import { Navigate } from 'react-router';
import { Download, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/providers/trpc';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function Orders() {
  const { user, loading } = useSupabaseAuth();
  const orders = trpc.listMyOrders.useQuery(undefined, { enabled: !!user });
  const link = trpc.createDownloadLink.useMutation();
  if (loading) return <div className="min-h-screen bg-[#0a0a0f] pt-32 text-center text-gray-400">جاري التحميل…</div>;
  if (!user) return <Navigate to="/login" replace />;
  const download = async (orderId: string, itemId: number) => { try { const result = await link.mutateAsync({ order_id: orderId, order_item_id: itemId }); window.location.assign(result.url); void orders.refetch(); } catch (e: any) { toast.error(e.message); } };
  return <main className="min-h-screen bg-[#0a0a0f] pt-28 pb-16 px-4" dir="rtl"><section className="mx-auto max-w-4xl"><h1 className="mb-7 flex items-center gap-3 text-3xl font-bold text-white"><Package className="text-blue-400" />طلباتي</h1>
    {orders.isLoading ? <Loader2 className="mx-auto animate-spin text-blue-400" /> : !orders.data?.length ? <div className="rounded-2xl border border-white/10 bg-[#151520] p-12 text-center text-gray-400">لا توجد طلبات مرتبطة بهذا الحساب بعد.</div> : <div className="space-y-4">{orders.data.map((order:any) => <article key={order.id} className="rounded-2xl border border-white/10 bg-[#151520] p-6"><div className="flex flex-wrap justify-between gap-3 border-b border-white/5 pb-4"><div><div className="font-mono text-white" dir="ltr">{order.id}</div><div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('ar-SA')}</div></div><div className="text-left"><div className="font-bold text-emerald-400">{Number(order.total_amount).toFixed(2)} ر.س</div><div className="text-xs text-gray-400">{order.status}</div></div></div><div className="mt-4 space-y-3">{order.items.map((item:any) => { const paid = !!order.paid_at || order.status === 'paid' || order.status === 'completed'; const available = paid && item.download_count < item.max_downloads; return <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl bg-white/[.03] p-3"><div><div className="text-white">{item.product_title}</div><div className="text-xs text-gray-500">التحميلات {item.download_count}/{item.max_downloads}</div></div><button disabled={!available || link.isPending} onClick={() => download(order.id,item.id)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"><Download className="h-4 w-4" />تحميل</button></div>; })}</div></article>)}</div>}
  </section></main>;
}
