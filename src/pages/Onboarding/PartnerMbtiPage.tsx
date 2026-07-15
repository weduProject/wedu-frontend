import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import { Button, TextField } from '../../components';
import { useOnboarding } from './OnboardingContext';

const VALID_MBTI = /^[EI][SN][TF][JP]$/i;

export default function PartnerMbtiPage() {
  const navigate = useNavigate();
  const { setPartnerMbti } = useOnboarding();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const upperValue = value.toUpperCase();
  const isValid = VALID_MBTI.test(upperValue);

  function handleNext() {
    if (!value.trim()) {
      setError('MBTI를 입력해주세요.');
      return;
    }
    if (!isValid) {
      setError('올바른 MBTI 형식으로 입력해주세요. (예: ENFP)');
      return;
    }
    setPartnerMbti(upperValue);
    navigate('/home');
  }

  return (
    <OnboardingLayout showSkip>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-base font-semibold text-text mb-1">
            상대방의 MBTI를<br />입력해주세요!
          </h2>
          <p className="text-sm text-text-muted">두 사람의 궁합을 분석해드려요.</p>
        </div>

        <div className="flex justify-center text-6xl py-2">🛋️</div>

        <div className="flex flex-col gap-1">
          <TextField
            placeholder="예) ENFP"
            value={value}
            maxLength={4}
            onChange={e => {
              setValue(e.target.value);
              setError('');
            }}
            error={error}
          />
          <p className="text-xs text-text-muted">영문 4자리 (예: ENFP, ISFJ)</p>
        </div>

        <Button
          className="w-full"
          size="lg"
          disabled={!value.trim()}
          onClick={handleNext}
        >
          다음
        </Button>
      </div>
    </OnboardingLayout>
  );
}
