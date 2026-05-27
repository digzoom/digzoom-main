import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Star, ShoppingCart, Search, LayoutGrid, List, X, PackageOpen, Tag, Loader2 } from 'lucide-react';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCat = searchParams.get('category') || 'all';
  const [activeCat, setActiveCat] = useState(urlCat);
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();

  // Supabase products
  const {
    products,
    categories,
    loading,
    error,
    filterByCategory,
    searchProducts,
  } = useSupabaseProducts();

  // Sync URL category with Supabase filter
  const handleCat = (cat: string) => {
    setActiveCat(cat);
    setSearch('');
    // Map category slug to id
    const catObj = categories.find(c => c.slug === cat);
    filterByCategory(catObj ? catObj.id : null);
    if (cat === 'all') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  // Handle search
  const handleSearch = (val: string) => {
    setSearch(val);
    if (val.trim()) {
      searchProducts(val);
      setActiveCat('all');
    } else {
      searchProducts('');
    }
  };

  // Professional Arabic search: normalize for better matching
  const normalizeText = (text: string): string => {
    return text.toLowerCase()
      .replace(/[أإآا]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/ة/g, 'ه');
  };

  // Local filtering on top of Supabase results
  const filtered = useMemo(() => {
    let res = products;

    if (search.trim()) {
      const q = normalizeText(search.trim());
      const qRaw = search.trim().toLowerCase();

      res = res.filter(p => {
        const titleNorm = normalizeText(p.title);
        const descNorm = normalizeText(p.description);
        if (titleNorm.includes(q) || p.title.toLowerCase().includes(qRaw)) return true;
        if (descNorm.includes(q) || p.description.toLowerCase().includes(qRaw)) return true;
        return false;
      });

      res.sort((a, b) => {
        const aTitle = normalizeText(a.title).includes(q) || a.title.toLowerCase().includes(qRaw);
        const bTitle = normalizeText(b.title).includes(q) || b.title.toLowerCase().includes(qRaw);
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        return 0;
      });
    } else if (activeCat !== 'all' && categories.length > 0) {
      const catObj = categories.find(c => c.slug === activeCat || c.id.toString() === activeCat);
      if (catObj) {
        res = res.filter(p => p.category_id === catObj.id);
      }
    }

    // Sort
    if (!search.trim()) {
      const sorted = [...res];
      if (sort === 'price-low') sorted.sort((a, b) => a.price - b.price);
      else if (sort === 'price-high') sorted.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
      else sorted.sort((a, b) => b.reviews_count - a.reviews_count);
      return sorted;
    }

    return res;
  }, [activeCat, sort, search, products, categories]);

  const handleAdd = (p: typeof products[0]) => {
    addToCart(p as any);
    toast.success(lang === 'ar' ? `تمت إضافة "${p.title}" إلى السلة` : `"${p.title}" added to cart`);
  };

  const sortOptions = [
    { value: 'popular', label: t.shop.popular },
    { value: 'price-low', label: t.shop.priceLow },
    { value: 'price-high', label: t.shop.priceHigh },
    { value: 'rating', label: t.shop.topRated },
  ];

  // Loading state
  if (loading) {
    return (
      <AnimatedBackground>
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">{lang === 'ar' ? 'جاري تحميل المنتجات...' : 'Loading products...'}</p>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  // Error state
  if (error) {
    return (
      <AnimatedBackground>
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {lang === 'ar' ? 'خطأ في الاتصال' : 'Connection Error'}
            </h2>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{t.shop.title}</h1>
          <p className="text-gray-400">{t.shop.subtitle}</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 ${lang === 'ar' ? 'right-4' : 'left-4'}`} />
            <input value={search} onChange={e => handleSearch(e.target.value)} placeholder={t.shop.searchPlaceholder}
              className={`w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-colors placeholder:text-gray-600 ${lang === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'}`} />
            {search && <button onClick={() => handleSearch('')} className={`absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-white ${lang === 'ar' ? 'left-4' : 'right-4'}`}><X className="w-4 h-4" /></button>}
          </div>
          <div className="flex items-center gap-2">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.06] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/40">
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="hidden sm:flex bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-white'}`}><LayoutGrid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-white'}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => handleCat(cat.slug)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCat === cat.slug
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
              }`}>
              {lang === 'ar' ? cat.name_ar : cat.name_en}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <p className="text-gray-600 text-sm">{filtered.length} {t.shop.products}</p>
          {search.trim() && (
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full">
              <Search className="w-3 h-3" />
              {lang === 'ar' ? `نتائج البحث عن: "${search}"` : `Search results for: "${search}"`}
            </span>
          )}
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filtered.map(p => (
              <div key={p.id} className="group bg-[#151520] rounded-2xl border border-white/[0.04] overflow-hidden hover:border-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5">
                <Link to={`/product/${p.id}`} className="block relative">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  {p.original_price && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {t.shop.discount} {Math.round((1 - p.price / p.original_price) * 100)}%
                    </div>
                  )}
                </Link>
                <div className="p-5">
                  <Link to={`/product/${p.id}`}><h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors text-sm leading-relaxed">{p.title}</h3></Link>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-gray-300 text-xs">{p.rating}</span>
                    <span className="text-gray-600 text-xs">({p.reviews_count})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{p.price} {t.featured.currency}</span>
                      {p.original_price && <span className="text-xs text-gray-600 line-through">{p.original_price}</span>}
                    </div>
                    <button onClick={() => handleAdd(p)} className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center justify-center text-white transition-all">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map(p => (
              <div key={p.id} className="group bg-[#151520] rounded-2xl border border-white/[0.04] overflow-hidden hover:border-blue-500/20 transition-all flex flex-col sm:flex-row">
                <Link to={`/product/${p.id}`} className="sm:w-56 flex-shrink-0 relative">
                  <div className="aspect-[3/4] sm:aspect-auto sm:h-full overflow-hidden">
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  {p.original_price && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {t.shop.discount} {Math.round((1 - p.price / p.original_price) * 100)}%
                    </div>
                  )}
                </Link>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/product/${p.id}`}><h3 className="text-white font-semibold mb-2 text-lg group-hover:text-blue-400 transition-colors">{p.title}</h3></Link>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-300 text-sm">{p.rating}</span>
                      <span className="text-gray-600 text-sm">({p.reviews_count} {lang === 'ar' ? 'تقييم' : 'reviews'})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-white">{p.price} {t.featured.currency}</span>
                      {p.original_price && <span className="text-gray-600 line-through">{p.original_price} {t.featured.currency}</span>}
                    </div>
                    <button onClick={() => handleAdd(p)} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium transition-all flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> {t.product.addToCart}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16 md:py-20">
            <div className="relative mb-8 inline-block">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-[#151520] border border-white/[0.06] flex items-center justify-center mx-auto">
                <PackageOpen className="w-12 h-12 md:w-14 md:h-14 text-gray-600" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              {search.trim() ? (lang === 'ar' ? 'لا توجد نتائج' : 'No Results Found') : t.shop.empty}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm md:text-base">
              {search.trim()
                ? (lang === 'ar' ? `لم نعثر على منتجات تطابق "${search}". جرب كلمة بحث مختلفة.` : `No products matching "${search}". Try a different search term.`)
                : (lang === 'ar' ? 'لا توجد منتجات في هذا التصنيف حالياً.' : 'No products in this category yet.')
              }
            </p>
            <button
              onClick={() => { setActiveCat('all'); handleSearch(''); setSearchParams({}); }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 md:px-8 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/15"
            >
              {t.shop.showAll}
            </button>
          </div>
        )}
      </div>
    </div>
    </AnimatedBackground>
  );
}
