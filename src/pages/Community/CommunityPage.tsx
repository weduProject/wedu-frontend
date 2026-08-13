import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PenLine, MessageCircle } from "lucide-react";
import clsx from "clsx";
import { Button } from "../../components";
import CommunityCard from "./CommunityCard";
import { useCommunity } from "./CommunityContext";

const categories = ["전체", "프로포즈", "웨딩준비", "신혼생활", "고민상담", "Tip공유"];
const POSTS_PER_PAGE = 8;

const parseDate = (dateStr: string) => {
  if (!dateStr || dateStr === "방금 전") return Number.MAX_SAFE_INTEGER;
  const parts = dateStr.replace(/\s/g, "").split(/[./]/).filter(Boolean);
  if (parts.length >= 3) {
    let year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (year < 100) year += 2000;
    const time = new Date(year, month, day).getTime();
    return isNaN(time) ? 0 : time;
  }
  return 0;
};

export default function CommunityPage() {
  const navigate = useNavigate();
  const { posts } = useCommunity();

  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState<"latest" | "popular">("latest");

  const handleSortChange = (type: "latest" | "popular") => {
    setSortType(type);
    setCurrentPage(1);
  };

  const filteredPosts = posts
    .filter((post) => {
      const matchCategory = selectedCategory === "전체" || post.category === selectedCategory;
      const matchKeyword = post.title.includes(keyword) || post.content.includes(keyword);
      return matchCategory && matchKeyword;
    })
    .sort((a, b) => {
      if (sortType === "popular" && b.likes !== a.likes) return b.likes - a.likes;
      const timeA = parseDate(a.date);
      const timeB = parseDate(b.date);
      if (timeA !== timeB) return timeB - timeA;
      return b.id - a.id;
    });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pagedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <div className="bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8">
        {/* 상단 타이틀 및 글쓰기 버튼 */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text font-serif">커뮤니티</h1>
            <p className="mt-2 text-sm text-text-muted">예비 신랑신부들과 경험과 정보를 나눠보세요</p>
          </div>

          <Button className="flex items-center gap-2" onClick={() => navigate("/community/write")}>
            <PenLine className="h-4 w-4" />
            글쓰기
          </Button>
        </div>

        {/* 검색창 */}
        <div className="mb-8">
          <div className="relative w-full">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted">
              <Search className="h-5 w-5" strokeWidth={2} />
            </span>
            <input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="검색어를 입력하세요"
              className="w-full rounded-full border border-border bg-white py-4 pl-14 pr-6 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* 카테고리 탭 및 정렬 버튼 */}
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={clsx(
                  "rounded-full px-5 py-2.5 text-sm font-bold transition-all",
                  selectedCategory === category ? "category-tab-active" : "category-tab-inactive",
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end rounded-full border border-border bg-white p-1 lg:self-auto">
            <button
              onClick={() => handleSortChange("latest")}
              className={clsx(
                "rounded-full px-4 py-2 text-xs font-bold transition-colors",
                sortType === "latest" ? "bg-primary-light text-primary" : "text-text-muted hover:text-text",
              )}
            >
              최신순
            </button>
            <button
              onClick={() => handleSortChange("popular")}
              className={clsx(
                "rounded-full px-4 py-2 text-xs font-bold transition-colors",
                sortType === "popular" ? "bg-primary-light text-primary" : "text-text-muted hover:text-text",
              )}
            >
              인기순
            </button>
          </div>
        </div>

        {/* 게시글 리스트 */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {pagedPosts.length > 0 ? (
            pagedPosts.map((post) => <CommunityCard key={post.id} post={post} />)
          ) : (
            <div className="col-span-1 mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-32 text-center md:col-span-2">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <MessageCircle className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <p className="mb-6 font-medium text-text-muted">아직 해당하는 게시글이 없어요</p>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={clsx(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all",
                  currentPage === index + 1
                    ? "bg-primary text-white shadow-md"
                    : "border border-border bg-white text-text-muted hover:border-primary hover:text-primary",
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}