import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Loader2,
  ArrowLeft,
} from "lucide-react";

import { Button, SelectableCard } from "../../components";

import {
  InvitationTextField,
  InvitationTextArea,
  InvitationSectionTitle,
  formatPhoneNumber,
  InvitationTimeSelect,
  type InvitationDraftForm,
} from "./components/InvitationFormControls";

import {
  fetchMyInvitation,
  fetchInvitationGallery,
  saveInvitation,
  syncInvitationGallery,
  type InvitationDraft,
} from "./invitationApi";

import { templates as invitationLandingTemplates } from "./InvitationPage";

type SectionKey =
  | "basic"
  | "wedding"
  | "directions"
  | "account"
  | "gallery"
  | "message"
  | "design";

const ALL_SECTIONS = [
  { key: "basic" as SectionKey, label: "기본 정보", icon: User },
  { key: "wedding" as SectionKey, label: "예식 정보", icon: CalendarCheck },
  { key: "directions" as SectionKey, label: "오시는 길", icon: MapPin },
  { key: "account" as SectionKey, label: "계좌 정보", icon: Landmark },
  { key: "gallery" as SectionKey, label: "갤러리", icon: ImageIcon },
  { key: "message" as SectionKey, label: "인사말", icon: MessageCircleHeart },
  { key: "design" as SectionKey, label: "디자인", icon: Palette },
];

// index.css의 버튼/카테고리 탭 그라디언트 토큰(--color-btn-from/mid/to)을 그대로 재사용
const ROSEGOLD_GRADIENT =
  "linear-gradient(111deg, #F79689 0%, #E8796C 33.33%, #FEABA0 66.67%, #E8796C 100%)";

// 각 옵션의 background = 커버 배경색(또는 그라디언트), accent = 구분선·강조 텍스트에 쓰는 포인트색
export const colorOptions = [
  { name: "로즈골드", templateId: "rosegold", background: "#E8796C", accent: "#B76E79", gradient: ROSEGOLD_GRADIENT as string | undefined },
  { name: "세이지 그린", templateId: "sage-green", background: "#9CAD8E", accent: "#6E7D62", gradient: undefined as string | undefined },
  { name: "소프트 핑크", templateId: "soft-pink", background: "#E8C4C8", accent: "#D9828B", gradient: undefined as string | undefined },
  { name: "차콜 그레이", templateId: "charcoal-gray", background: "#4A4A4A", accent: "#2D2D2D", gradient: undefined as string | undefined },
  { name: "네이비", templateId: "navy", background: "#2D3A4A", accent: "#1A2430", gradient: undefined as string | undefined },
  { name: "라벤더", templateId: "lavender", background: "#C4C4E0", accent: "#8F8FC0", gradient: undefined as string | undefined },
  { name: "웜 아이보리", templateId: "classic-ivory", background: "#D4C5A9", accent: "#A38454", gradient: undefined as string | undefined },
  { name: "피치", templateId: "peach", background: "#E8C8A0", accent: "#B76E79", gradient: undefined as string | undefined },
];

// 배경색 밝기에 따라 위에 얹을 텍스트를 흰색/어두운색 중 대비가 되는 쪽으로 고름
function getContrastTextColor(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#ffffff";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 165 ? "#221A18" : "#ffffff";
}

// mainColor를 계산해서 항상 존재하는 accentColor를 만들어냄 (고정 팔레트에서 "찾지" 않음).
// -> colorOptions(디자인 단계 8개)에도, InvitationPage.tsx의 템플릿 4개 색상에도 없는
//    임의의 mainColor가 들어와도(대소문자가 달라도) 항상 배경보다 진한 포인트 색을 보장한다.
export function deriveAccentColor(hex: string, amount = 0.35): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const r = Math.round(parseInt(clean.slice(0, 2), 16) * (1 - amount));
  const g = Math.round(parseInt(clean.slice(2, 4), 16) * (1 - amount));
  const b = Math.round(parseInt(clean.slice(4, 6), 16) * (1 - amount));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// mainColor에 해당하는 accent/gradient를 colorOptions(디자인탭 8개)와
