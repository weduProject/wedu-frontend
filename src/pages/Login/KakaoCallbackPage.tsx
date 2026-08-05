import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// 카카오 로그인 페이지에서 redirectUri로 돌아왔을 때 여기로 옴.
// URL에 붙어있는 ?code=... 를 읽어서 백엔드로 넘기고, 성공하면 홈/온보딩으로 이동.
export default function KakaoCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return; // React StrictMode 이중 실행 방지
    hasRun.current = true;

    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam || !code) {
      navigate('/login', { replace: true });
      return;
    }

    loginWithOAuth('kakao', code)
      .then(({ onboardingCompleted }) => {
        navigate(onboardingCompleted ? '/home' : '/onboarding', { replace: true });
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : '로그인에 실패했어요.';
        navigate('/login', { replace: true, state: { error: message } });
    });
  }, [searchParams, loginWithOAuth, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-text-muted">
      카카오 로그인 처리 중이에요...
    </div>
  );
}