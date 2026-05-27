import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { getServiceById } from '@/data/socialServices';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, ArrowRight, Users, ThumbsUp, Eye, MessageCircle,
  Share2, Bookmark, Clock, Repeat, Camera, Gift, Radio,
  Link2, Hash, Smartphone, Check, MessageSquare
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-6 h-6" />,
  ThumbsUp: <ThumbsUp className="w-6 h-6" />,
  Eye: <Eye className="w-6 h-6" />,
  MessageCircle: <MessageCircle className="w-6 h-6" />,
  Share2: <Share2 className="w-6 h-6" />,
  Bookmark: <Bookmark className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
  Repeat: <Repeat className="w-6 h-6" />,
  Camera: <Camera className="w-6 h-6" />,
  Gift: <Gift className="w-6 h-6" />,
  Radio: <Radio className="w-6 h-6" />,
};

const quickQuantities = [100, 500, 1000, 5000, 10000, 50000];

export default function SocialServiceOrder() {
  const { platformId, serviceId } = useParams<{ platformId: string; serviceId: string }>();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const [quantity, setQuantity] = useState(100);
  const [link, setLink] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const result = getServiceById(platformId || '', serviceId || '');

  const totalPrice = useMemo(() => {
    if (!result) return 0;
    return ((result.service.price / result.service.minQuantity) * quantity).toFixed(2);
  }, [result, quantity]);

  if (!result) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {isAr ? 'الخدمة غير موجودة' : 'Service Not Found'}
          </h1>
          <Link to="/social" className="text-blue-400 hover:text-blue-300 transition-colors">
            {isAr ? 'العودة' : 'Go Back'}
          </Link>
        </div>
      </div>
    );
  }

  const { platform, service } = result;

  const handleWhatsAppOrder = () => {
    const phone = '00966569888456';
    const message = isAr
      ? `طلب جديد من digzoom:%0A%0Aالمنصة: ${platform.nameAr}%0Aالخدمة: ${service.titleAr}%0Aالرابط: ${link}%0Aالكمية: ${quantity.toLocaleString()} ${service.unitAr}%0Aالسعر الإجمالي: ${totalPrice} ر.س`
      : `New order from digzoom:%0A%0APlatform: ${platform.name}%0AService: ${service.title}%0ALink: ${link}%0AQuantity: ${quantity.toLocaleString()} ${service.unit}%0ATotal: ${totalPrice} SAR`;
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-[#151520] rounded-3xl p-8 border border-green-500/20">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {isAr ? 'تم إرسال طلبك!' : 'Order Submitted!'}
          </h2>
          <p className="text-gray-400 mb-6">
            {isAr
              ? 'تم فتح واتساب مع فريق الدعم. سيتم تأكيد طلبك خلال دقائق.'
              : 'WhatsApp opened with support team. Your order will be confirmed within minutes.'}
          </p>
          <div className="bg-black/30 rounded-xl p-4 text-left mb-6 text-sm">
            <p className="text-gray-400"><span className="text-white">{isAr ? 'المنصة' : 'Platform'}:</span> {isAr ? platform.nameAr : platform.name}</p>
            <p className="text-gray-400"><span className="text-white">{isAr ? 'الخدمة' : 'Service'}:</span> {isAr ? service.titleAr : service.title}</p>
            <p className="text-gray-400"><span className="text-white">{isAr ? 'الكمية' : 'Quantity'}:</span> {quantity.toLocaleString()}</p>
            <p className="text-gray-400"><span className="text-white">{isAr ? 'السعر' : 'Price'}:</span> {totalPrice} {isAr ? 'ر.س' : 'SAR'}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => { setSubmitted(false); setLink(''); }}
              variant="outline"
              className="flex-1"
            >
              {isAr ? 'طلب جديد' : 'New Order'}
            </Button>
            <Button
              onClick={() => navigate('/social')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {isAr ? 'الخدمات' : 'Services'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back */}
        <button
          onClick={() => navigate(`/social/${platform.id}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span className="text-sm">{isAr ? 'العودة' : 'Back'}</span>
        </button>

        {/* Header */}
        <div className="bg-[#151520] rounded-3xl p-6 border border-white/5 mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: platform.color }}
            >
              {iconMap[service.icon]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isAr ? service.titleAr : service.title}
              </h1>
              <p className="text-gray-400 text-sm">
                {isAr ? platform.nameAr : platform.name} - {isAr ? service.descriptionAr : service.description}
              </p>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="bg-[#151520] rounded-3xl p-6 border border-white/5 space-y-6">
          {/* Link Input */}
          <div>
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <Link2 className="w-4 h-4 text-blue-400" />
              {isAr ? 'رابط الحساب أو البث' : 'Account or Live Stream Link'}
              <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder={isAr ? 'ضع الرابط هنا...' : 'Paste your link here...'}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
              <Smartphone className="w-3 h-3" />
              {isAr ? 'تأكد أن الحساب عام (Public)' : 'Make sure your account is Public'}
            </p>
          </div>

          {/* Quantity */}
          <div>
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <Hash className="w-4 h-4 text-blue-400" />
              {isAr ? 'الكمية' : 'Quantity'}
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {quickQuantities
                .filter((q) => q >= service.minQuantity && q <= service.maxQuantity)
                .map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      quantity === q
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {q >= 1000 ? `${(q / 1000).toFixed(0)}K` : q}
                  </button>
                ))}
            </div>
            <input
              type="number"
              min={service.minQuantity}
              max={service.maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(service.minQuantity, Math.min(service.maxQuantity, parseInt(e.target.value) || 0)))}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            <p className="text-gray-500 text-xs mt-1">
              {isAr ? `الحد الأدنى: ${service.minQuantity.toLocaleString()} - الحد الأقصى: ${service.maxQuantity.toLocaleString()}` : `Min: ${service.minQuantity.toLocaleString()} - Max: ${service.maxQuantity.toLocaleString()}`}
            </p>
          </div>

          {/* Price Summary */}
          <div className="bg-black/30 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between text-gray-400">
              <span>{isAr ? 'سعر الوحدة' : 'Unit Price'}</span>
              <span>{service.price} {isAr ? 'ر.س' : 'SAR'} / {isAr ? service.unitAr : service.unit}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>{isAr ? 'الكمية' : 'Quantity'}</span>
              <span>{quantity.toLocaleString()}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="text-white font-semibold text-lg">{isAr ? 'الإجمالي' : 'Total'}</span>
              <span className="text-green-400 font-extrabold text-2xl">{totalPrice} {isAr ? 'ر.س' : 'SAR'}</span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center gap-3 bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
            <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-blue-400 font-medium text-sm">
                {isAr ? 'وقت التنفيذ' : 'Delivery Time'}: {isAr ? service.deliveryTimeAr : service.deliveryTime}
              </p>
              <p className="text-gray-500 text-xs">
                {isAr ? 'التنفيذ يبدأ بعد تأكيد الدفع' : 'Delivery starts after payment confirmation'}
              </p>
            </div>
          </div>

          {/* Order via WhatsApp */}
          <Button
            onClick={handleWhatsAppOrder}
            disabled={!link || quantity < service.minQuantity}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 rounded-xl text-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageSquare className="w-5 h-5 ml-2" />
            {isAr ? 'اطلب عبر الواتساب' : 'Order via WhatsApp'}
          </Button>

          <p className="text-center text-gray-500 text-xs">
            {isAr ? 'الدفع عبر واتساب - فريق الدعم يرد خلال دقائق' : 'Payment via WhatsApp - Support team responds within minutes'}
          </p>
        </div>
      </div>
    </div>
  );
}
