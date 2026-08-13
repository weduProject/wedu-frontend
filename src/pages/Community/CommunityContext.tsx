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
    title: "프로포즈 장소 추천받고 싶어요!",
    content:
      "요즘 프로포즈를 준비하고 있는데 분위기 좋은 장소를 찾고 있어요. 특별한 날에 방문하기 좋은 장소가 있다면 추천해주세요!",
    author: "예비신랑",
    date: "2026.08.10",
    likes: 18,
    comments: 5,
  },
  {
    id: 2,
    category: "웨딩준비",
    title: "웨딩홀 알아볼 때 어떤 부분을 가장 중요하게 보셨나요?",
    content:
      "결혼식을 준비하면서 웨딩홀을 알아보고 있습니다. 식사, 위치, 홀 분위기 등 어떤 부분을 가장 중요하게 보셨는지 궁금해요.",
    author: "결혼준비중",
    date: "2026.08.09",
    likes: 14,
    comments: 7,
  },
  {
    id: 3,
    category: "웨딩준비",
    title: "스드메 준비하면서 느낀 점 공유해요",
    content:
      "스튜디오와 드레스, 메이크업을 준비하면서 생각보다 확인해야 할 부분이 많더라고요. 제가 준비하면서 알게 된 팁을 공유해봅니다.",
    author: "웨딩러버",
    date: "2026.08.08",
    likes: 21,
    comments: 9,
  },
  {
    id: 4,
    category: "신혼생활",
    title: "신혼집 꾸미기 시작했어요",
    content:
      "결혼을 앞두고 신혼집을 꾸미고 있습니다. 가구 배치나 신혼집 인테리어 준비하면서 도움이 됐던 방법이 있다면 알려주세요!",
    author: "신혼새댁",
    date: "2026.08.07",
    likes: 12,
    comments: 4,
  },
  {
    id: 5,
    category: "고민상담",
    title: "결혼 준비하면서 의견 차이가 생기네요",
    content:
      "결혼 준비를 하다 보니 서로 생각이 다른 부분이 생기고 있어요. 다른 분들은 이런 상황을 어떻게 해결하셨는지 궁금합니다.",
    author: "고민중",
    date: "2026.08.06",
    likes: 16,
    comments: 11,
  },
  {
    id: 6,
    category: "Tip공유",
    title: "결혼 준비하면서 꼭 메모해두면 좋은 것들",
    content:
      "여러 업체를 알아보다 보니 일정과 비용을 정리해두는 게 정말 중요하더라고요. 제가 사용했던 정리 방법을 공유합니다.",
    author: "웨딩메이트",
    date: "2026.08.05",
    likes: 25,
    comments: 8,
  },
  {
    id: 7,
    category: "프로포즈",
    title: "프로포즈 선물 어떤 게 좋을까요?",
    content:
      "꽃과 편지 외에 특별한 선물을 준비하고 싶은데 어떤 게 좋을지 고민입니다. 직접 준비해보신 분들의 경험이 궁금해요.",
    author: "예비신랑2",
    date: "2026.08.04",
    likes: 9,
    comments: 3,
  },
  {
    id: 8,
    category: "Tip공유",
    title: "결혼 준비 비용 정리 팁",
    content:
      "결혼 준비를 시작하면서 예상보다 비용을 관리하는 게 중요하다는 걸 느꼈어요. 항목별로 예산을 정리하면 훨씬 편합니다.",
    author: "알뜰웨딩",
    date: "2026.08.03",
    likes: 30,
    comments: 13,
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
