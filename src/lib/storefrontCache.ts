import type { Category, Product } from "@/types/database";

const CACHE_KEY = "digzoom-storefront-v2";
const MAX_AGE = 15 * 60 * 1000;

export type StorefrontSnapshot = {
  products: Product[];
  categories: Category[];
  savedAt: number;
};

let memoryCache: StorefrontSnapshot | null = null;

export function readStorefrontCache(
  allowStale = true,
): StorefrontSnapshot | null {
  if (memoryCache) {
    if (allowStale || Date.now() - memoryCache.savedAt < MAX_AGE)
      return memoryCache;
  }

  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StorefrontSnapshot;
    if (!Array.isArray(parsed.products) || !Array.isArray(parsed.categories))
      return null;
    if (!allowStale && Date.now() - parsed.savedAt >= MAX_AGE) return null;
    memoryCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStorefrontCache(
  products: Product[],
  categories: Category[],
) {
  const snapshot: StorefrontSnapshot = {
    products,
    categories,
    savedAt: Date.now(),
  };
  memoryCache = snapshot;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
  } catch {
    // The storefront still works when browser storage is unavailable.
  }
}

export function cachedProduct(id: number) {
  return (
    readStorefrontCache()?.products.find((product) => product.id === id) ?? null
  );
}
