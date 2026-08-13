import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  User,
} from "lucide-react";
import { Button, CategoryBadge } from "../../components";
import { useCommunity } from "./CommunityContext";

export default function CommunityDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { posts } = useCommunity();

  const post = posts.find(
    (item) => item.id === Number(id)
  );

  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const [comments, setComments] = useState([
    {
      id: 1,
      author: "예은",
      content: "축하드립니다!",
      date: "2026.07.23",
    },
    {
      id: 2,
      author: "건우",
      content: "좋은 장소에서 성공하시길 바랍니다.",
      date: "2026.07.23",
    },
  ]);

  useEffect(() => {
    if (post) {
      setLikes(post.likes);
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF9] text-gray-500">
        게시글을 찾을 수 없습니다.

        <br />

        <Button
          className="mt-4 rounded-full px-8 bg-gradient-to-r from-[#F89685] to-[#F2705C] border-none text-white"
          onClick={() => navigate("/community")}
        >
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  // 좋아요 - 더미 데이터 방식
  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  // 댓글 - 더미 데이터 방식
  const handleAddComment = () => {
    if (!commentInput.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: "나",
        content: commentInput,
        date: "방금 전",
      },
    ]);

    setCommentInput("");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] pt-20 pb-24">
      <div className="mx-auto max-w-4xl px-4">

        {/* 목록으로 */}
        <button
          onClick={() => navigate("/community")}
          className="mb-6 flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-gray-900 transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100 w-fit"
        >
          <ArrowLeft
            className="h-4 w-4"
            strokeWidth={2}
          />

          목록으로
        </button>

        {/* 게시글 */}
        <div className="rounded-[2rem] border border-gray-100 bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-8">

          {/* 카테고리 / 날짜 */}
          <div className="flex items-center gap-3 mb-6">
            <CategoryBadge
              category={post.category}
            />

            <span className="text-[13px] font-medium text-gray-400">
              {post.date}
            </span>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight leading-snug">
            {post.title}
          </h1>

          {/* 작성자 */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF0E8] text-[#E27D5F]">
              <User
                className="h-5 w-5"
                strokeWidth={2.5}
              />
            </div>

            <div>
              <p className="text-[15px] font-bold text-gray-800">
                {post.author}
              </p>

              <p className="text-[12px] font-medium text-gray-400 mt-0.5">
                작성자
              </p>
            </div>
          </div>

          <hr className="my-8 border-gray-100" />

          {/* 본문 */}
          <p className="min-h-[200px] whitespace-pre-line leading-relaxed text-[15px] text-gray-700">
            {post.content}
          </p>

          <hr className="my-8 border-gray-100" />

          {/* 좋아요 / 댓글 */}
          <div className="flex items-center justify-between">

            <div className="flex gap-6 text-[14px] font-medium text-gray-400">

              <span className="flex items-center gap-2">
                <Heart
                  className="h-5 w-5 text-red-400"
                  strokeWidth={2}
                />

                {likes}
              </span>

              <span className="flex items-center gap-2">
                <MessageCircle
                  className="h-5 w-5 text-[#F48171]"
                  strokeWidth={2}
                />

                {comments.length}
              </span>

            </div>

            {/* 좋아요 버튼 */}
            <button
              type="button"
              onClick={handleLike}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-6 py-3 text-[14px] font-bold transition-all ${
                hasLiked
                  ? "border-transparent bg-gradient-to-r from-[#F89685] to-[#F2705C] text-white shadow-md shadow-[#F2705C]/20"
                  : "border-gray-200 bg-white text-gray-600 hover:border-[#F48171]/40 hover:text-[#F48171] hover:bg-[#F48171]/5"
              }`}
            >
              <Heart
                className={
                  hasLiked
                    ? "h-5 w-5 fill-white"
                    : "h-5 w-5"
                }
                strokeWidth={2}
              />

              {hasLiked
                ? "좋아요 취소"
                : "좋아요"}
            </button>

          </div>
        </div>

        {/* 댓글 영역 */}
        <div className="rounded-[2rem] border border-gray-100 bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">

          <h2 className="mb-8 text-xl font-bold text-gray-900 flex items-center gap-2">
            댓글

            <span className="text-[#F48171] bg-[#FFF0E8] px-2.5 py-0.5 rounded-full text-[13px]">
              {comments.length}
            </span>
          </h2>

          {/* 댓글 목록 */}
          <div className="mb-10 flex flex-col gap-5">

            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-gray-50 pb-5 last:border-0 last:pb-0"
              >

                <div className="mb-2 flex items-center justify-between">

                  <div className="flex items-center gap-2.5">

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <User
                        className="h-4 w-4"
                        strokeWidth={2.5}
                      />
                    </div>

                    <strong className="text-[14px] text-gray-900">
                      {comment.author}
                    </strong>

                  </div>

                  <span className="text-[12px] font-medium text-gray-400">
                    {comment.date}
                  </span>

                </div>

                <p className="pl-9 text-[14px] leading-relaxed text-gray-600">
                  {comment.content}
                </p>

              </div>
            ))}

          </div>

          {/* 댓글 작성 */}
          <div className="mt-8 bg-gray-50/80 rounded-2xl p-2 border border-gray-100 focus-within:border-[#F48171]/40 focus-within:ring-4 focus-within:ring-[#F48171]/10 transition-all">

            <textarea
              rows={3}
              value={commentInput}
              onChange={(e) =>
                setCommentInput(e.target.value)
              }
              className="w-full resize-none bg-transparent p-4 text-[14px] outline-none placeholder:text-gray-400"
              placeholder="따뜻한 댓글을 남겨주세요."
            />

            <div className="flex justify-end p-2 border-t border-gray-200/50 mt-2">

              <Button
                className="px-8 py-2.5 rounded-full font-bold shadow-sm border-none bg-gradient-to-r from-[#F89685] to-[#F2705C] text-white disabled:opacity-50 disabled:from-gray-300 disabled:to-gray-300"
                onClick={handleAddComment}
                disabled={!commentInput.trim()}
              >
                등록
              </Button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
