import { Link } from 'react-router';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();
  const { featured } = useProducts();
  const displayFeatured = featured.slice(0, 4);
  const isRTL = lang === 'ar';

  const handleAdd = (product: typeof displayFeatured[0]) => {
    addToCart(product);
    const msg = isRTL ? `تمت إضافة "${product.title}" إلى السلة` : `Added "${product.title}" to cart`;
    toast.success(msg);
  };

  if (displayFeatured.length === 0) return null;

  return (
    <section className="py-20 bg-[#0f0f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">{t.featured.title}</h2>
            <p className="text-gray-400">{t.featured.subtitle}</p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            {t.featured.viewAll}
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayFeatured.map((product) => (
            <div
              key={product.id}
              className="group bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden hover:border-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5"
            >
              <Link to={`/product/${product.id}`} className="block relative">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {isRTL ? 'خصم' : 'Save'} {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </div>
                )}
              </Link>

              <div className="p-5">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {product.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-300 text-sm">{product.rating}</span>
                  <span className="text-gray-500 text-sm">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">{product.price} {t.featured.currency}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  <Button
                    size="icon"
                    onClick={() => handleAdd(product)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl w-10 h-10"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/shop" className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2">
            {t.featured.viewAll}
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
