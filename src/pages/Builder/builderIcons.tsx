import type { LucideProps } from "lucide-react";
import {
  TreePine,
  Utensils,
  FerrisWheel,
  ShoppingBasket,
  Building2,
  House,
  Flower2,
  Sparkles,
  LampDesk,
  PartyPopper,
  Heart,
  Gem,
  Wine,
  Salad,
  Cake,
  Crown,
  Star,
  Camera,
  Music4,
  Sailboat,
  Gift,
  ShoppingCart,
  MapPin,
  Drama,
  UtensilsCrossed,
  Lock,
  Target,
} from "lucide-react";

/**
 * 빌더 전역에서 사용하는 "의미 기반" 아이콘 키 → lucide 컴포넌트 매핑.
 * builderDummy.ts / builderProducts.ts 의 icon 값과 반드시 이 key 들을 맞춰서 사용한다.
 * 새로운 옵션을 추가할 때는 이모지를 쓰지 말고 이 맵에 키를 추가해서 재사용할 것.
 */
export const BUILDER_ICON_MAP: Record<string, React.ElementType> = {
  // 장소 (weddingHallList)
  tree: TreePine,
  restaurant: Utensils,
  themepark: FerrisWheel,
  picnic: ShoppingBasket,
  rooftop: Building2,
  house: House,

  // 분위기 (seudeumeList)
  rose: Flower2,
  elegant: Sparkles,
  cozy: LampDesk,
  party: PartyPopper,
  emotional: Heart,
  luxury: Gem,

  // 음식 (honeymoonList)
  wine: Wine,
  korean: Salad,
  buffet: Cake,
  cafe: Cake,
  omakase: Utensils,

  // 예산 (budgetList)
  money: Crown,
  gem: Gem,
  crown: Crown,
  star: Star,
  sparkles: Sparkles,

  // 추천 상품 카테고리
  camera: Camera,
  music: Music4,
  boat: Sailboat,
  gift: Gift,
  cart: ShoppingCart,
  target: Target,

  // 시작 페이지 스텝/특징
  location: MapPin,
  mood: Drama,
  food: UtensilsCrossed,
  lock: Lock,
};

export const DEFAULT_BUILDER_ICON = Sparkles;

interface BuilderIconProps extends LucideProps {
  icon: string | null | undefined;
}

/**
 * icon 키 문자열을 받아 lucide 아이콘을 렌더링하는 공용 컴포넌트.
 * 매핑에 없는 값이 오더라도 절대 원문(이모지/문자열)을 그대로 출력하지 않고
 * 기본 아이콘(Sparkles)으로 안전하게 대체한다.
 */
export function BuilderIcon({ icon, ...props }: BuilderIconProps) {
  const Icon = (icon && BUILDER_ICON_MAP[icon]) || DEFAULT_BUILDER_ICON;
  return <Icon {...props} />;
}

/**
 * 추천 상품의 categoryType(예: "이벤트/공간", "플라워", "사진/영상"...) 을
 * 적당한 아이콘 키로 매핑한다. 실제 카테고리 값은 백엔드 응답에 맞춰 조정 가능.
 */
export function categoryToIconKey(categoryType: string | undefined): string {
  if (!categoryType) return "sparkles";
  if (categoryType.includes("공간") || categoryType.includes("이벤트")) return "rooftop";
  if (categoryType.includes("플라워")) return "rose";
  if (categoryType.includes("사진") || categoryType.includes("영상")) return "camera";
  if (categoryType.includes("주얼리")) return "gem";
  if (categoryType.includes("음악") || categoryType.includes("연주")) return "music";
  return "sparkles";
}
