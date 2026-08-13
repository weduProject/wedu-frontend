// 백엔드 API enum → 프론트 표시값 및 UI 매핑 파일

// ─── 1. Product (편집샵) ────────────────────────────────────────────────────────
export type ProductCategory = 'RING' | 'EVENT' | 'FLOWER' | 'PHOTO' | 'LETTER' | 'ETC';

export const PRODUCT_CATEGORY_MAP: Record<ProductCategory, { label: string; emoji: string }> = {
  RING:   { label: '반지',   emoji: '💍' },
  EVENT:  { label: '이벤트', emoji: '✨' },
  FLOWER: { label: '플라워', emoji: '💐' },
  PHOTO:  { label: '사진',   emoji: '📸' },
  LETTER: { label: '편지',   emoji: '💌' },
  ETC:    { label: '기타',   emoji: '📦' },
};

export const PRODUCT_CATEGORIES: ProductCategory[] = ['RING', 'EVENT', 'FLOWER', 'PHOTO', 'LETTER', 'ETC'];


// ─── 2. Proposal (나만의 프로포즈) ─────────────────────────────────────────────
export type ProposalCategory = 'RING' | 'PHOTO' | 'EVENT' | 'LETTER' | 'FLOWER' | 'ETC';

export const PROPOSAL_CATEGORY_MAP: Record<ProposalCategory, { label: string; emoji: string }> = {
  RING:   { label: '반지',   emoji: '💍' },
  PHOTO:  { label: '사진',   emoji: '📸' },
  EVENT:  { label: '이벤트', emoji: '✨' },
  LETTER: { label: '편지',   emoji: '💌' },
  FLOWER: { label: '플라워', emoji: '💐' },
  ETC:    { label: '기타',   emoji: '📦' },
};

export const PROPOSAL_CATEGORIES: ProposalCategory[] = ['RING', 'PHOTO', 'EVENT', 'LETTER', 'FLOWER', 'ETC'];


// ─── 3. Checklist ──────────────────────────────────────────────────────────────
export type ChecklistCategory = 'BASIC' | 'CEREMONY' | 'SHOOTING' | 'JEWELRY' | 'HOUSING' | 'TRAVEL';

export const CHECKLIST_CATEGORY_LABEL: Record<ChecklistCategory, string> = {
  BASIC:    '기본',
  CEREMONY: '예식',
  SHOOTING: '촬영',
  JEWELRY:  '예물',
  HOUSING:  '주거',
  TRAVEL:   '여행',
};

export const CHECKLIST_CATEGORIES: ChecklistCategory[] = ['BASIC', 'CEREMONY', 'SHOOTING', 'JEWELRY', 'HOUSING', 'TRAVEL'];


// ─── 4. Budget / Calendar (공통) ────────────────────────────────────────────────
export type WeddingCategory = 'VENUE' | 'STUDIO_DRESS' | 'HONEYMOON' | 'JEWELRY_GIFTS' | 'OTHER';

export const WEDDING_CATEGORY_LABEL: Record<WeddingCategory, string> = {
  VENUE:         '웨딩홀/예식장',
  STUDIO_DRESS:  '스튜디오/드레스',
  HONEYMOON:     '허니문',
  JEWELRY_GIFTS: '예물/예단',
  OTHER:         '기타',
};

export const WEDDING_CATEGORIES: WeddingCategory[] = ['VENUE', 'STUDIO_DRESS', 'HONEYMOON', 'JEWELRY_GIFTS', 'OTHER'];


// ─── 5. 안전한 GET 응답 카테고리 매핑 유틸 함수 (Fallback 방어) ────────────────

/** [Product / GET /api/products] 카테고리 정보 조회 */
export const getProductCategoryInfo = (category?: string | null) => {
  if (!category || !(category in PRODUCT_CATEGORY_MAP)) {
    return PRODUCT_CATEGORY_MAP.ETC;
  }
  return PRODUCT_CATEGORY_MAP[category as ProductCategory];
};

/** [Proposal / GET /api/proposals/me] 카테고리 정보 조회 */
export const getProposalCategoryInfo = (category?: string | null) => {
  if (!category || !(category in PROPOSAL_CATEGORY_MAP)) {
    return PROPOSAL_CATEGORY_MAP.ETC;
  }
  return PROPOSAL_CATEGORY_MAP[category as ProposalCategory];
};

/** [Checklist / GET /api/checklist-items] 카테고리 라벨 조회 */
export const getChecklistCategoryLabel = (category?: string | null): string => {
  if (!category || !(category in CHECKLIST_CATEGORY_LABEL)) {
    return '기타';
  }
  return CHECKLIST_CATEGORY_LABEL[category as ChecklistCategory];
};

/** [Calendar & Budget / GET /api/calendar-events, /api/budget-items] 카테고리 라벨 조회 */
export const getWeddingCategoryLabel = (category?: string | null): string => {
  if (!category || !(category in WEDDING_CATEGORY_LABEL)) {
    return '기타';
  }
  return WEDDING_CATEGORY_LABEL[category as WeddingCategory];
};
