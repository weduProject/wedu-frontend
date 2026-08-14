import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface CommunityPost {
  id: number;
  category: string;
  title: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
}

interface NewPost {
  category: string;
  title: string;
  content: string;
}

interface CommunityContextType {
  posts: CommunityPost[];
  isLoading: boolean;
  error: string | null;
  addPost: (post: NewPost) => void;
  updatePost: (
    id: number,
    post: Partial<CommunityPost>
  ) => void;
  deletePost: (id: number) => void;
}

const CommunityContext = createContext<
  CommunityContextType | undefined
>(undefined);

const STORAGE_KEY = "wedu-community-posts";

const dummyPosts: CommunityPost[] = [
  {
    id: 1,
    category: "프로포즈",
    title: "첫 프로포즈 준비 중인데 조언 부탁드립니다!",
    content:
      "반지를 준비하고 있는데 어떤 장소에서 하면 좋을까요? 경험 있으신 분들의 의견 부탁드립니다.",
    author: "서진",
    date: "2026.07.20",
    likes: 23,
    comments: 8,
  },
  {
    id: 2,
    category: "웨딩팁",
    title: "예식장 계약 전 반드시 확인해야 할 숨은 비용 7가지",
    content:
      "누구나 하는 실수! 대관료만 보고 계약했다가 추가 비용 폭탄 맞는 경우 진짜 많아요. 1) 식대 외 부대시설 사용료 (주차장, 라운지 등) 2) 꽃 장식 추가 비용 — 기본 포함량이 생각보다 적음 3) 음향/조명...",
    author: "WEDU 매거진",
    date: "2026.08.03",
    likes: 256,
    comments: 51,
  },
  {
    id: 3,
    category: "플래너",
    title: "2026 웨딩 플래너 비용 완전 정복 — 평균 견적과 협상 팁",
    content:
      "웨딩플래너 비용, 막막하셨죠? 2026년 기준으로 정리해드릴게요. 당일 대행은 80~150만원, 부분 컨설팅은 150~300만원, 풀 컨설팅은 300~500만원 선이에요.",
    author: "WEDU 매거진",
    date: "2026.07.30",
    likes: 187,
    comments: 35,
  },
  {
    id: 4,
    category: "프로포즈",
    title: "프로포즈 장소 추천 부탁드려요",
    content:
      "서울 근교에서 분위기 좋은 프로포즈 장소 추천 부탁드립니다.",
    author: "민수",
    date: "2026.07.17",
    likes: 9,
    comments: 2,
  },
  {
    id: 5,
    category: "웨딩팁",
    title: "허니문 시즌별 추천 여행지 총정리 (2026 하반기~2027)",
    content:
      "결혼 시즌별로 허니문 BEST 여행지를 정리해봤어요. 9~11월 가을: 이탈리아 토스카나, 체코 프라하, 일본 교토 (단풍 시즌 로망). 12월은 몰디브 추천해요.",
    author: "WEDU 매거진",
    date: "2026.07.27",
    likes: 173,
    comments: 33,
  },
  {
    id: 6,
    category: "플래너",
    title: "웨딩 플래너 고르는 5가지 체크리스트 — 후회 없는 선택법",
    content:
      "예비부부 80%가 웨딩플래너 선택을 가장 어려워한다는 설문 결과가 있어요. 당연하죠, 인생에서 가장 중요한 날을 누군가에게 맡기는 일이니까요. 오늘은 플래너 선택 전 꼭 확인해야 할 5가지를 정리했어요.",
    author: "WEDU 매거진",
    date: "2026.08.02",
    likes: 215,
    comments: 42,
  },
  {
    id: 7,
    category: "박람회",
    title: "신라호텔 웨딩 페어 2026 — 영빈관 투어 후기",
    content:
      "지난주 다녀온 신라호텔 웨딩페어 솔직 후기입니다. 영빈관 다이닝스티홀은 정말 압도적이었어요. 천장 높이도 엄청나고 조명 연출도 최고였어요.",
    author: "WEDU 매거진",
    date: "2026.07.28",
    likes: 96,
    comments: 18,
  },
  {
    id: 8,
    category: "프로포즈",
    title: "프로포즈 성공 후기!",
    content:
      "많이 긴장했지만 성공했습니다. 응원해주신 분들 감사합니다.",
    author: "다은",
    date: "2026.07.13",
    likes: 27,
    comments: 9,
  },
  {
    id: 9,
    category: "웨딩팁",
    title: "웨딩 예물 트렌드 2026 — 명품 시계부터 커스텀 주얼리까지",
    content:
      "2026년 예물 트렌드가 확 바뀌고 있어요. 전통적인 금+다이아 세트 대신 커플 시계(까르띠에 탱크, 롤렉스 데이트저스트)가 대세고, 커스텀 주얼리도 인기예요.",
    author: "WEDU 매거진",
    date: "2026.07.24",
    likes: 164,
    comments: 29,
  },
  {
    id: 10,
    category: "박람회",
    title: "2026 COEX 하반기 웨딩페어 — 놓치면 후회할 혜택 총정리",
    content:
      "서울 삼성동 COEX에서 열리는 하반기 최대 규모 웨딩페어가 9월 15일부터 17일까지 진행됩니다. 웨딩홀, 스드메, 허니문, 예물까지 한 자리에서 비교해볼 수 있어요.",
    author: "WEDU 매거진",
    date: "2026.08.01",
    likes: 128,
    comments: 24,
  },
  {
    id: 11,
    category: "웨딩팁",
    title: "스드메 패키지 똑똑하게 고르는 법 — 따로 vs 묶음 비교",
    content:
      "스드메(스튜디오+드레스+메이크업)는 패키지로 한 번에 해결할지, 각각 따로 구하지가 항상 고민이죠. 2026년 기준으로 패키지 평균가와 따로 구했을 때를 비교해봤어요.",
    author: "WEDU 매거진",
    date: "2026.07.29",
    likes: 198,
    comments: 39,
  },
  {
    id: 12,
    category: "플래너",
    title: "강남 vs 홍대 vs 종로 — 지역별 웨딩 플래너 스타일 비교",
    content:
      "재미있는 사실: 서울에서도 지역에 따라 웨딩플래너 스타일이 확 갈린다는 거 아시나요? 강남권 플래너는 럭셔리 호텔 웨딩 특화로 움직여요.",
    author: "WEDU 매거진",
    date: "2026.07.26",
    likes: 142,
    comments: 28,
  },
  {
    id: 13,
    category: "박람회",
    title: "2026 부산 벡스코 웨딩 박람회 — 지역 예비부부 필수 코스",
    content:
      "부산 울산 경남 예비부부들 주목! 10월 6일부터 8일까지 벡스코에서 대규모 웨딩박람회 열립니다. 지역 웨딩홀 50여 곳, 스드메 업체들이 한자리에 모여요.",
    author: "WEDU 매거진",
    date: "2026.07.25",
    likes: 73,
    comments: 11,
  },
];

