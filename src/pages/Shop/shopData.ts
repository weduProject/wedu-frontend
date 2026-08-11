// 상품 이미지를 src/assets/shop/{id}.jpg 로 저장 후 id로 자동 매핑
const shopImageModules = import.meta.glob<{ default: string }>('../../assets/shop/*.jpg', { eager: true });
const getShopImage = (id: number): string | undefined => shopImageModules[`../../assets/shop/${id}.jpg`]?.default;

export type ProductCategory = 'RING' | 'EVENT' | 'FLOWER' | 'PHOTO' | 'LETTER' | 'ETC';

// 백엔드엔 없고 화면 꾸미기용으로 프론트에서만 들고 있기로 합의한 필드들
export interface ProductDecoration {
  styles: string[];
  tastes: string[];
  detailDescription: string;
  includes: string[];
  tags: string[];
  image?: string;
  styleTag?: string;
  moodTag?: string;
  locationTag?: string;
  instagramUrl?: string;
}

// id 매칭용 — 백엔드 상품 id가 1~24로 그대로 들어왔을 때 우선 사용됨
export const DECORATIONS_BY_ID: Record<number, ProductDecoration> = {
  
  // 🍽️ 장소 — 프라이빗 다이닝 / 레스토랑
  1: {
    styles: ['로맨틱', '우아한'],
    tastes: ['와인&샴페인', '미식'],
    detailDescription:
      '호텔 및 프라이빗 공간을 활용해 특별한 날을 위한 디너와 프로포즈 연출을 함께 준비할 수 있는 프로포즈 전문 서비스입니다.',
    includes: ['프라이빗 공간', '프로포즈 데코레이션', '디너', '꽃 장식', '이벤트 연출'],
    tags: ['한강뷰', '프라이빗다이닝', '르다프로포즈', '파인다이닝'],
    image: getShopImage(1),
    styleTag: '프라이빗 다이닝',
    moodTag: '로맨틱',
    locationTag: '서울 반포',
    instagramUrl: 'https://www.instagram.com/leda_theriver/',
  },
  2: {
    styles: ['우아한', '럭셔리'],
    tastes: ['미식', '와인&샴페인'],
    detailDescription:
      '파크 하얏트 서울의 이탈리안 레스토랑 코너스톤에서 특별한 날을 위한 다이닝을 즐길 수 있습니다.',
    includes: ['호텔 다이닝', '코스 메뉴', '와인 페어링', '프라이빗 다이닝'],
    tags: ['호텔', '이탈리안', '다이닝', '강남'],
    image: getShopImage(2),
    styleTag: '호텔 다이닝',
    moodTag: '럭셔리',
    locationTag: '서울 강남',
    instagramUrl: 'https://www.instagram.com/parkhyattseoul',
  },
  3: {
    styles: ['감성적', '아늑한'],
    tastes: ['미식', '와인&샴페인'],
    detailDescription:
      '용산구 원효로 오르막길 꼭대기에 위치하여 압도적인 밤섬 한강뷰를 자랑하는 이탈리안 레스토랑입니다. 주택을 개조한 특유의 아늑한 분위기 속에서 단독 프라이빗 룸과 상주 플로리스트의 맞춤형 프로포즈 연출을 이용할 수 있는 프리미엄 공간형 상품입니다.',
    includes: ['프라이빗 단독룸', '셰프 전용 코스요리', '글라스/보틀 와인', '플로리스트 생화 데코레이션'],
    tags: ['프라이빗룸', '코스요리', '한강뷰레스토랑', '아이오유'],
    image: getShopImage(3),
    styleTag: '프라이빗룸',
    moodTag: '아늑한',
    locationTag: '서울 용산',
    instagramUrl: 'https://www.instagram.com/restaurant_iou/',
  },

  // 🏨 장소 — 5성급 호텔
  4: {
    styles: ['럭셔리', '우아한'],
    tastes: ['럭셔리 패키지', '와인&샴페인'],
    detailDescription:
      '롯데월드타워 최상층에 위치한 럭셔리 호텔로 서울 도심의 파노라마 전망과 함께 특별한 하루를 계획할 수 있습니다.',
    includes: ['럭셔리 객실', '서울 야경', '호텔 다이닝', '객실 데코레이션'],
    tags: ['시그니엘', '서울야경', '호텔', '럭셔리'],
    image: getShopImage(4),
    styleTag: '럭셔리 호텔',
    moodTag: '럭셔리',
    locationTag: '서울 송파',
    instagramUrl: 'https://www.instagram.com/signiel_hotels/',
  },
  5: {
    styles: ['우아한', '럭셔리'],
    tastes: ['럭셔리 패키지', '와인&샴페인'],
    detailDescription:
      '서울 장충동에 위치한 대표적인 럭셔리 호텔로 객실과 다이닝, 플라워 데코레이션 등을 조합해 특별한 프로포즈를 준비할 수 있습니다.',
    includes: ['호텔 객실', '호텔 다이닝', '샴페인', '플라워 데코'],
    tags: ['신라호텔', '5성급', '장충동', '럭셔리'],
    image: getShopImage(5),
    styleTag: '5성급 호텔',
    moodTag: '우아한',
    locationTag: '서울 중구',
    instagramUrl: 'https://www.instagram.com/theshillaseoul/',
  },
  6: {
    styles: ['럭셔리', '감성적'],
    tastes: ['럭셔리 패키지', '와인&샴페인'],
    detailDescription:
      '남산에 위치한 5성급 호텔로 객실과 레스토랑을 활용해 특별한 날을 계획할 수 있습니다.',
    includes: ['호텔 객실', '호텔 다이닝', '서울 전망', '프로포즈 데코'],
    tags: ['그랜드하얏트', '남산', '호텔', '5성급'],
    image: getShopImage(6),
    styleTag: '호텔 프로포즈',
    moodTag: '럭셔리',
    locationTag: '서울 용산',
    instagramUrl: 'https://www.instagram.com/grandhyattseoul/',
  },
  7: {
    styles: ['모던', '럭셔리'],
    tastes: ['럭셔리 패키지', '미식'],
    detailDescription:
      '한강변에 위치한 호텔로 리버뷰 객실과 호텔 다이닝을 활용해 특별한 하루를 계획하기 좋은 공간입니다.',
    includes: ['리버뷰 객실', '호텔 다이닝', '한강 전망', '객실 데코'],
    tags: ['한강뷰', '리버뷰', '호텔', '프로포즈'],
    image: getShopImage(7),
    styleTag: '리버뷰 호텔',
    moodTag: '감성적',
    locationTag: '서울 마포',
    instagramUrl: 'https://www.instagram.com/hotelnaruseoulmgallery',
  },

  // 🌅 제주 — 프로포즈 / 스냅
  8: {
    styles: ['감성적', '로맨틱'],
    tastes: ['자연 속에서', '사진 촬영'],
    detailDescription:
      '제주의 들판, 비밀스러운 숲, 그리고 노을이 물드는 에메랄드빛 바다를 배경으로 두 분만의 영화 같은 순간을 담아내는 전문 야외 스냅입니다. 제주의 사계절 자연광을 활용해 인위적이지 않고 아늑한 감성을 살려내며, 예비 신부 몰래 감동적인 프로포즈 찰나를 포착하는 데 특화된 스튜디오 상품입니다.',
    includes: ['제주 야외 스팟 촬영', '실시간 프로포즈 연출 스냅', '2인 커플 디렉팅 촬영', '정밀 색감 및 세부 보정본'],
    tags: ['제주스냅', '제주의오후', '노을스냅', '바다프로포즈'],
    image: getShopImage(8),
    styleTag: '제주 야외 스냅',
    moodTag: '감성적',
    locationTag: '제주',
    instagramUrl: 'https://www.instagram.com/ohu_jeju/?hl=ko',
  },
  9: {
    styles: ['감성적', '로맨틱'],
    tastes: ['자연 속에서', '꽃과 장미'],
    detailDescription:
      '제주도에서 호텔, 숙소, 신혼집, 차량 등 다양한 공간을 활용해 프로포즈 이벤트와 공간 데코레이션을 진행합니다.',
    includes: ['공간 데코레이션', '풍선 장식', '꽃 장식', '프로포즈 이벤트'],
    tags: ['제주', '호텔', '프로포즈', '풍선'],
    image: getShopImage(9),
    styleTag: '제주 프로포즈',
    moodTag: '로맨틱',
    locationTag: '제주',
    instagramUrl: 'https://www.instagram.com/partyboo_jeju/',
  },
  10: {
    styles: ['감성적', '모험적'],
    tastes: ['자연 속에서', '사진 촬영'],
    detailDescription:
      '따뜻한 무드와 아날로그 필름의 몽글몽글한 감성을 담아내는 제주 스냅 브랜드입니다. 광치기해변, 사계해안 등 제주의 역동적이고 푸른 바다를 무대로 정형화되지 않은 구도와 영화 포스터 같은 두 사람만의 필름 화보를 완성하는 야외 촬영 서비스입니다.',
    includes: ['제주 해변 및 자연 명소 촬영', '커플 캐주얼/웨딩 스냅', '전문 작가 1:1 맞춤형 디렉팅', '시그니처 아날로그 색감 보정본'],
    tags: ['제주스냅', '레코드필름', '바다스냅', '커플화보'],
    image: getShopImage(10),
    styleTag: '해변 스냅',
    moodTag: '감성적',
    locationTag: '제주',
    instagramUrl: 'https://www.instagram.com/recordfeelm/',
  },

  // 💐 플라워 / 데코
  11: {
    styles: ['로맨틱', '감성적'],
    tastes: ['꽃과 장미', '캔들 무드'],
    detailDescription:
      '서울 및 전국 주요 5성급 호텔과 프라이빗 룸으로 찾아가는 프리미엄 출장 프로포즈 플라워 데코레이션 서비스입니다. 전담 플로럴 디렉터가 1:1 커스텀 상담을 통해 대형 생화 꽃 아치, LED 캔들 로드, 센터피스, 그리고 고백의 순간을 빛낼 대형 장미 꽃다발까지 세련되고 로맨틱한 공간 디자인을 온전히 하루 동안 연출해 드립니다.',
    includes: ['공간 맞춤형 생화 장식', '대형 플라워 아치 및 센터피스', '안전한 은하수 LED 캔들 세팅', '전담 디렉터 현장 출장 설치 및 수거'],
    tags: ['호텔프로포즈', '출장꽃장식', '보우원플라워', '생화데코'],
    image: getShopImage(11),
    styleTag: '플라워 데코',
    moodTag: '로맨틱',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/vowoneflower/',
  },
  12: {
    styles: ['로맨틱', '감성적'],
    tastes: ['꽃과 장미', '풍선 데코'],
    detailDescription: '프로포즈와 이벤트 공간을 꽃과 다양한 소품으로 꾸며 특별한 순간을 연출하는 서비스입니다.',
    includes: ['프로포즈 데코', '플라워 장식', '공간 연출', '맞춤 상담'],
    tags: ['프로포즈', '플라워', '공간연출', '이벤트'],
    image: getShopImage(12),
    styleTag: '공간 데코',
    moodTag: '로맨틱',
    locationTag: '서울 용산',
    instagramUrl: 'https://www.instagram.com/de.mood_seoul/',
  },
  13: {
    styles: ['로맨틱', '감성적'],
    tastes: ['꽃과 장미'],
    detailDescription: '프로포즈 꽃장식과 웨딩 플라워를 비롯해 부케와 공간 플라워를 디자인하는 플라워 스튜디오입니다.',
    includes: ['프로포즈 꽃장식', '생화 플라워', '부케', '공간 장식'],
    tags: ['플라워', '프로포즈', '웨딩', '생화'],
    image: getShopImage(13),
    styleTag: '생화 플라워',
    moodTag: '감성적',
    locationTag: '서울 용산',
    instagramUrl: 'https://www.instagram.com/floblanc_walden/',
  },
  14: {
    styles: ['로맨틱', '깜짝'],
    tastes: ['풍선 데코', '꽃과 장미'],
    detailDescription: '호텔과 공간 프로포즈에 활용할 수 있는 꽃풍선, 레터링풍선, 헬륨풍선 등을 제작하는 이벤트 데코 업체입니다.',
    includes: ['꽃풍선', '헬륨풍선', '레터링풍선', '호텔 배송'],
    tags: ['풍선', '꽃풍선', '호텔', '프로포즈'],
    image: getShopImage(14),
    styleTag: '풍선 데코',
    moodTag: '깜짝',
    locationTag: '경기도 하남',
    instagramUrl: 'https://www.instagram.com/poong_sunny/',
  },
  15: {
    styles: ['감성적', '아늑한'],
    tastes: ['사진 촬영', '꽃과 장미'],
    detailDescription: '호텔이나 신혼집에 사진 모빌, 꽃다발, 포스터, 풍선 등을 활용해 두 사람의 추억을 담은 프로포즈 공간을 연출합니다.',
    includes: ['사진 모빌', '프로포즈 포스터', '꽃다발', '풍선 데코'],
    tags: ['호텔', '신혼집', '사진', '풍선'],
    image: getShopImage(15),
    styleTag: '추억 공간 데코',
    moodTag: '감성적',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/memoryroom.propose/',
  },

  // 📸 프로포즈 / 커플 스냅
  16: {
    styles: ['감성적', '로맨틱'],
    tastes: ['사진 촬영', '자연 속에서'],
    detailDescription:
      '서울의 숲, 공원 등 자연 속 야외 공간이나 프라이빗한 장소에서 진행되는 감성 스냅입니다. 따뜻한 색감으로 예비 신부 몰래 감동적인 프로포즈 순간의 표정과 떨림을 자연스럽게 포착하며, 두 사람의 가장 아름다운 감정의 흐름을 화보처럼 기록하는 전문 작가 동행 서비스입니다.',
    includes: ['서울 야외/실내 맞춤 촬영', '프로포즈 깜짝 이벤트 스냅', '고화질 원본 전체 제공', '정밀 색감 보정본 제공'],
    tags: ['프로포즈스냅', '미상스냅', '커플스냅', '이벤트촬영'],
    image: getShopImage(16),
    styleTag: '프로포즈 스냅',
    moodTag: '감성적',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/__misang_seoul/',
  },
  17: {
    styles: ['감성적', '우아한'],
    tastes: ['사진 촬영'],
    detailDescription: '커플과 웨딩을 중심으로 자연스러운 표정과 순간을 기록하는 스냅 촬영 서비스입니다.',
    includes: ['커플 스냅', '프로포즈 촬영', '사진 보정', '원본 제공'],
    tags: ['스냅', '커플', '웨딩', '프로포즈'],
    image: getShopImage(17),
    styleTag: '커플 스냅',
    moodTag: '감성적',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/posie_snap/',
  },
  18: {
    styles: ['감성적', '모던'],
    tastes: ['사진 촬영', '영상 편지'],
    detailDescription:
      '서울 및 전국 주요 호텔, 레스토랑 프로포즈 현장으로 출장 촬영을 진행하는 전문 프로덕션입니다. 인위적인 연출을 배제하고 감각적인 카메라 무빙과 세련된 모던 색감을 바탕으로, 고백 순간의 생생한 현장 오디오와 떨림을 한 편의 시네마틱 하이라이트 필름과 스냅 사진으로 아카이빙합니다.',
    includes: ['프로포즈 스냅 촬영', '4K 시네마틱 영상 촬영', '현장 오디오 믹싱 하이라이트 영상', '정밀 보정본 및 전체 원본 파일'],
    tags: ['프로포즈영상', '존존픽쳐스', '시네마틱필름', '영상스냅'],
    image: getShopImage(18),
    styleTag: '사진+영상',
    moodTag: '감성적',
    locationTag: '서울/대전/대구/부산',
    instagramUrl: 'https://www.instagram.com/zonzonpictures_official',
  },

  // 🎻 라이브 연주
  19: {
    styles: ['우아한', '감성적'],
    tastes: ['라이브 음악'],
    detailDescription: '웨딩과 이벤트를 위한 전문 연주팀으로 피아노와 현악 등 다양한 구성으로 특별한 순간의 분위기를 만들어줍니다.',
    includes: ['전문 연주팀', '현악 구성', '곡 선곡 상담', '행사 공연'],
    tags: ['현악', '클래식', '웨딩연주', '프로포즈'],
    image: getShopImage(19),
    styleTag: '라이브 연주',
    moodTag: '우아한',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/arte_music_company/',
  },
  20: {
    styles: ['우아한', '감성적'],
    tastes: ['라이브 음악'],
    detailDescription:
      '서울 주요 특급 호텔과 프라이빗 스페이스로 직접 찾아가는 클래식 앙상블 팀입니다. 바이올린, 비올라, 첼로, 피아노의 깊은 선율로 구성된 현악 4중주가 두 사람만의 추억이 깃든 커스텀 곡을 생생한 라이브로 연주하여 프로포즈의 품격을 높여 드립니다.',
    includes: ['전문 연주자 현악 4중주', '식순 맞춤 라이브 연주', '고객 희망 커스텀 곡 조율', '현장 음향 및 동선 체크'],
    tags: ['현악4중주', '라이브연주', '다온음', '호텔프로포즈'],
    image: getShopImage(20),
    styleTag: '현악 4중주',
    moodTag: '우아한',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/daon.eum_official/',
  },

  // 🎆 이벤트
  21: {
    styles: ['깜짝', '모험적'],
    tastes: ['깜짝 이벤트', '자연 속에서'],
    detailDescription:
      '부산 수영만 요트경기장에서 출항하여 광안리 바다 위 최고급 단독 카타마란 요트에서 진행되는 프로포즈 패키지입니다. 광안대교 야경을 배경으로 우리만을 위한 로맨틱한 선상 불꽃놀이 연출, 럭셔리 요트 대관, 전담 디렉팅 서비스를 통해 감동적인 순간을 안전하고 전문적으로 기획해 드립니다.',
    includes: ['럭셔리 카타마란 요트 단독 대관', '프라이빗 해상 불꽃쇼 연출', '선상 프로포즈 데코레이션 및 음향 세팅', '전문 항해사 안전 운항 및 현장 디렉팅'],
    tags: ['부산요트투어', '요트홀릭', '불꽃프로포즈', '광안리요트대관'],
    image: getShopImage(21),
    styleTag: '불꽃 이벤트',
    moodTag: '드라마틱',
    locationTag: '부산',
    instagramUrl: 'https://www.instagram.com/yachtholic/',
  },
  22: {
    styles: ['깜짝', '로맨틱'],
    tastes: ['깜짝 이벤트', '풍선 데코'],
    detailDescription: '호텔, 레스토랑, 야외 등 다양한 장소에서 꽃, 풍선, 영상, 조명 등을 조합해 맞춤형 프로포즈를 기획하는 서비스입니다.',
    includes: ['프로포즈 기획', '공간 데코', '꽃 장식', '영상 연출', '이벤트 진행'],
    tags: ['프로포즈', '맞춤기획', '호텔', '이벤트'],
    image: getShopImage(22),
    styleTag: '맞춤 프로포즈',
    moodTag: '로맨틱',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/doogundoogun/',
  },

  // 💍 프로포즈 링 / 커스텀 주얼리
  23: {
    styles: ['우아한', '럭셔리'],
    tastes: ['럭셔리 패키지', '커플'],
    detailDescription:
      '청담동에 자체 디자인 연구소와 세공 장인 아뜰리에를 직접 운영하는 웨딩 주얼리 브랜드입니다. 오브제, 파노라마 등 독창적인 시그니처 컬렉션을 보유하고 있으며, 개인 맞춤형 세부 조율과 프라이빗 예약 상담을 통해 고객 한 사람만을 위한 주얼리를 제작합니다.',
    includes: ['프라이빗 예약 상담', '시그니처 컬렉션', '맞춤 디자인 조율', '자체 공방 제작'],
    tags: ['바이가미', '청담예물', '웨딩반지', '핸드메이드'],
    image: getShopImage(23),
    styleTag: '시그니처 컬렉션',
    moodTag: '럭셔리',
    locationTag: '서울 청담',
    instagramUrl: 'https://www.instagram.com/bygami_chungdam/',
  },
  24: {
    styles: ['모던', '우아한'],
    tastes: ['커플', '럭셔리 패키지'],
    detailDescription: '웨딩밴드와 프로포즈 링을 비롯한 주얼리를 디자인하고 상담을 통해 커스터마이징할 수 있는 주얼리 브랜드입니다.',
    includes: ['1:1 디자인 상담', '커스텀 제작', '프로포즈 링', '웨딩밴드'],
    tags: ['주얼리', '커스텀', '웨딩밴드', '프로포즈'],
    image: getShopImage(24),
    styleTag: '커스텀 주얼리',
    moodTag: '모던',
    locationTag: '서울 종로',
    instagramUrl: 'https://www.instagram.com/jbuttonjewelry/',
  },
};

