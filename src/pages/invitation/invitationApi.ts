/**
 * ✅ 스키마 확정본 (2026-08-17 스웨거 확인 기준)
 * -------------------------------------------------------------------------
 * 아래 InvitationDraft 필드명/구조는 실제 백엔드 DTO 기준으로 확정된 내용입니다.
 * - 응답은 전부 { success, data, error } 형태로 감싸져서 내려옵니다. (GET/PATCH /me도
 *   동일하다고 보고 unwrap 처리했습니다. 실제 응답이 다르면 unwrap()만 고치면 됩니다.)
 * - 계좌 정보는 배열이 아니라 신랑측/신부측 각각 은행 1개만 지원합니다.
 * - 갤러리는 별도 리소스(/me/gallery)로 분리되어 있고, 삭제 엔드포인트는 아직 없습니다.
 * -------------------------------------------------------------------------
 */

import { apiRequest } from "../../lib/apiClient";

/** 백엔드 공통 응답 래퍼 */
interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
}

async function unwrap<T>(promise: Promise<ApiEnvelope<T> | T>): Promise<T> {
  const res = await promise;
  if (res && typeof res === "object" && "success" in res) {
    const envelope = res as ApiEnvelope<T>;
    if (!envelope.success) {
      throw new Error(envelope.error?.message ?? "요청 처리에 실패했습니다.");
    }
    return envelope.data;
  }
  return res as T;
}

export interface InvitationDraft {
  id?: number;
  userId?: number;
  templateId: string;
  title: string;
  status?: "DRAFT" | "PUBLISHED";

  // 신랑/신부 기본 정보
  groomName: string;
  brideName: string;
  groomPhoto?: string;
  bridePhoto?: string;
  groomContact?: string;
  brideContact?: string;

  // 혼주 정보 (양가 각각 한 줄 문자열)
  groomParents?: string;
  brideParents?: string;
  groomParentContact?: string;
  brideParentContact?: string;

  // 예식 정보
  weddingDate?: string; // YYYY-MM-DD
  weddingTime?: string; // HH:mm
  venueName?: string;
  venueAddress?: string;
  venueDetail?: string;
  latitude?: number;
  longitude?: number;

  // 인사말 / 안내 문구
  mainGreeting?: string;
  invitationMessage?: string;
  additionalMessage?: string;

  // 오시는 길 안내
  transportGuide?: string;
  parkingGuide?: string;
  publicTransportGuide?: string;

  // 계좌 정보 (신랑/신부 각 1개)
  groomBank?: string;
  groomAccount?: string;
  groomAccountHolder?: string;
  brideBank?: string;
  brideAccount?: string;
  brideAccountHolder?: string;

  // 디자인
  mainColor?: string;
  fontFamily?: string;
  bgmUrl?: string;
  designSettings?: string;

  // 발행 후 서버가 내려주는 공개 URL (스웨거엔 명시 안 됐지만 status가 PUBLISHED면 내려올 가능성)
  publicUrl?: string;
}

export const EMPTY_INVITATION_DRAFT: InvitationDraft = {
  templateId: "classic-ivory",
  title: "",
  groomName: "",
  brideName: "",
  groomContact: "",
  brideContact: "",
  groomParents: "",
  brideParents: "",
  groomParentContact: "",
  brideParentContact: "",
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
  mainColor: "#C9A96E",
};

export interface InvitationGalleryImage {
  id?: number;
  imageUrl: string;
  sortOrder?: number;
}

/**
 * 내 청첩장 조회 (없으면 null)
 * GET /api/invitations/me
 */
export async function fetchMyInvitation(): Promise<InvitationDraft | null> {
  try {
    const data = await unwrap(
      apiRequest<ApiEnvelope<InvitationDraft>>(
        "/api/invitations/me",
        { method: "GET" },
        "청첩장 조회에 실패했습니다.",
      ),
    );
    return data ?? null;
  } catch (error) {
    // 아직 만든 청첩장이 없는 경우 백엔드가 404를 내려줄 수 있음 -> 새로 시작하는 것으로 처리
    console.warn("[invitation] 내 청첩장 조회 실패(신규 작성으로 진행):", error);
    return null;
  }
}

/**
 * 청첩장 생성 (최초 1회)
 * POST /api/invitations
 */
export async function createInvitation(draft: InvitationDraft): Promise<InvitationDraft> {
  return unwrap(
    apiRequest<ApiEnvelope<InvitationDraft>>(
      "/api/invitations",
      {
        method: "POST",
        body: JSON.stringify(draft),
      },
      "청첩장 생성에 실패했습니다.",
    ),
  );
}

