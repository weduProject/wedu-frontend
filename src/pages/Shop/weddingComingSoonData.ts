export interface WeddingComingSoonItem {
  id: string;
  title: string;
  subCategory: '웨딩홀' | '스튜디오' | '드레스' | '메이크업' | '허니문' | '웨딩카' | '플래너';
  description: string;
}

// 웨딩 카테고리 탭 전용 mock 데이터. 실제 구매 불가(찜/장바구니 없음), "준비중" 안내 전용.
export const WEDDING_COMING_SOON: WeddingComingSoonItem[] = [
  {
    id: 'w1',
    title: '그랜드 볼룸',
    subCategory: '웨딩홀',
    description: '최대 500명 수용 가능한 호텔 그랜드볼룸, 화려한 샹들리에와 함께하는 품격 있는 예식',
  },
  {
    id: 'w2',
    title: '가든 웨딩',
    subCategory: '웨딩홀',
    description: '자연 채광이 아름다운 야외 가든, 푸르른 잔디 위에서 올리는 로맨틱 야외 예식',
  },
  {
    id: 'w3',
    title: '채플 웨딩',
    subCategory: '웨딩홀',
    description: '스테인드글라스와 파이프 오르간이 있는 고풍스러운 채플에서의 엄숙한 예식',
  },
  {
    id: 'w4',
    title: '프리미엄 웨딩 스튜디오',
    subCategory: '스튜디오',
    description: '자연광 스튜디오 + 야외 정원, 다양한 콘셉트의 웨딩 화보 촬영',
  },
  {
    id: 'w5',
    title: '웨딩 드레스 샵',
    subCategory: '드레스',
    description: '디자이너 브랜드부터 클래식까지, 단 한 벌의 완벽한 드레스를 찾아드립니다',
  },
  {
    id: 'w6',
    title: '웨딩 메이크업 & 헤어',
    subCategory: '메이크업',
    description: '신부를 위한 최고급 메이크업 & 헤어, 리허설부터 본식까지',
  },
  {
    id: 'w7',
    title: '허니문 패키지',
    subCategory: '허니문',
    description: '몰디브, 발리, 산토리니 등 꿈의 허니문을 위한 맞춤형 여행 설계',
  },
  {
    id: 'w8',
    title: '웨딩카 렌탈',
    subCategory: '웨딩카',
    description: '롤스로이스, 벤틀리 등 럭셔리 웨딩카와 기사님 서비스',
  },
  {
    id: 'w9',
    title: '웨딩 플래너',
    subCategory: '플래너',
    description: '전문 웨딩 플래너가 처음부터 끝까지 완벽한 예식을 코디네이트합니다',
  },
];

// 하위 카테고리 칩 색상 (기존 프로덕트 상세페이지 톤과 통일)
export const SUBCATEGORY_CHIP_STYLE: Record<WeddingComingSoonItem['subCategory'], string> = {
  웨딩홀: 'bg-[#FDE9EC] text-[#B0466A]',
  스튜디오: 'bg-[#DCE9F5] text-[#2E5F8A]',
  드레스: 'bg-[#FDE9EC] text-[#B0466A]',
  메이크업: 'bg-[#FDF0DC] text-[#9A5B1E]',
  허니문: 'bg-[#DCEFEA] text-[#1F6E56]',
  웨딩카: 'bg-[#E7E7FB] text-[#4B3FA3]',
  플래너: 'bg-[#FDE9EC] text-[#B0466A]',
};