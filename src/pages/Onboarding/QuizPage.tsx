import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { Button, ProgressBar } from '../../components';
import SelectableCard from '../../components/ui/SelectableCard';
import { useOnboarding, QUIZ_QUESTIONS, TRAVEL_REGIONS } from './OnboardingContext';
import type { QuizAnswers } from './OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';

export default function QuizPage() {
  const navigate = useNavigate();
  const { markOnboardingComplete } = useAuth();
  const { setQuizAnswers } = useOnboarding();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const question = QUIZ_QUESTIONS[current];
  const currentAnswer = answers[question.id];
  const isQ2Travel = question.id === 'q2' && currentAnswer === 'TRAVEL';

  function checkAnswered(): boolean {
    if (question.type === 'single') {
      if (question.id === 'q2' && currentAnswer === 'TRAVEL') return !!answers.q2_region;
      return !!currentAnswer;
    }
    if (question.type === 'multi') return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    if (question.type === 'ordered') return Array.isArray(currentAnswer) && currentAnswer.length === (question.maxOrder ?? 2);
    return false;
  }

  function handleSingle(value: string) {
    const next = { ...answers };
    if (question.id === 'q2' && value !== 'TRAVEL') delete next.q2_region;
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
      markOnboardingComplete();
      navigate('/onboarding/partner');
    }
  }

  function goPrev() {
    if (current > 0) setCurrent(current - 1);
  }

  const multiSelected = (Array.isArray(currentAnswer) ? currentAnswer : []) as string[];
  const orderedSelected = (Array.isArray(currentAnswer) ? currentAnswer : []) as string[];

  return (
    <div className="bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
      <div className="mx-auto w-full max-w-2xl px-5 py-10 md:px-8">
        {/* 상단 내비 + 타이틀 */}
        <div className="mb-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/onboarding/intro')}
            className="mb-4 inline-flex items-center gap-1 border-0 bg-transparent text-xs text-text-muted transition-colors hover:text-text cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
            테스트 안내로 돌아가기
          </button>
          <h1 className="mb-1 text-3xl font-bold text-text font-serif">나의 성향 테스트</h1>
          <p className="text-sm text-text-muted">솔직하게 답변할수록 더 정확한 결과를 얻을 수 있어요</p>
        </div>

        {/* 진행바 */}
        <div className="mb-6 w-full">
          <ProgressBar value={current + 1} max={QUIZ_QUESTIONS.length} />
        </div>

        {/* 퀴즈 카드 */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
          <p className="mb-2 text-xs font-semibold text-primary">
            문항 {current + 1} / {QUIZ_QUESTIONS.length}
          </p>

          {/* 질문 */}
          <div className="mb-6 text-center">
            <p className="mb-1 text-xl font-bold leading-snug text-text font-serif">{question.text}</p>
            {question.hint && <p className="text-sm text-text-muted">{question.hint}</p>}
          </div>

          {/* 선택지 */}
          <div className="flex flex-col gap-2.5">
            {question.answers.map((answer) => {
              const isSelected =
                question.type === 'single'
                  ? currentAnswer === answer.value
                  : multiSelected.includes(answer.value) || orderedSelected.includes(answer.value);
              const orderIndex = question.type === 'ordered' ? orderedSelected.indexOf(answer.value) : -1;
              const isDisabled =
                question.type === 'multi' &&
                question.maxSelect !== undefined &&
                !multiSelected.includes(answer.value) &&
                multiSelected.filter((v) => !['NO_SERVICE', 'NONE', 'UNKNOWN'].includes(v)).length >= question.maxSelect &&
                !['NO_SERVICE', 'NONE', 'UNKNOWN'].includes(answer.value);

              return (
                <SelectableCard
                  key={answer.value}
                  isSelected={isSelected}
                  disabled={isDisabled}
                  onClick={() => {
                    if (question.type === 'single') handleSingle(answer.value);
                    else if (question.type === 'multi') handleMulti(answer.value);
                    else handleOrdered(answer.value);
                  }}
                  className="flex items-center gap-3 !px-4 !py-3"
                >
                  {/* 라디오/체크 인디케이터 */}
                  <span className={clsx(
                    'flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-all',
                    isSelected ? 'border-primary bg-primary' : 'border-gray-300 bg-white'
                  )}>
                    {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                  <span className={clsx('text-sm', isSelected ? 'font-semibold text-primary' : 'text-text')}>
                    {answer.label}
                  </span>
                  {question.type === 'ordered' && orderIndex !== -1 && (
                    <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {orderIndex + 1}
                    </span>
                  )}
                </SelectableCard>
              );
            })}
          </div>

          {/* Q2 여행지 선택 */}
          {isQ2Travel && (
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-sm font-medium text-text-muted">지역을 선택해주세요.</p>
              <div className="grid grid-cols-3 gap-2">
                {TRAVEL_REGIONS.map((region) => (
                  <button
                    key={region.value}
                    type="button"
                    onClick={() => handleRegion(region.value)}
                    className={clsx(
                      'rounded-lg border px-3 py-2 text-center text-sm transition-colors cursor-pointer bg-white',
                      answers.q2_region === region.value
                        ? 'border-primary bg-primary/[.06] font-medium text-primary'
                        : 'border-border text-text hover:bg-gray-50'
                    )}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 이전 / 도트 / 다음 */}
          <div className="mt-8 flex items-center justify-center gap-6 border-t border-border pt-6">
            <Button variant="secondary" className="flex-none" disabled={current === 0} onClick={goPrev}>
              ← 이전
            </Button>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {QUIZ_QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className={clsx(
                    'rounded-full transition-all',
                    i === current ? 'h-2.5 w-2.5 bg-primary' : i < current ? 'h-2 w-2 bg-primary/40' : 'h-2 w-2 bg-border'
                  )}
                />
              ))}
            </div>

            <Button disabled={!checkAnswered()} onClick={goNext}>
              {current === QUIZ_QUESTIONS.length - 1 ? '완료' : '다음 →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}