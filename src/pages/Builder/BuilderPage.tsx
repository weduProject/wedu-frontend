import { Button } from "../../components";

const steps = [
  "웨딩홀",
  "스드메",
  "허니문",
  "최종 확인",
];

export default function BuilderPage() {
  const currentStep = 1;

  const totalPrice =
    3500000 +
    2500000 +
    4000000;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        나만의 프로포즈
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-10">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`rounded-xl p-4 text-center font-semibold ${
              currentStep === index + 1
                ? "bg-primary text-white"
                : "bg-gray-100"
            }`}
          >
            <div className="text-lg">{index + 1}</div>
            <div>{step}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6">
          1단계 · 웨딩홀 선택
        </h2>

        <div className="space-y-4">
          <div className="border rounded-xl p-4 flex justify-between">
            <span>웨딩홀</span>
            <span>강남 웨딩홀</span>
          </div>

          <div className="border rounded-xl p-4 flex justify-between">
            <span>스드메</span>
            <span>프리미엄 패키지</span>
          </div>

          <div className="border rounded-xl p-4 flex justify-between">
            <span>허니문</span>
            <span>몰디브</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-6 mt-8">
          <h2 className="text-xl font-bold">
            예상 견적
          </h2>

          <span className="text-2xl font-bold text-primary">
            {totalPrice.toLocaleString()}원
          </span>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="secondary">
            이전
          </Button>

          <Button>
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}