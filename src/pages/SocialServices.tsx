import { useState } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { platforms } from '@/data/socialServices';
import {
  ChevronLeft, ChevronRight, Zap, ShieldCheck, Headphones, Video,
  Instagram, Youtube, Twitter, Ghost, Facebook, MessageSquare,
  Radio, Send, Heart, Users, ThumbsUp, Eye, MessageCircle,
  Share2, Bookmark, Clock, Repeat, Camera, Gift, AlertTriangle, Check, X
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Video: <Video className="w-6 h-6" />,
  Instagram: <Instagram className="w-6 h-6" />,
  Youtube: <Youtube className="w-6 h-6" />,
  Twitter: <Twitter className="w-6 h-6" />,
  Ghost: <Ghost className="w-6 h-6" />,
  Facebook: <Facebook className="w-6 h-6" />,
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  Radio: <Radio className="w-6 h-6" />,
  Send: <Send className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
};

const catColors: Record<string, string> = {
  tiktok: 'from-black to-gray-900 border-gray-700',
  instagram: 'from-pink-900/40 to-purple-900/20 border-pink-500/30',
  youtube: 'from-red-900/40 to-red-900/10 border-red-500/30',
  twitter: 'from-gray-800 to-black border-gray-600',
  snapchat: 'from-yellow-900/40 to-yellow-900/10 border-yellow-500/30',
  facebook: 'from-blue-900/40 to-blue-900/10 border-blue-500/30',
  whatsapp: 'from-green-900/40 to-green-900/10 border-green-500/30',
  jaco: 'from-orange-900/40 to-orange-900/10 border-orange-500/30',
  telegram: 'from-blue-900/40 to-cyan-900/10 border-blue-400/30',
  likee: 'from-green-900/40 to-emerald-900/10 border-green-400/30',
};

