import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import CommunityCard from "./CommunityCard";
import { useCommunity } from "./CommunityContext";
import CommunityStats from "./CommunityStats";
import HotPosts from "./HotPosts";

const categories = [
  "전체",
  "자유",
  "후기",
  "질문",
];

const POSTS_PER_PAGE = 5;

export default function CommunityPage() {
  const navigate = useNavigate();
  const { posts } = useCommunity();
  console.log("posts:", posts.length);
  console.log(posts);

  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("전체");

  const [sortType, setSortType] = useState<
    "latest" | "popular"
  >("latest");

  const [currentPage, setCurrentPage] =
    useState(1);

  // HOT 게시글 ID
  const hotPostIds = [...posts]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3)
    .map((post) => post.id);

  // 일반 게시글 (HOT 제외)
  const filteredPosts = posts
    .filter((post) => {
      const matchCategory =
        selectedCategory === "전체" ||
        post.category === selectedCategory;

      const matchKeyword =
        post.title.includes(keyword) ||
        post.content.includes(keyword);

      const notHot = !hotPostIds.includes(post.id);

      return (
        matchCategory &&
        matchKeyword &&
        notHot
      );
    })
    .sort((a, b) => {
      if (sortType === "popular") {
        return b.likes - a.likes;
      }

      return b.id - a.id;
    });

  const totalPages = Math.ceil(
    filteredPosts.length / POSTS_PER_PAGE
  );

  const pagedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          커뮤니티
        </h1>

        <Button
          onClick={() => navigate("/community/write")}
        >
          글쓰기
        </Button>
      </div>

      <CommunityStats />

      <HotPosts posts={posts} />

      <input
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="검색어를 입력하세요."
        className="w-full border rounded-xl p-3 mb-6"
      />

      <div className="flex justify-end gap-2 mb-4">
        <Button
          size="sm"
          variant={
            sortType === "latest"
              ? "main"
              : "secondary"
          }
          onClick={() => {
            setSortType("latest");
            setCurrentPage(1);
          }}
        >
          최신순
        </Button>

        <Button
          size="sm"
          variant={
            sortType === "popular"
              ? "main"
              : "secondary"
          }
          onClick={() => {
            setSortType("popular");
            setCurrentPage(1);
          }}
        >
          인기순
        </Button>
      </div>

      <div className="flex gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
            className={
              selectedCategory === category
                ? "bg-primary text-white rounded-full px-5 py-2"
                : "border rounded-full px-5 py-2"
            }
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {pagedPosts.length > 0 ? (
          pagedPosts.map((post) => (
            <CommunityCard
              key={post.id}
              post={post}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from(
            { length: totalPages },
            (_, index) => (
              <Button
                key={index}
                size="sm"
                variant={
                  currentPage === index + 1
                    ? "main"
                    : "secondary"
                }
                onClick={() =>
                  setCurrentPage(index + 1)
                }
              >
                {index + 1}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