// ============================================================
// id가 안 맞을 때 쓰는 카테고리별 기본 장식
// (백엔드 상품 id가 1~24와 다르게 매겨지면 이걸로 자동 fallback)
// ============================================================
export const DEFAULT_DECORATION_BY_CATEGORY: Record<ProductCategory, ProductDecoration> = {
  RING: {
    styles: ['우아한', '럭셔리'],
    tastes: ['커플', '럭셔리 패키지'],
    detailDescription: '두 사람만의 이야기를 담은 특별한 웨딩·프로포즈 주얼리입니다.',
    includes: ['1:1 디자인 상담', '맞춤 제작'],
    tags: ['주얼리', '프로포즈'],
    styleTag: '주얼리',
    moodTag: '우아한',
  },
  EVENT: {
    styles: ['로맨틱', '드라마틱'],
    tastes: ['깜짝 이벤트'],
    detailDescription: '특별한 순간을 위한 공간과 이벤트 연출을 제공합니다.',
    includes: ['공간 데코레이션', '이벤트 연출'],
    tags: ['이벤트', '공간'],
    styleTag: '이벤트/공간',
    moodTag: '로맨틱',
  },
  FLOWER: {
    styles: ['로맨틱', '감성적'],
    tastes: ['꽃과 장미'],
    detailDescription: '꽃과 다양한 소품으로 완성하는 로맨틱한 프로포즈 공간 연출입니다.',
    includes: ['생화 장식', '공간 데코'],
    tags: ['플라워', '데코'],
    styleTag: '플라워',
    moodTag: '로맨틱',
  },
  PHOTO: {
    styles: ['감성적', '모던'],
    tastes: ['사진 촬영'],
    detailDescription: '프로포즈의 설렘을 자연스럽게 기록하는 사진·영상 촬영 서비스입니다.',
    includes: ['맞춤 촬영', '보정본 제공'],
    tags: ['사진', '영상'],
    styleTag: '사진/영상',
    moodTag: '감성적',
  },
  LETTER: {
    styles: ['감성적', '아늑한'],
    tastes: ['영상 편지'],
    detailDescription: '진심을 담은 편지와 영상으로 특별한 순간을 전합니다.',
    includes: ['맞춤 제작'],
    tags: ['편지', '레터'],
    styleTag: '편지/레터',
    moodTag: '감성적',
  },
  ETC: {
    styles: ['우아한', '감성적'],
    tastes: ['라이브 음악'],
    detailDescription: '프로포즈 순간을 더 특별하게 만들어줄 다양한 부가 서비스입니다.',
    includes: ['맞춤 상담'],
    tags: ['기타'],
    styleTag: '기타',
    moodTag: '우아한',
  },
};

// 카테고리 enum → 한글 라벨 (CategoryFilter, groupByCategory 등에서 사용)
export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  RING: '주얼리',
  EVENT: '이벤트/공간',
  FLOWER: '플라워',
  PHOTO: '사진/영상',
  LETTER: '편지/레터',
  ETC: '기타',
};