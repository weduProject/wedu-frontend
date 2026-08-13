import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircleHeart,
  Palette,
  ShieldCheck,
  Sparkles,
  Users,
  WandSparkles,
  Clock3,
} from "lucide-react";

import { Button } from "../../components";

const templates = [
  {
    name: "로맨틱 아이보리",
    rating: "4.9",
    type: "ROMANTIC",
    bg: "linear-gradient(145deg, #eee5d8 0%, #d8c5ad 45%, #f7f1e8 100%)",
    accent: "#b76e79",
  },
  {
    name: "아리스 화이트",
    rating: "4.8",
    type: "SPECIAL DAY",
    bg: "linear-gradient(145deg, #f8f7f3 0%, #e6e1d8 50%, #faf8f4 100%)",
    accent: "#8c8174",
  },
  {
    name: "플로럴 핑크",
    rating: "4.9",
    type: "FLOWER",
    bg: "linear-gradient(145deg, #f4d7d5 0%, #fff5f1 48%, #e9c0bd 100%)",
    accent: "#d9828b",
  },
  {
    name: "빈티지 레이스",
    rating: "4.7",
    type: "WEDDING",
    bg: "linear-gradient(145deg, #d8c39c 0%, #f3ead8 48%, #cbb386 100%)",
    accent: "#a38454",
  },
];

const features = [
  {
    icon: WandSparkles,
    title: "쉽고 빠른 제작",
    description: "복잡한 과정 없이\n나만의 청첩장을 간편하게 완성",
  },
  {
    icon: Clock3,
    title: "실시간 공유",
    description: "모바일 환경에 최적화된\n멋진 웹 청첩장 디자인",
  },
  {
    icon: MessageCircleHeart,
    title: "참여 기능",
    description: "방명록과 축하 메시지 등\n소중한 사람들의 마음을 기록",
  },
  {
    icon: Users,
    title: "함께하는 기능",
    description: "부부가 함께 편집하고\n소중한 순간을 준비",
  },
  {
    icon: Palette,
    title: "다양한 테마",
    description: "로맨틱부터 모던까지\n다양한 스타일을 자유롭게 선택",
  },
  {
    icon: ShieldCheck,
    title: "안전한 보안",
    description: "개인정보 보호를 위한\n안전한 서비스 환경",
  },
];

function ShineButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "light";
}) {
  return (
    <Button
      variant={variant === "primary" ? "main" : "secondary"}
      size="lg"
      onClick={onClick}
      className={`group relative overflow-hidden hover:-translate-y-0.5 hover:shadow-lg ${
        variant === "light" ? "border-0 bg-white/90 text-primary" : ""
      }`}
    >
      {/* 계속 지나가는 반짝임 */}
      <span
        className="
          pointer-events-none absolute inset-y-0 -left-1/2 w-1/3
          -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent
          animate-[invitationShine_2.3s_ease-in-out_infinite]
        "
      />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </Button>
  );
}

