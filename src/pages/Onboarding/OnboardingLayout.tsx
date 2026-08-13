import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface OnboardingLayoutProps {
  children: ReactNode;
  showSkip?: boolean;
}

export default function OnboardingLayout({ children, showSkip = false }: OnboardingLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center py-10">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        {showSkip && (
          <button
            type="button"
            className="absolute right-5 top-4 cursor-pointer border-0 bg-transparent text-sm text-text-muted transition-colors hover:text-text"
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
