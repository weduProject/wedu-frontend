import { useNavigate } from 'react-router-dom';
import {
  Heart,
  HeartHandshake,
  Flower2,
  Sparkles,
  Waves,
  Mail,
  PartyPopper,
  Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useOnboarding } from './OnboardingContext';
import { Button } from '../../components';

// ─── 스타일 데이터 ─────────────────────────────────────────────
export const STYLE_DATA: Record<string, {
  Icon: LucideIcon;
  name: string;
  description: string;
  places: string[];
  keywords: string[];
  ideas: string[];
}> = {
  ROMANTIC_PRIVATE: {
    Icon: Flower2,
    name: '로맨틱',
    description: '고전적인 로맨스를 꿈꾸는 당신. 촛불, 장미, 부드러운 음악이 어우러진 감동적인 프로포즈를 선호합니다.',
    places: ['고급 레스토랑', '호텔 다이닝', '루프탑 바', '와이너리'],
    keywords: ['우아한', '클래식', '로맨틱', '감미로운'],
    ideas: [
      '촛불이 가득한 고급 레스토랑에서 깜짝 프로포즈',
      '수백 개의 장미로 장식된 공간 연출',
      '현악 4중주가 흐르는 저녁 식사',
      '불꽃놀이가 보이는 야경 명소에서의 프로포즈',
    ],
  },
  LUXURY_EVENT: {
    Icon: Sparkles,
    name: '럭셔리',
    description: '특별하고 화려한 순간을 원하는 당신.\n최고급 호텔과 완벽한 연출로 평생 기억에 남을 프로포즈를 계획합니다.',
    places: ['5성급 호텔', '프라이빗 다이닝', '크루즈', '야외 특설 무대'],
    keywords: ['화려한', '특별한', '고급스러운', '완벽한'],
    ideas: [
      '호텔 프라이빗 룸에서 깜짝 이벤트',
      '루프탑에서 불꽃놀이와 함께하는 프로포즈',
      '전속 사진작가와 함께하는 프로포즈',
      '맞춤 제작 영상 상영 후 프로포즈',
    ],
  },
  TRAVEL_NATURAL: {
    Icon: Waves,
    name: '여행 감성',
    description: '여행지에서 자연스럽게 이어지는 프로포즈를 꿈꾸는 당신. 아름다운 풍경 속에서 진심을 전하는 스타일입니다.',
    places: ['제주 해변', '해외 여행지', '노을 명소', '산 정상'],
    keywords: ['자연스러운', '감성적인', '모험적인', '자유로운'],
    ideas: [
      '여행 중 자연스럽게 이어지는 프로포즈',
      '아름다운 노을을 배경으로',
      '두 사람이 함께한 여행지에서',
      '현지 특별한 레스토랑 예약 후 프로포즈',
    ],
  },
  COZY_SINCERE: {
    Icon: Mail,
    name: '따뜻한 진심',
    description: '편안한 공간에서 진심을 전하는 당신. 화려함보다 진정성 있는 감동을 추구하는 프로포즈 스타일입니다.',
    places: ['집', '단골 카페', '추억의 장소', '아늑한 레스토랑'],
    keywords: ['진심', '따뜻한', '아늑한', '소박한'],
    ideas: [
      '직접 쓴 편지와 함께하는 프로포즈',
      '두 사람의 추억이 담긴 장소에서',
      '집에서 직접 만든 음식과 함께',
      '좋아하는 영화를 보다가 깜짝 프로포즈',
    ],
  },
  SURPRISE_EVENT: {
    Icon: PartyPopper,
    name: '깜짝 이벤트',
    description: '예상치 못한 순간에 깜짝 놀라게 하는 프로포즈를 원하는 당신. 완벽한 타이밍과 반전이 있는 스타일입니다.',
    places: ['특별한 날의 장소', '플래시몹 공간', '야경 명소', '추억의 장소'],
    keywords: ['깜짝', '반전', '감동적인', '특별한'],
    ideas: [
      '가족과 함께하는 깜짝 프로포즈',
      '플래시몹으로 주변을 놀라게',
      '여행 중 몰래 준비한 이벤트',
      '일상 속 예상치 못한 순간에',
    ],
  },
  UNDECIDED: {
    Icon: Star,
    name: '맞춤 추천',
    description: '아직 스타일을 정하지 않았지만, 두 분의 성향을 분석해 가장 잘 어울리는 프로포즈를 찾아드릴게요.',
    places: ['호텔', '레스토랑', '야외', '여행지'],
    keywords: ['맞춤', '특별한', '감동적인', '완벽한'],
    ideas: [
      '두 분만의 특별한 장소에서',
      '파트너가 좋아하는 것들로 가득한 공간',
      '완벽하게 계획된 하루',
      '잊지 못할 순간 만들기',
    ],
  },
};

function GradientNumberBadge({ number }: { number: number }) {
  return (
    <span
      className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
      style={{
        background: 'linear-gradient(111.47deg, #F79689 0%, #E8796C 33.33%, #FEABA0 66.67%, #E8796C 100%)',
      }}
    >
      {/* 안쪽 원 — 카드 배경(흰색)으로 덮어서 링만 남김 */}
      <span className="absolute inset-[2px] rounded-full bg-white" />
      {/* 숫자 텍스트 — 같은 그라디언트를 텍스트에 직접 클리핑 */}
      <span
        className="relative text-[11px] font-bold"
        style={{
          background: 'linear-gradient(111.47deg, #F79689 0%, #E8796C 33.33%, #FEABA0 66.67%, #E8796C 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {number}
      </span>
    </span>
  );
}

// 그라디언트 테두리 뱃지 — 바깥 래퍼가 그라디언트 배경, 안쪽 span이 흰 배경으로 1px 얇게 감싸는 방식
function GradientBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full p-[2px] gradient-primary-bg">
      <span className="flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium leading-none tracking-[0.3px] text-primary">
        {label}
      </span>
    </span>
  );
}

