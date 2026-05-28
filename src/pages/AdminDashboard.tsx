import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router';
import { trpc } from '@/providers/trpc';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag,
  Receipt, BarChart3, Bell, ClipboardList, Settings,
  Plus, Search, Edit3, Trash2, X, Save, ChevronLeft,
  TrendingUp, DollarSign, ShoppingCart, UserPlus,
  LogOut, ChevronDown
} from 'lucide-react';

type Tab = 'dash' | 'products' | 'orders' | 'customers' | 'coupons' | 'settings';

type ProductRow = {
  id: number;
  title: string;
  price: number;
  image_url: string;
  in_stock: boolean;
  is_active: boolean;
  category_id: number;
  created_at: string;
  description?: string;
};

type OrderRow = {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  items?: Array<{ product_name: string; quantity: number; price: number }>;
};

const SIDEBAR_ITEMS: Array<{ key: Tab; label: string; icon: React.ReactNode; badge?: number }> = [
  { key: 'dash', label: 'الرئيسية', icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: 'products', label: 'المنتجات', icon: <Package className="w-5 h-5" /> },
  { key: 'orders', label: 'الطلبات', icon: <ShoppingBag className="w-5 h-5" />, badge: 8 },
  { key: 'customers', label: 'العملاء', icon: <Users className="w-5 h-5" /> },
  { key: 'coupons', label: 'الكوبونات', icon: <Tag className="w-5 h-5" /> },
  { key: 'settings', label: 'الإعدادات', icon: <Settings className="w-5 h-5" /> },
];

