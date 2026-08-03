export interface Product {
  id: number;
  category: string;
  categoryType: string;
  styles: string[];
  tastes: string[];
  title: string;
  description: string;
  detailDescription: string;  
  includes: string[];        
  tags: string[];
  price: string;
  image?: string;
  styleTag?: string;
  moodTag?: string;
  locationTag?: string;
  instagramUrl?: string;
  weddingCategory?: '예식장' | '예물' | '신혼여행'; // 추가
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    category: '🍽️ 장소',
    categoryType: '장소',
    styles: ['로맨틱', '우아한'],
    tastes: ['와인&샴페인', '라이브 음악'],
    title: '한강 뷰 프라이빗 다이닝',
    description: '한강 야경이 내려다보이는 프라이빗 룸에서 둘만의 로맨틱 디너',
    detailDescription:
      '서울 최고의 전망을 자랑하는 프라이빗 다이닝 룸입니다. 한강과 도시 야경이 펼쳐지는 창가 테이블에서 셰프가 직접 준비하는 7코스 디너와 프리미엄 와인 페어링을 즐기실 수 있습니다. 디저트와 함께 특별한 순간을 연출해 드립니다.',
    includes: ['7코스 맞춤 메뉴', '와인 페어링', '전담 플로리스트', '현악 3중주', '포토그래퍼'],
    tags: ['한강뷰', '프라이빗', '코스요리'],
    price: '80만원~',
    styleTag: '코스요리',
    moodTag: '로맨틱',
    locationTag: '한강뷰',
    instagramUrl: 'https://www.instagram.com/wedu_official',
  },
  {
    id: 2,
    category: '🏨 장소',
    categoryType: '장소',
    styles: ['우아한', '럭셔리'],
    tastes: ['와인&샴페인', '럭셔리 패키지'],
    title: '5성급 호텔 스위트 프로포즈',
    description: '최고급 스위트룸에서 샴페인과 함께하는 품격 있는 프러포즈',
    detailDescription:
      '5성급 호텔의 최고급 스위트룸에서 진행되는 프리미엄 프로포즈 패키지입니다. 샴페인과 룸 데코레이션, 케이크가 포함되며 품격 있는 순간을 선사합니다.',
    includes: ['스위트룸 1박', '샴페인 & 케이크', '룸 데코레이션', '조식 서비스'],
    tags: ['럭셔리', '스위트룸', '호캉스'],
    price: '150만원~',
    styleTag: '스위트룸',
    moodTag: '럭셔리',
    locationTag: '5성급 호텔',
    instagramUrl: 'https://www.instagram.com/wedu_hotel_suite',
  },
  {
    id: 3,
    category: '🌅 장소',
    categoryType: '장소',
    styles: ['모험적', '감성적'],
    tastes: ['자연 속에서', '사진 촬영'],
    title: '제주도 해변 선셋 프로포즈',
    description: '제주도의 황홀한 석양을 배경으로 펼치는 감동의 순간',
    detailDescription:
      '제주도의 아름다운 해변에서 석양을 배경으로 진행되는 프로포즈입니다. 해변 세팅과 사진 촬영이 포함되어 잊지 못할 순간을 남겨드립니다.',
    includes: ['해변 세팅', '석양 타임 예약', '스냅 촬영', '플라워 데코'],
    tags: ['제주도', '석양', '해변'],
    price: '50만원~',
    styleTag: '야외 촬영',
    moodTag: '감성적',
    locationTag: '제주 해변',
    instagramUrl: 'https://www.instagram.com/wedu_jeju_sunset',
  },
  {
    id: 4,
    category: '💐 서비스',
    categoryType: '서비스',
    styles: ['로맨틱', '감성적'],
    tastes: ['꽃과 장미', '캔들 무드', '풍선 데코'],
    title: '프리미엄 플라워 데코',
    description: '수백 송이의 장미와 캔들로 연출하는 로맨틱 무대',
    detailDescription:
      '수백 송이의 생화 장미와 캔들을 활용해 로맨틱한 무대를 연출합니다. 원하는 공간에 맞춰 맞춤 데코레이션을 제공합니다.',
    includes: ['생화 장미 데코', '캔들 세팅', '현장 설치/철거', '맞춤 디자인'],
    tags: ['플라워', '데코', '장미'],
    price: '30만원~',
    styleTag: '생화 장미 데코',
    moodTag: '로맨틱',
    // 고객 공간에 맞춰 진행되므로 locationTag는 생략 (태그 자동으로 안 뜸)
    instagramUrl: 'https://www.instagram.com/wedu_flower_deco',
  },
  {
    id: 5,
    category: '📸 서비스',
    categoryType: '서비스',
    styles: ['감성적', '아늑한'],
    tastes: ['사진 촬영', '영상 편지'],
    title: '프로포즈 포토그래퍼',
    description: '눈물과 감동의 순간을 아름다운 화보로 남겨드립니다',
    detailDescription:
      '전문 포토그래퍼가 프로포즈의 모든 순간을 아름다운 화보로 담아드립니다. 스냅과 영상 촬영을 함께 제공합니다.',
    includes: ['스냅 촬영 2시간', '보정본 30장', '원본 전체 제공', '영상 클립'],
    tags: ['사진', '화보', '스냅'],
    price: '40만원~',
    styleTag: '스냅 촬영',
    moodTag: '감성적',
    instagramUrl: 'https://www.instagram.com/wedu_proposal_photo',
  },
  {
    id: 6,
    category: '🎻 경험',
    categoryType: '경험',
    styles: ['우아한', '감성적'],
    tastes: ['라이브 음악'],
    title: '현악 4중주 라이브',
    description: '프로포즈 순간에 맞춰 감미로운 현악기 선율이 흐릅니다',
    detailDescription:
      '전문 연주자들의 현악 4중주 라이브 공연입니다. 프로포즈 순간에 맞춰 원하는 곡을 연주해 드립니다.',
    includes: ['4인 연주팀', '곡 선곡 상담', '30분 공연', '음향 장비'],
    tags: ['현악', '라이브', '클래식'],
    price: '60만원~',
    styleTag: '라이브 연주',
    moodTag: '우아한',
    instagramUrl: 'https://www.instagram.com/wedu_string_quartet',
  },
  {
    id: 7,
    category: '🎆 경험',
    categoryType: '경험',
    styles: ['모험적', '깜짝'],
    tastes: ['자연 속에서'],
    title: '프라이빗 불꽃놀이',
    description: '밤하늘을 수놓는 불꽃과 함께 YES를 외치는 순간',
    detailDescription:
      '프라이빗 공간에서 진행되는 불꽃놀이 연출입니다. 안전 관리 인력과 함께 밤하늘을 수놓는 특별한 순간을 만들어 드립니다.',
    includes: ['불꽃 연출', '안전 관리 인력', '허가 대행', '현장 세팅'],
    tags: ['불꽃놀이', '야간', '스페셜'],
    price: '120만원~',
    styleTag: '불꽃 연출',
    moodTag: '드라마틱',
    locationTag: '야외 공간',
    instagramUrl: 'https://www.instagram.com/wedu_fireworks',
  },
  {
    id: 8,
    category: '💍 선물',
    categoryType: '선물',
    styles: ['우아한', '로맨틱'],
    tastes: ['럭셔리 패키지', '손편지'],
    title: '커스텀 프로포즈 링',
    description: '세상에 단 하나뿐인 맞춤 제작 프로포즈 반지',
    detailDescription:
      '세상에 하나뿐인 맞춤 제작 프로포즈 반지입니다. 디자인 상담부터 제작까지 전 과정을 함께합니다.',
    includes: ['디자인 상담', '맞춤 제작', '각인 서비스', '고급 케이스'],
    tags: ['반지', '커스텀', '주얼리'],
    price: '200만원~',
    styleTag: '맞춤 제작',
    moodTag: '럭셔리',
    // 선물류라 장소 개념이 없어 locationTag 생략
    instagramUrl: 'https://www.instagram.com/wedu_custom_ring',
  },
];