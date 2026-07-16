export interface Product {
  id: number;
  category: string;      // 뱃지 표시용 
  categoryType: string;  // 필터용 (장소/서비스/경험/선물)
  styles: string[];      // 필터용 스타일 태그 (로맨틱/우아한 등)
  tastes: string[];      // 취향으로 찾기 필터용
  title: string;
  description: string;
  tags: string[];
  price: string;
  image?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    category: '🍽️ 장소',
    categoryType: '장소',
    styles: ['로맨틱', '우아한'],
    title: '한강 뷰 프라이빗 다이닝',
    description: '한강 야경이 내려다보이는 프라이빗 룸에서 둘만의 로맨틱 디너',
    tags: ['한강뷰', '프라이빗', '코스요리'],
    price: '80만원~',
    tastes: ['와인&샴페인', '라이브 음악'],
  },
  {
    id: 2,
    category: '🏨 장소',
    categoryType: '장소',
    styles: ['우아한', '럭셔리'],
    title: '5성급 호텔 스위트 프로포즈',
    description: '최고급 스위트룸에서 샴페인과 함께하는 품격 있는 프러포즈',
    tags: ['럭셔리', '스위트룸', '호캉스'],
    price: '150만원~',
    tastes: ['와인&샴페인', '럭셔리 패키지'],
  },
  {
    id: 3,
    category: '🌅 장소',
    categoryType: '장소',
    styles: ['모험적', '감성적'],
    title: '제주도 해변 선셋 프로포즈',
    description: '제주도의 황홀한 석양을 배경으로 펼치는 감동의 순간',
    tags: ['제주도', '석양', '해변'],
    price: '50만원~',
    tastes: ['자연 속에서', '사진 촬영'],
  },
  {
    id: 4,
    category: '💐 서비스',
    categoryType: '서비스',
    styles: ['로맨틱', '감성적'],
    title: '프리미엄 플라워 데코',
    description: '수백 송이의 장미와 캔들로 연출하는 로맨틱 무대',
    tags: ['플라워', '데코', '장미'],
    price: '30만원~',
    tastes: ['꽃과 장미', '캔들 무드', '풍선 데코'],
  },
  {
    id: 5,
    category: '📸 서비스',
    categoryType: '서비스',
    styles: ['감성적', '아늑한'],
    title: '프로포즈 포토그래퍼',
    description: '눈물과 감동의 순간을 아름다운 화보로 남겨드립니다',
    tags: ['사진', '화보', '스냅'],
    price: '40만원~',
    tastes: ['사진 촬영', '영상 편지'],
  },
  {
    id: 6,
    category: '🎻 경험',
    categoryType: '경험',
    styles: ['우아한', '감성적'],
    title: '현악 4중주 라이브',
    description: '프로포즈 순간에 맞춰 감미로운 현악기 선율이 흐릅니다',
    tags: ['현악', '라이브', '클래식'],
    price: '60만원~',
    tastes: ['라이브 음악'],
  },
  {
    id: 7,
    category: '🎆 경험',
    categoryType: '경험',
    styles: ['모험적', '깜짝'],
    title: '프라이빗 불꽃놀이',
    description: '밤하늘을 수놓는 불꽃과 함께 YES를 외치는 순간',
    tags: ['불꽃놀이', '야간', '스페셜'],
    price: '120만원~',
    tastes: ['자연 속에서'],
  },
  {
    id: 8,
    category: '💍 선물',
    categoryType: '선물',
    styles: ['우아한', '로맨틱'],
    title: '커스텀 프로포즈 링',
    description: '세상에 단 하나뿐인 맞춤 제작 프로포즈 반지',
    tags: ['반지', '커스텀', '주얼리'],
    price: '200만원~',
    tastes: ['럭셔리 패키지', '손편지'],
  },
];