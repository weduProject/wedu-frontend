import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Target,
} from "lucide-react";

import { Button } from "../../components";
import { useBuilder } from "./BuilderContext";
import BuilderOptionCard from "./BuilderOptionCard";
import { BuilderIcon } from "./builderIcons";

import {
  weddingHallList,
  seudeumeList,
  honeymoonList,
  budgetList,
} from "./builderDummy";

import {
  getLocalRecommendations,
  type RecommendedProduct,
} from "./builderApi";
import { fetchProducts, type DisplayProduct } from "../Shop/shopApi";

const steps = ["1", "2", "3", "4"];

const stepInfo = [
  {
    step: "Step 1",
    title: "어디서 프로포즈할까요?",
    subtitle: "원하는 장소를 하나 선택해주세요.",
  },
  {
    step: "Step 2",
    title: "어떤 분위기를 원하세요?",
    subtitle: "프로포즈의 전체적인 무드를 결정해주세요.",
  },
  {
    step: "Step 3",
    title: "어떤 음식이 어울릴까요?",
    subtitle: "프로포즈와 함께할 식사 스타일을 골라주세요.",
  },
  {
    step: "Step 4",
    title: "마지막 단계! 예산을 알려주세요.",
    subtitle: "전체 프로포즈 예산 범위를 선택해주세요.",
  },
];

