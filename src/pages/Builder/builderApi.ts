/**
 * ⚠️ 스키마 관련 참고
 * -------------------------------------------------------------------------
 * 이 파일은 Swagger UI의 "엔드포인트 목록"(경로 + 설명)만 전달받은 상태에서 작성되었습니다.
 * 요청/응답 바디의 정확한 필드명은 실제 백엔드 스키마(swagger.json)를 확인하지 못해
 * 합리적으로 추론한 값입니다.
 *
 * 만약 실제 응답 필드명이 다르다면 아래 3곳만 고치면 됩니다.
 *   1) ProposalMeResponse / RecommendedProductDto 타입 정의
 *   2) normalizeProposal() / normalizeProduct() 매핑 함수
 *   3) PROPOSAL_CATEGORY 매핑 상수
 * 나머지 코드(BuilderContext, BuilderPage, BuilderCartPage)는 이 파일이 export 하는
 * 정규화된 타입만 사용하므로 영향을 받지 않습니다.
 * -------------------------------------------------------------------------
 */

import { apiRequest } from "../../lib/apiClient";
import type { BuilderState } from "./BuilderContext";
import { categoryToIconKey } from "./builderIcons";

/** BuilderContext의 선택 슬롯 → 서버 category 파라미터 매핑 */
export const PROPOSAL_CATEGORY = {
  weddingHall: "PLACE",
  seudeume: "MOOD",
  honeymoon: "FOOD",
  budget: "BUDGET",
} as const;

export type ProposalCategory =
  (typeof PROPOSAL_CATEGORY)[keyof typeof PROPOSAL_CATEGORY];

/** 프론트에서 통일해서 쓰는 추천 상품 타입 (이모지 없음, iconKey는 lucide 매핑용) */
export interface RecommendedProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  iconKey: string;
  imageUrl?: string;
}

export interface ProposalSummary {
  selections: Partial<Record<ProposalCategory, { optionId: number; name?: string }>>;
  estimatedMinPrice: number;
  estimatedMaxPrice: number;
  recommendedProducts: RecommendedProduct[];
}

/** 서버 원본 응답 형태 (추정) */
interface ProposalMeResponseRaw {
  selections?: Array<{ category: string; optionId: number; name?: string }>;
  estimatedMinPrice?: number;
  estimatedMaxPrice?: number;
  recommendedProducts?: RecommendedProductRaw[];
}

interface RecommendedProductRaw {
  id?: number;
  productId?: number;
  name?: string;
  title?: string;
  price?: number;
  categoryType?: string;
  category?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
}

function normalizeProduct(raw: RecommendedProductRaw): RecommendedProduct {
  const category = raw.categoryType ?? raw.category ?? "기타";
  return {
    id: raw.id ?? raw.productId ?? 0,
    title: raw.title ?? raw.name ?? "추천 상품",
    category,
    price: raw.price ?? 0,
    iconKey: categoryToIconKey(category),
    imageUrl: raw.imageUrl ?? raw.thumbnailUrl,
  };
}

function normalizeProposal(raw: ProposalMeResponseRaw | null | undefined): ProposalSummary {
  const selections: ProposalSummary["selections"] = {};

  (raw?.selections ?? []).forEach((s) => {
    selections[s.category as ProposalCategory] = {
      optionId: s.optionId,
      name: s.name,
    };
  });

  return {
    selections,
    estimatedMinPrice: raw?.estimatedMinPrice ?? 0,
    estimatedMaxPrice: raw?.estimatedMaxPrice ?? 0,
    recommendedProducts: (raw?.recommendedProducts ?? []).map(normalizeProduct),
  };
}

/**
 * 프로포즈 옵션 선택/변경
 * POST /api/proposals/options
 */
export async function selectProposalOption(
  category: ProposalCategory,
  optionId: number,
): Promise<void> {
  await apiRequest<void>(
    "/api/proposals/options",
    {
      method: "POST",
      body: JSON.stringify({ category, optionId }),
    },
    "프로포즈 옵션 선택에 실패했습니다.",
  );
}

/**
 * 프로포즈 옵션 선택 취소
 * DELETE /api/proposals/options/{category}
 */
export async function cancelProposalOption(category: ProposalCategory): Promise<void> {
  await apiRequest<void>(
    `/api/proposals/options/${category}`,
    { method: "DELETE" },
    "프로포즈 옵션 취소에 실패했습니다.",
  );
}

