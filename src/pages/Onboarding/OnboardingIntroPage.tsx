import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import { Button } from '../../components';

const FEATURES = [
  { color: 'text-primary', label: '나의 성향 분석' },
  { color: 'text-primary', label: '상대방 성향 분석 (MBTI)' },
  { color: 'text-primary', label: '두 결과를 종합한 맞춤 추천' },
  { color: 'text-primary', label: '나만의 프로포즈 제안' },
];

export default function OnboardingIntroPage() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout showSkip>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-base font-semibold text-text leading-snug mb-1">
            심리테스트를 통해
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            당신과 상대방에게 어울리는<br />프로포즈 스타일을 찾아드려요.
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {FEATURES.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-text">
              <span className={`text-base ${f.color}`}>♡</span>
              {f.label}
            </li>
          ))}
        </ul>

        <Button className="w-full mt-2" size="lg" onClick={() => navigate('/onboarding/quiz')}>
          테스트 시작하기
        </Button>
      </div>
    </OnboardingLayout>
  );
}
