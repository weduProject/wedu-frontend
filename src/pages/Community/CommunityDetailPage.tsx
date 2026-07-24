import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    { id: 1, author: "예은", content: "축하드립니다!", date: "2026.07.23" },
    { id: 2, author: "건우", content: "좋은 장소에서 성공하시길 바랍니다.", date: "2026.07.23" },
  ]);

  useEffect(() => {
    if (post) setLikes(post.likes);
  }, [post]);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center text-gray-500">
        게시글을 찾을 수 없습니다.
        <br />
        <Button className="mt-4" onClick={() => navigate("/community")}>목록으로 돌아가기</Button>
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

    const newComment = {
      id: Date.now(),
      author: "나",
      content: commentInput,
      date: "방금 전",
    };

    setComments([...comments, newComment]);
    setCommentInput("");
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Button
        variant="secondary"
        className="mb-6"
        onClick={() => navigate("/community")}
      >
        ← 목록으로
      </Button>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="flex justify-between items-center">
          <CategoryBadge category={post.category} />

          <span className="text-gray-400 text-sm">
            {post.date}
          </span>
        </div>

        <h1 className="text-3xl font-bold mt-3">
          {post.title}
        </h1>

        <p className="text-gray-500 mt-2 text-sm">
          작성자 : {post.author}
        </p>

        <hr className="my-6 border-gray-100" />

        <p className="leading-8 whitespace-pre-line text-gray-700 min-h-[150px]">
          {post.content}
        </p>

        <hr className="my-6 border-gray-100" />

        <div className="flex justify-between items-center">
          <div className="flex gap-6 text-gray-400 text-sm">
            <span>❤️ {likes}</span>
            <span>💬 {comments.length}</span>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition shadow-sm border ${
              hasLiked 
                ? "bg-[#C48E96] text-white border-[#C48E96]" 
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {hasLiked ? "♥" : "♡"} 좋아요
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mt-8">
        <h2 className="text-xl font-bold mb-6">
          댓글 <span className="text-[#C48E96]">{comments.length}</span>
        </h2>

        <div className="space-y-4 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-50 pb-4">
              <div className="flex justify-between items-center mb-1">
                <strong className="text-sm text-gray-800">{comment.author}</strong>
                <span className="text-xs text-gray-400">{comment.date}</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                {comment.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <textarea
            rows={3}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-[#C48E96] transition bg-gray-50/50 text-sm resize-none"
            placeholder="댓글을 입력하세요."
          />

          <Button 
            className="mt-3 bg-[#C48E96] hover:bg-[#b07d84] border-none px-6" 
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
