import { Navigate, Routes, Route, useLocation } from "react-router";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ScrollToTop";
import { LanguageProvider } from "@/hooks/useLanguage.tsx";
import { CartProvider } from "@/hooks/useCart.tsx";
import { AuthProvider } from "@/hooks/useAuth.tsx";
import { SupabaseAuthProvider } from "@/hooks/useSupabaseAuth.tsx";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminGuard from "./components/AdminGuard";
import Seo from "./components/Seo";
import MarketingServices from "./pages/MarketingServices";

const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const Payment = lazy(() => import("./pages/Payment"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Refund = lazy(() => import("./pages/Refund"));
const DeliveryPolicy = lazy(() => import("./pages/DeliveryPolicy"));
const AcceptableUsePolicy = lazy(() => import("./pages/AcceptableUsePolicy"));
const CompanyInformation = lazy(() => import("./pages/CompanyInformation"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const TrustSecurity = lazy(() => import("./pages/TrustSecurity"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const OrdersPage = lazy(() => import("./pages/Orders"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ServicePlanDetail = lazy(() => import("./pages/ServicePlanDetail"));
const ServiceCheckout = lazy(() => import("./pages/ServiceCheckout"));

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <LanguageProvider>
      <CartProvider>
        <SupabaseAuthProvider>
          <AuthProvider>
            <ScrollToTop />
            <Seo />
            {!isAdminRoute && <Navbar />}
            <Suspense
              fallback={
                <div className="min-h-screen bg-[#08090d] flex flex-col items-center justify-center gap-5 text-slate-400">
                  <img
                    src="/images/digzoom-logo-side-new.jpg"
                    alt="DigZoom"
                    className="h-16 w-16 rounded-2xl object-cover ring-1 ring-blue-400/30"
                  />
                  <div className="h-1 w-36 overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  </div>
                  <span className="text-sm font-bold">DigZoom</span>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<MarketingServices />} />
                <Route path="/store" element={<Navigate to="/shop" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Login />} />
                <Route path="/register" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/auth/callback"
                  element={<div className="min-h-screen bg-[#08090d]" />}
                />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/payment" element={<Payment />} />
                <Route
                  path="/admin"
                  element={
                    <AdminGuard>
                      <AdminDashboard />
                    </AdminGuard>
                  }
                />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/refund" element={<Refund />} />
                <Route path="/delivery" element={<DeliveryPolicy />} />
                <Route
                  path="/acceptable-use"
                  element={<AcceptableUsePolicy />}
                />
                <Route path="/company" element={<CompanyInformation />} />
                <Route path="/trust-security" element={<TrustSecurity />} />
                <Route path="/marketing" element={<MarketingServices />} />
                <Route path="/services" element={<Navigate to="/#services" replace />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/partners" element={<Navigate to="/shop" replace />} />
                <Route path="/plans/:planId" element={<ServicePlanDetail />} />
                <Route
                  path="/service-checkout/:planId"
                  element={<ServiceCheckout />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            {!isAdminRoute && <Footer />}
            <Toaster />
          </AuthProvider>
        </SupabaseAuthProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
