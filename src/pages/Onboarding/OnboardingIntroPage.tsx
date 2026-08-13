import { useNavigate } from 'react-router-dom';
import { User, Heart, Star, ArrowLeft, ArrowRight } from 'lucide-react';

const TIPS = [
  {
    Icon: User,
    title: '솔직하게 답변하기',
    desc: '정답은 없어요. 직감적으로 가장 끌리는 답을 골라주세요. 솔직할수록 진짜 나와 맞는 스타일을 찾을 수 있어요.',
  },
  {
    Icon: Heart,
    title: '파트너 MBTI도 알려주세요',
    desc: '상대방의 MBTI를 알고 있다면 더 정확한 매칭이 가능해요. 모른다면 비슷한 유형을 추측해도 괜찮아요.',
  },
  {
    Icon: Star,
    title: '맞춤 결과는 바로 확인',
    desc: '테스트가 끝나면 바로 결과를 확인할 수 있어요. 결과는 마이페이지에 저장되어 언제든 다시 볼 수 있습니다.',
  },
];

export default function OnboardingIntroPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
    <div className="mx-auto w-full max-w-2xl px-5 py-8 md:px-8">
        {/* 상단 내비 */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/onboarding')}
            className="flex cursor-pointer items-center gap-1 border-0 bg-transparent text-sm text-text-muted transition-colors hover:text-text"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            온보딩으로 돌아가기
          </button>
          <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
            약 3분 소요
          </span>
        </div>

        {/* 타이틀 */}
        <h1 className="mb-2 text-3xl font-bold text-text">
          심리테스트 시작 전,<br />
          <span className="text-primary">이것만 알아두세요</span>
        </h1>
        <p className="mb-10 text-sm text-text-muted">
          총 12개의 질문으로 구성되어 있어요. 편안한 마음으로 시작해보세요.
        </p>

        {/* 팁 카드 */}
        <div className="flex flex-col gap-4 mb-10">
          {TIPS.map(({ Icon, title, desc }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
                <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
              </span>
              <div>
                <p className="mb-1 text-sm font-bold text-text">{title}</p>
                <p className="text-xs leading-relaxed text-text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/onboarding/quiz')}
            className="btn-primary flex items-center gap-2"
          >
            테스트 시작하기
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
          <p className="text-xs text-text-muted">
            로그인하지 않아도 테스트는 가능하지만, 결과 저장은 로그인이 필요해요.
          </p>
        </div>
    </div>
    </div>
  );
}
