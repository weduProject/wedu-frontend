import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import CommunityCard from "./CommunityCard";
import { communityPosts } from "./communityDummy";

export default function CommunityPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          커뮤니티
        </h1>

        <Button onClick={() => navigate("/community/write")}>
          글쓰기
        </Button>
      </div>

      <input
        placeholder="검색어를 입력하세요."
        className="w-full border rounded-xl p-3 mb-6"
      />

      <div className="flex gap-3 mb-8">
        <button className="bg-primary text-white rounded-full px-5 py-2">
          전체
        </button>

        <button className="border rounded-full px-5 py-2">
          자유
        </button>

        <button className="border rounded-full px-5 py-2">
          후기
        </button>

        <button className="border rounded-full px-5 py-2">
          질문
        </button>
      </div>

      <div className="space-y-5">
        {communityPosts.map((post) => (
          <CommunityCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </div>
  );
}