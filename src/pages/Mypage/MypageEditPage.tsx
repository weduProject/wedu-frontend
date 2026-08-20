import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Heart, Link2, Copy, CheckCheck, User, CalendarDays, ChevronRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDDay } from '../../contexts/DDayContext';
import { apiFetch } from '../../lib/apiClient';
import type { ApiEnvelope } from '../../lib/apiClient';
import BaseCard from '../../components/ui/BaseCard';
import Button from '../../components/ui/Button';
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';

function formatWeddingDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export default function MypageEditPage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { dday, createDDay, updateDDay } = useDDay();

  // 닉네임
  const [nicknameInput, setNicknameInput] = useState(user?.name ?? '');
  const [isSavingNickname, setIsSavingNickname] = useState(false);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [nicknameSuccess, setNicknameSuccess] = useState(false);

  // 공유 링크
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [isCopyingLink, setIsCopyingLink] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isReissuingLink, setIsReissuingLink] = useState(false);
  const [showReissueConfirm, setShowReissueConfirm] = useState(false);
  const [showLinkErrorModal, setShowLinkErrorModal] = useState(false);

  // GET /api/share-links/me — 마운트 시 토큰 조회
  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await apiFetch('/api/share-links/me');
        const body: ApiEnvelope<{ token: string }> = await res.json();
        if (res.ok && body.success && body.data?.token) {
          setShareToken(body.data.token);
        }
      } catch {
        // 조회 실패 시 UI만 비활성화
      } finally {
        setIsLoadingToken(false);
      }
    }
    fetchToken();
  }, []);

  // D-day
  const [isEditingDday, setIsEditingDday] = useState(false);
  const [ddayInput, setDdayInput] = useState(dday?.weddingDate ?? '');
  const [isSavingDday, setIsSavingDday] = useState(false);
  const [ddayError, setDdayError] = useState<string | null>(null);

  async function handleSaveNickname() {
    const trimmed = nicknameInput.trim();
    if (!trimmed || trimmed === user?.name) return;
    setIsSavingNickname(true);
    setNicknameError(null);
    try {
      await updateProfile(trimmed, user?.profileImageUrl ?? null);
      setNicknameSuccess(true);
      setTimeout(() => setNicknameSuccess(false), 2000);
    } catch (e) {
      setNicknameError(e instanceof Error ? e.message : '저장에 실패했어요.');
    } finally {
      setIsSavingNickname(false);
    }
  }

  async function handleCopyShareLink() {
    if (!shareToken) return;
    setIsCopyingLink(true);
    try {
      const url = `${window.location.origin}/share/${shareToken}`;
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      setShowLinkErrorModal(true);
    } finally {
      setIsCopyingLink(false);
    }
  }

  // POST /api/share-links/me/reissue — 링크 재발급
  async function handleReissueLink() {
    setIsReissuingLink(true);
    setShowReissueConfirm(false);
    try {
      const res = await apiFetch('/api/share-links/me/reissue', { method: 'POST' });
      const body: ApiEnvelope<{ token: string }> = await res.json();
      if (res.ok && body.success && body.data?.token) {
        setShareToken(body.data.token);
      } else {
        setShowLinkErrorModal(true);
      }
    } catch {
      setShowLinkErrorModal(true);
    } finally {
      setIsReissuingLink(false);
    }
  }

  async function handleSaveDday() {
    if (!ddayInput) return;
    setIsSavingDday(true);
    setDdayError(null);
    try {
      if (dday) {
        await updateDDay(ddayInput);
      } else {
        await createDDay(ddayInput);
      }
      setIsEditingDday(false);
    } catch (e) {
      setDdayError(e instanceof Error ? e.message : '저장에 실패했어요.');
    } finally {
      setIsSavingDday(false);
    }
  }

  return (
    <>
    <div className="mx-auto max-w-[1024px] pb-20">

      {/* 헤더 */}
      <div className="mb-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/mypage')}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 text-text" strokeWidth={1.8} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text">프로필 수정</h1>
          <p className="mt-0.5 text-sm text-text-muted">계정 정보와 연결 설정을 관리해요</p>
        </div>
      </div>

      {/* 2열 그리드 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* 닉네임 변경 */}
        <BaseCard className="flex h-full flex-col p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
              <User className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">닉네임 변경</h2>
              <p className="mt-0.5 text-xs text-text-muted">서비스에서 표시될 이름을 설정해요</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                value={nicknameInput}
                onChange={(e) => { setNicknameInput(e.target.value); setNicknameError(null); setNicknameSuccess(false); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNickname(); }}
                maxLength={20}
                placeholder="닉네임 입력"
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none"
              />
              <Button
                onClick={handleSaveNickname}
                disabled={isSavingNickname || !nicknameInput.trim() || nicknameInput.trim() === user?.name}
                className="whitespace-nowrap"
              >
                {isSavingNickname ? '저장 중...' : '저장'}
              </Button>
            </div>
            {nicknameError && <p className="text-xs text-red-500">{nicknameError}</p>}
            {nicknameSuccess && <p className="text-xs text-primary flex items-center gap-1"><Check className="h-3 w-3" strokeWidth={2.5} /> 닉네임이 변경됐어요.</p>}
          </div>
        </BaseCard>

        {/* 결혼식 D-day */}
        <BaseCard className="flex h-full flex-col p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <CalendarDays className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">결혼식 D-day</h2>
              <p className="mt-0.5 text-xs text-text-muted">결혼식 날짜를 등록하고 카운트다운을 확인해요</p>
            </div>
          </div>

          {isEditingDday ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="date"
                  autoFocus
                  value={ddayInput}
                  onChange={(e) => { setDdayInput(e.target.value); setDdayError(null); }}
                  className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveDday}
                  disabled={isSavingDday || !ddayInput}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => { setIsEditingDday(false); setDdayError(null); }}
                  disabled={isSavingDday}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-text-muted hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
              {ddayError && <p className="text-xs text-red-500">{ddayError}</p>}
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-border bg-[#FAFAFA] px-5 py-4">
              <div>
                {dday ? (
                  <>
                    <p className="text-sm font-semibold text-text">{formatWeddingDate(dday.weddingDate)}</p>
                    <p className="mt-0.5 text-xs font-bold text-primary">D-{dday.daysRemaining}</p>
                  </>
                ) : (
                  <p className="text-sm text-text-muted">아직 날짜가 등록되지 않았어요.</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => { setDdayInput(dday?.weddingDate ?? ''); setIsEditingDday(true); }}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-white transition-colors cursor-pointer"
              >
                {dday ? '수정' : '등록'}
              </button>
            </div>
          )}
        </BaseCard>

        {/* 파트너 연결 */}
        <BaseCard className="flex h-full flex-col p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Heart className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">파트너 연결</h2>
              <p className="mt-0.5 text-xs text-text-muted">예비 신랑신부가 함께 웨딩을 준비해요</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/connect')}
            className="flex w-full items-center gap-4 rounded-xl border border-border bg-[#FAFAFA] px-5 py-4 transition-colors hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-text">파트너 연결 관리</p>
              <p className="mt-0.5 text-xs text-text-muted">초대장 보내기 · 연결 현황 확인</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.8} />
          </button>
        </BaseCard>

        {/* 공유 링크 */}
        <BaseCard className="flex h-full flex-col p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <Link2 className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">공유 링크</h2>
              <p className="mt-0.5 text-xs text-text-muted">링크를 받은 사람은 로그인 없이 웨딩 플랜을 볼 수 있어요</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {/* URL 미리보기 */}
            <div className="rounded-xl border border-border bg-gray-50 px-3 py-2.5 text-sm text-text-muted truncate">
              {isLoadingToken
                ? '링크 불러오는 중...'
                : shareToken
                  ? `${window.location.origin}/share/${shareToken}`
                  : '링크를 불러올 수 없어요.'
              }
            </div>
            {/* 복사 버튼 */}
            <Button
              onClick={handleCopyShareLink}
              disabled={isLoadingToken || isCopyingLink || !shareToken}
              className="flex w-full items-center justify-center gap-2"
            >
              {linkCopied
                ? <><CheckCheck className="h-4 w-4" strokeWidth={2} /> 복사됐어요!</>
                : <><Copy className="h-4 w-4" strokeWidth={1.8} /> 공유 링크 복사</>
              }
            </Button>
            {/* 재발급 버튼 */}
            <Button
              variant="secondary"
              onClick={() => setShowReissueConfirm(true)}
              disabled={isLoadingToken || isReissuingLink}
              className="flex w-full items-center justify-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isReissuingLink ? 'animate-spin' : ''}`} strokeWidth={1.8} />
              {isReissuingLink ? '재발급 중...' : '링크 재발급'}
            </Button>
          </div>
        </BaseCard>

      </div>
    </div>

    <ConfirmDeleteModal
      isOpen={showReissueConfirm}
      onClose={() => setShowReissueConfirm(false)}
      onConfirm={handleReissueLink}
      title="링크를 재발급할까요?"
      message="기존 링크는 더 이상 사용할 수 없게 됩니다."
      confirmLabel="재발급"
      danger={false}
    />
    <ConfirmDeleteModal
      isOpen={showLinkErrorModal}
      onClose={() => setShowLinkErrorModal(false)}
      onConfirm={() => setShowLinkErrorModal(false)}
      title="링크 재발급에 실패했습니다"
      message="잠시 후 다시 시도해주세요."
      confirmLabel="확인"
      danger={false}
    />
    </>
  );
}
