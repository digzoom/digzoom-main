import { X, Clock, Tag, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useSmartCoupons } from '@/hooks/useSmartCoupons';

export default function CouponPopup() {
  const { activeCoupon, showPopup, timeLeft, formatTime, closePopup } = useSmartCoupons();
  const [copied, setCopied] = useState(false);

  if (!showPopup || !activeCoupon) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCoupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-gradient-to-br from-[#1a1030] to-[#0f0a1a] border border-orange-500/30 rounded-2xl p-8 max-w-md mx-4 shadow-2xl shadow-orange-500/10 animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        {/* Timer badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 animate-pulse">
          <Clock className="w-3.5 h-3.5" />
          {formatTime(timeLeft)}
        </div>

        {/* Header */}
        <div className="text-center mt-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25">
            <Tag className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-extrabold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent mb-2">
            {activeCoupon.title}
          </h3>
          <p className="text-gray-400 text-sm">{activeCoupon.description}</p>
        </div>

        {/* Coupon code */}
        <div className="mt-6 bg-black/30 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-gray-500 text-xs mb-1">انسخ الكود واستخدمه عند الدفع</p>
          <div className="flex items-center gap-3 justify-center">
            <code className="text-2xl font-bold text-orange-400 tracking-wider">{activeCoupon.code}</code>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'تم النسخ!' : 'نسخ'}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / (activeCoupon.expiryMinutes * 60)) * 100}%` }}
          />
        </div>

        {/* Urgency text */}
        <p className="text-center text-red-400 text-xs mt-3 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" />
          العرض ينتهي خلال {formatTime(timeLeft)} - لا تفوّت الفرصة!
        </p>

        {/* CTA */}
        <button
          onClick={() => { window.location.href = '/#/shop'; closePopup(); }}
          className="w-full mt-5 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          تسوق الآن واستخدم الكود 🛒
        </button>
      </div>
    </div>
  );
}
