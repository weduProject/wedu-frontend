import { useEffect } from "react";
import { useBuilder } from "./BuilderContext";
import BuilderOptionCard from "./BuilderOptionCard";
import { useNavigate } from "react-router-dom";
import {
  weddingHallList,
  seudeumeList,
  honeymoonList,
  budgetList,
} from "./builderDummy";
import { getRecommendedProducts } from "./builderUtils"; 

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

  // 단계(step)가 바뀔 때마다 무조건 화면 맨 위로 스크롤 이동
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [currentStep]);

  const canNext =
    (currentStep === 1 && builder.weddingHall !== null) ||
    (currentStep === 2 && builder.seudeume !== null) ||
    (currentStep === 3 && builder.honeymoon !== null) ||
    (currentStep === 4 && builder.budget !== null);

  const recommendedProducts = getRecommendedProducts(builder);

  const handleNext = () => {
    if (currentStep === 4) {
      navigate("/builder/cart");
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (currentStep === 1) {
      navigate("/builder-start");
    } else {
      prevStep();
    }
  };

  const currentSelectedItem = 
    currentStep === 1 ? builder.weddingHall :
    currentStep === 2 ? builder.seudeume :
    currentStep === 3 ? builder.honeymoon : null;

  return (
    <div className="min-h-screen bg-[#FDFBF9] pt-20 pb-32">
      <div className="max-w-[900px] mx-auto px-4">
        {/* 상단 프로그레스 바 */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((_, index) => {
            const stepNumber = index + 1;
            const completed = currentStep > stepNumber;
            const active = currentStep === stepNumber;

            return (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-[15px] font-bold transition-all duration-300 shadow-sm
                    ${completed || active ? "bg-[#F48171] text-white" : "bg-white text-gray-400 border border-gray-200"}
                  `}
                >
                  {completed ? "✓" : stepNumber}
                </div>
                {index !== steps.length - 1 && (
                  <div className={`w-10 md:w-16 h-[2px] transition-colors duration-300 ${currentStep > stepNumber ? "bg-[#F48171]" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mb-12">
          <span className="text-[#F48171] font-bold text-[13px] bg-[#FFF5F4] px-4 py-1.5 rounded-full mb-4 inline-block">
            {currentInfo.step}
          </span>
          <h2 className="text-2xl md:text-[32px] font-bold mb-3 text-gray-900 tracking-tight">{currentInfo.title}</h2>
          <p className="text-gray-500 text-[15px]">{currentInfo.subtitle}</p>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div>
          {currentStep !== 4 ? (
            <div className="animate-fade-in max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-10">
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

              {currentSelectedItem && (
                <div className="mt-12 p-6 flex flex-col md:flex-row md:items-center gap-5 bg-grey rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] animate-fade-in">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="text-3xl w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl">{currentSelectedItem.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[17px] text-gray-900">{currentSelectedItem.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mt-1 line-clamp-1">{currentSelectedItem.description}</p>
                    </div>
                  </div>
                  
                  {/* 우측 핑크색 태그 영역 */}
                  <div className="flex flex-wrap gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:pl-5 border-gray-100/70">
                    {currentSelectedItem.tags?.map(tag => (
                      <span key={tag} className="rounded-full bg-[#FFF5F4] px-4 py-1.5 text-[11px] font-bold text-[#F48171]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Step 4 (예산/추천) 영역
            <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
              {/* 요약 카드 */}
              <div className="bg-[#F8F9FA] rounded-[2rem] p-8 md:p-10 border border-gray-100/50">
                <h3 className="font-bold text-[17px] mb-6 text-gray-900">지금까지의 선택</h3>
                <div className="space-y-4">
                  {[
                    { label: "장소", item: builder.weddingHall },
                    { label: "분위기", item: builder.seudeume },
                    { label: "음식", item: builder.honeymoon },
                  ].map((data, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-transparent pb-4 border-b border-gray-200/60 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl w-10 text-center">{data.item?.icon}</span>
                        <div>
                          <p className="text-[12px] text-gray-500 font-medium">{data.label}</p>
                          <p className="font-bold text-[15px] text-gray-900 mt-0.5">{data.item?.name}</p>
                        </div>
                      </div>
                      <button className="text-[#F48171] text-[13px] font-bold px-3 py-1.5 hover:bg-[#F48171]/10 rounded-lg transition-colors">
                        수정
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 예산 선택 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {budgetList?.map((item) => (
                  <BuilderOptionCard key={item.id} title={item.name} description={item.description} tags={item.tags} icon={item.icon} showPrice={false} selected={builder.budget?.id === item.id} onClick={() => selectBudget(item)} />
                ))}
              </div>

              {/* 추천 상품 */}
              {builder.budget && (
                <div className="bg-[#FFF6F5] rounded-[2rem] p-8 md:p-10 border border-[#FFE0DC] shadow-sm animate-fade-in">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                      🎯 추천 상품
                    </h3>
                    <span className="bg-white text-[#F48171] border border-[#F48171]/20 text-[11px] font-bold px-2.5 py-1 rounded-full">
                      선택한 스타일 기반
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-500 mb-8">
                    선택하신 장소와 분위기에 어울리는 상품들입니다. 완료 시 장바구니에 자동으로 담겨요.
                  </p>
                  
                  <div className="space-y-4">
                    {recommendedProducts.map((p) => (
                      <div key={p.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-xl shadow-sm border border-gray-100">
                            {p.icon}
                          </div>
                          <div>
                            <p className="font-bold text-[15px] text-gray-900">{p.title}</p>
                            <p className="text-[12px] text-gray-500 mt-0.5">{p.category}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[15px] text-gray-900">{p.displayPrice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 하단 고정 버튼 영역 */}
          <div className="flex justify-between items-center gap-4 mt-16 max-w-4xl mx-auto">
            <button 
              className="px-4 py-2 text-gray-500 text-[15px] font-medium flex items-center gap-1 hover:text-gray-900 transition-colors" 
              onClick={handlePrev}
            >
              ← 이전
            </button>

            <button 
              className={`px-8 py-4 rounded-full font-bold text-[15px] transition-all duration-300 shadow-md ${
                canNext 
                  ? "bg-gradient-to-r from-[#F89685] to-[#F2705C] text-white hover:shadow-lg hover:shadow-[#F2705C]/20 hover:-translate-y-0.5" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              onClick={handleNext} 
              disabled={!canNext}
            >
              {currentStep === 1 && "다음: 분위기 선택 →"}
              {currentStep === 2 && "다음: 음식 선택 →"}
              {currentStep === 3 && "다음: 예산 확인 →"}
              {currentStep === 4 && "플랜 완성하고 장바구니 보기 🛒"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
