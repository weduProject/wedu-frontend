import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import type { CommunityPost } from "./communityDummy";

interface Props {
  post: CommunityPost;
}

export default function CommunityCard({ post }: Props) {
  const navigate = useNavigate();
  const authorInitial = post.author ? post.author.charAt(0) : "W";
  const displayDate =
    post.date === new Date().toLocaleDateString() ? "방금 전" : post.date;

  return (
    <div
      onClick={() => navigate(`/community/${post.id}`)}
      className="flex h-full cursor-pointer flex-col gap-3 rounded-xl border border-border bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors hover:border-primary/40"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
          {post.category}
        </span>
        <span className="text-xs text-text-muted">{displayDate}</span>
      </div>

      <div className="flex-1">
        <h3 className="mb-2 truncate text-lg font-bold text-text">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
          {post.content}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-light text-[10px] font-semibold text-primary">
            {authorInitial}
          </div>
          <span className="text-sm text-text">{post.author}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" strokeWidth={1.8} />
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            {post.comments}
          </span>
        </div>
      </div>
    </div>
  );
}