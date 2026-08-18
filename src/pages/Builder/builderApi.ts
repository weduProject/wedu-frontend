/**
 * ⚠️ 2026-08-17 데모데이 점검 결과 반영
 * -------------------------------------------------------------------------
 * 스웨거를 확인한 결과 "옵션 선택 저장(POST /api/proposals/options)"과
 * "심리테스트 기반 추천(GET /api/recommendations)"에 대응하는 백엔드 API가
 * 아직 존재하지 않는 것으로 확인되었습니다. (매 옵션 클릭마다 400 네트워크 에러가
 * 발생하고, 추천 결과는 항상 로딩 후 실패로 끝나던 원인)
 *
 * 그래서 지금은:
 *   1) 옵션을 선택해도 서버로 저장 요청을 보내지 않습니다 (로컬 상태만 사용).
 *   2) 추천 상품은 네트워크 호출 없이 로컬 카탈로그(RECOMMENDATION_CATALOG)에서
 *      선택한 태그 + 예산 범위로 직접 계산해서 보여줍니다.
 *
 * 아래 selectProposalOption / cancelProposalOption / fetchMyProposal /
 * fetchRecommendations 함수 자체는 백엔드 API가 준비되면 바로 쓸 수 있도록
 * 그대로 남겨뒀습니다 (현재는 아무 곳에서도 호출하지 않음). 백엔드 연동이 되면
 * BuilderContext.tsx / BuilderPage.tsx / BuilderCartPage.tsx 에서
 * getLocalRecommendations(...) 호출을 fetchRecommendations(...) 로 바꿔주면 됩니다.
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
 * 로컬 추천 카탈로그.
 * builderDummy.ts 의 장소/분위기/음식 태그와 겹치도록 태그를 맞춰뒀다.
 * 백엔드 추천 API가 준비되기 전까지 이 목록에서 점수 계산으로 추천 상품을 뽑는다.
 */
interface CatalogEntry {
  id: number;
  title: string;
  category: string;
  price: number;
  tags: string[];
}

const RECOMMENDATION_CATALOG: CatalogEntry[] = [
  { id: 101, title: "루프탑 프라이빗 세팅", category: "공간/이벤트", price: 450_000, tags: ["야경", "루프탑", "분위기", "감성", "럭셔리"] },
  { id: 102, title: "한강 피크닉 박스", category: "공간/이벤트", price: 180_000, tags: ["피크닉", "야외", "감성", "힐링"] },
  { id: 103, title: "이벤트 플로럴 데코", category: "플라워", price: 220_000, tags: ["꽃", "장미", "로맨틱", "감성"] },
  { id: 104, title: "캔들 & 조명 세팅", category: "플라워", price: 150_000, tags: ["캔들", "조명", "아늑", "로맨틱"] },
  { id: 105, title: "스냅 촬영 패키지", category: "사진/영상", price: 350_000, tags: ["사진", "이벤트", "감성", "추억"] },
  { id: 106, title: "이벤트 영상 편지", category: "사진/영상", price: 280_000, tags: ["영상", "감성", "서프라이즈"] },
  { id: 107, title: "호텔 스위트룸 프로포즈", category: "공간/이벤트", price: 800_000, tags: ["럭셔리", "호텔", "우아", "프리미엄", "야경"] },
  { id: 108, title: "파인다이닝 코스 예약", category: "다이닝", price: 400_000, tags: ["양식", "와인", "럭셔리", "우아"] },
  { id: 109, title: "오마카세 프라이빗 룸", category: "다이닝", price: 500_000, tags: ["일식", "프리미엄", "프라이빗"] },
  { id: 110, title: "한강 야경 유람선 대관", category: "공간/이벤트", price: 900_000, tags: ["야경", "이벤트", "특별", "럭셔리"] },
  { id: 111, title: "커플 반지 각인 서비스", category: "주얼리", price: 250_000, tags: ["반지", "각인", "기념"] },
  { id: 112, title: "서프라이즈 풍선 데코", category: "공간/이벤트", price: 120_000, tags: ["파티", "이벤트", "활발"] },
  { id: 113, title: "홈파티 케이터링 세트", category: "다이닝", price: 300_000, tags: ["뷔페", "가족", "파티"] },
  { id: 114, title: "디저트 & 케이크 세트", category: "다이닝", price: 90_000, tags: ["카페", "디저트", "달콤"] },
  { id: 115, title: "라이브 연주 섭외", category: "이벤트", price: 500_000, tags: ["감성", "로맨틱", "특별", "음악"] },
];

/**
 * 태그 겹침 점수 + 예산 범위로 로컬 카탈로그에서 추천 상품을 계산한다.
 * 네트워크 호출이 없어 항상 즉시, 안정적으로 결과를 반환한다.
 */
export function getLocalRecommendations(
  builder: BuilderState,
  limit = 5,
): RecommendedProduct[] {
  const { genres, minPrice, maxPrice } = buildRecommendationParams(builder);
  const genreSet = new Set(genres.map((g) => g.toLowerCase()));

  const scored = RECOMMENDATION_CATALOG.map((entry) => {
    const overlap = entry.tags.filter((tag) => genreSet.has(tag.toLowerCase())).length;
    return { entry, overlap };
  });

  const withinBudget = scored.filter(({ entry }) => {
    if (typeof minPrice === "number" && entry.price < minPrice * 0.3) return false;
    if (typeof maxPrice === "number" && entry.price > maxPrice) return false;
    return true;
  });

  const pool = withinBudget.length > 0 ? withinBudget : scored;

  return pool
    .sort((a, b) => b.overlap - a.overlap || a.entry.price - b.entry.price)
    .slice(0, limit)
    .map(({ entry }) => ({
      id: entry.id,
      title: entry.title,
      category: entry.category,
      price: entry.price,
      iconKey: categoryToIconKey(entry.category),
    }));
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
