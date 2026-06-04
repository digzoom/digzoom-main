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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string; success?: boolean }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
  exchangeRecoveryCode: (code: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  isAdmin: boolean;
  isSupport: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Build headers with USER'S token so RLS allows the query
function makeUserHeaders(token: string) {
  return {
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Generic REST fetch helper
async function restQuery(token: string, table: string, select: string, eq?: { col: string; val: string }) {
  let url = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select)}`;
  if (eq) url += `&${eq.col}=eq.${encodeURIComponent(eq.val)}`;
  url += '&limit=1';

  const res = await fetch(url, {
    headers: makeUserHeaders(token),
    signal: AbortSignal.timeout(10000),
  });
  return res;
}

// Fetch profile + role using USER token (passes RLS)
async function loadProfile(token: string, userId: string, email: string, metadata: any): Promise<User> {
  console.log('[AUTH] loadProfile for userId:', userId);

  // 1. Query profiles
  const profileRes = await restQuery(token, 'profiles', 'full_name,avatar_url,role,phone', { col: 'id', val: userId });
  console.log('[AUTH] profiles response status:', profileRes.status);
  const profiles = await profileRes.json().catch(() => []);
  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  console.log('[AUTH] profiles data:', JSON.stringify(profile || {}));

  // 2. Query user_roles
  const rolesRes = await restQuery(token, 'user_roles', 'role,is_active', { col: 'user_id', val: userId });
  console.log('[AUTH] user_roles response status:', rolesRes.status);
  const userRoles = await rolesRes.json().catch(() => []);
  const ur = Array.isArray(userRoles) ? userRoles[0] : userRoles;
  console.log('[AUTH] user_roles data:', JSON.stringify(ur || {}));

  // 3. Resolve role
  let resolvedRole: UserRole = 'user';
  if (ur?.is_active === true && ur?.role) {
    resolvedRole = ur.role;
    console.log('[AUTH] role from user_roles:', resolvedRole);
  } else if (profile?.role) {
    resolvedRole = profile.role;
    console.log('[AUTH] role from profiles:', resolvedRole);
  } else {
    console.log('[AUTH] no role found, defaulting to user');
  }

  // 4. Resolve name
  const name = profile?.full_name || metadata?.full_name || metadata?.name || email?.split('@')[0] || '';

  // 5. Resolve avatar
  const avatar = profile?.avatar_url || metadata?.avatar_url || metadata?.picture || '';

  console.log('[AUTH] FINAL name:', name, 'role:', resolvedRole, 'hasAvatar:', !!avatar);

  return {
    id: userId,
    email: email || '',
    name,
    avatar,
    role: resolvedRole,
    phone: profile?.phone || '',
  };
}

// Recovery code exchange (uses Supabase client for PKCE)
async function exchangeRecoveryCodeFn(code: string): Promise<{ error?: string }> {
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.session) return { error: error?.message || 'Invalid recovery code' };
    localStorage.setItem('sb_access_token', data.session.access_token);
    localStorage.setItem('sb_refresh_token', data.session.refresh_token);
    return {};
  } catch {
    return { error: 'Failed to process recovery link' };
  }
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Core: load user from token
  const loadUser = useCallback(async (token: string) => {
    console.log('[AUTH] loadUser token length:', token?.length);
    try {
      // Get auth user info
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: makeUserHeaders(token),
        signal: AbortSignal.timeout(10000),
      });
      console.log('[AUTH] /auth/v1/user status:', res.status);

      if (!res.ok) {
        console.error('[AUTH] /auth/v1/user FAILED');
        localStorage.removeItem('sb_access_token');
        setUser(null);
        return;
      }

      const authUser = await res.json();
      console.log('[AUTH] authUser id:', authUser.id);
      console.log('[AUTH] expected admin: 866de745-c743-4611-b6b1-839470b3cf4a');
      console.log('[AUTH] IDs match:', authUser.id === '866de745-c743-4611-b6b1-839470b3cf4a');

      // Load profile + role with user token (passes RLS)
      const userData = await loadProfile(token, authUser.id, authUser.email, authUser.user_metadata);
      setUser(userData);
    } catch (e) {
      console.error('[AUTH] loadUser exception:', e);
      setUser(null);
    }
  }, []);

  // Mount: handle OAuth callback + restore session
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      console.log('[AUTH] === init ===');

      // 1. Check for PKCE OAuth callback (?code= in search params)
      // We use detectSessionInUrl=false so we handle this manually.
      // redirectTo in signInWithOAuth is window.location.origin (no hash),
      // so ?code= appears in window.location.search, NOT in the hash fragment.
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      if (code) {
        console.log('[AUTH] PKCE callback detected, code:', code.substring(0, 8) + '...');
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('[AUTH] exchangeCodeForSession FAILED:', error.message);
        } else if (data.session) {
          console.log('[AUTH] PKCE SUCCESS! token length:', data.session.access_token.length);
          localStorage.setItem('sb_access_token', data.session.access_token);
          localStorage.setItem('sb_refresh_token', data.session.refresh_token);

          // Remove ?code= from URL and redirect to HashRouter root
          url.searchParams.delete('code');
          url.searchParams.delete('type');
          window.location.href = url.toString() + '#/';
          return; // Page will reload
        }
      }

      // 2. No callback code — check for existing session via Supabase client
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('[AUTH] getSession error:', error.message);
      }

      if (session?.access_token) {
        console.log('[AUTH] Session found! token length:', session.access_token.length);
        localStorage.setItem('sb_access_token', session.access_token);
        localStorage.setItem('sb_refresh_token', session.refresh_token);
        if (mounted) await loadUser(session.access_token);
      } else {
        // Fallback: try stored token
        const token = localStorage.getItem('sb_access_token');
        if (token) {
          console.log('[AUTH] No session, trying stored token');
          if (mounted) await loadUser(token);
        } else {
          console.log('[AUTH] No session, no token');
          if (mounted) setUser(null);
        }
      }

      if (mounted) setLoading(false);
    };

    init();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AUTH] onAuthStateChange:', event, 'hasSession:', !!session);
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        localStorage.setItem('sb_access_token', session.access_token);
        if (mounted) await loadUser(session.access_token);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('sb_access_token');
        localStorage.removeItem('sb_refresh_token');
        if (mounted) setUser(null);
      }
      if (mounted) setLoading(false);
    });

    return () => { mounted = false; listener?.subscription?.unsubscribe(); };
  }, [loadUser]);

  // Email/Password Login
  const login = useCallback(async (email: string, password: string) => {
    const { ok, data } = await (async () => {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(15000),
      });
      const d = await r.json().catch(() => ({}));
      return { ok: r.ok, data: d };
    })();

    if (!ok || !data.access_token) return { error: data?.msg || data?.message || 'Login failed' };

    localStorage.setItem('sb_access_token', data.access_token);
    await loadUser(data.access_token);
    return {};
  }, [loadUser]);

  // Register
  const register = useCallback(async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  // Logout
  const logout = useCallback(async () => {
    const token = localStorage.getItem('sb_access_token');
    if (token) {
      try {
        await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
          method: 'POST',
          headers: makeUserHeaders(token),
          signal: AbortSignal.timeout(10000),
        });
      } catch { /* ignore */ }
    }
    await supabase.auth.signOut();
    localStorage.removeItem('sb_access_token');
    localStorage.removeItem('sb_refresh_token');
    setUser(null);
  }, []);

  // Password Reset
  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { error: error.message };
    return { success: true };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return {};
  }, []);

  // Google OAuth — PKCE
  // redirectTo WITHOUT hash: Supabase backend appends ?code= to origin.
  // After callback we manually redirect to /#/ for HashRouter.
  const signInWithGoogle = useCallback(async () => {
    const redirectTo = window.location.origin; // e.g. https://digzoom.com
    console.log('[AUTH] signInWithOAuth redirectTo:', redirectTo);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) throw new Error(error.message);
    if (data?.url) window.location.href = data.url;
  }, []);

  const isAdmin = user?.role === 'admin';
  const isSupport = user?.role === 'support' || isAdmin;

  return (
    <AuthContext.Provider value={{
      user, loading, isLoading: loading,
      login, register, resetPassword, updatePassword,
      exchangeRecoveryCode: exchangeRecoveryCodeFn,
      logout, signInWithGoogle, isAdmin, isSupport,
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
