import { useNavigate } from "react-router-dom";
import type { CommunityPost } from "./communityDummy";

interface Props {
  post: CommunityPost;
}

export default function CommunityCard({ post }: Props) {
  const navigate = useNavigate();
  const authorInitial = post.author ? post.author.charAt(0) : "W";
  const displayDate = post.date === new Date().toLocaleDateString() ? "방금 전" : post.date;

  return (
    <div 
      onClick={() => navigate(`/community/${post.id}`)}
      className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-[#C48E96]/30 transition cursor-pointer flex flex-col gap-3 h-full"
    >
      
      <div className="flex items-center gap-2 mb-1">
        <span className="bg-orange-50 text-orange-400 text-xs font-bold px-3 py-1 rounded-full">
          {post.category}
        </span>
        <span className="text-gray-400 text-xs">{displayDate}</span>
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {post.content}
        </p>
      </div>

      <div className="flex justify-between items-center mt-3 pt-4 border-t border-gray-50">
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-pink-100 text-[#C48E96] flex items-center justify-center text-[10px] font-bold">
            {authorInitial}
          </div>
          <span className="text-sm text-gray-600">{post.author}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-400 text-xs">
          <span className="flex items-center gap-1">
            ♡ {post.likes}
          </span>
          <span className="flex items-center gap-1">
            💬 {post.comments}
          </span>
        </div>

      </div>
    </div>
  );
}
