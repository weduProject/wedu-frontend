import type { InvitationDraftForm } from "./components/InvitationFormControls";

const STORAGE_PREFIX = "wedu:invitation:";

/**
 * 작성자가 저장/미리보기한 청첩장 내용을 브라우저에 캐시해둔다.
 *
 * 왜 필요한가: "/invitation/view/:id" 공유 링크를 열었을 때, id로 공개 조회하는
 * 백엔드 API(fetchInvitationById)가 아직 없거나 불안정할 수 있다. 이 경우에도
 * 최소한 작성자 본인 브라우저에서는 방금 만든 내용 그대로가 보여야
 * "링크 복사시 기본폼으로 뜸" 문제가 재발하지 않는다.
 * 백엔드의 공개 조회 API가 정상 동작하면 그 응답이 우선 사용되고, 이 캐시는
 * 실패했을 때의 보조 수단으로만 쓰인다.
 */
export function cacheInvitationDraft(id: number | string, draft: InvitationDraftForm): void {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(draft));
  } catch (error) {
    // 시크릿 모드 등으로 localStorage를 못 쓰는 환경이면 조용히 무시 (캐시는 보조 수단일 뿐)
    console.warn("[invitation] 공유용 캐시 저장 실패:", error);
  }
}

export function getCachedInvitationDraft(id: number | string): InvitationDraftForm | null {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    return raw ? (JSON.parse(raw) as InvitationDraftForm) : null;
  } catch (error) {
    console.warn("[invitation] 공유용 캐시 조회 실패:", error);
    return null;
  }
}
