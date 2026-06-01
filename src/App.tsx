import { Routes, Route } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/hooks/useLanguage.tsx';
import { CartProvider } from '@/hooks/useCart.tsx';
import { AuthProvider } from '@/hooks/useAuth.tsx';
import { SupabaseAuthProvider } from '@/hooks/useSupabaseAuth.tsx';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import Payment from './pages/Payment';
import AdminDashboard from './pages/AdminDashboard';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Refund from './pages/Refund';
import DeliveryPolicy from './pages/DeliveryPolicy';
import AcceptableUsePolicy from './pages/AcceptableUsePolicy';
import CompanyInformation from './pages/CompanyInformation';
import TrustSecurity from './pages/TrustSecurity';

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <AuthProvider>
          <SupabaseAuthProvider>
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
            <Toaster />
          </SupabaseAuthProvider>
        </AuthProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