export default function InvitationPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-text -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
      {/* 반짝임 애니메이션 */}
      <style>
        {`
          @keyframes invitationShine {
            0% {
              transform: translateX(-180%) skewX(-12deg);
              opacity: 0;
            }
            15% {
              opacity: 1;
            }
            45% {
              opacity: 1;
            }
            65% {
              opacity: 0;
            }
            100% {
              transform: translateX(520%) skewX(-12deg);
              opacity: 0;
            }
          }

          @keyframes invitationFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          @keyframes invitationGlow {
            0%, 100% {
              opacity: .35;
              transform: scale(.95);
            }
            50% {
              opacity: .75;
              transform: scale(1.05);
            }
          }

          .invitation-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {/* =========================
          HERO
      ========================= */}
      <section className="relative min-h-[720px] overflow-hidden">
        {/* 배경 */}
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.95),transparent_35%),linear-gradient(135deg,#d9cec0_0%,#eee7dd_42%,#d4c4b1_100%)]
          "
        />

        {/* 패브릭 느낌 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-20 top-20 h-[450px] w-[700px] rotate-[-12deg] rounded-[45%] bg-white/60 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-[400px] w-[600px] rotate-[15deg] rounded-[50%] bg-[#c3ad93]/50 blur-3xl" />
        </div>

        {/* 꽃 장식 */}
        <div className="absolute left-[8%] top-[13%] text-white/80">
          <Sparkles className="h-8 w-8" />
        </div>

        <div className="absolute right-[13%] top-[20%] text-white/70">
          <Sparkles className="h-6 w-6" />
        </div>

        <div className="relative mx-auto flex min-h-[650px] max-w-[1280px] items-center px-6 py-20 md:px-12">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            {/* 왼쪽 */}
            <div className="max-w-xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,.18)]">
              <p className="mb-5 text-xs font-semibold tracking-[0.35em] text-white/80">
                INVITATION
              </p>

              <h1 className="text-[42px] font-bold leading-[1.18] tracking-[-0.05em] md:text-[58px]">
                당신의 이야기를
                <br />
                가장 아름답게
                <br />
                전하는 편지
              </h1>

              <p className="mt-6 text-sm leading-7 text-white/85 md:text-base">
                소중한 순간을 담은 모바일 청첩장을
                <br />
                WEDU에서 나만의 스타일로 만들어보세요.
              </p>

              <div className="mt-9 flex items-center gap-4">
                <ShineButton
                  onClick={() => navigate("/invitation/create")}
                >
                  청첩장 만들기
                  <ArrowRight className="h-4 w-4" />
                </ShineButton>

                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById("templates")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xs font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline"
                >
                  샘플 보기
                </button>
              </div>
            </div>

            {/* 오른쪽 청첩장 미리보기 */}
            <div className="relative flex min-h-[440px] items-center justify-center">
              {/* 뒤 카드 */}
              <div
                className="
                  absolute h-[300px] w-[220px]
                  rotate-[-10deg]
                  rounded-xl border border-white/60
                  bg-[#eee6d9]/80
                  shadow-[0_30px_60px_rgba(70,50,30,.18)]
                "
              />

              {/* 메인 카드 */}
              <div
                className="
                  relative z-10 h-[340px] w-[250px]
                  rounded-xl border border-white/80
                  bg-[#f8f4ed]
                  p-5
                  shadow-[0_30px_70px_rgba(60,45,30,.25)]
                  animate-[invitationFloat_4s_ease-in-out_infinite]
                "
              >
                <div className="flex h-full flex-col items-center justify-center border border-[#c9b49c]/50">
                  <p className="text-[9px] tracking-[0.35em] text-primary">
                    MY INVITATION
                  </p>

                  <div className="my-6 h-px w-16 bg-[#c9b49c]" />

                  <p className="font-serif text-lg text-[#7d6b5b]">
                    Hello together.
                  </p>

                  <Heart
                    className="my-5 h-5 w-5 fill-primary text-primary"
                  />

                  <p className="text-2xl font-semibold text-[#393333]">
                    수지
                  </p>

                  <p className="mt-1 text-2xl font-semibold text-[#393333]">
                    인준
                  </p>

                  <p className="mt-5 text-[10px] tracking-[0.12em] text-text-muted">
                    2026. 05. 24
                  </p>

                  <p className="mt-2 text-[9px] text-text-muted">
                    더채플앳청담 그랜드홀
                  </p>
                </div>
              </div>

              {/* 플로팅 카드 */}
              <div
                className="
                  absolute right-[3%] top-[20%] z-20
                  rounded-2xl border border-white/70
                  bg-white/90 px-5 py-4
                  text-center shadow-xl backdrop-blur-md
                  animate-[invitationFloat_4s_ease-in-out_1s_infinite]
                "
              >
                <Heart className="mx-auto mb-2 h-5 w-5 text-primary" />
                <p className="text-[10px] font-semibold text-text">
                  참여해요
                </p>
                <p className="mt-1 text-[9px] text-text-muted">
                  마음 전하기
                </p>
              </div>

              <div
                className="
                  absolute bottom-[12%] left-[4%] z-20
                  rounded-xl border border-white/70
                  bg-white/90 px-4 py-3
                  shadow-xl backdrop-blur-md
                "
              >
                <p className="text-[8px] uppercase tracking-[0.15em] text-primary">
                  Wedding Day
                </p>
                <p className="mt-1 text-xs font-bold text-text">
                  2026.05.24
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          TEMPLATE
      ========================= */}
      <section
        id="templates"
        className="bg-white px-6 py-24 md:px-12"
      >
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[10px] font-bold tracking-[0.25em] text-primary">
                TEMPLATE
              </p>

              <h2 className="text-3xl font-bold tracking-[-0.04em] md:text-4xl">
                청첩장 템플릿
              </h2>
            </div>

            <button className="hidden items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-primary sm:flex">
              전체 보기
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="relative">
            <button
              type="button"
              className="
                absolute -left-5 top-1/2 z-10
                hidden h-10 w-10 -translate-y-1/2
                items-center justify-center
                rounded-full bg-white shadow-lg
                md:flex
              "
            >
              <ChevronLeft className="h-5 w-5 text-text-muted" />
            </button>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-7">
              {templates.map((template) => (
                <div key={template.name} className="group">
                  <div
                    className="
                      relative aspect-[0.66]
                      overflow-hidden rounded-[22px]
                      border border-border
                      p-3 shadow-[0_10px_35px_rgba(0,0,0,.07)]
                      transition-all duration-500
                      group-hover:-translate-y-2
                      group-hover:shadow-[0_20px_45px_rgba(0,0,0,.12)]
                    "
                    style={{ background: template.bg }}
                  >
                    <div className="flex h-full flex-col items-center justify-center rounded-[15px] border border-white/70 bg-white/30 px-4 text-center backdrop-blur-[1px]">
                      <span
                        className="text-[7px] font-bold tracking-[0.25em]"
                        style={{ color: template.accent }}
                      >
                        {template.type}
                      </span>

                      <div className="my-5 h-px w-10 bg-black/15" />

                      <p className="font-serif text-[17px] text-[#5e554d]">
                        수지 & 인준
                      </p>

                      <Heart
                        className="my-4 h-3.5 w-3.5"
                        style={{ color: template.accent }}
                      />

                      <p className="text-[8px] tracking-widest text-text-muted">
                        2026.05.24
                      </p>

                      <div className="mt-5 h-14 w-14 rounded-full bg-white/40 blur-[1px]" />
                    </div>

                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[7px] font-bold text-text-muted shadow-sm">
                      NEW
                    </span>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-sm font-bold text-text">
                      {template.name}
                    </p>

                    <p className="mt-2 text-xs text-text-muted">
                      <span className="text-[#e3a34e]">★</span>{" "}
                      {template.rating}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="
                absolute -right-5 top-1/2 z-10
                hidden h-10 w-10 -translate-y-1/2
                items-center justify-center
                rounded-full bg-white shadow-lg
                md:flex
              "
            >
              <ChevronRight className="h-5 w-5 text-text-muted" />
            </button>
          </div>

          <div className="mt-10 flex justify-center gap-2">
            <span className="h-1.5 w-5 rounded-full bg-primary" />
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES + DDAY
      ========================= */}
      <section className="bg-surface px-6 py-24 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            {/* 왼쪽 */}
            <div>
              <p className="mb-3 text-[10px] font-bold tracking-[0.25em] text-primary">
                FEATURE
              </p>

              <h2 className="mb-10 text-3xl font-bold tracking-[-0.04em]">
                WEDU를 선택하는 이유
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="
                        flex min-h-[115px] items-start gap-4
                        rounded-2xl border border-white
                        bg-white p-5
                        shadow-[0_5px_20px_rgba(0,0,0,.03)]
                        transition-all duration-300
                        hover:-translate-y-1 hover:shadow-md
                      "
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
                        <Icon className="h-4.5 w-4.5 text-primary" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-text">
                          {feature.title}
                        </h3>

                        <p className="mt-2 whitespace-pre-line text-[11px] leading-5 text-text-muted">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* D-DAY */}
            <div
              className="
                rounded-[30px] border border-white
                bg-white p-8
                shadow-[0_15px_45px_rgba(0,0,0,.06)]
              "
            >
              <p className="text-center text-[10px] font-bold tracking-[0.3em] text-primary">
                D-DAY
              </p>

              <p className="mt-3 text-center text-xs text-text-muted">
                우리의 특별한 날까지
              </p>

              <h3 className="mt-3 text-center text-3xl font-bold">
                수지 <span className="text-primary">&</span> 인준
              </h3>

              <p className="mt-2 text-center text-xs text-text-muted">
                2026.05.24 SAT 2:00PM
              </p>

              <div className="mt-8 grid grid-cols-4 gap-2">
                {[
                  ["72", "Days"],
                  ["16", "Hours"],
                  ["34", "Minutes"],
                  ["52", "Seconds"],
                ].map(([number, label]) => (
                  <div
                    key={label}
                    className="rounded-xl bg-surface px-2 py-4 text-center"
                  >
                    <p className="text-xl font-bold text-text">
                      {number}
                    </p>
                    <p className="mt-1 text-[8px] text-text-muted">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-7 text-center">
                <p className="text-xs font-medium text-text-muted">
                  더채플앳청담 그랜드홀
                </p>

                <p className="mt-1 text-[10px] text-text-muted">
                  서울특별시 강남구 도산대로 327
                </p>
              </div>

              <div className="mt-7 flex justify-center">
                <ShineButton
                  onClick={() => navigate("/invitation/create")}
                >
                  청첩장 미리보기
                  <ArrowRight className="h-4 w-4" />
                </ShineButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================= */}
      <section className="px-6 py-20 md:px-12">
        <div
          className="
            relative mx-auto max-w-[1120px]
            overflow-hidden rounded-[30px]
            border border-primary-light
            bg-gradient-to-br from-[#fff2f0] via-[#fffafa] to-[#fce9e8]
            px-6 py-16 text-center
          "
        >
          {/* 장식 */}
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full border border-primary-light/60" />
          <div className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full border border-primary-light/60" />

          <div className="relative">
            <Heart className="mx-auto mb-5 h-6 w-6 text-primary" />

            <h2 className="text-2xl font-bold tracking-[-0.04em] md:text-3xl">
              지금 바로 나만의 청첩장을
              <br className="sm:hidden" /> 만들어보세요
            </h2>

            <p className="mt-4 text-xs leading-6 text-text-muted md:text-sm">
              수많은 커플들이 선택한 WEDU와 함께
              <br />
              특별한 순간을 더 특별하게 만들어보세요.
            </p>

            <div className="mt-7 flex justify-center">
              <ShineButton
                onClick={() => navigate("/invitation/create")}
              >
                무료로 시작하기
                <ArrowRight className="h-4 w-4" />
              </ShineButton>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}