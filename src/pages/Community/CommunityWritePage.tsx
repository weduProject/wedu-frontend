import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { useCommunity } from "./CommunityContext";

const categories = [
  "프로포즈",
  "웨딩준비",
  "신혼생활",
  "고민상담",
  "Tip공유",
];

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const { addPost } = useCommunity();

  const [category, setCategory] = useState("프로포즈");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_LENGTH = 3000;

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    try {
      addPost({
        title: title.trim(),
        category,
        content: content.trim(),
      });

      navigate("/community");
    } catch (error) {
      console.error("게시글 등록 오류:", error);
      alert("게시글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface pt-20 pb-24">
      <div className="mx-auto max-w-4xl px-4">

        {/* 제목 */}
        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 tracking-tight">
            글쓰기
          </h1>

          <p className="text-gray-500 text-[15px]">
            경험과 정보를 자유롭게 공유해보세요
          </p>
        </div>

        {/* 글쓰기 카드 */}
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">

          {/* 카테고리 */}
          <div className="mb-10">
            <label className="mb-4 block text-[15px] font-bold text-gray-700">
              카테고리
            </label>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-6 py-3 text-[14px] font-bold transition-all duration-300 ${
                    category === cat
                      ? "bg-gradient-to-r from-[#F89685] to-[#F2705C] text-white shadow-[0_4px_12px_rgba(242,112,92,0.3)]"
                      : "border border-gray-200 bg-white text-gray-500 hover:border-[#F48171]/40 shadow-sm"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div className="mb-10">
            <label className="mb-4 block text-[15px] font-bold text-gray-700">
              제목
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-[15px] outline-none transition-all focus:border-[#F48171] focus:ring-4 focus:ring-[#F48171]/10"
            />
          </div>

          {/* 내용 */}
          <div className="mb-12">
            <label className="mb-4 block text-[15px] font-bold text-gray-700">
              내용
            </label>

            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_LENGTH) {
                    setContent(e.target.value);
                  }
                }}
                placeholder="내용을 자유롭게 작성해보세요"
                className="h-[360px] w-full resize-none rounded-2xl border border-gray-200 bg-white p-6 text-[15px] leading-relaxed outline-none transition-all focus:border-[#F48171] focus:ring-4 focus:ring-[#F48171]/10"
              />

              <div className="absolute bottom-6 right-6 text-xs font-medium text-gray-400">
                {content.length.toLocaleString()} /{" "}
                {MAX_LENGTH.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <Button
              variant="secondary"
              className="flex-1 py-4.5 rounded-2xl text-[15px] font-bold"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              취소
            </Button>

            <Button
              className="flex-[2] py-4.5 rounded-2xl text-[15px] font-bold text-white transition-all shadow-md bg-gradient-to-r from-[#F89685] to-[#F2705C] hover:shadow-lg hover:shadow-[#F2705C]/20 border-none disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={
                !title.trim() ||
                !content.trim() ||
                isSubmitting
              }
            >
              {isSubmitting ? "등록 중..." : "등록하기"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
