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
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-full
        px-7 py-3.5 text-sm font-bold
        transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-lg
        ${
          variant === "primary"
            ? "bg-[#f28b8c] text-white shadow-[0_8px_24px_rgba(242,139,140,0.25)]"
            : "bg-white/90 text-[#b76e79] shadow-[0_8px_24px_rgba(255,255,255,0.25)]"
        }
      `}
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
    </button>
  );
}

export default function InvitationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcfaf9] text-[#292525]">
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
          HEADER
      ========================= */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 md:px-8">
          {/* 로고 */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-xl font-black tracking-[-0.04em] text-[#f08386]"
          >
            WEDU
          </button>

          {/* 메뉴 */}
          <nav className="hidden items-center gap-7 text-[12px] font-medium text-gray-600 md:flex">
            <button
              onClick={() => navigate("/invitation")}
              className="font-bold text-[#b76e79]"
            >
              청첩장
            </button>

            <button
              onClick={() => navigate("/invitation/create")}
              className="transition-colors hover:text-[#b76e79]"
            >
              청첩장 만들기
            </button>

            <button className="transition-colors hover:text-[#b76e79]">
              샘플 보기
            </button>

            <button className="transition-colors hover:text-[#b76e79]">
              이용 안내
            </button>

            <button className="transition-colors hover:text-[#b76e79]">
              고객센터
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden text-xs font-medium text-gray-600 sm:block">
              로그인
            </button>

            <ShineButton
              onClick={() => navigate("/invitation/create")}
            >
              회원가입
            </ShineButton>
          </div>
        </div>
      </header>

      {/* =========================
          HERO
      ========================= */}
      <section className="relative min-h-[720px] overflow-hidden pt-[68px]">
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
                  <p className="text-[9px] tracking-[0.35em] text-[#b76e79]">
                    MY INVITATION
                  </p>

                  <div className="my-6 h-px w-16 bg-[#c9b49c]" />

                  <p className="font-serif text-lg text-[#7d6b5b]">
                    Hello together.
                  </p>

                  <Heart
                    className="my-5 h-5 w-5 fill-[#ed9a9b] text-[#ed9a9b]"
                  />

                  <p className="text-2xl font-semibold text-[#393333]">
                    수지
                  </p>

                  <p className="mt-1 text-2xl font-semibold text-[#393333]">
                    인준
                  </p>

                  <p className="mt-5 text-[10px] tracking-[0.12em] text-gray-500">
                    2026. 05. 24
                  </p>

                  <p className="mt-2 text-[9px] text-gray-400">
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
                <Heart className="mx-auto mb-2 h-5 w-5 text-[#f08c8d]" />
                <p className="text-[10px] font-semibold text-gray-700">
                  참여해요
                </p>
                <p className="mt-1 text-[9px] text-gray-400">
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
                <p className="text-[8px] uppercase tracking-[0.15em] text-[#e28a8d]">
                  Wedding Day
                </p>
                <p className="mt-1 text-xs font-bold text-gray-700">
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
              <p className="mb-3 text-[10px] font-bold tracking-[0.25em] text-[#e18a8d]">
                TEMPLATE
              </p>

              <h2 className="text-3xl font-bold tracking-[-0.04em] md:text-4xl">
                청첩장 템플릿
              </h2>
            </div>

            <button className="hidden items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-[#b76e79] sm:flex">
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
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-7">
              {templates.map((template) => (
                <div key={template.name} className="group">
                  <div
                    className="
                      relative aspect-[0.66]
                      overflow-hidden rounded-[22px]
                      border border-gray-100
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

                      <p className="text-[8px] tracking-widest text-gray-500">
                        2026.05.24
                      </p>

                      <div className="mt-5 h-14 w-14 rounded-full bg-white/40 blur-[1px]" />
                    </div>

                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[7px] font-bold text-gray-500 shadow-sm">
                      NEW
                    </span>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-sm font-bold text-gray-800">
                      {template.name}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
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
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="mt-10 flex justify-center gap-2">
            <span className="h-1.5 w-5 rounded-full bg-[#ef8d90]" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES + DDAY
      ========================= */}
      <section className="bg-[#f8f6f5] px-6 py-24 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            {/* 왼쪽 */}
            <div>
              <p className="mb-3 text-[10px] font-bold tracking-[0.25em] text-[#e18a8d]">
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
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0ef]">
                        <Icon className="h-4.5 w-4.5 text-[#ec898d]" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-800">
                          {feature.title}
                        </h3>

                        <p className="mt-2 whitespace-pre-line text-[11px] leading-5 text-gray-400">
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
              <p className="text-center text-[10px] font-bold tracking-[0.3em] text-[#e68a8e]">
                D-DAY
              </p>

              <p className="mt-3 text-center text-xs text-gray-400">
                우리의 특별한 날까지
              </p>

              <h3 className="mt-3 text-center text-3xl font-bold">
                수지 <span className="text-[#ef9294]">&</span> 인준
              </h3>

              <p className="mt-2 text-center text-xs text-gray-500">
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
                    className="rounded-xl bg-[#faf9f8] px-2 py-4 text-center"
                  >
                    <p className="text-xl font-bold text-gray-800">
                      {number}
                    </p>
                    <p className="mt-1 text-[8px] text-gray-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-7 text-center">
                <p className="text-xs font-medium text-gray-600">
                  더채플앳청담 그랜드홀
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
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
            border border-[#f3d6d2]
            bg-gradient-to-br from-[#fff2f0] via-[#fffafa] to-[#fce9e8]
            px-6 py-16 text-center
          "
        >
          {/* 장식 */}
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full border border-[#f1c5c4]/60" />
          <div className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full border border-[#f1c5c4]/60" />

          <div className="relative">
            <Heart className="mx-auto mb-5 h-6 w-6 text-[#ed999b]" />

            <h2 className="text-2xl font-bold tracking-[-0.04em] md:text-3xl">
              지금 바로 나만의 청첩장을
              <br className="sm:hidden" /> 만들어보세요
            </h2>

            <p className="mt-4 text-xs leading-6 text-gray-500 md:text-sm">
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

      {/* =========================
          FOOTER
      ========================= */}
      <footer className="border-t border-gray-100 bg-[#f7f5f4] px-6 py-12 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <p className="text-xs font-bold text-gray-700">서비스</p>
              <div className="mt-4 space-y-2 text-[10px] text-gray-400">
                <p>청첩장</p>
                <p>청첩장 만들기</p>
                <p>템플릿</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-700">이용 안내</p>
              <div className="mt-4 space-y-2 text-[10px] text-gray-400">
                <p>서비스 이용방법</p>
                <p>자주 묻는 질문</p>
                <p>고객센터</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-700">WEDU</p>
              <div className="mt-4 space-y-2 text-[10px] text-gray-400">
                <p>서비스 소개</p>
                <p>이용약관</p>
                <p>개인정보처리방침</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-700">고객센터</p>
              <div className="mt-4 space-y-2 text-[10px] text-gray-400">
                <p>평일 09:00 - 18:00</p>
                <p>주말 및 공휴일 휴무</p>
                <p>support@wedu.com</p>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-7">
            <p className="text-xl font-black tracking-[-0.04em] text-[#ed8589]">
              WEDU
            </p>

            <p className="mt-2 text-[9px] text-gray-400">
              당신의 특별한 순간을 위한 웨딩 플랫폼
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