// InvitationPage.tsx의 템플릿(4개) 양쪽에서 찾는다.
// 백엔드는 mainColor 문자열만 저장하고 accent/gradient는 저장하지 않으므로,
// 서버에서 재조회할 때 원래 선택했던 색 조합(특히 템플릿 4개의 3단 그라디언트)을
// 복원하려면 두 출처를 모두 확인해야 한다. (안 그러면 회색빛 대체 그라디언트로 보임)
export function findColorMeta(mainColor?: string): { accent?: string; gradient?: string } {
  if (!mainColor) return {};
  const lower = mainColor.toLowerCase();

  const fromPalette = colorOptions.find((c) => c.background.toLowerCase() === lower);
  if (fromPalette) return { accent: fromPalette.accent, gradient: fromPalette.gradient };

  const fromTemplate = invitationLandingTemplates.find(
    (t) => t.colors[0].toLowerCase() === lower,
  );
  if (fromTemplate) return { accent: fromTemplate.accent, gradient: fromTemplate.bg };

  return {};
}

interface TemplateHandoff {
  mainColor?: string;
  accentColor?: string;
  backgroundGradient?: string;
  templateId?: string;
  title?: string;
  // "수정으로 돌아가기"로 재진입할 때, 이전에 입력하던 폼 전체가 여기 통째로 실려온다
  restoredForm?: InvitationDraftForm;
}

function createEmptyForm(handoff: TemplateHandoff): InvitationDraftForm {
  return {
    templateId: handoff.templateId ?? "classic-ivory",
    title: handoff.title ?? "",

    groomName: "",
    brideName: "",
    groomPhoto: "",
    bridePhoto: "",
    groomContact: "",
    brideContact: "",

    groomParents: "",
    brideParents: "",
    groomParentContact: "",
    brideParentContact: "",

    weddingDate: "",
    weddingTime: "",
    venueName: "",
    venueAddress: "",
    venueDetail: "",

    mainGreeting: "",
    invitationMessage: "",
    additionalMessage: "",

    transportGuide: "",
    parkingGuide: "",
    publicTransportGuide: "",

    groomBank: "",
    groomAccount: "",
    groomAccountHolder: "",
    brideBank: "",
    brideAccount: "",
    brideAccountHolder: "",
    bgmUrl: "",

    gallery: [],

    mainColor: handoff.mainColor ?? "#E8796C",
    accentColor: handoff.accentColor ?? deriveAccentColor(handoff.mainColor ?? "#E8796C"),
    backgroundGradient: handoff.backgroundGradient ?? ROSEGOLD_GRADIENT,
  };
}

// 서버 응답(InvitationDraft) -> 폼 상태로 변환.
// accentColor는 고정 팔레트에서 "찾는" 대신 mainColor로부터 항상 계산해서 만든다.
// (팔레트에 없는 색이거나 대소문자가 다른 경우에도 accentColor가 mainColor와 같아지는
//  문제를 원천 차단하기 위함 — 2026-08-17 색상 매칭 버그 수정)
export function draftToForm(draft: InvitationDraft): Partial<InvitationDraftForm> {
  return {
    id: draft.id,
    status: draft.status,
    templateId: draft.templateId,
    title: draft.title ?? "",
    groomName: draft.groomName ?? "",
    brideName: draft.brideName ?? "",
    groomPhoto: draft.groomPhoto ?? "",
    bridePhoto: draft.bridePhoto ?? "",
    groomContact: draft.groomContact ?? "",
    brideContact: draft.brideContact ?? "",
    groomParents: draft.groomParents ?? "",
    brideParents: draft.brideParents ?? "",
    groomParentContact: draft.groomParentContact ?? "",
    brideParentContact: draft.brideParentContact ?? "",
    weddingDate: draft.weddingDate ?? "",
    weddingTime: draft.weddingTime ?? "",
    venueName: draft.venueName ?? "",
    venueAddress: draft.venueAddress ?? "",
    venueDetail: draft.venueDetail ?? "",
    mainGreeting: draft.mainGreeting ?? "",
    invitationMessage: draft.invitationMessage ?? "",
    additionalMessage: draft.additionalMessage ?? "",
    transportGuide: draft.transportGuide ?? "",
    parkingGuide: draft.parkingGuide ?? "",
    publicTransportGuide: draft.publicTransportGuide ?? "",
    groomBank: draft.groomBank ?? "",
    groomAccount: draft.groomAccount ?? "",
    groomAccountHolder: draft.groomAccountHolder ?? "",
    brideBank: draft.brideBank ?? "",
    brideAccount: draft.brideAccount ?? "",
    brideAccountHolder: draft.brideAccountHolder ?? "",
    bgmUrl: draft.bgmUrl ?? "",
    mainColor: draft.mainColor ?? "#E8796C",
    accentColor:
      findColorMeta(draft.mainColor).accent ??
      (draft.mainColor ? deriveAccentColor(draft.mainColor) : "#B76E79"),
    backgroundGradient: findColorMeta(draft.mainColor).gradient,
  };
}

