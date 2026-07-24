import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunity } from "./CommunityContext";
import { Button } from "../../components"; // 경로에 맞게 수정해주세요

const categories = [
  "프로포즈",
  "웨딩준비",
  "신혼생활", // 스크린샷에 맞춰 '신혼생활'로 통일
  "고민상담",
  "Tip공유",
];

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const { addPost } = useCommunity();

  const [category, setCategory] = useState("프로포즈");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const MAX_LENGTH = 3000;

  const handleSubmit = () => {
    // 유효성 검사 (빈칸 방지)
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    // Context의 addPost를 호출하여 상태에 새 글 추가
    addPost({
      title,
      category,
      content,
    });

    // 등록 완료 후 커뮤니티 메인 페이지로 이동
    navigate("/community");
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">글쓰기</h1>
        <p className="text-gray-500">경험과 정보를 자유롭게 공유해보세요</p>
      </div>

      {/* 폼 컨테이너 */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        
        {/* 1. 카테고리 선택 */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
            카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`
                  px-5 py-2.5 rounded-full text-sm font-medium transition
                  ${
                    category === cat
                      ? "bg-[#C48E96] text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2. 제목 입력 */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-[#C48E96] transition bg-gray-50/50 text-sm"
          />
        </div>

        {/* 3. 내용 입력 */}
        <div className="mb-10">
          <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
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
              className="w-full border border-gray-200 rounded-xl p-5 h-[300px] outline-none focus:border-[#C48E96] transition resize-none bg-gray-50/50 text-sm leading-relaxed"
            />
            {/* 글자 수 제한 UI */}
            <div className="absolute bottom-4 right-5 text-xs text-gray-400">
              {content.length.toLocaleString()}/{MAX_LENGTH.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 4. 하단 버튼 영역 */}
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="flex-1 py-4 text-base bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
            onClick={() => navigate(-1)} // 이전 페이지로 취소
          >
            취소
          </Button>
          <Button
            className="flex-1 py-4 text-base bg-[#C48E96] hover:bg-[#b07d84] text-white border-none"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()} // 둘 다 입력되어야 활성화
          >
            등록하기
          </Button>
        </div>
        
      </div>
    </div>
  );
}
