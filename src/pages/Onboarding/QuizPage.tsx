import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { Button, ProgressBar } from '../../components';
import SelectableCard from '../../components/ui/SelectableCard';
import { useOnboarding, QUIZ_QUESTIONS, TRAVEL_REGIONS } from './OnboardingContext';
import type { QuizAnswers, QuizAnswer } from './OnboardingContext';

const EXCLUSIVE_NONE = ['NO_SERVICE', 'NONE', 'UNKNOWN'];

export default function QuizPage() {
  const navigate = useNavigate();
  const { setQuizAnswers } = useOnboarding();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const question = QUIZ_QUESTIONS[current];
  const currentAnswer = answers[question.id];
  const isQ2Travel = question.id === 'q2' && currentAnswer === 'TRAVEL';

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  // 문항이 바뀔 때마다: 1) 스크롤 위치를 맨 위로 리셋 2) 스크롤 필요 여부 재측정
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;

    el.scrollTop = 0;

    function measure() {
      if (!el) return;
      setIsScrollable(el.scrollHeight > el.clientHeight + 1);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [current, isQ2Travel]);

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

// 몇 개를 골라야 하는지 카드 안에서 눈에 띄게 보여주는 배지.
// single(하나만 선택) / multi(최대 개수 있음) / ordered(순서대로 선택) 모두
// 텍스트 없이 점만으로 표시하고, 선택된 점에는 그라데이션을 적용함.
function renderSelectionBadge() {
  let max: number | undefined;
  let count = 0;

  if (question.type === 'single') {
    max = 1;
    count = currentAnswer ? 1 : 0;
  } else if (question.type === 'multi' && question.maxSelect) {
    max = question.maxSelect;
    count = multiSelected.filter((v) => !EXCLUSIVE_NONE.includes(v)).length;
  } else if (question.type === 'ordered') {
    max = question.maxOrder ?? 2;
    count = orderedSelected.length;
  }

  if (!max) return null;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={clsx(
            'rounded-full transition-all',
            i < count ? 'h-2 w-2 gradient-primary-bg' : 'h-1.5 w-1.5 bg-border',
          )}
        />
      ))}
    </div>
  );
}

  function renderAnswerCard(answer: QuizAnswer, orderIndex: number, isSelected: boolean, isDisabled: boolean) {
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
        className="flex min-h-[44px] shrink-0 items-center gap-2.5 !px-3.5 !py-2"
      >
        {/* 라디오/체크 인디케이터 */}
        <span className={clsx(
          'flex h-4 w-4 flex-none items-center justify-center rounded-full border-2 transition-all',
          isSelected ? 'border-primary bg-primary' : 'border-gray-300 bg-white'
        )}>
          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
        </span>
        <span className={clsx('whitespace-normal break-keep text-sm', isSelected ? 'font-semibold text-primary' : 'text-text')}>
          {answer.label}
        </span>
        {question.type === 'ordered' && orderIndex !== -1 && (
          <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            {orderIndex + 1}
          </span>
        )}
      </SelectableCard>
    );
  }

  const badge = renderSelectionBadge();
  return (
    <div className="bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
      {/* 뷰포트 높이에 완전히 맞춘 컨테이너 — 이 안에서만 flex 배분되고, 브라우저 자체 스크롤은 생기지 않음 */}
      <div className="mx-auto flex h-[calc(100vh-60px)] w-full max-w-xl flex-col px-5 py-6 md:h-[calc(100vh-64px)] md:px-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/onboarding/intro')}
            className="inline-flex items-center gap-1 border-0 bg-transparent text-xs text-text-muted transition-colors hover:text-text cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
            테스트 안내로 돌아가기
          </button>
        </div>

        {/* 진행바 — 고정 */}
        <div className="mb-2.5 w-full shrink-0">
          <ProgressBar value={current + 1} max={QUIZ_QUESTIONS.length} />
        </div>

        {/* 카드 영역 */}
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <div className="flex max-h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            {/* 1단: 문항 타이틀 — 고정, 스크롤과 무관 */}
            <div className="shrink-0 px-4 pb-3 pt-4">
              <p className="mb-1 text-xs font-semibold text-primary text-center">
                문항 {current + 1} / {QUIZ_QUESTIONS.length}
              </p>
              <div className="text-center">
                <p className="mb-1.5 whitespace-pre-line text-lg font-bold leading-snug text-text font-serif">{question.text}</p>
                {badge && <div className="flex justify-center mb-1.5">{badge}</div>}
                {question.hint && <p className="text-xs text-text-muted">{question.hint}</p>}
              </div>
            </div>

            {/* 2단: 보기 목록 — 여기서만 스크롤 */}
            <div className="relative min-h-0 flex-1">
              <div ref={scrollAreaRef} className="custom-scrollbar flex max-h-full flex-col gap-2 overflow-y-auto px-4 pb-4">
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
                    multiSelected.filter((v) => !EXCLUSIVE_NONE.includes(v)).length >= question.maxSelect &&
                    !EXCLUSIVE_NONE.includes(answer.value);

                  return renderAnswerCard(answer, orderIndex, isSelected, isDisabled);
                })}

                {/* Q2 여행지 선택 — 같은 스크롤 영역 안에 포함 */}
                {isQ2Travel && (
                  <div className="mt-1 flex shrink-0 flex-col gap-1.5">
                    <p className="text-xs font-medium text-text-muted">지역을 선택해주세요.</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {TRAVEL_REGIONS.map((region) => (
                        <button
                          key={region.value}
                          type="button"
                          onClick={() => handleRegion(region.value)}
                          className={clsx(
                            'rounded-lg border px-2 py-1.5 text-center text-xs transition-colors cursor-pointer bg-white',
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
              </div>

              {isScrollable && (
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
              )}
            </div>

            {/* 3단: 하단 네비게이션 — 카드 최하단에 고정, 스크롤과 무관 */}
            <div className="flex shrink-0 items-center justify-center gap-6 border-t border-border bg-white px-6 py-3">
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
    </div>
  );
}