import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Provider = 'kakao' | 'google' | 'guest';

interface User {
  name: string;
  email: string | null;
  provider: Provider;
}

interface AuthContextValue {
  user: User | null;
  login: (provider: Provider) => void;
  logout: () => void;
}

const MOCK_USERS: Record<Provider, User> = {
  kakao: { name: '카카오유저', email: 'kakao@test.com', provider: 'kakao' },
  google: { name: '구글유저', email: 'google@test.com', provider: 'google' },
  guest: { name: '게스트', email: null, provider: 'guest' },
};

const STORAGE_KEY = 'wedu_user';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  function login(provider: Provider) {
    setUser(MOCK_USERS[provider]);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
