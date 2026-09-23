import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ShoppingCart,
  Search,
  LayoutGrid,
  List,
  X,
  PackageOpen,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Languages,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/hooks/useLanguage";
import { productTitle, productDescription } from "@/lib/i18n";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCat = searchParams.get("category") || "all";
  const [activeCat, setActiveCat] = useState(urlCat);
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [segment, setSegment] = useState<
    "all" | "content" | "performance" | "sales" | "strategy"
  >("all");
  const [page, setPage] = useState(1);
  const pageSize = 24;
  const { addToCart, items } = useCart();
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
    setSegment("all");
    setSearch("");
    // Map category slug to id
    const catObj = categories.find(c => c.slug === cat);
    filterByCategory(catObj ? catObj.id : null);
    if (cat === "all") setSearchParams({});
    else setSearchParams({ category: cat });
  };

  // Handle search
  const handleSearch = (val: string) => {
    setSearch(val);
    setSegment("all");
    if (val.trim()) {
      searchProducts(val);
      setActiveCat("all");
    } else {
      searchProducts("");
    }
  };

  // Professional Arabic search: normalize for better matching
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[أإآا]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/ة/g, "ه");
  };

  const productSegment = (product: (typeof products)[0]) => {
    const text = normalizeText(
      `${product.slug} ${product.title} ${product.title_ar ?? ""} ${product.title_en ?? ""}`.toLowerCase()
    );
    if (
      /ميزاني|اداء|حملات|مؤثر|budget|performance|campaign|influencer|social-kpi/.test(
        text
      )
    )
      return "performance";
    if (/عملاء|تسعير|ربحي|lead|pricing|profit/.test(text)) return "sales";
    if (/اطلاق|سنوي|شخصيه|launch|annual|persona/.test(text)) return "strategy";
    return "content";
  };

  // Local filtering on top of Supabase results
  const filtered = useMemo(() => {
    let res = products;

    if (segment !== "all") {
      res = res.filter(product => productSegment(product) === segment);
    }

    if (search.trim()) {
      const q = normalizeText(search.trim());
      const qRaw = search.trim().toLowerCase();

      res = res.filter(p => {
        const titleNorm = normalizeText(p.title);
        const descNorm = normalizeText(p.description);
        if (titleNorm.includes(q) || p.title.toLowerCase().includes(qRaw))
          return true;
        if (descNorm.includes(q) || p.description.toLowerCase().includes(qRaw))
          return true;
        return false;
      });

      res.sort((a, b) => {
        const aTitle =
          normalizeText(a.title).includes(q) ||
          a.title.toLowerCase().includes(qRaw);
        const bTitle =
          normalizeText(b.title).includes(q) ||
          b.title.toLowerCase().includes(qRaw);
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        return 0;
      });
    } else if (activeCat !== "all" && categories.length > 0) {
      const catObj = categories.find(
        c => c.slug === activeCat || c.id.toString() === activeCat
      );
      if (catObj) {
        res = res.filter(p => p.category_id === catObj.id);
      }
    }

    // Sort
    if (!search.trim()) {
      const sorted = [...res];
      if (sort === "price-low") sorted.sort((a, b) => a.price - b.price);
      else if (sort === "price-high") sorted.sort((a, b) => b.price - a.price);
      return sorted;
    }

    return res;
  }, [activeCat, sort, search, segment, products, categories]);

  const getTitle = (p: (typeof products)[0]) => productTitle(p, lang);
  const getDesc = (p: (typeof products)[0]) => productDescription(p, lang);

  // Do not show empty legacy categories. Only categories containing at least
  // one currently published product belong in the public storefront.
  const visibleCategories = useMemo(
    () =>
      categories.filter(category =>
        products.some(product => product.category_id === category.id)
      ),
    [categories, products]
  );

  useEffect(() => setPage(1), [activeCat, sort, search, segment]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleProducts = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleAdd = (p: (typeof products)[0]) => {
    addToCart(p as any);
  };

  const quantityInCart = (productId: number) =>
    items.find(item => item.id === productId)?.quantity ?? 0;

  const sortOptions = [
    {
      value: "default",
      label: lang === "ar" ? "الترتيب الافتراضي" : "Default order",
    },
    { value: "price-low", label: t.shop.priceLow },
    { value: "price-high", label: t.shop.priceHigh },
  ];

  const segments = [
    { value: "all" as const, ar: "كل المنتجات", en: "All products" },
    {
      value: "content" as const,
      ar: "المحتوى والتخطيط",
      en: "Content & planning",
    },
    {
      value: "performance" as const,
      ar: "الأداء والميزانية",
      en: "Performance & budget",
    },
    { value: "sales" as const, ar: "المبيعات والعملاء", en: "Sales & leads" },
    {
      value: "strategy" as const,
      ar: "الإطلاق والاستراتيجية",
      en: "Launch & strategy",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
        <section className="bg-[#08090d] px-4 pb-20 pt-32 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              {lang === "ar" ? "متجر DigZoom الرقمي" : "DigZoom digital store"}
            </span>
            <h1 className="mt-5 text-4xl font-black sm:text-5xl">
              {t.shop.title}
            </h1>
            <p className="mt-4 text-slate-300">{t.shop.subtitle}</p>
          </div>
        </section>
        <section className="relative -mt-8 px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5" />
            <div className="mt-10 grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
              {[0, 1, 2, 3].map(item => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="aspect-[3/4] animate-pulse bg-slate-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-slate-500">
              {lang === "ar"
                ? "نجهز المنتجات والتصنيفات الآن…"
                : "Preparing products and categories…"}
            </p>
          </div>
        </section>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-[#08090d] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <PackageOpen className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {lang === "ar" ? "خطأ في الاتصال" : "Connection Error"}
          </h2>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {lang === "ar" ? "إعادة المحاولة" : "Retry"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <section className="relative overflow-hidden bg-[#08090d] px-4 pb-20 pt-32 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(91,82,255,.2),transparent_34%),radial-gradient(circle_at_18%_70%,rgba(0,163,255,.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              {lang === "ar" ? "متجر DigZoom الرقمي" : "DigZoom digital store"}
            </span>
            <h1 className="mb-4 text-4xl font-black sm:text-5xl">
              {t.shop.title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {t.shop.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {lang === "ar" ? "تفاصيل واضحة" : "Clear details"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                <Languages className="h-4 w-4 text-blue-400" />
                {lang === "ar" ? "عربي وإنجليزي" : "Arabic & English"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                <Headphones className="h-4 w-4 text-purple-400" />
                {lang === "ar" ? "دعم مباشر" : "Direct support"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + Filters */}
          {products.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 mb-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${lang === "ar" ? "right-4" : "left-4"}`}
                />
                <input
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder={t.shop.searchPlaceholder}
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3 text-slate-950 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition placeholder:text-slate-400 ${lang === "ar" ? "pr-11 pl-4" : "pl-11 pr-4"}`}
                />
                {search && (
                  <button
                    onClick={() => handleSearch("")}
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950 ${lang === "ar" ? "left-4" : "right-4"}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                >
                  {sortOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <div className="hidden sm:flex bg-slate-50 border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    aria-label={lang === "ar" ? "عرض شبكي" : "Grid view"}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-900"}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    aria-label={lang === "ar" ? "عرض قائمة" : "List view"}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-900"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Clear customer-facing categories, independent from technical product types. */}
          {products.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 text-sm font-bold text-slate-700">
                {lang === "ar" ? "اختر حسب احتياجك" : "Browse by use case"}
              </p>
              <div className="flex flex-wrap gap-2">
                {segments.map(item => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setSegment(item.value);
                      setActiveCat("all");
                      setSearch("");
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${segment === item.value ? "bg-slate-950 text-white shadow-lg" : "border border-slate-200 bg-white text-slate-600 hover:text-slate-950"}`}
                  >
                    {lang === "ar" ? item.ar : item.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {products.length > 0 && visibleCategories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => handleCat("all")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCat === "all" ? "bg-slate-950 text-white shadow-lg" : "bg-white text-slate-600 hover:text-slate-950 border border-slate-200"}`}
              >
                {t.shop.showAll}
              </button>
              {visibleCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCat(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeCat === cat.slug
                      ? "bg-slate-950 text-white shadow-lg"
                      : "bg-white text-slate-600 hover:text-slate-950 border border-slate-200"
                  }`}
                >
                  {lang === "ar" ? cat.name_ar : cat.name_en}
                </button>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <p className="text-slate-500 text-sm">
                {filtered.length} {t.shop.products}
              </p>
              {search.trim() && (
                <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full">
                  <Search className="w-3 h-3" />
                  {lang === "ar"
                    ? `نتائج البحث عن: "${search}"`
                    : `Search results for: "${search}"`}
                </span>
              )}
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && filtered.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {visibleProducts.map((p, index) => {
                const cartQuantity = quantityInCart(p.id);
                return (
                  <div
                    key={p.id}
                    className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 ${cartQuantity > 0 ? "border-blue-400 ring-2 ring-blue-500/10" : "border-slate-200 hover:border-blue-300"}`}
                  >
                    {cartQuantity > 0 && (
                      <div
                        className="absolute end-2 top-2 z-20 inline-flex items-center gap-1 rounded-full bg-slate-950/90 px-2 py-1 text-[10px] font-bold text-white shadow-lg backdrop-blur-sm sm:text-xs"
                        role="status"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{lang === "ar" ? "في السلة" : "In cart"}</span>
                        <span className="rounded-full bg-blue-500 px-1.5 py-0.5 leading-none">
                          {cartQuantity}
                        </span>
                      </div>
                    )}
                    <Link to={`/product/${p.id}`} className="block relative">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={p.image_url}
                          alt={getTitle(p)}
                          loading={index < 4 ? "eager" : "lazy"}
                          fetchPriority={index < 4 ? "high" : "auto"}
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      {p.original_price && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {t.shop.discount}{" "}
                          {Math.round((1 - p.price / p.original_price) * 100)}%
                        </div>
                      )}
                    </Link>
                    <div className="p-5">
                      <Link to={`/product/${p.id}`}>
                        <h3 className="text-slate-950 font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm leading-relaxed">
                          {getTitle(p)}
                        </h3>
                      </Link>
                      <p className="text-slate-500 text-xs mb-3 line-clamp-2">
                        {getDesc(p)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-slate-950">
                            {p.price} {t.featured.currency}
                          </span>
                          {p.original_price && (
                            <span className="text-xs text-gray-600 line-through">
                              {p.original_price}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAdd(p)}
                          aria-label={
                            cartQuantity > 0
                              ? lang === "ar"
                                ? `زيادة كمية ${getTitle(p)} في السلة، الكمية الحالية ${cartQuantity}`
                                : `Increase ${getTitle(p)} quantity in cart, current quantity ${cartQuantity}`
                              : lang === "ar"
                                ? `أضف ${getTitle(p)} إلى السلة`
                                : `Add ${getTitle(p)} to cart`
                          }
                          className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm transition-all active:scale-95 ${cartQuantity > 0 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"}`}
                        >
                          {cartQuantity > 0 ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <ShoppingCart className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && filtered.length > 0 && (
            <div className="space-y-4">
              {visibleProducts.map(p => {
                const cartQuantity = quantityInCart(p.id);
                return (
                  <div
                    key={p.id}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-xl hover:shadow-slate-900/5 sm:flex-row ${cartQuantity > 0 ? "border-blue-400 ring-2 ring-blue-500/10" : "border-slate-200 hover:border-blue-300"}`}
