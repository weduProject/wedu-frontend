import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Music, Heart, MapPin, Landmark, ArrowLeft, Share2, Mail } from "lucide-react";
import { Button } from "../../components";
import type { InvitationDraftForm } from "./components/InvitationFormControls";

// state 없이(새로고침 등) 이 페이지에 접근했을 때 보여줄 기본값
const FALLBACK_DRAFT: InvitationDraftForm = {
  title: "",
  groomName: "신랑",
  groomPhone: "",
  brideName: "신부",
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
  groomAccounts: [],
  brideAccounts: [],
  gallery: [],
  greetingMessage: "",
  mainColor: "#B76E79",
  accentColor: "#B76E79",
  backgroundGradient: undefined,
};

function formatWeddingDate(dateStr: string, timeStr: string): string {
  if (!dateStr) return "2026. 00. 00.";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const formatted = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, "0")}. ${String(date.getDate()).padStart(2, "0")}. (${weekdays[date.getDay()]})`;
  return timeStr ? `${formatted} ${timeStr}` : formatted;
}

function getContrastTextColor(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#ffffff";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 165 ? "#221A18" : "#ffffff";
}

export default function InvitationDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bgmPlaying, setBgmPlaying] = useState(false);

  // 작성 페이지가 "미리보기" 클릭 시 navigate state로 넘긴 폼 데이터를 그대로 사용.
  // 새로고침하거나 state 없이 이 URL에 바로 접근하면 자동으로 초기화되어 FALLBACK_DRAFT가 쓰인다.
  const passedForm = (location.state as { form?: InvitationDraftForm } | null)?.form;
  const draft = passedForm ?? FALLBACK_DRAFT;
  const isPreview = passedForm !== undefined;

  const toggleBgm = useCallback(() => {
    setBgmPlaying((prev) => !prev);
  }, []);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("청첩장 링크가 복사되었습니다.");
      })
      .catch(() => {
        alert("링크 복사에 실패했습니다. 주소창의 URL을 직접 복사해주세요.");
      });
  }, []);

  const galleryImages = draft.gallery.filter((url) => url.trim().length > 0);
  const hasAccounts = draft.groomAccounts.length > 0 || draft.brideAccounts.length > 0;

  return (
    <div className="-mx-5 -mt-5 -mb-5 min-h-screen bg-[#F0EEED] pb-16 md:-mx-8 md:-mt-8 md:-mb-8">
      {isPreview && (
        <div className="fixed left-6 top-24 z-40 md:top-28">
          <button
            type="button"
            onClick={() => navigate("/invitation/create", { state: { restoredForm: draft } })}
            className="flex items-center gap-1.5 rounded-full border border-border bg-white/90 px-4 py-2 text-xs font-medium text-text-muted shadow-md backdrop-blur transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            수정으로 돌아가기
          </button>
        </div>
      )}

      <button
        onClick={toggleBgm}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white/90 shadow-lg backdrop-blur-md transition-transform hover:scale-105 cursor-pointer"
      >
        <Music className={`h-5 w-5 ${bgmPlaying ? "text-primary" : "text-text-muted"}`} strokeWidth={2} />
      </button>

      {/* 청첩장 카드 */}
      <div className="mx-auto max-w-md px-4 pt-8 md:pt-12">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          {/* 커버 */}
          <section className="flex flex-col items-center">
            <div
              className="flex w-full flex-col items-center justify-center px-6 py-16 text-center md:py-20"
              style={{
                background:
                  draft.backgroundGradient ??
                  `linear-gradient(135deg, ${draft.mainColor} 0%, ${draft.accentColor ?? draft.mainColor} 100%)`,
              }}
            >
              <p
                className="mb-4 text-xs font-medium uppercase tracking-[0.3em] opacity-80"
                style={{ color: getContrastTextColor(draft.mainColor) }}
              >
                WEDDING INVITATION
              </p>
              <h1
                className="font-serif text-2xl font-semibold tracking-tight md:text-3xl"
                style={{ color: getContrastTextColor(draft.mainColor) }}
              >
                {draft.title || "저희 결혼합니다"}
              </h1>
            </div>

            <div className="flex w-full flex-col items-center px-6 py-14 text-center md:py-16">
              <p className="font-serif text-lg font-semibold text-text md:text-xl">
                {draft.groomName || "신랑"}
                <span className="mx-2" style={{ color: draft.accentColor ?? draft.mainColor }}>&</span>
                {draft.brideName || "신부"}
              </p>

              <div className="my-5 h-px w-10 bg-border" />

              <p className="text-sm leading-6 text-text-muted md:text-base">
                {formatWeddingDate(draft.weddingDate, draft.weddingTime)}
              </p>
              {draft.venueName && (
                <p className="mt-1 text-sm text-text-muted md:text-base">{draft.venueName}</p>
              )}
            </div>
          </section>

          {/* 인사말 */}
          {draft.greetingMessage && (
            <section className="border-t border-border px-6 py-14 text-center">
              <p className="whitespace-pre-line text-sm leading-relaxed text-text-muted md:text-base">
                {draft.greetingMessage}
              </p>
            </section>
          )}

          {/* 예식 정보 */}
          {(draft.venueName || draft.venueHall) && (
            <section className="border-t border-border px-6 py-14 text-center">
              <h2 className="mb-4 font-serif text-lg font-semibold text-text">예식 안내</h2>
              <p className="text-sm font-medium text-text">{draft.venueName || "예식장"}</p>
              {draft.venueHall && <p className="mt-1 text-xs text-text-muted">{draft.venueHall}</p>}
            </section>
          )}

          {/* 오시는 길 */}
          {(draft.address || draft.addressDetail) && (
            <section className="border-t border-border px-6 py-14">
              <div className="mb-4 flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h2 className="font-serif text-lg font-semibold text-text">오시는 길</h2>
              </div>
              <div className="text-center">
                {draft.address && <p className="text-sm text-text">{draft.address}</p>}
                {draft.addressDetail && <p className="mt-1 text-xs text-text-muted">{draft.addressDetail}</p>}
              </div>
            </section>
          )}

          {/* 갤러리 */}
          {galleryImages.length > 0 && (
            <section className="border-t border-border px-6 py-14">
              <h2 className="mb-6 text-center font-serif text-lg font-semibold text-text">갤러리</h2>
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((url, idx) => (
                  <div key={idx} className="aspect-square overflow-hidden rounded-xl bg-primary-light">
                    <img src={url} alt={`gallery-${idx + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 마음 전하실 곳 */}
          {hasAccounts && (
            <section className="border-t border-border px-6 py-14">
              <div className="mb-6 flex items-center justify-center gap-2">
                <Landmark className="h-4 w-4 text-primary" />
                <h2 className="font-serif text-lg font-semibold text-text">마음 전하실 곳</h2>
              </div>
              <div className="space-y-6">
                {draft.groomAccounts.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold text-text-muted">신랑측</p>
                    <div className="space-y-2">
                      {draft.groomAccounts.map((account, idx) => (
                        <div key={idx} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text">
                          {account.bank} {account.accountNumber}{" "}
                          <span className="text-text-muted">({account.accountHolder})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {draft.brideAccounts.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold text-text-muted">신부측</p>
                    <div className="space-y-2">
                      {draft.brideAccounts.map((account, idx) => (
                        <div key={idx} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text">
                          {account.bank} {account.accountNumber}{" "}
                          <span className="text-text-muted">({account.accountHolder})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="border-t border-border px-6 py-16 text-center">
            <p className="mb-8 text-sm leading-relaxed text-text-muted">
              두 사람의 새로운 시작을
              <br />
              따뜻한 마음으로 축복해 주세요.
            </p>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={handleShare}
                className="inline-flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                공유하기
              </Button>
              <Button
                variant="main"
                size="md"
                onClick={() => navigate("/invitation/create")}
                className="inline-flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                청첩장 만들기
              </Button>
            </div>
          </section>

          <footer className="border-t border-border py-10 text-center">
            <p className="text-[10px] text-text-muted">
              Made with <Heart className="inline h-2.5 w-2.5 fill-primary text-primary" /> WEDU
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}