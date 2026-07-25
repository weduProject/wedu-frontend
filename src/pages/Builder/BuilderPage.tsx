import { Button } from "../../components"; 
import { useBuilder } from "./BuilderContext";
import BuilderOptionCard from "./BuilderOptionCard";
import { useNavigate } from "react-router-dom";
import {
  weddingHallList,
  seudeumeList,
  honeymoonList,
  budgetList,
} from "./builderDummy";
import { PRODUCTS, type Product } from "../Shop/shopData"; 

const steps = ["1", "2", "3", "4"];

const stepInfo = [
  { step: "Step 1", title: "어디서 프로포즈할까요?", subtitle: "원하는 장소를 하나 선택해주세요" },
  { step: "Step 2", title: "어떤 분위기를 원하세요?", subtitle: "프로포즈의 전체적인 무드를 결정해주세요" },
  { step: "Step 3", title: "어떤 음식이 어울릴까요?", subtitle: "프로포즈와 함께할 식사 스타일을 골라주세요" },
  { step: "Step 4", title: "마지막 단계! 예산을 알려주세요", subtitle: "전체 프로포즈 예산 범위를 선택해주세요" },
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

  const canNext =
    (currentStep === 1 && builder.weddingHall !== null) ||
    (currentStep === 2 && builder.seudeume !== null) ||
    (currentStep === 3 && builder.honeymoon !== null) ||
    (currentStep === 4 && builder.budget !== null);

  // 🚀 예산 총합 기반의 강력한 조합 추천 알고리즘
  const recommendedProducts = (() => {
    if (currentStep !== 4 || !builder.budget) return [];

    const userString = [
      builder.weddingHall?.name,
      ...(builder.weddingHall?.tags || []),
      builder.seudeume?.name,
      ...(builder.seudeume?.tags || []),
      builder.honeymoon?.name,
      ...(builder.honeymoon?.tags || []),
    ].filter(Boolean).join(" ");

    const budgetId = builder.budget.id;
    let minBudget = 0;
    let maxBudget = Infinity;

    if (budgetId === 1) maxBudget = 1000000;
    else if (budgetId === 2) { minBudget = 1000000; maxBudget = 2000000; }
    else if (budgetId === 3) { minBudget = 2000000; maxBudget = 3000000; }
    else if (budgetId === 4) { minBudget = 3000000; maxBudget = 5000000; }
    else if (budgetId === 5) { minBudget = 5000000; }

    const scoredProducts = PRODUCTS.map((product: Product) => {
      let score = 0;
      product.tags.forEach((tag) => { if (userString.includes(tag)) score += 3; });
      product.styles.forEach((style) => { if (userString.includes(style)) score += 2; });

      const placeName = builder.weddingHall?.name || "";
      const vibeName = builder.seudeume?.name || "";
      const foodName = builder.honeymoon?.name || "";

      if (placeName.includes("호텔") && product.title.includes("호텔")) score += 15;
      if (placeName.includes("야외") && product.tags.includes("해변")) score += 15;
      if (placeName.includes("루프탑") && product.tags.includes("야간")) score += 15;
      if (vibeName.includes("로맨틱") && product.title.includes("플라워")) score += 15;
      if (vibeName.includes("감성") && product.title.includes("포토")) score += 15;
      if (vibeName.includes("우아한") && product.title.includes("현악")) score += 15;
      if (foodName.includes("다이닝") && product.title.includes("다이닝")) score += 15;
      if (foodName.includes("오마카세") && product.title.includes("커스텀")) score += 10;

      const priceNum = parseInt(product.price.replace(/[^0-9]/g, "")) * 10000;
      return { ...product, score, priceNum };
    });

    let bestCombo: typeof scoredProducts | null = null;
    let maxComboScore = -1;
    let closestCombo: typeof scoredProducts | null = null;
    let minPriceDiff = Infinity;

    // 3개 상품의 조합을 모두 탐색하여 예산에 맞는 최적의 세트 찾기
    for (let i = 0; i < scoredProducts.length - 2; i++) {
      for (let j = i + 1; j < scoredProducts.length - 1; j++) {
        for (let k = j + 1; k < scoredProducts.length; k++) {
          const combo = [scoredProducts[i], scoredProducts[j], scoredProducts[k]];
          const totalPrice = combo[0].priceNum + combo[1].priceNum + combo[2].priceNum;
          
          let comboScore = combo[0].score + combo[1].score + combo[2].score;
          const categories = new Set(combo.map(c => c.categoryType));
          if (categories.size === 3) comboScore += 20; // 다양한 카테고리면 가산점
          comboScore += Math.random(); 

          if (totalPrice >= minBudget && totalPrice <= maxBudget) {
            if (comboScore > maxComboScore) {
              maxComboScore = comboScore;
              bestCombo = combo;
            }
          }

          let diff = 0;
          if (totalPrice < minBudget) diff = minBudget - totalPrice;
          if (totalPrice > maxBudget) diff = totalPrice - maxBudget;

          if (diff < minPriceDiff) {
            minPriceDiff = diff;
            closestCombo = combo;
          } else if (diff === minPriceDiff && comboScore > (closestCombo ? closestCombo.reduce((a,c)=>a+c.score,0) : 0)) {
            closestCombo = combo;
          }
        }
      }
    }

    const finalCombo = bestCombo || closestCombo || scoredProducts.slice(0, 3);

    return finalCombo.sort((a,b) => b.score - a.score).map((p) => ({
      id: p.id,
      title: p.title,
      categoryType: p.categoryType,
      price: p.price,
      icon: p.category.split(" ")[0] || "✨"
    }));
  })();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Stepper 생략 없이 기존과 동일하게 유지 */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((_, index) => {
          const stepNumber = index + 1;
          const completed = currentStep > stepNumber;
          const active = currentStep === stepNumber;

          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition
                  ${completed || active ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}
                `}
              >
                {completed ? "✓" : stepNumber}
              </div>
              {index !== steps.length - 1 && (
                <div className={`w-12 h-[2px] mx-2 ${currentStep > stepNumber ? "bg-primary" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mb-10">
        <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full mb-3 inline-block">
          {currentInfo.step}
        </span>
        <h2 className="text-3xl font-bold mb-2">{currentInfo.title}</h2>
        <p className="text-gray-500">{currentInfo.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl p-2">
        {currentStep !== 4 ? (
          <div>
            <p className="text-sm font-bold text-gray-700 mb-4 ml-1">모든 옵션</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStep === 1 && weddingHallList.map((item) => (
                <BuilderOptionCard key={item.id} title={item.name} description={item.description} tags={item.tags} icon={item.icon} showPrice={false} selected={builder.weddingHall?.id === item.id} onClick={() => selectWeddingHall(item)} />
              ))}
              {currentStep === 2 && seudeumeList.map((item) => (
                <BuilderOptionCard key={item.id} title={item.name} description={item.description} tags={item.tags} icon={item.icon} showPrice={false} selected={builder.seudeume?.id === item.id} onClick={() => selectSeudeume(item)} />
              ))}
              {currentStep === 3 && honeymoonList.map((item) => (
                <BuilderOptionCard key={item.id} title={item.name} description={item.description} tags={item.tags} icon={item.icon} showPrice={false} selected={builder.honeymoon?.id === item.id} onClick={() => selectHoneymoon(item)} />
              ))}
            </div>
            
            <div className="mt-8 animate-fade-in">
              {currentStep === 1 && builder.weddingHall && (
                <BuilderOptionCard title={builder.weddingHall.name} description={builder.weddingHall.description} tags={builder.weddingHall.tags} icon={builder.weddingHall.icon} showPrice={false} selected={true} onClick={() => {}} showCheckmark={false} />
              )}
              {currentStep === 2 && builder.seudeume && (
                <BuilderOptionCard title={builder.seudeume.name} description={builder.seudeume.description} tags={builder.seudeume.tags} icon={builder.seudeume.icon} showPrice={false} selected={true} onClick={() => {}} showCheckmark={false} />
              )}
              {currentStep === 3 && builder.honeymoon && (
                <BuilderOptionCard title={builder.honeymoon.name} description={builder.honeymoon.description} tags={builder.honeymoon.tags} icon={builder.honeymoon.icon} showPrice={false} selected={true} onClick={() => {}} showCheckmark={false} />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">지금까지의 선택</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{builder.weddingHall?.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500">장소</p>
                      <p className="font-bold">{builder.weddingHall?.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{builder.seudeume?.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500">분위기</p>
                      <p className="font-bold">{builder.seudeume?.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{builder.honeymoon?.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500">음식</p>
                      <p className="font-bold">{builder.honeymoon?.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-700 mb-4 ml-1">예산 범위</p>
              <div className="grid grid-cols-2 gap-4">
                {budgetList?.map((item) => (
                  <BuilderOptionCard key={item.id} title={item.name} description={item.description} tags={item.tags} icon={item.icon} showPrice={false} selected={builder.budget?.id === item.id} onClick={() => selectBudget(item)} />
                ))}
              </div>
            </div>

            {builder.budget && (
              <div className="mt-12 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">🚀 추천 상품</h3>
                  <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    선택한 예산 및 스타일 일치
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-5">
                  선택하신 예산 범위 내에서 최적의 상품 조합을 찾아 구성했습니다.
                </p>
                
                <div className="space-y-3">
                  {recommendedProducts.map((p) => (
                    <div key={p.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-primary/30 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-lg text-lg">
                          {p.icon}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{p.title}</p>
                          <p className="text-xs text-gray-500">{p.categoryType}</p>
                        </div>
                      </div>
                      <span className="font-bold text-sm">{p.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        )}

        <div className="flex justify-between items-center gap-3 mt-12 border-t pt-6">
          <Button variant="secondary" onClick={() => { if (currentStep === 1) navigate("/builder-start"); else prevStep(); }}>
            ← 이전
          </Button>

          {currentStep === 4 ? (
            <Button onClick={() => navigate("/builder/cart")} disabled={!canNext}>
              플랜 생성하고 장바구니 보기 🛒
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={!canNext}>
              {currentStep === 1 && "다음: 분위기 선택 →"}
              {currentStep === 2 && "다음: 음식 선택 →"}
              {currentStep === 3 && "다음: 예산 확인 →"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
