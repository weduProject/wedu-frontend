import type { CommunityPost } from "./communityDummy";
import { Link } from "react-router-dom";
import { CategoryBadge } from "../../components";

interface Props {
  post: CommunityPost;
}

export default function CommunityCard({ post }: Props) {
  return (
    <Link
      to={`/community/${post.id}`}
      className="block bg-white rounded-2xl shadow p-5 hover:shadow-lg transition"
    >
      <div className="flex justify-between">
        <CategoryBadge category={post.category} />

        <span className="text-gray-400 text-sm">
          {post.date}
        </span>
      </div>

      <h2 className="text-xl font-bold mt-3">
        {post.title}
      </h2>

      <p className="text-gray-500 mt-2">
        작성자 : {post.author}
      </p>

      <div className="flex gap-5 mt-4 text-sm text-gray-600">
        <span>❤️ {post.likes}</span>
        <span>💬 {post.comments}</span>
        <span>👀 {post.views}</span>
      </div>
    </Link>
  );
}
