import { useState, useEffect } from 'react';
import { Copy, Share2, CheckCheck, RefreshCw } from 'lucide-react';
import Button from './Button';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { apiFetch } from '../../lib/apiClient';

interface ShareLinkCardProps {
  pageName: string;
  sharePath: string;
}

function extractToken(data: unknown): string | null {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (typeof d.token === 'string') return d.token;
    if (typeof d.shareLink === 'string') return d.shareLink;
  }
  return null;
}

export default function ShareLinkCard({ pageName, sharePath }: ShareLinkCardProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isReissuing, setIsReissuing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const shareUrl = token ? `${window.location.origin}${sharePath}/${token}` : null;

  // GET /api/share-links/me — 마운트 시 토큰 조회
  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await apiFetch('/api/share-links/me');
        const body = await res.json();
        const t = extractToken(body.data);
        if (t) setToken(t);
      } catch {
        // 조회 실패 시 UI만 비활성화
      } finally {
        setIsFetching(false);
      }
    }
    fetchToken();
  }, []);

  async function handleCopy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  }

  // POST /api/share-links/me/reissue — 링크 재발급
  async function handleReissue() {
    setIsReissuing(true);
    setShowConfirm(false);
    try {
      const res = await apiFetch('/api/share-links/me/reissue', { method: 'POST' });
      const body = await res.json();
      const t = extractToken(body.data);
      if (t) setToken(t);
    } catch {
      alert('링크 재발급에 실패했습니다.');
    } finally {
      setIsReissuing(false);
    }
  }

  return (
    <>
      <div className="mt-5 p-1 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light/50">
            <Share2 className="h-5 w-5 text-primary" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text mb-1">{pageName} 공유하기</h3>
            <p className="text-sm text-text-muted">링크를 받은 사람은 로그인 없이 페이지를 볼 수 있어요</p>
          </div>
        </div>

        {/* URL 표시 + 복사 버튼 */}
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0 rounded-xl border border-border bg-gray-50 px-3 py-2.5 text-sm text-text-muted truncate">
            {isFetching ? '링크 불러오는 중...' : (shareUrl ?? '링크를 불러올 수 없어요.')}
          </div>
          <Button
            onClick={handleCopy}
            disabled={isFetching || !shareUrl}
            variant="main"
            className="shrink-0 flex items-center gap-2"
          >
            {isCopied
              ? <><CheckCheck className="h-4 w-4" />복사됨</>
              : <><Copy className="h-4 w-4" />복사</>
            }
          </Button>
        </div>

        {/* 재발급 버튼 */}
        <div className="flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowConfirm(true)}
            disabled={isFetching || isReissuing}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isReissuing ? 'animate-spin' : ''}`} strokeWidth={2} />
            {isReissuing ? '재발급 중...' : '링크 재발급'}
          </Button>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleReissue}
        title="링크를 재발급할까요?"
        message="기존 링크는 더 이상 사용할 수 없게 됩니다."
        confirmLabel="재발급"
        danger={false}
      />
    </>
  );
}
