import { useState, useMemo } from 'react';
import type { Product } from '@/types';
import { products as allProducts, getFeaturedProducts as getFeatured, getProductsByCategory, getTrendingProducts, getNewArrivals } from '@/data/products';

export function useProducts() {
  const [loading] = useState(false);
  
  const products = useMemo(() => allProducts, []);
  const featured = useMemo(() => getFeatured(12), []);
  const trending = useMemo(() => getTrendingProducts(12), []);
  const newArrivals = useMemo(() => getNewArrivals(12), []);

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(p => p.id.toString() === slug);
  };

  const getProductsByCat = (category: string): Product[] => {
    return getProductsByCategory(category);
  };

  const searchProducts = (query: string): Product[] => {
    const q = query.toLowerCase().trim();
    if (!q) return products;
    return products.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  };

  return {
    products,
    loading,
    featured,
    trending,
    newArrivals,
    getProductBySlug,
    getProductsByCat,
    searchProducts,
  };
}
