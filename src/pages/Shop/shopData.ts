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
}

export const PRODUCTS: Product[] = [
  // ============================================================
  // 🍽️ 장소 — 프라이빗 다이닝 / 레스토랑
  // ============================================================
  {
    id: 1,
    category: '🍽️ 장소',
    categoryType: '장소',
    styles: ['로맨틱', '우아한'],
    tastes: ['와인&샴페인', '미식'],
    title: '더 리버 르다 프라이빗 다이닝',
    description: '한강과 서울 야경을 바라보며 즐기는 우리만의 프라이빗 프로포즈',
    detailDescription:
      '호텔 및 프라이빗 공간을 활용해 특별한 날을 위한 디너와 프로포즈 연출을 함께 준비할 수 있는 프로포즈 전문 서비스입니다.',
    includes: ['프라이빗 공간', '프로포즈 데코레이션', '디너', '꽃 장식', '이벤트 연출'],
    tags: ['한강뷰', '프라이빗다이닝', '르다프로포즈', '파인다이닝'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Elegant%20private%20dining%20room%20with%20floor%20to%20ceiling%20windows%20overlooking%20Han%20River%20night%20cityscape%2C%20intimate%20table%20for%20two%20with%20white%20linen%20and%20candles%2C%20warm%20golden%20ambient%20lighting%2C%20rose%20petals%20scattered%20on%20marble%20floor%2C%20romantic%20luxurious%20atmosphere%2C%20editorial%20interior%20photography%20in%20cream%20and%20champagne%20tones&width=800&height=600&seq=propose-dining-01&orientation=landscape',
    styleTag: '프라이빗 다이닝',
    moodTag: '로맨틱',
    locationTag: '서울 반포',
    instagramUrl: 'https://www.instagram.com/leda_theriver/',
  },
  {
    id: 2,
    category: '🍽️ 장소',
    categoryType: '장소',
    styles: ['우아한', '럭셔리'],
    tastes: ['미식', '와인&샴페인'],
    title: '파크 하얏트 서울 코너스톤',
    description: '고급 호텔 다이닝에서 즐기는 품격 있는 프로포즈',
    detailDescription:
      '파크 하얏트 서울의 이탈리안 레스토랑 코너스톤에서 특별한 날을 위한 다이닝을 즐길 수 있습니다.',
    includes: ['호텔 다이닝', '코스 메뉴', '와인 페어링', '프라이빗 다이닝'],
    tags: ['호텔', '이탈리안', '다이닝', '강남'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Elegant%20five%20star%20hotel%20Italian%20restaurant%20interior%20with%20warm%20ambient%20lighting%2C%20luxurious%20dining%20table%20for%20two%20with%20white%20linen%20and%20crystal%20glassware%2C%20sophisticated%20fine%20dining%20atmosphere%20in%20cream%20and%20gold%20tones%2C%20editorial%20interior%20photography&width=800&height=600&seq=propose-dining-02&orientation=landscape',
    styleTag: '호텔 다이닝',
    moodTag: '럭셔리',
    locationTag: '서울 강남',
    instagramUrl: 'https://www.instagram.com/parkhyattseoul',
  },
  {
    id: 3,
    category: '🍽️ 장소',
    categoryType: '장소',
    styles: ['감성적', '아늑한'],
    tastes: ['미식', '와인&샴페인'],
    title: '아이오유 프라이빗 룸 다이닝',
    description: '둘만의 공간에서 오롯이 서로에게 집중하는 특별한 저녁',
    detailDescription:
      '용산구 원효로 오르막길 꼭대기에 위치하여 압도적인 밤섬 한강뷰를 자랑하는 이탈리안 레스토랑입니다. 주택을 개조한 특유의 아늑한 분위기 속에서 단독 프라이빗 룸과 상주 플로리스트의 맞춤형 프로포즈 연출을 이용할 수 있는 프리미엄 공간형 상품입니다.',
    includes: ['프라이빗 단독룸', '셰프 전용 코스요리', '글라스/보틀 와인', '플로리스트 생화 데코레이션'],
    tags: ['프라이빗룸', '코스요리', '한강뷰레스토랑', '아이오유'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Cozy%20private%20dining%20room%20in%20converted%20house%20with%20intimate%20table%20setting%2C%20warm%20candlelight%20glow%2C%20Han%20River%20night%20view%20through%20large%20windows%2C%20rustic%20elegant%20Italian%20restaurant%20atmosphere%2C%20editorial%20photography%20with%20soft%20natural%20lighting&width=800&height=600&seq=propose-dining-03&orientation=landscape',
    styleTag: '프라이빗룸',
    moodTag: '아늑한',
    locationTag: '서울 용산',
    instagramUrl: 'https://www.instagram.com/restaurant_iou/',
  },

  // ============================================================
  // 🏨 장소 — 5성급 호텔
  // ============================================================

  {
    id: 4,
    category: '🏨 장소',
    categoryType: '장소',
    styles: ['럭셔리', '우아한'],
    tastes: ['럭셔리 패키지', '와인&샴페인'],
    title: '시그니엘 서울',
    description: '서울의 야경을 한눈에 담으며 즐기는 럭셔리 프로포즈',
    detailDescription:
      '롯데월드타워 최상층에 위치한 럭셔리 호텔로 서울 도심의 파노라마 전망과 함께 특별한 하루를 계획할 수 있습니다.',
    includes: ['럭셔리 객실', '서울 야경', '호텔 다이닝', '객실 데코레이션'],
    tags: ['시그니엘', '서울야경', '호텔', '럭셔리'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Luxury%20hotel%20suite%20with%20panoramic%20Seoul%20city%20night%20view%20through%20floor%20to%20ceiling%20windows%2C%20elegant%20bedroom%20with%20rose%20petals%20and%20champagne%2C%20warm%20golden%20lighting%2C%20sophisticated%20interior%2C%20editorial%20photography&width=800&height=600&seq=propose-hotel-01&orientation=landscape',
    styleTag: '럭셔리 호텔',
    moodTag: '럭셔리',
    locationTag: '서울 송파',
    instagramUrl: 'https://www.instagram.com/signiel_hotels/',
  },
  {
    id: 5,
    category: '🏨 장소',
    categoryType: '장소',
    styles: ['우아한', '럭셔리'],
    tastes: ['럭셔리 패키지', '와인&샴페인'],
    title: '서울 신라 호텔',
    description: '클래식한 분위기의 5성급 호텔에서 준비하는 프로포즈',
    detailDescription:
      '서울 장충동에 위치한 대표적인 럭셔리 호텔로 객실과 다이닝, 플라워 데코레이션 등을 조합해 특별한 프로포즈를 준비할 수 있습니다.',
    includes: ['호텔 객실', '호텔 다이닝', '샴페인', '플라워 데코'],
    tags: ['신라호텔', '5성급', '장충동', '럭셔리'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Classic%20five%20star%20luxury%20hotel%20lobby%20and%20suite%20with%20elegant%20chandelier%2C%20traditional%20Korean%20aesthetic%20blended%20with%20modern%20luxury%2C%20warm%20cream%20and%20gold%20interior%2C%20sophisticated%20editorial%20photography&width=800&height=600&seq=propose-hotel-02&orientation=landscape',
    styleTag: '5성급 호텔',
    moodTag: '우아한',
    locationTag: '서울 중구',
    instagramUrl: 'https://www.instagram.com/theshillaseoul/',
  },
  {
    id: 6,
    category: '🏨 장소',
    categoryType: '장소',
    styles: ['럭셔리', '감성적'],
    tastes: ['럭셔리 패키지', '와인&샴페인'],
    title: '그랜드 하얏트 서울',
    description: '남산과 서울 도심의 야경을 배경으로 하는 호텔 프로포즈',
    detailDescription:
      '남산에 위치한 5성급 호텔로 객실과 레스토랑을 활용해 특별한 날을 계획할 수 있습니다.',
    includes: ['호텔 객실', '호텔 다이닝', '서울 전망', '프로포즈 데코'],
    tags: ['그랜드하얏트', '남산', '호텔', '5성급'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Grand%20luxury%20hotel%20with%20Namsan%20tower%20view%20in%20background%2C%20elegant%20suite%20room%20with%20modern%20furnishings%2C%20warm%20neutral%20tones%2C%20floor%20to%20ceiling%20windows%2C%20sophisticated%20editorial%20hotel%20photography&width=800&height=600&seq=propose-hotel-03&orientation=landscape',
    styleTag: '호텔 프로포즈',
    moodTag: '럭셔리',
    locationTag: '서울 용산',
    instagramUrl: 'https://www.instagram.com/grandhyattseoul/',
  },
  {
    id: 7,
    category: '🏨 장소',
    categoryType: '장소',
    styles: ['모던', '럭셔리'],
    tastes: ['럭셔리 패키지', '미식'],
    title: '호텔 나루 서울 엠갤러리',
    description: '한강과 서울 도심을 바라보며 즐기는 감성적인 호텔 프로포즈',
    detailDescription:
      '한강변에 위치한 호텔로 리버뷰 객실과 호텔 다이닝을 활용해 특별한 하루를 계획하기 좋은 공간입니다.',
    includes: ['리버뷰 객실', '호텔 다이닝', '한강 전망', '객실 데코'],
    tags: ['한강뷰', '리버뷰', '호텔', '프로포즈'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Modern%20boutique%20hotel%20room%20with%20Han%20River%20view%20through%20large%20windows%2C%20contemporary%20elegant%20interior%20design%2C%20soft%20natural%20daylight%2C%20minimalist%20luxury%20aesthetic%2C%20editorial%20photography&width=800&height=600&seq=propose-hotel-04&orientation=landscape',
    styleTag: '리버뷰 호텔',
    moodTag: '감성적',
    locationTag: '서울 마포',
    instagramUrl: 'https://www.instagram.com/hotelnaruseoulmgallery',
  },

  // ============================================================
  // 🌅 제주 — 프로포즈 / 스냅
  // ============================================================

  {
    id: 8,
    category: '🌅 장소',
    categoryType: '장소',
    styles: ['감성적', '모험적'],
    tastes: ['자연 속에서', '사진 촬영'],
    title: '제주의오후 감성 노을 스냅',
    description: '제주의 바다와 노을을 배경으로 남기는 특별한 순간',
    detailDescription:
      '제주의 들판, 비밀스러운 숲, 그리고 노을이 물드는 에메랄드빛 바다를 배경으로 두 분만의 영화 같은 순간을 담아내는 전문 야외 스냅입니다. 제주의 사계절 자연광을 활용해 인위적이지 않고 아늑한 감성을 살려내며, 예비 신부 몰래 감동적인 프로포즈 찰나를 포착하는 데 특화된 스튜디오 상품입니다.',
    includes: ['제주 야외 스팟 촬영', '실시간 프로포즈 연출 스냅', '2인 커플 디렉팅 촬영', '정밀 색감 및 세부 보정본'],
    tags: ['제주스냅', '제주의오후', '노을스냅', '바다프로포즈'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Jeju%20island%20golden%20sunset%20over%20emerald%20ocean%20with%20couple%20silhouette%20on%20black%20sand%20beach%2C%20dramatic%20orange%20and%20pink%20sky%2C%20natural%20warm%20light%2C%20romantic%20serene%20atmosphere%2C%20editorial%20landscape%20photography&width=800&height=600&seq=propose-jeju-01&orientation=landscape',
    styleTag: '제주 야외 스냅',
    moodTag: '감성적',
    locationTag: '제주',
    instagramUrl: 'https://www.instagram.com/ohu_jeju/?hl=ko',
  },
  {
    id: 9,
    category: '🌅 장소',
    categoryType: '장소',
    styles: ['감성적', '로맨틱'],
    tastes: ['자연 속에서', '꽃과 장미'],
    title: '파티부 제주 프로포즈',
    description: '제주의 호텔과 프라이빗 공간을 로맨틱하게 꾸미는 프로포즈',
    detailDescription:
      '제주도에서 호텔, 숙소, 신혼집, 차량 등 다양한 공간을 활용해 프로포즈 이벤트와 공간 데코레이션을 진행합니다.',
    includes: ['공간 데코레이션', '풍선 장식', '꽃 장식', '프로포즈 이벤트'],
    tags: ['제주', '호텔', '프로포즈', '풍선'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Romantic%20proposal%20decoration%20in%20Jeju%20hotel%20room%20with%20balloons%20flowers%20and%20fairy%20lights%2C%20warm%20cozy%20atmosphere%2C%20pastel%20pink%20and%20white%20decor%2C%20editorial%20lifestyle%20photography&width=800&height=600&seq=propose-jeju-02&orientation=landscape',
    styleTag: '제주 프로포즈',
    moodTag: '로맨틱',
    locationTag: '제주',
    instagramUrl: 'https://www.instagram.com/partyboo_jeju/',
  },
  {
    id: 10,
    category: '🌅 장소',
    categoryType: '장소',
    styles: ['감성적', '모험적'],
    tastes: ['자연 속에서', '사진 촬영'],
    title: '레코드필름 제주 바다 커플 스냅',
    description: '푸른 제주 바다를 배경으로 자연스러운 커플 사진을 남겨보세요',
    detailDescription:
      '따뜻한 무드와 아날로그 필름의 몽글몽글한 감성을 담아내는 제주 스냅 브랜드입니다. 광치기해변, 사계해안 등 제주의 역동적이고 푸른 바다를 무대로 정형화되지 않은 구도와 영화 포스터 같은 두 사람만의 필름 화보를 완성하는 야외 촬영 서비스입니다.',
    includes: ['제주 해변 및 자연 명소 촬영', '커플 캐주얼/웨딩 스냅', '전문 작가 1:1 맞춤형 디렉팅', '시그니처 아날로그 색감 보정본'],
    tags: ['제주스냅', '레코드필름', '바다스냅', '커플화보'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Couple%20photography%20session%20on%20Jeju%20Gwakji%20beach%20with%20turquoise%20ocean%20waves%2C%20film%20camera%20aesthetic%20with%20warm%20analog%20color%20grading%2C%20natural%20casual%20pose%20with%20windy%20hair%2C%20editorial%20lifestyle%20photography&width=800&height=600&seq=propose-jeju-03&orientation=landscape',
    styleTag: '해변 스냅',
    moodTag: '감성적',
    locationTag: '제주',
    instagramUrl: 'https://www.instagram.com/recordfeelm/',
  },

  // ============================================================
  // 💐 플라워 / 데코
  // ============================================================

  {
    id: 11,
    category: '💐 서비스',
    categoryType: 'services',
    styles: ['로맨틱', '감성적'],
    tastes: ['꽃과 장미', '캔들 무드'],
    title: '보우원플라워 프로포즈 데코',
    description: '꽃과 캔들로 완성하는 로맨틱한 프로포즈 공간',
    detailDescription:
      '서울 및 전국 주요 5성급 호텔과 프라이빗 룸으로 찾아가는 프리미엄 출장 프로포즈 플라워 데코레이션 서비스입니다. 전담 플로럴 디렉터가 1:1 커스텀 상담을 통해 대형 생화 꽃 아치, LED 캔들 로드, 센터피스, 그리고 고백의 순간을 빛낼 대형 장미 꽃다발까지 세련되고 로맨틱한 공간 디자인을 온전히 하루 동안 연출해 드립니다.',
    includes: ['공간 맞춤형 생화 장식', '대형 플라워 아치 및 센터피스', '안전한 은하수 LED 캔들 세팅', '전담 디렉터 현장 출장 설치 및 수거'],
    tags: ['호텔프로포즈', '출장꽃장식', '보우원플라워', '생화데코'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Luxurious%20hotel%20room%20proposal%20decoration%20with%20large%20fresh%20flower%20arch%20hundreds%20of%20pink%20and%20white%20roses%2C%20LED%20candle%20pathway%20on%20floor%2C%20romantic%20warm%20ambient%20lighting%2C%20editorial%20interior%20photography%20in%20cream%20tones&width=800&height=600&seq=propose-flower-01&orientation=landscape',
    styleTag: '플라워 데코',
    moodTag: '로맨틱',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/vowoneflower/',
  },
  {
    id: 12,
    category: '💐 서비스',
    categoryType: '서비스',
    styles: ['로맨틱', '감성적'],
    tastes: ['꽃과 장미', '풍선 데코'],
    title: 'DE mood Seoul',
    description: '꽃과 공간 연출을 결합한 감성적인 프로포즈 데코',
    detailDescription:
      '프로포즈와 이벤트 공간을 꽃과 다양한 소품으로 꾸며 특별한 순간을 연출하는 서비스입니다.',
    includes: ['프로포즈 데코', '플라워 장식', '공간 연출', '맞춤 상담'],
    tags: ['프로포즈', '플라워', '공간연출', '이벤트'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Elegant%20proposal%20space%20decoration%20with%20seasonal%20flowers%20candles%20and%20romantic%20lighting%2C%20intimate%20indoor%20setting%20with%20soft%20warm%20tones%2C%20floral%20arrangement%20centerpiece%2C%20editorial%20photography&width=800&height=600&seq=propose-flower-02&orientation=landscape',
    styleTag: '공간 데코',
    moodTag: '로맨틱',
    locationTag: '서울 용산',
    instagramUrl: 'https://www.instagram.com/de.mood_seoul/',
  },
  {
    id: 13,
    category: '💐 서비스',
    categoryType: '서비스',
    styles: ['로맨틱', '감성적'],
    tastes: ['꽃과 장미'],
    title: '플로블랑',
    description: '프로포즈와 웨딩을 위한 감성적인 플라워 디자인',
    detailDescription:
      '프로포즈 꽃장식과 웨딩 플라워를 비롯해 부케와 공간 플라워를 디자인하는 플라워 스튜디오입니다.',
    includes: ['프로포즈 꽃장식', '생화 플라워', '부케', '공간 장식'],
    tags: ['플라워', '프로포즈', '웨딩', '생화'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Beautiful%20floral%20studio%20with%20fresh%20seasonal%20flowers%20bouquets%20and%20arrangements%2C%20elegant%20white%20and%20green%20aesthetic%2C%20natural%20soft%20lighting%2C%20wedding%20and%20proposal%20flower%20design%2C%20editorial%20photography&width=800&height=600&seq=propose-flower-03&orientation=landscape',
    styleTag: '생화 플라워',
    moodTag: '감성적',
    locationTag: '서울 용산',
    instagramUrl: 'https://www.instagram.com/floblanc_walden/',
  },
  {
    id: 14,
    category: '💐 서비스',
    categoryType: '서비스',
    styles: ['로맨틱', '깜짝'],
    tastes: ['풍선 데코', '꽃과 장미'],
    title: '풍써니',
    description: '호텔 프로포즈를 위한 꽃풍선과 헬륨풍선 데코',
    detailDescription:
      '호텔과 공간 프로포즈에 활용할 수 있는 꽃풍선, 레터링풍선, 헬륨풍선 등을 제작하는 이벤트 데코 업체입니다.',
    includes: ['꽃풍선', '헬륨풍선', '레터링풍선', '호텔 배송'],
    tags: ['풍선', '꽃풍선', '호텔', '프로포즈'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Colorful%20helium%20balloons%20and%20flower%20balloon%20arrangement%20for%20proposal%20decoration%2C%20pastel%20pink%20white%20and%20gold%20balloons%20with%20fresh%20roses%2C%20festive%20romantic%20atmosphere%2C%20editorial%20photography&width=800&height=600&seq=propose-flower-04&orientation=landscape',
    styleTag: '풍선 데코',
    moodTag: '깜짝',
    locationTag: '경기도 하남',
    instagramUrl: 'https://www.instagram.com/poong_sunny/',
  },
  {
    id: 15,
    category: '💐 서비스',
    categoryType: '서비스',
    styles: ['감성적', '아늑한'],
    tastes: ['사진 촬영', '꽃과 장미'],
    title: '추억룸',
    description: '사진과 꽃으로 두 사람만의 추억 공간을 만드는 프로포즈',
    detailDescription:
      '호텔이나 신혼집에 사진 모빌, 꽃다발, 포스터, 풍선 등을 활용해 두 사람의 추억을 담은 프로포즈 공간을 연출합니다.',
    includes: ['사진 모빌', '프로포즈 포스터', '꽃다발', '풍선 데코'],
    tags: ['호텔', '신혼집', '사진', '풍선'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Romantic%20memory%20room%20proposal%20setup%20with%20photo%20mobile%20hanging%20from%20ceiling%2C%20fresh%20flower%20bouquet%2C%20balloons%20and%20fairy%20lights%2C%20warm%20intimate%20atmosphere%2C%20editorial%20lifestyle%20photography&width=800&height=600&seq=propose-flower-05&orientation=landscape',
    styleTag: '추억 공간 데코',
    moodTag: '감성적',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/memoryroom.propose/',
  },

  // ============================================================
  // 📸 프로포즈 / 커플 스냅
  // ============================================================

  {
    id: 16,
    category: '📸 서비스',
    categoryType: '서비스',
    styles: ['감성적', '아늑한'],
    tastes: ['사진 촬영', '자연 속에서'],
    title: '미상스냅',
    description: '프로포즈의 설렘과 감동을 자연스럽게 기록하는 스냅 촬영',
    detailDescription:
      '서울의 숲, 공원 등 자연 속 야외 공간이나 프라이빗한 장소에서 진행되는 감성 스냅입니다. 따뜻한 색감으로 예비 신부 몰래 감동적인 프로포즈 순간의 표정과 떨림을 자연스럽게 포착하며, 두 사람의 가장 아름다운 감정의 흐름을 화보처럼 기록하는 전문 작가 동행 서비스입니다.',
    includes: ['서울 야외/실내 맞춤 촬영', '프로포즈 깜짝 이벤트 스냅', '고화질 원본 전체 제공', '정밀 색감 보정본 제공'],
    tags: ['프로포즈스냅', '미상스냅', '커플스냅', '이벤트촬영'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Professional%20photographer%20capturing%20romantic%20proposal%20moment%20with%20couple%20embracing%2C%20soft%20golden%20hour%20lighting%2C%20candid%20emotional%20scene%2C%20beautiful%20outdoor%20setting%20with%20bokeh%20background%2C%20editorial%20photography%20style&width=800&height=600&seq=propose-photo-01&orientation=landscape',
    styleTag: '프로포즈 스냅',
    moodTag: '감성적',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/__misang_seoul/',
  },
  {
    id: 17,
    category: '📸 서비스',
    categoryType: '서비스',
    styles: ['감성적', '우아한'],
    tastes: ['사진 촬영'],
    title: '포지스냅',
    description: '자연스러운 순간을 화보처럼 남기는 웨딩·커플 스냅',
    detailDescription:
      '커플과 웨딩을 중심으로 자연스러운 표정과 순간을 기록하는 스냅 촬영 서비스입니다.',
    includes: ['커플 스냅', '프로포즈 촬영', '사진 보정', '원본 제공'],
    tags: ['스냅', '커플', '웨딩', '프로포즈'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Natural%20couple%20snap%20photography%20session%20in%20soft%20golden%20hour%20light%2C%20elegant%20couple%20in%20casual%20attire%20embracing%20outdoors%2C%20warm%20romantic%20bokeh%20background%2C%20editorial%20wedding%20photography&width=800&height=600&seq=propose-photo-02&orientation=landscape',
    styleTag: '커플 스냅',
    moodTag: '감성적',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/posie_snap/',
  },
  {
    id: 18,
    category: '📸 서비스',
    categoryType: '서비스',
    styles: ['감성적', '모던'],
    tastes: ['사진 촬영', '영상 편지'],
    title: '존존픽쳐스 시네마틱 영상 스냅',
    description: '사진과 영상으로 프로포즈의 모든 순간을 기록',
    detailDescription:
      '서울 및 전국 주요 호텔, 레스토랑 프로포즈 현장으로 출장 촬영을 진행하는 전문 프로덕션입니다. 인위적인 연출을 배제하고 감각적인 카메라 무빙과 세련된 모던 색감을 바탕으로, 고백 순간의 생생한 현장 오디오와 떨림을 한 편의 시네마틱 하하이라이트 필름과 스냅 사진으로 아카이빙합니다.',
    includes: ['프로포즈 스냅 촬영', '4K 시네마틱 영상 촬영', '현장 오디오 믹싱 하이라이트 영상', '정밀 보정본 및 전체 원본 파일'],
    tags: ['프로포즈영상', '존존픽쳐스', '시네마틱필름', '영상스냅'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Cinematic%20wedding%20videographer%20filming%20proposal%20moment%20with%20professional%20camera%20equipment%2C%20dramatic%20soft%20lighting%2C%20modern%20aesthetic%20with%20warm%20color%20grading%2C%20editorial%20filmmaking%20photography&width=800&height=600&seq=propose-photo-03&orientation=landscape',
    styleTag: '사진+영상',
    moodTag: '감성적',
    locationTag: '서울/대전/대구/부산',
    instagramUrl: 'https://www.instagram.com/zonzonpictures_official',
  },

  // ============================================================
  // 🎻 라이브 연주
  // ============================================================

  {
    id: 19,
    category: '🎻 경험',
    categoryType: '경험',
    styles: ['우아한', '감성적'],
    tastes: ['라이브 음악'],
    title: '아르떼뮤직 웨딩·이벤트 연주',
    description: '프로포즈 순간을 위한 클래식 라이브 연주',
    detailDescription:
      '웨딩과 이벤트를 위한 전문 연주팀으로 피아노와 현악 등 다양한 구성으로 특별한 순간의 분위기를 만들어줍니다.',
    includes: ['전문 연주팀', '현악 구성', '곡 선곡 상담', '행사 공연'],
    tags: ['현악', '클래식', '웨딩연주', '프로포즈'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Elegant%20piano%20and%20string%20ensemble%20performing%20at%20wedding%20event%2C%20musicians%20in%20formal%20black%20attire%2C%20warm%20soft%20stage%20lighting%2C%20romantic%20classical%20music%20atmosphere%2C%20editorial%20performance%20photography&width=800&height=600&seq=propose-music-01&orientation=landscape',
    styleTag: '라이브 연주',
    moodTag: '우아한',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/arte_music_company/',
  },
  {
    id: 20,
    category: '🎻 경험',
    categoryType: '경험',
    styles: ['우아한', '감성적'],
    tastes: ['라이브 음악'],
    title: '다온음 프로포즈 현악 4중주',
    description: '프로포즈 순간에 맞춰 원하는 곡을 라이브로 연주',
    detailDescription:
      '서울 주요 특급 호텔과 프라이빗 스페이스로 직접 찾아가는 클래식 앙상블 팀입니다. 바이올린, 비올라, 첼로, 피아노의 깊은 선율로 구성된 현악 4중주가 두 사람만의 추억이 깃든 커스텀 곡을 생생한 라이브로 연주하여 프로포즈의 품격을 높여 드립니다.',
    includes: ['전문 연주자 현악 4중주', '식순 맞춤 라이브 연주', '고객 희망 커스텀 곡 조율', '현장 음향 및 동선 체크'],
    tags: ['현악4중주', '라이브연주', '다온음', '호텔프로포즈'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Professional%20string%20quartet%20of%20four%20musicians%20in%20formal%20black%20attire%20performing%20in%20an%20elegant%20private%20hotel%20ballroom%2C%20two%20violins%20one%20viola%20and%20one%20cello%2C%20classical%20ensemble%20arrangement%2C%20soft%20warm%20chandelier%20lighting%2C%20romantic%20sophisticated%20atmosphere%2C%20editorial%20music%20performance%20photography&width=800&height=600&seq=propose-music-02&orientation=landscape',
    styleTag: '현악 4중주',
    moodTag: '우아한',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/daon.eum_official/',
  },

  // ============================================================
  // 🎆 이벤트
  // ============================================================
  
  {
    id: 21,
    category: '🎆 경험',
    categoryType: '경험',
    styles: ['깜짝', '모험적'],
    tastes: ['깜짝 이벤트', '자연 속에서'],
    title: '요트홀릭 프라이빗 요트 패키지',
    description: '밤하늘을 배경으로 펼치는 드라마틱한 프로포즈',
    detailDescription:
      '부산 수영만 요트경기장에서 출항하여 광안리 바다 위 최고급 단독 카타마란 요트에서 진행되는 프로포즈 패키지입니다. 광안대교 야경을 배경으로 우리만을 위한 로맨틱한 선상 불꽃놀이 연출, 럭셔리 요트 대관, 전담 디렉팅 서비스를 통해 감동적인 순간을 안전하고 전문적으로 기획해 드립니다.',
    includes: ['럭셔리 카타마란 요트 단독 대관', '프라이빗 해상 불꽃쇼 연출', '선상 프로포즈 데코레이션 및 음향 세팅', '전문 항해사 안전 운항 및 현장 디렉팅'],
    tags: ['부산요트투어', '요트홀릭', '불꽃프로포즈', '광안리요트대관'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Romantic%20couple%20on%20a%20luxury%20yacht%20deck%20at%20night%20with%20spectacular%20fireworks%20exploding%20in%20the%20sky%20above%20Gwangalli%20Beach%20Busan%2C%20city%20lights%20and%20Gwangan%20Bridge%20illuminated%20in%20the%20background%20reflecting%20on%20dark%20ocean%20water%2C%20dramatic%20romantic%20atmosphere%2C%20editorial%20night%20photography%20with%20vibrant%20contrast&width=800&height=600&seq=propose-event-01&orientation=landscape',
    styleTag: '불꽃 이벤트',
    moodTag: '드라마틱',
    locationTag: '부산',
    instagramUrl: 'https://www.instagram.com/yachtholic/',
  },
  {
    id: 22,
    category: '🎆 경험',
    categoryType: '경험',
    styles: ['깜짝', '로맨틱'],
    tastes: ['깜짝 이벤트', '풍선 데코'],
    title: '두근두근 맞춤 프로포즈',
    description: '두 사람의 이야기를 담아 하나뿐인 프로포즈를 기획',
    detailDescription:
      '호텔, 레스토랑, 야외 등 다양한 장소에서 꽃, 풍선, 영상, 조명 등을 조합해 맞춤형 프로포즈를 기획하는 서비스입니다.',
    includes: ['프로포즈 기획', '공간 데코', '꽃 장식', '영상 연출', '이벤트 진행'],
    tags: ['프로포즈', '맞춤기획', '호텔', '이벤트'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Custom%20proposal%20planning%20consultation%20with%20mood%20board%20and%20decoration%20samples%20on%20table%2C%20warm%20creative%20workspace%20with%20flower%20samples%20candle%20and%20fabric%20swatches%2C%20editorial%20lifestyle%20photography&width=800&height=600&seq=propose-event-03&orientation=landscape',
    styleTag: '맞춤 프로포즈',
    moodTag: '로맨틱',
    locationTag: '서울',
    instagramUrl: 'https://www.instagram.com/doogundoogun/',
  },

  // ============================================================
  // 💍 프로포즈 링 / 커스텀 주얼리
  // ============================================================

  {
    id: 23,
    category: '💍 선물',
    categoryType: '선물',
    styles: ['우아한', '럭셔리'],
    tastes: ['럭셔리 패키지', '커플'],
    title: '바이가미 청담 웨딩 주얼리',
    description: '청담동 자체 아뜰리에에서 완성하는 나만을 위한 웨딩 주얼리',
    detailDescription:
      '청담동에 자체 디자인 연구소와 세공 장인 아뜰리에를 직접 운영하는 웨딩 주얼리 브랜드입니다. 오브제, 파노라마 등 독창적인 시그니처 컬렉션을 보유하고 있으며, 개인 맞춤형 세부 조율과 프라이빗 예약 상담을 통해 고객 한 사람만을 위한 주얼리를 제작합니다.',
    includes: ['프라이빗 예약 상담', '시그니처 컬렉션', '맞춤 디자인 조율', '자체 공방 제작'],
    tags: ['바이가미', '청담예물', '웨딩반지', '핸드메이드'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Luxurious%20diamond%20engagement%20ring%20and%20wedding%20band%20set%20displayed%20elegantly%20on%20a%20cream%20silk%20fabric%20in%20a%20Cheongdam%20Seoul%20jewelry%20atelier%2C%20soft%20natural%20daylight%20through%20large%20windows%2C%20sparkling%20brilliant%20cut%20diamonds%20on%20platinum%20band%2C%20luxurious%20sophisticated%20setting%2C%20editorial%20jewelry%20photography%20with%20warm%20neutral%20palette&width=800&height=600&seq=propose-jewelry-01&orientation=landscape',
    styleTag: '시그니처 컬렉션',
    moodTag: '럭셔리',
    locationTag: '서울 청담',
    instagramUrl: 'https://www.instagram.com/bygami_chungdam/',
  },
  {
    id: 24,
    category: '💍 선물',
    categoryType: '선물',
    styles: ['모던', '우아한'],
    tastes: ['커플', '럭셔리 패키지'],
    title: '제이버튼 주얼리',
    description: '두 사람만의 이야기를 담은 맞춤 웨딩·프로포즈 주얼리',
    detailDescription:
      '웨딩밴드와 프로포즈 링을 비롯한 주얼리를 디자인하고 상담을 통해 커스터마이징할 수 있는 주얼리 브랜드입니다.',
    includes: ['1:1 디자인 상담', '커스텀 제작', '프로포즈 링', '웨딩밴드'],
    tags: ['주얼리', '커스텀', '웨딩밴드', '프로포즈'],
    price: '가격 문의',
    image: 'https://readdy.ai/api/search-image?query=Custom%20designed%20modern%20wedding%20bands%20pair%20displayed%20on%20a%20minimalist%20concrete%20surface%20with%20soft%20natural%20lighting%2C%20sleek%20contemporary%20ring%20design%20with%20brushed%20matte%20gold%20finish%20and%20small%20accent%20diamonds%2C%20elegant%20simple%20aesthetic%2C%20modern%20luxury%20minimalist%20style%2C%20editorial%20jewelry%20photography%20with%20clean%20cream%20background&width=800&height=600&seq=propose-jewelry-02&orientation=landscape',
    styleTag: '커스텀 주얼리',
    moodTag: '모던',
    locationTag: '서울 종로',
    instagramUrl: 'https://www.instagram.com/jbuttonjewelry/',
  },
]