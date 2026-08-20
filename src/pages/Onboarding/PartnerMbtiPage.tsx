import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { useOnboarding } from './OnboardingContext';
import { apiFetch } from '../../lib/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components';
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';

const MBTI_STEPS = [
  {
    question: '파트너는 어느 쪽에 더 가까운가요?',
    options: [
      { letter: 'E', name: '외향형', desc: '사람들과 있을 때 에너지가 충전돼요' },
      { letter: 'I', name: '내향형', desc: '혼자 있을 때 에너지가 충전돼요' },
    ],
  },
  {
    question: '파트너는 어느 쪽에 더 가까운가요?',
    options: [
      { letter: 'S', name: '감각형', desc: '현실적이고 구체적인 걸 좋아해요' },
      { letter: 'N', name: '직관형', desc: '상상력이 풍부하고 미래지향적이에요' },
    ],
  },
  {
    question: '파트너는 어느 쪽에 더 가까운가요?',
    options: [
      { letter: 'T', name: '사고형', desc: '논리와 원칙을 중요하게 생각해요' },
      { letter: 'F', name: '감정형', desc: '사람의 마음과 관계를 중요시해요' },
    ],
  },
  {
    question: '파트너는 어느 쪽에 더 가까운가요?',
    options: [
      { letter: 'J', name: '판단형', desc: '계획적이고 체계적인 걸 좋아해요' },
      { letter: 'P', name: '인식형', desc: '즉흥적이고 유연한 걸 좋아해요' },
    ],
  },
];

const ALL_MBTI = [
  { type: 'ISTJ', desc: '신중하고 책임감 있는 현실주의자' },
  { type: 'ISFJ', desc: '헌신적이고 따뜻한 수호자' },
  { type: 'INFJ', desc: '깊은 통찰력을 가진 이상주의자' },
  { type: 'INTJ', desc: '전략적이고 독창적인 사색가' },
  { type: 'ISTP', desc: '대담하고 실용적인 장인' },
  { type: 'ISFP', desc: '섬세하고 예술적인 탐험가' },
  { type: 'INFP', desc: '낭만적이고 이상적인 중재자' },
  { type: 'INTP', desc: '논리적이고 창의적인 사상가' },
  { type: 'ESTP', desc: '에너지틱하고 즉흥적인 활동가' },
  { type: 'ESFP', desc: '사교적이고 쾌활한 연예인' },
  { type: 'ENFP', desc: '열정적이고 자유로운 영혼' },
  { type: 'ENTP', desc: '재치 있고 도전적인 변론가' },
  { type: 'ESTJ', desc: '체계적이고 효율적인 관리자' },
  { type: 'ESFJ', desc: '친절하고 사교적인 인기인' },
  { type: 'ENFJ', desc: '카리스마 있고 헌신적인 주인공' },
  { type: 'ENTJ', desc: '대담하고 결단력 있는 지도자' },
];

