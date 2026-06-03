import { Routes, Route } from 'react-router';
import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/hooks/useLanguage.tsx';
import { CartProvider } from '@/hooks/useCart.tsx';
import { AuthProvider } from '@/hooks/useAuth.tsx';
import { SupabaseAuthProvider } from '@/hooks/useSupabaseAuth.tsx';

// Eager load critical pages (small, needed immediately)
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Lazy load all other pages (code splitting)
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
const TrustSecurity = lazy(() => import('./pages/TrustSecurity'));

// Simple loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
    <div className="animate-spin w-10 h-10 border-3 border-purple-500/20 border-t-purple-500 rounded-full" />
  </div>
);

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <AuthProvider>
          <SupabaseAuthProvider>
            <Suspense fallback={<PageLoader />}>
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
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/refund" element={<Refund />} />
                <Route path="/delivery" element={<DeliveryPolicy />} />
                <Route path="/acceptable-use" element={<AcceptableUsePolicy />} />
                <Route path="/company" element={<CompanyInformation />} />
                <Route path="/trust-security" element={<TrustSecurity />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster />
          </SupabaseAuthProvider>
        </AuthProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
