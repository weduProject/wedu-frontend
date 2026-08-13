// src/lib/oauth.ts

export function redirectToOAuthLogin(provider: 'kakao' | 'google') {
  // 환경 변수 유무와 상관없이 무조건 실제 백엔드 서버 주소로 강제 이동
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.wedu.io.kr';
  
  window.location.href = `${baseURL}/oauth2/authorization/${provider}`;
}
