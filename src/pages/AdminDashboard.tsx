import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router';
import { trpc } from '@/providers/trpc';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag,
  Receipt, BarChart3, Bell, ClipboardList, Settings,
  Plus, Search, Edit3, Trash2, X, Save, ChevronLeft,
  TrendingUp, DollarSign, ShoppingCart, UserPlus,
  LogOut, Upload, Image, Activity
} from 'lucide-react';

type Tab = 'dash' | 'products' | 'orders' | 'customers' | 'coupons' | 'settings';

const SIDEBAR_ITEMS: Array<{ key: Tab; label: string; icon: React.ReactNode }> = [
  { key: 'dash', label: 'الرئيسية', icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: 'products', label: 'المنتجات', icon: <Package className="w-5 h-5" /> },
  { key: 'orders', label: 'الطلبات', icon: <ShoppingBag className="w-5 h-5" /> },
  { key: 'customers', label: 'العملاء', icon: <Users className="w-5 h-5" /> },
  { key: 'coupons', label: 'الكوبونات', icon: <Tag className="w-5 h-5" /> },
  { key: 'settings', label: 'الإعدادات', icon: <Settings className="w-5 h-5" /> },
];

const CATEGORIES = [
  { id: 1, name: 'جرافيكس' }, { id: 2, name: 'خطوط' },
  { id: 3, name: 'قوالب' }, { id: 4, name: 'فيديوهات' },
  { id: 5, name: 'كتب إلكترونية' }, { id: 6, name: 'صوتيات' },
  { id: 7, name: 'أكواد' }, { id: 8, name: 'تصميم ويب' },
  { id: 9, name: 'نماذج 3D' }, { id: 10, name: 'صور' },
];

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dash');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [user, authLoading, navigate]);

  if (authLoading) return <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center text-gray-500">جاري التحميل...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white" dir="rtl">
      <aside className={`fixed top-0 right-0 h-full bg-[#131722] border-l border-white/5 z-50 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <span className="text-lg font-bold bg-gradient-to-l from-blue-400 to-purple-400 bg-clip-text text-transparent">digzoom</span>
        </div>
        <nav className="p-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === item.key ? 'bg-blue-600/15 text-blue-400 border-r-2 border-blue-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {item.icon}<span className="flex-1 text-right">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5">
          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" /><span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <main className={`transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-0'}`}>
        <header className="h-16 bg-[#131722]/80 backdrop-blur-xl border-b border-white/5 flex items-center px-6 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-4 p-2 rounded-lg hover:bg-white/5 text-gray-400">
            <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">لوحة التحكم</span><span className="text-gray-600">/</span>
            <span className="text-white font-medium">{SIDEBAR_ITEMS.find((i) => i.key === tab)?.label}</span>
          </div>
          <div className="mr-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">A</div>
              <span className="text-sm text-gray-300 hidden md:block">{user.email}</span>
            </div>
          </div>
        </header>

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

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = { blue: 'from-blue-500/20 to-blue-600/5', purple: 'from-purple-500/20 to-purple-600/5', amber: 'from-amber-500/20 to-amber-600/5', emerald: 'from-emerald-500/20 to-emerald-600/5' };
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border border-white/5 rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3"><div className={`p-2 rounded-lg bg-${color}-500/20`}>{icon}</div></div>
      <div className="text-2xl font-extrabold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-xs">{label}</div>
    </div>
  );
}

