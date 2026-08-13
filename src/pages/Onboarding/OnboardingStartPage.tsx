import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, HeartPlus, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const STEPS = [
  {
    step: 'STEP 1',
    title: '나의 성향 알아보기',
    desc: '12가지 질문으로 나만의 프로포즈 스타일을 찾아보세요.',
    Icon: User,
  },
  {
    step: 'STEP 2',
    title: '파트너 MBTI 입력하기',
    desc: '파트너의 MBTI를 알려주면 더 완벽한 매칭 결과를 얻을 수 있습니다.',
    Icon: HeartPlus,
  },
  {
    step: 'STEP 3',
    title: '맞춤 결과 확인하기',
    desc: '두 분의 성향을 분석해 가장 어울리는 프로포즈 스타일을 추천해드려요.',
    Icon: Star,
  },
];

const STATS = [
  { value: '12,000+', label: '참여 커플' },
  { value: '96%', label: '만족도' },
  { value: '3분', label: '소요 시간' },
  { value: '6가지', label: '스타일 유형' },
];

export default function OnboardingStartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isCompleted = user?.onboardingCompleted ?? false;

  return (
    <div className="-mx-5 -mt-5 md:-mx-8 md:-mt-8">
      {/* 히어로 섹션 */}
      <section className="flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 via-pink-50/40 to-white px-4 py-20 text-center">
        <span className="mb-6 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
          심리테스트
        </span>

        <h1 className="mb-5 text-4xl font-bold leading-snug text-text md:text-5xl">
          두 분만의<br />
          <span className="text-primary">완벽한 프로포즈를</span><br />
          찾아드릴게요
        </h1>

        <p className="mb-8 max-w-md text-sm leading-relaxed text-text-muted">
          간단한 심리테스트로 여러분의 성향을 분석하고,<br />
          파트너와의 궁합까지 고려해서 맞춤형 프로포즈 스타일을 추천해드려요.<br />
          단 3분이면 충분합니다.
        </p>

        <div className="mb-16 flex gap-3">
          {isCompleted ? (
            <>
              <div className="flex items-center gap-2 rounded-full bg-primary-light px-5 py-3 text-sm font-semibold text-primary">
                <CheckCircle className="h-4 w-4" strokeWidth={2} />
                테스트 완료
              </div>
              <button
                type="button"
                onClick={() => navigate('/onboarding/intro')}
                className="rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-text transition-colors hover:bg-gray-50"
              >
                다시 하기
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/onboarding/intro')}
                className="btn-primary"
              >
                무료 테스트 시작하기
              </button>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-text transition-colors hover:bg-gray-50"
              >
                프로포즈 둘러보기
              </button>
            </>
          )}
        </div>

        {/* 3단계 프로세스 */}
        <div className="flex w-full max-w-3xl items-start gap-3">
          {STEPS.map(({ step, title, desc, Icon }, idx) => (
            <Fragment key={step}>
              <div className="flex flex-1 flex-col items-center rounded-2xl border border-border bg-white/80 p-6 text-center shadow-sm">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                </span>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-primary">{step}</p>
                <p className="mb-2 text-sm font-bold text-text">{title}</p>
                <p className="text-xs leading-relaxed text-text-muted">{desc}</p>
              </div>
              {idx < STEPS.length - 1 && (
                <ArrowRight className="mt-10 h-5 w-5 shrink-0 text-text-muted" strokeWidth={1.5} />
              )}
            </Fragment>
          ))}
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="bg-[#F5F2EF] px-4 py-16 text-center">
        <h2 className="mb-10 text-xl font-bold text-text">이미 많은 커플이 WEDU와 함께했어요</h2>
        <div className="mx-auto flex max-w-2xl justify-around">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-extrabold text-primary">{value}</span>
              <span className="text-xs text-text-muted">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 나중에 하기 */}
      <div className="bg-white py-6 text-center">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="cursor-pointer border-0 bg-transparent text-sm text-text-muted transition-colors hover:text-text"
        >
          나중에 하기
        </button>
      </div>
    </div>
  );
}
