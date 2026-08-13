import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  CalendarCheck,
  MapPin,
  Landmark,
  Image as ImageIcon,
  MessageCircleHeart,
  Palette,
  Loader2,
  Copy,
  Check,
  Plus,
  X,
} from "lucide-react";

import { Button } from "../../components";
import {
  InvitationTextField,
  InvitationTextArea,
  InvitationSectionTitle,
  InvitationAccountRow,
  InvitationAddButton,
} from "./components/InvitationFormControls";
import {
  EMPTY_INVITATION_DRAFT,
  fetchMyInvitation,
  saveInvitation,
  publishInvitation,
  fetchInvitationGallery,
  addInvitationGalleryImage,
  type InvitationDraft,
  type InvitationAccount,
  type InvitationGalleryImage,
} from "./invitationApi";

type SectionKey = "basic" | "wedding" | "directions" | "account" | "gallery" | "message" | "design";

interface SectionDef {
  key: SectionKey;
  label: string;
  icon: React.ElementType;
}

const sections: SectionDef[] = [
  { key: "basic", label: "기본 정보", icon: User },
  { key: "wedding", label: "예식 정보", icon: CalendarCheck },
  { key: "directions", label: "오시는 길", icon: MapPin },
  { key: "account", label: "계좌 정보", icon: Landmark },
  { key: "gallery", label: "갤러리", icon: ImageIcon },
  { key: "message", label: "인사말", icon: MessageCircleHeart },
  { key: "design", label: "디자인", icon: Palette },
];

const colorOptions = [
  { name: "로즈골드", value: "#C9A96E" },
  { name: "세이지 그린", value: "#9CAD8E" },
  { name: "소프트 핑크", value: "#E8C4C8" },
  { name: "차콜 그레이", value: "#4A4A4A" },
  { name: "네이비", value: "#2D3A4A" },
  { name: "라벤더", value: "#C4C4E0" },
  { name: "웜 아이보리", value: "#D4C5A9" },
  { name: "피치", value: "#E8C8A0" },
];

function emptyAccount(): InvitationAccount {
  return { bank: "", accountHolder: "", accountNumber: "" };
}

