import { apiRequest } from "../../lib/apiClient";
import type { BuilderState } from "./BuilderContext";
import { categoryToIconKey } from "./builderIcons";
import { fetchProductDetail } from "../Shop/shopApi";
import type { DisplayProduct } from "../Shop/shopApi";

/**
 * ⚠️ 2026-08-21 백엔드 확인 완료 — 이 매핑은 폐기됨. BuilderContext.tsx에서
 * 더 이상 이 상수를 사용하지 않는다.
 *
 * category(RING/PHOTO/EVENT/LETTER/FLOWER/ETC)는 "프로포즈에 담을 상품 종류 슬롯"이고,
 * productId는 실제 상점(shopApi) DB에 존재하는 진짜 상품 id여야 한다. 빌더가 다루는
 * 장소/분위기/음식/예산은 이 개념과 전혀 무관해서, weddingHall→EVENT 같은 매핑은
 * 서버에 잘못된 이름/가격이 스냅샷 저장되는 데이터 오염을 유발했다.
 *
 * "견적에 실제 상품 담기" UI를 다시 만들 경우, builderDummy.ts의 가짜 카탈로그가 아니라
 * shopApi.fetchProducts()로 가져온 실제 상품 중에서 category/productId를 골라
 * selectProposalOption을 호출하도록 완전히 새로 설계해야 한다.
 */
export const PROPOSAL_CATEGORY = {
  weddingHall: "EVENT",
  seudeume: "FLOWER",
  honeymoon: "PHOTO",
  budget: "LETTER",
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
  /** 백엔드가 심리테스트 결과 기반으로 이 상품을 추천한 이유 (예: "로맨틱 성향과 잘 맞아요") */
  reason?: string;
}

export interface ProposalSummary {
  id?: number;
  selections: Partial<Record<ProposalCategory, { productId: number; name?: string; price?: number }>>;
  totalPrice: number;
}

interface ProposalMeResponseRaw {
  id?: number;
  items?: Array<{ category: string; productId: number; name?: string; price?: number }>;
  totalPrice?: number;
}

/**
 * GET /api/recommendations 실제 응답 형태 (2026-08-20 Swagger 재배포 기준 확정).
 * productId + reason만 내려주고 상품 상세(이름/가격/카테고리/이미지)는 안 준다 —
 * 상세는 shopApi.fetchProductDetail로 각각 조회해서 합쳐야 함.
 */
interface RecommendationsResponseRaw {
  recommendations?: Array<{ productId: number; reason: string }>;
}

function normalizeProposal(raw: ProposalMeResponseRaw | null | undefined): ProposalSummary {
  const selections: ProposalSummary["selections"] = {};

  (raw?.items ?? []).forEach((item) => {
    selections[item.category as ProposalCategory] = {
      productId: item.productId,
      name: item.name,
      price: item.price,
    };
  });

  return {
    id: raw?.id,
    selections,
    totalPrice: raw?.totalPrice ?? 0,
  };
}

/**
 * 프로포즈 옵션 선택/변경
 * POST /api/proposals/options
 *
 * ⚠️ 2026-08-21 백엔드 확인: category는 상품 종류 슬롯(RING/PHOTO/EVENT/LETTER/FLOWER/ETC),
 * productId는 실제 상점 DB의 진짜 상품 id여야 한다. 현재 BuilderContext.tsx는 이 함수를
 * 호출하지 않는다 (아래 PROPOSAL_CATEGORY 관련 주석 참고). "견적에 실제 상품 담기" 기능을
 * 다시 설계할 때 사용할 것.
 */
