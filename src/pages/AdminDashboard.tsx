import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router';
import { trpc } from '@/providers/trpc';
import { Package, LayoutDashboard, Plus, X, Save, Search, ShieldCheck, Edit3, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';

type Tab = 'dash' | 'products' | 'orders';

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

export default function AdminDashboard() {
  const { lang } = useLanguage();
  const t = (ar: string, en: string) => (lang === 'ar' ? ar : en);
  const { user, loading: authLoading } = useSupabaseAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dash');

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-gray-500 text-sm">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-extrabold text-white">{t('لوحة التحكم', 'Admin')}</h1>
          <span className="text-gray-500 text-xs ml-auto">{user.email}</span>
        </div>
        <div className="flex gap-2 mb-6 flex-wrap">
          <TabButton active={tab === 'dash'} onClick={() => setTab('dash')} icon={<LayoutDashboard className="w-4 h-4" />} label={t('رئيسية', 'Dashboard')} />
          <TabButton active={tab === 'products'} onClick={() => setTab('products')} icon={<Package className="w-4 h-4" />} label={t('منتجات', 'Products')} />
          <TabButton active={tab === 'orders'} onClick={() => setTab('orders')} icon={<ShoppingBag className="w-4 h-4" />} label={t('طلبات', 'Orders')} />
        </div>
        {tab === 'dash' ? <DashTab t={t} /> : tab === 'products' ? <ProductsTab t={t} /> : <OrdersTab t={t} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${active ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
      {icon}{label}
    </button>
  );
}

/* ───── Dashboard Tab ───── */
function DashTab({ t }: { t: (ar: string, en: string) => string }) {
  const { data: products } = trpc.listProducts.useQuery({ limit: 1 });
  const { data: orders } = trpc.listOrders?.useQuery?.({ limit: 1 }) ?? {};
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard icon={<Package className="w-4 h-4" />} value={products?.length ?? 0} label={t('المنتجات', 'Products')} color="blue" />
      <StatCard icon={<ShoppingBag className="w-4 h-4" />} value={orders?.length ?? 0} label={t('الطلبات', 'Orders')} color="amber" />
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
  const bg = color === 'blue' ? 'bg-blue-500/10 text-blue-400' : color === 'amber' ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400';
  return (
    <div className="bg-[#151520] border border-white/[0.04] rounded-2xl p-5">
      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>{icon}</div>
      <div className="text-2xl font-extrabold text-white">{value}</div>
      <div className="text-gray-500 text-xs mt-1">{label}</div>
    </div>
  );
}

/* ───── Products Tab ───── */
function ProductsTab({ t }: { t: (ar: string, en: string) => string }) {
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
    onSuccess: () => { setToast(t('تم الإضافة!', 'Added!')); setShowForm(false); resetForm(); utils.listProducts.invalidate(); },
    onError: (e) => setToast(e.message),
  });

  const updateMutation = trpc.updateProduct.useMutation({
    onSuccess: () => { setToast(t('تم التعديل!', 'Updated!')); setShowEdit(false); setEditProduct(null); utils.listProducts.invalidate(); },
    onError: (e) => setToast(e.message),
  });

  const toggleMutation = trpc.toggleProduct.useMutation({
    onSuccess: () => { setToast(t('تم التحديث!', 'Updated!')); utils.listProducts.invalidate(); },
    onError: (e) => setToast(e.message),
  });

  const deleteMutation = trpc.deleteProduct.useMutation({
    onSuccess: () => { setToast(t('تم الحذف!', 'Deleted!')); utils.listProducts.invalidate(); },
    onError: (e) => setToast(e.message),
  });

  const resetForm = () => setForm({ title: '', description: '', price: '', image_url: '', category_id: '1', in_stock: true, is_active: true });

  const save = () => {
    const price = Number(form.price);
    if (!form.title || price <= 0) { setToast(t('عنوان وسعر مطلوبان', 'Title & price required')); return; }
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
    if (!editForm.title || price <= 0) { setToast(t('عنوان وسعر مطلوبان', 'Title & price required')); return; }
    updateMutation.mutate({ id: editProduct.id, title: editForm.title, description: editForm.description, price, image_url: editForm.image_url, category_id: Number(editForm.category_id), in_stock: editForm.in_stock, is_active: editForm.is_active });
  };

  const toggleField = (id: number, field: 'is_active' | 'in_stock', current: boolean) => {
    toggleMutation.mutate({ id, field, value: !current });
  };

  const del = (id: number) => {
    if (!confirm(t('حذف المنتج؟', 'Delete product?'))) return;
    deleteMutation.mutate({ id });
  };

  const isMutating = createMutation.isPending || updateMutation.isPending || toggleMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-4">
      {toast && <div className={`px-4 py-2 rounded-xl text-sm font-bold ${toast.includes('!') ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{toast}</div>}

      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <span className="text-white font-bold flex items-center gap-2">
          {t('المنتجات', 'Products')}
          <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full">{items?.length ?? 0}</span>
          {isMutating && <span className="text-amber-400 text-[10px]">{t('جاري...', 'Working...')}</span>}
        </span>
        <div className="flex gap-2">
          <div className="relative"><Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('بحث...', 'Search...')} className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-white text-xs w-40" />
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold"><Plus className="w-3.5 h-3.5" />{t('إضافة', 'Add')}</button>
        </div>
      </div>

      {isLoading ? <div className="text-gray-500 text-center py-20 text-sm">{t('جاري التحميل...', 'Loading...')}</div> : (
        <div className="bg-[#151520] rounded-2xl border border-white/5 overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-white/5 text-gray-400"><th className="px-3 py-2.5 text-left">{t('منتج', 'Product')}</th><th className="px-3 py-2.5">{t('سعر', 'Price')}</th><th className="px-3 py-2.5">{t('حالة', 'Status')}</th><th className="px-3 py-2.5">{t('مخزون', 'Stock')}</th><th className="px-3 py-2.5">{t('إجراء', 'Action')}</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {(items as ProductRow[] | undefined)?.map((p: ProductRow) => (
                <tr key={p.id} className={!p.is_active ? 'opacity-40' : ''}>
                  <td className="px-3 py-2"><div className="flex items-center gap-2"><img src={p.image_url} alt="" className="w-8 h-8 rounded object-cover bg-gray-800 flex-shrink-0" loading="lazy" /><span className="text-white line-clamp-1 max-w-[200px]">{p.title}</span></div></td>
                  <td className="px-3 py-2 text-center text-green-400 font-bold">{p.price}</td>
                  <td className="px-3 py-2 text-center"><button onClick={() => toggleField(p.id, 'is_active', p.is_active)} className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${p.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>{p.is_active ? 'Active' : 'Off'}</button></td>
                  <td className="px-3 py-2 text-center"><button onClick={() => toggleField(p.id, 'in_stock', p.in_stock)} className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${p.in_stock ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>{p.in_stock ? 'In' : 'Out'}</button></td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1 justify-center">
                      <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400" title="Edit"><Edit3 className="w-3 h-3" /></button>
                      <button onClick={() => del(p.id)} className="p-1.5 rounded-lg bg-red-500/20 text-red-400" title="Delete"><X className="w-3 h-3" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!items || items.length === 0) && <tr><td colSpan={5} className="text-center text-gray-500 py-10">{t('لا توجد منتجات', 'No products')}</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {showForm && <ProductModal title={t('إضافة منتج', 'Add Product')} form={form} setForm={setForm} onSave={save} onClose={() => setShowForm(false)} isPending={createMutation.isPending} t={t} />}

      {/* Edit Product Modal */}
      {showEdit && editProduct && <ProductModal title={t('تعديل منتج', 'Edit Product')} form={editForm} setForm={setEditForm} onSave={saveEdit} onClose={() => { setShowEdit(false); setEditProduct(null); }} isPending={updateMutation.isPending} t={t} />}
    </div>
  );
}

function ProductModal({ title, form, setForm, onSave, onClose, isPending, t }: {
  title: string; form: any; setForm: any; onSave: () => void; onClose: () => void; isPending: boolean; t: (ar: string, en: string) => string;
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#151520] rounded-2xl border border-white/10 p-5 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between mb-4"><h3 className="text-white font-bold">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button></div>
        <div className="space-y-2.5">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={t('العنوان', 'Title') + ' *'} className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-blue-500 outline-none" />
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder={t('الوصف', 'Description')} className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-blue-500 outline-none" />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder={t('السعر', 'Price') + ' *'} className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-blue-500 outline-none" />
            <input type="number" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} placeholder={t('التصنيف', 'Category')} className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-blue-500 outline-none" />
          </div>
          <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL" className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-blue-500 outline-none" dir="ltr" />
          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-1.5 text-gray-300 text-xs cursor-pointer"><input type="checkbox" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} className="accent-blue-600" />{t('متوفر', 'In Stock')}</label>
            <label className="flex items-center gap-1.5 text-gray-300 text-xs cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="accent-blue-600" />{t('نشط', 'Active')}</label>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onSave} disabled={isPending} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1"><Save className="w-4 h-4" />{t('حفظ', 'Save')}</button>
          <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-2 rounded-xl text-sm transition-colors">{t('إلغاء', 'Cancel')}</button>
        </div>
      </div>
    </div>
  );
}

/* ───── Orders Tab ───── */
function OrdersTab({ t }: { t: (ar: string, en: string) => string }) {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const utils = trpc.useUtils();

  const { data: orders, isLoading } = trpc.listOrders?.useQuery?.({ limit: 100 }) ?? { data: [], isLoading: false };

  const updateStatusMutation = trpc.updateOrderStatus?.useMutation?.({
    onSuccess: () => { setToast(t('تم تحديث الحالة!', 'Status updated!')); utils.listOrders?.invalidate?.(); },
    onError: (e: any) => setToast(e.message),
  }) ?? { isPending: false, mutate: () => {} };

  const toggleExpand = (id: number) => setExpandedOrder(expandedOrder === id ? null : id);

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/20 text-amber-400',
    processing: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
    refunded: 'bg-gray-500/20 text-gray-400',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pending', processing: 'Processing', completed: 'Completed', cancelled: 'Cancelled', refunded: 'Refunded',
  };

  const paymentColors: Record<string, string> = {
    pending: 'bg-amber-500/20 text-amber-400',
    paid: 'bg-emerald-500/20 text-emerald-400',
    failed: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="space-y-4">
      {toast && <div className="px-4 py-2 rounded-xl text-sm font-bold bg-green-600 text-white">{toast}</div>}

      <div className="flex justify-between">
        <span className="text-white font-bold flex items-center gap-2">
          {t('الطلبات', 'Orders')}
          <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded-full">{(orders as OrderRow[] | undefined)?.length ?? 0}</span>
        </span>
      </div>

      {isLoading ? <div className="text-gray-500 text-center py-20 text-sm">{t('جاري التحميل...', 'Loading...')}</div> : (
        <div className="bg-[#151520] rounded-2xl border border-white/5 overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-white/5 text-gray-400"><th className="px-3 py-2.5 text-left">{t('رقم', '#')}</th><th className="px-3 py-2.5">{t('عميل', 'Customer')}</th><th className="px-3 py-2.5">{t('المبلغ', 'Total')}</th><th className="px-3 py-2.5">{t('الحالة', 'Status')}</th><th className="px-3 py-2.5">{t('الدفع', 'Payment')}</th><th className="px-3 py-2.5">{t('تاريخ', 'Date')}</th><th className="px-3 py-2.5"></th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {(orders as OrderRow[] | undefined)?.map((o: OrderRow) => (
                <>
                  <tr key={o.id} className="cursor-pointer hover:bg-white/[0.02]" onClick={() => toggleExpand(o.id)}>
                    <td className="px-3 py-2 text-white font-bold">{o.order_number}</td>
                    <td className="px-3 py-2 text-gray-300">{o.customer_name}<div className="text-gray-500 text-[9px]">{o.customer_email}</div></td>
                    <td className="px-3 py-2 text-center text-green-400 font-bold">{o.total}</td>
                    <td className="px-3 py-2 text-center"><span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${statusColors[o.status] || statusColors.pending}`}>{statusLabels[o.status] || o.status}</span></td>
                    <td className="px-3 py-2 text-center"><span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${paymentColors[o.payment_status] || paymentColors.pending}`}>{o.payment_status}</span></td>
                    <td className="px-3 py-2 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{expandedOrder === o.id ? <ChevronUp className="w-3 h-3 text-gray-500" /> : <ChevronDown className="w-3 h-3 text-gray-500" />}</td>
                  </tr>
                  {expandedOrder === o.id && (
                    <tr><td colSpan={7} className="px-3 py-3 bg-black/20">
                      <div className="space-y-2">
                        {o.items && o.items.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-gray-400 text-[10px] font-bold mb-1">{t('المنتجات', 'Items')}:</div>
                            {o.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-gray-300 text-[10px]"><span>{item.product_name} x{item.quantity}</span><span className="text-green-400">{item.price}</span></div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          {['pending', 'processing', 'completed', 'cancelled'].map(s => (
                            <button key={s} onClick={() => (updateStatusMutation as any).mutate?.({ id: o.id, status: s })} className={`text-[9px] px-2 py-1 rounded-lg font-bold ${o.status === s ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{statusLabels[s]}</button>
                          ))}
                        </div>
                      </div>
                    </td></tr>
                  )}
                </>
              ))}
              {(!orders || (orders as OrderRow[]).length === 0) && <tr><td colSpan={7} className="text-center text-gray-500 py-10">{t('لا توجد طلبات', 'No orders')}</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
