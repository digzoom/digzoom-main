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

// ——— Recovery code exchange — uses Supabase client (PKCE flow) ———
async function exchangeRecoveryCodeFn(code: string): Promise<{ error?: string }> {
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.session) {
      return { error: error?.message || 'Invalid or expired recovery code' };
    }
    localStorage.setItem('sb_access_token', data.session.access_token);
    localStorage.setItem('sb_refresh_token', data.session.refresh_token);
    return {};
  } catch {
    return { error: 'Failed to process recovery link' };
  }
}

// ——— Fetch user profile + role from Supabase ———
async function fetchUserProfile(userId: string): Promise<{
  name: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
}> {
  try {
    // Fetch profile
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, role, phone')
      .eq('id', userId)
      .single();

    if (profileErr) {
      console.warn('[fetchUserProfile] profiles error:', profileErr.message);
    }

    // Fetch user_roles (overrides profile role if active)
    let resolvedRole: UserRole = profile?.role || 'user';
    try {
      const { data: userRole, error: roleErr } = await supabase
        .from('user_roles')
        .select('role, is_active')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleErr) {
        console.warn('[fetchUserProfile] user_roles error:', roleErr.message);
      } else if (userRole?.is_active === true && userRole?.role) {
        resolvedRole = userRole.role;
      }
    } catch (e) {
      console.warn('[fetchUserProfile] user_roles exception:', e);
    }

    return {
      name: profile?.full_name || '',
      avatar: profile?.avatar_url || undefined,
      role: resolvedRole,
      phone: profile?.phone || undefined,
    };
  } catch (e) {
    console.warn('[fetchUserProfile] exception:', e);
    return { name: '', role: 'user' };
  }
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Build User object from Supabase auth user + profile
  const buildUser = useCallback(async (authUser: any): Promise<User | null> => {
    if (!authUser?.id) return null;

    const profile = await fetchUserProfile(authUser.id);

    // Get Google avatar from user_metadata if no profile avatar
    const googleAvatar = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture;
    const googleName = authUser.user_metadata?.full_name || authUser.user_metadata?.name;

    const name = profile.name || googleName || authUser.email?.split('@')[0] || '';
    const avatar = profile.avatar || googleAvatar || '';

    console.log('[buildUser] id:', authUser.id, 'name:', name, 'role:', profile.role, 'hasAvatar:', !!avatar);

    return {
      id: authUser.id,
      email: authUser.email || '',
      name,
      avatar,
      role: profile.role,
      phone: profile.phone,
    };
  }, []);

  // Sync user from Supabase session
  const syncUser = useCallback(async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();

      if (error || !authUser) {
        console.log('[syncUser] no auth user, clearing state');
        setUser(null);
        setLoading(false);
        return;
      }

      console.log('[syncUser] authUser found:', authUser.id, 'email:', authUser.email);
      const builtUser = await buildUser(authUser);
      setUser(builtUser);
    } catch (e) {
      console.error('[syncUser] error:', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [buildUser]);

  // Listen for auth state changes + initial sync
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);

      // 1. Handle OAuth callback code in URL (Google, etc.)
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      if (code) {
        console.log('[Auth init] Found ?code= in URL, exchanging...');
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('[Auth init] exchangeCodeForSession failed:', error.message);
        } else if (data.session) {
          console.log('[Auth init] Session obtained, token length:', data.session.access_token.length);
          localStorage.setItem('sb_access_token', data.session.access_token);
          localStorage.setItem('sb_refresh_token', data.session.refresh_token);

          // Clean URL
          url.searchParams.delete('code');
          url.searchParams.delete('type');
          if (!url.hash || url.hash === '') url.hash = '#/';
          window.history.replaceState({}, '', url.toString());

          if (mounted) {
            const builtUser = await buildUser(data.session.user);
            setUser(builtUser);
            setLoading(false);
          }
          return;
        }
      }

      // 2. Fallback: check stored token
      const token = localStorage.getItem('sb_access_token');
      if (token) {
        console.log('[Auth init] Found stored token, syncing...');
        await syncUser();
      } else {
        console.log('[Auth init] No token found');
        setUser(null);
        setLoading(false);
      }
    };

    init();

    // 3. Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth onAuthStateChange] event:', event, 'hasSession:', !!session);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user && mounted) {
          localStorage.setItem('sb_access_token', session.access_token);
          localStorage.setItem('sb_refresh_token', session.refresh_token);
          const builtUser = await buildUser(session.user);
          setUser(builtUser);
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('sb_access_token');
        localStorage.removeItem('sb_refresh_token');
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [buildUser, syncUser]);

  // Email/Password Login
  const login = useCallback(async (email: string, password: string) => {
    console.log('[login] attempting for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      console.error('[login] failed:', error?.message);
      return { error: error?.message || 'Login failed' };
    }

    console.log('[login] success, token length:', data.session.access_token.length);
    localStorage.setItem('sb_access_token', data.session.access_token);
    localStorage.setItem('sb_refresh_token', data.session.refresh_token);

    const builtUser = await buildUser(data.session.user);
    setUser(builtUser);
    return {};
  }, [buildUser]);

  // Register
  const register = useCallback(async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) return { error: error.message || 'Registration failed' };
    return {};
  }, []);

  // Logout
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sb_access_token');
    localStorage.removeItem('sb_refresh_token');
    setUser(null);
  }, []);

  // Password Reset — send recovery email
  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { error: error.message || 'Failed to send reset email' };
    return { success: true };
  }, []);

  // Password Reset — update password
  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message || 'Failed to update password' };
    return {};
  }, []);

  // Google OAuth
  const signInWithGoogle = useCallback(async () => {
    const redirectTo = `${window.location.origin}/#/`;
    console.log('[Google OAuth] redirectTo:', redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      console.error('[Google OAuth] error:', error);
      throw new Error(error.message);
    }

    if (data?.url) {
      console.log('[Google OAuth] redirecting to:', data.url);
      window.location.href = data.url;
    } else {
      throw new Error('No redirect URL returned');
    }
  }, []);

  const isAdmin = user?.role === 'admin';
  const isSupport = user?.role === 'support' || isAdmin;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isLoading: loading,
      login,
      register,
      resetPassword,
      updatePassword,
      exchangeRecoveryCode: exchangeRecoveryCodeFn,
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
