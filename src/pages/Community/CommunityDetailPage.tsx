import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components";
import { communityPosts } from "./communityDummy";

export default function CommunityDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const post = communityPosts.find(
    (item) => item.id === Number(id)
  );

  if (!post) {
    return (
      <div className="text-center mt-20">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="secondary"
        className="mb-6"
        onClick={() => navigate("/community")}
      >
        ← 목록으로
      </Button>

      <div className="bg-white rounded-2xl shadow p-8">
        <div className="flex justify-between items-center">
          <span className="text-primary font-semibold">
            {post.category}
          </span>

          <span className="text-gray-400">
            {post.date}
          </span>
        </div>

        <h1 className="text-3xl font-bold mt-3">
          {post.title}
        </h1>

        <p className="text-gray-500 mt-2">
          작성자 : {post.author}
        </p>

        <hr className="my-6" />

        <p className="leading-8 whitespace-pre-line">
          {post.content}
        </p>

        <hr className="my-6" />

        <div className="flex gap-6 text-gray-600">
          <span>❤️ {post.likes}</span>
          <span>💬 {post.comments}</span>
          <span>👀 {post.views}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h2 className="text-xl font-bold mb-5">
          댓글
        </h2>

        <div className="border-b py-3">
          <strong>예은</strong>
          <p className="text-gray-600 mt-1">
            축하드립니다!
          </p>
        </div>

        <div className="border-b py-3">
          <strong>건우</strong>
          <p className="text-gray-600 mt-1">
            좋은 장소에서 성공하시길 바랍니다.
          </p>
        </div>

        <div className="mt-8">
          <textarea
            rows={4}
            className="w-full border rounded-xl p-3"
            placeholder="댓글을 입력하세요."
          />

          <Button className="mt-3" disabled>
            댓글 작성 (준비중)
          </Button>
        </div>
      </div>
    </div>
  );
}
