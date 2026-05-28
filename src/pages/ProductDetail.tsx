import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router';
import {
  Star, ShoppingCart, Check, FileText, HardDrive, Download,
  ArrowLeft, ArrowRight, ShieldCheck, Heart, Clock, RefreshCw,
  Award, Headphones, Zap, ChevronUp, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types/database';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import ProductImage from '@/components/ProductImage';

/* ── Trust badges ── */
const trustBadges = [
  { icon: <ShieldCheck className="w-5 h-5" />, labelAr: 'دفع آمن 100%', labelEn: '100% Secure Payment' },
  { icon: <Clock className="w-5 h-5" />, labelAr: 'تحميل فوري', labelEn: 'Instant Download' },
  { icon: <RefreshCw className="w-5 h-5" />, labelAr: 'ضمان 30 يوم', labelEn: '30-Day Guarantee' },
  { icon: <Headphones className="w-5 h-5" />, labelAr: 'دعم 24/7', labelEn: '24/7 Support' },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const isRTL = lang === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  // Fetch product from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', Number(id))
        .eq('is_active', true)
        .single();

      if (!error && data) {
        setProduct(data);
        // Fetch related products (same category)
        if (data.category_id) {
          const { data: rel } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', data.category_id)
            .eq('is_active', true)
            .neq('id', data.id)
            .limit(4);
          setRelated(rel || []);
        }
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  /* Show sticky bar after scrolling past the main CTA */
  useEffect(() => {
    const onScroll = () => {
      const ctaEl = document.getElementById('product-cta-section');
      if (ctaEl) {
        const rect = ctaEl.getBoundingClientRect();
        setShowSticky(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-[#151520] border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {lang === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}
          </h2>
          <p className="text-gray-500 mb-8">
            {lang === 'ar' ? 'ربما تمت إزالة المنتج أو أن الرابط غير صحيح' : 'The product may have been removed or the link is incorrect'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3.5 rounded-xl font-medium transition-all">
              {t.shop.showAll} <Arrow className="w-4 h-4" />
            </Link>
            <Link to="/" className="inline-flex items-center justify-center gap-2 border border-white/10 text-white hover:bg-white/5 px-8 py-3.5 rounded-xl font-medium transition-all">
              {lang === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0;
  const features = (product.features as string[]) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 md:pt-24 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-blue-400 transition-colors flex-shrink-0">{t.navbar.home}</Link>
          <Arrow className="w-3 h-3 flex-shrink-0" />
          <Link to="/shop" className="hover:text-blue-400 transition-colors flex-shrink-0">{t.navbar.shop}</Link>
          <Arrow className="w-3 h-3 flex-shrink-0" />
          <span className="text-gray-300 truncate">{product.title}</span>
        </div>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mb-16">
          {/* Image */}
          <div>
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#151520] group">
              <ProductImage
                src={product.image_url}
                alt={product.title}
                className="w-full"
                aspectRatio="4/3"
              />
              {discount > 0 && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
                  {t.shop.discount} {discount}%
                </div>
              )}
              <button
                onClick={() => setLiked(!liked)}
                className={`absolute top-3 right-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${liked ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${liked ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Mobile Trust Badges */}
            <div className="grid grid-cols-2 gap-2 mt-4 lg:hidden">
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#151520] rounded-xl px-3 py-2.5 border border-white/[0.04]">
                  <span className="text-emerald-400">{badge.icon}</span>
                  <span className="text-gray-300 text-xs">{lang === 'ar' ? badge.labelAr : badge.labelEn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 leading-snug">
              {product.title}
            </h1>

            <p className="text-gray-400 leading-relaxed mb-5 md:mb-6 text-sm md:text-base">
              {product.long_description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 md:gap-3 mb-5 md:mb-6 flex-wrap">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`}
                  />
                ))}
              </div>
              <span className="text-gray-300 text-sm">{product.rating}</span>
              <span className="text-gray-600 text-xs sm:text-sm">
                ({product.reviews_count} {lang === 'ar' ? 'تقييم' : 'reviews'})
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-3 md:gap-4 mb-6 md:mb-8">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {product.price} {t.featured.currency}
              </span>
              {product.original_price && (
                <>
                  <span className="text-lg md:text-xl text-gray-600 line-through">
                    {product.original_price} {t.featured.currency}
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs md:text-sm font-medium px-3 py-1 rounded-full">
                    {t.product.save} {product.original_price - product.price} {t.featured.currency}
                  </span>
                </>
              )}
            </div>

            {/* File Info Tags */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
              <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-3 md:px-4 py-2 md:py-2.5 border border-white/[0.06]">
                <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
                <span className="text-gray-300 text-xs md:text-sm">{product.file_type}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-3 md:px-4 py-2 md:py-2.5 border border-white/[0.06]">
                <HardDrive className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400" />
                <span className="text-gray-300 text-xs md:text-sm">{product.file_size}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-3 md:px-4 py-2 md:py-2.5 border border-white/[0.06]">
                <Download className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-400" />
                <span className="text-gray-300 text-xs md:text-sm">{t.product.download}</span>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white/[0.02] rounded-2xl p-4 md:p-6 border border-white/[0.06] mb-6 md:mb-8">
              <h3 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">{t.product.features}</h3>
              <ul className="space-y-2.5 md:space-y-3">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 md:gap-3 text-gray-300 text-xs md:text-sm">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop Trust Badges */}
            <div className="hidden lg:grid grid-cols-2 gap-3 mb-6">
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-[#151520] rounded-xl px-4 py-3 border border-white/[0.04]">
                  <span className="text-emerald-400">{badge.icon}</span>
                  <span className="text-gray-300 text-sm">{lang === 'ar' ? badge.labelAr : badge.labelEn}</span>
                </div>
              ))}
            </div>

            {/* CTA Section - id for sticky detection */}
            <div id="product-cta-section" className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <button
                onClick={() => {
                  addToCart(product);
                  navigate('/cart');
                  toast.success(lang === 'ar' ? 'تمت الإضافة إلى السلة' : 'Added to cart');
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 active:scale-[0.98] text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl transition-all font-medium shadow-lg shadow-blue-500/15 text-sm md:text-base"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" /> {t.product.buyNow}
              </button>
              <button
                onClick={() => {
                  addToCart(product);
                  toast.success(lang === 'ar' ? `تمت إضافة "${product.title}" إلى السلة` : `"${product.title}" added to cart`);
                }}
                className="flex items-center justify-center gap-2 border border-white/10 text-white hover:bg-white/5 active:scale-[0.98] px-6 md:px-8 py-3.5 md:py-4 rounded-xl transition-all font-medium text-sm md:text-base"
              >
                {t.product.addToCart}
              </button>
            </div>

            {/* Guarantee */}
            <div className="flex items-center gap-2 mt-4 md:mt-5 text-gray-500 text-xs md:text-sm">
              <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>{t.product.guarantee}</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-2xl font-bold text-white">{t.product.related}</h2>
              <Link
                to="/shop"
                className="text-blue-400 hover:text-blue-300 text-xs md:text-sm flex items-center gap-1 transition-colors"
              >
                {t.shop.showAll} <Arrow className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {related.map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group bg-[#151520] rounded-xl md:rounded-2xl border border-white/[0.04] overflow-hidden hover:border-blue-500/20 transition-all"
                >
                  <ProductImage
                    src={p.image_url}
                    alt={p.title}
                    className="group-hover:scale-105 transition-transform duration-500"
                    aspectRatio="16/10"
                  />
                  <div className="p-3 md:p-4">
                    <h3 className="text-white font-medium text-xs md:text-sm group-hover:text-blue-400 transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-blue-400 font-bold text-sm md:text-base">{p.price} {t.featured.currency}</p>
                      {p.original_price && (
                        <p className="text-gray-600 text-xs line-through">{p.original_price}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky Mobile CTA Bar ── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-lg border-t border-white/[0.06] px-4 py-3 transition-transform duration-300 lg:hidden ${
          showSticky ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <div className="flex-shrink-0 hidden sm:block">
            <p className="text-white font-bold text-base">{product.price} {t.featured.currency}</p>
            {product.original_price && (
              <p className="text-gray-500 text-xs line-through">{product.original_price}</p>
            )}
          </div>
          <div className="flex-1 flex gap-2">
            <button
              onClick={() => {
                addToCart(product);
                navigate('/cart');
                toast.success(lang === 'ar' ? 'تمت الإضافة إلى السلة' : 'Added to cart');
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 active:scale-[0.97] text-white py-3 rounded-xl font-medium text-sm shadow-lg shadow-blue-500/15"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">{t.product.buyNow}</span>
              <span className="sm:hidden">{product.price} {t.featured.currency}</span>
            </button>
            <button
              onClick={() => {
                addToCart(product);
                toast.success(lang === 'ar' ? 'أُضيف للسلة' : 'Added to cart');
              }}
              className="px-4 flex items-center justify-center border border-white/10 text-white active:scale-[0.97] rounded-xl transition-all"
              title={t.product.addToCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll to top button (mobile) */}
      {showSticky && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 z-40 w-10 h-10 rounded-full bg-[#151520] border border-white/[0.08] text-gray-400 hover:text-white flex items-center justify-center transition-all lg:hidden shadow-lg"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
