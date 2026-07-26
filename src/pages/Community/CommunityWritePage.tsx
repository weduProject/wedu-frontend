import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunity } from "./CommunityContext";
import { Button } from "../../components";

const categories = ["프로포즈", "웨딩준비", "신혼생활", "고민상담", "Tip공유"];

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const { addPost } = useCommunity();

  const [category, setCategory] = useState("프로포즈");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const MAX_LENGTH = 3000;

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    addPost({ title, category, content });
    navigate("/community");
  };

  return (
    <div className="mx-auto max-w-[1024px]">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-text">글쓰기</h1>
        <p className="text-text-muted">경험과 정보를 자유롭게 공유해보세요</p>
      </div>

      <div className="rounded-xl border border-border bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="mb-8">
          <label className="mb-3 ml-1 block text-sm font-bold text-text">
            카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-primary text-white"
                    : "border border-border bg-white text-text hover:border-primary/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="mb-3 ml-1 block text-sm font-bold text-text">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full rounded-xl border border-border p-4 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>

        <div className="mb-10">
          <label className="mb-3 ml-1 block text-sm font-bold text-text">
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
              className="h-[300px] w-full resize-none rounded-xl border border-border p-5 text-sm leading-relaxed outline-none transition-colors focus:border-primary"
            />
            <div className="absolute bottom-4 right-5 text-xs text-text-muted">
              {content.length.toLocaleString()}/{MAX_LENGTH.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="flex-1 py-4 text-base"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button
            className="flex-1 py-4 text-base"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
          >
            등록하기
          </Button>
        </div>
      </div>
    </div>
  );
}