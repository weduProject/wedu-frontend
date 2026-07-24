export interface BuilderItem {
  id: number;
  name: string;
  description: string;
  tags: string[];
  icon: string;
  image: string;
}

export const weddingHallList: BuilderItem[] = [
  {
    id: 1,
    name: "야외/자연",
    description: "숲, 해변, 공원 등 자연이 어우러진 프로포즈",
    tags: ["야외", "감성", "힐링"],
    icon: "🌿",
    image: "/images/outdoor.jpg",
  },
  {
    id: 2,
    name: "호텔/레스토랑",
    description: "프라이빗한 공간에서 분위기 있는 프로포즈",
    tags: ["럭셔리", "로맨틱", "야경"],
    icon: "🍽️",
    image: "/images/hotel.jpg",
  },
  {
    id: 3,
    name: "놀이공원",
    description: "즐거운 추억과 함께하는 특별한 이벤트",
    tags: ["활동적", "이벤트", "사진"],
    icon: "🎡",
    image: "/images/themepark.jpg",
  },
  {
    id: 4,
    name: "한강 피크닉",
    description: "도심 속 감성 피크닉 프로포즈",
    tags: ["피크닉", "감성", "야경"],
    icon: "🧺",
    image: "/images/hangang.jpg",
  },
  {
    id: 5,
    name: "루프탑",
    description: "야경이 아름다운 루프탑에서 로맨틱하게",
    tags: ["야경", "분위기", "감성"],
    icon: "🌃",
    image: "/images/rooftop.jpg",
  },
  {
    id: 6,
    name: "펜션/풀빌라",
    description: "둘만의 공간에서 프라이빗한 프로포즈",
    tags: ["숙박", "프라이빗", "감성"],
    icon: "🏡",
    image: "/images/poolvilla.jpg",
  },
];

export const seudeumeList: BuilderItem[] = [
  {
    id: 1,
    name: "로맨틱",
    description: "장미와 촛불이 가득한 분위기",
    tags: ["꽃", "캔들"],
    icon: "🌹",
    image: "/images/romantic.jpg",
  },
  {
    id: 2,
    name: "우아한",
    description: "고급스럽고 클래식한 분위기",
    tags: ["클래식", "호텔"],
    icon: "✨",
    image: "/images/elegant.jpg",
  },
  {
    id: 3,
    name: "아늑한",
    description: "따뜻하고 편안한 공간",
    tags: ["감성", "조명"],
    icon: "🕯️",
    image: "/images/cozy.jpg",
  },
  {
    id: 4,
    name: "활발한",
    description: "즐겁고 유쾌한 분위기",
    tags: ["파티", "이벤트"],
    icon: "🎉",
    image: "/images/festival.jpg",
  },
  {
    id: 5,
    name: "감성적",
    description: "영화 같은 순간을 연출",
    tags: ["감성", "사진"],
    icon: "💖",
    image: "/images/emotional.jpg",
  },
  {
    id: 6,
    name: "럭셔리",
    description: "호텔급 프리미엄 데코레이션",
    tags: ["프리미엄", "럭셔리"],
    icon: "💎",
    image: "/images/luxury.jpg",
  },
];

export const honeymoonList: BuilderItem[] = [
  {
    id: 1,
    name: "파인 다이닝",
    description: "코스요리와 와인이 함께하는 식사",
    tags: ["양식", "와인"],
    icon: "🍷",
    image: "/images/finedining.jpg",
  },
  {
    id: 2,
    name: "한식 정찬",
    description: "품격 있는 한식 코스",
    tags: ["한식", "정갈"],
    icon: "🍚",
    image: "/images/koreanfood.jpg",
  },
  {
    id: 3,
    name: "뷔페",
    description: "다양한 메뉴를 즐기는 식사",
    tags: ["뷔페", "가족"],
    icon: "🍽️",
    image: "/images/buffet.jpg",
  },
  {
    id: 4,
    name: "디저트 카페",
    description: "케이크와 커피로 달콤한 마무리",
    tags: ["카페", "디저트"],
    icon: "🍰",
    image: "/images/cafe.jpg",
  },
  {
    id: 5,
    name: "피크닉 도시락",
    description: "야외에서 즐기는 감성 도시락",
    tags: ["피크닉", "야외"],
    icon: "🧺",
    image: "/images/picnic.jpg",
  },
  {
    id: 6,
    name: "오마카세",
    description: "프라이빗한 셰프 코스 요리",
    tags: ["일식", "프리미엄"],
    icon: "🍣",
    image: "/images/omakase.jpg",
  },
];
export const budgetList: BuilderItem[] = [
  {
    id: 1,
    name: "100만원 이하",
    description: "0~100만원",
    tags: [],
    icon: "💰",
    image: "",
  },
  {
    id: 2,
    name: "100~200만원",
    description: "100~200만원",
    tags: [],
    icon: "💎",
    image: "",
  },
  {
    id: 3,
    name: "200~300만원",
    description: "200~300만원",
    tags: [],
    icon: "👑",
    image: "",
  },
  {
    id: 4,
    name: "300~500만원",
    description: "300~500만원",
    tags: [],
    icon: "⭐",
    image: "",
  },
  {
    id: 5,
    name: "500만원 이상",
    description: "",
    tags: [],
    icon: "✨",
    image: "",
  },
];
