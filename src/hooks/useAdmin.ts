import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types';

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  platform: string;
  service: string;
  serviceAr: string;
  link: string;
  quantity: number;
  price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
  type: 'digital' | 'marketing';
  notes: string;
  createdAt: string;
  updatedAt: string;
  providerOrderId?: string;
}

export interface SMMProvider {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  active: boolean;
  balance: number;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayRevenue: number;
}

const STORAGE_KEY_ORDERS = 'digzoom_admin_orders';
const STORAGE_KEY_PROVIDERS = 'digzoom_admin_providers';
const STORAGE_KEY_SETTINGS = 'digzoom_admin_settings';
const STORAGE_KEY_ADMIN_PRODUCTS = 'digzoom_admin_products';

const generateId = () => Math.random().toString(36).substring(2, 10).toUpperCase();
let nextProductId = 10000;

const getTodayDate = () => new Date().toISOString().split('T')[0];

// Demo orders
const demoOrders: AdminOrder[] = [
  {
    id: 'DZ001',
    customerName: 'أحمد السعود',
    customerPhone: '966501234567',
    platform: 'تيك توك',
    service: 'Followers',
    serviceAr: 'زيادة متابعين تيك توك',
    link: 'https://tiktok.com/@ahmed123',
    quantity: 1000,
    price: 15,
    status: 'completed',
    type: 'digital',
    notes: '',
    createdAt: '2026-05-22T10:00:00',
    updatedAt: '2026-05-22T11:30:00',
    providerOrderId: 'EZK-8832',
  },
  {
    id: 'DZ002',
    customerName: 'سارة القحطاني',
    customerPhone: '966502345678',
    platform: 'إنستقرام',
    service: 'Likes',
    serviceAr: 'زيادة لايكات إنستقرام',
    link: 'https://instagram.com/sarah_design',
    quantity: 5000,
    price: 30,
    status: 'processing',
    type: 'digital',
    notes: 'العميلة عاجلة',
    createdAt: '2026-05-22T14:00:00',
    updatedAt: '2026-05-22T14:05:00',
    providerOrderId: 'EZK-8835',
  },
  {
    id: 'DZ003',
    customerName: 'محمد العتيبي',
    customerPhone: '966503456789',
    platform: 'جاكو',
    service: 'Live Views',
    serviceAr: 'زيادة دعم لايف جاكو',
    link: 'https://jaco.com/u/mohammed_live',
    quantity: 500,
    price: 25,
    status: 'pending',
    type: 'digital',
    notes: 'ينتظر تأكيد الدفع',
    createdAt: '2026-05-22T16:00:00',
    updatedAt: '2026-05-22T16:00:00',
  },
  {
    id: 'DZ004',
    customerName: 'نورة الدوسري',
    customerPhone: '966504567890',
    platform: 'واتساب',
    service: 'Channel Followers',
    serviceAr: 'زيادة متابعين قناة واتساب',
    link: 'https://whatsapp.com/channel/nora_fashion',
    quantity: 2000,
    price: 24,
    status: 'pending',
    type: 'digital',
    notes: '',
    createdAt: '2026-05-22T17:00:00',
    updatedAt: '2026-05-22T17:00:00',
  },
  {
    id: 'DZ005',
    customerName: 'فهد الشمري',
    customerPhone: '966505678901',
    platform: 'تيك توك',
    service: 'إدارة حسابات',
    serviceAr: 'إدارة حسابات السوشال ميديا',
    link: 'https://tiktok.com/@fahd_store',
    quantity: 1,
    price: 500,
    status: 'processing',
    type: 'marketing',
    notes: 'تم الدفع - بدء التنفيذ الغد',
    createdAt: '2026-05-21T09:00:00',
    updatedAt: '2026-05-22T08:00:00',
  },
];

