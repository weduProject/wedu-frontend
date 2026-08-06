const TOKEN_KEY = 'wedu_access_token';

// 이 백엔드는 모든 응답을 { success, data, error } 형태로 감싸서 내려줌.
// 다른 API 연동할 때도 이 타입 재사용하면 됨.
export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

// 모든 API 요청에 자동으로 Authorization 헤더를 붙여주는 fetch 래퍼.
// 이제부터 예산/체크리스트/장바구니 등 실제 API 연동할 때 fetch 대신 이걸 쓰면 됨.
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // 토큰 만료/무효 시 자동 로그아웃 처리 (401 응답)
  if (response.status === 401) {
    clearToken();
  }

  return response;
}