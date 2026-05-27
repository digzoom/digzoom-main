import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

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

// Demo accounts for testing
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@digzoom.com': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Admin',
      email: 'admin@digzoom.com',
      role: 'admin',
    },
  },
  'user@digzoom.com': {
    password: 'user123',
    user: {
      id: '2',
      name: 'Demo User',
      email: 'user@digzoom.com',
      role: 'user',
    },
  },
};

const STORAGE_KEY = 'digzoom-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.email) {
          setUser(parsed);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const found = DEMO_USERS[email.toLowerCase()];
    if (found && found.password === password) {
      setUser(found.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found.user));
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    const key = email.toLowerCase();
    if (DEMO_USERS[key]) return false;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email: key,
      role: 'user',
    };

    DEMO_USERS[key] = { password, user: newUser };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    // Demo Google login - creates a demo user
    const googleUser: User = {
      id: `google_${Date.now()}`,
      name: 'Google User',
      email: `user${Date.now()}@gmail.com`,
      role: 'user',
    };
    setUser(googleUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(googleUser));
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      signInWithGoogle,
      isAdmin: user?.role === 'admin',
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
