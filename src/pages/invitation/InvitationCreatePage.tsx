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
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button, SelectableCard } from "../../components";

import {
  InvitationTextField,
  InvitationTextArea,
  InvitationSectionTitle,
  InvitationAccountRow,
  InvitationAddButton,
  saveInvitationDraft,
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
      document.getElementById("invitation-form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].key);
      document.getElementById("invitation-form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePreview = () => {
    saveInvitationDraft(form);
    navigate("/invitation/preview");
  };

  return (
    <div className="bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
      {/* 상단 헤더 */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            INVITATION
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-text md:text-4xl">
            모바일 청첩장 만들기
          </h1>

          <p className="mt-3 text-sm leading-6 text-text-muted md:text-base">
            소중한 순간을 담은 나만의 모바일 청첩장을 만들어보세요.
          </p>
        </div>
      </section>

      {/* 단계 네비게이션 */}
      <div className="sticky top-16 md:top-20 z-30 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 py-3">
          <div className="flex min-w-max justify-center gap-2">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const active = activeSection === section.key;

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => {
                    setActiveSection(section.key);
                    document.getElementById("invitation-form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition md:text-sm ${
                    active ? "category-tab-active" : "category-tab-inactive"
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
          <section
            id="invitation-form-section"
            className="scroll-mt-[130px] rounded-[28px] border border-border bg-white p-5 shadow-[0_10px_40px_rgba(80,50,40,0.05)] md:p-10 md:scroll-mt-[150px]"
          >
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
                  <h3 className="mb-5 text-sm font-bold text-text">
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

                <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
                  <MapPin className="mx-auto mb-3 h-8 w-8 text-primary" />

                  <p className="text-sm font-semibold text-text">
                    지도 영역
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
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
                      <h3 className="text-sm font-bold text-text">
                        {label}
                      </h3>

                      <InvitationAddButton
                        label="계좌 추가"
                        onClick={() => addAccount(key)}
                      />
                    </div>

                    {form[key].length === 0 ? (
                      <div className="rounded-2xl bg-surface py-10 text-center text-sm text-text-muted">
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

                <div className="rounded-2xl bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-text">
                        사진 추가
                      </p>

                      <p className="mt-1 text-xs text-text-muted">
                        청첩장에 보여줄 사진을 추가해주세요.
                      </p>
                    </div>

                    <Button variant="main" size="sm" onClick={addGallery}>
                      + 사진 추가
                    </Button>
                  </div>
                </div>

                {form.gallery.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border py-16 text-center">
                    <ImageIcon className="mx-auto mb-3 h-9 w-9 text-text-muted" />

                    <p className="text-sm font-semibold text-text">
                      아직 추가된 사진이 없어요.
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      사진 추가 버튼을 눌러주세요.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {form.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="relative rounded-2xl border border-border bg-white p-3"
                      >
                        {image ? (
                          <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-surface">
                            <img
                              src={image}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mb-3 flex aspect-square items-center justify-center rounded-xl bg-surface">
                            <ImageIcon className="h-8 w-8 text-text-muted" />
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
                          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeGallery(index)
                          }
                          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-text-muted shadow-sm transition hover:text-red-500"
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
                  <p className="mb-4 text-sm font-bold text-text">
                    메인 색상
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {colorOptions.map((color) => {
                      const selected =
                        form.mainColor === color.value;

                      return (
                        <SelectableCard
                          key={color.value}
                          isSelected={selected}
                          onClick={() =>
                            updateField(
                              "mainColor",
                              color.value
                            )
                          }
                          className="flex items-center gap-3"
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
                                ? "text-primary"
                                : "text-text-muted"
                            }`}
                          >
                            {color.name}
                          </span>
                        </SelectableCard>
                      );
                    })}
                  </div>
                </div>

                {/* 미리보기 */}
                <div className="rounded-[28px] bg-surface p-6">
                  <p className="mb-4 text-xs font-bold uppercase tracking-wider text-text-muted">
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
                      <p className="text-lg font-semibold text-text">
                        {form.groomName || "신랑"}{" "}
                        <span className="mx-2 text-primary">
                          &
                        </span>{" "}
                        {form.brideName || "신부"}
                      </p>

                      <p className="mt-3 text-sm text-text-muted">
                        {form.weddingDate ||
                          "2026. 00. 00."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 하단 네비게이션 */}
            <div className="mt-12 flex items-center justify-between border-t border-border pt-7">
              <Button
                variant="secondary"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>

              <span className="rounded-full bg-surface px-4 py-2 text-xs font-bold text-text-muted">
                {currentIndex + 1} / {sections.length}
              </span>

              {currentIndex < sections.length - 1 ? (
                <Button
                  variant="main"
                  onClick={goNext}
                  className="flex items-center gap-1"
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="main"
                  onClick={handlePreview}
                >
                  미리보기
                </Button>
              )}
            </div>
          </section>

          {/* 오른쪽 미니 미리보기 */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[28px] border border-border bg-white p-5 shadow-[0_10px_40px_rgba(80,50,40,0.05)]">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-text-muted">
                Preview
              </p>

              <div className="overflow-hidden rounded-[24px] border border-border">
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
                  <p className="text-sm font-semibold text-text">
                    {form.groomName || "신랑"}{" "}
                    <span className="mx-1 text-primary">
                      &
                    </span>{" "}
                    {form.brideName || "신부"}
                  </p>

                  <div className="mx-auto my-5 h-px w-10 bg-border" />

                  <p className="text-xs leading-5 text-text-muted">
                    {form.weddingDate ||
                      "2026. 00. 00."}
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    {form.venueName ||
                      "예식장"}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-surface p-4">
                <p className="text-xs font-semibold text-text-muted">
                  현재 단계
                </p>

                <p className="mt-1 text-sm font-bold text-primary">
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