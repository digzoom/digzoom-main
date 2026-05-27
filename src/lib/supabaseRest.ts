// Lightweight REST client for Supabase - bypasses @supabase/supabase-js
// Uses native fetch to avoid WebSocket and key format issues

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const headers: Record<string, string> = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

async function request<T>(method: string, path: string, options: { body?: unknown; params?: Record<string, string> } = {}): Promise<{ data: T | null; error: { message: string } | null }> {
  try {
    const url = new URL(`${SUPABASE_URL}/rest/v1${path}`);
    if (options.params) {
      Object.entries(options.params).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    const res = await fetch(url.toString(), {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      return { data: null, error: { message: `HTTP ${res.status}: ${text}` } };
    }

    // For HEAD/DELETE with no content
    if (res.status === 204 || res.headers.get('content-length') === '0') {
      return { data: null, error: null };
    }

    const data = await res.json() as T;
    return { data, error: null };
  } catch (e: any) {
    return { data: null, error: { message: e.message || 'Network error' } };
  }
}

// Products
export const productsApi = {
  list: (limit = 100) =>
    request<any[]>('GET', '/products', {
      params: {
        select: 'id,title,price,image_url,in_stock,is_active,category_id',
        order: 'id.desc',
        limit: String(limit),
      },
    }),

  count: () =>
    request<any>('GET', '/products', {
      params: { select: 'count', limit: '1' },
    }),

  insert: (body: Record<string, unknown>) =>
    request<any>('POST', '/products', { body }),

  update: (id: number, body: Record<string, unknown>) =>
    request<any>('PATCH', `/products?id=eq.${id}`, { body }),

  delete: (id: number) =>
    request<null>('DELETE', `/products?id=eq.${id}`),
};

// Auth helpers
export const authApi = {
  signIn: (email: string, password: string) =>
    request<{ access_token: string; user: any }>('POST', '/auth/v1/token?grant_type=password', {
      body: { email, password },
    }),

  signUp: (email: string, password: string) =>
    request<{ user: any }>('POST', '/auth/v1/signup', {
      body: { email, password },
    }),

  signOut: () =>
    request<null>('POST', '/auth/v1/logout', {}),
};
