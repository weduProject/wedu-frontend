// src/lib/oauth.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export function redirectToOAuthLogin(provider: 'kakao' | 'google') {
  const isLocal = window.location.hostname === 'localhost';

  if (isLocal) {
    const redirectUri = `${window.location.origin}/auth/callback`;
    window.location.href = `${API_BASE}/oauth2/authorization/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`;
  } else {
    window.location.href = `${API_BASE}/oauth2/authorization/${provider}`;
  }
}