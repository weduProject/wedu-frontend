import { useState } from 'react';
import { Copy, Share2, CheckCheck } from 'lucide-react';
import Button from './Button';
import { apiFetch } from '../../lib/apiClient';

interface ShareLinkCardProps {
  pageName: string;
  sharePath: string; // 예: '/shared/checklist'
}

export default function ShareLinkCard({ pageName, sharePath }: ShareLinkCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/share-links/me');
      const body = await res.json();
      
      const token = body.data?.token || body.data?.shareLink || body.data;
      if (!token) throw new Error('토큰을 찾을 수 없습니다.');

      const shareUrl = `${window.location.origin}${sharePath}/${token}`;

      await navigator.clipboard.writeText(shareUrl);
      
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (error) {
      console.error('공유 링크 생성/복사 실패:', error);
      alert('링크 복사에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-5 p-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light/50">
          <Share2 className="h-5 w-5 text-primary" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-base font-bold text-text mb-1">
            {pageName} 공유하기
          </h3>
          <p className="text-sm text-text-muted">
            링크를 받은 사람은 로그인 없이 페이지를 볼 수 있어요
          </p>
        </div>
      </div>
      
      <Button 
        onClick={handleCopy} 
        disabled={isLoading} 
        variant='main'
        className="flex shrink-0 items-center gap-2 min-w-55 justify-center md:w-auto"
      >
        {isCopied ? (
          <>
            <CheckCheck className="h-4 w-4" />
            복사 완료!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            {pageName} 공유 링크 복사
          </>
        )}
      </Button>
    </div>
  );
}