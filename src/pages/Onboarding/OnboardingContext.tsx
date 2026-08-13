import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type QuestionType = 'single' | 'multi' | 'ordered';

export interface QuizAnswer {
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  hint: string;
  type: QuestionType;
  maxSelect?: number;
  maxOrder?: number;
  answers: QuizAnswer[];
}

export type QuizAnswers = Record<string, string | string[]>;

interface OnboardingState {
  quizAnswers: QuizAnswers;
  partnerMbti: string;
  setQuizAnswers: (answers: QuizAnswers) => void;
  setPartnerMbti: (mbti: string) => void;
}

const OnboardingContext = createContext<OnboardingState | null>(null);

const STORAGE_KEY = 'wedu_onboarding';

function loadFromStorage(): { quizAnswers: QuizAnswers; partnerMbti: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { quizAnswers: {}, partnerMbti: '' };
    return JSON.parse(raw);
  } catch {
    return { quizAnswers: {}, partnerMbti: '' };
  }
}

function saveToStorage(quizAnswers: QuizAnswers, partnerMbti: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ quizAnswers, partnerMbti }));
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const initial = loadFromStorage();
  const [quizAnswers, setQuizAnswersState] = useState<QuizAnswers>(initial.quizAnswers);
  const [partnerMbti, setPartnerMbtiState] = useState(initial.partnerMbti);

  function setQuizAnswers(answers: QuizAnswers) {
    setQuizAnswersState(answers);
    saveToStorage(answers, partnerMbti);
  }

  function setPartnerMbti(mbti: string) {
    setPartnerMbtiState(mbti);
    saveToStorage(quizAnswers, mbti);
  }

  return (
    <OnboardingContext.Provider value={{ quizAnswers, partnerMbti, setQuizAnswers, setPartnerMbti }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    text: '어떤 분위기의 프로포즈를 가장 원하시나요?',
    hint: '하나만 선택해주세요.',
    type: 'single',
    answers: [
      { label: '둘만의 조용하고 로맨틱한 프로포즈', value: 'ROMANTIC_PRIVATE' },
      { label: '영화처럼 화려하고 특별한 프로포즈', value: 'LUXURY_EVENT' },
      { label: '여행지에서 자연스럽게 이어지는 프로포즈', value: 'TRAVEL_NATURAL' },
      { label: '편안한 공간에서 진심을 전하는 프로포즈', value: 'COZY_SINCERE' },
      { label: '예상하지 못한 깜짝 프로포즈', value: 'SURPRISE_EVENT' },
      { label: '아직 잘 모르겠고 추천받고 싶어요', value: 'UNDECIDED' },
    ],
  },
  {
    id: 'q2',
    text: '프로포즈를 하고 싶은 장소는 어디인가요?',
    hint: '하나만 선택해주세요.',
    type: 'single',
    answers: [
      { label: '호텔 또는 프라이빗 객실', value: 'HOTEL' },
      { label: '분위기 좋은 레스토랑', value: 'RESTAURANT' },
      { label: '바다, 노을, 야경이 보이는 야외 공간', value: 'OUTDOOR' },
      { label: '펜션, 풀빌라 또는 글램핑장', value: 'PENSION_POOLVILLA' },
      { label: '국내 또는 해외 여행지', value: 'TRAVEL' },
      { label: '집 또는 둘만의 추억이 있는 공간', value: 'HOME_PRIVATE_SPACE' },
      { label: '아직 정하지 않았어요', value: 'UNDECIDED' },
    ],
  },
  {
    id: 'q3',
    text: '프로포즈를 어느 정도까지 직접 준비하고 싶나요?',
    hint: '하나만 선택해주세요.',
    type: 'single',
    answers: [
      { label: '장소부터 장식과 진행까지 업체에 모두 맡기고 싶어요', value: 'FULL_SERVICE' },
      { label: '장소와 주요 연출은 맡기고 편지와 선물은 직접 준비하고 싶어요', value: 'SEMI_SERVICE' },
      { label: '장소만 예약하고 장식이나 소품은 직접 준비하고 싶어요', value: 'VENUE_AND_DIY' },
      { label: '프로포즈 소품이나 DIY 패키지만 구매해 직접 준비하고 싶어요', value: 'DIY_PACKAGE' },
      { label: '꽃, 촬영, 케이크 등 필요한 서비스만 따로 이용하고 싶어요', value: 'CUSTOM_COMBINATION' },
      { label: '아직 정하지 못해서 상황에 맞게 추천받고 싶어요', value: 'UNDECIDED' },
    ],
  },
  {
    id: 'q4',
    text: '업체에 맡기고 싶은 항목은 무엇인가요?',
    hint: '최대 3개까지 선택해주세요.',
    type: 'multi',
    maxSelect: 3,
    answers: [
      { label: '장소 예약 또는 대관', value: 'VENUE' },
      { label: '공간 장식', value: 'DECORATION' },
      { label: '꽃다발 또는 플라워 연출', value: 'FLOWER' },
      { label: '케이크 또는 디저트', value: 'CAKE' },
      { label: '사진 촬영', value: 'PHOTO' },
      { label: '영상 촬영 또는 영상편지 제작', value: 'VIDEO' },
      { label: '전체 프로포즈 기획과 진행', value: 'FULL_PLANNING' },
      { label: '반지 또는 선물 준비', value: 'GIFT' },
      { label: '소품 구매', value: 'PROPS' },
      { label: '별도의 업체 도움이 필요하지 않아요', value: 'NO_SERVICE' },
    ],
  },
  {
    id: 'q5',
    text: '프로포즈에서 가장 중요하게 생각하는 것은 무엇인가요?',
    hint: '가장 중요한 항목 2개를 순서대로 선택해주세요.',
    type: 'ordered',
    maxOrder: 2,
    answers: [
      { label: '상대방이 느끼는 감동', value: 'EMOTION' },
      { label: '장소와 전체 분위기', value: 'ATMOSPHERE' },
      { label: '사진과 영상으로 남기는 추억', value: 'MEMORY' },
      { label: '누구나 하지 않는 특별한 연출', value: 'UNIQUENESS' },
      { label: '준비 과정의 편리함', value: 'CONVENIENCE' },
      { label: '합리적인 비용', value: 'COST_EFFECTIVENESS' },
      { label: '반지나 선물의 의미', value: 'GIFT_VALUE' },
    ],
  },
  {
    id: 'q6',
    text: '프로포즈 연출에 사용할 예상 예산은 어느 정도인가요?',
    hint: '반지나 고가의 선물 비용을 제외한 프로포즈 준비 비용 기준으로 선택해주세요.',
    type: 'single',
    answers: [
      { label: '20만 원 이하', value: 'UNDER_200000' },
      { label: '20만 원 이상 50만 원 미만', value: '200000_TO_500000' },
      { label: '50만 원 이상 100만 원 미만', value: '500000_TO_1000000' },
      { label: '100만 원 이상 200만 원 미만', value: '1000000_TO_2000000' },
      { label: '200만 원 이상 300만 원 미만', value: '2000000_TO_3000000' },
      { label: '300만 원 이상', value: 'OVER_3000000' },
      { label: '아직 정하지 않았어요', value: 'UNDECIDED' },
    ],
  },
  {
    id: 'q7',
    text: '상대방이 부담스러워하거나 원하지 않을 것 같은 요소가 있나요?',
    hint: '복수 선택할 수 있습니다.',
    type: 'multi',
    answers: [
      { label: '사람이 많은 장소에서 하는 공개 프로포즈', value: 'PUBLIC_EVENT' },
      { label: '가족이나 친구가 함께하는 프로포즈', value: 'FAMILY_FRIEND_PARTICIPATION' },
      { label: '노래나 춤 같은 공연형 이벤트', value: 'PERFORMANCE' },
      { label: '과하게 화려한 공간 장식', value: 'HEAVY_DECORATION' },
      { label: '사진이나 영상 촬영', value: 'PHOTO_VIDEO' },
      { label: '갑작스러운 여행 또는 일정 변경', value: 'SURPRISE_TRAVEL' },
      { label: '너무 많은 비용을 사용한 프로포즈', value: 'HIGH_COST' },
      { label: '너무 소박하거나 준비가 적어 보이는 프로포즈', value: 'TOO_SIMPLE' },
      { label: '특별히 없어요', value: 'NONE' },
      { label: '잘 모르겠어요', value: 'UNKNOWN' },
    ],
  },
  {
    id: 'q8',
    text: '프로포즈 예정 시기는 언제인가요?',
    hint: '하나만 선택해주세요.',
    type: 'single',
    answers: [
      { label: '2주 이내', value: 'WITHIN_2_WEEKS' },
      { label: '2주 이상 1개월 이내', value: 'WITHIN_1_MONTH' },
      { label: '1개월 이상 3개월 이내', value: 'WITHIN_3_MONTHS' },
      { label: '3개월 이상 6개월 이내', value: 'WITHIN_6_MONTHS' },
      { label: '6개월 이후', value: 'AFTER_6_MONTHS' },
      { label: '아직 정하지 않았어요', value: 'UNDECIDED' },
    ],
  },
];

export const TRAVEL_REGIONS: QuizAnswer[] = [
  { label: '서울', value: 'SEOUL' },
  { label: '경기·인천', value: 'GYEONGGI_INCHEON' },
  { label: '강원', value: 'GANGWON' },
  { label: '부산', value: 'BUSAN' },
  { label: '제주', value: 'JEJU' },
  { label: '일본', value: 'JAPAN' },
  { label: '동남아시아', value: 'SOUTHEAST_ASIA' },
  { label: '기타', value: 'OTHER' },
  { label: '아직 정하지 않음', value: 'UNDECIDED' },
];
