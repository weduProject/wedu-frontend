import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, User } from "lucide-react";
import type { CommunityPost } from "./communityDummy";

interface Props {
  post: CommunityPost;
}

export default function CommunityCard({ post }: Props) {
  const navigate = useNavigate();
  const displayDate = post.date === new Date().toLocaleDateString() ? "방금 전" : post.date;

  return (
    <div
      onClick={() => navigate(`/community/${post.id}`)}
      className="group flex h-full cursor-pointer flex-col gap-4 rounded-[1.5rem] border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-[#F48171]/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-1"
    >
      <div className="flex items-center gap-3 mb-1">
        <span className="rounded-full bg-[#FFF0E8] px-3 py-1 text-[11px] font-bold text-[#E27D5F]">
          {post.category}
        </span>
        <span className="text-[12px] font-medium text-gray-400">{displayDate}</span>
      </div>

      <div className="flex-1 mt-1">
        <h3 className="mb-2 truncate text-[17px] font-bold text-gray-900 group-hover:text-[#F48171] transition-colors">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-[14px] leading-relaxed text-gray-500">
          {post.content}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          {/* 사람 형태의 기본 프로필 아이콘 적용 */}
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF0E8] text-[#E27D5F]">
            <User className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="text-[13px] font-bold text-gray-600">{post.author}</span>
        </div>

        <div className="flex items-center gap-3 text-[12px] font-medium text-gray-400">
          <span className="flex items-center gap-1.5 group-hover:text-red-400 transition-colors">
            <Heart className="h-3.5 w-3.5" strokeWidth={2} />
            {post.likes}
          </span>
          <span className="flex items-center gap-1.5 group-hover:text-[#F48171] transition-colors">
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
            {post.comments}
          </span>
        </div>
      </div>
    </div>
  );
}
