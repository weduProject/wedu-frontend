import { Button } from "../../components";
import { useBuilder } from "./BuilderContext";
import BuilderOptionCard from "./BuilderOptionCard";
import {
  weddingHallList,
  seudeumeList,
  honeymoonList,
} from "./builderDummy";

const steps = [
  "웨딩홀",
  "스드메",
  "허니문",
  "최종 확인",
];

export default function BuilderPage() {
  const {
    builder,
    nextStep,
    prevStep,
    reset,
    totalPrice,
    selectWeddingHall,
    selectSeudeume,
    selectHoneymoon,
  } = useBuilder();

  const currentStep = builder.step;

  const canNext =
    (currentStep === 1 && builder.weddingHall !== "") ||
    (currentStep === 2 && builder.seudeume !== "") ||
    (currentStep === 3 && builder.honeymoon !== "") ||
    currentStep === 4;

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
          {steps[currentStep - 1]}
        </h2>

        <div className="space-y-4">
          {currentStep === 1 &&
            weddingHallList.map((item) => (
              <BuilderOptionCard
                key={item.id}
                title={item.name}
                price={item.price}
                selected={builder.weddingHall === item.name}
                onClick={() => selectWeddingHall(item)}
              />
            ))}

          {currentStep === 2 &&
            seudeumeList.map((item) => (
              <BuilderOptionCard
                key={item.id}
                title={item.name}
                price={item.price}
                selected={builder.seudeume === item.name}
                onClick={() => selectSeudeume(item)}
              />
            ))}

          {currentStep === 3 &&
            honeymoonList.map((item) => (
              <BuilderOptionCard
                key={item.id}
                title={item.name}
                price={item.price}
                selected={builder.honeymoon === item.name}
                onClick={() => selectHoneymoon(item)}
              />
            ))}

          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="border rounded-xl p-4 flex justify-between">
                <span>웨딩홀</span>
                <span>{builder.weddingHall}</span>
              </div>

              <div className="border rounded-xl p-4 flex justify-between">
                <span>스드메</span>
                <span>{builder.seudeume}</span>
              </div>

              <div className="border rounded-xl p-4 flex justify-between">
                <span>허니문</span>
                <span>{builder.honeymoon}</span>
              </div>

              <div className="rounded-xl bg-primary/10 p-5 text-center">
                <h3 className="text-xl font-bold mb-2">
                  예상 총 견적
                </h3>

                <p className="text-3xl font-bold text-primary">
                  {totalPrice.toLocaleString()}원
                </p>

                <p className="text-gray-500 mt-3">
                  선택한 항목을 확인한 후 프로포즈 플랜을 완성하세요.
                </p>
              </div>
            </div>
          )}
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
          {currentStep === 4 ? (
            <>
              <Button
                variant="secondary"
                onClick={reset}
              >
                처음부터
              </Button>

              <Button
                onClick={() =>
                  alert("프로포즈 플랜이 완성되었습니다!")
                }
              >
                완료하기
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                이전
              </Button>

              <Button
                onClick={nextStep}
                disabled={!canNext}
              >
                다음
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
