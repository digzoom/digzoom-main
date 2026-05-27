import { useParams, Link, useNavigate } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { getPlatformById } from '@/data/socialServices';
import {
  ChevronLeft, ChevronRight, Users, ThumbsUp, Eye, MessageCircle,
  Share2, Bookmark, Clock, Repeat, Camera, Gift, Radio,
  ArrowLeft, ArrowRight, Zap, Shield, Check
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

const platformGradients: Record<string, string> = {
  tiktok: 'from-gray-900 to-black',
  instagram: 'from-pink-900/40 to-purple-900/20',
  youtube: 'from-red-900/40 to-red-900/10',
  twitter: 'from-gray-800 to-black',
  snapchat: 'from-yellow-900/40 to-yellow-900/10',
  facebook: 'from-blue-900/40 to-blue-900/10',
  whatsapp: 'from-green-900/40 to-green-900/10',
  jaco: 'from-orange-900/40 to-orange-900/10',
  telegram: 'from-blue-900/40 to-cyan-900/10',
  likee: 'from-green-900/40 to-emerald-900/10',
};

const platformIcons: Record<string, string> = {
  tiktok: '🎵',
  instagram: '📸',
  youtube: '📺',
  twitter: '🐦',
  snapchat: '👻',
  facebook: '👍',
  whatsapp: '💬',
  jaco: '📡',
  telegram: '✈️',
  likee: '❤️',
};

export default function PlatformServices() {
  const { platformId } = useParams<{ platformId: string }>();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const platform = getPlatformById(platformId || '');

  if (!platform) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {isAr ? 'المنصة غير موجودة' : 'Platform Not Found'}
          </h1>
          <Link
            to="/social"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isAr ? 'العودة لخدمات السوشال ميديا' : 'Back to Social Services'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Header */}
      <div className={`relative overflow-hidden bg-gradient-to-b ${platformGradients[platform.id] || 'from-gray-900 to-black'} mb-12`}>
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          {/* Back button */}
          <button
            onClick={() => navigate('/social')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span className="text-sm">{isAr ? 'العودة' : 'Back'}</span>
          </button>

          <div className="flex items-center gap-6">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl"
              style={{ backgroundColor: platform.color }}
            >
              {platformIcons[platform.id]}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                {isAr ? platform.nameAr : platform.name}
              </h1>
              <p className="text-gray-400 text-lg">
                {isAr
                  ? `اكتشف خدمات ${platform.nameAr} - زيادة متابعين، لايكات، مشاهدات و أكثر`
                  : `Discover ${platform.name} services - followers, likes, views & more`}
              </p>
              <div className="flex gap-4 mt-3">
                <span className="bg-white/10 rounded-full px-3 py-1 text-sm text-gray-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  {platform.services.length} {isAr ? 'خدمة' : 'Services'}
                </span>
                <span className="bg-white/10 rounded-full px-3 py-1 text-sm text-gray-300 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-green-400" />
                  {isAr ? 'حسابات عربية' : 'Arab Accounts'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">
          {isAr ? 'الخدمات المتاحة' : 'Available Services'}
        </h2>

        <div className="space-y-4">
          {platform.services
            .filter((s) => s.active)
            .map((service) => (
              <Link
                key={service.id}
                to={`/social/${platform.id}/${service.id}`}
                className="group flex items-center justify-between bg-[#151520] hover:bg-[#1a1a2e] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    {iconMap[service.icon]}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">
                      {isAr ? service.titleAr : service.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {isAr ? service.descriptionAr : service.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {isAr ? service.deliveryTimeAr : service.deliveryTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {service.minQuantity} - {service.maxQuantity.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-left">
                    <p className="text-green-400 font-bold text-xl">
                      {service.price} {isAr ? 'ر.س' : 'SAR'}
                    </p>
                    <p className="text-gray-600 text-sm line-through">
                      {service.originalPrice} {isAr ? 'ر.س' : 'SAR'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 group-hover:bg-blue-600 flex items-center justify-center transition-all">
                    {isAr ? (
                      <ChevronLeft className="w-5 h-5 text-blue-400 group-hover:text-white" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-blue-400 group-hover:text-white" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-[#151520] rounded-3xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {isAr ? 'كيف يتم الطلب؟' : 'How to Order?'}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: isAr ? 'اختر الخدمة' : 'Choose Service',
                desc: isAr ? 'اختر المنصة والخدمة اللي تبيها' : 'Pick the platform and service you need',
              },
              {
                step: '2',
                title: isAr ? 'حط الرابط' : 'Enter Link',
                desc: isAr ? 'ضع رابط حسابك أو البث' : 'Paste your account or live stream link',
              },
              {
                step: '3',
                title: isAr ? 'ادفع' : 'Pay',
                desc: isAr ? 'ادفع بأي طريقة تناسبك' : 'Pay with your preferred method',
              },
              {
                step: '4',
                title: isAr ? 'استلم' : 'Receive',
                desc: isAr ? 'الخدمة تبدأ خلال دقائق!' : 'Service starts within minutes!',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
          {[
            { icon: <Check className="w-4 h-4 text-green-400" />, text: isAr ? 'تنفيذ فوري' : 'Instant' },
            { icon: <Shield className="w-4 h-4 text-blue-400" />, text: isAr ? 'حسابات عربية' : 'Arab Accounts' },
            { icon: <Zap className="w-4 h-4 text-yellow-400" />, text: isAr ? 'ضمان الاسترجاع' : 'Money Back' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              {badge.icon}
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
