import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router';
import { trpc } from '@/providers/trpc';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag,
  Receipt, BarChart3, Bell, ClipboardList, Settings,
  Plus, Search, Edit3, Trash2, X, Save, ChevronLeft,
  TrendingUp, DollarSign, ShoppingCart, UserPlus,
  LogOut, Upload, Image, Activity, Star, Eye, CheckCircle,
  XCircle, ImagePlus, Crown
} from 'lucide-react';

type Tab = 'dash' | 'products' | 'orders' | 'customers' | 'coupons' | 'reviews' | 'analytics' | 'settings';

const CATEGORIES = [
  { id: 1, name: 'جرافيكس' }, { id: 2, name: 'خطوط' },
  { id: 3, name: 'قوالب' }, { id: 4, name: 'فيديوهات' },
  { id: 5, name: 'كتب إلكترونية' }, { id: 6, name: 'صوتيات' },
  { id: 7, name: 'أكواد' }, { id: 8, name: 'تصميم ويب' },
  { id: 9, name: 'نماذج 3D' }, { id: 10, name: 'صور' },
];

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useSupabaseAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dash');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Debug: log auth state and token
  useEffect(() => {
    const token = localStorage.getItem('sb_access_token');
    console.log('[AdminDashboard] user?', !!user, 'user.id:', user?.id, 'user.role:', user?.role, 'token?', !!token, 'token length:', token?.length || 0);
  }, [user]);

  const SIDEBAR_ITEMS: Array<{ key: Tab; label: string; icon: React.ReactNode }> = [
    { key: 'dash', label: t.admin.dash, icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'products', label: t.admin.products, icon: <Package className="w-5 h-5" /> },
    { key: 'orders', label: t.admin.orders, icon: <ShoppingBag className="w-5 h-5" /> },
    { key: 'customers', label: t.admin.customers, icon: <Users className="w-5 h-5" /> },
    { key: 'coupons', label: t.admin.coupons, icon: <Tag className="w-5 h-5" /> },
    { key: 'reviews', label: t.admin.reviews, icon: <Star className="w-5 h-5" /> },
    { key: 'analytics', label: t.admin.analytics, icon: <BarChart3 className="w-5 h-5" /> },
    { key: 'settings', label: t.admin.settings, icon: <Settings className="w-5 h-5" /> },
  ];

  if (authLoading) return <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center text-gray-500">{t.admin.loading}</div>;

  if (!user) {
    navigate('/login');
    return null;
  }

  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white" dir={isAr ? 'rtl' : 'ltr'}>
      <aside className={`fixed top-0 ${isAr ? 'right-0' : 'left-0'} h-full bg-[#131722] border-l border-white/5 z-50 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <span className="text-lg font-bold bg-gradient-to-l from-blue-400 to-purple-400 bg-clip-text text-transparent">digzoom</span>
        </div>
        <nav className="p-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === item.key ? `bg-blue-600/15 text-blue-400 ${isAr ? 'border-r-2' : 'border-l-2'} border-blue-500` : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {item.icon}<span className="flex-1 text-right">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5">
          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" /><span>{t.admin.logout}</span>
          </button>
        </div>
      </aside>

      <main className={`transition-all duration-300 ${sidebarOpen ? (isAr ? 'mr-64' : 'ml-64') : ''}`}>
        <header className="h-16 bg-[#131722]/80 backdrop-blur-xl border-b border-white/5 flex items-center px-6 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
            <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">{t.admin.dash}</span><span className="text-gray-600">/</span>
            <span className="text-white font-medium">{SIDEBAR_ITEMS.find((i) => i.key === tab)?.label}</span>
          </div>
          <div className={`${isAr ? 'mr-auto' : 'ml-auto'} flex items-center gap-4`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">A</div>
              <span className="text-sm text-gray-300 hidden md:block">{user?.email}</span>
            </div>
          </div>
        </header>

        <div className="p-6">
          {tab === 'dash' && <DashTab />}
          {tab === 'products' && <ProductsTab />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'customers' && <CustomersTab />}
          {tab === 'coupons' && <CouponsTab />}
          {tab === 'reviews' && <ReviewsTab />}
          {tab === 'analytics' && <AnalyticsTab />}
          {tab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = { blue: 'from-blue-500/20 to-blue-600/5', purple: 'from-purple-500/20 to-purple-600/5', amber: 'from-amber-500/20 to-amber-600/5', emerald: 'from-emerald-500/20 to-emerald-600/5', red: 'from-red-500/20 to-red-600/5', cyan: 'from-cyan-500/20 to-cyan-600/5' };
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border border-white/5 rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3"><div className={`p-2 rounded-lg bg-${color}-500/20`}>{icon}</div></div>
      <div className="text-2xl font-extrabold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-xs">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD TAB
   ═══════════════════════════════════════════════════════════ */
function DashTab() {
  const { data: stats, isLoading } = trpc.getStats?.useQuery?.() ?? {};
  const { lang, t } = useLanguage();
  const s = stats as any;

  if (isLoading) return <div className="text-gray-500 text-center py-20">{t.admin.loadingStats}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Package className="w-5 h-5 text-blue-400" />} label={t.admin.productsCount} value={String(s?.productCount ?? 0)} color="blue" />
        <StatCard icon={<ShoppingCart className="w-5 h-5 text-amber-400" />} label={t.admin.ordersCount} value={String(s?.orderCount ?? 0)} color="amber" />
        <StatCard icon={<DollarSign className="w-5 h-5 text-purple-400" />} label={t.admin.totalSales} value={`${s?.totalSales?.toLocaleString?.() ?? 0} ${t.admin.currency}`} color="purple" />
        <StatCard icon={<Users className="w-5 h-5 text-emerald-400" />} label={t.admin.customersCount} value={String(s?.customerCount ?? 0)} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#131722] border border-white/5 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-blue-400" />{t.admin.latestProducts}</h3>
          <div className="space-y-3">
            {(!Array.isArray(s?.latestProducts) || s.latestProducts.length === 0) && <div className="text-center text-gray-500 py-8">{t.admin.noProducts}</div>}
            {(Array.isArray(s?.latestProducts) ? s.latestProducts : []).map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                  <div><div className="text-sm font-medium text-white">{p.title}</div><div className="text-xs text-gray-500">{p.price} {t.admin.currency}</div></div>
                </div>
                <span className="text-gray-500 text-xs">{new Date(p.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#131722] border border-white/5 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Receipt className="w-4 h-4 text-emerald-400" />{t.admin.latestOrders}</h3>
          <div className="space-y-3">
            {(!Array.isArray(s?.latestOrders) || s.latestOrders.length === 0) && <div className="text-center text-gray-500 py-8">{t.admin.noOrders}</div>}
            {(Array.isArray(s?.latestOrders) ? s.latestOrders : []).map((o: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <div><div className="text-sm font-medium text-white">{o.customer_name || t.admin.customer}</div><div className="text-xs text-gray-500">{o.order_number}</div></div>
                <div className="text-left"><div className="text-sm font-bold text-white">{o.total} {t.admin.currency}</div><div className="text-[10px] text-emerald-400">{o.status}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#131722] border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-amber-400" />{t.admin.activityLogs}</h3>
        <div className="space-y-2">
          {(!Array.isArray(s?.latestActivity) || s.latestActivity.length === 0) && <div className="text-center text-gray-500 py-8">{t.admin.noActivity}</div>}
          {(Array.isArray(s?.latestActivity) ? s.latestActivity : []).map((a: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div>
                  <span className="text-white font-medium">{a.admin_email}</span>
                  <span className="text-gray-500 mx-2">{a.action === 'create_product' ? t.admin.created : a.action === 'update_product' ? t.admin.updatedProduct : a.action === 'delete_product' ? t.admin.deletedProduct : a.action}</span>
                  <span className="text-blue-400">{a.product_title}</span>
                </div>
              </div>
              <span className="text-gray-500 text-xs">{new Date(a.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CUSTOMERS TAB
   ═══════════════════════════════════════════════════════════ */
function CustomersTab() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const { data: customers, isLoading } = trpc.listCustomers.useQuery({ limit: 100, search: search || undefined });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">{t.admin.customers}<span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full">{customers?.length ?? 0}</span></h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.admin.search} className="bg-[#1A1F2E] border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-white text-sm w-48 focus:border-blue-500/50 focus:outline-none" />
        </div>
      </div>
      {isLoading ? <div className="text-gray-500 text-center py-20 text-sm">{t.admin.loading}</div> : (
        <div className="bg-[#131722] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5 text-gray-400 text-xs">
                <th className="px-4 py-3 text-right">{t.admin.customer}</th><th className="px-4 py-3">{t.admin.email}</th><th className="px-4 py-3">{t.admin.orderCount}</th><th className="px-4 py-3">{t.admin.totalSpent}</th><th className="px-4 py-3">{t.admin.registeredAt}</th>
              </tr></thead>
              <tbody className="divide-y divide-white/[0.03]">
                {(Array.isArray(customers) ? customers : []).map((c: any) => (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold">{(c.full_name || c.email || '?')[0].toUpperCase()}</div><div className="text-white font-medium text-sm">{c.full_name || c.email}</div></div></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{c.email}</td>
                    <td className="px-4 py-3 text-center"><span className="bg-blue-500/15 text-blue-400 text-xs px-2 py-1 rounded-full font-bold">{c.order_count ?? 0}</span></td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">{(c.total_spent ?? 0).toLocaleString()} {t.admin.currency}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{c.created_at ? new Date(c.created_at).toLocaleDateString('ar-SA') : '-'}</td>
                  </tr>
                ))}
                {(!customers || customers.length === 0) && <tr><td colSpan={5} className="text-center text-gray-500 py-16">{t.admin.noCustomers}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COUPONS TAB
   ═══════════════════════════════════════════════════════════ */
function CouponsTab() {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState<any>(null);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ code: '', discount_percent: '', max_uses: '', valid_until: '', min_order_amount: '' });

  const utils = trpc.useUtils();
  const { data: coupons, isLoading } = trpc.listCoupons.useQuery({ limit: 100 });
  const createMutation = trpc.createCoupon.useMutation({ onSuccess: () => { setToast(t.admin.couponCreated); setShowForm(false); resetForm(); utils.listCoupons.invalidate(); }, onError: (e) => setToast(e.message) });
  const toggleMutation = trpc.toggleCoupon.useMutation({ onSuccess: () => { utils.listCoupons.invalidate(); }, onError: (e: any) => setToast(e.message) });
  const deleteMutation = trpc.deleteCoupon.useMutation({ onSuccess: () => { setToast(t.admin.couponDeleted); utils.listCoupons.invalidate(); }, onError: (e: any) => setToast(e.message) });

  const resetForm = () => setForm({ code: '', discount_percent: '', max_uses: '', valid_until: '', min_order_amount: '' });

  const save = () => {
    if (!form.code || !form.discount_percent) { setToast('Code and discount required'); return; }
    createMutation.mutate({
      code: form.code,
      discount_percent: Number(form.discount_percent),
      max_uses: form.max_uses ? Number(form.max_uses) : undefined,
      valid_until: form.valid_until || undefined,
      min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : undefined,
    });
  };

  return (
    <div className="space-y-4">
      {toast && <div className={`px-4 py-3 rounded-xl text-sm font-bold ${toast.includes('خطأ') || toast.includes('error') ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'}`}>{toast}</div>}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">{t.admin.coupons}<span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full">{coupons?.length ?? 0}</span></h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"><Plus className="w-4 h-4" />{t.admin.addCoupon}</button>
      </div>

      {showForm && (
        <div className="bg-[#131722] border border-white/5 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white">{t.admin.addCoupon}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div><label className="text-gray-400 text-xs mb-1 block">{t.admin.couponCode}</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SUMMER25" className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
            <div><label className="text-gray-400 text-xs mb-1 block">{t.admin.discountPercent}</label><input type="number" min="1" max="100" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} placeholder="25" className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" dir="ltr" /></div>
            <div><label className="text-gray-400 text-xs mb-1 block">{t.admin.usageLimit}</label><input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} placeholder={t.admin.unlimited} className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" dir="ltr" /></div>
            <div><label className="text-gray-400 text-xs mb-1 block">{t.admin.expiresAt}</label><input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" dir="ltr" /></div>
            <div><label className="text-gray-400 text-xs mb-1 block">الحد الأدنى للطلب</label><input type="number" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} placeholder="0" className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" dir="ltr" /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={createMutation.isPending} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold"><Save className="w-4 h-4 inline mr-1" />{t.admin.save}</button>
            <button onClick={() => { setShowForm(false); resetForm(); }} className="bg-white/5 hover:bg-white/10 text-gray-400 px-6 py-2 rounded-xl text-sm">{t.admin.cancel}</button>
          </div>
        </div>
      )}

      {isLoading ? <div className="text-gray-500 text-center py-20 text-sm">{t.admin.loading}</div> : (
        <div className="bg-[#131722] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5 text-gray-400 text-xs">
                <th className="px-4 py-3 text-right">{t.admin.couponCode}</th><th className="px-4 py-3">{t.admin.discount}</th><th className="px-4 py-3">{t.admin.expiresAt}</th><th className="px-4 py-3">{t.admin.usage}</th><th className="px-4 py-3">{t.admin.status}</th><th className="px-4 py-3">{t.admin.action}</th>
              </tr></thead>
              <tbody className="divide-y divide-white/[0.03]">
                {(Array.isArray(coupons) ? coupons : []).map((c: any) => (
                  <tr key={c.id} className={`hover:bg-white/[0.02] ${!c.is_active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Tag className="w-4 h-4 text-amber-400" /><span className="text-white font-mono font-bold text-sm">{c.code}</span></div></td>
                    <td className="px-4 py-3 text-center"><span className="text-emerald-400 font-bold">{c.discount_percent}%</span></td>
                    <td className="px-4 py-3 text-center text-gray-400 text-xs">{c.valid_until ? new Date(c.valid_until).toLocaleDateString('ar-SA') : <span className="text-gray-600">—</span>}</td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400 text-xs">{c.used_count ?? 0} / {c.max_uses ?? '∞'}</span></td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleMutation.mutate({ id: c.id })} className={`text-xs px-3 py-1 rounded-full font-bold ${c.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-500/15 text-gray-400'}`}>
                        {c.is_active ? t.admin.couponActive : t.admin.couponInactive}
                      </button>
                    </td>
                    <td className="px-4 py-3"><button onClick={() => { if (confirm('حذف الكوبون؟')) deleteMutation.mutate({ id: c.id }); }} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 className="w-3.5 h-3.5" /></button></td>
                  </tr>
                ))}
                {(!coupons || coupons.length === 0) && <tr><td colSpan={6} className="text-center text-gray-500 py-16">{t.admin.noCoupons}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
/* ═══════════════════════════════════════════════════════════
   REVIEWS TAB
   ═══════════════════════════════════════════════════════════ */
function ReviewsTab() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'all' | 'approved' | 'pending'>('all');
  const [toast, setToast] = useState('');
  const utils = trpc.useUtils();
  const { data: reviews, isLoading } = trpc.listReviews.useQuery({ limit: 100, status });

  const approveMutation = trpc.approveReview.useMutation({
    onSuccess: () => { utils.listReviews.invalidate(); },
    onError: (e: any) => setToast(e.message),
  });
  const deleteMutation = trpc.deleteReview.useMutation({
    onSuccess: () => { utils.listReviews.invalidate(); },
    onError: (e: any) => setToast(e.message),
  });

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {toast && <div className="px-4 py-3 rounded-xl text-sm font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{toast}</div>}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Star className="w-5 h-5 text-amber-400" />{t.admin.reviews}<span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full">{reviews?.length ?? 0}</span></h2>
        <div className="flex gap-1 bg-[#1A1F2E] rounded-xl p-1">
          {(['all', 'pending', 'approved'] as const).map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${status === s ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {s === 'all' ? 'الكل' : s === 'pending' ? t.admin.pending : t.admin.approved}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <div className="text-gray-500 text-center py-20 text-sm">{t.admin.loading}</div> : (
        <div className="space-y-3">
          {(Array.isArray(reviews) ? reviews : []).map((r: any) => (
            <div key={r.id} className={`bg-[#131722] border ${r.is_approved ? 'border-white/5' : 'border-amber-500/20'} rounded-2xl p-5`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">{(r.customer_name || '?')[0].toUpperCase()}</div>
                  <div>
                    <div className="text-white font-medium text-sm">{r.customer_name}</div>
                    <div className="flex items-center gap-2 mt-1">{renderStars(r.rating)}<span className="text-amber-400 text-xs font-bold">{r.rating}/5</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!r.is_approved && <span className="bg-amber-500/15 text-amber-400 text-[10px] px-2 py-1 rounded-full font-bold">{t.admin.pending}</span>}
                  <span className="text-gray-500 text-xs">{new Date(r.created_at).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-gray-400 text-xs mb-1">{t.admin.product}: <span className="text-blue-400">{r.products?.title || `#${r.product_id}`}</span></div>
                <p className="text-gray-300 text-sm leading-relaxed">{r.comment || '—'}</p>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                <button onClick={() => approveMutation.mutate({ id: r.id, approve: !r.is_approved })} className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 ${r.is_approved ? 'bg-gray-500/15 text-gray-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                  {r.is_approved ? <><XCircle className="w-3 h-3" />{t.admin.hide}</> : <><CheckCircle className="w-3 h-3" />{t.admin.approve}</>}
                </button>
                <button onClick={() => { if (confirm('حذف المراجعة؟')) deleteMutation.mutate({ id: r.id }); }} className="text-xs px-3 py-1.5 rounded-lg font-bold bg-red-500/10 text-red-400 flex items-center gap-1"><Trash2 className="w-3 h-3" />{t.admin.delete}</button>
              </div>
            </div>
          ))}
          {(!reviews || reviews.length === 0) && <div className="text-center text-gray-500 py-16 bg-[#131722] rounded-2xl border border-white/5">{t.admin.noReviews}</div>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANALYTICS TAB
   ═══════════════════════════════════════════════════════════ */
function AnalyticsTab() {
  const { data: a, isLoading } = trpc.getAnalytics.useQuery();
  const analytics = a as any;
  const { t } = useLanguage();

  if (isLoading) return <div className="text-gray-500 text-center py-20">{t.admin.loading}</div>;

  const maxSales = Math.max(...(analytics?.salesByDay?.map((d: any) => d.sales) || [1]), 1);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={<Eye className="w-5 h-5 text-cyan-400" />} label={t.admin.viewsToday} value={String(analytics?.viewsToday ?? 0)} color="cyan" />
        <StatCard icon={<Eye className="w-5 h-5 text-blue-400" />} label={t.admin.viewsWeek} value={String(analytics?.viewsWeek ?? 0)} color="blue" />
        <StatCard icon={<Eye className="w-5 h-5 text-purple-400" />} label={t.admin.viewsMonth} value={String(analytics?.viewsMonth ?? 0)} color="purple" />
        <StatCard icon={<ShoppingCart className="w-5 h-5 text-amber-400" />} label={t.admin.ordersCount} value={String(analytics?.orderCount ?? 0)} color="amber" />
        <StatCard icon={<DollarSign className="w-5 h-5 text-emerald-400" />} label={t.admin.totalSales} value={`${(analytics?.totalSales ?? 0).toLocaleString()}`} color="emerald" />
        <StatCard icon={<Star className="w-5 h-5 text-yellow-400" />} label={t.admin.avgRating} value={analytics?.avgRating ? analytics.avgRating.toFixed(1) : '0.0'} color="amber" />
      </div>

      {/* Sales Chart */}
      <div className="bg-[#131722] border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" />{t.admin.salesByDay} (7 {t.admin.days})</h3>
        {(!analytics?.salesByDay || analytics.salesByDay.length === 0) ? (
          <div className="text-center text-gray-500 py-12">لا توجد بيانات مبيعات</div>
        ) : (
          <div className="flex items-end gap-2 h-40">
            {analytics.salesByDay.map((d: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[10px] text-gray-500">{d.sales > 0 ? d.sales.toLocaleString() : ''}</div>
                <div className="w-full bg-emerald-500/20 rounded-t-lg relative overflow-hidden" style={{ height: `${Math.max((d.sales / maxSales) * 120, 4)}px` }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-500/40 to-emerald-500/10" style={{ height: '100%' }} />
                </div>
                <div className="text-[9px] text-gray-500">{d.date?.slice(5)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#131722] border border-white/5 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">{t.admin.ordersByStatus}</h3>
          <div className="space-y-3">
            {Object.entries(analytics?.ordersByStatus || {}).length === 0 && <div className="text-center text-gray-500 py-8">لا توجد طلبات</div>}
            {Object.entries(analytics?.ordersByStatus || {}).map(([status, count]: [string, any]) => {
              const colors: Record<string, string> = { pending: 'bg-amber-500', processing: 'bg-blue-500', completed: 'bg-emerald-500', cancelled: 'bg-red-500', refunded: 'bg-gray-500' };
              const labels: Record<string, string> = { pending: 'معلق', processing: 'قيد المعالجة', completed: 'مكتمل', cancelled: 'ملغي', refunded: 'مسترجع' };
              const total = analytics?.orderCount || 1;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs w-24">{labels[status] || status}</span>
                  <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
                    <div className={`h-full ${colors[status] || 'bg-gray-500'} rounded-lg transition-all`} style={{ width: `${Math.min((count / total) * 100, 100)}%` }} />
                  </div>
                  <span className="text-white text-xs font-bold w-8 text-left">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#131722] border border-white/5 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">{t.admin.topSelling}</h3>
          <div className="space-y-3">
            {(!analytics?.topProducts || analytics.topProducts.length === 0) && <div className="text-center text-gray-500 py-8">لا توجد بيانات</div>}
            {(analytics?.topProducts || []).slice(0, 5).map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                  <div className="text-white text-sm">{p.product_name || p.title || `Product #${p.product_id}`}</div>
                </div>
                <div className="text-emerald-400 text-xs font-bold">{p.quantity || 1} مبيع</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRODUCTS TAB (with multi-image support)
   ═══════════════════════════════════════════════════════════ */
function ProductsTab() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showGallery, setShowGallery] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', price: '', original_price: '', discount_percent: '0', is_on_sale: false, image_url: '', category_id: '1', in_stock: true, is_active: true });
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '', original_price: '', discount_percent: '0', is_on_sale: false, image_url: '', category_id: '1', in_stock: true, is_active: true });
  const [toast, setToast] = useState('');
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';

  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.listProducts.useQuery({ limit: 100, search: search || undefined });

  const createMutation = trpc.createProduct.useMutation({
    onSuccess: () => { setToast(t.admin.added); setShowForm(false); resetForm(); utils.listProducts.invalidate(); utils.getStats?.invalidate?.(); },
    onError: (e) => setToast(e.message),
  });
  const updateMutation = trpc.updateProduct.useMutation({
    onSuccess: () => { setToast(t.admin.saved); setShowEdit(false); setEditProduct(null); utils.listProducts.invalidate(); utils.getStats?.invalidate?.(); },
    onError: (e) => setToast(e.message),
  });
  const toggleMutation = trpc.toggleProduct.useMutation({
    onSuccess: () => { setToast(t.admin.updated); utils.listProducts.invalidate(); },
    onError: (e) => setToast(e.message),
  });
  const deleteMutation = trpc.deleteProduct.useMutation({
    onSuccess: () => { setToast(t.admin.deleted); utils.listProducts.invalidate(); utils.getStats?.invalidate?.(); },
    onError: (e) => setToast(e.message),
  });

  const resetForm = () => setForm({ title: '', description: '', price: '', original_price: '', discount_percent: '0', is_on_sale: false, image_url: '', category_id: '1', in_stock: true, is_active: true });

  const save = () => {
    const price = Number(form.price);
    if (!form.title || price <= 0) { setToast(t.admin.titleRequired); return; }
    createMutation.mutate({ title: form.title, description: form.description, price, original_price: form.original_price ? Number(form.original_price) : undefined, discount_percent: Number(form.discount_percent) || 0, is_on_sale: form.is_on_sale, image_url: form.image_url, category_id: Number(form.category_id), in_stock: form.in_stock, is_active: form.is_active });
  };

  const startEdit = (p: any) => {
    setEditProduct(p);
    setEditForm({ title: p.title, description: p.description || '', price: String(p.price), original_price: String(p.original_price || p.price), discount_percent: String(p.discount_percent || 0), is_on_sale: p.is_on_sale || false, image_url: p.image_url, category_id: String(p.category_id), in_stock: p.in_stock, is_active: p.is_active });
    setShowEdit(true);
  };

  const saveEdit = () => {
    if (!editProduct) return;
    const price = Number(editForm.price);
    if (!editForm.title || price <= 0) { setToast(t.admin.titleRequired); return; }
    updateMutation.mutate({ id: editProduct.id, title: editForm.title, description: editForm.description, price, original_price: editForm.original_price ? Number(editForm.original_price) : undefined, discount_percent: Number(editForm.discount_percent) || 0, is_on_sale: editForm.is_on_sale, image_url: editForm.image_url, category_id: Number(editForm.category_id), in_stock: editForm.in_stock, is_active: editForm.is_active });
  };

  const toggleField = (id: number, field: 'is_active' | 'in_stock', current: boolean) => { toggleMutation.mutate({ id, field, value: !current }); };
  const del = (id: number) => { if (!confirm(t.admin.deleteConfirm)) return; deleteMutation.mutate({ id }); };

  return (
    <div className="space-y-4">
      {toast && <div className={`px-4 py-3 rounded-xl text-sm font-bold ${toast.includes('خطأ') || toast.includes('error') || toast.includes('failed') ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'}`}>{toast}</div>}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">{t.admin.products}<span className="bg-blue-500/20 text-blue-400 text-xs px-2.5 py-1 rounded-full">{items?.length ?? 0}</span></h2>
        <div className="flex gap-2">
          <div className="relative"><Search className={`w-4 h-4 absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-500`} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.admin.search} className={`bg-[#1A1F2E] border border-white/10 rounded-xl ${isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 text-white text-sm w-48 focus:border-blue-500/50 focus:outline-none`} />
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"><Plus className="w-4 h-4" />{t.admin.addProduct}</button>
        </div>
      </div>

      {isLoading ? <div className="text-gray-500 text-center py-20 text-sm">{t.admin.loading}</div> : (
        <div className="bg-[#131722] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5 text-gray-400 text-xs">
                <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'}`}>{t.admin.product}</th><th className="px-4 py-3">{t.admin.price}</th><th className="px-4 py-3">{t.admin.discount}</th><th className="px-4 py-3">{t.admin.status}</th><th className="px-4 py-3">{t.admin.stock}</th><th className="px-4 py-3">{t.admin.action}</th>
              </tr></thead>
              <tbody className="divide-y divide-white/[0.03]">
                {(Array.isArray(items) ? items : []).map((p: any) => (
                  <tr key={p.id} className={`hover:bg-white/[0.02] transition-colors ${!p.is_active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-[#1A1F2E] flex-shrink-0" style={{ objectFit: 'cover', aspectRatio: '1/1' }} loading="lazy" />
                          <button onClick={() => setShowGallery(p.id)} className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center" title={t.admin.productGallery}><ImagePlus className="w-3 h-3 text-white" /></button>
                        </div>
                        <div><div className="text-white font-medium text-sm">{p.title}</div><div className="text-xs text-gray-500">#{p.id} &middot; {CATEGORIES.find(c => c.id === p.category_id)?.name}</div></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.is_on_sale && p.original_price > p.price ? (
                        <div><div className="text-emerald-400 font-bold">{p.price} {t.admin.currency}</div><div className="text-gray-500 text-xs line-through">{p.original_price} {t.admin.currency}</div></div>
                      ) : (
                        <span className="text-emerald-400 font-bold">{p.price} {t.admin.currency}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">{p.is_on_sale && p.discount_percent > 0 ? <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full font-bold">-{p.discount_percent}%</span> : <span className="text-gray-600">-</span>}</td>
                    <td className="px-4 py-3 text-center"><button onClick={() => toggleField(p.id, 'is_active', p.is_active)} className={`text-xs px-3 py-1 rounded-full font-bold ${p.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-500/15 text-gray-400'}`}>{p.is_active ? t.admin.active : t.admin.inactive}</button></td>
                    <td className="px-4 py-3 text-center"><button onClick={() => toggleField(p.id, 'in_stock', p.in_stock)} className={`text-xs px-3 py-1 rounded-full font-bold ${p.in_stock ? 'bg-blue-500/15 text-blue-400' : 'bg-red-500/15 text-red-400'}`}>{p.in_stock ? t.admin.available : t.admin.outOfStock}</button></td>
                    <td className="px-4 py-3"><div className="flex gap-1 justify-center"><button onClick={() => startEdit(p)} className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" title="تعديل"><Edit3 className="w-3.5 h-3.5" /></button><button onClick={() => del(p.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20" title="حذف"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                  </tr>
                ))}
                {(!items || items.length === 0) && <tr><td colSpan={6} className="text-center text-gray-500 py-16">{t.admin.noProducts}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && <ProductModal title={t.admin.addProduct} form={form} setForm={setForm} onSave={save} onClose={() => setShowForm(false)} isPending={createMutation.isPending} />}
      {showEdit && editProduct && <ProductModal title={t.admin.editProduct} form={editForm} setForm={setEditForm} onSave={saveEdit} onClose={() => { setShowEdit(false); setEditProduct(null); }} isPending={updateMutation.isPending} />}
      {showGallery && <ProductGalleryModal productId={showGallery} onClose={() => setShowGallery(null)} />}
    </div>
  );
}
/* ═══════════════════════════════════════════════════════════
   PRODUCT GALLERY MODAL (multi-image)
   ═══════════════════════════════════════════════════════════ */
function ProductGalleryModal({ productId, onClose }: { productId: number; onClose: () => void }) {
  const { t } = useLanguage();
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const utils = trpc.useUtils();
  const { data: images, isLoading } = trpc.listProductImages.useQuery({ productId });
  const addMutation = trpc.addProductImage.useMutation({
    onSuccess: () => { utils.listProductImages.invalidate(); utils.listProducts.invalidate(); setImageUrl(''); },
  });
  const removeMutation = trpc.removeProductImage.useMutation({
    onSuccess: () => { utils.listProductImages.invalidate(); utils.listProducts.invalidate(); },
  });
  const primaryMutation = trpc.setPrimaryImage.useMutation({
    onSuccess: () => { utils.listProductImages.invalidate(); utils.listProducts.invalidate(); },
  });
  const uploadMutation = trpc.uploadImage?.useMutation?.({
    onSuccess: (data: any) => { addMutation.mutate({ productId, imageUrl: data.url, isPrimary: false }); setUploading(false); },
    onError: () => setUploading(false),
  }) ?? null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadMutation) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      const ext = file.name.split('.').pop() || 'jpg';
      uploadMutation.mutate({ filename: `product-${productId}-${Date.now()}.${ext}`, base64, contentType: file.type || 'image/jpeg' });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#131722] rounded-2xl border border-white/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Image className="w-5 h-5 text-blue-400" />{t.admin.productGallery} #{productId}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        {/* Add Image */}
        <div className="flex gap-2 mb-5">
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="flex-1 bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" dir="ltr" />
          <button onClick={() => imageUrl && addMutation.mutate({ productId, imageUrl, isPrimary: false })} disabled={!imageUrl || addMutation.isPending} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold"><Plus className="w-4 h-4" /></button>
          <label className="flex items-center gap-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl px-4 py-2 text-sm cursor-pointer hover:bg-emerald-600/30 transition-colors">
            <Upload className="w-4 h-4" />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {uploading ? '...' : 'رفع'}
          </label>
        </div>

        {/* Image Grid */}
        {isLoading ? <div className="text-gray-500 text-center py-8">{t.admin.loading}</div> : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {(Array.isArray(images) ? images : []).map((img: any) => (
              <div key={img.id} className={`relative rounded-xl overflow-hidden border-2 ${img.is_primary ? 'border-blue-500' : 'border-white/10'} group`}>
                <img src={img.image_url} alt="" className="w-full aspect-square object-cover bg-[#1A1F2E]" loading="lazy" />
                {img.is_primary && <div className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">{t.admin.primary}</div>}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {!img.is_primary && <button onClick={() => primaryMutation.mutate({ id: img.id, productId })} className="p-1.5 rounded-lg bg-blue-600 text-white" title={t.admin.setPrimary}><Crown className="w-3.5 h-3.5" /></button>}
                  <button onClick={() => removeMutation.mutate({ id: img.id })} className="p-1.5 rounded-lg bg-red-600 text-white" title={t.admin.delete}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
        {(!images || images.length === 0) && <div className="text-center text-gray-500 py-12">لا توجد صور إضافية</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRODUCT MODAL (create/edit)
   ═══════════════════════════════════════════════════════════ */
function ProductModal({ title, form, setForm, onSave, onClose, isPending }: {
  title: string; form: any; setForm: any; onSave: () => void; onClose: () => void; isPending: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(form.image_url || '');
  const { t } = useLanguage();
  const uploadMutation = trpc.uploadImage?.useMutation?.({
    onSuccess: (data: any) => { setForm({ ...form, image_url: data.url }); setPreviewUrl(data.url); setUploading(false); },
    onError: () => setUploading(false),
  }) ?? null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadMutation) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      const ext = file.name.split('.').pop() || 'jpg';
      uploadMutation.mutate({ filename: `product-${Date.now()}.${ext}`, base64, contentType: file.type || 'image/jpeg' });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#131722] rounded-2xl border border-white/10 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-3">
          {/* Image Upload */}
          <div>
            <label className="text-gray-400 text-xs mb-1 block">{t.admin.productImage}</label>
            {previewUrl && <img src={previewUrl} alt="" className="w-full h-40 object-cover rounded-xl mb-2 bg-[#1A1F2E]" style={{ objectFit: 'cover', aspectRatio: '16/9' }} />}
            <label className="flex items-center justify-center gap-2 bg-blue-600/15 text-blue-400 border border-blue-500/20 rounded-xl px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-600/25 transition-colors">
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              {uploading ? t.admin.uploading : t.admin.chooseImage}
            </label>
            <div className="text-center text-gray-500 text-[10px] my-1">{t.admin.or}</div>
            <input value={form.image_url} onChange={(e) => { setForm({ ...form, image_url: e.target.value }); setPreviewUrl(e.target.value); }} placeholder={t.admin.imageUrl} className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-blue-500/50 focus:outline-none" dir="ltr" />
          </div>

          <div><label className="text-gray-400 text-xs mb-1 block">{t.admin.title} *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={t.admin.titlePlaceholder} className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500/50 focus:outline-none" /></div>
          <div><label className="text-gray-400 text-xs mb-1 block">{t.admin.description}</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t.admin.descriptionPlaceholder} className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500/50 focus:outline-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-gray-400 text-xs mb-1 block">{t.admin.price} *</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder={t.admin.pricePlaceholder} className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500/50 focus:outline-none" dir="ltr" /></div>
            <div><label className="text-gray-400 text-xs mb-1 block">{t.admin.category}</label><select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500/50 focus:outline-none">{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-gray-400 text-xs mb-1 block">{t.admin.originalPrice}</label><input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} placeholder={t.admin.originalPricePlaceholder} className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500/50 focus:outline-none" dir="ltr" /></div>
            <div><label className="text-gray-400 text-xs mb-1 block">{t.admin.discountPercent}</label><input type="number" min="0" max="100" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} placeholder="0" className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500/50 focus:outline-none" dir="ltr" /></div>
            <div className="flex items-end pb-2"><label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer"><input type="checkbox" checked={form.is_on_sale} onChange={(e) => setForm({ ...form, is_on_sale: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />{t.admin.onSale}</label></div>
          </div>
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer"><input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />{t.admin.available}</label>
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />{t.admin.active}</label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onSave} disabled={isPending} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"><Save className="w-4 h-4" />{t.admin.save}</button>
          <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-2.5 rounded-xl text-sm transition-colors">{t.admin.cancel}</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ORDERS TAB
   ═══════════════════════════════════════════════════════════ */
function OrdersTab() {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const { lang, t } = useLanguage();
  const utils = trpc.useUtils();
  const { data: orders, isLoading } = trpc.listOrders?.useQuery?.({ limit: 100 }) ?? { data: [], isLoading: false };
  const updateStatusMutation = trpc.updateOrderStatus?.useMutation?.({
    onSuccess: () => { setToast(t.admin.updated); utils.listOrders?.invalidate?.(); },
    onError: (e: any) => setToast(e.message),
  }) ?? { isPending: false, mutate: () => {} };

  const statusColors: Record<string, string> = { pending: 'bg-amber-500/15 text-amber-400', processing: 'bg-blue-500/15 text-blue-400', completed: 'bg-emerald-500/15 text-emerald-400', cancelled: 'bg-red-500/15 text-red-400', refunded: 'bg-gray-500/15 text-gray-400' };
  const statusLabels: Record<string, string> = { pending: t.admin.pending, processing: t.admin.processing, completed: t.admin.completed, cancelled: t.admin.cancelled, refunded: t.admin.refunded };

  return (
    <div className="space-y-4">
      {toast && <div className="px-4 py-3 rounded-xl text-sm font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{toast}</div>}
      <h2 className="text-xl font-bold text-white">{t.admin.orders}</h2>
      {isLoading ? <div className="text-gray-500 text-center py-20 text-sm">{t.admin.loading}</div> : (
        <div className="bg-[#131722] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5 text-gray-400 text-xs">
                <th className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.admin.order}</th><th className="px-4 py-3">{t.admin.customer}</th><th className="px-4 py-3">{t.admin.amount}</th><th className="px-4 py-3">{t.admin.status}</th><th className="px-4 py-3">{t.admin.payment}</th><th className="px-4 py-3">{t.admin.date}</th><th className="px-4 py-3"></th>
              </tr></thead>
              <tbody className="divide-y divide-white/[0.03]">
                {(Array.isArray(orders) ? orders : []).map((o: any) => (
                  <>
                    <tr key={o.id} className="hover:bg-white/[0.02] cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center"><Receipt className="w-4 h-4 text-white" /></div><div><div className="text-white font-medium text-sm">{o.order_number}</div><div className="text-gray-500 text-xs">{o.customer_email}</div></div></div></td>
                      <td className="px-4 py-3"><span className="text-white text-sm">{o.customer_name}</span></td>
                      <td className="px-4 py-3 text-center text-emerald-400 font-bold">{o.total} {t.admin.currency}</td>
                      <td className="px-4 py-3 text-center"><select value={o.status} onChange={(e) => { e.stopPropagation(); updateStatusMutation.mutate({ id: o.id, status: e.target.value as any }); }} className={`text-xs px-3 py-1 rounded-full font-bold bg-transparent ${statusColors[o.status] || ''}`}>{['pending', 'processing', 'completed', 'cancelled', 'refunded'].map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}</select></td>
                      <td className="px-4 py-3 text-center"><span className={`text-xs px-3 py-1 rounded-full font-bold ${o.payment_status === 'paid' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>{o.payment_status}</span></td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</td>
                      <td className="px-4 py-3 text-center"><button className="text-gray-500 hover:text-white"><ChevronLeft className={`w-4 h-4 transition-transform ${expandedOrder === o.id ? '-rotate-90' : ''}`} /></button></td>
                    </tr>
                    {expandedOrder === o.id && (
                      <tr><td colSpan={7} className="px-4 py-3 bg-white/[0.02]">
                        <div className="space-y-2 text-sm">
                          <div className="text-gray-400"><strong className="text-white">{t.admin.customer}:</strong> {o.customer_name} ({o.customer_email})</div>
                          {Array.isArray(o.items) && o.items.length > 0 && <div className="space-y-2"><div className="text-gray-400 text-xs font-bold">{t.admin.items}:</div>{o.items.map((item: any, i: number) => (<div key={i} className="flex justify-between text-gray-300 text-sm"><span>{item.product_name} × {item.quantity}</span><span className="text-emerald-400">{item.price} {t.admin.currency}</span></div>))}</div>}
                        </div>
                      </td></tr>
                    )}
                  </>
                ))}
                {(!orders || orders.length === 0) && <tr><td colSpan={7} className="text-center text-gray-500 py-16">{t.admin.noOrders}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS TAB (placeholder)
   ═══════════════════════════════════════════════════════════ */
function SettingsTab() {
  const { t } = useLanguage();
  return <div className="space-y-4"><h2 className="text-xl font-bold text-white">{t.admin.settings}</h2><div className="bg-[#131722] rounded-2xl border border-white/5 p-12 text-center"><Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" /><div className="text-gray-400 text-sm">{t.admin.settingsSoon}</div></div></div>;
}
