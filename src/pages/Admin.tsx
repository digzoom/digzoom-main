import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import {
  BarChart3, Users, ShoppingBag, DollarSign, TrendingUp,
  Package, Eye, Settings, LogOut,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import { getProducts } from '@/data/products';

// Mock data
const MOCK_ORDERS = [
  { id: '#ORD-001', customer: 'Mohammed A.', email: 'moh@email.com', product: 'مكتبة الكتب الرقمية', amount: 49, status: 'completed', date: '2026-05-10' },
  { id: '#ORD-002', customer: 'Sarah K.', email: 'sarah@email.com', product: 'دليل التسويق الرقمي', amount: 29, status: 'completed', date: '2026-05-11' },
  { id: '#ORD-003', customer: 'Ali H.', email: 'ali@email.com', product: 'كورس التسويق', amount: 99, status: 'pending', date: '2026-05-12' },
  { id: '#ORD-004', customer: 'Nora S.', email: 'nora@email.com', product: 'مكتبة PLR', amount: 149, status: 'completed', date: '2026-05-12' },
  { id: '#ORD-005', customer: 'Faisal M.', email: 'faisal@email.com', product: 'باقة القوالب', amount: 69, status: 'pending', date: '2026-05-13' },
  { id: '#ORD-006', customer: 'Lama R.', email: 'lama@email.com', product: 'قوالب السوشيال', amount: 35, status: 'completed', date: '2026-05-13' },
  { id: '#ORD-007', customer: 'Khaled B.', email: 'khaled@email.com', product: 'كورس إدارة المشاريع', amount: 89, status: 'completed', date: '2026-05-13' },
  { id: '#ORD-008', customer: 'Huda T.', email: 'huda@email.com', product: 'موسوعة الربح', amount: 39, status: 'pending', date: '2026-05-13' },
];

const MOCK_USERS = [
  { id: '1', name: 'Mohammed A.', email: 'moh@email.com', role: 'user', orders: 3, joined: '2026-01-15' },
  { id: '2', name: 'Sarah K.', email: 'sarah@email.com', role: 'user', orders: 5, joined: '2026-02-20' },
  { id: '3', name: 'Ali H.', email: 'ali@email.com', role: 'user', orders: 2, joined: '2026-03-10' },
  { id: '4', name: 'Nora S.', email: 'nora@email.com', role: 'user', orders: 7, joined: '2026-01-05' },
  { id: '5', name: 'Admin', email: 'admin@digzoom.com', role: 'admin', orders: 0, joined: '2025-12-01' },
];

const CHART_DATA = [
  { label: 'Jan', sales: 1200 }, { label: 'Feb', sales: 1900 },
  { label: 'Mar', sales: 1500 }, { label: 'Apr', sales: 2400 },
  { label: 'May', sales: 3200 }, { label: 'Jun', sales: 2800 },
  { label: 'Jul', sales: 4100 }, { label: 'Aug', sales: 3600 },
  { label: 'Sep', sales: 4800 }, { label: 'Oct', sales: 5200 },
  { label: 'Nov', sales: 6100 }, { label: 'Dec', sales: 7500 },
];

type Tab = 'dashboard' | 'products' | 'orders' | 'users' | 'settings';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { lang } = useLanguage();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isRTL = lang === 'ar';
  const products = getProducts(lang);

  useEffect(() => {
    if (!user) navigate('/login');
    else if (!isAdmin) navigate('/');
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) return null;

  const totalSales = MOCK_ORDERS.filter(o => o.status === 'completed').reduce((a, b) => a + b.amount, 0);
  const totalOrders = MOCK_ORDERS.length;
  const totalUsers = MOCK_USERS.length;
  const avgOrder = Math.round(totalSales / totalOrders);

  const sidebarItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'products', label: lang === 'ar' ? 'المنتجات' : 'Products', icon: <Package className="w-5 h-5" /> },
    { id: 'orders', label: lang === 'ar' ? 'الطلبات' : 'Orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'users', label: lang === 'ar' ? 'المستخدمين' : 'Users', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: lang === 'ar' ? 'الإعدادات' : 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-16 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[#151520] border-r border-white/[0.04] transition-all duration-300 fixed h-full z-30 top-16`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full py-3 flex items-center justify-center text-gray-500 hover:text-white transition-colors border-b border-white/[0.04]">
          {sidebarOpen ? (isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />) : (isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />)}
        </button>
        <div className="p-3 space-y-1">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${tab === item.id ? 'bg-blue-500/10 text-blue-400' : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'}`}>
              {item.icon}
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all mt-4">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm font-medium">{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? (isRTL ? 'mr-64' : 'ml-64') : (isRTL ? 'mr-16' : 'ml-16')} p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">
            {lang === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">{user.email}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {user.name[0]}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {tab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: lang === 'ar' ? 'إجمالي المبيعات' : 'Total Sales', value: `${totalSales} ${lang === 'ar' ? 'ر.س' : 'SAR'}`, icon: <DollarSign className="w-5 h-5 text-emerald-400" />, change: '+24%' },
                { label: lang === 'ar' ? 'الطلبات' : 'Orders', value: totalOrders.toString(), icon: <ShoppingBag className="w-5 h-5 text-blue-400" />, change: '+12%' },
                { label: lang === 'ar' ? 'المستخدمين' : 'Users', value: totalUsers.toString(), icon: <Users className="w-5 h-5 text-purple-400" />, change: '+8%' },
                { label: lang === 'ar' ? 'متوسط الطلب' : 'Avg Order', value: `${avgOrder} ${lang === 'ar' ? 'ر.س' : 'SAR'}`, icon: <TrendingUp className="w-5 h-5 text-orange-400" />, change: '+15%' },
              ].map((s, i) => (
                <div key={i} className="bg-[#151520] rounded-2xl border border-white/[0.04] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm">{s.label}</span>
                    {s.icon}
                  </div>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-emerald-400 text-xs mt-1">{s.change} {lang === 'ar' ? 'هذا الشهر' : 'this month'}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6 mb-8">
              <h3 className="text-white font-semibold mb-6">{lang === 'ar' ? 'مبيعات 2026' : '2026 Sales'}</h3>
              <div className="flex items-end gap-2 h-48">
                {CHART_DATA.map((d, i) => {
                  const max = Math.max(...CHART_DATA.map(c => c.sales));
                  const height = (d.sales / max) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-gray-600 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">{d.sales}</div>
                      <div className="w-full bg-blue-500/20 rounded-t-lg relative overflow-hidden" style={{ height: `${height}%` }}>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400/50 rounded-t-lg transition-all group-hover:from-blue-400" style={{ height: '100%' }} />
                      </div>
                      <div className="text-gray-600 text-[10px]">{d.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6">
              <h3 className="text-white font-semibold mb-4">{lang === 'ar' ? 'آخر الطلبات' : 'Recent Orders'}</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-500 text-sm border-b border-white/[0.04]">
                      <th className="text-left py-3 px-2">ID</th>
                      <th className="text-left py-3 px-2">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                      <th className="text-left py-3 px-2">{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                      <th className="text-left py-3 px-2">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                      <th className="text-left py-3 px-2">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ORDERS.slice(0, 5).map(o => (
                      <tr key={o.id} className="border-b border-white/[0.02] text-sm">
                        <td className="py-3 px-2 text-gray-400">{o.id}</td>
                        <td className="py-3 px-2 text-white">{o.customer}</td>
                        <td className="py-3 px-2 text-gray-400">{o.product}</td>
                        <td className="py-3 px-2 text-white font-medium">{o.amount} {lang === 'ar' ? 'ر.س' : 'SAR'}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${o.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6">
            <h3 className="text-white font-semibold mb-4">{lang === 'ar' ? 'المنتجات' : 'Products'} ({products.length})</h3>
            <div className="space-y-3">
              {products.map(p => (
                <div key={p.id} className="flex items-center gap-4 bg-white/[0.02] rounded-xl p-3 hover:bg-white/[0.04] transition-all">
                  <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">{p.title}</h4>
                    <p className="text-gray-500 text-xs">{p.category} · {p.fileType}</p>
                  </div>
                  <div className="text-white font-medium text-sm">{p.price} {lang === 'ar' ? 'ر.س' : 'SAR'}</div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Eye className="w-3.5 h-3.5" /> {p.reviews}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6">
            <h3 className="text-white font-semibold mb-4">{lang === 'ar' ? 'جميع الطلبات' : 'All Orders'} ({MOCK_ORDERS.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-500 text-sm border-b border-white/[0.04]">
                    <th className="text-left py-3 px-2">ID</th>
                    <th className="text-left py-3 px-2">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                    <th className="text-left py-3 px-2">{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                    <th className="text-left py-3 px-2">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                    <th className="text-left py-3 px-2">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th className="text-left py-3 px-2">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ORDERS.map(o => (
                    <tr key={o.id} className="border-b border-white/[0.02] text-sm">
                      <td className="py-3 px-2 text-gray-400">{o.id}</td>
                      <td className="py-3 px-2">
                        <div className="text-white">{o.customer}</div>
                        <div className="text-gray-600 text-xs">{o.email}</div>
                      </td>
                      <td className="py-3 px-2 text-gray-400">{o.product}</td>
                      <td className="py-3 px-2 text-white font-medium">{o.amount} {lang === 'ar' ? 'ر.س' : 'SAR'}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${o.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-500">{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6">
            <h3 className="text-white font-semibold mb-4">{lang === 'ar' ? 'المستخدمين' : 'Users'} ({MOCK_USERS.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-500 text-sm border-b border-white/[0.04]">
                    <th className="text-left py-3 px-2">{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                    <th className="text-left py-3 px-2">{lang === 'ar' ? 'البريد' : 'Email'}</th>
                    <th className="text-left py-3 px-2">{lang === 'ar' ? 'الدور' : 'Role'}</th>
                    <th className="text-left py-3 px-2">{lang === 'ar' ? 'طلبات' : 'Orders'}</th>
                    <th className="text-left py-3 px-2">{lang === 'ar' ? 'تاريخ الانضمام' : 'Joined'}</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.map(u => (
                    <tr key={u.id} className="border-b border-white/[0.02] text-sm">
                      <td className="py-3 px-2 text-white font-medium">{u.name}</td>
                      <td className="py-3 px-2 text-gray-400">{u.email}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${u.role === 'admin' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-white">{u.orders}</td>
                      <td className="py-3 px-2 text-gray-500">{u.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6">
              <h3 className="text-white font-semibold mb-4">{lang === 'ar' ? 'معلومات المتجر' : 'Store Info'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-500 text-sm mb-2">{lang === 'ar' ? 'اسم المتجر' : 'Store Name'}</label>
                  <input type="text" defaultValue="digzoom" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-2">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                  <input type="email" defaultValue="support@digzoom.com" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm" dir="ltr" />
                </div>
              </div>
            </div>

            <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6">
              <h3 className="text-white font-semibold mb-4">{lang === 'ar' ? 'Stripe' : 'Stripe'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-500 text-sm mb-2">Secret Key</label>
                  <input type="password" defaultValue="sk_test_xxxxxxxx" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm" dir="ltr" />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-2">Webhook Secret</label>
                  <input type="password" defaultValue="whsec_xxxxxxxx" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm" dir="ltr" />
                </div>
              </div>
            </div>

            <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6">
              <h3 className="text-white font-semibold mb-4">{lang === 'ar' ? 'إشعارات البريد' : 'Email Notifications'}</h3>
              <div className="space-y-3">
                {[
                  { label: lang === 'ar' ? 'إشعار طلب جديد' : 'New Order Notification', checked: true },
                  { label: lang === 'ar' ? 'إشعار تسجيل مستخدم' : 'New User Registration', checked: true },
                  { label: lang === 'ar' ? 'ملخص يومي' : 'Daily Summary', checked: false },
                ].map((item, i) => (
                  <label key={i} className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-400 text-sm">{item.label}</span>
                    <div className={`w-11 h-6 rounded-full transition-all ${item.checked ? 'bg-blue-500' : 'bg-white/10'} relative`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.checked ? (isRTL ? 'right-6' : 'left-6') : (isRTL ? 'right-1' : 'left-1')}`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
