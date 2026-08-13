import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PenLine } from "lucide-react"; 
import clsx from "clsx";
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
      const matchCategory =
        selectedCategory === "전체" ||
        post.category.includes(selectedCategory) ||
        selectedCategory.includes(post.category);
      const matchKeyword = post.title.includes(keyword) || post.content.includes(keyword);
      return matchCategory && matchKeyword;
    })
    .sort((a, b) => {
      if (sortType === "popular") {
        if (b.likes !== a.likes) return b.likes - a.likes;
      }
      const timeA = parseDate(a.date);
      const timeB = parseDate(b.date);
      if (timeA !== timeB) return timeB - timeA;
      return b.id - a.id;
    });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pagedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-surface pt-20 pb-16">
      <div className="mx-auto max-w-5xl px-4">
        {/* 상단 타이틀 및 글쓰기 버튼 */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl md:text-[32px] font-bold text-gray-900 tracking-tight">커뮤니티</h1>
            <p className="mt-2 text-gray-500 text-[15px]">
              예비 신랑신부들과 경험과 정보를 나눠보세요
            </p>
          </div>

          <button
            onClick={() => navigate("/community/write")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#F89685] to-[#F2705C] text-white font-bold text-[15px] shadow-[0_8px_16px_rgba(242,112,92,0.25)] hover:shadow-[0_12px_20px_rgba(242,112,92,0.35)] hover:-translate-y-0.5 transition-all"
          >
            <PenLine className="w-4 h-4" />
            글쓰기
          </button>
        </div>

        {/* 자동 검색창 (검색 버튼 제거) */}
        <div className="mb-8 animate-fade-in">
          <div className="relative w-full">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" strokeWidth={2} />
            </span>
            <input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="검색어를 입력하세요"
              className="w-full rounded-full border border-gray-200 bg-white py-4 pl-14 pr-6 text-[15px] outline-none transition-all focus:border-[#F48171] focus:ring-4 focus:ring-[#F48171]/10 shadow-sm"
            />
          </div>
        </div>

        {/* 카테고리 탭 및 정렬 버튼 */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={clsx(
                  "rounded-full px-5 py-2.5 text-[14px] font-bold transition-all duration-300",
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#F89685] to-[#F2705C] text-white shadow-[0_4px_12px_rgba(242,112,92,0.3)] scale-[1.02]"
                    : "bg-white text-gray-500 border border-gray-100 shadow-sm hover:border-[#F48171]/40"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end lg:self-auto bg-white rounded-full p-1 border border-gray-100 shadow-sm">
            <button
              onClick={() => handleSortChange("latest")}
              className={clsx(
                "rounded-full px-4 py-2 text-[13px] font-bold transition-colors",
                sortType === "latest" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-900"
              )}
            >
              최신순
            </button>
            <button
              onClick={() => handleSortChange("popular")}
              className={clsx(
                "rounded-full px-4 py-2 text-[13px] font-bold transition-colors",
                sortType === "popular" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-900"
              )}
            >
              인기순
            </button>
          </div>
        </div>

        {/* 게시글 리스트 */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {pagedPosts.length > 0 ? (
            pagedPosts.map((post) => (
              <CommunityCard
                key={post.id}
                post={post}
              />
            ))
          ) : (
            <div className="col-span-1 mt-4 flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-gray-200 bg-white py-32 text-center shadow-sm md:col-span-2">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
                <span className="text-4xl">💬</span>
              </div>

              <p className="mb-6 text-gray-500 font-medium">
                아직 해당하는 게시글이 없어요
              </p>
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
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  currentPage === index + 1
                    ? "bg-[#F48171] text-white shadow-md shadow-[#F48171]/20"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-[#F48171] hover:text-[#F48171]"
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
