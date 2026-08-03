import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { Button, CategoryBadge } from "../../components";
import { useCommunity } from "./CommunityContext";

export default function CommunityDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { posts } = useCommunity();

  const post = posts.find((item) => item.id === Number(id));

  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([
    { id: 1, author: "예은", content: "축하드립니다!", date: "2026.07.23" },
    {
      id: 2,
      author: "건우",
      content: "좋은 장소에서 성공하시길 바랍니다.",
      date: "2026.07.23",
    },
  ]);

  useEffect(() => {
    if (post) setLikes(post.likes);
  }, [post]);

  if (!post) {
    return (
      <div className="mx-auto max-w-5xl py-20 text-center text-text-muted">
        게시글을 찾을 수 없습니다.
        <br />
        <Button className="mt-4" onClick={() => navigate("/community")}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;

    setComments([
      ...comments,
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
    <div className="mx-auto max-w-5xl">
      <Button
        variant="secondary"
        className="mb-6 flex items-center gap-1.5"
        onClick={() => navigate("/community")}
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        목록으로
      </Button>

      <div className="rounded-xl border border-border bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <CategoryBadge category={post.category} />
          <span className="text-sm text-text-muted">{post.date}</span>
        </div>

        <h1 className="mt-3 text-3xl font-bold text-text">{post.title}</h1>

        <p className="mt-2 text-sm text-text-muted">작성자 : {post.author}</p>

        <hr className="my-6 border-border" />

        <p className="min-h-37.5 whitespace-pre-line leading-8 text-text">
          {post.content}
        </p>

        <hr className="my-6 border-border" />

        <div className="flex items-center justify-between">
          <div className="flex gap-6 text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" strokeWidth={1.8} />
              {likes}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
              {comments.length}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLike}
            className={`flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
              hasLiked
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-text hover:border-primary/40"
            }`}
          >
            <Heart
              className={hasLiked ? "h-4 w-4 fill-white" : "h-4 w-4"}
              strokeWidth={1.8}
            />
            좋아요
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h2 className="mb-6 text-xl font-bold text-text">
          댓글 <span className="text-primary">{comments.length}</span>
        </h2>

        <div className="mb-8 flex flex-col gap-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-border pb-4">
              <div className="mb-1 flex items-center justify-between">
                <strong className="text-sm text-text">{comment.author}</strong>
                <span className="text-xs text-text-muted">{comment.date}</span>
              </div>
              <p className="mt-1 text-sm text-text-muted">{comment.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <textarea
            rows={3}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="w-full resize-none rounded-xl border border-border p-4 text-sm outline-none transition-colors focus:border-primary"
            placeholder="댓글을 입력하세요."
          />

          <Button
            className="mt-3 px-6"
            onClick={handleAddComment}
            disabled={!commentInput.trim()}
          >
            댓글 작성
          </Button>
        </div>
      </div>
    </div>
  );
}