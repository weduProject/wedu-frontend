const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// 구글은 카카오처럼 SDK 스크립트가 없어도, URL만 조립해서 이동시키면 됨
// (OAuth 2.0 Authorization Code Flow — 표준 방식).
export function redirectToGoogleLogin(redirectUri: string) {
  if (!GOOGLE_CLIENT_ID) {
    console.warn('VITE_GOOGLE_CLIENT_ID가 설정되지 않았어요. .env.local을 확인하세요.');
    return;
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account', // 매번 계정 선택 화면 보여줌 (자동 재로그인 방지)
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}