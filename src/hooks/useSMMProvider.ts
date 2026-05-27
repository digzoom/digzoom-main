import { useState, useCallback } from 'react';

export interface ProviderConfig {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  active: boolean;
}

export interface SMMServicesResponse {
  service: number;
  name: string;
  category: string;
  rate: string;
  min: string;
  max: string;
  type: string;
  refill: string;
  dripfeed: string;
}

export interface OrderResponse {
  order: number;
  status?: string;
  error?: string;
}

// Mock provider for demo - replace with real API calls
const DEMO_SERVICES: SMMServicesResponse[] = [
  { service: 1, name: 'TikTok Followers - Arab', category: 'TikTok', rate: '0.015', min: '100', max: '50000', type: 'Default', refill: 'No', dripfeed: 'No' },
  { service: 2, name: 'TikTok Likes - HQ', category: 'TikTok', rate: '0.005', min: '100', max: '100000', type: 'Default', refill: 'No', dripfeed: 'No' },
  { service: 3, name: 'TikTok Views - Instant', category: 'TikTok', rate: '0.003', min: '1000', max: '1000000', type: 'Default', refill: 'No', dripfeed: 'No' },
  { service: 10, name: 'Instagram Followers - Arab', category: 'Instagram', rate: '0.018', min: '100', max: '50000', type: 'Default', refill: '30 days', dripfeed: 'No' },
  { service: 11, name: 'Instagram Likes', category: 'Instagram', rate: '0.006', min: '100', max: '100000', type: 'Default', refill: 'No', dripfeed: 'No' },
  { service: 12, name: 'Instagram Views', category: 'Instagram', rate: '0.004', min: '1000', max: '1000000', type: 'Default', refill: 'No', dripfeed: 'No' },
  { service: 20, name: 'YouTube Views - HR', category: 'YouTube', rate: '0.012', min: '1000', max: '500000', type: 'Default', refill: 'No', dripfeed: 'No' },
  { service: 21, name: 'YouTube Subscribers', category: 'YouTube', rate: '0.035', min: '100', max: '10000', type: 'Default', refill: '30 days', dripfeed: 'No' },
  { service: 30, name: 'Twitter Followers', category: 'Twitter', rate: '0.020', min: '100', max: '50000', type: 'Default', refill: 'No', dripfeed: 'No' },
  { service: 40, name: 'WhatsApp Channel Followers', category: 'WhatsApp', rate: '0.012', min: '100', max: '50000', type: 'Default', refill: 'No', dripfeed: 'No' },
  { service: 50, name: 'Jaco Live Support', category: 'Jaco', rate: '0.025', min: '50', max: '10000', type: 'Default', refill: 'No', dripfeed: 'No' },
  { service: 60, name: 'Telegram Members', category: 'Telegram', rate: '0.015', min: '100', max: '100000', type: 'Default', refill: 'No', dripfeed: 'No' },
];

export function useSMMProvider() {
  const [providers, setProviders] = useState<ProviderConfig[]>(() => {
    try {
      const saved = localStorage.getItem('digzoom_smm_providers');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save providers
  const saveProviders = useCallback((newProviders: ProviderConfig[]) => {
    setProviders(newProviders);
    localStorage.setItem('digzoom_smm_providers', JSON.stringify(newProviders));
  }, []);

  // Add provider
  const addProvider = useCallback((config: Omit<ProviderConfig, 'id'>) => {
    const newProvider: ProviderConfig = { ...config, id: Date.now().toString() };
    saveProviders([...providers, newProvider]);
    return newProvider;
  }, [providers, saveProviders]);

  // Remove provider
  const removeProvider = useCallback((id: string) => {
    saveProviders(providers.filter(p => p.id !== id));
  }, [providers, saveProviders]);

  // Toggle provider
  const toggleProvider = useCallback((id: string) => {
    saveProviders(providers.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }, [providers, saveProviders]);

  // Get services from provider (REAL API or DEMO)
  const getServices = useCallback(async (providerId?: string): Promise<SMMServicesResponse[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = providerId ? providers.find(p => p.id === providerId && p.active) : providers.find(p => p.active);
      
      // If no real provider configured, return demo services
      if (!provider) {
        await new Promise(r => setTimeout(r, 500)); // Simulate network
        return DEMO_SERVICES;
      }

      // REAL API CALL - Uncomment when you have a real provider
      /*
      const response = await fetch(`${provider.apiUrl}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: provider.apiKey, action: 'services' }),
      });
      const data = await response.json();
      return data;
      */

      // For now, return demo with real provider flag
      await new Promise(r => setTimeout(r, 800));
      return DEMO_SERVICES.map(s => ({ ...s, name: `[${provider.name}] ${s.name}` }));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
      return DEMO_SERVICES;
    } finally {
      setLoading(false);
    }
  }, [providers]);

  // Place order (REAL API or DEMO)
  const placeOrder = useCallback(async (
    _serviceId: number,
    _link: string,
    _quantity: number,
    providerId?: string
  ): Promise<OrderResponse> => {
    setLoading(true);
    setError(null);

    try {
      const provider = providerId ? providers.find(p => p.id === providerId && p.active) : providers.find(p => p.active);

      // If no real provider, return mock order
      if (!provider) {
        await new Promise(r => setTimeout(r, 1500));
        return { order: Math.floor(Math.random() * 900000 + 100000), status: 'pending' };
      }

      // REAL API CALL - Uncomment when ready
      /*
      const response = await fetch(`${provider.apiUrl}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: provider.apiKey,
          action: 'add',
          service: serviceId,
          link: link,
          quantity: quantity,
        }),
      });
      const data = await response.json();
      return data;
      */

      // Demo mode
      await new Promise(r => setTimeout(r, 2000));
      const orderId = Math.floor(Math.random() * 900000 + 100000);
      return { order: orderId, status: 'pending' };

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
      return { order: 0, error: 'Failed to place order' };
    } finally {
      setLoading(false);
    }
  }, [providers]);

  // Check order status
  const checkOrderStatus = useCallback(async (orderId: number, providerId?: string): Promise<any> => {
    const provider = providerId ? providers.find(p => p.id === providerId && p.active) : providers.find(p => p.active);

    if (!provider) {
      // Simulate status changes
      const statuses = ['pending', 'processing', 'processing', 'completed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      return { order: orderId, status: randomStatus, remains: '0', start_count: '100' };
    }

    // REAL API CALL
    /*
    const response = await fetch(`${provider.apiUrl}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: provider.apiKey, action: 'status', order: orderId }),
    });
    return await response.json();
    */

    return { order: orderId, status: 'completed', remains: '0', start_count: '100' };
  }, [providers]);

  // Get balance
  const getBalance = useCallback(async (providerId?: string): Promise<number> => {
    const provider = providerId ? providers.find(p => p.id === providerId && p.active) : providers.find(p => p.active);
    
    if (!provider) return 125.50; // Demo balance

    // REAL API CALL
    /*
    const response = await fetch(`${provider.apiUrl}/account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: provider.apiKey, action: 'balance' }),
    });
    const data = await response.json();
    return parseFloat(data.balance);
    */

    return 125.50;
  }, [providers]);

  return {
    providers,
    loading,
    error,
    addProvider,
    removeProvider,
    toggleProvider,
    getServices,
    placeOrder,
    checkOrderStatus,
    getBalance,
  };
}
