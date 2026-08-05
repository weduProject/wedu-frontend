import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// 구글 로그인 페이지에서 redirectUri로 돌아왔을 때 여기로 옴.
// 구조는 KakaoCallbackPage.tsx와 동일 — code만 받아서 백엔드로 넘김.
export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get('code');
    const errorParam = searchParams.get('error'); // 사용자가 동의 화면에서 취소하면 여기로 옴

    if (errorParam || !code) {
      navigate('/login', { replace: true });
      return;
    }

    loginWithOAuth('google', code)
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
      구글 로그인 처리 중이에요...
    </div>
  );
}