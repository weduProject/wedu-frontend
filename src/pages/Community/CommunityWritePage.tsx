import { useNavigate } from "react-router-dom";
import { Button } from "../../components";

export default function CommunityWritePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        글쓰기
      </h1>

      <div className="bg-white rounded-2xl shadow p-8">
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            제목
          </label>

          <input
            className="w-full border rounded-xl p-3"
            placeholder="제목을 입력하세요."
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            카테고리
          </label>

          <select className="w-full border rounded-xl p-3">
            <option>자유</option>
            <option>후기</option>
            <option>질문</option>
            <option>정보</option>
          </select>
        </div>

        <div className="mb-8">
          <label className="block font-semibold mb-2">
            내용
          </label>

          <textarea
            rows={10}
            className="w-full border rounded-xl p-3"
            placeholder="내용을 입력하세요."
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>

          <Button>
            등록
          </Button>
        </div>
      </div>
    </div>
  );
}