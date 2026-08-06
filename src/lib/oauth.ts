// src/lib/oauth.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export function redirectToOAuthLogin(provider: 'kakao' | 'google') {
   window.location.href = `${API_BASE}/oauth2/authorization/${provider}`;
}