export function CommunityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 최초 실행
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem(STORAGE_KEY);

      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      } else {
        setPosts(dummyPosts);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(dummyPosts)
        );
      }
    } catch (error) {
      console.error("커뮤니티 데이터 불러오기 오류:", error);
      setError("게시글을 불러오지 못했습니다.");
      setPosts(dummyPosts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 게시글 변경 시 localStorage 저장
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(posts)
      );
    }
  }, [posts, isLoading]);

  // 게시글 작성
  const addPost = (newPost: NewPost) => {
    const post: CommunityPost = {
      id: Date.now(),
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      author: "나",
      date: new Date().toLocaleDateString("ko-KR"),
      likes: 0,
      comments: 0,
    };

    setPosts((prev) => [post, ...prev]);
  };

  // 게시글 수정
  const updatePost = (
    id: number,
    updatedPost: Partial<CommunityPost>
  ) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, ...updatedPost }
          : post
      )
    );
  };

  // 게시글 삭제
  const deletePost = (id: number) => {
    setPosts((prev) =>
      prev.filter((post) => post.id !== id)
    );
  };

  return (
    <CommunityContext.Provider
      value={{
        posts,
        isLoading,
        error,
        addPost,
        updatePost,
        deletePost,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);

  if (!context) {
    throw new Error(
      "useCommunity는 CommunityProvider 안에서 사용해야 합니다."
    );
  }

  return context;
}