export default function PartnerMbtiPage() {
  const navigate = useNavigate();
  const { user, markOnboardingComplete } = useAuth();
  const { setPartnerMbti, quizAnswers } = useOnboarding();

  const [mode, setMode] = useState<'step' | 'direct'>('step');
  const [stepAnswers, setStepAnswers] = useState(['', '', '', '']);
  const [selectedMbti, setSelectedMbti] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const stepMbti = stepAnswers.every(Boolean) ? stepAnswers.join('') : '';
  const resolvedMbti = mode === 'step' ? stepMbti : selectedMbti;
  const isReady = !!resolvedMbti;

  async function handleSubmit() {
    if (!isReady) return;
    setPartnerMbti(resolvedMbti);
    setLoading(true);

    try {
      if (!user?.onboardingCompleted) {
        const onboardingRes = await apiFetch('/api/users/me/onboarding', { method: 'POST' });
        if (!onboardingRes.ok && onboardingRes.status !== 409) {
          setShowErrorModal(true);
          setLoading(false);
          return;
        }
        markOnboardingComplete();
      }

      const priorityValues = ((quizAnswers.q5 as string[]) ?? []).map((val, idx) => ({
        value: val,
        rank: idx + 1,
      }));

      const testRes = await apiFetch('/api/psychological-tests', {
        method: 'POST',
        body: JSON.stringify({
          moodType: quizAnswers.q1 as string,
          locationType: quizAnswers.q2 as string,
          region: quizAnswers.q2 === 'TRAVEL' ? ((quizAnswers.q2_region as string) ?? 'UNDECIDED') : 'UNDECIDED',
          preparationType: quizAnswers.q3 as string,
          requiredServices: (quizAnswers.q4 as string[]) ?? [],
          priorityValues,
          budgetRange: quizAnswers.q6 as string,
          excludedElements: (quizAnswers.q7 as string[]) ?? [],
          scheduleRange: quizAnswers.q8 as string,
          partnerMbti: resolvedMbti,
        }),
      });

      if (!testRes.ok) {
        setShowErrorModal(true);
        setLoading(false);
        return;
      }
    } catch {
      setShowErrorModal(true);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }

    navigate('/onboarding/result');
  }

  return (
    <>
    <ConfirmDeleteModal
      isOpen={showErrorModal}
      onClose={() => setShowErrorModal(false)}
      onConfirm={() => setShowErrorModal(false)}
      title="저장 중 오류가 발생했습니다"
      message="잠시 후 다시 시도해주세요."
      confirmLabel="확인"
      danger={false}
    />
    <div className="bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
      <div className="mx-auto w-full max-w-2xl px-5 py-10 md:px-8">
        {/* STEP 배지 */}
        <div className="flex justify-center mb-6">
          <span className="rounded-full border border-primary px-4 py-1 text-xs font-semibold text-primary">
            STEP 2
          </span>
        </div>

        {/* 제목 */}
        <h1 className="mb-3 text-center text-3xl font-bold text-text font-serif">
          파트너의 MBTI는 무엇인가요?
        </h1>
        <p className="mb-8 text-center text-sm leading-relaxed text-text-muted">
          상대방의 MBTI를 알려주시면 두 분의 성향을 분석해<br />더 완벽한 프로포즈 스타일을 추천해드려요.
        </p>

        {/* 카드 */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          {/* 탭 */}
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-semibold text-text">차근차근 선택하기</span>
            {mode === 'step' ? (
              <button
                type="button"
                onClick={() => setMode('direct')}
                className="text-sm font-semibold text-primary transition-colors hover:text-primary/70 cursor-pointer border-0 bg-transparent"
              >
                바로 MBTI 알고 있어요
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setMode('step'); setSelectedMbti(''); }}
                className="text-sm font-semibold text-primary transition-colors hover:text-primary/70 cursor-pointer border-0 bg-transparent"
              >
                접기
              </button>
            )}
          </div>

          {mode === 'step' ? (
            <div className="flex flex-col gap-6">
              {MBTI_STEPS.map((step, idx) => (
                <div key={idx}>
                  <p className="mb-3 text-sm font-medium text-text">
                    {idx + 1}. {step.question}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {step.options.map((opt) => {
                      const selected = stepAnswers[idx] === opt.letter;
                      return (
                        <button
                          key={opt.letter}
                          type="button"
                          onClick={() => {
                            const next = [...stepAnswers];
                            next[idx] = opt.letter;
                            setStepAnswers(next);
                          }}
                          className={clsx(
                            'rounded-xl border p-4 text-left transition-all cursor-pointer',
                            selected
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-white hover:border-primary/40 hover:bg-primary/5'
                          )}
                        >
                          <p className={clsx('mb-1 text-xs', selected ? 'text-primary' : 'text-text-muted')}>
                            {opt.letter}
                          </p>
                          <p className={clsx('mb-0.5 text-sm font-bold', selected ? 'text-primary' : 'text-text')}>
                            {opt.name}
                          </p>
                          <p className={clsx('text-xs leading-relaxed', selected ? 'text-primary/80' : 'text-text-muted')}>
                            {opt.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {ALL_MBTI.map(({ type, desc }) => {
                const selected = selectedMbti === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedMbti(type)}
                    className={clsx(
                      'rounded-xl border p-3 text-center transition-all cursor-pointer',
                      selected
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-white hover:border-primary/40 hover:bg-primary/5'
                    )}
                  >
                    <p className={clsx('mb-1 text-sm font-bold', selected ? 'text-primary' : 'text-text')}>
                      {type}
                    </p>
                    <p className={clsx('text-[10px] leading-relaxed break-keep', selected ? 'text-primary/80' : 'text-text-muted')}>
                      {desc}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="secondary" className="flex items-center gap-1.5" onClick={() => navigate('/onboarding/quiz')}>
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            이전
          </Button>
          <Button className="flex items-center gap-1.5" disabled={!isReady || loading} onClick={handleSubmit}>
            {loading ? '제출 중...' : '결과 확인하기'}
            {!loading && <ArrowRight className="h-4 w-4" strokeWidth={2} />}
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}
