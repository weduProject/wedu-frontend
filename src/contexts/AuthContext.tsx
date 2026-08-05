import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiFetch, getToken, setToken, clearToken } from '../lib/apiClient';

type Provider = 'kakao' | 'google';

interface User {
  id: string;
  name: string;
  email: string | null;
  onboardingCompleted: boolean;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean; // 앱 첫 로드 시 "토큰 유효한지 확인 중" 상태
  loginWithOAuth: (provider: Provider, code: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱이 처음 로드될 때, 저장된 토큰이 아직 유효한지 확인하고
  // 유효하면 그 토큰으로 내 프로필을 불러와 로그인 상태를 복원함.
  useEffect(() => {
    async function restoreSession() {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiFetch('/api/users/me');
        if (!response.ok) {
          clearToken();
          setUser(null);
          return;
        }
        const data = await response.json();
        setUser(data);
      } catch {
        // 네트워크 오류 등 — 토큰은 유지하되 로그인 안 된 상태로 취급
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  // 소셜 로그인: 카카오/구글에서 받은 일회용 코드를 백엔드에 보내
  // JWT accessToken으로 교환하고, 그 토큰으로 내 프로필을 받아온다.
  async function loginWithOAuth(provider: Provider, code: string): Promise<User> {
    const tokenResponse = await apiFetch('/api/auth/oauth/token', {
      method: 'POST',
      body: JSON.stringify({ provider, code }),
    });

    if (!tokenResponse.ok) {
      throw new Error('소셜 로그인에 실패했어요. 다시 시도해주세요.');
    }

    const { accessToken } = await tokenResponse.json();
    setToken(accessToken);

    const meResponse = await apiFetch('/api/users/me');
    if (!meResponse.ok) {
      clearToken();
      throw new Error('프로필을 불러오지 못했어요.');
    }
    const data: User = await meResponse.json();
    setUser(data);
    return data;
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithOAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}