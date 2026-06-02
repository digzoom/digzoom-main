import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { CartItem, Product } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  conflictWarning: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'digzoom_cart_v1';

/* ── Bundle conflict mapping ──
   Defines which product IDs are bundles that contain other product IDs.
   When a bundle is in cart, individual products within it cannot be added.
   When an individual product is in cart, its parent bundle cannot be added.
*/
const BUNDLE_MAP: Record<number, number[]> = {
  // Example: Bundle ID 146 (مكتبة التصاميم الإبداعية - 1000+ items) contains graphic templates
  146: [127, 128, 129, 130, 132, 133, 134, 135],
  // Bundle ID 144 (دورة تصميم الجرافيك الشاملة) contains design-related products
  144: [68, 126, 127, 135],
  // Bundle ID 66 (موسوعة البرمجة) contains code products
  66: [77, 80, 82, 84, 86, 88, 89],
  // Bundle ID 141 (تسجيلات قرآنية مجودة) contains audio religious
  141: [62, 136, 139],
};

/* Build reverse map: individual product -> parent bundle */
const REVERSE_BUNDLE_MAP: Record<number, number[]> = {};
Object.entries(BUNDLE_MAP).forEach(([bundleId, containedIds]) => {
  containedIds.forEach((containedId) => {
    if (!REVERSE_BUNDLE_MAP[containedId]) REVERSE_BUNDLE_MAP[containedId] = [];
    REVERSE_BUNDLE_MAP[containedId].push(Number(bundleId));
  });
});

function loadCartFromStorage(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore invalid data */ }
  return [];
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch { /* ignore storage errors */ }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Persist cart to localStorage on every change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  /* ── Check for bundle conflicts ── */
  const checkBundleConflict = useCallback((productId: number, currentItems: CartItem[]): { hasConflict: boolean; message: string | null } => {
    // Check if product being added is a bundle and any of its contents are in cart
    const bundleContents = BUNDLE_MAP[productId];
    if (bundleContents) {
      const conflictingItems = currentItems.filter((item) => bundleContents.includes(item.id));
      if (conflictingItems.length > 0) {
        const names = conflictingItems.map((i) => i.title).join('، ');
        return {
          hasConflict: true,
          message: `هذا الباقة تحتوي على: ${names}. تم إزالة المنتجات الفردية من السلة.`,
        };
      }
    }

    // Check if product being added is contained within a bundle already in cart
    const parentBundles = REVERSE_BUNDLE_MAP[productId];
    if (parentBundles) {
      const bundleInCart = currentItems.find((item) => parentBundles.includes(item.id));
      if (bundleInCart) {
        return {
          hasConflict: true,
          message: `"${bundleInCart.title}" موجودة في السلة وهي تحتوي هذا المنتج. احذف الباقة أولاً.`,
        };
      }
    }

    return { hasConflict: false, message: null };
  }, []);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      // Check for conflicts first
      const { hasConflict, message } = checkBundleConflict(product.id, prev);

      if (hasConflict) {
        // If product is a bundle, remove conflicting individual items and add bundle
        const bundleContents = BUNDLE_MAP[product.id];
        if (bundleContents) {
          const filtered = prev.filter((item) => !bundleContents.includes(item.id));
          toast.success(message || 'تم استبدال المنتجات الفردية بالباقة');
          return [...filtered, { ...product, quantity: 1 }];
        } else {
          // Product is individual and its parent bundle is in cart — block
          toast.error(message || 'هذا المنتج جزء من باقة موجودة في السلة');
          return prev;
        }
      }

      // No conflict — normal add
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        toast.success(`تم زيادة الكمية: "${product.title}"`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success(`تمت إضافة "${product.title}" إلى السلة`);
      return [...prev, { ...product, quantity: 1 }];
    });
  }, [checkBundleConflict]);

  const removeFromCart = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, conflictWarning }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
