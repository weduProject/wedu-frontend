import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  CalendarCheck,
  MapPin,
  Landmark,
  Image as ImageIcon,
  MessageCircleHeart,
  Palette,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  InvitationTextField,
  InvitationTextArea,
  InvitationSectionTitle,
  InvitationAccountRow,
} from "./components/InvitationFormControls";

type SectionKey =
  | "basic"
  | "wedding"
  | "directions"
  | "account"
  | "gallery"
  | "message"
  | "design";

const sections = [
  { key: "basic" as SectionKey, label: "기본 정보", icon: User },
  { key: "wedding" as SectionKey, label: "예식 정보", icon: CalendarCheck },
  { key: "directions" as SectionKey, label: "오시는 길", icon: MapPin },
  { key: "account" as SectionKey, label: "계좌 정보", icon: Landmark },
  { key: "gallery" as SectionKey, label: "갤러리", icon: ImageIcon },
  { key: "message" as SectionKey, label: "인사말", icon: MessageCircleHeart },
  { key: "design" as SectionKey, label: "디자인", icon: Palette },
];

const colorOptions = [
  { name: "로즈골드", value: "#B76E79" },
  { name: "세이지 그린", value: "#9CAD8E" },
  { name: "소프트 핑크", value: "#E8C4C8" },
  { name: "차콜 그레이", value: "#4A4A4A" },
  { name: "네이비", value: "#2D3A4A" },
  { name: "라벤더", value: "#C4C4E0" },
  { name: "웜 아이보리", value: "#D4C5A9" },
  { name: "피치", value: "#E8C8A0" },
];

type Account = {
  bank: string;
  accountHolder: string;
  accountNumber: string;
};

