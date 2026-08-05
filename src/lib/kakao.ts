declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Auth: {
        authorize: (options: { redirectUri: string; throughTalk?: boolean }) => void;
      };
    };
  }
}

const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;

// 앱 시작 시 한 번만 호출하면 됨 (App.tsx 등에서)
export function initKakao() {
  if (!window.Kakao) {
    console.warn('카카오 SDK 스크립트가 아직 로드되지 않았어요.');
    return;
  }
  if (!KAKAO_JS_KEY) {
    console.warn('VITE_KAKAO_JS_KEY가 설정되지 않았어요. .env.local을 확인하세요.');
    return;
  }
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_JS_KEY);
  }
}

// 카카오 로그인 페이지로 이동시킴 (전체 페이지 리다이렉트).
// 로그인 끝나면 redirectUri로 돌아오면서 URL에 ?code=... 가 붙어서 옴.
export function redirectToKakaoLogin(redirectUri: string) {
  window.Kakao.Auth.authorize({
    redirectUri,
    throughTalk: false, // 카카오톡 앱으로 먼저 시도하는 것 생략, 바로 브라우저 로그인 페이지로
  });
}