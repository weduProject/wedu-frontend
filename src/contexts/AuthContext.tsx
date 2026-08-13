import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiFetch, getToken, setToken, clearToken } from '../lib/apiClient';
import type { ApiEnvelope } from '../lib/apiClient';

type Provider = 'kakao' | 'google';

interface User {
  id: number;
  name: string;
  email: string | null;
  onboardingCompleted: boolean;
  provider?: Provider;
  profileImageUrl?: string | null;
}

// POST /api/auth/oauth/token 응답 (Swagger 확인: 2026-08-05)
interface AuthTokenData {
  tokenType: string;
  accessToken: string;
  userId: number;
  email: string;
  nickname: string;
  onboardingCompleted: boolean;
}

// GET /api/users/me, PATCH /api/users/me, POST /api/users/me/onboarding 공통 응답 (Swagger 확인: 2026-08-11)
interface UserProfileData {
  id: number;
  provider: Provider;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  onboardingCompleted: boolean;
}

function fromAuthToken(data: AuthTokenData, provider: Provider): User {
  return {
    id: data.userId,
    name: data.nickname,
    email: data.email,
    onboardingCompleted: data.onboardingCompleted,
    provider,
  };
}

function fromProfile(data: UserProfileData): User {
  return {
    id: data.id,
    name: data.nickname,
    email: data.email,
    onboardingCompleted: data.onboardingCompleted,
    provider: data.provider,
    profileImageUrl: data.profileImageUrl,
  };
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  loginWithOAuth: (provider: Provider, code: string) => Promise<User>;
  logout: () => void;
  markOnboardingComplete: () => Promise<void>;
  updateProfile: (nickname: string, profileImageUrl?: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await apiFetch('/api/users/me');
        const body: ApiEnvelope<UserProfileData> = await response.json();
        if (!response.ok || !body.success || !body.data) {
          clearToken();
          setUser(null);
          return;
        }
        setUser(fromProfile(body.data));
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function loginWithOAuth(provider: Provider, code: string): Promise<User> {
    const response = await apiFetch('/api/auth/oauth/token', {
      method: 'POST',
      body: JSON.stringify({ provider, code }),
    });
    const body: ApiEnvelope<AuthTokenData> = await response.json();
    if (!response.ok || !body.success || !body.data) {
      throw new Error(body.error?.message ?? '소셜 로그인에 실패했어요. 다시 시도해주세요.');
    }
    setToken(body.data.accessToken);
    const nextUser = fromAuthToken(body.data, provider);
    setUser(nextUser);
    return nextUser;
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  // POST /api/users/me/onboarding — 서버에 온보딩 완료 플래그 저장
  async function markOnboardingComplete(): Promise<void> {
    try {
      const res = await apiFetch('/api/users/me/onboarding', { method: 'POST' });
      const body: ApiEnvelope<UserProfileData> = await res.json();
      if (res.ok && body.success && body.data) {
        setUser(fromProfile(body.data));
        return;
      }
    } catch {
      // 네트워크 오류 시 로컬 상태만 업데이트
    }
    setUser((prev) => prev ? { ...prev, onboardingCompleted: true } : prev);
  }

  // PATCH /api/users/me — 닉네임·프로필 이미지 수정
  async function updateProfile(nickname: string, profileImageUrl?: string | null): Promise<void> {
    const res = await apiFetch('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ nickname, profileImageUrl: profileImageUrl ?? null }),
    });
    const body: ApiEnvelope<UserProfileData> = await res.json();
    if (!res.ok || !body.success || !body.data) {
      throw new Error(body.error?.message ?? '프로필 수정에 실패했어요.');
    }
    setUser(fromProfile(body.data));
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithOAuth, logout, markOnboardingComplete, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
