import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { toast } from 'sonner';
import i18n from '@/i18n/i18n';
import type { Session, UserMetadata } from '@supabase/supabase-js';
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
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string; success?: boolean }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
  exchangeRecoveryCode: (code: string) => Promise<{ error?: string }>;
  logout: () => Promise<{ error?: string }>;
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
async function restQuery(token: string, table: string, select: string, eq: { col: string; val: string }, signal: AbortSignal) {
  let url = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select)}`;
  if (eq) url += `&${eq.col}=eq.${encodeURIComponent(eq.val)}`;
  url += '&limit=1';

  const res = await fetch(url, {
    headers: makeUserHeaders(token),
    signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]),
  });
  return res;
}

// Fetch profile + role using USER token (passes RLS)
async function loadProfile(token: string, userId: string, email: string, metadata: UserMetadata, signal: AbortSignal): Promise<User> {

  // 1. Query profiles
  const profileRes = await restQuery(token, 'profiles', 'full_name,avatar_url,role,phone', { col: 'id', val: userId }, signal);
  const profiles = await profileRes.json().catch(() => []);
  const profile = Array.isArray(profiles) ? profiles[0] : profiles;

  // 2. Query user_roles
  const rolesRes = await restQuery(token, 'user_roles', 'role,is_active', { col: 'user_id', val: userId }, signal);
  const userRoles = await rolesRes.json().catch(() => []);
  const ur = Array.isArray(userRoles) ? userRoles[0] : userRoles;

  // 3. Resolve role
  let resolvedRole: UserRole = 'user';
  if (ur?.is_active === true && ur?.role) {
    resolvedRole = ur.role;
  } else if (profile?.role) {
    resolvedRole = profile.role;
  }

  // 4. Resolve name
  const name = profile?.full_name || metadata?.full_name || metadata?.name || email?.split('@')[0] || '';

  // 5. Resolve avatar
  const avatar = profile?.avatar_url || metadata?.avatar_url || metadata?.picture || '';


  return {
    id: userId,
    email: email || '',
    name,
    avatar,
    role: resolvedRole,
    phone: profile?.phone || '',
  };
}

// StrictMode can mount twice while the one-time PKCE exchange is in flight.
// Share only that pending operation, never a session or completed code.
let pendingExchange: { code: string; result: ReturnType<typeof supabase.auth.exchangeCodeForSession> } | null = null;
function exchangeCode(code: string) {
  if (pendingExchange?.code === code) return pendingExchange.result;
  const exchange = { code, result: supabase.auth.exchangeCodeForSession(code) };
  pendingExchange = exchange;
  const clear = () => { if (pendingExchange === exchange) pendingExchange = null; };
  void exchange.result.then(clear, clear);
  return exchange.result;
}

// Recovery code exchange (uses Supabase client for PKCE)
async function exchangeRecoveryCodeFn(code: string): Promise<{ error?: string }> {
  try {
    const { data, error } = await exchangeCode(code);
    if (error || !data.session) return { error: error?.message || 'Invalid recovery code' };
    return {};
  } catch {
    return { error: 'Failed to process recovery link' };
  }
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);
  const currentSession = useRef<Session | null>(null);
  const revision = useRef(0);
  const profileRequest = useRef<AbortController | null>(null);
  const profileResult = useRef<Promise<void> | null>(null);

  // The SDK owns persistence, expiry and token rotation. These legacy mirrors
  // support the non-tRPC API callers; they are never used to restore a session.
  const applySession = useCallback((next: Session | null, reload = false): Promise<void> => {
    if (!mounted.current) return Promise.resolve();
    const previous = currentSession.current;
    if (!reload && next && previous?.access_token === next.access_token && profileResult.current) {
      return profileResult.current;
    }

    const requestRevision = ++revision.current;
    profileRequest.current?.abort();
    currentSession.current = next;
    setSession(next);

    if (!next) {
      localStorage.removeItem('sb_access_token');
      localStorage.removeItem('sb_refresh_token');
      profileResult.current = null;
      setUser(null);
      setLoading(false);
      return Promise.resolve();
    }

    localStorage.setItem('sb_access_token', next.access_token);
    localStorage.setItem('sb_refresh_token', next.refresh_token);
    if (previous?.user.id !== next.user.id) {
      setUser(null);
      setLoading(true);
    }

    const controller = new AbortController();
    profileRequest.current = controller;
    const isCurrent = () => mounted.current && revision.current === requestRevision;
    const result = (async () => {
      try {
        const profile = await loadProfile(
          next.access_token, next.user.id, next.user.email || '', next.user.user_metadata,
          controller.signal,
        );
        if (isCurrent()) setUser(profile);
      } catch (error) {
        if (isCurrent() && !controller.signal.aborted) {
          console.error('[AUTH] Profile load failed:', error);
          profileResult.current = null;
          setUser(null);
        }
      } finally {
        if (isCurrent()) setLoading(false);
      }
    })();
    profileResult.current = result;
    return result;
  }, []);

  // Restore the SDK session and handle OAuth/recovery callbacks. A later auth
  // event always wins over an older restoration or profile response.
  useEffect(() => {
    mounted.current = true;
    let active = true;
    const initialRevision = revision.current;
    const { data: listener } = supabase.auth.onAuthStateChange((event, next) => {
      // getSession below handles initialization, including PKCE exchange.
      if (active && event !== 'INITIAL_SESSION') {
        // Keep the SDK callback synchronous: awaiting SDK calls here can deadlock.
        void applySession(next, event === 'USER_UPDATED');
      }
    });

    const init = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        if (code) {
          const { error } = await exchangeCode(code);
          if (!active) return;
          if (error) {
            console.error('[AUTH] exchangeCodeForSession failed:', error.message);
          } else {
            url.searchParams.delete('code');
            url.searchParams.delete('type');
            window.history.replaceState({}, '', url.pathname + url.search + url.hash);
            if (url.pathname === '/auth/callback') {
              window.location.replace('/');
              return;
            }
          }
        }

        const { data: { session: restored }, error } = await supabase.auth.getSession();
        if (error) console.error('[AUTH] getSession failed:', error.message);
        if (active && revision.current === initialRevision) await applySession(restored);
      } catch (error) {
        console.error('[AUTH] Session initialization failed:', error);
        if (active && revision.current === initialRevision) await applySession(null);
      }
    };
    void init();

    return () => {
      active = false;
      mounted.current = false;
      // This is a generation counter, not a captured DOM ref.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ++revision.current;
      profileRequest.current?.abort();
      profileResult.current = null;
      listener.subscription.unsubscribe();
    };
  }, [applySession]);

  const login = useCallback(async (email: string, password: string) => {
    // This stores the full session and starts the SDK's existing refresh lifecycle.
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) return { error: error?.message || 'Login failed' };
    // SIGNED_IN has already applied this session. Do not replay an older
    // result if another sign-in/sign-out happened while this request finished.
    if (currentSession.current?.access_token === data.session.access_token) {
      await profileResult.current;
    }
    return {};
  }, []);

  // Register
  const register = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  // Keep the SDK's existing (global) sign-out scope and clear UI only on success.
  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.dismiss('auth-sign-out-error');
      return {};
    } catch {
      const message = i18n.language === 'en'
        ? "Couldn't sign out. Please try again."
        : 'تعذر تسجيل الخروج. حاول مرة أخرى.';
      toast.error(message, { id: 'auth-sign-out-error', duration: 5000 });
      return { error: message };
    }
  }, []);

  // Password Reset
  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { error: error.message };
    return { success: true };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return {};
  }, []);

  // Google OAuth — PKCE
  const signInWithGoogle = useCallback(async () => {
    const redirectTo = window.location.origin;
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
      user, session, loading, isLoading: loading,
      login, register, resetPassword, updatePassword,
      exchangeRecoveryCode: exchangeRecoveryCodeFn,
      logout, signInWithGoogle, isAdmin, isSupport,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- Keep the context hook beside its provider.
export function useSupabaseAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider');
  return ctx;
}
