import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, User } from "lucide-react";
import { Button, CategoryBadge } from "../../components";
import { useCommunity } from "./CommunityContext";

export default function CommunityDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { posts } = useCommunity();
  const post = posts.find((item) => item.id === Number(id));

  const cameFromMagazine = (location.state as { from?: string } | null)?.from === 'magazine';
  const backPath = cameFromMagazine ? '/magazine' : '/community';
  const backLabel = cameFromMagazine ? '매거진으로 돌아가기' : '목록으로';

  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([
    { id: 1, author: "예은", content: "축하드립니다!", date: "2026.07.23" },
    { id: 2, author: "건우", content: "좋은 장소에서 성공하시길 바랍니다.", date: "2026.07.23" },
  ]);

  useEffect(() => {
    if (post) setLikes(post.likes);
  }, [post]);

  if (!post) {
    return (
      <div className="bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8 flex min-h-[calc(100dvh-80px)] flex-col items-center justify-center text-text-muted md:min-h-[calc(100dvh-96px)]">
        게시글을 찾을 수 없습니다.
        <Button className="mt-4" onClick={() => navigate(backPath)}>
          {backLabel}
        </Button>
      </div>
    );
  }

  const handleLike = () => {
    setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
    setHasLiked((prev) => !prev);
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    setComments((prev) => [...prev, { id: Date.now(), author: "나", content: commentInput, date: "방금 전" }]);
    setCommentInput("");
  };

  return (
    <div className="bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 md:px-8">
        <button
          onClick={() => navigate(backPath)}
          className="mb-6 flex w-fit items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-[13px] font-bold text-text-muted shadow-sm transition-colors hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          {backLabel}
        </button>

        {/* 게시글 */}
        <div className="mb-8 rounded-2xl border border-border bg-white p-8 shadow-sm md:p-12">
          <div className="mb-6 flex items-center gap-3">
            <CategoryBadge category={post.category} />
            <span className="text-[13px] font-medium text-text-muted">{post.date}</span>
          </div>

          <h1 className="text-2xl font-bold leading-snug tracking-tight text-text md:text-[28px] font-serif">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
              <User className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[15px] font-bold text-text">{post.author}</p>
              <p className="mt-0.5 text-xs font-medium text-text-muted">작성자</p>
            </div>
          </div>

          <hr className="my-8 border-border" />

          <p className="min-h-[200px] whitespace-pre-line text-[15px] leading-relaxed text-text">{post.content}</p>

          <hr className="my-8 border-border" />

          <div className="flex items-center justify-between">
            <div className="flex gap-6 text-sm font-medium text-text-muted">
              <span className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" strokeWidth={2} />
                {likes}
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" strokeWidth={2} />
                {comments.length}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLike}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition-all ${
                hasLiked
                  ? "gradient-primary-bg border-transparent text-white shadow-gradient-primary"
                  : "border-border bg-white text-text-muted hover:border-primary/40 hover:bg-primary-light hover:text-primary"
              }`}
            >
              <Heart className={hasLiked ? "h-5 w-5 fill-white" : "h-5 w-5"} strokeWidth={2} />
              {hasLiked ? "좋아요 취소" : "좋아요"}
            </button>
          </div>
        </div>

        {/* 댓글 영역 */}
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm md:p-12">
          <h2 className="mb-8 flex items-center gap-2 text-xl font-bold text-text font-serif">
            댓글
            <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-[13px] text-primary">
              {comments.length}
            </span>
          </h2>

          <div className="mb-10 flex flex-col gap-5">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-border pb-5 last:border-0 last:pb-0">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-primary">
                      <User className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                    <strong className="text-sm text-text">{comment.author}</strong>
                  </div>
                  <span className="text-xs font-medium text-text-muted">{comment.date}</span>
                </div>
                <p className="pl-9 text-sm leading-relaxed text-text-muted">{comment.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-surface p-2 transition-all focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
            <textarea
              rows={3}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full resize-none bg-transparent p-4 text-sm outline-none placeholder:text-text-muted"
              placeholder="따뜻한 댓글을 남겨주세요."
            />
            <div className="mt-2 flex justify-end border-t border-border/60 p-2">
              <Button onClick={handleAddComment} disabled={!commentInput.trim()}>
                등록
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}