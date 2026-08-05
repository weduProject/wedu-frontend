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
  provider?: Provider;        // 로그인 응답엔 없고, /api/users/me 조회 시에만 옴
  profileImageUrl?: string | null; // /api/users/me 조회 시에만 옴
}

// POST /api/auth/login, /api/auth/oauth/token 응답의 data 모양
// (Swagger 확인: 2026-08-05) — 필드명이 userId 임에 주의
interface AuthTokenData {
  tokenType: string;
  accessToken: string;
  userId: number;
  email: string;
  nickname: string;
  onboardingCompleted: boolean;
}

// GET /api/users/me 응답의 data 모양 (Swagger 확인: 2026-08-05)
// 위 AuthTokenData와 달리 필드명이 id 이고, provider/profileImageUrl이 추가로 옴
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
    provider, // 로그인 시 우리가 호출한 provider 인자를 그대로 사용 (응답엔 없음)
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
  isLoading: boolean; // 앱 첫 로드 시 "토큰 유효한지 확인 중" 상태
  loginWithOAuth: (provider: Provider, code: string) => Promise<User>;
  loginWithEmail: (email: string, password: string) => Promise<User>; // 개발/테스트용, 소셜 SDK 연동 전까지 임시 사용
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
        const body: ApiEnvelope<UserProfileData> = await response.json();

        if (!response.ok || !body.success || !body.data) {
          clearToken();
          setUser(null);
          return;
        }
        setUser(fromProfile(body.data));
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
  // JWT accessToken으로 교환한다. 이 응답에 프로필 정보도 같이 오기 때문에
  // /api/users/me를 별도로 다시 호출할 필요는 없음.
async function loginWithOAuth(provider: Provider, code: string): Promise<User> {
  const response = await apiFetch('/api/auth/oauth/token', {
    method: 'POST',
    body: JSON.stringify({ provider, code }),
  });

  const body: ApiEnvelope<AuthTokenData> = await response.json();
  console.log('[loginWithOAuth] response:', response.status, body); // 추가

  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? '소셜 로그인에 실패했어요. 다시 시도해주세요.');
  }

  setToken(body.data.accessToken);
  console.log('[loginWithOAuth] token set, check:', localStorage.getItem('wedu_access_token')); // 추가

  const nextUser = fromAuthToken(body.data, provider);
  setUser(nextUser);
  return nextUser;
}


  // 개발/테스트 전용: 소셜 SDK 연동 전까지, 로그인 필요한 화면을 테스트하기 위한 임시 경로.
  // 백엔드 응답 구조가 loginWithOAuth와 동일해서 로직 그대로 재사용.
  async function loginWithEmail(email: string, password: string): Promise<User> {
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const body: ApiEnvelope<AuthTokenData> = await response.json();

    if (!response.ok || !body.success || !body.data) {
      throw new Error(body.error?.message ?? '로그인에 실패했어요.');
    }

    setToken(body.data.accessToken);
    // 이메일 로그인은 provider 정보가 없으니 undefined로 둠 (마이페이지에 로그인 방식 표시 안 됨, 테스트용이라 무방)
    const nextUser: User = {
      id: body.data.userId,
      name: body.data.nickname,
      email: body.data.email,
      onboardingCompleted: body.data.onboardingCompleted,
    };
    setUser(nextUser);
    return nextUser;
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithOAuth, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}