import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Share2, Mail, Loader2, Send } from "lucide-react";
import { Button } from "../../components";
import type { InvitationDraftForm } from "./components/InvitationFormControls";
import { fetchMyInvitation, fetchInvitationGallery, publishInvitation } from "./invitationApi";
import { colorOptions } from "./InvitationCreatePage";
import { InvitationCardView } from "./components/InvitationCardView";
import { cacheInvitationDraft } from "./invitationShareCache";

// state 없이(새로고침 등) 이 페이지에 접근했을 때 보여줄 기본값
const FALLBACK_DRAFT: InvitationDraftForm = {
  templateId: "classic-ivory",
  title: "",
  groomName: "신랑",
  brideName: "신부",
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
  accentColor: "#B76E79",
  backgroundGradient: undefined,
};

export default function InvitationDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPublishing, setIsPublishing] = useState(false);

  // 작성 페이지가 "미리보기" 클릭 시 navigate state로 넘긴 폼 데이터를 그대로 사용.
  const passedForm = (location.state as { form?: InvitationDraftForm } | null)?.form;
  const [draft, setDraft] = useState<InvitationDraftForm>(passedForm ?? FALLBACK_DRAFT);
  const [isLoading, setIsLoading] = useState(!passedForm);
  const isPreview = passedForm !== undefined;

  // state 없이(주소 직접 접근, 새로고침 등) 들어온 경우엔 서버에서 내 청첩장을 직접 불러온다.
  useEffect(() => {
    if (passedForm) return;

    let cancelled = false;

    (async () => {
      try {
        const [invitation, gallery] = await Promise.all([
          fetchMyInvitation(),
          fetchInvitationGallery(),
        ]);

        if (cancelled) return;

        if (invitation) {
          const matchedColor = colorOptions.find((c) => c.background === invitation.mainColor);
          setDraft({
            ...FALLBACK_DRAFT,
            id: invitation.id,
            status: invitation.status,
            templateId: invitation.templateId,
            title: invitation.title ?? "",
            groomName: invitation.groomName ?? "신랑",
            brideName: invitation.brideName ?? "신부",
            groomPhoto: invitation.groomPhoto ?? "",
            bridePhoto: invitation.bridePhoto ?? "",
            groomContact: invitation.groomContact ?? "",
            brideContact: invitation.brideContact ?? "",
            groomParents: invitation.groomParents ?? "",
            brideParents: invitation.brideParents ?? "",
            groomParentContact: invitation.groomParentContact ?? "",
            brideParentContact: invitation.brideParentContact ?? "",
            weddingDate: invitation.weddingDate ?? "",
            weddingTime: invitation.weddingTime ?? "",
            venueName: invitation.venueName ?? "",
            venueAddress: invitation.venueAddress ?? "",
            venueDetail: invitation.venueDetail ?? "",
            mainGreeting: invitation.mainGreeting ?? "",
            invitationMessage: invitation.invitationMessage ?? "",
            additionalMessage: invitation.additionalMessage ?? "",
            transportGuide: invitation.transportGuide ?? "",
            parkingGuide: invitation.parkingGuide ?? "",
            publicTransportGuide: invitation.publicTransportGuide ?? "",
            groomBank: invitation.groomBank ?? "",
            groomAccount: invitation.groomAccount ?? "",
            groomAccountHolder: invitation.groomAccountHolder ?? "",
            brideBank: invitation.brideBank ?? "",
            brideAccount: invitation.brideAccount ?? "",
            brideAccountHolder: invitation.brideAccountHolder ?? "",
            mainColor: invitation.mainColor ?? "#B76E79",
            accentColor: matchedColor?.accent ?? invitation.mainColor ?? "#B76E79",
            backgroundGradient: matchedColor?.gradient,
            bgmUrl: invitation.bgmUrl ?? "",
            gallery,
          });
        }
      } catch (error) {
        console.warn("[invitation] 청첩장 조회 실패:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 실제로 만든 내용을 조회 전용 공유 페이지(/invitation/view/:id)에서도 그대로 보여줄 수 있도록
  // id가 확정되는 시점마다 로컬에 캐시해둔다. (백엔드에 "id로 공개 조회" API가 아직 불안정할 수 있어
  // 최소한 같은 브라우저에서는 공유 링크가 항상 실제 작성 내용을 보여주도록 하는 안전장치)
  useEffect(() => {
    if (draft.id) {
      cacheInvitationDraft(draft.id, draft);
    }
  }, [draft]);

  const handleShare = useCallback(() => {
    if (!draft.id) {
      alert("먼저 '미리보기'로 청첩장을 저장한 뒤 공유할 수 있어요.");
      return;
    }

    // 공개 조회 API가 Swagger에 없으므로, 제작한 데이터를 링크에 직접 포함한다.
    // 다른 브라우저/휴대폰에서도 로그인 없이 제작 내용을 복원할 수 있다.
    const encoded = encodeURIComponent(
      btoa(unescape(encodeURIComponent(JSON.stringify(draft)))),
    );
    const url = `${window.location.origin}/invitation/view/${draft.id}?data=${encoded}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("청첩장 링크가 복사되었습니다.");
      })
      .catch(() => {
        alert(`링크 복사에 실패했습니다. 아래 주소를 직접 복사해주세요.\n${url}`);
      });
  }, [draft.id]);

  const handlePublish = useCallback(async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
      const published = await publishInvitation();
      setDraft((prev) => ({ ...prev, status: published.status ?? "PUBLISHED" }));
      alert("청첩장이 발행되었습니다.");
    } catch (error) {
      console.error("[invitation] 발행 실패:", error);
      alert("청첩장 발행에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsPublishing(false);
    }
  }, [isPublishing]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const canPublish = isPreview && draft.id !== undefined && draft.status !== "PUBLISHED";

  return (
    <div className="-mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
      {!isPreview && !isLoading && (
        <div className="fixed left-6 top-24 z-40 flex items-center gap-2 md:top-28">
          <button
            type="button"
            onClick={() => navigate("/invitation")}
            className="flex items-center gap-1.5 rounded-full border border-border bg-white/90 px-4 py-2 text-xs font-medium text-text-muted shadow-md backdrop-blur transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            돌아가기
          </button>
        </div>
      )}

      <InvitationCardView
        draft={draft}
        footerActions={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={handleShare}
              className="inline-flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              공유하기
            </Button>

            {canPublish && (
              <Button
                variant="main"
                size="md"
                onClick={handlePublish}
                disabled={isPublishing}
                className="inline-flex items-center gap-2"
              >
                {isPublishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                발행하기
              </Button>
            )}

            {draft.status === "PUBLISHED" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-4 py-2 text-xs font-semibold text-primary">
                발행 완료
              </span>
            )}

            <Button
              variant={canPublish ? "secondary" : "main"}
              size="md"
              onClick={() => navigate("/invitation/create")}
              className="inline-flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              청첩장 수정하기
            </Button>
          </div>
        }
      />
    </div>
  );
}
