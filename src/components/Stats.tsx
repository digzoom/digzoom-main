import { Users, Package, Download, Star } from 'lucide-react';

const stats = [
  { icon: <Package className="w-6 h-6" />, value: '300+', label: 'منتج رقمي' },
  { icon: <Users className="w-6 h-6" />, value: '12,000+', label: 'عميل سعيد' },
  { icon: <Download className="w-6 h-6" />, value: '75,000+', label: 'عملية تحميل' },
  { icon: <Star className="w-6 h-6" />, value: '4.9', label: 'متوسط التقييم' },
];

export default function Stats() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-orange-600/10 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 text-blue-400 mb-4 group-hover:bg-blue-500/10 transition-colors">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
