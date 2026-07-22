import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import CommunityCard from "./CommunityCard";
import { communityPosts } from "./communityDummy";

const categories = [
  "전체",
  "자유",
  "후기",
  "질문",
];

export default function CommunityPage() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("전체");


  const filteredPosts = communityPosts.filter((post) => {
    const matchCategory =
      selectedCategory === "전체" ||
      post.category === selectedCategory;

    const matchKeyword =
      post.title.includes(keyword) ||
      post.content.includes(keyword);

    return matchCategory && matchKeyword;
  });


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


      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요."
        className="w-full border rounded-xl p-3 mb-6"
      />


      <div className="flex gap-3 mb-8">

        {categories.map((category) => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(category)
            }
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

        {filteredPosts.map((post) => (
          <CommunityCard
            key={post.id}
            post={post}
          />
        ))}

      </div>

    </div>
  );
}
