import { Routes, Route, useLocation } from 'react-router';
import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop';
import { LanguageProvider } from '@/hooks/useLanguage.tsx';
import { CartProvider } from '@/hooks/useCart.tsx';
import { AuthProvider } from '@/hooks/useAuth.tsx';
import { SupabaseAuthProvider } from '@/hooks/useSupabaseAuth.tsx';
import Navbar from './components/Navbar';
import AdminGuard from './components/AdminGuard';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const Payment = lazy(() => import('./pages/Payment'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Refund = lazy(() => import('./pages/Refund'));
const DeliveryPolicy = lazy(() => import('./pages/DeliveryPolicy'));
const AcceptableUsePolicy = lazy(() => import('./pages/AcceptableUsePolicy'));
const CompanyInformation = lazy(() => import('./pages/CompanyInformation'));
const MarketingServices = lazy(() => import('./pages/MarketingServices'));
const TrustSecurity = lazy(() => import('./pages/TrustSecurity'));

/* Placeholder pages for user dropdown links */
function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-16">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">الملف الشخصي</h1>
        <p className="text-gray-400">قريباً...</p>
      </div>
    </div>
  );
}
function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-16">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">طلباتي</h1>
        <p className="text-gray-400">قريباً...</p>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <LanguageProvider>
      <CartProvider>
        <SupabaseAuthProvider>
          <AuthProvider>
            <ScrollToTop />
            {!isAdminRoute && <Navbar />}
            <Suspense fallback={<div className="min-h-screen bg-[#08090d] flex items-center justify-center text-gray-500">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:category" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/delivery" element={<DeliveryPolicy />} />
              <Route path="/acceptable-use" element={<AcceptableUsePolicy />} />
              <Route path="/company" element={<CompanyInformation />} />
              <Route path="/trust-security" element={<TrustSecurity />} />
              <Route path="/marketing" element={<MarketingServices />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
            <Toaster />
          </AuthProvider>
        </SupabaseAuthProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