export default function InvitationCreatePage() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] =
    useState<SectionKey>("basic");

  const [form, setForm] = useState({
    title: "",
    groomName: "",
    groomPhone: "",
    brideName: "",
    bridePhone: "",

    groomFatherName: "",
    groomMotherName: "",
    brideFatherName: "",
    brideMotherName: "",

    weddingDate: "",
    weddingTime: "",
    venueName: "",
    venueHall: "",

    address: "",
    addressDetail: "",

    groomAccounts: [] as Account[],
    brideAccounts: [] as Account[],

    gallery: [] as string[],

    greetingMessage: "",

    mainColor: "#B76E79",
  });

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addAccount = (
    side: "groomAccounts" | "brideAccounts"
  ) => {
    setForm((prev) => ({
      ...prev,
      [side]: [
        ...prev[side],
        {
          bank: "",
          accountHolder: "",
          accountNumber: "",
        },
      ],
    }));
  };

  const updateAccount = (
    side: "groomAccounts" | "brideAccounts",
    index: number,
    account: Account
  ) => {
    setForm((prev) => {
      const accounts = [...prev[side]];
      accounts[index] = account;

      return {
        ...prev,
        [side]: accounts,
      };
    });
  };

  const removeAccount = (
    side: "groomAccounts" | "brideAccounts",
    index: number
  ) => {
    setForm((prev) => ({
      ...prev,
      [side]: prev[side].filter((_, i) => i !== index),
    }));
  };

  const addGallery = () => {
    setForm((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ""],
    }));
  };

  const updateGallery = (index: number, value: string) => {
    setForm((prev) => {
      const gallery = [...prev.gallery];
      gallery[index] = value;

      return {
        ...prev,
        gallery,
      };
    });
  };

  const removeGallery = (index: number) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const currentIndex = sections.findIndex(
    (section) => section.key === activeSection
  );

  const goNext = () => {
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      {/* 상단 헤더 */}
      <section className="border-b border-[#eadfd8] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B76E79]">
            INVITATION
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#302a28] md:text-4xl">
            모바일 청첩장 만들기
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#8b817d] md:text-base">
            소중한 순간을 담은 나만의 모바일 청첩장을 만들어보세요.
          </p>
        </div>
      </section>

      {/* 단계 네비게이션 */}
      <div className="sticky top-0 z-30 border-b border-[#eadfd8] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 py-3">
          <div className="flex min-w-max justify-center gap-2">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const active = activeSection === section.key;

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition md:text-sm ${
                    active
                      ? "bg-[#B76E79] text-white shadow-sm"
                      : "bg-[#faf8f6] text-[#8b817d] hover:bg-[#f2ebe7]"
                  }`}
                >
                  <Icon className="h-4 w-4" />

                  <span className="hidden sm:inline">
                    {index + 1}.
                  </span>

                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* 입력 영역 */}
          <section className="rounded-[28px] border border-[#eadfd8] bg-white p-5 shadow-[0_10px_40px_rgba(80,50,40,0.05)] md:p-10">
            {/* 기본 정보 */}
            {activeSection === "basic" && (
              <div className="space-y-10">
                <InvitationSectionTitle>
                  기본 정보
                </InvitationSectionTitle>

                <InvitationTextField
                  label="청첩장 제목"
                  value={form.title}
                  onChange={(e) =>
                    updateField("title", e.target.value)
                  }
                  placeholder="예: 저희 결혼합니다"
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <InvitationTextField
                    label="신랑 성함"
                    value={form.groomName}
                    onChange={(e) =>
                      updateField("groomName", e.target.value)
                    }
                    placeholder="홍길동"
                  />

                  <InvitationTextField
                    label="신랑 연락처"
                    value={form.groomPhone}
                    onChange={(e) =>
                      updateField("groomPhone", e.target.value)
                    }
                    placeholder="010-0000-0000"
                  />

                  <InvitationTextField
                    label="신부 성함"
                    value={form.brideName}
                    onChange={(e) =>
                      updateField("brideName", e.target.value)
                    }
                    placeholder="김철수"
                  />

                  <InvitationTextField
                    label="신부 연락처"
                    value={form.bridePhone}
                    onChange={(e) =>
                      updateField("bridePhone", e.target.value)
                    }
                    placeholder="010-0000-0000"
                  />
                </div>

                <div>
                  <h3 className="mb-5 text-sm font-bold text-[#4d4541]">
                    혼주 정보
                  </h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    <InvitationTextField
                      label="신랑 아버님"
                      value={form.groomFatherName}
                      onChange={(e) =>
                        updateField(
                          "groomFatherName",
                          e.target.value
                        )
                      }
                      placeholder="아버님 성함"
                    />

                    <InvitationTextField
                      label="신랑 어머님"
                      value={form.groomMotherName}
                      onChange={(e) =>
                        updateField(
                          "groomMotherName",
                          e.target.value
                        )
                      }
                      placeholder="어머님 성함"
                    />

                    <InvitationTextField
                      label="신부 아버님"
                      value={form.brideFatherName}
                      onChange={(e) =>
                        updateField(
                          "brideFatherName",
                          e.target.value
                        )
                      }
                      placeholder="아버님 성함"
                    />

                    <InvitationTextField
                      label="신부 어머님"
                      value={form.brideMotherName}
                      onChange={(e) =>
                        updateField(
                          "brideMotherName",
                          e.target.value
                        )
                      }
                      placeholder="어머님 성함"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 예식 정보 */}
            {activeSection === "wedding" && (
              <div className="space-y-8">
                <InvitationSectionTitle>
                  예식 정보
                </InvitationSectionTitle>

                <div className="grid gap-6 md:grid-cols-2">
                  <InvitationTextField
                    label="예식 날짜"
                    type="date"
                    value={form.weddingDate}
                    onChange={(e) =>
                      updateField(
                        "weddingDate",
                        e.target.value
                      )
                    }
                  />

                  <InvitationTextField
                    label="예식 시간"
                    type="time"
                    value={form.weddingTime}
                    onChange={(e) =>
                      updateField(
                        "weddingTime",
                        e.target.value
                      )
                    }
                  />

                  <InvitationTextField
                    label="예식장"
                    value={form.venueName}
                    onChange={(e) =>
                      updateField(
                        "venueName",
                        e.target.value
                      )
                    }
                    placeholder="예: 더채플앳청담"
                  />

                  <InvitationTextField
                    label="홀"
                    value={form.venueHall}
                    onChange={(e) =>
                      updateField(
                        "venueHall",
                        e.target.value
                      )
                    }
                    placeholder="예: 3층 그랜드홀"
                  />
                </div>
              </div>
            )}

            {/* 오시는 길 */}
            {activeSection === "directions" && (
              <div className="space-y-8">
                <InvitationSectionTitle>
                  오시는 길
                </InvitationSectionTitle>

                <InvitationTextField
                  label="주소"
                  value={form.address}
                  onChange={(e) =>
                    updateField("address", e.target.value)
                  }
                  placeholder="예: 서울특별시 강남구..."
                />

                <InvitationTextField
                  label="상세 위치"
                  value={form.addressDetail}
                  onChange={(e) =>
                    updateField(
                      "addressDetail",
                      e.target.value
                    )
                  }
                  placeholder="예: 2호선 강남역 3번 출구 도보 5분"
                />

                <div className="rounded-2xl border border-dashed border-[#d8c5bc] bg-[#faf8f6] p-8 text-center">
                  <MapPin className="mx-auto mb-3 h-8 w-8 text-[#B76E79]" />

                  <p className="text-sm font-semibold text-[#514944]">
                    지도 영역
                  </p>

                  <p className="mt-1 text-xs text-[#9a908b]">
                    실제 지도 API 연결은 추후 진행합니다.
                  </p>
                </div>
              </div>
            )}

            {/* 계좌 */}
            {activeSection === "account" && (
              <div className="space-y-10">
                <InvitationSectionTitle>
                  계좌 정보
                </InvitationSectionTitle>

                {(
                  [
                    {
                      key: "groomAccounts" as const,
                      label: "신랑측 계좌",
                    },
                    {
                      key: "brideAccounts" as const,
                      label: "신부측 계좌",
                    },
                  ]
                ).map(({ key, label }) => (
                  <div key={key}>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#4d4541]">
                        {label}
                      </h3>

                      <button
                        type="button"
                        onClick={() => addAccount(key)}
                        className="flex items-center gap-1.5 rounded-full border border-[#d9b1b7] px-4 py-2 text-xs font-bold text-[#B76E79] transition hover:bg-[#faf0f1]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        계좌 추가
                      </button>
                    </div>

                    {form[key].length === 0 ? (
                      <div className="rounded-2xl bg-[#faf8f6] py-10 text-center text-sm text-[#a59b96]">
                        등록된 계좌가 없습니다.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {form[key].map((account, index) => (
                          <div
                            key={index}
                            className="relative"
                          >
                            <InvitationAccountRow
                              account={account}
                              onChange={(next) =>
                                updateAccount(
                                  key,
                                  index,
                                  next
                                )
                              }
                              onRemove={() =>
                                removeAccount(
                                  key,
                                  index
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 갤러리 */}
            {activeSection === "gallery" && (
              <div className="space-y-8">
                <InvitationSectionTitle>
                  갤러리
                </InvitationSectionTitle>

                <div className="rounded-2xl bg-[#faf8f6] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#4d4541]">
                        사진 추가
                      </p>

                      <p className="mt-1 text-xs text-[#9a908b]">
                        청첩장에 보여줄 사진을 추가해주세요.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addGallery}
                      className="flex items-center gap-1.5 rounded-full bg-[#B76E79] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#a95f6b]"
                    >
                      <Plus className="h-4 w-4" />
                      사진 추가
                    </button>
                  </div>
                </div>

                {form.gallery.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#d8c5bc] py-16 text-center">
                    <ImageIcon className="mx-auto mb-3 h-9 w-9 text-[#c9b8b0]" />

                    <p className="text-sm font-semibold text-[#766c67]">
                      아직 추가된 사진이 없어요.
                    </p>

                    <p className="mt-1 text-xs text-[#aaa09b]">
                      사진 추가 버튼을 눌러주세요.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {form.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="relative rounded-2xl border border-[#eadfd8] bg-white p-3"
                      >
                        {image ? (
                          <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-[#f3eeeb]">
                            <img
                              src={image}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mb-3 flex aspect-square items-center justify-center rounded-xl bg-[#f3eeeb]">
                            <ImageIcon className="h-8 w-8 text-[#c7bab3]" />
                          </div>
                        )}

                        <input
                          value={image}
                          onChange={(e) =>
                            updateGallery(
                              index,
                              e.target.value
                            )
                          }
                          placeholder="이미지 URL"
                          className="w-full rounded-xl border border-[#e3d8d2] bg-[#faf8f6] px-4 py-3 text-sm outline-none transition focus:border-[#B76E79]"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeGallery(index)
                          }
                          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#8d817c] shadow-sm transition hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 인사말 */}
            {activeSection === "message" && (
              <div className="space-y-8">
                <InvitationSectionTitle>
                  인사말
                </InvitationSectionTitle>

                <InvitationTextArea
                  label="하객들에게 전할 인사말"
                  rows={8}
                  value={form.greetingMessage}
                  onChange={(e) =>
                    updateField(
                      "greetingMessage",
                      e.target.value
                    )
                  }
                  placeholder={`서로를 향한 마음이 하나 되는 날,

소중한 분들을 모시고
저희의 새로운 시작을 함께하고 싶습니다.

따뜻한 마음으로 축복해주세요.`}
                />
              </div>
            )}

            {/* 디자인 */}
            {activeSection === "design" && (
              <div className="space-y-8">
                <InvitationSectionTitle>
                  디자인
                </InvitationSectionTitle>

                <div>
                  <p className="mb-4 text-sm font-bold text-[#4d4541]">
                    메인 색상
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {colorOptions.map((color) => {
                      const selected =
                        form.mainColor === color.value;

                      return (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() =>
                            updateField(
                              "mainColor",
                              color.value
                            )
                          }
                          className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                            selected
                              ? "border-[#B76E79] bg-[#faf0f1] shadow-sm"
                              : "border-[#eadfd8] hover:bg-[#faf8f6]"
                          }`}
                        >
                          <span
                            className="h-8 w-8 shrink-0 rounded-full border border-white shadow-sm"
                            style={{
                              backgroundColor:
                                color.value,
                            }}
                          />

                          <span
                            className={`text-xs font-semibold ${
                              selected
                                ? "text-[#B76E79]"
                                : "text-[#716762]"
                            }`}
                          >
                            {color.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 미리보기 */}
                <div className="rounded-[28px] bg-[#faf8f6] p-6">
                  <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#9a908b]">
                    Preview
                  </p>

                  <div
                    className="mx-auto max-w-sm overflow-hidden rounded-[28px] bg-white shadow-lg"
                  >
                    <div
                      className="px-6 py-16 text-center text-white"
                      style={{
                        backgroundColor: form.mainColor,
                      }}
                    >
                      <p className="mb-3 text-xs tracking-[0.3em] opacity-80">
                        WEDDING INVITATION
                      </p>

                      <h3 className="text-2xl font-serif font-semibold">
                        {form.title ||
                          "저희 결혼합니다"}
                      </h3>
                    </div>

                    <div className="px-6 py-10 text-center">
                      <p className="text-lg font-semibold text-[#403936]">
                        {form.groomName || "신랑"}{" "}
                        <span className="mx-2 text-[#B76E79]">
                          &
                        </span>{" "}
                        {form.brideName || "신부"}
                      </p>

                      <p className="mt-3 text-sm text-[#8d817c]">
                        {form.weddingDate ||
                          "2026. 00. 00."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 하단 네비게이션 */}
            <div className="mt-12 flex items-center justify-between border-t border-[#eee6e1] pt-7">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 rounded-full px-5 py-3 text-sm font-semibold text-[#817670] transition hover:bg-[#faf8f6] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </button>

              <span className="rounded-full bg-[#faf8f6] px-4 py-2 text-xs font-bold text-[#9a908b]">
                {currentIndex + 1} / {sections.length}
              </span>

              {currentIndex < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-1 rounded-full bg-[#B76E79] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#a95f6b]"
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/invitation")}
                  className="rounded-full bg-[#B76E79] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#a95f6b]"
                >
                  미리보기
                </button>
              )}
            </div>
          </section>

          {/* 오른쪽 미니 미리보기 */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[28px] border border-[#eadfd8] bg-white p-5 shadow-[0_10px_40px_rgba(80,50,40,0.05)]">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#9a908b]">
                Preview
              </p>

              <div className="overflow-hidden rounded-[24px] border border-[#eee5e0]">
                <div
                  className="px-5 py-14 text-center text-white"
                  style={{
                    backgroundColor: form.mainColor,
                  }}
                >
                  <p className="text-[9px] tracking-[0.25em] opacity-80">
                    WEDDING INVITATION
                  </p>

                  <h2 className="mt-3 font-serif text-xl">
                    {form.title ||
                      "저희 결혼합니다"}
                  </h2>
                </div>

                <div className="px-5 py-8 text-center">
                  <p className="text-sm font-semibold text-[#413a37]">
                    {form.groomName || "신랑"}{" "}
                    <span className="mx-1 text-[#B76E79]">
                      &
                    </span>{" "}
                    {form.brideName || "신부"}
                  </p>

                  <div className="mx-auto my-5 h-px w-10 bg-[#d8c5bc]" />

                  <p className="text-xs leading-5 text-[#8d817c]">
                    {form.weddingDate ||
                      "2026. 00. 00."}
                  </p>

                  <p className="mt-1 text-xs text-[#8d817c]">
                    {form.venueName ||
                      "예식장"}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-[#faf8f6] p-4">
                <p className="text-xs font-semibold text-[#716762]">
                  현재 단계
                </p>

                <p className="mt-1 text-sm font-bold text-[#B76E79]">
                  {sections[currentIndex].label}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
