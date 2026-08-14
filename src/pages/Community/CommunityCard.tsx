import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, User } from "lucide-react";
import type { CommunityPost } from "./CommunityContext";

interface Props {
  post: CommunityPost;
}

export default function CommunityCard({ post }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/community/${post.id}`)}
      className="group flex h-full cursor-pointer flex-col gap-4 rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-1"
    >
      {/* 카테고리 / 날짜 */}
      <div className="mb-1 flex items-center gap-3">
        <span className="rounded-full bg-rosegold-1/40 px-3 py-1 text-[11px] font-bold text-rosegold-3">
          {post.category}
        </span>
        <span className="text-xs font-medium text-text-muted">{post.date}</span>
      </div>

      {/* 제목 / 내용 */}
      <div className="mt-1 flex-1">
        <h3 className="mb-2 truncate text-[17px] font-bold text-text transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">{post.content}</p>
      </div>

      {/* 작성자 / 좋아요 / 댓글 */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-primary">
            <User className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="text-[13px] font-bold text-text">{post.author}</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-text-muted">
          <span className="flex items-center gap-1.5 transition-colors group-hover:text-primary">
            <Heart className="h-3.5 w-3.5" strokeWidth={2} />
            {post.likes}
          </span>
          <span className="flex items-center gap-1.5 transition-colors group-hover:text-primary">
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
            {post.comments}
          </span>
        </div>
      </div>
    </div>
  );
}