const CATEGORIES = [
  { id: 1, name: 'جرافيكس' },
  { id: 2, name: 'خطوط' },
  { id: 3, name: 'قوالب' },
  { id: 4, name: 'فيديوهات' },
  { id: 5, name: 'كتب إلكترونية' },
  { id: 6, name: 'صوتيات' },
  { id: 7, name: 'أكواد' },
  { id: 8, name: 'تصميم ويب' },
  { id: 9, name: 'نماذج 3D' },
  { id: 10, name: 'صور' },
];

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dash');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="text-gray-500 text-sm">جاري التحميل...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full bg-[#131722] border-l border-white/5 z-50 transition-all duration-300 ${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-0 translate-x-full overflow-hidden'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <span className="text-lg font-bold bg-gradient-to-l from-blue-400 to-purple-400 bg-clip-text text-transparent">
            digzoom
          </span>
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === item.key
                  ? 'bg-blue-600/15 text-blue-400 border-r-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-right">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom: Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? 'mr-64' : 'mr-0'
        }`}
      >
        {/* Top Bar */}
        <header className="h-16 bg-[#131722]/80 backdrop-blur-xl border-b border-white/5 flex items-center px-6 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-4 p-2 rounded-lg hover:bg-white/5 text-gray-400"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">لوحة التحكم</span>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">
              {SIDEBAR_ITEMS.find((i) => i.key === tab)?.label}
            </span>
          </div>

          {/* Right side */}
          <div className="mr-auto flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-white/5 text-gray-400">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                A
              </div>
              <span className="text-sm text-gray-300 hidden md:block">{user.email}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {tab === 'dash' && <DashTab />}
          {tab === 'products' && <ProductsTab />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'customers' && <CustomersTab />}
          {tab === 'coupons' && <CouponsTab />}
          {tab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}

/* ─── Stats Card ─── */
function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  const bgMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/5',
    purple: 'from-purple-500/20 to-purple-600/5',
    amber: 'from-amber-500/20 to-amber-600/5',
    emerald: 'from-emerald-500/20 to-emerald-600/5',
  };
  return (
    <div className={`bg-gradient-to-br ${bgMap[color]} border border-white/5 rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center text-${color}-400`}>
          {icon}
        </div>
        <TrendingUp className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="text-2xl font-extrabold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-xs">{label}</div>
      <div className="text-emerald-400 text-[10px] mt-1">{sub}</div>
    </div>
  );
}

/* ─── Dashboard Tab ─── */
function DashTab() {
  const { data: stats, isLoading: statsLoading } = trpc.getStats?.useQuery?.() ?? {};

  if (statsLoading) {
    return <div className="text-gray-500 text-center py-20">جاري تحميل الإحصائيات...</div>;
  }

  const s = stats as any;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Package className="w-5 h-5 text-blue-400" />}
          label="المنتجات"
          value={String(s?.productCount ?? 0)}
          sub="إجمالي المنتجات"
          color="blue"
        />
        <StatCard
          icon={<ShoppingCart className="w-5 h-5 text-amber-400" />}
          label="الطلبات"
          value={String(s?.orderCount ?? 0)}
          sub="إجمالي الطلبات"
          color="amber"
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5 text-purple-400" />}
          label="إجمالي المبيعات"
          value={`${s?.totalSales?.toLocaleString?.() ?? 0} ر.س`}
          sub="الطلبات المكتملة"
          color="purple"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-emerald-400" />}
          label="العملاء"
          value={String(s?.customerCount ?? 0)}
          sub="مسجلين في النظام"
          color="emerald"
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications */}
        <div className="bg-[#131722] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              الإشعارات
            </h3>
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3 جديد</span>
          </div>
          <div className="space-y-3">
            {[
              { title: 'طلب جديد', desc: 'طلب #ORD-2847 من أحمد الشمري', time: 'منذ 5 دقائق', color: 'blue' },
              { title: 'دفع ناجح', desc: 'تم الدفع لطلب #89 — ORD-2844', time: 'منذ 15 دقيقة', color: 'emerald' },
              { title: 'نفاد مخزون', desc: 'حساب ChatGPT Plus — باقي 15 فقط', time: 'منذ 30 دقيقة', color: 'amber' },
            ].map((n, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 bg-${n.color}-400 flex-shrink-0`} />
                <div>
                  <div className="text-sm font-medium text-white">{n.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{n.desc}</div>
                  <div className="text-[10px] text-gray-600 mt-1">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Sales Chart */}
        <div className="lg:col-span-2 bg-[#131722] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              مبيعات الأسبوع
            </h3>
          </div>
          <div className="flex items-end justify-between h-48 gap-2">
            {[
              { day: 'السبت', value: 28 },
              { day: 'الأحد', value: 42 },
              { day: 'الإثنين', value: 35 },
              { day: 'الثلاثاء', value: 51 },
              { day: 'الأربعاء', value: 44 },
              { day: 'الخميس', value: 62 },
              { day: 'الجمعة', value: 34 },
            ].map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400">{d.value}</span>
                <div
                  className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-blue-600 to-purple-500"
                  style={{ height: `${d.value * 2}px` }}
                />
                <span className="text-[10px] text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#131722] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              آخر الطلبات
            </h3>
          </div>
          <div className="space-y-3">
            {(s?.latestOrders ?? []).length === 0 && (
              <div className="text-center text-gray-500 py-8 text-sm">لا توجد طلبات حتى الآن</div>
            )}
            {(s?.latestOrders ?? []).map((o: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <div>
                  <div className="text-sm font-medium text-white">{o.customer_name || 'عميل'}</div>
                  <div className="text-xs text-gray-500">{o.order_number}</div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">{o.total} ر.س</div>
                  <div className="text-[10px] text-emerald-400">{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#131722] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-400" />
              الأكثر مبيعاً
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { name: 'بطاقة PlayStation 50$', sales: 89, trend: '+12%' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.sales} مبيعة</div>
                  </div>
                </div>
                <span className="text-emerald-400 text-xs">{p.trend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Products Tab ─── */
function ProductsTab() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductRow | null>(null);
  const [form, setForm] = useState({ title: '', description: '', price: '', image_url: '', category_id: '1', in_stock: true, is_active: true });
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '', image_url: '', category_id: '1', in_stock: true, is_active: true });
  const [toast, setToast] = useState('');

  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.listProducts.useQuery({ limit: 100, search: search || undefined });

  const createMutation = trpc.createProduct.useMutation({
    onSuccess: () => { setToast('تم الإضافة!'); setShowForm(false); resetForm(); utils.listProducts.invalidate(); },
    onError: (e) => setToast(e.message),
  });
  const updateMutation = trpc.updateProduct.useMutation({
    onSuccess: () => { setToast('تم التعديل!'); setShowEdit(false); setEditProduct(null); utils.listProducts.invalidate(); },
    onError: (e) => setToast(e.message),
  });
  const toggleMutation = trpc.toggleProduct.useMutation({
    onSuccess: () => { setToast('تم التحديث!'); utils.listProducts.invalidate(); },
    onError: (e) => setToast(e.message),
  });
  const deleteMutation = trpc.deleteProduct.useMutation({
    onSuccess: () => { setToast('تم الحذف!'); utils.listProducts.invalidate(); },
    onError: (e) => setToast(e.message),
  });

  const resetForm = () => setForm({ title: '', description: '', price: '', image_url: '', category_id: '1', in_stock: true, is_active: true });

  const save = () => {
    const price = Number(form.price);
    if (!form.title || price <= 0) { setToast('عنوان وسعر مطلوبان'); return; }
    createMutation.mutate({ title: form.title, description: form.description, price, image_url: form.image_url, category_id: Number(form.category_id), in_stock: form.in_stock, is_active: form.is_active });
  };

  const startEdit = (p: ProductRow) => {
    setEditProduct(p);
    setEditForm({ title: p.title, description: p.description || '', price: String(p.price), image_url: p.image_url, category_id: String(p.category_id), in_stock: p.in_stock, is_active: p.is_active });
    setShowEdit(true);
  };

  const saveEdit = () => {
    if (!editProduct) return;
    const price = Number(editForm.price);
    if (!editForm.title || price <= 0) { setToast('عنوان وسعر مطلوبان'); return; }
    updateMutation.mutate({ id: editProduct.id, title: editForm.title, description: editForm.description, price, image_url: editForm.image_url, category_id: Number(editForm.category_id), in_stock: editForm.in_stock, is_active: editForm.is_active });
  };

  const toggleField = (id: number, field: 'is_active' | 'in_stock', current: boolean) => {
    toggleMutation.mutate({ id, field, value: !current });
  };

  const del = (id: number) => {
    if (!confirm('حذف المنتج؟')) return;
    deleteMutation.mutate({ id });
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`px-4 py-3 rounded-xl text-sm font-bold ${toast.includes('!') && !toast.includes('فشل') ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
          {toast}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          المنتجات
          <span className="bg-blue-500/20 text-blue-400 text-xs px-2.5 py-1 rounded-full">{items?.length ?? 0}</span>
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث..."
              className="bg-[#1A1F2E] border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-white text-sm w-48 focus:border-blue-500/50 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة منتج
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-gray-500 text-center py-20 text-sm">جاري التحميل...</div>
      ) : (
        <div className="bg-[#131722] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-400 text-xs">
                  <th className="px-4 py-3 text-right">المنتج</th>
                  <th className="px-4 py-3">السعر</th>
                  <th className="px-4 py-3">الحالة</th>
                  <th className="px-4 py-3">المخزون</th>
                  <th className="px-4 py-3">التصنيف</th>
                  <th className="px-4 py-3">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {(items as ProductRow[] | undefined)?.map((p) => (
                  <tr key={p.id} className={`hover:bg-white/[0.02] transition-colors ${!p.is_active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-[#1A1F2E] flex-shrink-0" loading="lazy" />
                        <div>
                          <div className="text-white font-medium text-sm">{p.title}</div>
                          <div className="text-gray-500 text-xs">#{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-emerald-400 font-bold">{p.price} ر.س</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleField(p.id, 'is_active', p.is_active)}
                        className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                          p.is_active
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-gray-500/15 text-gray-400'
                        }`}
                      >
                        {p.is_active ? 'نشط' : 'معطل'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleField(p.id, 'in_stock', p.in_stock)}
                        className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                          p.in_stock
                            ? 'bg-blue-500/15 text-blue-400'
                            : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {p.in_stock ? 'متوفر' : 'نفذ'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-400 text-xs">
                      {CATEGORIES.find((c) => c.id === p.category_id)?.name || p.category_id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => startEdit(p)} className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors" title="تعديل">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => del(p.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="حذف">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!items || items.length === 0) && (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-16">لا توجد منتجات</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showForm && <ProductModal title="إضافة منتج" form={form} setForm={setForm} onSave={save} onClose={() => setShowForm(false)} isPending={createMutation.isPending} />}
      {showEdit && editProduct && <ProductModal title="تعديل منتج" form={editForm} setForm={setEditForm} onSave={saveEdit} onClose={() => { setShowEdit(false); setEditProduct(null); }} isPending={updateMutation.isPending} />}
    </div>
  );
}

/* ─── Product Modal ─── */
function ProductModal({ title, form, setForm, onSave, onClose, isPending }: {
  title: string; form: any; setForm: any; onSave: () => void; onClose: () => void; isPending: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(form.image_url || '');
  const uploadMutation = trpc.uploadImage?.useMutation?.({
    onSuccess: (data: any) => {
      setForm({ ...form, image_url: data.url });
      setPreviewUrl(data.url);
      setUploading(false);
    },
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
      uploadMutation.mutate({
        filename: `product-${Date.now()}.${ext}`,
        base64,
        contentType: file.type || 'image/jpeg',
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#131722] rounded-2xl border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Image Upload */}
          <div>
            <label className="text-gray-400 text-xs mb-1 block">صورة المنتج</label>
            {previewUrl && (
              <img src={previewUrl} alt="" className="w-full h-32 object-cover rounded-xl mb-2 bg-[#1A1F2E]" />
            )}
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 bg-blue-600/15 text-blue-400 border border-blue-500/20 rounded-xl px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-600/25 transition-colors">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                {uploading ? 'جاري الرفع...' : 'اختر صورة'}
              </label>
            </div>
            <div className="text-center text-gray-500 text-[10px] my-1">أو</div>
            <input value={form.image_url} onChange={(e) => { setForm({ ...form, image_url: e.target.value }); setPreviewUrl(e.target.value); }} placeholder="https://..." className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-blue-500/50 focus:outline-none" dir="ltr" />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">العنوان *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="اسم المنتج" className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500/50 focus:outline-none" />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">الوصف</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="وصف المنتج" className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500/50 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">السعر *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="30" className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500/50 focus:outline-none" dir="ltr" />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">التصنيف</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500/50 focus:outline-none">
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">رابط الصورة (اختياري)</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500/50 focus:outline-none" dir="ltr" />
          </div>
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
              <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />
              متوفر
            </label>
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />
              نشط
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onSave} disabled={isPending} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            <Save className="w-4 h-4" />
            حفظ
          </button>
          <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-2.5 rounded-xl text-sm transition-colors">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Orders Tab ─── */
function OrdersTab() {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const utils = trpc.useUtils();

  const { data: orders, isLoading } = trpc.listOrders?.useQuery?.({ limit: 100 }) ?? { data: [], isLoading: false };

  const updateStatusMutation = trpc.updateOrderStatus?.useMutation?.({
    onSuccess: () => { setToast('تم تحديث الحالة!'); utils.listOrders?.invalidate?.(); },
    onError: (e: any) => setToast(e.message),
  }) ?? { isPending: false, mutate: () => {} };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/15 text-amber-400',
    processing: 'bg-blue-500/15 text-blue-400',
    completed: 'bg-emerald-500/15 text-emerald-400',
    cancelled: 'bg-red-500/15 text-red-400',
    refunded: 'bg-gray-500/15 text-gray-400',
  };

  const statusLabels: Record<string, string> = { pending: 'معلق', processing: 'قيد المعالجة', completed: 'مكتمل', cancelled: 'ملغي', refunded: 'مسترجع' };

  return (
    <div className="space-y-4">
      {toast && <div className="px-4 py-3 rounded-xl text-sm font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{toast}</div>}

      <h2 className="text-xl font-bold text-white">الطلبات</h2>

      {isLoading ? <div className="text-gray-500 text-center py-20 text-sm">جاري التحميل...</div> : (
        <div className="bg-[#131722] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-400 text-xs">
                  <th className="px-4 py-3 text-right">الطلب</th>
                  <th className="px-4 py-3">العميل</th>
                  <th className="px-4 py-3">المبلغ</th>
                  <th className="px-4 py-3">الحالة</th>
                  <th className="px-4 py-3">الدفع</th>
                  <th className="px-4 py-3">التاريخ</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {(orders as OrderRow[] | undefined)?.map((o: OrderRow) => (
                  <>
                    <tr key={o.id} className="cursor-pointer hover:bg-white/[0.02]" onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                      <td className="px-4 py-3 text-white font-bold">{o.order_number}</td>
                      <td className="px-4 py-3">
                        <div className="text-gray-300 text-sm">{o.customer_name}</div>
                        <div className="text-gray-500 text-xs">{o.customer_email}</div>
                      </td>
                      <td className="px-4 py-3 text-center text-emerald-400 font-bold">{o.total} ر.س</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-3 py-1 rounded-full font-bold ${statusColors[o.status] || statusColors.pending}`}>{statusLabels[o.status] || o.status}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-400 text-xs">{o.payment_status}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString('ar-SA')}</td>
                      <td className="px-4 py-3 text-center">
                        {expandedOrder === o.id ? <ChevronLeft className="w-4 h-4 text-gray-500 rotate-90" /> : <ChevronLeft className="w-4 h-4 text-gray-500 -rotate-90" />}
                      </td>
                    </tr>
                    {expandedOrder === o.id && (
                      <tr><td colSpan={7} className="px-4 py-4 bg-[#0B0E14]">
                        <div className="space-y-3">
                          {o.items && o.items.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-gray-400 text-xs font-bold">المنتجات:</div>
                              {o.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-gray-300 text-sm">
                                  <span>{item.product_name} × {item.quantity}</span>
                                  <span className="text-emerald-400">{item.price} ر.س</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2 pt-2 flex-wrap">
                            {Object.keys(statusLabels).map((s) => (
                              <button key={s} onClick={() => (updateStatusMutation as any).mutate?.({ id: o.id, status: s })} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${o.status === s ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{statusLabels[s]}</button>
                            ))}
                          </div>
                        </div>
                      </td></tr>
                    )}
                  </>
                ))}
                {(!orders || (orders as OrderRow[]).length === 0) && <tr><td colSpan={7} className="text-center text-gray-500 py-16">لا توجد طلبات</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Customers Tab ─── */
function CustomersTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">العملاء</h2>
      <div className="bg-[#131722] rounded-2xl border border-white/5 p-12 text-center">
        <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <div className="text-gray-400 text-sm">قريباً — إدارة العملاء</div>
      </div>
    </div>
  );
}

/* ─── Coupons Tab ─── */
function CouponsTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">الكوبونات</h2>
      <div className="bg-[#131722] rounded-2xl border border-white/5 p-12 text-center">
        <Tag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <div className="text-gray-400 text-sm">قريباً — إدارة الكوبونات</div>
      </div>
    </div>
  );
}

/* ─── Settings Tab ─── */
function SettingsTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">الإعدادات</h2>
      <div className="bg-[#131722] rounded-2xl border border-white/5 p-12 text-center">
        <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <div className="text-gray-400 text-sm">قريباً — إعدادات المتجر</div>
      </div>
    </div>
  );
}
