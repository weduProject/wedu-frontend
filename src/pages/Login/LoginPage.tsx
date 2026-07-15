import { useNavigate } from 'react-router-dom';

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect width="20" height="20" rx="4" fill="#FEE500" />
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

const SOCIAL_BUTTONS = [
  { id: 'kakao', icon: <KakaoIcon />, label: '카카오로 계속하기' },
  { id: 'google', icon: <GoogleIcon />, label: '구글로 계속하기' },
] as const;

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light/60 px-4">
      <div className="flex w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Left: Login Form */}
        <div className="flex flex-col justify-center px-10 py-14 w-full md:w-1/2">
          <h1 className="text-4xl font-bold text-primary mb-3">WEDU</h1>
          <p className="text-text text-sm leading-relaxed mb-10">
            당신의 특별한 순간을<br />
            WEDU와 함께 준비하세요.
          </p>

          <div className="flex flex-col gap-3">
            {SOCIAL_BUTTONS.map(({ id, icon, label }) => (
              <button
                key={id}
                type="button"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-border text-sm text-text hover:bg-gray-50 transition-colors cursor-pointer bg-white"
                onClick={() => navigate('/onboarding')}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="mt-8 text-sm text-text-muted hover:text-text transition-colors flex items-center gap-0.5 cursor-pointer bg-transparent border-0 p-0 w-fit"
            onClick={() => navigate('/home')}
          >
            비회원으로 둘러보기 &gt;
          </button>
        </div>

        {/* Right: Hero Image */}
        <div
          className="hidden md:block w-1/2 bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200"
          style={{
            backgroundImage: `url('/hero.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
    </div>
  );
}
