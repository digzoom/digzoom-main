import { useState, useEffect } from 'react';
import { Receipt, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { trpc } from '@/providers/trpc';

export default function OrdersTab() {
  const { lang, t } = useLanguage();
  const utils = trpc.useUtils();

  // Fetch real orders from Supabase via tRPC
  const { data: orders, isLoading, error: ordersError } = trpc.listOrders.useQuery({ limit: 100 });
  const updateStatusMutation = trpc.updateOrderStatus.useMutation({
    onSuccess: () => { setToast(t.admin.updated); utils.listOrders.invalidate(); },
    onError: (e: any) => setToast(e.message),
  });

  // Status filter
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/15 text-amber-400',
    processing: 'bg-blue-500/15 text-blue-400',
    completed: 'bg-emerald-500/15 text-emerald-400',
    cancelled: 'bg-red-500/15 text-red-400',
    refunded: 'bg-gray-500/15 text-gray-400',
  };

  const statusLabels: Record<string, string> = {
    all: lang === 'ar' ? 'الكل' : 'All',
    pending: t.admin.pending,
    processing: t.admin.processing,
    completed: t.admin.completed,
    cancelled: t.admin.cancelled,
    refunded: t.admin.refunded,
  };

  const filteredOrders = statusFilter === 'all'
    ? (orders || [])
    : (orders || []).filter((o: any) => o.status === statusFilter);

  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(''), 3000); return () => clearTimeout(timer); } }, [toast]);

  if (ordersError) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">{t.admin.orders}</h2>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <div className="text-red-400 font-bold mb-2">{lang === 'ar' ? 'خطأ في تحميل الطلبات' : 'Error loading orders'}</div>
          <div className="text-gray-400 text-sm">{ordersError.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {toast && <div className="px-4 py-3 rounded-xl text-sm font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{toast}</div>}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{t.admin.orders}</h2>
        <span className="text-gray-500 text-sm">{orders?.length || 0} {lang === 'ar' ? 'طلب' : 'orders'}</span>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'processing', 'completed', 'cancelled', 'refunded'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === s
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {statusLabels[s]}
            {s !== 'all' && (
              <span className="text-gray-500 ml-1">{(orders || []).filter((o: any) => o.status === s).length}</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-center py-20 text-sm">{t.admin.loading}</div>
      ) : (
        <div className="bg-[#131722] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5 text-gray-400 text-xs">
                <th className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.admin.order}</th>
                <th className="px-4 py-3">{t.admin.customer}</th>
                <th className="px-4 py-3">{t.admin.amount}</th>
                <th className="px-4 py-3">{t.admin.status}</th>
                <th className="px-4 py-3">{t.admin.payment}</th>
                <th className="px-4 py-3">{t.admin.date}</th>
                <th className="px-4 py-3"></th>
              </tr></thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredOrders.map((o: any) => (
                  <>
                    <tr key={o.id} className="hover:bg-white/[0.02] cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                            <Receipt className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{o.order_number}</div>
                            <div className="text-gray-500 text-xs">{o.customer_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="text-white text-sm">{o.customer_name}</span></td>
                      <td className="px-4 py-3 text-center text-emerald-400 font-bold">{o.total} {t.admin.currency}</td>
                      <td className="px-4 py-3 text-center">
                        <select
                          value={o.status}
                          onChange={(e) => { e.stopPropagation(); updateStatusMutation.mutate({ id: o.id, status: e.target.value as any }); }}
                          className={`text-xs px-3 py-1 rounded-full font-bold bg-transparent ${statusColors[o.status] || ''}`}
                        >
                          {['pending', 'processing', 'completed', 'cancelled', 'refunded'].map((s) => (
                            <option key={s} value={s}>{statusLabels[s]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-3 py-1 rounded-full font-bold ${o.payment_status === 'paid' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                          {o.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-gray-500 hover:text-white">
                          <ChevronLeft className={`w-4 h-4 transition-transform ${expandedOrder === o.id ? '-rotate-90' : ''}`} />
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === o.id && (
                      <tr><td colSpan={7} className="px-4 py-3 bg-white/[0.02]">
                        <div className="space-y-2 text-sm">
                          <div className="text-gray-400">
                            <strong className="text-white">{t.admin.customer}:</strong> {o.customer_name} ({o.customer_email})
                          </div>
                          {Array.isArray(o.items) && o.items.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-gray-400 text-xs font-bold">{t.admin.items}:</div>
                              {o.items.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between text-gray-300 text-sm">
                                  <span>{item.product_name} × {item.quantity}</span>
                                  <span className="text-emerald-400">{item.price} {t.admin.currency}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td></tr>
                    )}
                  </>
                ))}
                {filteredOrders.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-gray-500 py-16">
                    {statusFilter === 'all' ? t.admin.noOrders : (lang === 'ar' ? 'لا توجد طلبات بهذه الحالة' : 'No orders with this status')}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
