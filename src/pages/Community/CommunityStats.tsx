import { useCommunity } from "./CommunityContext";

export default function CommunityStats() {
  const { posts } = useCommunity();

  const totalPosts = posts.length;

  const hotPosts = posts.filter(
    (post) => post.likes >= 10
  ).length;

  const totalComments = posts.reduce(
    (sum, post) => sum + post.comments,
    0
  );

  const today = new Date().toLocaleDateString();

  const todayPosts = posts.filter(
    (post) => post.date === today
  ).length;

  const stats = [
    {
      title: "게시글",
      value: totalPosts,
    },
    {
      title: "HOT",
      value: hotPosts,
    },
    {
      title: "오늘 작성",
      value: todayPosts,
    },
    {
      title: "댓글",
      value: totalComments,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-2xl shadow p-5 text-center"
        >
          <p className="text-gray-500 text-sm">
            {item.title}
          </p>

          <h2 className="text-3xl font-bold text-primary mt-2">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
