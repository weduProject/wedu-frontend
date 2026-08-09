import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Mail, Copy, Check, Link2Off } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch } from '../../lib/apiClient';

interface PartnerConnection {
  id: string;
  userId: string;
  partnerId: string | null;
  shareCode: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface PartnerProfile {
  id: string;
  nickname: string;
  email: string;
  weddingDate: string | null;
}

function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function ConnectPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get('code');

  const [connection, setConnection] = useState<PartnerConnection | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadConnection = useCallback(async () => {
    if (!user) return;
    try {
      const res = await apiFetch('/api/partner/connection');
      if (res.ok) {
        const body = await res.json();
        const data: PartnerConnection | null = body.data ?? null;
        setConnection(data);

        if (data?.status === 'accepted') {
          const otherId = data.userId === String(user.id) ? data.partnerId : data.userId;
          if (otherId) {
            const profileRes = await apiFetch(`/api/users/${otherId}/profile`);
            if (profileRes.ok) {
              const profileBody = await profileRes.json();
              setPartnerProfile(profileBody.data ?? null);
            }
          }
        }
      } else {
        setConnection(null);
      }
    } catch {
      setConnection(null);
    } finally {
      setPageLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadConnection();
  }, [user, navigate, loadConnection]);

  useEffect(() => {
    if (!inviteCode || !user) return;
    apiFetch(`/api/partner/invite/${inviteCode}`)
      .then(res => res.ok ? res.json() : null)
      .then(body => { if (body?.data) setConnection(body.data); })
      .catch(() => {});
  }, [inviteCode, user]);

  const showSuccess = (msg: string, ms = 4000) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), ms);
  };

  const handleCreateInvite = async () => {
    if (!user || actionLoading) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/partner/invite', {
        method: 'POST',
        body: JSON.stringify({ shareCode: generateShareCode() }),
      });
      if (!res.ok) throw new Error();
      await loadConnection();
      showSuccess('초대장이 준비됐어요! 링크를 복사해서 공유해주세요.');
    } catch {
      setError('초대장 생성에 실패했어요.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!user || !connection || actionLoading) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/api/partner/invite/${connection.id}/accept`, { method: 'POST' });
      if (!res.ok) throw new Error();
      await loadConnection();
      showSuccess('함께 웨딩 준비를 시작해보세요! 💍', 5000);
    } catch {
      setError('수락 처리에 실패했어요.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectInvite = async () => {
    if (!user || !connection || actionLoading) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/api/partner/invite/${connection.id}/reject`, { method: 'POST' });
      if (!res.ok) throw new Error();
      setConnection(null);
      showSuccess('초대를 거절했어요.', 3000);
    } catch {
      setError('처리에 실패했어요.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelInvite = async () => {
    if (!user || !connection || actionLoading) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/api/partner/invite/${connection.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setConnection(null);
      showSuccess('초대를 취소했어요.', 3000);
    } catch {
      setError('취소에 실패했어요.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user || !connection || actionLoading) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/partner/connection', { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setConnection(null);
      setPartnerProfile(null);
      setShowDisconnect(false);
      showSuccess('연결이 해제됐어요.', 3000);
    } catch {
      setError('연결 해제에 실패했어요.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!connection) return;
    const url = `${window.location.origin}/connect?code=${connection.shareCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const inviteUrl = connection
    ? `${window.location.origin}/connect?code=${connection.shareCode}`
    : '';

  const isPendingSender   = connection?.status === 'pending' && connection?.userId === String(user?.id);
  const isPendingReceiver = connection?.status === 'pending' && connection?.userId !== String(user?.id);
  const isConnected       = connection?.status === 'accepted';

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">

      {/* 페이지 헤더 */}
      <div className="text-center mb-10 md:mb-14">
        <p className="text-xs text-text-muted tracking-[0.25em] uppercase font-medium mb-3">
          Partner Connection
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">함께 준비할까요?</h1>
        <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
          예비 신랑신부가 웨딩 준비를 함께 관리할 수 있어요.
          <br />초대장을 보내고 특별한 순간을 함께 만들어보세요.
        </p>
      </div>

      {/* 알림 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      {successMsg && (
        <div className="bg-primary-light border border-primary/20 rounded-xl p-4 mb-6 text-center">
          <p className="text-primary text-sm font-medium">{successMsg}</p>
        </div>
      )}

      {/* ── 연결된 상태 ── */}
      {isConnected && (
        <div className="rounded-2xl bg-white border border-border overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-rose-300 via-pink-200 to-amber-100 flex flex-col justify-end p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" strokeWidth={1.5} />
              </div>
              <span className="text-xs tracking-[0.2em] uppercase font-medium text-white/80">Connected</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {partnerProfile?.nickname || '파트너'}님과 함께 준비 중
            </h2>
          </div>

          <div className="p-6 md:p-10">
            {partnerProfile?.weddingDate && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/20 mb-8">
                <span className="text-sm font-medium text-primary">
                  결혼 예정일: {new Date(partnerProfile.weddingDate).toLocaleDateString('ko-KR')}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {[
                { label: '예산 관리', to: '/budget',    emoji: '💰' },
                { label: 'D-DAY',    to: '/dday',      emoji: '📅' },
                { label: '체크리스트', to: '/checklist', emoji: '✅' },
                { label: '일정 관리', to: '/calendar',  emoji: '🗓️' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(item.to)}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary-light/40 transition-all"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-sm font-medium text-text whitespace-nowrap">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowDisconnect(true)}
                className="px-5 py-2.5 rounded-xl border border-border text-text-muted text-sm hover:bg-gray-50 transition-colors"
              >
                연결 해제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 초대 전송 대기 중 ── */}
      {isPendingSender && (
        <div className="rounded-2xl bg-white border border-border overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100 flex flex-col justify-end p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white drop-shadow">초대장이 전달됐어요</h2>
            <p className="text-white/80 text-sm mt-1">파트너가 수락하길 기다리는 중이에요</p>
          </div>

          <div className="p-6 md:p-10 text-center">
            <p className="text-text-muted text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              파트너가 초대장을 열고 수락하면 연결이 완료됩니다.
              <br />아래 링크를 카카오톡이나 문자로 공유해주세요.
            </p>

            <div className="bg-[#FAF8F4] rounded-2xl border border-border p-4 mb-6 max-w-lg mx-auto">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="flex-1 px-3 py-2.5 rounded-xl bg-white text-sm text-text-muted border border-border focus:outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium whitespace-nowrap flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  {copied
                    ? <><Check className="w-4 h-4" /> 완료!</>
                    : <><Copy className="w-4 h-4" /> 복사</>
                  }
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCancelInvite}
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl border border-border text-text-muted text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {actionLoading ? '처리 중...' : '초대 취소하기'}
            </button>
          </div>
        </div>
      )}

      {/* ── 초대 수신 대기 중 ── */}
      {isPendingReceiver && (
        <div className="rounded-2xl bg-white border border-border overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-pink-200 via-rose-100 to-purple-100 flex flex-col justify-end p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white drop-shadow">초대장이 도착했어요 💌</h2>
          </div>

          <div className="p-6 md:p-10 text-center">
            <p className="text-text-muted text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              파트너가 웨딩 준비를 함께하고 싶어해요.
              <br />수락하면 예산, D-Day, 체크리스트, 일정을 함께 관리할 수 있어요.
            </p>

            <div className="flex gap-3 max-w-sm mx-auto">
              <button
                type="button"
                onClick={handleRejectInvite}
                disabled={actionLoading}
                className="flex-1 px-5 py-3 rounded-xl border border-border text-text-muted text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                정중히 거절
              </button>
              <button
                type="button"
                onClick={handleAcceptInvite}
                disabled={actionLoading}
                className="flex-1 px-5 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {actionLoading ? '처리 중...' : '수락하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 미연결 상태 ── */}
      {!connection && !inviteCode && (
        <div className="rounded-2xl bg-white border border-border overflow-hidden">
          <div className="relative h-64 bg-gradient-to-br from-rose-300 via-pink-200 to-amber-100 flex flex-col items-center justify-center text-center px-6">
            <Heart className="w-10 h-10 text-white mb-4" strokeWidth={1.5} />
            <p className="text-white font-semibold text-base leading-relaxed drop-shadow">
              아직 파트너와 연결되지 않았어요.
              <br />초대장을 만들어 소중한 사람에게 전달해보세요.
            </p>
          </div>

          <div className="p-8 flex flex-col items-center">
            <button
              type="button"
              onClick={handleCreateInvite}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Mail className="w-5 h-5" strokeWidth={1.8} />
              {actionLoading ? '준비 중...' : '초대장 보내기'}
            </button>
          </div>
        </div>
      )}

      {/* ── 유효하지 않은 초대코드 ── */}
      {!connection && inviteCode && !isPendingReceiver && (
        <div className="rounded-2xl bg-white border border-border p-10 text-center">
          <p className="text-4xl mb-4">😢</p>
          <h2 className="text-xl font-bold text-text mb-2">유효하지 않은 초대장</h2>
          <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
            이 초대장은 만료됐거나 이미 처리됐어요.
            <br />파트너에게 새로운 초대를 요청해보세요.
          </p>
        </div>
      )}

      {/* ── How it works ── */}
      {!isConnected && !isPendingSender && !isPendingReceiver && (
        <div className="mt-6 rounded-2xl bg-white border border-border p-8 md:p-12">
          <p className="text-xs text-text-muted tracking-[0.25em] uppercase text-center font-medium mb-10">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: '초대장 작성', desc: '초대장을 만들어 파트너에게 카카오톡, 문자 등으로 전달하세요.' },
              { step: '02', title: '수락하기',   desc: '파트너가 초대장을 열고 수락하면 두 사람이 연결됩니다.' },
              { step: '03', title: '함께 준비',  desc: '예산, D-Day, 체크리스트, 일정을 실시간으로 함께 관리할 수 있어요.' },
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
      )}

      {/* ── 연결 해제 확인 모달 ── */}
      {showDisconnect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-2xl bg-white border border-border shadow-xl p-8 w-full max-w-sm mx-4 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
              <Link2Off className="w-6 h-6 text-red-500" strokeWidth={1.8} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">연결을 해제할까요?</h3>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
              연결을 해제하면 파트너와의 데이터 공유가 중단됩니다.
              <br />기존 데이터는 삭제되지 않아요.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDisconnect(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-border text-text-muted text-sm hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {actionLoading ? '처리 중...' : '해제하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