/**
 * 내 프로포즈 선택 현황/견적(+ 맞춤 추천 상품) 조회
 * GET /api/proposals/me
 */
export async function fetchMyProposal(): Promise<ProposalSummary> {
  const raw = await apiRequest<ProposalMeResponseRaw>(
    "/api/proposals/me",
    { method: "GET" },
    "프로포즈 현황 조회에 실패했습니다.",
  );
  return normalizeProposal(raw);
}

/**
 * 심리테스트 기반 맞춤 상품 추천
 * GET /api/recommendations
 *
 * 빌더에서 선택한 장소/분위기/음식의 태그를 genres 로, 예산 구간을 minPrice/maxPrice 로 넘겨서
 * "선택한 장르 + 원하는 가격대" 기준 추천을 받는다. 서버가 이 쿼리 파라미터를 쓰지 않고
 * 로그인 유저의 심리테스트 결과만으로 추천한다면 파라미터는 무시되고 정상 동작한다.
 */
export async function fetchRecommendations(params: {
  genres?: string[];
  minPrice?: number;
  maxPrice?: number;
}): Promise<RecommendedProduct[]> {
  const query = new URLSearchParams();

  if (params.genres && params.genres.length > 0) {
    query.set("genres", params.genres.join(","));
  }
  if (typeof params.minPrice === "number") {
    query.set("minPrice", String(params.minPrice));
  }
  if (typeof params.maxPrice === "number" && Number.isFinite(params.maxPrice)) {
    query.set("maxPrice", String(params.maxPrice));
  }

  const qs = query.toString();
  const raw = await apiRequest<RecommendedProductRaw[]>(
    `/api/recommendations${qs ? `?${qs}` : ""}`,
    { method: "GET" },
    "추천 상품을 불러오지 못했습니다.",
  );

  return (raw ?? []).map(normalizeProduct);
}

/**
 * builder 선택 상태(BuilderState)로부터 추천에 쓸 장르 태그와 예산 범위를 뽑아낸다.
 */
export function buildRecommendationParams(builder: BuilderState) {
  const genres = [
    builder.weddingHall?.name,
    ...(builder.weddingHall?.tags ?? []),
    builder.seudeume?.name,
    ...(builder.seudeume?.tags ?? []),
    builder.honeymoon?.name,
    ...(builder.honeymoon?.tags ?? []),
  ].filter((v): v is string => Boolean(v));

  const budgetId = builder.budget?.id;
  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  if (budgetId === 1) {
    maxPrice = 1_000_000;
  } else if (budgetId === 2) {
    minPrice = 1_000_000;
    maxPrice = 2_000_000;
  } else if (budgetId === 3) {
    minPrice = 2_000_000;
    maxPrice = 3_000_000;
  } else if (budgetId === 4) {
    minPrice = 3_000_000;
    maxPrice = 5_000_000;
  } else if (budgetId === 5) {
    minPrice = 5_000_000;
  }

  return { genres, minPrice, maxPrice };
}

/**
 * 추천 상품을 찜하기 / 찜 취소 (실제 스펙에 별도 "장바구니" API가 없어
 * 문서화된 Wishlist API를 담아두기 용도로 사용한다)
 * POST/DELETE /api/wishlists/items/{productId}
 */
export async function addToWishlist(productId: number): Promise<void> {
  await apiRequest<void>(
    `/api/wishlists/items/${productId}`,
    { method: "POST" },
    "찜하기에 실패했습니다.",
  );
}

export async function removeFromWishlist(productId: number): Promise<void> {
  await apiRequest<void>(
    `/api/wishlists/items/${productId}`,
    { method: "DELETE" },
    "찜 취소에 실패했습니다.",
  );
}

interface WishlistItemRaw {
  productId?: number;
  id?: number;
}

/**
 * 내 찜 목록 조회 (상품 id 집합만 뽑아서 반환)
 * GET /api/wishlists/me
 */
export async function fetchWishlistProductIds(): Promise<Set<number>> {
  const raw = await apiRequest<WishlistItemRaw[]>(
    "/api/wishlists/me",
    { method: "GET" },
    "찜 목록 조회에 실패했습니다.",
  );

  return new Set((raw ?? []).map((item) => item.productId ?? item.id ?? 0));
}