// ─── 궁합 % 계산 ──────────────────────────────────────────────
export function computeCompatibility(moodType: string, partnerMbti: string) {
  const seed = (moodType + partnerMbti)
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const score = 45 + (seed % 50);

  if (score >= 80) return { score, message: '완벽한 궁합이에요!\n두 분은 서로를 너무나도 잘 이해해요.' };
  if (score >= 65) return { score, message: '좋은 궁합이에요. 서로의 장점을 살려 완벽한 프로포즈를 만들어보세요.' };
  return { score, message: '서로 다른 매력이 만났네요. 조화롭게 맞춰가면 더 특별해질 거예요.' };
}

// ──────────────────────────────────────────────────────────────
export default function ResultPage() {
  const navigate = useNavigate();
  const { quizAnswers, partnerMbti, resetQuiz } = useOnboarding();

  const moodType = (quizAnswers.q1 as string) || 'UNDECIDED';
  const style = STYLE_DATA[moodType] ?? STYLE_DATA.UNDECIDED;
  const { Icon: StyleIcon } = style;
  const compat = computeCompatibility(moodType, partnerMbti || 'INFP');

  return (
    <div className="bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
      <div className="mx-auto w-full max-w-2xl px-5 py-10 md:px-8">

        {/* 헤더 */}
        <div className="mb-8 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary px-4 py-1 text-xs font-semibold text-primary">
            테스트 완료!
          </span>
          <h1 className="mb-2 text-3xl font-bold text-text font-serif">
            두 분의 프로포즈 스타일은
          </h1>
          <p className="text-sm text-text-muted">나의 성향과 파트너의 MBTI를 분석한 결과예요</p>
        </div>

        {/* 결과 카드 */}
        <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        
        {/* 궁합 섹션 */}
        <div className="flex justify-center px-6 pt-6">
          <div className="flex w-full flex-col items-center gap-2 rounded-2xl gradient-primary-bg px-6 py-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <HeartHandshake className="h-8 w-8 text-white" strokeWidth={1.5} />
            </span>
            <p className="text-4xl font-extrabold text-white">{compat.score}%</p>
            <p className="text-sm text-white/85 max-w-xs whitespace-pre-line leading-relaxed">{compat.message}</p>
          </div>
        </div>

          <div className="px-6 py-6 flex flex-col gap-6">
            {/* 나의 성향 ↔ 파트너 MBTI */}
            <div className="flex items-center justify-center gap-10 sm:gap-16">
              <div className="text-center">
                <p className="mb-1 text-xs text-text-muted">나의 성향</p>
                <p className="flex items-center justify-center gap-1.5 text-base font-bold text-text">
                  <StyleIcon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                  {style.name}
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-primary-bg">
                <Heart className="h-4 w-4 text-white" strokeWidth={1.8} fill="currentColor" />
              </span>
              <div className="text-center">
                <p className="mb-1 text-xs text-text-muted">파트너 MBTI</p>
                <p className="text-base font-bold text-text">{partnerMbti || '미입력'}</p>
              </div>
            </div>

          <hr className="border-border/60" />

          {/* 추천 스타일 */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="mb-2 text-xs text-text-muted">추천 프로포즈 스타일</p>
              <p className="flex items-center gap-2 text-2xl font-bold text-text font-serif">
                <StyleIcon className="h-6 w-6 text-primary" strokeWidth={1.8} />
                {style.name}
              </p>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line text-text-muted">{style.description}</p>
          </div>
          
            {/* 태그 */}
<div className="grid grid-cols-2 gap-4">
  <div>
    <p className="mb-2 text-xs text-text-muted">추천 장소</p>
    <div className="flex flex-wrap gap-1.5">
      {style.places.map((p) => (
        <GradientBadge key={p} label={p} />
      ))}
    </div>
  </div>
  <div>
    <p className="mb-2 text-xs text-text-muted">분위기 키워드</p>
    <div className="flex flex-wrap gap-1.5">
      {style.keywords.map((k) => (
        <GradientBadge key={k} label={k} />
      ))}
    </div>
  </div>
</div>

            <hr className="border-border/60" />

            {/* 프로포즈 아이디어 */}
            <div>
              <p className="mb-4 text-sm font-semibold text-text">이렇게 프로포즈해보는 건 어떨까요?</p>
              <div className="flex flex-col gap-3">
                {style.ideas.map((idea, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <GradientNumberBadge number={idx + 1} />
                    <p className="text-sm text-text-muted leading-relaxed">{idea}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-6 flex gap-3">
          <Button className="flex-1" onClick={() => navigate('/shop')}>
            프로포즈 상품 보러가기
          </Button>
          <Button variant="secondary" className="whitespace-nowrap" onClick={() => { resetQuiz(); navigate('/onboarding/intro'); }}>
            다시 테스트하기
          </Button>
          <Button variant="secondary" className="whitespace-nowrap" onClick={() => navigate('/mypage/dashboard')}>
            대시보드로 가기
          </Button>
        </div>
      </div>
    </div>
  );
}
