import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router';
import './index.css';
import './i18n/i18n';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { CartProvider } from './hooks/useCart';
import StoreNavigation from './components/StoreNavigation';
import { StorefrontView } from './pages/DigitalHubHome';

function Review() {
  const ar = useLanguage().lang === 'ar';
  return <><StoreNavigation user={null} isAdmin={false} logout={async () => {}} /><Routes>
    <Route path="/" element={<><StorefrontView products={[]} categories={[]} loading={false}/><p className="bg-slate-100 p-4 text-center text-sm text-slate-700">{ar ? 'معاينة تصميم فقط — المنتجات الحية والدفع غير متصلين.' : 'Design preview only — live catalog and checkout are disconnected.'}</p></>} />
    <Route path="*" element={<main className="min-h-screen bg-white px-6 pt-40 text-center text-slate-900"><h1 className="text-2xl font-bold">{ar ? 'معاينة تصميم الصفحة الرئيسية' : 'Homepage design preview'}</h1><p className="my-4">{ar ? 'هذا المسار غير متصل بالمتجر الفعلي في المعاينة.' : 'This route is not connected to the live store in this preview.'}</p><Link to="/" className="text-blue-700 underline">{ar ? 'العودة إلى التصميم' : 'Back to the design'}</Link></main>} />
  </Routes></>;
}

createRoot(document.getElementById('root')!).render(<BrowserRouter><LanguageProvider><CartProvider><Review /></CartProvider></LanguageProvider></BrowserRouter>);
