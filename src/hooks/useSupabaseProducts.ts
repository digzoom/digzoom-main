import { useState, useEffect, useCallback, useMemo } from "react";
import type { Product, Category } from "@/types/database";
import { fetchCatalog } from "@/lib/catalog";
import {
  readStorefrontCache,
  writeStorefrontCache,
} from "@/lib/storefrontCache";

interface UseSupabaseProductsReturn {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  filterByCategory: (categoryId: number | null) => void;
  searchProducts: (query: string) => void;
  getProductById: (id: number) => Promise<Product | null>;
  getProductBySlug: (slug: string) => Promise<Product | null>;
  getFeatured: () => Product[];
  getTrending: () => Product[];
  getRelated: (productId: number, limit?: number) => Product[];
  getByCategory: (categoryId: number) => Product[];
  activeCategory: number | null;
  searchQuery: string;
  refresh: () => void;
}

export function useSupabaseProducts(): UseSupabaseProductsReturn {
  const initialCache = useMemo(() => readStorefrontCache(), []);
  const [products, setProducts] = useState<Product[]>(
    initialCache?.products ?? [],
  );
  const [categories, setCategories] = useState<Category[]>(
    initialCache?.categories ?? [],
  );
  const [loading, setLoading] = useState(!initialCache);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = useCallback(async () => {
    if (!readStorefrontCache()) setLoading(true);
    setError(null);
    try {
      const { products: productData, categories: categoryData } = await fetchCatalog();
      setProducts(productData);
      setCategories(categoryData);
      writeStorefrontCache(productData, categoryData);
    } catch {
      if (!readStorefrontCache()) setError("Catalog unavailable");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filterByCategory = useCallback((categoryId: number | null) => {
    setActiveCategory(categoryId);
    setSearchQuery("");
  }, []);

  const searchProducts = useCallback((query: string) => {
    setSearchQuery(query);
    setActiveCategory(null);
  }, []);

  const getProductById = useCallback(
    async (id: number): Promise<Product | null> => {
      const cached = products.find((p) => p.id === id);
      if (cached) return cached;
      try {
        return (await fetchCatalog()).products.find((p) => p.id === id) ?? null;
      } catch {
        return null;
      }
    },
    [products],
  );

  const getProductBySlug = useCallback(
    async (slug: string): Promise<Product | null> => {
      const cached = products.find((p) => p.slug === slug);
      if (cached) return cached;
      try {
        return (await fetchCatalog()).products.find((p) => p.slug === slug) ?? null;
      } catch {
        return null;
      }
    },
    [products],
  );

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== null) {
      result = result.filter((p) => p.category_id === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [products, activeCategory, searchQuery]);

  const getFeatured = useCallback(
    () => products.filter((p) => p.is_featured),
    [products],
  );
  const getTrending = useCallback(
    () => products.filter((p) => p.is_trending),
    [products],
  );
  const getRelated = useCallback(
    (productId: number, limit = 4) => {
      const product = products.find((p) => p.id === productId);
      if (!product?.category_id) return [];
      return products
        .filter(
          (p) => p.id !== productId && p.category_id === product.category_id,
        )
        .slice(0, limit);
    },
    [products],
  );
  const getByCategory = useCallback(
    (categoryId: number) =>
      products.filter((p) => p.category_id === categoryId),
    [products],
  );

  return {
    products: filteredProducts,
    categories,
    loading,
    error,
    filterByCategory,
    searchProducts,
    getProductById,
    getProductBySlug,
    getFeatured,
    getTrending,
    getRelated,
    getByCategory,
    activeCategory,
    searchQuery,
    refresh: fetchProducts,
  };
}