export default function SocialServices() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  const togglePlatform = (id: string) => {
    setExpandedPlatform(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 text-center py-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">
              {isAr ? 'خدمات رقمية فورية' : 'Instant Digital Services'}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {isAr ? 'خدمات السوشال ميديا' : 'Social Media Services'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {isAr
              ? 'زيادة متابعين، لايكات، مشاهدات ودعم لايف لجميع منصات التواصل الاجتماعي'
              : 'Boost followers, likes, views and live support for all social media platforms'}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10+</div>
              <div className="text-gray-400 text-sm">{isAr ? 'منصة' : 'Platforms'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-gray-400 text-sm">{isAr ? 'خدمة' : 'Services'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-gray-400 text-sm">{isAr ? 'دعم' : 'Support'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Honesty Banner - Digital Services */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-5 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-1">
              {isAr ? '⚠️ تنبيه مهم' : '⚠️ Important Notice'}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {isAr
                ? 'الخدمات أدناه هي خدمات رقمية آلية (بوتات أو حسابات غير فعالة). هذه المتابعين والإعجابات لا يتفاعلون فعلياً مع محتواك. إذا تبي متابعين حقيقيين يتفاعلون ويشتروا منك، شوف قسم '
                : 'The services below are automated digital services (bots or inactive accounts). These followers and likes do not actually engage with your content. If you want real followers who engage and buy from you, see the '}
              <Link to="/marketing" className="text-blue-400 underline hover:text-blue-300">
                {isAr ? 'خدمات التسويق الحقيقية' : 'Real Marketing Services'}
              </Link>
              {isAr ? ' اللي نقدمه.' : ' we offer.'}
            </p>
          </div>
        </div>
      </div>

      {/* Honest Comparison */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="bg-[#151520] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-4 bg-white/5 border-b border-white/5">
            <h3 className="text-white font-bold text-lg text-center">
              {isAr ? '🤔 الفرق بين الخدمات' : '🤔 Service Comparison'}
            </h3>
          </div>
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {/* Digital */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <X className="w-5 h-5 text-red-400" />
                <h4 className="text-red-400 font-bold">{isAr ? 'خدمات رقمية (البطاقة أدناه)' : 'Digital Services (Cards Below)'}</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><X className="w-4 h-4 text-red-500" />{isAr ? 'متابعين وهميين / بوتات' : 'Fake followers / bots'}</li>
                <li className="flex items-center gap-2"><X className="w-4 h-4 text-red-500" />{isAr ? 'لا يتفاعلون مع المحتوى' : 'Don\'t engage with content'}</li>
                <li className="flex items-center gap-2"><X className="w-4 h-4 text-red-500" />{isAr ? 'قد ينحذفون بعد فترة' : 'May be removed over time'}</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />{isAr ? 'رخيص وسريع' : 'Cheap and fast'}</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />{isAr ? 'مناسب للأرقام فقط' : 'Good for numbers only'}</li>
              </ul>
            </div>
            {/* Real */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-green-400" />
                <h4 className="text-green-400 font-bold">{isAr ? 'خدمات تسويقية حقيقية' : 'Real Marketing Services'}</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />{isAr ? 'متابعين حقيقيين يتفاعلون' : 'Real followers who engage'}</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />{isAr ? 'يزيدون مبيعاتك فعلياً' : 'Actually increase your sales'}</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />{isAr ? 'آمن على حسابك' : 'Safe for your account'}</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />{isAr ? 'نتائج طويلة المدى' : 'Long-term results'}</li>
                <li className="flex items-center gap-2"><X className="w-4 h-4 text-red-500" />{isAr ? 'أغلى من الخدمات الرقمية' : 'More expensive than digital'}</li>
              </ul>
              <Link
                to="/marketing"
                className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                {isAr ? 'اكتشف الخدمات الحقيقية →' : 'Discover Real Services →'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {isAr ? '🤖 خدمات رقمية فورية' : '🤖 Instant Digital Services'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => {
            const isExpanded = expandedPlatform === platform.id;
            return (
              <div
                key={platform.id}
                className={`rounded-2xl border bg-gradient-to-b ${catColors[platform.id]} overflow-hidden transition-all duration-300`}
              >
                <button
                  onClick={() => togglePlatform(platform.id)}
                  className="w-full p-5 flex items-center justify-between text-right hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: platform.color }}
                    >
                      {iconMap[platform.icon]}
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-bold text-lg">{platform.nameAr}</h3>
                      <p className="text-gray-400 text-sm">{platform.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {platform.services.length} {isAr ? 'خدمة' : 'services'}
                      </p>
                    </div>
                  </div>
                  {isAr ? (
                    <ChevronLeft className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-[-90deg]' : ''}`} />
                  ) : (
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-white/10 animate-in slide-in-from-top-2 duration-200">
                    {platform.services.filter(s => s.active).map((service) => (
                      <Link
                        key={service.id}
                        to={`/social/${platform.id}/${service.id}`}
                        className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                            {service.icon === 'Users' ? <Users className="w-5 h-5" /> :
                             service.icon === 'ThumbsUp' ? <ThumbsUp className="w-5 h-5" /> :
                             service.icon === 'Eye' ? <Eye className="w-5 h-5" /> :
                             service.icon === 'MessageCircle' ? <MessageCircle className="w-5 h-5" /> :
                             service.icon === 'Share2' ? <Share2 className="w-5 h-5" /> :
                             service.icon === 'Bookmark' ? <Bookmark className="w-5 h-5" /> :
                             service.icon === 'Clock' ? <Clock className="w-5 h-5" /> :
                             service.icon === 'Repeat' ? <Repeat className="w-5 h-5" /> :
                             service.icon === 'Camera' ? <Camera className="w-5 h-5" /> :
                             service.icon === 'Gift' ? <Gift className="w-5 h-5" /> :
                             service.icon === 'Radio' ? <Radio className="w-5 h-5" /> :
                             <Zap className="w-5 h-5" />}
                          </div>
                          <div>
                            <span className="text-white font-semibold text-sm">{isAr ? service.titleAr : service.title}</span>
                            <span className="text-gray-500 text-xs block">{isAr ? service.deliveryTimeAr : service.deliveryTime}</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <span className="text-green-400 font-bold text-sm">{service.price} ر.س</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 mt-20">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {isAr ? 'لماذا digzoom؟' : 'Why digzoom?'}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-8 h-8 text-yellow-400" />,
              title: isAr ? 'تنفيذ فوري' : 'Instant Delivery',
              desc: isAr ? 'الطلب يبدأ خلال دقائق من الدفع' : 'Orders start within minutes of payment',
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
              title: isAr ? 'حسابات عربية' : 'Arab Accounts',
              desc: isAr ? 'جميع الخدمات من حسابات عربية' : 'All services from Arab accounts',
            },
            {
              icon: <Headphones className="w-8 h-8 text-blue-400" />,
              title: isAr ? 'دعم 24/7' : '24/7 Support',
              desc: isAr ? 'فريق دعم متواصل على الواتساب' : 'Continuous WhatsApp support',
            },
          ].map((feature, i) => (
            <div key={i} className="bg-[#151520] rounded-2xl p-6 border border-white/5 text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-white font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