// 폼 상태 -> 서버 전송용 InvitationDraft (프론트 전용 필드인 accentColor/backgroundGradient/gallery는 제외)
function formToDraft(form: InvitationDraftForm): InvitationDraft {
  return {
    id: form.id,
    templateId: form.templateId,
    title: form.title,
    groomName: form.groomName,
    brideName: form.brideName,
    groomPhoto: form.groomPhoto,
    bridePhoto: form.bridePhoto,
    groomContact: form.groomContact,
    brideContact: form.brideContact,
    groomParents: form.groomParents,
    brideParents: form.brideParents,
    groomParentContact: form.groomParentContact,
    brideParentContact: form.brideParentContact,
    weddingDate: form.weddingDate,
    weddingTime: form.weddingTime,
    venueName: form.venueName,
    venueAddress: form.venueAddress,
    venueDetail: form.venueDetail,
    mainGreeting: form.mainGreeting,
    invitationMessage: form.invitationMessage,
    additionalMessage: form.additionalMessage,
    transportGuide: form.transportGuide,
    parkingGuide: form.parkingGuide,
    publicTransportGuide: form.publicTransportGuide,
    groomBank: form.groomBank,
    groomAccount: form.groomAccount,
    groomAccountHolder: form.groomAccountHolder,
    brideBank: form.brideBank,
    brideAccount: form.brideAccount,
    brideAccountHolder: form.brideAccountHolder,
    mainColor: form.mainColor,
    bgmUrl: form.bgmUrl,
  };
}

