import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Product, Category } from '@/types/database';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const headers = {
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
};

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
      headers,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch { return null; }
}

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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const data = await apiGet<Product[]>('/products?select=*&is_active=eq.true&order=id');
    if (data) setProducts(data);
    else setError('Failed to load products');
    setLoading(false);
  }, []);

  const fetchCategories = useCallback(async () => {
    const data = await apiGet<Category[]>('/categories?select=*&is_active=eq.true&order=sort_order');
    if (data) setCategories(data);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filterByCategory = useCallback((categoryId: number | null) => {
    setActiveCategory(categoryId);
    setSearchQuery('');
  }, []);

  const searchProducts = useCallback((query: string) => {
    setSearchQuery(query);
    setActiveCategory(null);
  }, []);

  const getProductById = useCallback(async (id: number): Promise<Product | null> => {
    const cached = products.find(p => p.id === id);
    if (cached) return cached;
    const data = await apiGet<Product[]>(`/products?select=*&id=eq.${id}&is_active=eq.true&limit=1`);
    return data?.[0] || null;
  }, [products]);

  const getProductBySlug = useCallback(async (slug: string): Promise<Product | null> => {
    const data = await apiGet<Product[]>(`/products?select=*&slug=eq.${slug}&is_active=eq.true&limit=1`);
    return data?.[0] || null;
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== null) {
      result = result.filter(p => p.category_id === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, activeCategory, searchQuery]);

  const getFeatured = useCallback(() => products.filter(p => p.is_featured), [products]);
  const getTrending = useCallback(() => products.filter(p => p.is_trending), [products]);
  const getRelated = useCallback((productId: number, limit = 4) => {
    const product = products.find(p => p.id === productId);
    if (!product?.category_id) return [];
    return products.filter(p => p.id !== productId && p.category_id === product.category_id).slice(0, limit);
  }, [products]);
  const getByCategory = useCallback((categoryId: number) => products.filter(p => p.category_id === categoryId), [products]);

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
