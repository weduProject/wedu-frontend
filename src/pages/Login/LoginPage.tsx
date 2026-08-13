import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { redirectToOAuthLogin } from '../../lib/oauth';
import weduLogo from '../../assets/wedu-logo.png';

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 4C6.686 4 4 6.134 4 8.762c0 1.696.978 3.183 2.453 4.063l-.625 2.302a.14.14 0 0 0 .213.155l2.786-1.848A7.37 7.37 0 0 0 10 13.524c3.314 0 6-2.133 6-4.762C16 6.134 13.314 4 10 4Z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M18.1 10.2c0-.6-.1-1.2-.2-1.8H10v3.4h4.6a3.9 3.9 0 0 1-1.7 2.6v2.1h2.8c1.6-1.5 2.4-3.7 2.4-6.3Z" fill="#4285F4" />
      <path d="M10 18.5c2.3 0 4.2-.8 5.6-2l-2.8-2.1c-.8.5-1.7.8-2.8.8-2.2 0-4-1.5-4.6-3.4H2.5v2.2A8.5 8.5 0 0 0 10 18.5Z" fill="#34A853" />
      <path d="M5.4 11.8A5 5 0 0 1 5.1 10c0-.6.1-1.2.3-1.8V6H2.5A8.5 8.5 0 0 0 1.5 10c0 1.4.3 2.7.9 3.9l3-2.1Z" fill="#FBBC05" />
      <path d="M10 4.8c1.2 0 2.3.4 3.2 1.2l2.4-2.4A8.4 8.4 0 0 0 10 1.5 8.5 8.5 0 0 0 2.5 6.1l3 2.1C6 6.3 7.8 4.8 10 4.8Z" fill="#EA4335" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(
    (location.state as { error?: string } | null)?.error ?? null
  );

  function handleSocialLogin(provider: 'kakao' | 'google') {
    setError(null);
    redirectToOAuthLogin(provider);
  }

  return (
    <div className="bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8 min-h-[calc(100dvh-80px)] md:min-h-[calc(100dvh-96px)] flex flex-col px-4 py-12">
      <div className="w-full max-w-sm bg-surface rounded-3xl shadow-lg border border-gray-100 px-8 py-12 flex flex-col items-center mx-auto my-auto">

        {/* 로고 */}
        <div className="flex-1 flex flex-col items-center justify-center gap-0 mb-10">
          <img src={weduLogo} alt="WEDU 로고" className="w-36 h-36 object-contain" />
          <div style={{ filter: 'drop-shadow(0 4px 20px rgba(183, 110, 121, 0.45))', opacity: 1 }} className="-mt-3">
            <span
              className="text-3xl font-extrabold tracking-wide"
              style={{
                background: 'linear-gradient(135deg, var(--color-rosegold-1) 0%, var(--color-rosegold-2) 25%, var(--color-rosegold-3) 50%, var(--color-rosegold-4) 75%, var(--color-rosegold-1) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              WEDU
            </span>
          </div>
          <p className="text-xs text-gray-400 text-center">특별한 순간을 함께 준비해요</p>
        </div>

        {/* 에러 */}
        {error && (
          <div className="w-full mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 text-center">
            {error}
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="flex flex-col gap-3 w-full">
          <button
            type="button"
            onClick={() => handleSocialLogin('kakao')}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-full bg-[#FEE500] text-sm font-bold text-[#3C1E1E] hover:brightness-95 transition cursor-pointer shadow-[0_4px_14px_rgba(254,229,0,0.45)]"
          >
            <KakaoIcon />
            카카오로 계속하기
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
          >
            <GoogleIcon />
            구글로 계속하기
          </button>

          <button
            type="button"
            onClick={() => navigate('/home')}
            className="w-full py-3 rounded-full bg-gray-100 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
          >
            비회원으로 둘러보기
          </button>
        </div>
      </div>
    </div>
  );
}