export default function InvitationCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const handoff = (location.state ?? {}) as TemplateHandoff;

  // 템플릿을 골라 색상(mainColor)이 이미 정해진 채로 들어온 경우, 디자인 단계는 건너뛴다.
  // (restoredForm으로 재진입한 경우는 템플릿 선택이 아니므로 디자인 단계를 그대로 유지)
  const cameFromTemplate = Boolean(handoff.mainColor) && !handoff.restoredForm;
  const sections = ALL_SECTIONS;

  const [activeSection, setActiveSection] = useState<SectionKey>("basic");
  const [form, setForm] = useState<InvitationDraftForm>(() =>
    handoff.restoredForm ? { ...handoff.restoredForm } : createEmptyForm(handoff),
  );
  const [isLoading, setIsLoading] = useState(!handoff.restoredForm);
  const [isSaving, setIsSaving] = useState(false);
  // state는 리렌더링 전까지 업데이트가 반영 안 돼서, 짧은 간격의 중복 클릭을 못 막을 수 있음.
  // 동기적으로 즉시 막아주는 ref 가드를 별도로 둔다.
  const isSubmittingRef = useRef(false);

  // 마운트 시 기존에 작성 중인 청첩장이 있으면 불러와서 폼을 채운다.
  // (수정으로 돌아가기로 진입한 경우엔 이미 폼이 채워져 있으니 다시 불러오지 않음)
  useEffect(() => {
    if (handoff.restoredForm) return;

    let cancelled = false;

    (async () => {
      try {
        const [existing, gallery] = await Promise.all([
          fetchMyInvitation(),
          fetchInvitationGallery(),
        ]);

        if (cancelled) return;

        setForm((prev) => {
          const merged = {
            ...prev,
            ...(existing ? draftToForm(existing) : {}),
            gallery,
          };

          // 템플릿을 새로 선택하고 들어온 경우, 저장된 색상 대신 방금 고른 템플릿 색상을 적용
          if (cameFromTemplate) {
            merged.templateId = handoff.templateId ?? merged.templateId;
            merged.mainColor = handoff.mainColor ?? merged.mainColor;
            merged.accentColor =
              handoff.accentColor ?? deriveAccentColor(handoff.mainColor ?? merged.mainColor);
            merged.backgroundGradient = handoff.backgroundGradient ?? merged.backgroundGradient;
          }

          return merged;
        });
      } catch (error) {
        console.warn("[invitation] 초기 데이터 불러오기 실패:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = <K extends keyof InvitationDraftForm>(field: K, value: InvitationDraftForm[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addGallery = () => {
    setForm((prev) => ({
      ...prev,
      gallery: [...prev.gallery, { imageUrl: "", sortOrder: prev.gallery.length }],
    }));
  };

  const updateGallery = (index: number, value: string) => {
    setForm((prev) => {
      const gallery = [...prev.gallery];
      gallery[index] = { ...gallery[index], imageUrl: value };

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

  const isTitleValid = form.title.trim().length > 0;

  const currentIndex = sections.findIndex((section) => section.key === activeSection);

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

  const handlePreview = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSaving(true);

    try {
      const saved = await saveInvitation(formToDraft(form));
      // 갤러리 이미지 중 아직 서버에 없는(id 없는) 것만 새로 등록
      const syncedGallery = await syncInvitationGallery(form.gallery);

      const nextForm: InvitationDraftForm = {
        ...form,
        id: saved.id,
        status: saved.status,
        gallery: syncedGallery,
      };

      setForm(nextForm);
      navigate("/invitation/preview", { state: { form: nextForm } });
    } catch (error) {
      console.error("[invitation] 저장 실패:", error);
      alert("청첩장 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      isSubmittingRef.current = false;
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
      {/* 상단 헤더 */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
          <button
            type="button"
            onClick={() => navigate("/invitation")}
            aria-label="청첩장 페이지로 돌아가기"
            className="-mt-4 mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-text-muted shadow-sm transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

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
                  <span className="hidden sm:inline">{index + 1}.</span>
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
                <InvitationSectionTitle>기본 정보</InvitationSectionTitle>

                <InvitationTextField
                  label="청첩장 제목"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="예: 저희 결혼합니다"
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <InvitationTextField
                    label="신랑 성함"
                    value={form.groomName}
                    onChange={(e) => updateField("groomName", e.target.value)}
                    placeholder="홍길동"
                  />

                  <InvitationTextField
                    label="신랑 연락처"
                    type="tel"
                    inputMode="numeric"
                    value={form.groomContact}
                    onChange={(e) => updateField("groomContact", formatPhoneNumber(e.target.value))}
                    placeholder="010-0000-0000"
                  />

                  <InvitationTextField
                    label="신부 성함"
                    value={form.brideName}
                    onChange={(e) => updateField("brideName", e.target.value)}
                    placeholder="김철수"
                  />

                  <InvitationTextField
                    label="신부 연락처"
                    type="tel"
                    inputMode="numeric"
                    value={form.brideContact}
                    onChange={(e) => updateField("brideContact", formatPhoneNumber(e.target.value))}
                    placeholder="010-0000-0000"
                  />

                  <InvitationTextField
                    label="신랑 사진 URL"
                    value={form.groomPhoto}
                    onChange={(e) => updateField("groomPhoto", e.target.value)}
                    placeholder="이미지 URL"
                  />

                  <InvitationTextField
                    label="신부 사진 URL"
                    value={form.bridePhoto}
                    onChange={(e) => updateField("bridePhoto", e.target.value)}
                    placeholder="이미지 URL"
                  />
                </div>

                <div>
                  <h3 className="mb-5 text-sm font-bold text-text">혼주 정보</h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    <InvitationTextField
                      label="신랑측 혼주"
                      value={form.groomParents}
                      onChange={(e) => updateField("groomParents", e.target.value)}
                      placeholder="예: 홍판서 · 김씨 부부의 장남"
                    />

                    <InvitationTextField
                      label="신랑측 혼주 연락처"
                      type="tel"
                      inputMode="numeric"
                      value={form.groomParentContact}
                      onChange={(e) => updateField("groomParentContact", formatPhoneNumber(e.target.value))}
                      placeholder="010-0000-0000"
                    />

                    <InvitationTextField
                      label="신부측 혼주"
                      value={form.brideParents}
                      onChange={(e) => updateField("brideParents", e.target.value)}
                      placeholder="예: 김판서 · 이씨 부부의 장녀"
                    />

                    <InvitationTextField
                      label="신부측 혼주 연락처"
                      type="tel"
                      inputMode="numeric"
                      value={form.brideParentContact}
                      onChange={(e) => updateField("brideParentContact", formatPhoneNumber(e.target.value))}
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 예식 정보 */}
            {activeSection === "wedding" && (
              <div className="space-y-8">
                <InvitationSectionTitle>예식 정보</InvitationSectionTitle>

                <div className="grid gap-6 md:grid-cols-2">
                  <InvitationTextField
                    label="예식 날짜"
                    type="date"
                    value={form.weddingDate}
                    onChange={(e) => updateField("weddingDate", e.target.value)}
                  />

                  <InvitationTimeSelect
                    label="예식 시간"
                    value={form.weddingTime}
                    onChange={(time) => updateField("weddingTime", time)}
                  />

                  <InvitationTextField
                    label="예식장"
                    value={form.venueName}
                    onChange={(e) => updateField("venueName", e.target.value)}
                    placeholder="예: 더채플앳청담"
                  />

                  <InvitationTextField
                    label="홀 / 상세 위치"
                    value={form.venueDetail}
                    onChange={(e) => updateField("venueDetail", e.target.value)}
                    placeholder="예: 3층 그랜드홀"
                  />
                </div>
              </div>
            )}

            {/* 오시는 길 */}
            {activeSection === "directions" && (
              <div className="space-y-8">
                <InvitationSectionTitle>오시는 길</InvitationSectionTitle>

                <InvitationTextField
                  label="예식장 주소"
                  value={form.venueAddress}
                  onChange={(e) => updateField("venueAddress", e.target.value)}
                  placeholder="예: 서울특별시 강남구..."
                />

                <InvitationTextArea
                  label="교통 안내"
                  rows={3}
                  value={form.transportGuide}
                  onChange={(e) => updateField("transportGuide", e.target.value)}
                  placeholder="예: 2호선 강남역 3번 출구 도보 5분"
                />

                <InvitationTextArea
                  label="자가용 · 주차 안내"
                  rows={3}
                  value={form.parkingGuide}
                  onChange={(e) => updateField("parkingGuide", e.target.value)}
                  placeholder="예: 예식장 지하주차장 2시간 무료"
                />

                <InvitationTextArea
                  label="대중교통 안내"
                  rows={3}
                  value={form.publicTransportGuide}
                  onChange={(e) => updateField("publicTransportGuide", e.target.value)}
                  placeholder="예: 버스 146, 401, 730번 이용"
                />

                {form.venueAddress ? (
                  <div className="overflow-hidden rounded-2xl border border-border">
                    <iframe
                      title="오시는 길 지도"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(form.venueAddress)}&z=16&output=embed`}
                      className="h-56 w-full"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
                    <MapPin className="mx-auto mb-3 h-8 w-8 text-primary" />
                    <p className="text-sm font-semibold text-text">지도 영역</p>
                    <p className="mt-1 text-xs text-text-muted">주소를 입력하면 지도가 표시돼요.</p>
                  </div>
                )}
              </div>
            )}

            {/* 계좌 — 백엔드 스펙상 신랑측/신부측 각 1개만 지원 (배열 아님) */}
            {activeSection === "account" && (
              <div className="space-y-10">
                <InvitationSectionTitle>계좌 정보</InvitationSectionTitle>

                <div>
                  <h3 className="mb-4 text-sm font-bold text-text">신랑측 계좌</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <InvitationTextField
                      label="은행"
                      value={form.groomBank}
                      onChange={(e) => updateField("groomBank", e.target.value)}
                      placeholder="은행명"
                    />
                    <InvitationTextField
                      label="예금주"
                      value={form.groomAccountHolder}
                      onChange={(e) => updateField("groomAccountHolder", e.target.value)}
                      placeholder="예금주"
                    />
                    <InvitationTextField
                      label="계좌번호"
                      value={form.groomAccount}
                      onChange={(e) => updateField("groomAccount", e.target.value)}
                      placeholder="계좌번호"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-bold text-text">신부측 계좌</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <InvitationTextField
                      label="은행"
                      value={form.brideBank}
                      onChange={(e) => updateField("brideBank", e.target.value)}
                      placeholder="은행명"
                    />
                    <InvitationTextField
                      label="예금주"
                      value={form.brideAccountHolder}
                      onChange={(e) => updateField("brideAccountHolder", e.target.value)}
                      placeholder="예금주"
                    />
                    <InvitationTextField
                      label="계좌번호"
                      value={form.brideAccount}
                      onChange={(e) => updateField("brideAccount", e.target.value)}
                      placeholder="계좌번호"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 갤러리 */}
            {activeSection === "gallery" && (
              <div className="space-y-8">
                <InvitationSectionTitle>갤러리</InvitationSectionTitle>

                <div className="rounded-2xl bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-text">사진 추가</p>
                      <p className="mt-1 text-xs text-text-muted">청첩장에 보여줄 사진을 추가해주세요.</p>
                    </div>

                    <Button variant="main" size="sm" onClick={addGallery}>
                      + 사진 추가
                    </Button>
                  </div>
                </div>

                {form.gallery.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border py-16 text-center">
                    <ImageIcon className="mx-auto mb-3 h-9 w-9 text-text-muted" />
                    <p className="text-sm font-semibold text-text">아직 추가된 사진이 없어요.</p>
                    <p className="mt-1 text-xs text-text-muted">사진 추가 버튼을 눌러주세요.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {form.gallery.map((image, index) => (
                      <div key={image.id ?? `new-${index}`} className="relative rounded-2xl border border-border bg-white p-3">
                        {image.imageUrl ? (
                          <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-surface">
                            <img src={image.imageUrl} alt="" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="mb-3 flex aspect-square items-center justify-center rounded-xl bg-surface">
                            <ImageIcon className="h-8 w-8 text-text-muted" />
                          </div>
                        )}

                        <input
                          value={image.imageUrl}
                          onChange={(e) => updateGallery(index, e.target.value)}
                          disabled={Boolean(image.id)}
                          placeholder="이미지 URL"
                          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary disabled:opacity-60"
                        />
                        {image.id && (
                          <p className="mt-2 text-[10px] text-text-muted">
                            저장된 이미지입니다. (삭제 API가 아직 없어 화면에서만 지워지고, 다시
                            불러오면 복원됩니다)
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={() => removeGallery(index)}
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
                <InvitationSectionTitle>인사말</InvitationSectionTitle>

                <InvitationTextArea
                  label="메인 인사말"
                  rows={6}
                  value={form.mainGreeting}
                  onChange={(e) => updateField("mainGreeting", e.target.value)}
                  placeholder={`서로를 향한 마음이 하나 되는 날,
소중한 분들을 모시고 저희의 새로운 시작을 함께하고 싶습니다.`}
                />

                <InvitationTextArea
                  label="초대 문구"
                  rows={4}
                  value={form.invitationMessage}
                  onChange={(e) => updateField("invitationMessage", e.target.value)}
                  placeholder="예: 귀한 걸음 하시어 축복해주시면 감사하겠습니다."
                />

                <InvitationTextArea
                  label="추가 안내"
                  rows={4}
                  value={form.additionalMessage}
                  onChange={(e) => updateField("additionalMessage", e.target.value)}
                  placeholder="예: 화환은 정중히 사양합니다."
                />
              </div>
            )}

            {/* 디자인 */}
            {activeSection === "design" && (
              <div className="space-y-8">
                <InvitationSectionTitle>디자인</InvitationSectionTitle>

                <div>
                  <p className="mb-4 text-sm font-bold text-text">메인 색상</p>

                  <div className="mt-4 mb-4">
                    <InvitationTextField
                      label="배경음악 URL"
                      value={form.bgmUrl}
                      onChange={(e) => updateField("bgmUrl", e.target.value)}
                      placeholder="mp3 파일 URL을 입력해주세요"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {colorOptions.map((color) => {
                      const selected = form.mainColor === color.background;

                      return (
                        <SelectableCard
                          key={color.background}
                          isSelected={selected}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              templateId: color.templateId,
                              mainColor: color.background,
                              accentColor: color.accent,
                              backgroundGradient: color.gradient,
                            }))
                          }
                          className="flex items-center gap-3"
                        >
                          <span
                            className="h-8 w-8 shrink-0 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: color.background }}
                          />

                          <span
                            className={`text-xs font-semibold ${selected ? "text-primary" : "text-text-muted"}`}
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
                  <p className="mb-4 text-xs font-bold uppercase tracking-wider text-text-muted">Preview</p>

                  <div className="mx-auto max-w-sm overflow-hidden rounded-[28px] bg-white shadow-lg">
                    <div
                      className="px-5 py-14 text-center"
                      style={{
                        background:
                          form.backgroundGradient ??
                          `linear-gradient(135deg, ${form.mainColor} 0%, ${form.accentColor ?? form.mainColor} 100%)`,
                        color: getContrastTextColor(form.mainColor),
                      }}
                    >
                      <p className="mb-3 text-xs tracking-[0.3em] opacity-80">WEDDING INVITATION</p>
                      <h3 className="text-2xl font-serif font-semibold">{form.title || "저희 결혼합니다"}</h3>
                    </div>

                    <div className="px-6 py-10 text-center">
                      {(form.groomPhoto || form.bridePhoto) && (
                        <div className="mb-6 flex items-center justify-center gap-3">
                          {form.groomPhoto && (
                            <div className="h-16 w-16 overflow-hidden rounded-full border border-border">
                              <img src={form.groomPhoto} alt="신랑" className="h-full w-full object-cover" />
                            </div>
                          )}
                          {form.bridePhoto && (
                            <div className="h-16 w-16 overflow-hidden rounded-full border border-border">
                              <img src={form.bridePhoto} alt="신부" className="h-full w-full object-cover" />
                            </div>
                          )}
                        </div>
                      )}

                      <p className="font-serif text-lg font-semibold text-text">
                        {form.groomName || "신랑"} <span className="mx-2 text-primary">&</span>{" "}
                        {form.brideName || "신부"}
                      </p>
                      <p className="mt-3 text-sm text-text-muted">{form.weddingDate || "2026. 00. 00."}</p>

                      {(form.groomParents || form.brideParents) && (
                        <p className="mt-4 text-xs text-text-muted">
                          {form.groomParents} {form.groomParents && form.brideParents ? "· " : ""}{form.brideParents}
                        </p>
                      )}
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
                  disabled={activeSection === "basic" && !isTitleValid}
                  className="flex items-center gap-1"
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="main" onClick={handlePreview} disabled={isSaving || !isTitleValid}>
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      저장 중...
                    </span>
                  ) : (
                    "미리보기"
                  )}
                </Button>
              )}
            </div>
          </section>

          {/* 오른쪽 미니 미리보기 */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[28px] border border-border bg-white p-5 shadow-[0_10px_40px_rgba(80,50,40,0.05)]">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Preview</p>

              <div className="overflow-hidden rounded-[24px] border border-border">
                <div
                  className="px-5 py-14 text-center"
                  style={{
                    background:
                      form.backgroundGradient ??
                      `linear-gradient(135deg, ${form.mainColor} 0%, ${form.accentColor ?? form.mainColor} 100%)`,
                    color: getContrastTextColor(form.mainColor),
                  }}
                >
                  <p className="text-[9px] tracking-[0.25em] opacity-80">WEDDING INVITATION</p>
                  <h2 className="mt-3 font-serif text-xl">{form.title || "저희 결혼합니다"}</h2>
                </div>

                <div className="px-5 py-8 text-center">
                  {(form.groomPhoto || form.bridePhoto) && (
                    <div className="mb-4 flex items-center justify-center gap-2">
                      {form.groomPhoto && (
                        <div className="h-10 w-10 overflow-hidden rounded-full border border-border">
                          <img src={form.groomPhoto} alt="신랑" className="h-full w-full object-cover" />
                        </div>
                      )}
                      {form.bridePhoto && (
                        <div className="h-10 w-10 overflow-hidden rounded-full border border-border">
                          <img src={form.bridePhoto} alt="신부" className="h-full w-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}

                  <p className="font-serif text-sm font-semibold text-text">
                    {form.groomName || "신랑"} <span className="mx-1 text-primary">&</span>{" "}
                    {form.brideName || "신부"}
                  </p>
                  <div className="mx-auto my-5 h-px w-10 bg-border" />

                  <p className="text-xs leading-5 text-text-muted">{form.weddingDate || "2026. 00. 00."}</p>
                  <p className="mt-1 text-xs text-text-muted">{form.venueName || "예식장"}</p>
                  {(form.groomParents || form.brideParents) && (
                    <p className="mt-2 text-[10px] text-text-muted">
                      {form.groomParents} {form.groomParents && form.brideParents ? "· " : ""}{form.brideParents}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}