export function useAdmin() {
  const [orders, setOrders] = useState<AdminOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(demoOrders));
      return demoOrders;
    } catch {
      return demoOrders;
    }
  });

  const [providers, setProviders] = useState<SMMProvider[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROVIDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [autoProcess, setAutoProcess] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? JSON.parse(saved).autoProcess : false;
    } catch {
      return false;
    }
  });

  // Product management state
  const [adminProducts, setAdminProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADMIN_PRODUCTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save orders
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Save providers
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROVIDERS, JSON.stringify(providers));
  }, [providers]);

  // Save settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({ autoProcess }));
  }, [autoProcess]);

  // Save admin products
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADMIN_PRODUCTS, JSON.stringify(adminProducts));
  }, [adminProducts]);

  // Stats
  const stats: DashboardStats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    processingOrders: orders.filter(o => o.status === 'processing').length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.price, 0),
    todayRevenue: orders
      .filter(o => o.status === 'completed' && o.createdAt.startsWith(getTodayDate()))
      .reduce((sum, o) => sum + o.price, 0),
  };

  // Add order
  const addOrder = useCallback((order: Omit<AdminOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: AdminOrder = {
      ...order,
      id: `DZ${generateId()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  // Update order status
  const updateOrderStatus = useCallback((orderId: string, status: AdminOrder['status'], notes?: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status, notes: notes || o.notes, updatedAt: new Date().toISOString() }
          : o
      )
    );
  }, []);

  // Process order automatically (simulation)
  const processOrder = useCallback((orderId: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status: 'processing' as const, updatedAt: new Date().toISOString(), providerOrderId: `EZK-${Math.floor(Math.random() * 9000 + 1000)}` }
          : o
      )
    );

    // Simulate completion after 5 seconds
    setTimeout(() => {
      setOrders(prev =>
        prev.map(o =>
          o.id === orderId
            ? { ...o, status: 'completed' as const, updatedAt: new Date().toISOString() }
            : o
        )
      );
    }, 5000);
  }, []);

  // Auto-process pending orders
  useEffect(() => {
    if (!autoProcess) return;
    const pendingOrders = orders.filter(o => o.status === 'pending' && o.type === 'digital');
    pendingOrders.forEach(order => {
      setTimeout(() => processOrder(order.id), 2000);
    });
  }, [autoProcess, orders, processOrder]);

  // Delete order
  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  // Add provider
  const addProvider = useCallback((provider: Omit<SMMProvider, 'id'>) => {
    const newProvider: SMMProvider = {
      ...provider,
      id: generateId(),
    };
    setProviders(prev => [...prev, newProvider]);
    return newProvider;
  }, []);

  // Remove provider
  const removeProvider = useCallback((providerId: string) => {
    setProviders(prev => prev.filter(p => p.id !== providerId));
  }, []);

  // Filter orders
  const getFilteredOrders = useCallback(
    (status?: string, type?: string, search?: string) => {
      return orders.filter(o => {
        if (status && o.status !== status) return false;
        if (type && o.type !== type) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            o.id.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.platform.toLowerCase().includes(q) ||
            o.serviceAr.toLowerCase().includes(q)
          );
        }
        return true;
      });
    },
    [orders]
  );

  // Product CRUD
  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: nextProductId++,
    };
    setAdminProducts(prev => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((productId: number, updates: Partial<Product>) => {
    setAdminProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, ...updates } : p)
    );
  }, []);

  const deleteProduct = useCallback((productId: number) => {
    setAdminProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const getFilteredProducts = useCallback((search?: string, category?: string) => {
    return adminProducts.filter(p => {
      if (category && p.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [adminProducts]);

  return {
    orders,
    stats,
    providers,
    adminProducts,
    autoProcess,
    setAutoProcess,
    addOrder,
    updateOrderStatus,
    processOrder,
    deleteOrder,
    addProvider,
    removeProvider,
    getFilteredOrders,
    addProduct,
    updateProduct,
    deleteProduct,
    getFilteredProducts,
  };
}
