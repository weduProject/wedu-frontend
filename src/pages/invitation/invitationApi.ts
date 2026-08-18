/**
 * ⚠️ 스키마 관련 참고
 * -------------------------------------------------------------------------
 * builderApi.ts와 동일하게, 이 파일도 Swagger UI의 엔드포인트 목록(경로+설명)만 가지고
 * 작성되었습니다. InvitationDraft 의 필드명은 화면(피그마 스크린샷)에 나온 입력 항목을
 * 기준으로 합리적으로 추론한 것이며, 실제 백엔드 DTO와 필드명이 다를 수 있습니다.
 * 다른 곳은 손댈 필요 없이 이 파일의 InvitationDraft 타입과 아래 함수들만 실제 스펙에
 * 맞게 고치면 됩니다.
 * -------------------------------------------------------------------------
 */

import { apiRequest } from "../../lib/apiClient";

export interface InvitationAccount {
  bank: string;
  accountHolder: string;
  accountNumber: string;
  kakaoPayUrl?: string;
}

export interface InvitationDraft {
  id?: number;
  status?: "DRAFT" | "PUBLISHED";
  templateId: string;
  mainColor: string;

  // 기본 정보
  title: string;
  groomName: string;
  groomPhone: string;
  brideName: string;
  bridePhone: string;

  // 혼주 정보
  groomFatherName?: string;
  groomMotherName?: string;
  brideFatherName?: string;
  brideMotherName?: string;

  // 예식 정보
  weddingDate?: string; // YYYY-MM-DD
  weddingTime?: string; // HH:mm
  venueName?: string;
  venueHall?: string; // 예: "3층 그랜드볼룸"
  greetingMessage?: string;

  // 오시는 길
  address?: string;
  addressDetail?: string;
  latitude?: number;
  longitude?: number;
  naverMapUrl?: string;

  // 계좌 정보
  groomAccounts: InvitationAccount[];
  brideAccounts: InvitationAccount[];

  // 공개 청첩장 URL (발행 후 서버가 내려줌)
  publicUrl?: string;
}

export const EMPTY_INVITATION_DRAFT: InvitationDraft = {
  templateId: "classic-ivory",
  mainColor: "#C9A96E",
  title: "",
  groomName: "",
  groomPhone: "",
  brideName: "",
  bridePhone: "",
  groomAccounts: [],
  brideAccounts: [],
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
    const data = await apiRequest<InvitationDraft>(
      "/api/invitations/me",
      { method: "GET" },
      "청첩장 조회에 실패했습니다.",
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
  return apiRequest<InvitationDraft>(
    "/api/invitations",
    {
      method: "POST",
      body: JSON.stringify(draft),
    },
    "청첩장 생성에 실패했습니다.",
  );
}

/**
 * 청첩장 수정 (임시 저장 포함)
 * PATCH /api/invitations/me
 */
export async function updateInvitation(
  draft: Partial<InvitationDraft>,
): Promise<InvitationDraft> {
  return apiRequest<InvitationDraft>(
    "/api/invitations/me",
    {
      method: "PATCH",
      body: JSON.stringify(draft),
    },
    "청첩장 저장에 실패했습니다.",
  );
}

/**
 * 생성 또는 수정을 한 번에 처리하는 헬퍼.
 * id가 없으면 생성, 있으면 수정 요청을 보낸다.
 */
export async function saveInvitation(draft: InvitationDraft): Promise<InvitationDraft> {
  if (draft.id) {
    return updateInvitation(draft);
  }
  return createInvitation(draft);
}

/**
 * 청첩장 발행
 * PATCH /api/invitations/me/publish
 */
export async function publishInvitation(): Promise<InvitationDraft> {
  return apiRequest<InvitationDraft>(
    "/api/invitations/me/publish",
    { method: "PATCH" },
    "청첩장 발행에 실패했습니다.",
  );
}

/**
 * 청첩장 갤러리 조회
 * GET /api/invitations/me/gallery
 */
export async function fetchInvitationGallery(): Promise<InvitationGalleryImage[]> {
  const data = await apiRequest<InvitationGalleryImage[]>(
    "/api/invitations/me/gallery",
    { method: "GET" },
    "갤러리 조회에 실패했습니다.",
  );
  return data ?? [];
}

/**
 * 청첩장 갤러리 이미지 추가
 * POST /api/invitations/me/gallery
 */
export async function addInvitationGalleryImage(
  imageUrl: string,
): Promise<InvitationGalleryImage> {
  return apiRequest<InvitationGalleryImage>(
    "/api/invitations/me/gallery",
    {
      method: "POST",
      body: JSON.stringify({ imageUrl }),
    },
    "갤러리 이미지 추가에 실패했습니다.",
  );
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
