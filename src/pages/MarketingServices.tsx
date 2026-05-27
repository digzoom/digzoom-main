import { useLanguage } from '@/hooks/useLanguage';
import { marketingServices } from '@/data/marketingServices';
import {
  Users, TrendingUp, Palette, Lightbulb, Camera,
  Check, Clock, Shield
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-8 h-8" />,
  TrendingUp: <TrendingUp className="w-8 h-8" />,
  Palette: <Palette className="w-8 h-8" />,
  Lightbulb: <Lightbulb className="w-8 h-8" />,
  Camera: <Camera className="w-8 h-8" />,
};

export default function MarketingServices() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-emerald-900/10 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 text-center py-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-4 py-1.5 mb-6">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">
              {isAr ? 'خدمات تسويقية حقيقية' : 'Real Marketing Services'}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {isAr ? 'تسويق حقيقي = نتائج حقيقية' : 'Real Marketing = Real Results'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {isAr
              ? 'لا نبيعك وهم! نبني حسابك بمتابعين حقيقيين يتفاعلون ويشتروا منك'
              : 'We don\'t sell you illusions! We build your account with real followers who engage and buy from you'}
          </p>
        </div>
      </div>

      {/* Why Real Marketing */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Check className="w-8 h-8 text-green-400" />,
              title: isAr ? 'متابعين حقيقيون' : 'Real Followers',
              desc: isAr ? 'ناس حقيقية تتابعك لأنها تحب محتواك' : 'Real people follow you because they love your content',
            },
            {
              icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
              title: isAr ? 'زيادة مبيعات' : 'Sales Growth',
              desc: isAr ? 'المتابع الحقيقي يشتري منك، الوهمي ما يشتري' : 'Real followers buy from you, fake ones don\'t',
            },
            {
              icon: <Shield className="w-8 h-8 text-purple-400" />,
              title: isAr ? 'حماية حسابك' : 'Account Safety',
              desc: isAr ? 'لا مخاطر على حسابك مع التسويق الحقيقي' : 'No risks to your account with real marketing',
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#151520] rounded-2xl p-6 border border-white/5 text-center">
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {isAr ? 'خدماتنا التسويقية' : 'Our Marketing Services'}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketingServices.map((service) => (
            <div
              key={service.id}
              className={`relative bg-[#151520] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-all hover:-translate-y-1 ${
                service.popular ? 'ring-2 ring-green-500/30' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {isAr ? 'الأكثر طلباً' : 'Most Popular'}
                </div>
              )}

              <div className="p-6">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-4`}>
                  {iconMap[service.icon]}
                </div>

                {/* Badge */}
                <span className="inline-block bg-green-500/10 text-green-400 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
                  {isAr ? service.badge.ar : service.badge.en}
                </span>

                {/* Title */}
                <h3 className="text-white font-bold text-xl mb-2">
                  {isAr ? service.titleAr : service.titleEn}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4">
                  {isAr ? service.descriptionAr : service.descriptionEn}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-green-400 font-extrabold text-3xl">{service.price}</span>
                  <span className="text-gray-500 text-sm">{isAr ? service.priceUnitAr : service.priceUnit}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-5">
                  <Clock className="w-4 h-4" />
                  <span>{isAr ? service.durationAr : service.duration}</span>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {(isAr ? service.features.ar : service.features.en).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={`https://wa.me/00966569888456?text=${encodeURIComponent(
                    isAr
                      ? `أهلاً digzoom! أبي أطلب خدمة: ${service.titleAr}`
                      : `Hi digzoom! I want to order: ${service.titleEn}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02]"
                >
                  {isAr ? 'اطلب عبر الواتساب 📱' : 'Order via WhatsApp 📱'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 mt-20">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
        </h2>
        <div className="space-y-4">
          {[
            {
              q: isAr ? 'هل المتابعين حقيقيون فعلاً؟' : 'Are the followers really real?',
              a: isAr
                ? 'نعم 100%! نحن نسوي إعلانات ممولة ومحتوى جذاب يجذب ناس حقيقيين يتابعونك لأنهم يحبون محتواك. لا نستخدم بوتات أو حسابات وهمية.'
                : 'Yes 100%! We create sponsored ads and engaging content that attracts real people who follow you because they love your content. We don\'t use bots or fake accounts.',
            },
            {
              q: isAr ? 'كم يستغرق ظهور النتائج؟' : 'How long until I see results?',
              a: isAr
                ? 'خلال أول أسبوع تبدأ تشوف زيادة في التفاعل. الشهر الأول تشوف فرق واضح. بعد 3 شهور حسابك يكون مختلف تماماً.'
                : 'Within the first week you\'ll see increased engagement. The first month shows clear difference. After 3 months your account will be completely different.',
            },
            {
              q: isAr ? 'هل هذا آمن على حسابي؟' : 'Is this safe for my account?',
              a: isAr
                ? 'نعم، التسويق الحقيقي 100% آمن لأنه لا يخالف شروط أي منصة. نحن نسوي محتوى وإعلانات مشروعه.'
                : 'Yes, real marketing is 100% safe because it doesn\'t violate any platform\'s terms. We create legitimate content and ads.',
            },
            {
              q: isAr ? 'كم متابع أحصل عليه شهرياً؟' : 'How many followers do I get per month?',
              a: isAr
                ? 'يعتمد على مجالك وجودة محتواك. عموماً عملائنا يحصلون على 1000-5000 متابع حقيقي شهرياً.'
                : 'Depends on your niche and content quality. Our clients typically get 1000-5000 real followers per month.',
            },
          ].map((faq, i) => (
            <div key={i} className="bg-[#151520] rounded-xl p-5 border border-white/5">
              <h3 className="text-white font-bold mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="max-w-4xl mx-auto px-4 mt-16">
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {isAr ? 'ابدأ رحلتك الحقيقية اليوم' : 'Start Your Real Journey Today'}
          </h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            {isAr
              ? 'لا تضيع فلوسك على وهم. استثمر في حسابك بشكل حقيقي وشوف الفرق بنفسك.'
              : 'Don\'t waste money on illusions. Invest in your account for real and see the difference yourself.'}
          </p>
          <a
            href="https://wa.me/00966569888456"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105"
          >
            {isAr ? 'تواصل معنا على الواتساب 📱' : 'Contact us on WhatsApp 📱'}
          </a>
          <p className="text-gray-500 text-sm mt-4">
            {isAr ? 'استشارة مجانية - نرد خلال دقائق' : 'Free consultation - We reply within minutes'}
          </p>
        </div>
      </div>
    </div>
  );
}
