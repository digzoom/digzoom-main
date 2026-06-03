import { Link, useNavigate } from 'react-router';
import {
  Minus, Plus, Trash2, ArrowRight, ArrowLeft, PackageOpen,
  ShoppingBag, Sparkles, Tag
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const isRTL = lang === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const tax = Math.round(totalPrice * 0.15);
  const total = totalPrice + tax;

  /* ── Empty State ── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-md mx-auto">
          {/* Animated icon area */}
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-3xl bg-[#151520] border border-white/[0.06] flex items-center justify-center mx-auto">
              <PackageOpen className="w-14 h-14 text-gray-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#151520] border border-white/[0.06] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">{t.cart.emptyTitle}</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">{t.cart.emptySubtitle}</p>

          {/* Quick categories */}
          <div className="grid grid-cols-2 gap-2 mb-8">
            {[
              { nameAr: 'جرافيكس', nameEn: 'Graphics', link: '/shop?category=graphics' },
              { nameAr: 'قوالب', nameEn: 'Templates', link: '/shop?category=templates' },
              { nameAr: 'كتب PDF', nameEn: 'PDF Books', link: '/shop?category=pdf' },
              { nameAr: 'فيديوهات', nameEn: 'Videos', link: '/shop?category=videos' },
            ].map((cat, i) => (
              <Link
                key={i}
                to={cat.link}
                className="flex items-center justify-center gap-2 bg-[#151520] hover:bg-[#1a1a28] border border-white/[0.04] hover:border-blue-500/20 text-gray-300 hover:text-white rounded-xl py-2.5 text-xs transition-all"
              >
                <Tag className="w-3 h-3" />
                {lang === 'ar' ? cat.nameAr : cat.nameEn}
              </Link>
            ))}
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3.5 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-blue-500/15"
          >
            <ShoppingBag className="w-4 h-4" /> {t.cart.btnShop} <Arrow className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 md:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">{t.cart.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-[#151520] rounded-2xl border border-white/[0.04] p-3 md:p-4 flex gap-3 md:gap-4"
              >
                <Link to={`/product/${item.id}`} className="flex-shrink-0 self-start">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-white font-semibold mb-1 text-xs md:text-sm line-clamp-2 hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-xs mb-2 md:mb-3">
                    {item.fileType} · {item.fileSize}
                  </p>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 md:gap-2 bg-white/[0.03] rounded-lg p-1 border border-white/[0.06]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
                      </button>
                      <span className="text-white font-medium w-5 md:w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className="text-base md:text-lg font-bold text-white">
                        {item.price * item.quantity} {t.cart.currency}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={clearCart}
              className="text-gray-600 hover:text-red-400 text-xs md:text-sm transition-colors flex items-center gap-2 mt-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> {t.cart.clear}
            </button>
          </div>

          {/* Summary */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-4 md:p-6 h-fit lg:sticky lg:top-24">
              <h3 className="text-white font-semibold text-base md:text-lg mb-4 md:mb-6">{t.cart.summary}</h3>
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div className="flex justify-between text-gray-400 text-xs md:text-sm">
                  <span>{t.cart.subtotal}</span>
                  <span>{totalPrice} {t.cart.currency}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs md:text-sm">
                  <span>{t.cart.tax}</span>
                  <span>{tax} {t.cart.currency}</span>
                </div>
                <div className="flex justify-between text-white font-bold border-t border-white/[0.06] pt-3 md:pt-4">
                  <span className="text-sm md:text-base">{t.cart.total}</span>
                  <span className="text-lg md:text-xl">{total} {t.cart.currency}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 active:scale-[0.98] text-white py-3.5 md:py-4 rounded-xl transition-all font-medium text-sm md:text-base shadow-lg shadow-blue-500/15"
              >
                {t.cart.btnCheckout} <Arrow className="w-4 h-4" />
              </button>
            </div>

            {/* Trust mini badges */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <Tag className="w-3.5 h-3.5" />, textAr: 'خصم 15% تلقائي', textEn: '15% Auto Discount' },
                { icon: <Sparkles className="w-3.5 h-3.5" />, textAr: 'تحميل فوري', textEn: 'Instant Download' },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-[#151520] rounded-xl px-3 py-2.5 border border-white/[0.04]"
                >
                  <span className="text-blue-400">{badge.icon}</span>
                  <span className="text-gray-400 text-xs">{lang === 'ar' ? badge.textAr : badge.textEn}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
