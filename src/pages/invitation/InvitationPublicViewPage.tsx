import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import type { InvitationDraftForm } from "./components/InvitationFormControls";
import { InvitationCardView } from "./components/InvitationCardView";
import type { InvitationGalleryImage } from "./invitationApi";
import { getCachedInvitationDraft } from "./invitationShareCache";

const EMPTY_FALLBACK: InvitationDraftForm = {
  templateId: "classic-ivory",
  title: "",
  groomName: "",
  brideName: "",
  groomPhoto: "",
  bridePhoto: "",
  groomContact: "",
  brideContact: "",
  groomParents: "",
  brideParents: "",
  groomParentContact: "",
  brideParentContact: "",
  weddingDate: "",
  weddingTime: "",
  venueName: "",
  venueAddress: "",
  venueDetail: "",
  mainGreeting: "",
  invitationMessage: "",
  additionalMessage: "",
  transportGuide: "",
  parkingGuide: "",
  publicTransportGuide: "",
  groomBank: "",
  groomAccount: "",
  groomAccountHolder: "",
  brideBank: "",
  brideAccount: "",
  brideAccountHolder: "",
  bgmUrl: "",
  gallery: [],
  mainColor: "#B76E79",
};

/**
 * "조회 전용" 청첩장 공유 페이지.
 * PageLayout(사이트 헤더/네비게이션) 없이 App.tsx에서 별도 최상위 라우트로 연결된다
 * (예: /share/:token 과 동일한 위치, 로그인 여부와 무관하게 접근 가능해야 함).
 *
 * 데이터 소스 우선순위:
 *   1) 공유 URL에 포함된 제작 데이터 - 다른 사람 기기에서도 로그인 없이 동작
 *   2) 로컬 캐시 - 기존에 생성된 링크와의 호환용 보조 수단
 * 둘 다 없으면 "청첩장을 찾을 수 없어요" 안내를 보여주고, 절대 빈 기본폼을 보여주지 않는다.
 */
export default function InvitationPublicViewPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [draft, setDraft] = useState<InvitationDraftForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const cached = getCachedInvitationDraft(id);
      const encoded = searchParams.get("data");
      let shared: InvitationDraftForm | null = null;

      if (encoded) {
        try {
          const json = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
          shared = JSON.parse(json) as InvitationDraftForm;
        } catch (error) {
          console.warn("[invitation] 공유 링크 데이터 해석 실패:", error);
        }
      }

      if (cancelled) return;

      // URL 데이터 > 현재 브라우저 캐시 순서로 사용한다.
      if (shared) {
        setDraft({
          ...EMPTY_FALLBACK,
          ...shared,
          gallery: shared.gallery ?? ([] as InvitationGalleryImage[]),
        });
      } else if (cached) {
        setDraft(cached);
      } else {
        setNotFound(true);
      }

      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id, searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F0EEED]">
        <Loader2 className="h-6 w-6 animate-spin text-[#B76E79]" />
      </div>
    );
  }

  if (notFound || !draft) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F0EEED] px-6 text-center">
        <AlertCircle className="h-8 w-8 text-[#B76E79]" />
        <p className="text-sm font-semibold text-[#3A3230]">청첩장을 찾을 수 없어요.</p>
        <p className="text-xs text-[#6B615D]">
          링크가 정확한지 확인해주시거나, 작성자에게 다시 공유를 요청해주세요.
        </p>
      </div>
    );
  }

  // 하객이 보는 조회 전용 화면이므로 공유/발행/수정 같은 작성자 전용 액션은 노출하지 않는다.
  return <InvitationCardView draft={draft} />;
}
