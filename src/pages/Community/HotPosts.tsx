import CommunityCard from "./CommunityCard";
import type { CommunityPost } from "./communityDummy";

interface HotPostsProps {
  posts: CommunityPost[];
}

export default function HotPosts({
  posts,
}: HotPostsProps) {
  const hotPosts = [...posts]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  if (hotPosts.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">🔥</span>

        <h2 className="text-2xl font-bold">
          인기 게시글
        </h2>
      </div>

      <div className="space-y-5">
        {hotPosts.map((post) => (
          <CommunityCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </div>
  );
}
