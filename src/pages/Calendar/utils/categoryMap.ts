import type { CategoryType } from '../CalendarPage';

const CATEGORY_TO_ENUM: Record<CategoryType, string> = {
  '웨딩홀/예식장': 'VENUE',
  '스튜디오/드레스': 'STUDIO_DRESS',
  '허니문': 'HONEYMOON',
  '예물/예단': 'JEWELRY_GIFTS',
  '기타': 'OTHER',
};

const ENUM_TO_CATEGORY: Record<string, CategoryType> = {
  VENUE: '웨딩홀/예식장',
  STUDIO_DRESS: '스튜디오/드레스',
  HONEYMOON: '허니문',
  JEWELRY_GIFTS: '예물/예단',
  OTHER: '기타',
};

export function toBackendCategory(category: CategoryType): string {
  return CATEGORY_TO_ENUM[category] ?? 'OTHER';
}

export function toFrontCategory(enumValue: string): CategoryType {
  return ENUM_TO_CATEGORY[enumValue] ?? '기타';
}