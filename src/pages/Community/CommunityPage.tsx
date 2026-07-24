import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">커뮤니티</h1>
          <p className="text-gray-500 mt-2">
            예비 신랑신부들과 경험과 정보를 나눠보세요
          </p>
        </div>

        <Button onClick={() => navigate("/community/write")} className="px-6">
          글쓰기
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="검색어를 입력하세요"
            className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary transition shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
            className={`
              rounded-full px-5 py-2 text-sm font-medium transition
              ${
                selectedCategory === category
                  ? "bg-[#C48E96] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pagedPosts.length > 0 ? (
          pagedPosts.map((post) => (
            <CommunityCard key={post.id} post={post} />
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 bg-white border border-gray-100 rounded-3xl py-24 flex flex-col items-center justify-center text-center shadow-sm mt-4">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 text-3xl mb-4 border border-gray-100">
              💬
            </div>
            <p className="text-gray-400 mb-6 text-sm">아직 게시글이 없어요</p>
            <button
              onClick={() => navigate("/community/write")}
              className="text-[#C48E96] font-bold text-sm hover:underline"
            >
              첫 게시글 작성하기
            </button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
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
