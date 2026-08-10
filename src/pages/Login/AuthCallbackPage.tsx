import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// src/pages/Login/AuthCallbackPage.tsx
export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get('code');
    const provider = searchParams.get('provider'); // 백엔드가 아직 안 내려줌 — 임시로 kakao 기본값 처리
    const errorParam = searchParams.get('error');

    if (errorParam || !code) {
      navigate('/login', { replace: true });
      return;
    }

    loginWithOAuth((provider as 'kakao' | 'google') ?? 'kakao', code)
      .then(() => {
        navigate('/home', { replace: true });
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : '로그인에 실패했어요.';
        navigate('/login', { replace: true, state: { error: message } });
      });
  }, [searchParams, loginWithOAuth, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-text-muted">
      로그인 처리 중이에요...
    </div>
  );
}