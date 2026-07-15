import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface OnboardingLayoutProps {
  children: ReactNode;
  showSkip?: boolean;
}

export default function OnboardingLayout({ children, showSkip = false }: OnboardingLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light/60 px-4 py-10">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        {showSkip && (
          <button
            type="button"
            className="absolute top-4 right-5 text-sm text-text-muted hover:text-text transition-colors cursor-pointer bg-transparent border-0 p-0"
            onClick={() => navigate('/home')}
          >
            건너뛰기
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