export async function selectProposalOption(
  category: ProposalCategory,
  productId: number,
): Promise<void> {
  await apiRequest<void>(
    "/api/proposals/options",
    { method: "POST", body: JSON.stringify({ category, productId }) },
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
 * 내 프로포즈 선택 현황/견적 조회
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
 * ⚠️ 2026-08-21 확인: 빌더(BuilderState)의 장소/분위기/음식/예산 선택을 전혀 참조하지
 * 않고 오직 온보딩 심리테스트 결과만 본다 — 빌더 도메인과 무관한 API. 심리테스트
 * 미완료 유저에게는 COMMON_400 + "심리테스트 결과를 찾을 수 없습니다"로 응답함.
 * 현재 이 함수는 어디서도 호출하지 않는다 (BuilderCartPage는 getLocalRecommendations만
 * 사용). 백엔드에 빌더 전용 추천 API가 생기면 그때 다시 연결할 것.
 */
export async function fetchRecommendations(): Promise<RecommendedProduct[]> {
  const raw = await apiRequest<RecommendationsResponseRaw>(
    "/api/recommendations",
    { method: "GET" },
    "추천 상품을 불러오지 못했습니다.",
  );

  const items = raw?.recommendations ?? [];
  if (items.length === 0) return [];

  const results = await Promise.all(
    items.map(async ({ productId, reason }): Promise<RecommendedProduct | null> => {
      try {
        const detail = await fetchProductDetail(productId);
        return {
          id: detail.id,
          title: detail.title,
          category: detail.categoryType,
          price: detail.price,
          iconKey: categoryToIconKey(detail.categoryType),
          imageUrl: detail.image,
          reason,
        };
      } catch {
        return null;
      }
    }),
  );

  return results.filter((p): p is RecommendedProduct => p !== null);
}

export function getLocalRecommendations(
  builder: BuilderState,
  allProducts: DisplayProduct[],
  limit = 5,
): RecommendedProduct[] {
  const { genres, minPrice, maxPrice } = buildRecommendationParams(builder);
  const genreSet = new Set(genres.map((g) => g.toLowerCase()));

  const scored = allProducts.map((product) => {
    const productTags = [product.categoryType, product.title, ...(product.tastes ?? []), ...(product.styles ?? [])]
      .filter((v): v is string => Boolean(v))
      .map((v) => v.toLowerCase());
    const overlap = productTags.filter((tag) => genreSet.has(tag)).length;
    return { product, overlap };
  });

  // "예산"은 추천된 상품들의 합계(totalPrice)가 선택한 구간(minPrice~maxPrice) 안에
  // 들어와야 한다는 뜻이다 (2026-08-21 최종 확인). 개별 상품 가격은 예산 상한
  // (maxPrice)보다 비싸지만 않으면 후보가 될 수 있다 — 여러 개를 합쳐서
  // 구간을 채우는 것도 자연스러우니까.
  const candidates = scored.filter(({ product }) => {
    if (typeof maxPrice === "number" && product.price > maxPrice) return false;
    return true;
  });

  // 취향 태그가 겹치는 상품을 우선하고, 그중에서도 비싼 순으로 정렬해서
  // 합계가 예산 구간에 최대한 가깝게(특히 minPrice 이상으로) 채워지도록 한다.
  const sorted = candidates.sort(
    (a, b) => b.overlap - a.overlap || b.product.price - a.product.price,
  );

  // 하한(minPrice)만 있고 상한이 없는 구간("500만원 이상" 등)은 limit개로는
  // 합계를 못 채울 수 있다. 그런 경우 하한을 채울 때까지 limit을 무시하고 계속 담는다.
  // (2026-08-21: limit=5 고정이라 500만원 이상 구간에서 상품을 다 담아도 합계가
  // minPrice 미만이 되어 늘 빈 목록이 뜨던 문제 수정)
  const hasOpenEndedMin = typeof minPrice === "number" && typeof maxPrice !== "number";

  const picked: DisplayProduct[] = [];
  let total = 0;
  for (const { product } of sorted) {
    if (!hasOpenEndedMin && picked.length >= limit) break;
    if (typeof maxPrice === "number" && total + product.price > maxPrice) continue;
    picked.push(product);
    total += product.price;
    // 하한이 없는 구간에서 이미 목표 하한을 채웠고 limit도 넘겼다면 그만 담는다.
    if (hasOpenEndedMin && total >= minPrice! && picked.length >= limit) break;
  }

  // 담긴 상품들의 합계가 여전히 하한(minPrice)에 못 미치면, 예산 구간 자체를
  // 만족시킬 수 없는 상황이라 빈 목록을 반환한다 (하한을 넘기려고 예산 상한을
  // 초과하는 상품을 억지로 넣지 않는다).
  if (typeof minPrice === "number" && total < minPrice) {
    return [];
  }

  return picked.map((product) => ({
    id: product.id,
    title: product.title,
    category: product.categoryType,
    price: product.price,
    iconKey: categoryToIconKey(product.categoryType),
    imageUrl: product.image,
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
 * 추천 상품을 찜하기 / 찜 취소
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
  const raw = await apiRequest<{ productIds?: number[] } | WishlistItemRaw[]>(
    "/api/wishlists/me",
    { method: "GET" },
    "찜 목록 조회에 실패했습니다.",
  );

  if (Array.isArray(raw)) {
    return new Set(raw.map((item) => item.productId ?? item.id ?? 0).filter((id) => id > 0));
  }

  return new Set((raw?.productIds ?? []).filter((id) => id > 0));
}