export default function BuilderPage() {
  const navigate = useNavigate();

  const {
    builder,
    nextStep,
    prevStep,
    selectWeddingHall,
    selectSeudeume,
    selectHoneymoon,
    selectBudget,
  } = useBuilder();

    const currentStep = builder.step;
  const currentInfo = stepInfo[currentStep - 1];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [currentStep]);

  // 실제 상점 상품(fetchProducts) 목록을 한 번 불러와서, 예산까지 선택되면
  // "선택한 장르 + 원하는 가격대" 기준으로 그 안에서 추천 상품을 계산한다.
  // ⚠️ 2026-08-21: getLocalRecommendations는 이제 실제 상품 목록을 받아야 함
  // (가짜 id를 그대로 노출하면 이후 찜하기 등에서 404를 유발하기 때문 — builderApi.ts 참고).
  const [allProducts, setAllProducts] = useState<DisplayProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchProducts({ size: 100 })
      .then((products) => {
        if (!cancelled) setAllProducts(products);
      })
      .catch((error) => {
        console.warn("상품 목록 조회 실패, 추천 미리보기를 비웁니다:", error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const recommendedProducts: RecommendedProduct[] = builder.budget
    ? getLocalRecommendations(builder, allProducts)
    : [];

  const canNext =
    (currentStep === 1 && builder.weddingHall !== null) ||
    (currentStep === 2 && builder.seudeume !== null) ||
    (currentStep === 3 && builder.honeymoon !== null) ||
    (currentStep === 4 && builder.budget !== null);

  const handleNext = () => {
    if (!canNext) return;

    if (currentStep === 4) {
      navigate("/builder/cart");
      return;
    }

    nextStep();
  };

  const handlePrev = () => {
    if (currentStep === 1) {
      navigate("/builder-start");
      return;
    }

    prevStep();
  };

  const currentSelectedItem =
    currentStep === 1
      ? builder.weddingHall
      : currentStep === 2
        ? builder.seudeume
        : currentStep === 3
          ? builder.honeymoon
          : null;

  return (
    <div className="bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
      <div className="max-w-[900px] mx-auto px-5 py-16 md:px-8">
        {/* 상단 프로그레스 바 */}
        <div className="flex items-center justify-center mb-10">

          {steps.map((_, index) => {
            const stepNumber = index + 1;
            const completed = currentStep > stepNumber;
            const active = currentStep === stepNumber;

            return (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`
                    flex h-9 w-9 items-center justify-center rounded-full
                    text-sm font-bold transition-all
                    ${
                      completed || active
                        ? "bg-primary text-white shadow-sm"
                        : "border border-border bg-white text-text-muted"
                    }
                  `}
                >
                  {completed ? (
                    <Check
                      className="h-4 w-4"
                      strokeWidth={3}
                    />
                  ) : (
                    stepNumber
                  )}
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`
                      h-[2px] w-10 md:w-16
                      ${
                        currentStep > stepNumber
                          ? "bg-primary"
                          : "bg-border"
                      }
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 제목 */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex rounded-full bg-primary-light px-4 py-1.5 text-[13px] font-bold text-primary">
            {currentInfo.step}
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-text md:text-[32px]">
            {currentInfo.title}
          </h2>

          <p className="mt-3 text-[15px] text-text-muted">
            {currentInfo.subtitle}
          </p>
        </div>

        {/* STEP 1~3 */}
        {currentStep !== 4 && (
          <div className="animate-fade-in">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {currentStep === 1 &&
                weddingHallList.map((item) => (
                  <BuilderOptionCard
                    key={item.id}
                    title={item.name}
                    description={item.description}
                    tags={item.tags}
                    icon={item.icon}
                    showPrice={false}
                    selected={
                      builder.weddingHall?.id === item.id
                    }
                    onClick={() =>
                      selectWeddingHall(item)
                    }
                  />
                ))}

              {currentStep === 2 &&
                seudeumeList.map((item) => (
                  <BuilderOptionCard
                    key={item.id}
                    title={item.name}
                    description={item.description}
                    tags={item.tags}
                    icon={item.icon}
                    showPrice={false}
                    selected={
                      builder.seudeume?.id === item.id
                    }
                    onClick={() =>
                      selectSeudeume(item)
                    }
                  />
                ))}

              {currentStep === 3 &&
                honeymoonList.map((item) => (
                  <BuilderOptionCard
                    key={item.id}
                    title={item.name}
                    description={item.description}
                    tags={item.tags}
                    icon={item.icon}
                    showPrice={false}
                    selected={
                      builder.honeymoon?.id === item.id
                    }
                    onClick={() =>
                      selectHoneymoon(item)
                    }
                  />
                ))}
            </div>

            {/* 선택 결과 */}
            {currentSelectedItem && (
              <div className="mt-8 rounded-3xl border border-border bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <BuilderIcon icon={currentSelectedItem.icon} className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-xs font-medium text-text-muted">
                      현재 선택
                    </p>

                    <h3 className="truncate text-[16px] font-bold text-text">
                      {currentSelectedItem.name}
                    </h3>

                    <p className="mt-1 truncate text-sm text-text-muted">
                      {currentSelectedItem.description}
                    </p>
                  </div>

                  <div className="hidden shrink-0 flex-wrap justify-end gap-1.5 md:flex">
                    {currentSelectedItem.tags?.map(
                      (tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary-light px-3 py-1 text-[11px] font-bold text-primary"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div className="animate-fade-in space-y-8">

            {/* 선택 요약 */}
            <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-text">
                  지금까지의 선택
                </h3>

                <p className="mt-1 text-sm text-text-muted">
                  선택한 스타일을 한눈에 확인해보세요.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {[
                  {
                    label: "장소",
                    item: builder.weddingHall,
                  },
                  {
                    label: "분위기",
                    item: builder.seudeume,
                  },
                  {
                    label: "음식",
                    item: builder.honeymoon,
                  },
                ].map((data) => (
                  <div
                    key={data.label}
                    className="rounded-2xl bg-surface p-4"
                  >
                    <p className="mb-2 text-xs font-medium text-text-muted">
                      {data.label}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                        <BuilderIcon icon={data.item?.icon} className="h-5 w-5" />
                      </div>

                      <p className="truncate text-sm font-bold text-text">
                        {data.item?.name ?? "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 예산 */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-text">
                  예산을 선택해주세요
                </h3>

                <p className="mt-1 text-sm text-text-muted">
                  프로포즈에 사용할 예산을 선택해주세요.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {budgetList.map((item) => (
                  <BuilderOptionCard
                    key={item.id}
                    title={item.name}
                    description={item.description}
                    tags={item.tags}
                    icon={item.icon}
                    showPrice={false}
                    selected={
                      builder.budget?.id === item.id
                    }
                    onClick={() =>
                      selectBudget(item)
                    }
                  />
                ))}
              </div>
            </div>

            {/* 추천 상품 */}
            {builder.budget && (
              <div className="rounded-[2rem] border border-primary-light bg-surface p-6 md:p-8">

                <div className="mb-6 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                    <Target className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-text">
                        추천 상품
                      </h3>

                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-primary">
                        맞춤 추천
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-text-muted">
                      선택하신 스타일과 예산을 기준으로 추천해드려요.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {recommendedProducts.length > 0 ? (
                    recommendedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white bg-white p-4 shadow-sm"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                            <BuilderIcon icon={product.iconKey} className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-text">
                              {product.title}
                            </p>

                            <p className="mt-1 text-xs text-text-muted">
                              {product.category}
                            </p>
                          </div>
                        </div>

                        <span className="shrink-0 text-sm font-bold text-text">
                          {product.price.toLocaleString()}원
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-white p-6 text-center text-sm text-text-muted">
                      선택한 조건에 맞는 추천 상품이 없습니다.
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/70 px-4 py-3 text-xs text-text-muted">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                  다음 단계에서 추천 상품을 찜 목록에 담을 수 있습니다.
                </div>
              </div>
            )}
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">

          <Button
            variant="secondary"
            onClick={handlePrev}
            className="flex items-center gap-1 border-0 shadow-none"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canNext}
            className="flex items-center gap-1.5"
          >
            {currentStep === 1 && "다음: 분위기 선택"}
            {currentStep === 2 && "다음: 음식 선택"}
            {currentStep === 3 && "다음: 예산 확인"}

            {currentStep === 4 && (
              <>
                장바구니 보기
                <ShoppingCart className="h-4 w-4" />
              </>
            )}

            {currentStep !== 4 && (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}