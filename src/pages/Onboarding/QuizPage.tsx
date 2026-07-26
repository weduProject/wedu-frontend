import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import OnboardingLayout from './OnboardingLayout';
import { Button, ProgressBar } from '../../components';
import { useOnboarding, QUIZ_QUESTIONS, TRAVEL_REGIONS } from './OnboardingContext';
import type { QuizAnswers } from './OnboardingContext';

export default function QuizPage() {
  const navigate = useNavigate();
  const { quizAnswers, setQuizAnswers } = useOnboarding();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(quizAnswers);

  const question = QUIZ_QUESTIONS[current];
  const currentAnswer = answers[question.id];
  const isQ2Travel = question.id === 'q2' && currentAnswer === 'TRAVEL';

  function checkAnswered(): boolean {
    if (question.type === 'single') {
      if (question.id === 'q2' && currentAnswer === 'TRAVEL') {
        return !!answers.q2_region;
      }
      return !!currentAnswer;
    }
    if (question.type === 'multi') {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    if (question.type === 'ordered') {
      return Array.isArray(currentAnswer) && currentAnswer.length === (question.maxOrder ?? 2);
    }
    return false;
  }

  function handleSingle(value: string) {
    const next = { ...answers };
    if (question.id === 'q2' && value !== 'TRAVEL') {
      delete next.q2_region;
    }
    next[question.id] = currentAnswer === value ? '' : value;
    setAnswers(next);
  }

  function handleRegion(value: string) {
    setAnswers({ ...answers, q2_region: value });
  }

  function handleMulti(value: string) {
    const prev = (answers[question.id] as string[]) ?? [];
    const EXCLUSIVE_NONE = ['NO_SERVICE', 'NONE', 'UNKNOWN'];

    let next: string[];
    if (prev.includes(value)) {
      next = prev.filter((v) => v !== value);
    } else if (EXCLUSIVE_NONE.includes(value)) {
      next = [value];
    } else {
      const filtered = prev.filter((v) => !EXCLUSIVE_NONE.includes(v));
      if (question.maxSelect && filtered.length >= question.maxSelect) return;
      next = [...filtered, value];
    }
    setAnswers({ ...answers, [question.id]: next });
  }

  function handleOrdered(value: string) {
    const prev = (answers[question.id] as string[]) ?? [];
    let next: string[];
    if (prev.includes(value)) {
      next = prev.filter((v) => v !== value);
    } else {
      if (prev.length >= (question.maxOrder ?? 2)) return;
      next = [...prev, value];
    }
    setAnswers({ ...answers, [question.id]: next });
  }

  function goNext() {
    if (!checkAnswered()) return;
    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setQuizAnswers(answers);
      navigate('/onboarding/partner');
    }
  }

  function goPrev() {
    if (current > 0) setCurrent(current - 1);
  }

  const multiSelected = (Array.isArray(currentAnswer) ? currentAnswer : []) as string[];
  const orderedSelected = (Array.isArray(currentAnswer) ? currentAnswer : []) as string[];

  return (
    <OnboardingLayout showSkip>
      <div className="flex flex-col gap-6">
        {/* 진행 표시 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
            <span>{current + 1} / {QUIZ_QUESTIONS.length}</span>
          </div>
          <ProgressBar value={current + 1} max={QUIZ_QUESTIONS.length} />
        </div>

        {/* 질문 */}
        <div>
          <p className="text-xs text-text-muted mb-1">Q{current + 1}.</p>
          <p className="text-base font-semibold text-text leading-snug mb-1">{question.text}</p>
          <p className="text-xs text-text-muted">{question.hint}</p>
        </div>

        {/* 선택지 */}
        <div className="flex flex-col gap-2">
          {question.answers.map((answer) => {
            const isSelected =
              question.type === 'single'
                ? currentAnswer === answer.value
                : multiSelected.includes(answer.value) || orderedSelected.includes(answer.value);

            const orderIndex =
              question.type === 'ordered' ? orderedSelected.indexOf(answer.value) : -1;

            const isDisabled =
              question.type === 'multi' &&
              question.maxSelect !== undefined &&
              !multiSelected.includes(answer.value) &&
              multiSelected.filter((v) => !['NO_SERVICE', 'NONE', 'UNKNOWN'].includes(v)).length >= question.maxSelect &&
              !['NO_SERVICE', 'NONE', 'UNKNOWN'].includes(answer.value);

            return (
              <button
                key={answer.value}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  if (question.type === 'single') handleSingle(answer.value);
                  else if (question.type === 'multi') handleMulti(answer.value);
                  else handleOrdered(answer.value);
                }}
                className={clsx(
                  'flex items-center justify-between w-full px-4 py-3 rounded-xl border text-sm text-left transition-colors cursor-pointer bg-white',
                  isSelected
                    ? 'border-primary bg-primary/[.06] text-primary font-medium'
                    : 'border-border text-text hover:bg-gray-50',
                  isDisabled && 'opacity-40 cursor-not-allowed'
                )}
              >
                <span>{answer.label}</span>
                {question.type === 'ordered' && orderIndex !== -1 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center shrink-0">
                    {orderIndex + 1}
                  </span>
                )}
                {question.type === 'multi' && isSelected && (
                  <span className="text-primary text-base leading-none shrink-0">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Q2 여행지 선택 (TRAVEL 선택 시 노출) */}
        {isQ2Travel && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-text-muted">지역을 선택해주세요.</p>
            <div className="grid grid-cols-3 gap-2">
              {TRAVEL_REGIONS.map((region) => (
                <button
                  key={region.value}
                  type="button"
                  onClick={() => handleRegion(region.value)}
                  className={clsx(
                    'px-3 py-2 rounded-lg border text-xs text-center transition-colors cursor-pointer bg-white',
                    answers.q2_region === region.value
                      ? 'border-primary bg-primary/[.06] text-primary font-medium'
                      : 'border-border text-text hover:bg-gray-50'
                  )}
                >
                  {region.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 이전/다음 버튼 */}
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
            disabled={!checkAnswered()}
            onClick={goNext}
          >
            {current === QUIZ_QUESTIONS.length - 1 ? '완료' : '다음'}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
