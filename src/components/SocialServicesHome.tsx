import { Link } from 'react-router';
import { Instagram, Video, Youtube, MessageCircle, Twitter } from 'lucide-react';

const services = [
  { icon: Instagram, name: 'انستقرام', desc: '1000 متابع حقيقي', price: 49, color: 'from-pink-500 to-purple-600' },
  { icon: Video, name: 'تيك توك', desc: '10,000 مشاهدة', price: 29, color: 'from-cyan-400 to-pink-500' },
  { icon: Youtube, name: 'يوتيوب', desc: '1000 مشترك', price: 79, color: 'from-red-500 to-red-700' },
  { icon: MessageCircle, name: 'واتساب', desc: '500 مشاهدة', price: 39, color: 'from-green-400 to-green-600' },
  { icon: Twitter, name: 'تويتر', desc: '1000 متابع', price: 59, color: 'from-blue-400 to-blue-600' },
];

export default function SocialServicesHome({ lang }: { lang: 'ar' | 'en' }) {
  const t = (a: string, e?: string) => lang === 'ar' ? a : e || a;
  return (
    <section className="py-16 px-4 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{t('خدمات السوشال ميديا الأكثر طلباً', 'Most Requested Social Media Services')}</h2>
          <p className="text-gray-400">{t('أفضل خدمات المتابعين واللايكات والمشاهدات بأسعار تنافسية وسرعة تنفيذ', 'Best follower, like and view services at competitive prices')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {services.map((s, i) => (
            <div key={i} className="bg-[#151520] border border-white/[0.04] rounded-2xl p-5 text-center hover:border-blue-500/30 transition-all">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-3`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-medium text-sm mb-1">{s.name}</h3>
              <p className="text-gray-400 text-xs mb-3">{s.desc}</p>
              <p className="text-white font-bold">{s.price} ر.س</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/social" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium text-center hover:shadow-lg transition-all">
            {t('تصفح جميع الخدمات', 'Browse All Services')}
          </Link>
          <a href="https://wa.me/966569888456" target="_blank" rel="noopener noreferrer" className="bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-3 rounded-xl font-medium text-center hover:bg-green-500/20 transition-all">
            {t('طلب عبر واتساب', 'Order via WhatsApp')}
          </a>
        </div>
      </div>
    </section>
  );
}
