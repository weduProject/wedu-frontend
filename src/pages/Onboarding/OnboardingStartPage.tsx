import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import { Button } from '../../components';

export default function OnboardingStartPage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout>
      <div className="flex flex-col items-center text-center gap-6">
        <div className="text-7xl mt-2">💑</div>

        <div>
          <p className="text-text-muted text-sm mb-1">WEDU와 함께</p>
          <h1 className="text-xl font-bold text-text leading-snug">
            당신만의 프로포즈 &amp; 결혼 준비를<br />시작해볼까요?
          </h1>
        </div>

        <Button className="w-full mt-2" size="lg" onClick={() => navigate('/onboarding/intro')}>
          시작하기
        </Button>

        <button
          type="button"
          className="text-sm text-text-muted hover:text-text transition-colors cursor-pointer bg-transparent border-0 p-0"
          onClick={() => navigate('/home')}
        >
          나중에 하기
        </button>
      </div>
    </OnboardingLayout>
  );
}
