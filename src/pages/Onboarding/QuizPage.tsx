import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { Button, ProgressBar } from '../../components';
import { useOnboarding, QUIZ_QUESTIONS, TRAVEL_REGIONS } from './OnboardingContext';
import type { QuizAnswers } from './OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';

export default function QuizPage() {
  const navigate = useNavigate();
  const { markOnboardingComplete } = useAuth();
  const { quizAnswers, setQuizAnswers } = useOnboarding();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(quizAnswers);

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
    <div className="flex flex-col h-[calc(100svh-80px)] md:h-[calc(100svh-96px)] overflow-hidden px-5 md:px-8">
      {/* 고정 타이틀 영역 */}
      <div className="shrink-0 text-center pt-4 pb-3 px-4">
        <button
          type="button"
          onClick={() => navigate('/onboarding/intro')}
          className="inline-flex items-center gap-1 mb-3 text-xs text-text-muted hover:text-text transition-colors cursor-pointer border-0 bg-transparent"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          테스트 안내로 돌아가기
        </button>
        <h1 className="text-3xl font-black text-text mb-1" style={{ fontFamily: 'var(--font-serif)' }}>나의 성향 테스트</h1>
        <p className="text-xs text-text-muted">솔직하게 답변할수록 더 정확한 결과를 얻을 수 있어요</p>
      </div>

      {/* 퀴즈 카드 */}
      <div className="flex-1 flex flex-col px-4 py-6">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-2 my-auto">
          <ProgressBar value={current + 1} max={QUIZ_QUESTIONS.length} />
        <div className="w-full bg-surface rounded-2xl shadow-sm border border-border/60 p-5 flex flex-col gap-2 overflow-y-auto max-h-[65vh]">
          {/* 문항 번호 */}
          <p className="text-xs font-semibold text-primary">
            문항 {current + 1} / {QUIZ_QUESTIONS.length}
          </p>

          {/* 질문 */}
          <div className="text-center py-1">
            <p className="text-2xl font-bold text-text leading-snug mb-0.5" style={{ fontFamily: 'var(--font-serif)' }}>{question.text}</p>
            {question.hint && <p className="text-sm text-text-muted">{question.hint}</p>}
          </div>

          {/* 선택지 */}
          <div className="flex flex-col gap-2">
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
                    'flex items-center gap-3 w-full px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-gray-200 bg-white text-text hover:border-primary/40 hover:bg-primary/5',
                    isDisabled && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  {/* 라디오/체크 인디케이터 */}
                  <span className={clsx(
                    'flex-none w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                    isSelected ? 'border-primary bg-primary' : 'border-gray-300 bg-white'
                  )}>
                    {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </span>
                  <span className="text-sm">{answer.label}</span>
                  {question.type === 'ordered' && orderIndex !== -1 && (
                    <span className="ml-auto w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center shrink-0 font-bold">
                      {orderIndex + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Q2 여행지 선택 */}
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

          {/* 이전 / 도트 / 다음 */}
          <div className="flex items-center justify-between gap-3 mt-0">
            <Button variant="secondary" className="flex-none" disabled={current === 0} onClick={goPrev}>
              ← 이전
            </Button>

            <div className="flex items-center gap-1 flex-1 justify-center flex-wrap">
              {QUIZ_QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className={clsx(
                    'rounded-full transition-all',
                    i === current ? 'w-3 h-3 bg-primary' : i < current ? 'w-2 h-2 bg-primary/40' : 'w-2 h-2 bg-border'
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              className="flex-none rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!checkAnswered()}
              onClick={goNext}
            >
              {current === QUIZ_QUESTIONS.length - 1 ? '완료' : '다음 →'}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
    </div>
  );
}
