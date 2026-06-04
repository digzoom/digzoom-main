import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signInWithGoogle: () => Promise<void>;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabaseAuth = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Map supabase user to our User interface
  const user: User | null = supabaseAuth.user
    ? {
        id: supabaseAuth.user.id,
        name: supabaseAuth.user.name,
        email: supabaseAuth.user.email,
        role: supabaseAuth.user.role as 'user' | 'admin',
        avatar: supabaseAuth.user.avatar,
      }
    : null;

  // Sync loading state from supabase auth
  useEffect(() => {
    setIsLoading(supabaseAuth.loading);
  }, [supabaseAuth.loading]);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const result = await supabaseAuth.login(email, password);
      return !result.error;
    },
    [supabaseAuth]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      const result = await supabaseAuth.register(email, password, name);
      return !result.error;
    },
    [supabaseAuth]
  );

  const logout = useCallback(() => {
    supabaseAuth.logout();
  }, [supabaseAuth]);

  const signInWithGoogle = useCallback(async () => {
    await supabaseAuth.signInWithGoogle();
  }, [supabaseAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        signInWithGoogle,
        isAdmin: supabaseAuth.isAdmin,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
