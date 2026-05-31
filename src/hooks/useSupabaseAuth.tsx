import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/types/database';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  isAdmin: boolean;
  isSupport: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const apiHeaders = {
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
};

async function authApi(endpoint: string, body: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${endpoint}`, {
    method: 'POST',
    headers: apiHeaders,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check saved session on mount
  useEffect(() => {
    const token = localStorage.getItem('sb_access_token');
    const refresh = localStorage.getItem('sb_refresh_token');
    console.log('[SupabaseAuthProvider mount] sb_access_token exists?', !!token, 'length:', token?.length || 0, 'sb_refresh_token exists?', !!refresh);
    if (token) {
      loadUser(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (token: string): Promise<boolean> => {
    console.log('[loadUser] token length:', token.length);
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'apikey': ANON_KEY,
          'Authorization': `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(10000),
      });
      console.log('[loadUser] /auth/v1/user res.ok?', res.ok, 'status:', res.status);
      if (!res.ok) {
        console.warn('[loadUser] /auth/v1/user FAILED - removing token');
        localStorage.removeItem('sb_access_token');
        setUser(null);
        return false;
      }
      const authUser = await res.json();
      if (!authUser.id) {
        setUser(null);
        return false;
      }

      // Fetch profile with role
      const profileRes = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?select=role,full_name,avatar_url,phone&id=eq.${authUser.id}&limit=1`,
        { headers: apiHeaders, signal: AbortSignal.timeout(10000) }
      );
      const profiles = await profileRes.json().catch(() => []);
      const profile = profiles?.[0] || {};
      console.log('[loadUser] profile role:', profile.role, 'name:', profile.full_name);

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        name: profile.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
        avatar: profile.avatar_url || authUser.user_metadata?.avatar_url || '',
        role: profile.role || 'user',
        phone: profile.phone || '',
      });
      return true;
    } catch {
      setUser(null);
      return false;
    }
  };

  // Email/Password Login
  const login = useCallback(async (email: string, password: string) => {
    console.log('[login] attempting login for:', email);
    const { ok, data } = await authApi('token?grant_type=password', { email, password });
    console.log('[login] authApi ok?', ok, 'has access_token?', !!data?.access_token, 'token length:', data?.access_token?.length || 0);
    if (!ok || !data.access_token) {
      console.error('[login] FAILED:', data?.msg || data?.message || 'No access_token');
      return { error: data.msg || data.message || 'Login failed' };
    }
    console.log('[login] SUCCESS - saving token to localStorage');
    localStorage.setItem('sb_access_token', data.access_token);
    localStorage.setItem('sb_refresh_token', data.refresh_token || '');
    console.log('[login] localStorage sb_access_token set?', !!localStorage.getItem('sb_access_token'));
    await loadUser(data.access_token);
    return {};
  }, []);

  // Register
  const register = useCallback(async (email: string, password: string, name: string) => {
    const { ok, data } = await authApi('signup', {
      email,
      password,
      data: { full_name: name },
    });
    if (!ok) return { error: data.msg || data.message || 'Registration failed' };
    return {};
  }, []);

  // Logout
  const logout = useCallback(async () => {
    const token = localStorage.getItem('sb_access_token');
    if (token) {
      try {
        await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
          method: 'POST',
          headers: {
            'apikey': ANON_KEY,
            'Authorization': `Bearer ${token}`,
          },
          signal: AbortSignal.timeout(10000),
        });
      } catch { /* ignore */ }
    }
    localStorage.removeItem('sb_access_token');
    localStorage.removeItem('sb_refresh_token');
    setUser(null);
  }, []);

  // Google OAuth
  const signInWithGoogle = useCallback(async () => {
    const redirectTo = `${window.location.origin}/`;
    const { ok, data } = await authApi('authorize', {
      provider: 'google',
      redirect_to: redirectTo,
    });
    if (ok && data?.url) {
      window.location.href = data.url;
    }
  }, []);

  const isAdmin = user?.role === 'admin';
  const isSupport = user?.role === 'support' || isAdmin;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      signInWithGoogle,
      isAdmin,
      isSupport,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider');
  return ctx;
}
