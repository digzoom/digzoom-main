/**
 * Unified Product Store
 * Merges the base catalog (products.ts) with admin localStorage overrides.
 * This allows the admin dashboard to manage products while the storefront
 * sees the combined (and potentially modified) catalog.
 */
import type { Product } from '@/types';
import { products as baseProducts, getProductById as getBaseProductById } from './products';

const ADMIN_PRODUCTS_KEY = 'digzoom_admin_products_v2';
const ADMIN_OVERRIDES_KEY = 'digzoom_admin_overrides_v1';

// ─── Types ───

interface AdminProductOverride {
  id: number;
  price?: number;
  originalPrice?: number;
  inStock?: boolean;
  title?: string;
  description?: string;
  image?: string;
  category?: string;
}

interface LocalAdminProduct {
  id: number;
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice: number;
  image: string;
  categoryId: number;
  fileType: string;
  fileSize: string;
  features: string[];
  inStock: boolean;
  createdAt: string;
}

// ─── Helpers ───

function loadOverrides(): Record<number, AdminProductOverride> {
  try {
    const saved = localStorage.getItem(ADMIN_OVERRIDES_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return {};
}

function saveOverrides(overrides: Record<number, AdminProductOverride>) {
  try {
    localStorage.setItem(ADMIN_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch { /* ignore */ }
}

function loadAdminProducts(): LocalAdminProduct[] {
  try {
    const saved = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return [];
}

function localAdminToProduct(p: LocalAdminProduct): Product {
  return {
    id: p.id,
    title: p.titleAr || p.titleEn,
    description: p.descriptionAr || p.descriptionEn,
    longDescription: p.descriptionAr || p.descriptionEn,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image || '/images/placeholder.jpg',
    category: String(p.categoryId),
    rating: 4.5,
    reviews: 0,
    features: p.features || [],
    fileType: p.fileType || 'ZIP',
    fileSize: p.fileSize || '10 MB',
    inStock: p.inStock,
  };
}

// ─── Public API ───

/**
 * Get the unified product catalog: base products + admin overrides + admin-added products
 */
export function getUnifiedProducts(): Product[] {
  const overrides = loadOverrides();
  const adminProducts = loadAdminProducts();

  // Start with base products, applying overrides
  const merged = baseProducts.map(p => {
    const ov = overrides[p.id];
    if (ov) {
      return { ...p, ...ov };
    }
    return p;
  });

  // Add admin-created products (those not in base catalog)
  const baseIds = new Set(baseProducts.map(p => p.id));
  const newProducts = adminProducts
    .filter(ap => !baseIds.has(ap.id))
    .map(localAdminToProduct);

  return [...merged, ...newProducts];
}

/**
 * Get a single product from the unified catalog
 */
export function getUnifiedProductById(id: number): Product | undefined {
  return getUnifiedProducts().find(p => p.id === id);
}

/**
 * Toggle product stock status (admin action)
 */
export function toggleProductStock(id: number): boolean {
  const overrides = loadOverrides();
  const baseProduct = getBaseProductById(id);

  if (baseProduct) {
    // Toggle override for base product
    const currentStock = overrides[id]?.inStock ?? baseProduct.inStock;
    overrides[id] = { ...overrides[id], id, inStock: !currentStock };
    saveOverrides(overrides);
    return !currentStock;
  }

  // It's an admin-added product
  const adminProducts = loadAdminProducts();
  const ap = adminProducts.find(p => p.id === id);
  if (ap) {
    ap.inStock = !ap.inStock;
    try {
      localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(adminProducts));
    } catch { /* ignore */ }
    return ap.inStock;
  }

  return false;
}

/**
 * Update product price (admin action)
 */
export function updateProductPrice(id: number, price: number, originalPrice?: number): boolean {
  if (price <= 0) return false;

  const overrides = loadOverrides();
  overrides[id] = { ...overrides[id], id, price, ...(originalPrice !== undefined ? { originalPrice } : {}) };
  saveOverrides(overrides);
  return true;
}

/**
 * Check if admin has modified a product
 */
export function isProductOverridden(id: number): boolean {
  const overrides = loadOverrides();
  return id in overrides;
}

/**
 * Get product statistics for admin dashboard
 */
export function getProductStats(): { total: number; inStock: number; outOfStock: number; adminAdded: number; overridden: number } {
  const unified = getUnifiedProducts();
  const overrides = loadOverrides();
  const adminProducts = loadAdminProducts();
  const baseIds = new Set(baseProducts.map(p => p.id));
  const adminAdded = adminProducts.filter(p => !baseIds.has(p.id)).length;

  return {
    total: unified.length,
    inStock: unified.filter(p => p.inStock).length,
    outOfStock: unified.filter(p => !p.inStock).length,
    adminAdded,
    overridden: Object.keys(overrides).length,
  };
}

// Re-export base helpers for convenience
export { baseProducts, getBaseProductById };
