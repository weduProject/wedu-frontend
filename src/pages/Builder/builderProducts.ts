export interface BuilderProduct {
  id: number;
  category: string;
  categoryType: string;
  title: string;
  price: number;
  tags: string[];
  styles: string[];
}

export const BUILDER_PRODUCTS: BuilderProduct[] = [
  { id: 1, category: '🍽️ 장소', categoryType: '이벤트/공간', title: '더 리버 르다 프라이빗 다이닝', price: 550000, tags: ['한강뷰', '프라이빗다이닝', '르다프로포즈', '파인다이닝'], styles: ['로맨틱', '우아한'] },
  { id: 2, category: '🍽️ 장소', categoryType: '이벤트/공간', title: '파크 하얏트 서울 코너스톤', price: 800000, tags: ['호텔', '이탈리안', '다이닝', '강남'], styles: ['우아한', '럭셔리'] },
  { id: 3, category: '🍽️ 장소', categoryType: '이벤트/공간', title: '아이오유 프라이빗 룸 다이닝', price: 650000, tags: ['프라이빗룸', '코스요리', '한강뷰레스토랑', '아이오유'], styles: ['감성적', '아늑한'] },
  { id: 4, category: '🏨 장소', categoryType: '이벤트/공간', title: '시그니엘 서울', price: 2500000, tags: ['시그니엘', '서울야경', '호텔', '럭셔리'], styles: ['럭셔리', '우아한'] },
  { id: 5, category: '🏨 장소', categoryType: '이벤트/공간', title: '서울 신라 호텔', price: 1800000, tags: ['신라호텔', '5성급', '장충동', '럭셔리'], styles: ['우아한', '럭셔리'] },
  { id: 6, category: '🏨 장소', categoryType: '이벤트/공간', title: '그랜드 하얏트 서울', price: 1500000, tags: ['그랜드하얏트', '남산', '호텔', '5성급'], styles: ['럭셔리', '감성적'] },
  { id: 7, category: '🏨 장소', categoryType: '이벤트/공간', title: '호텔 나루 서울 엠갤러리', price: 1200000, tags: ['한강뷰', '리버뷰', '호텔', '프로포즈'], styles: ['모던', '럭셔리'] },
  { id: 8, category: '🌅 장소', categoryType: '사진/영상', title: '제주의오후 감성 노을 스냅', price: 450000, tags: ['제주스냅', '제주의오후', '노을스냅', '바다프로포즈'], styles: ['감성적', '모험적'] },
  { id: 9, category: '🌅 장소', categoryType: '이벤트/공간', title: '파티부 제주 프로포즈', price: 600000, tags: ['제주', '호텔', '프로포즈', '풍선'], styles: ['감성적', '로맨틱'] },
  { id: 10, category: '🌅 장소', categoryType: '사진/영상', title: '레코드필름 제주 바다 커플 스냅', price: 400000, tags: ['제주스냅', '레코드필름', '바다스냅', '커플화보'], styles: ['감성적', '모험적'] },
  { id: 11, category: '💐 서비스', categoryType: '플라워', title: '보우원플라워 프로포즈 데코', price: 700000, tags: ['호텔프로포즈', '출장꽃장식', '보우원플라워', '생화데코'], styles: ['로맨틱', '감성적'] },
  { id: 12, category: '💐 서비스', categoryType: '플라워', title: 'DE mood Seoul', price: 550000, tags: ['프로포즈', '플라워', '공간연출', '이벤트'], styles: ['로맨틱', '감성적'] },
  { id: 13, category: '💐 서비스', categoryType: '플라워', title: '플로블랑', price: 250000, tags: ['플라워', '프로포즈', '웨딩', '생화'], styles: ['로맨틱', '감성적'] },
  { id: 14, category: '💐 서비스', categoryType: '플라워', title: '풍써니', price: 180000, tags: ['풍선', '꽃풍선', '호텔', '프로포즈'], styles: ['로맨틱', '깜짝'] },
  { id: 15, category: '💐 서비스', categoryType: '플라워', title: '추억룸', price: 300000, tags: ['호텔', '신혼집', '사진', '풍선'], styles: ['감성적', '아늑한'] },
  { id: 16, category: '📸 서비스', categoryType: '사진/영상', title: '미상스냅', price: 500000, tags: ['프로포즈스냅', '미상스냅', '커플스냅', '이벤트촬영'], styles: ['감성적', '아늑한'] },
  { id: 17, category: '📸 서비스', categoryType: '사진/영상', title: '포지스냅', price: 400000, tags: ['스냅', '커플', '웨딩', '프로포즈'], styles: ['감성적', '우아한'] },
  { id: 18, category: '📸 서비스', categoryType: '사진/영상', title: '존존픽쳐스 시네마틱 영상 스냅', price: 900000, tags: ['프로포즈영상', '존존픽쳐스', '시네마틱필름', '영상스냅'], styles: ['감성적', '모던'] },
  { id: 19, category: '🎻 경험', categoryType: '기타', title: '아르떼뮤직 웨딩·이벤트 연주', price: 850000, tags: ['현악', '클래식', '웨딩연주', '프로포즈'], styles: ['우아한', '감성적'] },
  { id: 20, category: '🎻 경험', categoryType: '기타', title: '다온음 프로포즈 현악 4중주', price: 1000000, tags: ['현악4중주', '라이브연주', '다온음', '호텔프로포즈'], styles: ['우아한', '감성적'] },
  { id: 21, category: '🎆 경험', categoryType: '이벤트/공간', title: '요트홀릭 프라이빗 요트 패키지', price: 3200000, tags: ['부산요트투어', '요트홀릭', '불꽃프로포즈', '광안리요트대관'], styles: ['깜짝', '모험적'] },
  { id: 22, category: '🎆 경험', categoryType: '이벤트/공간', title: '두근두근 맞춤 프로포즈', price: 1200000, tags: ['프로포즈', '맞춤기획', '호텔', '이벤트'], styles: ['깜짝', '로맨틱'] },
  { id: 23, category: '💍 선물', categoryType: '주얼리', title: '바이가미 청담 웨딩 주얼리', price: 3500000, tags: ['바이가미', '청담예물', '웨딩반지', '핸드메이드'], styles: ['우아한', '럭셔리'] },
  { id: 24, category: '💍 선물', categoryType: '주얼리', title: '제이버튼 주얼리', price: 1800000, tags: ['주얼리', '커스텀', '웨딩밴드', '프로포즈'], styles: ['모던', '우아한'] },
];