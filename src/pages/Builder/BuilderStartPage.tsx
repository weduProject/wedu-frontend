import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { MapPin, Drama, UtensilsCrossed, Gift, Lock, Target, ShoppingCart } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: MapPin,
    title: "장소 선택",
    description: "어디서 프로포즈할까요?",
  },
  {
    number: "2",
    icon: Drama,
    title: "분위기 선택",
    description: "어떤 분위기를 원하세요?",
  },
  {
    number: "3",
    icon: UtensilsCrossed,
    title: "음식 선택",
    description: "어떤 음식이 어울릴까요?",
  },
  {
    number: "4",
    icon: Gift,
    title: "예산 확인",
    description: "최종 예산과 플랜 확인",
  },
];

const features = [
  {
    icon: Lock,
    title: "저장되고 공유돼요",
    description: "완성된 플랜은 마이페이지에 저장되고 파트너와 공유할 수 있어요",
  },
  {
    icon: Target,
    title: "심리테스트 기반 추천",
    description: "테스트 결과에 따라 최적의 장소와 분위기를 먼저 추천해드려요",
  },
  {
    icon: ShoppingCart,
    title: "한 번에 찜 목록에",
    description: "선택한 옵션들은 찜 목록에 담아 한눈에 확인하고 관리할 수 있어요",
  },
];

export default function BuilderStartPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface/50 -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
      <div className="max-w-3xl mx-auto px-5 py-16 md:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <span className="inline-block text-primary font-bold text-sm bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            나만의 프로포즈
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            당신만의 특별한 프로포즈를 디자인하세요
          </h1>
          <p className="text-text-muted max-w-lg mx-auto leading-relaxed">
            장소, 분위기, 음식, 예산까지 4단계로 나만의 완벽한 프로포즈 플랜을 만들어보세요.
            마지막에 장바구니에 담아 한눈에 확인할 수 있어요.
          </p>
        </div>

        <div className="space-y-4 mb-12 max-w-2xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group flex items-center justify-between bg-white rounded-[1.5rem] border border-border shadow-sm p-6 hover:border-primary/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-110 transition-transform">
                  {step.number}
                </div>
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2 text-text">
                    <step.icon className="h-5 w-5 text-primary" strokeWidth={2} /> {step.title}
                  </h2>
                  <p className="text-text-muted text-sm mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
              <div className="text-text-muted w-8 h-8 flex items-center justify-center rounded-full bg-surface group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="text-sm font-bold">&gt;</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center mb-16">
          <Button
            size="lg"
            className="shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            onClick={() => navigate("/builder")}
          >
            시작하기 →
          </Button>
          <p className="text-xs text-text-muted mt-4 font-medium">약 3분 정도 소요돼요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-[2rem] border border-border shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-primary">
                <feature.icon className="h-7 w-7" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-base text-text mb-2">{feature.title}</h3>
              <p className="text-[13px] text-text-muted leading-relaxed word-break break-keep">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}