/**
 * 청첩장 수정 (임시 저장 포함)
 * PATCH /api/invitations/me
 */
export async function updateInvitation(
  draft: Partial<InvitationDraft>,
): Promise<InvitationDraft> {
  return unwrap(
    apiRequest<ApiEnvelope<InvitationDraft>>(
      "/api/invitations/me",
      {
        method: "PATCH",
        body: JSON.stringify(draft),
      },
      "청첩장 저장에 실패했습니다.",
    ),
  );
}

/**
 * 생성 또는 수정을 한 번에 처리하는 헬퍼.
 * id가 없으면 생성, 있으면 수정 요청을 보낸다.
 *
 * ⚠️ 방어 로직: id 없이 생성을 시도했는데 "이미 생성된 청첩장이 있습니다" 같은 충돌
 * 에러가 나면(중복 클릭, 이전 세션에서 이미 생성된 경우 등) 서버에 있는 기존 청첩장을
 * 다시 조회해서 update로 폴백한다.
 */
export async function saveInvitation(draft: InvitationDraft): Promise<InvitationDraft> {
  if (draft.id) {
    return updateInvitation(draft);
  }

  try {
    return await createInvitation(draft);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("이미 생성된 청첩장")) {
      const existing = await fetchMyInvitation();
      if (existing?.id) {
        return updateInvitation({ ...draft, id: existing.id });
      }
    }
    throw error;
  }
}

/**
 * 청첩장 발행
 * PATCH /api/invitations/me/publish
 */
export async function publishInvitation(): Promise<InvitationDraft> {
  return unwrap(
    apiRequest<ApiEnvelope<InvitationDraft>>(
      "/api/invitations/me/publish",
      { method: "PATCH" },
      "청첩장 발행에 실패했습니다.",
    ),
  );
}

/**
 * 청첩장 갤러리 조회
 * GET /api/invitations/me/gallery
 */
export async function fetchInvitationGallery(): Promise<InvitationGalleryImage[]> {
  try {
    const data = await unwrap(
      apiRequest<ApiEnvelope<InvitationGalleryImage[]>>(
        "/api/invitations/me/gallery",
        { method: "GET" },
        "갤러리 조회에 실패했습니다.",
      ),
    );
    return data ?? [];
  } catch (error) {
    // 아직 청첩장 자체가 없으면 갤러리도 없는 게 정상 -> 빈 배열로 처리
    console.warn("[invitation] 갤러리 조회 실패(신규 작성으로 진행):", error);
    return [];
  }
}

/**
 * 청첩장 갤러리 이미지 추가
 * POST /api/invitations/me/gallery
 */
export async function addInvitationGalleryImage(
  imageUrl: string,
  sortOrder?: number,
): Promise<InvitationGalleryImage> {
  return unwrap(
    apiRequest<ApiEnvelope<InvitationGalleryImage>>(
      "/api/invitations/me/gallery",
      {
        method: "POST",
        body: JSON.stringify({ imageUrl, sortOrder }),
      },
      "갤러리 이미지 추가에 실패했습니다.",
    ),
  );
}

/**
 * 새로 추가된(아직 id가 없는) 갤러리 이미지들만 서버에 반영한다.
 * 이미 저장된 이미지(id 있음)는 다시 보내지 않는다. (삭제 API가 없어 삭제는 지원하지 않음)
 */
export async function syncInvitationGallery(
  images: InvitationGalleryImage[],
): Promise<InvitationGalleryImage[]> {
  const pending = images.filter((img) => !img.id && img.imageUrl.trim().length > 0);
  const created = await Promise.all(
    pending.map((img) => addInvitationGalleryImage(img.imageUrl, img.sortOrder)),
  );

  const alreadySaved = images.filter((img) => img.id);
  return [...alreadySaved, ...created];
}

/**
 * 플래너 조회 전용 공유 링크 발급/조회
 * GET /api/share-links/me
 */
export async function fetchMyShareLink(): Promise<string | null> {
  try {
    const data = await apiRequest<{ url?: string; token?: string }>(
      "/api/share-links/me",
      { method: "GET" },
      "공유 링크 조회에 실패했습니다.",
    );
    return data?.url ?? (data?.token ? `${window.location.origin}/shared/${data.token}` : null);
  } catch (error) {
    console.warn("[invitation] 공유 링크 조회 실패:", error);
    return null;
  }
}