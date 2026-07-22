export interface CommunityPost {
  id: number;
  title: string;
  author: string;
  date: string;
  category: string;
  likes: number;
  comments: number;
  views: number;
  content: string;
}

export const communityPosts: CommunityPost[] = [
  {
    id: 1,
    title: "첫 프로포즈 준비 중인데 조언 부탁드립니다!",
    author: "서진",
    date: "2026.07.20",
    category: "자유",
    likes: 23,
    comments: 8,
    views: 142,
    content:
      "반지를 준비하고 있는데 어떤 장소에서 하면 좋을까요? 경험 있으신 분들의 의견 부탁드립니다.",
  },
  {
    id: 2,
    title: "웨딩홀 계약 후기",
    author: "예은",
    date: "2026.07.19",
    category: "후기",
    likes: 15,
    comments: 4,
    views: 96,
    content:
      "웨딩홀 계약을 마쳤습니다. 상담도 친절했고 가격도 만족스러웠어요.",
  },
  {
    id: 3,
    title: "스드메 견적 질문드립니다.",
    author: "건우",
    date: "2026.07.18",
    category: "질문",
    likes: 31,
    comments: 12,
    views: 203,
    content:
      "평균적으로 얼마 정도 생각하면 될까요?",
  },
];
