import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Link2Off, Mail, Wallet, CalendarDays, Check, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch } from '../../lib/apiClient';
import type { ApiEnvelope } from '../../lib/apiClient';
import { Button } from '../../components';

// GET /api/friends/me, POST /api/friends 공통 응답 (Swagger 확인: 2026-08-11)
interface Partner {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
}

export default function ConnectPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [emailInput, setEmailInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [showDisconnect, setShowDisconnect] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [disconnectError, setDisconnectError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchPartner();
  }, [user]);

  async function fetchPartner() {
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/friends/me');
      const body: ApiEnvelope<Partner[]> = await res.json();
      if (res.ok && body.success && body.data && body.data.length > 0) {
        setPartner(body.data[0]);
      } else {
        setPartner(null);
      }
    } catch {
      setPartner(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddPartner(e: React.FormEvent) {
    e.preventDefault();
    const email = emailInput.trim();
    if (!email) return;

    setIsAdding(true);
    setAddError(null);
    try {
      const res = await apiFetch('/api/friends', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      const body: ApiEnvelope<Partner> = await res.json();
      if (!res.ok || !body.success || !body.data) {
        throw new Error(body.error?.message ?? '파트너 연결에 실패했어요.');
      }
      setPartner(body.data);
      setEmailInput('');
    } catch (err) {
      setAddError(err instanceof Error ? err.message : '파트너 연결에 실패했어요.');
    } finally {
      setIsAdding(false);
    }
  }

  async function handleDisconnect() {
    if (!partner) return;
    setIsDisconnecting(true);
    setDisconnectError(null);
    try {
      const res = await apiFetch(`/api/friends/${partner.userId}`, { method: 'DELETE' });
      if (!res.ok) {
        const body: ApiEnvelope<null> = await res.json();
        throw new Error(body.error?.message ?? '연결 해제에 실패했어요.');
      }
      setPartner(null);
      setShowDisconnect(false);
    } catch (err) {
      setDisconnectError(err instanceof Error ? err.message : '연결 해제에 실패했어요.');
    } finally {
      setIsDisconnecting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl pt-6 md:pt-10">

      {/* 페이지 헤더 */}
      <div className="text-center mb-6 md:mb-8">
        <p className="text-xs text-text-muted tracking-[0.25em] uppercase font-medium mb-3">
          Partner Connection
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">함께 준비할까요?</h1>
        <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
          파트너의 이메일을 입력하면 서로의 웨딩 플래너를 함께 볼 수 있어요.
        </p>
      </div>

      {/* 연결된 상태 */}
      {partner && (
        <div className="rounded-2xl bg-white border border-border overflow-hidden">
          <div className="relative h-48 gradient-primary-bg flex flex-col justify-end p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" strokeWidth={1.5} />
              </div>
              <span className="text-xs tracking-[0.2em] uppercase font-medium text-white/80">Connected</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {partner.nickname}님과 함께 준비 중
            </h2>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {[
                { label: '예산 관리', to: '/budget',    icon: Wallet },
                { label: 'D-DAY',    to: '/dday',      icon: CalendarDays },
                { label: '체크리스트', to: '/checklist', icon: Check },
                { label: '일정 관리', to: '/calendar',  icon: Calendar },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(item.to)}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary-light/40 transition-all cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light/60 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <span className="text-sm font-medium text-text whitespace-nowrap">{item.label}</span>
                </button>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Button
                variant="secondary"
                onClick={() => setShowDisconnect(true)}
                className="!rounded-xl text-text-muted"
              >
                연결 해제하기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 미연결 상태 */}
      {!partner && (
        <>
          <div className="rounded-2xl bg-white border border-border overflow-hidden mb-6">
            <div className="relative h-56 border border-primary-light bg-gradient-to-br from-[#fff2f0] via-[#fffafa] to-[#fce9e8] flex flex-col items-center justify-center text-center px-6">
              <Heart className="w-10 h-10 text-primary mb-4" strokeWidth={1.5} />
              <p className="text-text font-semibold text-base leading-relaxed">
                아직 파트너와 연결되지 않았어요.<br />
                이메일로 파트너를 추가해보세요.
              </p>
            </div>

            <div className="p-6 md:p-8">
              <form onSubmit={handleAddPartner} className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-text">파트너 이메일</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" strokeWidth={1.8} />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => { setEmailInput(e.target.value); setAddError(null); }}
                      placeholder="partner@example.com"
                      className="w-full rounded-xl border border-border py-3 pl-10 pr-4 text-sm text-text focus:border-primary focus:outline-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isAdding || !emailInput.trim()}
                    className="shrink-0 !rounded-xl"
                  >
                    {isAdding ? '연결 중...' : '연결하기'}
                  </Button>
                </div>
                {addError && <p className="text-xs text-error">{addError}</p>}
              </form>
            </div>
          </div>

          {/* How it works */}
          <div className="rounded-2xl bg-white border border-border p-8 md:p-12">
            <p className="text-xs text-text-muted tracking-[0.25em] uppercase text-center font-medium mb-10">
              How it works
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: '이메일 입력', desc: '파트너의 WEDU 가입 이메일을 입력하세요.' },
                { step: '02', title: '즉시 연결',   desc: '입력 즉시 파트너와 연결되어 플래너를 공유할 수 있어요.' },
                { step: '03', title: '함께 준비',  desc: '예산, D-Day, 체크리스트, 일정을 실시간으로 함께 관리해요.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-light flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{item.step}</span>
                  </div>
                  <h4 className="text-base font-semibold text-text mb-2">{item.title}</h4>
                  <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 연결 해제 확인 모달 */}
      {showDisconnect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-2xl bg-white border border-border shadow-xl p-8 w-full max-w-sm mx-4 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
              <Link2Off className="w-6 h-6 text-red-500" strokeWidth={1.8} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">연결을 해제할까요?</h3>
            <p className="text-sm text-text-muted mb-2 leading-relaxed">
              연결을 해제하면 파트너와의 데이터 공유가 중단됩니다.<br />
              기존 데이터는 삭제되지 않아요.
            </p>
            {disconnectError && <p className="text-xs text-error mb-3">{disconnectError}</p>}
            <div className="flex gap-3 mt-6">
                            <Button
                variant="secondary"
                onClick={() => { setShowDisconnect(false); setDisconnectError(null); }}
                className="flex-1 !rounded-xl !px-4 !py-3 text-text-muted"
              >
                취소
              </Button>
              <Button
                variant="secondary"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="flex-1 !rounded-xl !px-4 !py-3 !border-0 !bg-red-500 !text-white hover:enabled:!bg-red-600"
              >
                {isDisconnecting ? '해제 중...' : '해제하기'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
