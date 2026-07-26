import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageCircle } from "lucide-react";
import { Button } from "../../components";
import CommunityCard from "./CommunityCard";
import { useCommunity } from "./CommunityContext";

const categories = [
  "전체",
  "프로포즈",
  "웨딩준비",
  "신혼생활",
  "고민상담",
  "Tip공유",
];

const POSTS_PER_PAGE = 8;

export default function CommunityPage() {
  const navigate = useNavigate();
  const { posts } = useCommunity();

  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = posts
    .filter((post) => {
      const matchCategory =
        selectedCategory === "전체" ||
        post.category.includes(selectedCategory) ||
        selectedCategory.includes(post.category);

      const matchKeyword =
        post.title.includes(keyword) || post.content.includes(keyword);

      return matchCategory && matchKeyword;
    })
    .sort((a, b) => b.id - a.id);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pagedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="mx-auto max-w-[1024px]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">커뮤니티</h1>
          <p className="mt-2 text-text-muted">
            예비 신랑신부들과 경험과 정보를 나눠보세요
          </p>
        </div>

        <Button onClick={() => navigate("/community/write")} className="px-6">
          글쓰기
        </Button>
      </div>

      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            <Search className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <input
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="검색어를 입력하세요"
            className="w-full rounded-xl border border-border py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-primary text-white"
                : "border border-border bg-white text-text hover:border-primary/40"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {pagedPosts.length > 0 ? (
          pagedPosts.map((post) => <CommunityCard key={post.id} post={post} />)
        ) : (
          <div className="col-span-1 mt-4 flex flex-col items-center justify-center rounded-xl border border-border bg-white py-24 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] md:col-span-2">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-primary-light/50 text-text-muted">
              <MessageCircle className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <p className="mb-6 text-sm text-text-muted">아직 게시글이 없어요</p>
            <button
              type="button"
              onClick={() => navigate("/community/write")}
              className="cursor-pointer text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
            >
              첫 게시글 작성하기
            </button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              size="sm"
              variant={currentPage === index + 1 ? "main" : "secondary"}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}