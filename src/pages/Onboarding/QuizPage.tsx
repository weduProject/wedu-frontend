import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import { Button, ProgressBar, SelectableCard } from '../../components';
import { useOnboarding, QUESTIONS, ANSWERS } from './OnboardingContext';

export default function QuizPage() {
  const navigate = useNavigate();
  const { myAnswers, setMyAnswers } = useOnboarding();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(myAnswers);

  const question = QUESTIONS[current];
  const selectedAnswer = answers[current];
  const isAnswered = selectedAnswer !== -1;

  function selectAnswer(index: number) {
    const next = [...answers];
    next[current] = index;
    setAnswers(next);
  }

  function goNext() {
    if (!isAnswered) return;
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setMyAnswers(answers);
      navigate('/onboarding/partner');
    }
  }

  function goPrev() {
    if (current > 0) setCurrent(current - 1);
  }

  return (
    <OnboardingLayout showSkip>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
            <span>{current + 1} / {QUESTIONS.length}</span>
          </div>
          <ProgressBar value={current + 1} max={QUESTIONS.length} />
        </div>

        <div>
          <p className="text-xs text-text-muted mb-2">Q{current + 1}.</p>
          <p className="text-base font-medium text-text leading-snug">{question.text}</p>
        </div>

        <div className="flex flex-col gap-2">
          {ANSWERS.map((label, i) => (
            <SelectableCard
              key={i}
              isSelected={selectedAnswer === i}
              onClick={() => selectAnswer(i)}
            >
              <span className="text-sm">{label}</span>
            </SelectableCard>
          ))}
        </div>

        <div className="flex gap-3 mt-1">
          <Button
            variant="secondary"
            className="flex-1"
            disabled={current === 0}
            onClick={goPrev}
          >
            이전
          </Button>
          <Button
            className="flex-1"
            disabled={!isAnswered}
            onClick={goNext}
          >
            {current === QUESTIONS.length - 1 ? '완료' : '다음'}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
