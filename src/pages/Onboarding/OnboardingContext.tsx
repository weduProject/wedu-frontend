import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface OnboardingState {
  myAnswers: number[];
  partnerMbti: string;
  setMyAnswers: (answers: number[]) => void;
  setPartnerMbti: (mbti: string) => void;
}

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [myAnswers, setMyAnswers] = useState<number[]>(Array(12).fill(-1));
  const [partnerMbti, setPartnerMbti] = useState('');

  return (
    <OnboardingContext.Provider value={{ myAnswers, partnerMbti, setMyAnswers, setPartnerMbti }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}

export const QUESTIONS = [
  { text: '나는 새로운 환경보다 익숙한 환경이 더 편하다', dimension: 'EI', forFirst: false },
  { text: '사람들과 함께 있으면 에너지가 충전되는 느낌이다', dimension: 'EI', forFirst: true },
  { text: '처음 만난 사람과 쉽게 친해지는 편이다', dimension: 'EI', forFirst: true },
  { text: '계획할 때 구체적인 세부 사항을 중요시한다', dimension: 'SN', forFirst: true },
  { text: '상상력과 창의적인 아이디어를 더 중요하게 여긴다', dimension: 'SN', forFirst: false },
  { text: '경험과 사실에 근거하여 결정하는 편이다', dimension: 'SN', forFirst: true },
  { text: '결정을 내릴 때 감정보다 논리를 더 중요시한다', dimension: 'TF', forFirst: true },
  { text: '갈등 상황에서 상대방의 감정을 먼저 살핀다', dimension: 'TF', forFirst: false },
  { text: '타인의 기분을 잘 파악하고 공감하는 편이다', dimension: 'TF', forFirst: false },
  { text: '일정과 계획이 있어야 마음이 편하다', dimension: 'JP', forFirst: true },
  { text: '즉흥적인 계획 변경을 즐기는 편이다', dimension: 'JP', forFirst: false },
  { text: '마감 기한을 미리 지키는 편이다', dimension: 'JP', forFirst: true },
] as const;

export const ANSWERS = ['매우 그렇다', '그렇다', '보통이다', '아니다', '전혀 아니다'];

