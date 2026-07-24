export interface CommunityPost {
  id: number;
  title: string;
  author: string;
  date: string;
  category: string;
  likes: number;
  comments: number;
  content: string;
}

export const communityPosts: CommunityPost[] = [
  {
    id: 1,
    title: "첫 프로포즈 준비 중인데 조언 부탁드립니다!",
    author: "서진",
    date: "2026.07.20",
    category: "프로포즈",
    likes: 23,
    comments: 8,
    content:
      "반지를 준비하고 있는데 어떤 장소에서 하면 좋을까요? 경험 있으신 분들의 의견 부탁드립니다.",
  },
  {
    id: 2,
    title: "웨딩홀 계약 후기",
    author: "예은",
    date: "2026.07.19",
    category: "웨딩준비",
    likes: 15,
    comments: 4,
    content:
      "웨딩홀 계약을 마쳤습니다. 상담도 친절했고 가격도 만족스러웠어요.",
  },
  {
    id: 3,
    title: "스드메 견적 질문드립니다.",
    author: "건우",
    date: "2026.07.18",
    category: "고민상담",
    likes: 31,
    comments: 12,
    content:
      "평균적으로 얼마 정도 생각하면 될까요?",
  },
    {
    id: 4,
    title: "프로포즈 장소 추천 부탁드려요",
    author: "민수",
    date: "2026.07.17",
    category: "프로포즈",
    likes: 9,
    comments: 2,
    content:
      "서울 근교에서 분위기 좋은 프로포즈 장소 추천 부탁드립니다.",
  },
  {
    id: 5,
    title: "제주 신혼여행 후기",
    author: "지은",
    date: "2026.07.16",
    category: "신혼생활",
    likes: 18,
    comments: 5,
    content:
      "제주도에서 3박 4일 다녀왔는데 정말 만족스러웠습니다.",
  },
  {
    id: 6,
    title: "결혼 준비 체크리스트 공유합니다",
    author: "현우",
    date: "2026.07.15",
    category: "Tip공유",
    likes: 12,
    comments: 3,
    content:
      "제가 사용했던 체크리스트 공유드려요. 도움이 되었으면 좋겠습니다.",
  },
  {
    id: 7,
    title: "예식장 예약은 언제 하는 게 좋나요?",
    author: "수빈",
    date: "2026.07.14",
    category: "웨딩준비",
    likes: 7,
    comments: 6,
    content:
      "예식 날짜 기준으로 몇 달 전에 예약하는 게 적당할까요?",
  },
  {
    id: 8,
    title: "프로포즈 성공 후기!",
    author: "다은",
    date: "2026.07.13",
    category: "프로포즈",
    likes: 27,
    comments: 9,
    content:
      "많이 긴장했지만 성공했습니다. 응원해주신 분들 감사합니다.",
  },
  {
    id: 9,
    title: "반지 브랜드 추천",
    author: "태훈",
    date: "2026.07.12",
    category: "고민상담",
    likes: 10,
    comments: 4,
    content:
      "가성비 좋은 프로포즈 반지 브랜드 추천 부탁드립니다.",
  },
  {
    id: 10,
    title: "웨딩홀 투어 꿀팁",
    author: "유진",
    date: "2026.07.11",
    category: "Tip공유",
    likes: 20,
    comments: 7,
    content:
      "웨딩홀 투어 전에 꼭 체크해야 할 사항들을 정리했습니다.",
  },
];
