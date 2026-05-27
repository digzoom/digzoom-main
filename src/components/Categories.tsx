import { Link } from 'react-router';
import { BookOpen, Layout, Globe, Palette, Briefcase, GraduationCap, Package, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { categories } from '@/data/products';

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-8 h-8" />,
  Layout: <Layout className="w-8 h-8" />,
  Globe: <Globe className="w-8 h-8" />,
  Palette: <Palette className="w-8 h-8" />,
  Briefcase: <Briefcase className="w-8 h-8" />,
  GraduationCap: <GraduationCap className="w-8 h-8" />,
  Package: <Package className="w-8 h-8" />,
};

const colorMap: Record<string, string> = {
  pdf: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400 hover:border-blue-400/40',
  templates: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400 hover:border-purple-400/40',
  themes: 'from-pink-500/20 to-pink-600/5 border-pink-500/20 text-pink-400 hover:border-pink-400/40',
  graphics: 'from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400 hover:border-amber-400/40',
  business: 'from-orange-500/20 to-orange-600/5 border-orange-500/20 text-orange-400 hover:border-orange-400/40',
  courses: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400 hover:border-cyan-400/40',
  plr: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400 hover:border-emerald-400/40',
};

export default function Categories() {
  const { lang } = useLanguage();

  return (
    <section className="py-20 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {lang === 'ar' ? 'تصفح حسب القسم' : 'Browse by Category'}
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {lang === 'ar' ? 'اختر القسم اللي تبيه واكتشف مئات المنتجات الرقمية الجاهزة' : 'Choose a category and discover hundreds of digital products'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {categories.filter(c => c.id !== 'all').map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-b ${colorMap[cat.id] || 'from-gray-500/20 to-gray-600/5 border-gray-500/20 text-gray-400'} border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                {iconMap[cat.icon] || <Package className="w-8 h-8" />}
              </div>
              <div className="text-center">
                <h3 className="text-white font-semibold text-sm mb-1">{lang === 'ar' ? cat.nameAr : cat.name}</h3>
                <p className="text-gray-500 text-xs">{cat.count} {lang === 'ar' ? 'منتج' : 'products'}</p>
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