/* ─── Dashboard ─── */
function DashTab() {
  const { data: stats, isLoading } = trpc.getStats?.useQuery?.() ?? {};
  const s = stats as any;

  if (isLoading) return <div className="text-gray-500 text-center py-20">جاري تحميل الإحصائيات...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Package className="w-5 h-5 text-blue-400" />} label="المنتجات" value={String(s?.productCount ?? 0)} color="blue" />
        <StatCard icon={<ShoppingCart className="w-5 h-5 text-amber-400" />} label="الطلبات" value={String(s?.orderCount ?? 0)} color="amber" />
        <StatCard icon={<DollarSign className="w-5 h-5 text-purple-400" />} label="إجمالي المبيعات" value={`${s?.totalSales?.toLocaleString?.() ?? 0} ر.س`} color="purple" />
        <StatCard icon={<Users className="w-5 h-5 text-emerald-400" />} label="العملاء" value={String(s?.customerCount ?? 0)} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Products */}
        <div className="bg-[#131722] border border-white/5 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-blue-400" />آخر المنتجات المضافة</h3>
          <div className="space-y-3">
            {(s?.latestProducts ?? []).length === 0 && <div className="text-center text-gray-500 py-8">لا توجد منتجات</div>}
            {(s?.latestProducts ?? []).map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                  <div><div className="text-sm font-medium text-white">{p.title}</div><div className="text-xs text-gray-500">{p.price} ر.س</div></div>
                </div>
                <span className="text-gray-500 text-xs">{new Date(p.created_at).toLocaleDateString('ar-SA')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Orders */}
        <div className="bg-[#131722] border border-white/5 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Receipt className="w-4 h-4 text-emerald-400" />آخر الطلبات</h3>
          <div className="space-y-3">
            {(s?.latestOrders ?? []).length === 0 && <div className="text-center text-gray-500 py-8">لا توجد طلبات</div>}
            {(s?.latestOrders ?? []).map((o: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <div><div className="text-sm font-medium text-white">{o.customer_name || 'عميل'}</div><div className="text-xs text-gray-500">{o.order_number}</div></div>
                <div className="text-left"><div className="text-sm font-bold text-white">{o.total} ر.س</div><div className="text-[10px] text-emerald-400">{o.status}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="bg-[#131722] border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-amber-400" />آخر عمليات الأدمن</h3>
        <div className="space-y-2">
          {(s?.latestActivity ?? []).length === 0 && <div className="text-center text-gray-500 py-8">لا توجد عمليات مسجلة</div>}
          {(s?.latestActivity ?? []).map((a: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div>
                  <span className="text-white font-medium">{a.admin_email}</span>
                  <span className="text-gray-500 mx-2">{a.action === 'create_product' ? 'أضاف' : a.action === 'update_product' ? 'عدّل' : a.action === 'delete_product' ? 'حذف' : a.action}</span>
                  <span className="text-blue-400">{a.product_title}</span>
                </div>
              </div>
              <span className="text-gray-500 text-xs">{new Date(a.created_at).toLocaleDateString('ar-SA')}</span>
            </div>
          ))}
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
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', price: '', original_price: '', discount_percent: '0', is_on_sale: false, image_url: '', category_id: '1', in_stock: true, is_active: true });
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '', original_price: '', discount_percent: '0', is_on_sale: false, image_url: '', category_id: '1', in_stock: true, is_active: true });
  const [toast, setToast] = useState('');

  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.listProducts.useQuery({ limit: 100, search: search || undefined });

  const createMutation = trpc.createProduct.useMutation({
    onSuccess: () => { setToast('تم الإضافة!'); setShowForm(false); resetForm(); utils.listProducts.invalidate(); utils.getStats?.invalidate?.(); },
    onError: (e) => setToast(e.message),
  });
  const updateMutation = trpc.updateProduct.useMutation({
    onSuccess: () => { setToast('تم التعديل!'); setShowEdit(false); setEditProduct(null); utils.listProducts.invalidate(); utils.getStats?.invalidate?.(); },
    onError: (e) => setToast(e.message),
  });
  const toggleMutation = trpc.toggleProduct.useMutation({
    onSuccess: () => { setToast('تم التحديث!'); utils.listProducts.invalidate(); },
    onError: (e) => setToast(e.message),
  });
  const deleteMutation = trpc.deleteProduct.useMutation({
    onSuccess: () => { setToast('تم الحذف!'); utils.listProducts.invalidate(); utils.getStats?.invalidate?.(); },
    onError: (e) => setToast(e.message),
  });

  const resetForm = () => setForm({ title: '', description: '', price: '', original_price: '', discount_percent: '0', is_on_sale: false, image_url: '', category_id: '1', in_stock: true, is_active: true });

  const save = () => {
    const price = Number(form.price);
    if (!form.title || price <= 0) { setToast('عنوان وسعر مطلوبان'); return; }
    createMutation.mutate({
      title: form.title, description: form.description, price,
      original_price: form.original_price ? Number(form.original_price) : undefined,
      discount_percent: Number(form.discount_percent) || 0,
      is_on_sale: form.is_on_sale,
      image_url: form.image_url, category_id: Number(form.category_id),
      in_stock: form.in_stock, is_active: form.is_active,
    });
  };

  const startEdit = (p: any) => {
    setEditProduct(p);
    setEditForm({ title: p.title, description: p.description || '', price: String(p.price), original_price: String(p.original_price || p.price), discount_percent: String(p.discount_percent || 0), is_on_sale: p.is_on_sale || false, image_url: p.image_url, category_id: String(p.category_id), in_stock: p.in_stock, is_active: p.is_active });
    setShowEdit(true);
  };

  const saveEdit = () => {
    if (!editProduct) return;
    const price = Number(editForm.price);
    if (!editForm.title || price <= 0) { setToast('عنوان وسعر مطلوبان'); return; }
    updateMutation.mutate({
      id: editProduct.id, title: editForm.title, description: editForm.description, price,
      original_price: editForm.original_price ? Number(editForm.original_price) : undefined,
      discount_percent: Number(editForm.discount_percent) || 0,
      is_on_sale: editForm.is_on_sale,
      image_url: editForm.image_url, category_id: Number(editForm.category_id),
      in_stock: editForm.in_stock, is_active: editForm.is_active,
    });
  };

  const toggleField = (id: number, field: 'is_active' | 'in_stock', current: boolean) => { toggleMutation.mutate({ id, field, value: !current }); };
  const del = (id: number) => { if (!confirm('حذف المنتج؟')) return; deleteMutation.mutate({ id }); };

  return (
    <div className="space-y-4">
      {toast && <div className={`px-4 py-3 rounded-xl text-sm font-bold ${toast.includes('فشل') ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'}`}>{toast}</div>}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">المنتجات<span className="bg-blue-500/20 text-blue-400 text-xs px-2.5 py-1 rounded-full">{items?.length ?? 0}</span></h2>
        <div className="flex gap-2">
          <div className="relative"><Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className="bg-[#1A1F2E] border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-white text-sm w-48 focus:border-blue-500/50 focus:outline-none" />
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"><Plus className="w-4 h-4" />إضافة منتج</button>
        </div>
      </div>

      {isLoading ? <div className="text-gray-500 text-center py-20 text-sm">جاري التحميل...</div> : (
        <div className="bg-[#131722] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5 text-gray-400 text-xs">
                <th className="px-4 py-3 text-right">المنتج</th><th className="px-4 py-3">السعر</th><th className="px-4 py-3">الخصم</th><th className="px-4 py-3">الحالة</th><th className="px-4 py-3">المخزون</th><th className="px-4 py-3">الإجراء</th>
              </tr></thead>
              <tbody className="divide-y divide-white/[0.03]">
                {(items as any[] | undefined)?.map((p: any) => (
                  <tr key={p.id} className={`hover:bg-white/[0.02] transition-colors ${!p.is_active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-[#1A1F2E] flex-shrink-0" style={{ objectFit: 'cover', aspectRatio: '1/1' }} loading="lazy" />
                        <div><div className="text-white font-medium text-sm">{p.title}</div><div className="text-xs text-gray-500">#{p.id} · {CATEGORIES.find(c => c.id === p.category_id)?.name}</div></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.is_on_sale && p.original_price > p.price ? (
                        <div><div className="text-emerald-400 font-bold">{p.price} ر.س</div><div className="text-gray-500 text-xs line-through">{p.original_price} ر.س</div></div>
                      ) : (
                        <span className="text-emerald-400 font-bold">{p.price} ر.س</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">{p.is_on_sale && p.discount_percent > 0 ? <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full font-bold">-{p.discount_percent}%</span> : <span className="text-gray-600">-</span>}</td>
                    <td className="px-4 py-3 text-center"><button onClick={() => toggleField(p.id, 'is_active', p.is_active)} className={`text-xs px-3 py-1 rounded-full font-bold ${p.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-500/15 text-gray-400'}`}>{p.is_active ? 'نشط' : 'معطل'}</button></td>
                    <td className="px-4 py-3 text-center"><button onClick={() => toggleField(p.id, 'in_stock', p.in_stock)} className={`text-xs px-3 py-1 rounded-full font-bold ${p.in_stock ? 'bg-blue-500/15 text-blue-400' : 'bg-red-500/15 text-red-400'}`}>{p.in_stock ? 'متوفر' : 'نفذ'}</button></td>
                    <td className="px-4 py-3"><div className="flex gap-1 justify-center"><button onClick={() => startEdit(p)} className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" title="تعديل"><Edit3 className="w-3.5 h-3.5" /></button><button onClick={() => del(p.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20" title="حذف"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                  </tr>
                ))}
                {(!items || items.length === 0) && <tr><td colSpan={6} className="text-center text-gray-500 py-16">لا توجد منتجات</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && <ProductModal title="إضافة منتج" form={form} setForm={setForm} onSave={save} onClose={() => setShowForm(false)} isPending={createMutation.isPending} />}
      {showEdit && editProduct && <ProductModal title="تعديل منتج" form={editForm} setForm={setEditForm} onSave={saveEdit} onClose={() => { setShowEdit(false); setEditProduct(null); }} isPending={updateMutation.isPending} />}
    </div>
  );
}

/* ─── Product Modal with Upload ─── */
function ProductModal({ title, form, setForm, onSave, onClose, isPending }: {
  title: string; form: any; setForm: any; onSave: () => void; onClose: () => void; isPending: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(form.image_url || '');
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
            <label className="text-gray-400 text-xs mb-1 block">صورة المنتج</label>
            {previewUrl && <img src={previewUrl} alt="" className="w-full h-40 object-cover rounded-xl mb-2 bg-[#1A1F2E]" style={{ objectFit: 'cover', aspectRatio: '16/9' }} />}
            <label className="flex items-center justify-center gap-2 bg-blue-600/15 text-blue-400 border border-blue-500/20 rounded-xl px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-600/25 transition-colors">
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              {uploading ? 'جاري الرفع...' : 'اختر صورة من الجهاز'}
            </label>
            <div className="text-center text-gray-500 text-[10px] my-1">أو</div>
            <input value={form.image_url} onChange={(e) => { setForm({ ...form, image_url: e.target.value }); setPreviewUrl(e.target.value); }} placeholder="رابط الصورة https://..." className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-blue-500/50 focus:outline-none" dir="ltr" />
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
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Pricing & Discount */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">السعر الأصلي</label>
              <input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} placeholder="50" className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500/50 focus:outline-none" dir="ltr" />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">نسبة الخصم %</label>
              <input type="number" min="0" max="100" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} placeholder="0" className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500/50 focus:outline-none" dir="ltr" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_on_sale} onChange={(e) => setForm({ ...form, is_on_sale: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />
                عرض خصم
              </label>
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer"><input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />متوفر</label>
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />نشط</label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onSave} disabled={isPending} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"><Save className="w-4 h-4" />حفظ</button>
          <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-2.5 rounded-xl text-sm transition-colors">إلغاء</button>
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

  const statusColors: Record<string, string> = { pending: 'bg-amber-500/15 text-amber-400', processing: 'bg-blue-500/15 text-blue-400', completed: 'bg-emerald-500/15 text-emerald-400', cancelled: 'bg-red-500/15 text-red-400', refunded: 'bg-gray-500/15 text-gray-400' };
  const statusLabels: Record<string, string> = { pending: 'معلق', processing: 'قيد المعالجة', completed: 'مكتمل', cancelled: 'ملغي', refunded: 'مسترجع' };

  return (
    <div className="space-y-4">
      {toast && <div className="px-4 py-3 rounded-xl text-sm font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{toast}</div>}
      <h2 className="text-xl font-bold text-white">الطلبات</h2>
      {isLoading ? <div className="text-gray-500 text-center py-20 text-sm">جاري التحميل...</div> : (
        <div className="bg-[#131722] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5 text-gray-400 text-xs">
                <th className="px-4 py-3 text-right">الطلب</th><th className="px-4 py-3">العميل</th><th className="px-4 py-3">المبلغ</th><th className="px-4 py-3">الحالة</th><th className="px-4 py-3">الدفع</th><th className="px-4 py-3">التاريخ</th><th className="px-4 py-3"></th>
              </tr></thead>
              <tbody className="divide-y divide-white/[0.03]">
                {(orders as any[] | undefined)?.map((o: any) => (
                  <>
                    <tr key={o.id} className="cursor-pointer hover:bg-white/[0.02]" onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                      <td className="px-4 py-3 text-white font-bold">{o.order_number}</td>
                      <td className="px-4 py-3"><div className="text-gray-300 text-sm">{o.customer_name}</div><div className="text-gray-500 text-xs">{o.customer_email}</div></td>
                      <td className="px-4 py-3 text-center text-emerald-400 font-bold">{o.total} ر.س</td>
                      <td className="px-4 py-3 text-center"><span className={`text-xs px-3 py-1 rounded-full font-bold ${statusColors[o.status] || statusColors.pending}`}>{statusLabels[o.status] || o.status}</span></td>
                      <td className="px-4 py-3 text-center text-gray-400 text-xs">{o.payment_status}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString('ar-SA')}</td>
                      <td className="px-4 py-3 text-center text-gray-500">{expandedOrder === o.id ? '▼' : '◀'}</td>
                    </tr>
                    {expandedOrder === o.id && (
                      <tr><td colSpan={7} className="px-4 py-4 bg-[#0B0E14]">
                        <div className="space-y-3">
                          {o.items && o.items.length > 0 && <div className="space-y-2"><div className="text-gray-400 text-xs font-bold">المنتجات:</div>{o.items.map((item: any, i: number) => (<div key={i} className="flex justify-between text-gray-300 text-sm"><span>{item.product_name} × {item.quantity}</span><span className="text-emerald-400">{item.price} ر.س</span></div>))}</div>}
                          <div className="flex gap-2 pt-2 flex-wrap">{Object.keys(statusLabels).map((s) => (<button key={s} onClick={() => (updateStatusMutation as any).mutate?.({ id: o.id, status: s })} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${o.status === s ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{statusLabels[s]}</button>))}</div>
                        </div>
                      </td></tr>
                    )}
                  </>
                ))}
                {(!orders || orders.length === 0) && <tr><td colSpan={7} className="text-center text-gray-500 py-16">لا توجد طلبات</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Placeholder Tabs ─── */
function CustomersTab() { return <div className="space-y-4"><h2 className="text-xl font-bold text-white">العملاء</h2><div className="bg-[#131722] rounded-2xl border border-white/5 p-12 text-center"><Users className="w-12 h-12 text-gray-600 mx-auto mb-4" /><div className="text-gray-400 text-sm">قريباً — إدارة العملاء</div></div></div>; }
function CouponsTab() { return <div className="space-y-4"><h2 className="text-xl font-bold text-white">الكوبونات</h2><div className="bg-[#131722] rounded-2xl border border-white/5 p-12 text-center"><Tag className="w-12 h-12 text-gray-600 mx-auto mb-4" /><div className="text-gray-400 text-sm">قريباً — إدارة الكوبونات</div></div></div>; }
function SettingsTab() { return <div className="space-y-4"><h2 className="text-xl font-bold text-white">الإعدادات</h2><div className="bg-[#131722] rounded-2xl border border-white/5 p-12 text-center"><Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" /><div className="text-gray-400 text-sm">قريباً — إعدادات المتجر</div></div></div>; }
