// 상품 이미지를 src/assets/wedding-shop/{id}.jpg 로 저장 후 id로 자동 매핑
const lookbookImageModules = import.meta.glob<{ default: string }>('../../assets/wedding-shop/*.jpg', { eager: true });
const getLookbookImage = (id: number): string => lookbookImageModules[`../../assets/wedding-shop/${id}.jpg`]?.default ?? '';

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  discountPrice: number | null;
  imageUrl: string;
  description: string;
  instagramUrl: string | null;
  address: string | null;
}

export interface Category {
  id: number;
  name: string;
}

export const CATEGORIES: Category[] = [
  { id: 1, name: '웨딩홀' },
  { id: 2, name: '스튜디오' },
  { id: 3, name: '드레스' },
  { id: 4, name: '메이크업' },
  { id: 5, name: '허니문' },
  { id: 6, name: '웨딩카' },
  { id: 7, name: '플래너' },
  { id: 8, name: '장소' },
  { id: 9, name: '서비스' },
  { id: 10, name: '경험' },
  { id: 11, name: '선물' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: '한강뷰 프라이빗 다이닝', categoryId: 8, price: 800000, discountPrice: null, imageUrl: getLookbookImage(1), description: '한강 야경이 내려다보이는 프라이빗 룸에서 둘만의 로맨틱 디너. 셰프가 직접 준비하는 7코스 디너와 프리미엄 와인 페어링을 즐기실 수 있습니다.', instagramUrl: 'https://instagram.com', address: '서울 용산구 한강대로 100 노들라운지' },
  { id: 2, name: '프리미엄 플라워 데코', categoryId: 9, price: 300000, discountPrice: null, imageUrl: getLookbookImage(2), description: '최고급 플로리스트가 당신의 공간을 로맨틱 파라다이스로 완성해 드립니다.', instagramUrl: 'https://instagram.com', address: '서울 마포구 양화로 45 플로리스트 스튜디오' },
  { id: 3, name: '현악 4중주 라이브', categoryId: 10, price: 600000, discountPrice: null, imageUrl: getLookbookImage(3), description: '비올리스트, 첼리스트로 구성된 정통 클래식 현악 4중주 라이브 공연.', instagramUrl: 'https://instagram.com', address: null },
  { id: 4, name: '커스텀 프로포즈 링', categoryId: 11, price: 2000000, discountPrice: null, imageUrl: getLookbookImage(4), description: '세상에 하나뿐인 디자인으로 완성하는 커스텀 프로포즈 링.', instagramUrl: 'https://instagram.com', address: '서울 종로구 인사동길 12 주얼리 아뜰리에' },
  { id: 5, name: '더 플라자 그랜드 볼룸', categoryId: 1, price: 5000000, discountPrice: null, imageUrl: getLookbookImage(5), description: '서울 시내 최고급 5성급 호텔 웨딩홀, 최대 500명 수용 가능.', instagramUrl: 'https://instagram.com', address: '서울 중구 소공로 119 더 플라자 호텔' },
  { id: 6, name: '라빌로사 가든 하우스', categoryId: 1, price: 3500000, discountPrice: null, imageUrl: getLookbookImage(6), description: '자연 채광이 아름다운 프라이빗 가든, 200명 규모 야외 예식', instagramUrl: 'https://instagram.com', address: '서울 강남구 논현로 508 라빌로사 웨딩홀' },
  { id: 7, name: '그랜드 인터컨티넨탈 채플', categoryId: 1, price: 4200000, discountPrice: null, imageUrl: getLookbookImage(7), description: '고급스러운 인테리어의 프라이빗 채플, 최대 300명 수용.', instagramUrl: 'https://instagram.com', address: '서울 강남구 테헤란로 521 그랜드 인터컨티넨탈' },
  { id: 8, name: '아트오브화이트 프리미엄 촬영', categoryId: 2, price: 2800000, discountPrice: null, imageUrl: getLookbookImage(8), description: '인스타 감성 가득한 프리미엄 스튜디오, 원본 1000컷 제공.', instagramUrl: 'https://instagram.com', address: '서울 강남구 압구정로 30 아트오브화이트 스튜디오' },
  { id: 9, name: '더 포레스트 야외 로케이션', categoryId: 2, price: 2200000, discountPrice: null, imageUrl: getLookbookImage(9), description: '북한산, 올림픽공원 등 자연 배경 로케이션 촬영.', instagramUrl: 'https://instagram.com', address: '서울 송파구 올림픽로 424 올림픽공원' },
  { id: 10, name: '로즈마리 아틀리에 커스텀 드레스', categoryId: 3, price: 2800000, discountPrice: 4500000, imageUrl: getLookbookImage(10), description: '1:1 맞춤 제작 오트쿠튀르 웨딩드레스, 프렌치 레이스.', instagramUrl: 'https://instagram.com', address: '서울 강남구 청담동 45-1 로즈마리 아틀리에' },
  { id: 11, name: '클래식 턱시도 렌탈', categoryId: 3, price: 550000, discountPrice: null, imageUrl: getLookbookImage(11), description: '이태리산 프리미엄 원단, 3회 피팅 포함.', instagramUrl: 'https://instagram.com', address: '서울 강남구 도산대로 156 턱시도 하우스' },
  { id: 12, name: '제니하우스 신부 메이크업', categoryId: 4, price: 450000, discountPrice: 600000, imageUrl: getLookbookImage(12), description: '탑 메이크업 아티스트의 신부 메이크업 + 헤어 풀패키지.', instagramUrl: 'https://instagram.com', address: '서울 강남구 신사동 630 제니하우스' },
  { id: 13, name: '한스킨 그루밍 시그니처', categoryId: 4, price: 250000, discountPrice: null, imageUrl: getLookbookImage(13), description: '예비 신랑을 위한 프리미엄 그루밍 & 스킨케어.', instagramUrl: 'https://instagram.com', address: '서울 강남구 논현동 12 한스킨 클리닉' },
  { id: 14, name: '발리 울루와뚜 풀빌라 5박', categoryId: 5, price: 5800000, discountPrice: 6500000, imageUrl: getLookbookImage(14), description: '오션뷰 프라이빗 풀빌라, 조식+스파+공항 픽업 포함.', instagramUrl: 'https://instagram.com', address: null },
  { id: 15, name: '유럽 3개국 로맨틱 투어 9박', categoryId: 5, price: 8900000, discountPrice: null, imageUrl: getLookbookImage(15), description: '파리·베네치아·산토리니, 5성급 호텔+비즈니스 항공권 포함.', instagramUrl: 'https://instagram.com', address: null },
  { id: 16, name: '롤스로이스 팬텀 리무진', categoryId: 6, price: 1200000, discountPrice: 1500000, imageUrl: getLookbookImage(16), description: '웨딩 당일 6시간 대여, 기사·꽃장식·샴페인 포함.', instagramUrl: 'https://instagram.com', address: '서울 서초구 반포대로 45 프리미엄 카 렌탈' },
  { id: 17, name: '1960년대 클래식 재규어', categoryId: 6, price: 900000, discountPrice: null, imageUrl: getLookbookImage(17), description: '빈티지 감성 클래식카, 사진 촬영용으로 인기 최고.', instagramUrl: 'https://instagram.com', address: '경기 성남시 분당구 판교로 100 빈티지카 갤러리' },
  { id: 18, name: '웨딩메이트 올인원 플래닝', categoryId: 7, price: 3500000, discountPrice: null, imageUrl: getLookbookImage(18), description: '예식장부터 신혼여행까지 A-Z 전체 기획 및 진행.', instagramUrl: 'https://instagram.com', address: '서울 서초구 서초대로 396 웨딩메이트 오피스' },
  { id: 19, name: '부분 제작 코디네이션', categoryId: 7, price: 1500000, discountPrice: null, imageUrl: getLookbookImage(19), description: '스튜디오+드레스+메이크업 3종 패키지 코디.', instagramUrl: 'https://instagram.com', address: '서울 마포구 양화로 12 코디네이션 스튜디오' },
  { id: 20, name: '프리미엄 예물 커플링 세트', categoryId: 11, price: 3200000, discountPrice: null, imageUrl: getLookbookImage(20), description: '플래티넘 950 커플링, GIA 인증 다이아몬드 0.3ct.', instagramUrl: 'https://instagram.com', address: '서울 종로구 종로3가 51 예물 명품관' },
  { id: 21, name: '럭셔리 모바일 청첩장 제작', categoryId: 11, price: 500000, discountPrice: null, imageUrl: getLookbookImage(21), description: '맞춤형 모바일 청첩장 디자인·제작·발송 대행.', instagramUrl: 'https://instagram.com', address: null },
];