export default function InvitationCreatePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SectionKey>("basic");

  const [form, setForm] = useState<InvitationDraft>(EMPTY_INVITATION_DRAFT);
  const [isLoading, setIsLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [gallery, setGallery] = useState<InvitationGalleryImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 최초 진입 시 기존 청첩장/갤러리를 불러와 이어서 작성할 수 있게 한다.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [invitation, images] = await Promise.all([
          fetchMyInvitation(),
          fetchInvitationGallery().catch(() => []),
        ]);

        if (cancelled) return;

        if (invitation) {
          setForm({ ...EMPTY_INVITATION_DRAFT, ...invitation });
        }
        setGallery(images);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = useCallback(<K extends keyof InvitationDraft>(field: K, value: InvitationDraft[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateAccounts = useCallback((side: "groomAccounts" | "brideAccounts", accounts: InvitationAccount[]) => {
    setForm((prev) => ({ ...prev, [side]: accounts }));
  }, []);

  /** 임시 저장: PATCH /api/invitations/me (없으면 POST /api/invitations) */
  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const saved = await saveInvitation({ ...form, status: "DRAFT" });
      setForm((prev) => ({ ...prev, ...saved }));
      setSaveMessage({ type: "success", text: "임시 저장되었습니다." });
    } catch (error) {
      console.error("청첩장 저장 실패:", error);
      setSaveMessage({
        type: "error",
        text: error instanceof Error ? error.message : "저장에 실패했습니다.",
      });
    } finally {
      setSaving(false);
    }
  }, [form]);

  const handleAddImage = useCallback(async () => {
    const url = newImageUrl.trim();
    if (!url) return;

    setIsUploadingImage(true);
    try {
      const added = await addInvitationGalleryImage(url);
      setGallery((prev) => [...prev, added]);
      setNewImageUrl("");
    } catch (error) {
      console.error("갤러리 이미지 추가 실패:", error);
      alert(error instanceof Error ? error.message : "이미지 추가에 실패했습니다.");
    } finally {
      setIsUploadingImage(false);
    }
  }, [newImageUrl]);

  const handlePublish = useCallback(async () => {
    setShowPublishModal(true);
    setIsPublished(false);
    setPublishError(null);
    setIsPublishing(true);

    try {
      // 발행 전에 최신 내용을 먼저 저장한다.
      const saved = await saveInvitation({ ...form, status: "DRAFT" });
      setForm((prev) => ({ ...prev, ...saved }));

      const published = await publishInvitation();
      setForm((prev) => ({ ...prev, ...published }));
      setIsPublished(true);
    } catch (error) {
      console.error("청첩장 발행 실패:", error);
      setPublishError(error instanceof Error ? error.message : "발행 중 오류가 발생했습니다.");
    } finally {
      setIsPublishing(false);
    }
  }, [form]);

  const handleCopyUrl = useCallback(async () => {
    const url = form.publicUrl ?? `${window.location.origin}/invitation/${form.id ?? ""}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(url);
    }
  }, [form.publicUrl, form.id]);

  const currentSectionIdx = sections.findIndex((s) => s.key === activeSection);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-[#C9A96E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="pt-20 pb-16">
        <div className="w-full px-4 md:px-10 lg:px-16">
          {/* 헤더 배너 */}
          <div className="mx-auto mb-8 max-w-4xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#C9A96E] to-[#B8985D] px-6 py-8 text-white shadow-lg shadow-[#C9A96E]/20 md:px-10 md:py-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70">Create</p>
                <h1 className="text-2xl font-bold md:text-3xl">모바일 청첩장 만들기</h1>
                <p className="mt-2 text-sm text-white/80">
                  단계별로 정보를 입력하면 당신만의 모바일 청첩장이 완성돼요.
                </p>
              </div>
              {saveMessage && (
                <div
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium shadow-sm ${
                    saveMessage.type === "success"
                      ? "bg-white/90 text-green-700"
                      : "bg-white/90 text-red-600"
                  }`}
                >
                  {saveMessage.text}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex justify-center sticky top-4 z-40 mb-8">
            <div className="w-full max-w-4xl flex items-center justify-center gap-1 bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-x-auto scrollbar-hide">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      activeSection === section.key
                        ? "bg-[#C9A96E] text-white shadow-md shadow-[#C9A96E]/20 transform scale-[1.02]"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-12 min-h-[400px]">

              {/* 기본 정보 */}
              {activeSection === "basic" && (
                <div className="animate-fade-in space-y-10">
                  <div>
                    <InvitationSectionTitle>기본 정보</InvitationSectionTitle>
                    <div className="space-y-6">
                      <InvitationTextField
                        label="청첩장 제목"
                        value={form.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="예: 수지 ❤ 인준 결혼식에 초대합니다"
                      />
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <InvitationTextField
                          label="신랑측 성함"
                          value={form.groomName}
                          onChange={(e) => updateField("groomName", e.target.value)}
                          placeholder="홍길동"
                        />
                        <InvitationTextField
                          label="신랑측 연락처"
                          value={form.groomPhone}
                          onChange={(e) => updateField("groomPhone", e.target.value)}
                          placeholder="010-0000-0000"
                        />
                        <InvitationTextField
                          label="신부측 성함"
                          value={form.brideName}
                          onChange={(e) => updateField("brideName", e.target.value)}
                          placeholder="김철수"
                        />
                        <InvitationTextField
                          label="신부측 연락처"
                          value={form.bridePhone}
                          onChange={(e) => updateField("bridePhone", e.target.value)}
                          placeholder="010-0000-0000"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-5 text-sm font-bold text-gray-700">혼주 정보</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <InvitationTextField
                        label="신랑측 아버님"
                        value={form.groomFatherName ?? ""}
                        onChange={(e) => updateField("groomFatherName", e.target.value)}
                        placeholder="아버님 성함"
                      />
                      <InvitationTextField
                        label="신랑측 어머님"
                        value={form.groomMotherName ?? ""}
                        onChange={(e) => updateField("groomMotherName", e.target.value)}
                        placeholder="어머님 성함"
                      />
                      <InvitationTextField
                        label="신부측 아버님"
                        value={form.brideFatherName ?? ""}
                        onChange={(e) => updateField("brideFatherName", e.target.value)}
                        placeholder="아버님 성함"
                      />
                      <InvitationTextField
                        label="신부측 어머님"
                        value={form.brideMotherName ?? ""}
                        onChange={(e) => updateField("brideMotherName", e.target.value)}
                        placeholder="어머님 성함"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 예식 정보 */}
              {activeSection === "wedding" && (
                <div className="animate-fade-in">
                  <InvitationSectionTitle>예식 정보</InvitationSectionTitle>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <InvitationTextField
                        label="예식 날짜"
                        type="date"
                        value={form.weddingDate ?? ""}
                        onChange={(e) => updateField("weddingDate", e.target.value)}
                      />
                      <InvitationTextField
                        label="예식 시간"
                        type="time"
                        value={form.weddingTime ?? ""}
                        onChange={(e) => updateField("weddingTime", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <InvitationTextField
                        label="예식장 이름"
                        value={form.venueName ?? ""}
                        onChange={(e) => updateField("venueName", e.target.value)}
                        placeholder="예: 더 리버 르다"
                      />
                      <InvitationTextField
                        label="상세 홀"
                        value={form.venueHall ?? ""}
                        onChange={(e) => updateField("venueHall", e.target.value)}
                        placeholder="예: 3층 그랜드홀"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 오시는 길 */}
              {activeSection === "directions" && (
                <div className="animate-fade-in">
                  <InvitationSectionTitle>오시는 길</InvitationSectionTitle>
                  <div className="space-y-6">
                    <InvitationTextField
                      label="주소"
                      value={form.address ?? ""}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="도로명 주소를 입력해주세요"
                    />
                    <InvitationTextField
                      label="상세 위치"
                      value={form.addressDetail ?? ""}
                      onChange={(e) => updateField("addressDetail", e.target.value)}
                      placeholder="예: 지하철 2호선 강남역 3번 출구 도보 5분"
                    />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <InvitationTextField
                        label="위도 (latitude)"
                        type="number"
                        step="any"
                        value={form.latitude ?? ""}
                        onChange={(e) =>
                          updateField("latitude", e.target.value === "" ? undefined : Number(e.target.value))
                        }
                        placeholder="37.5665"
                      />
                      <InvitationTextField
                        label="경도 (longitude)"
                        type="number"
                        step="any"
                        value={form.longitude ?? ""}
                        onChange={(e) =>
                          updateField("longitude", e.target.value === "" ? undefined : Number(e.target.value))
                        }
                        placeholder="126.9780"
                      />
                    </div>
                    <InvitationTextField
                      label="네이버 지도 URL (선택)"
                      value={form.naverMapUrl ?? ""}
                      onChange={(e) => updateField("naverMapUrl", e.target.value)}
                      placeholder="https://naver.me/..."
                    />
                  </div>
                </div>
              )}

              {/* 계좌 정보 */}
              {activeSection === "account" && (
                <div className="animate-fade-in space-y-10">
                  {(
                    [
                      { key: "groomAccounts" as const, label: "신랑측 계좌" },
                      { key: "brideAccounts" as const, label: "신부측 계좌" },
                    ]
                  ).map(({ key, label }) => (
                    <div key={key}>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-700">{label}</h3>
                        <InvitationAddButton
                          label="계좌 추가"
                          onClick={() => updateAccounts(key, [...form[key], emptyAccount()])}
                        />
                      </div>

                      {form[key].length === 0 ? (
                        <p className="rounded-2xl bg-gray-50 py-8 text-center text-sm text-gray-400">
                          등록된 계좌가 없습니다. 계좌 추가 버튼을 눌러주세요.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {form[key].map((account, idx) => (
                            <InvitationAccountRow
                              key={idx}
                              account={account}
                              onChange={(next) => {
                                const copy = [...form[key]];
                                copy[idx] = next;
                                updateAccounts(key, copy);
                              }}
                              onRemove={() => {
                                updateAccounts(
                                  key,
                                  form[key].filter((_, i) => i !== idx),
                                );
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 갤러리 */}
              {activeSection === "gallery" && (
                <div className="animate-fade-in">
                  <InvitationSectionTitle>갤러리</InvitationSectionTitle>

                  <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                    <input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="이미지 URL을 입력해주세요"
                      className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E]"
                    />
                    <Button
                      type="button"
                      variant="roseGold"
                      onClick={handleAddImage}
                      disabled={isUploadingImage || !newImageUrl.trim()}
                    >
                      {isUploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Plus className="h-4 w-4" />
                          추가
                        </span>
                      )}
                    </Button>
                  </div>

                  {gallery.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 rounded-2xl bg-gray-50 py-16 text-center text-gray-400">
                      <ImageIcon className="h-8 w-8 text-gray-300" />
                      <p className="text-sm">아직 추가된 사진이 없어요.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {gallery.map((image, idx) => (
                        <div
                          key={image.id ?? idx}
                          className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
                        >
                          <img
                            src={image.imageUrl}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 인사말 */}
              {activeSection === "message" && (
                <div className="animate-fade-in">
                  <InvitationSectionTitle>인사말</InvitationSectionTitle>
                  <InvitationTextArea
                    label="하객들에게 전할 인사말"
                    rows={6}
                    value={form.greetingMessage ?? ""}
                    onChange={(e) => updateField("greetingMessage", e.target.value)}
                    placeholder="서로를 향한 마음이 하나 되는 날, 소중한 분들과 함께하고 싶습니다."
                  />
                </div>
              )}

              {/* 디자인 */}
              {activeSection === "design" && (
                <div className="animate-fade-in">
                  <InvitationSectionTitle>디자인 색상 변경</InvitationSectionTitle>
                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateField("mainColor", color.value)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all cursor-pointer ${
                          form.mainColor === color.value
                            ? "border-[#C9A96E] bg-[#fdfaf6] text-[#C9A96E] shadow-sm"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color.value }} />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 하단 네비게이션 */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
                <button
                  onClick={() => {
                    const prevIdx = currentSectionIdx - 1;
                    if (prevIdx >= 0) setActiveSection(sections[prevIdx].key);
                  }}
                  disabled={currentSectionIdx === 0}
                  className="px-6 py-3 rounded-full text-sm font-bold text-gray-500 disabled:opacity-30 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  이전
                </button>

                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-4 py-1.5 rounded-full">
                  {currentSectionIdx + 1} / {sections.length}
                </span>

                {currentSectionIdx < sections.length - 1 ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 rounded-full text-sm font-bold border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                      {saving ? "저장 중..." : "임시 저장"}
                    </button>
                    <button
                      onClick={() => {
                        const nextIdx = currentSectionIdx + 1;
                        if (nextIdx < sections.length) setActiveSection(sections[nextIdx].key);
                      }}
                      className="px-8 py-3 rounded-full text-sm font-bold bg-[#C9A96E] hover:bg-[#B8985D] text-white shadow-md shadow-[#C9A96E]/20 cursor-pointer transition-all hover:-translate-y-0.5"
                    >
                      다음
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 rounded-full text-sm font-bold border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                      임시 저장
                    </button>
                    <button
                      onClick={handlePublish}
                      disabled={saving}
                      className="px-8 py-3 rounded-full text-sm font-bold bg-[#C9A96E] hover:bg-[#B8985D] text-white shadow-md shadow-[#C9A96E]/20 cursor-pointer transition-all hover:-translate-y-0.5"
                    >
                      발행하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPublishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => !isPublishing && setShowPublishModal(false)}
          ></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in border border-gray-100">
            {isPublishing ? (
              <div className="py-8">
                <div className="w-14 h-14 border-4 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">청첩장을 발행하고 있습니다...</h3>
                <p className="text-sm text-gray-500">잠시만 기다려주세요.</p>
              </div>
            ) : publishError ? (
              <div className="py-4 animate-fade-in">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
                  <X className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">발행에 실패했어요</h3>
                <p className="text-sm text-gray-500 mb-8">{publishError}</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handlePublish}
                    className="w-full py-3.5 rounded-full text-[15px] font-bold bg-[#C9A96E] text-white hover:bg-[#B8985D] transition-colors shadow-md shadow-[#C9A96E]/20"
                  >
                    다시 시도
                  </button>
                  <button
                    onClick={() => setShowPublishModal(false)}
                    className="w-full py-3.5 rounded-full text-[15px] font-bold bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            ) : isPublished ? (
              <div className="py-4 animate-fade-in">
                <div className="w-16 h-16 bg-[#C9A96E]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#C9A96E] shadow-inner">
                  <Check className="h-7 w-7" strokeWidth={3} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">발행이 완료되었습니다!</h3>
                <p className="text-sm text-gray-500 mb-8">이제 소중한 사람들에게 청첩장을 공유해보세요.</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleCopyUrl}
                    className="flex w-full items-center justify-center gap-2 py-3.5 rounded-full text-[15px] font-bold bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "복사되었어요" : "URL 복사하기"}
                  </button>
                  <button
                    onClick={() => {
                      setShowPublishModal(false);
                      navigate("/invitation");
                    }}
                    className="w-full py-3.5 rounded-full text-[15px] font-bold bg-[#C9A96E] text-white hover:bg-[#B8985D] transition-colors shadow-md shadow-[#C9A96E]/20"
                  >
                    목록으로 돌아가기
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
