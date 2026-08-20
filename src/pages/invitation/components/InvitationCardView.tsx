import { useCallback, useRef, useState } from "react";
import { Music, Heart, MapPin, Landmark, CalendarCheck, Users, Image as ImageIcon } from "lucide-react";
import type { InvitationDraftForm } from "./InvitationFormControls";

export function formatWeddingDate(dateStr: string, timeStr: string): string {
  if (!dateStr) return "2026. 00. 00.";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const formatted = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, "0")}. ${String(date.getDate()).padStart(2, "0")}. (${weekdays[date.getDay()]})`;
  return timeStr ? `${formatted} ${timeStr}` : formatted;
}

export function getContrastTextColor(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#ffffff";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 165 ? "#221A18" : "#ffffff";
}

interface Props {
  draft: InvitationDraftForm;
  /** 하단에 "공유하기 / 발행하기 / 수정하기" 등 작성자 전용 액션을 보여줄지 여부 */
  footerActions?: React.ReactNode;
}

/**
 * 청첩장 카드 본문(커버, 인사말, 예식 정보, 갤러리, 계좌 안내 등)만 렌더링하는 순수 뷰 컴포넌트.
 * - InvitationDetailPage(작성자용 미리보기)와 InvitationPublicViewPage(하객용 조회 전용 공유 페이지)가
 *   이 컴포넌트를 공유해서 쓴다. 헤더/네비게이션/뒤로가기 같은 화면 chrome은 여기 포함하지 않는다.
 * - 이미지(신랑/신부 사진, 갤러리)는 항상 object-cover + object-center 로 렌더링해서
 *   비율이 다른 이미지가 들어와도 가운데를 기준으로 잘리도록 한다.
 */
export function InvitationCardView({ draft, footerActions }: Props) {
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleBgm = useCallback(() => {
    if (!draft.bgmUrl) return;
    if (bgmPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {});
    }
    setBgmPlaying((prev) => !prev);
  }, [bgmPlaying, draft.bgmUrl]);

  const galleryImages = draft.gallery
    .map((img) => img.imageUrl)
    .filter((url) => url.trim().length > 0);
  const hasGroomAccount = Boolean(draft.groomBank || draft.groomAccount);
  const hasBrideAccount = Boolean(draft.brideBank || draft.brideAccount);
  const hasAccounts = hasGroomAccount || hasBrideAccount;

  return (
    <div className="min-h-screen bg-[#F0EEED] pb-16">
      {draft.bgmUrl && (
        <>
          <audio ref={audioRef} src={draft.bgmUrl} loop />
          <button
            onClick={toggleBgm}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white/90 shadow-lg backdrop-blur-md transition-transform hover:scale-105 cursor-pointer"
          >
            <Music className={`h-5 w-5 ${bgmPlaying ? "text-primary" : "text-text-muted"}`} strokeWidth={2} />
          </button>
        </>
      )}

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
              {(draft.groomPhoto || draft.bridePhoto) && (
                <div className="mb-8 flex items-center justify-center gap-4">
                  {draft.groomPhoto && (
                    <div className="h-28 w-28 overflow-hidden rounded-full border border-border">
                      <img
                        src={draft.groomPhoto}
                        alt="신랑"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  )}
                  {draft.bridePhoto && (
                    <div className="h-28 w-28 overflow-hidden rounded-full border border-border">
                      <img
                        src={draft.bridePhoto}
                        alt="신부"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  )}
                </div>
              )}

              <p className="font-serif text-lg font-semibold text-text md:text-xl">
                {draft.groomName || "신랑"}
                <Heart
                  className="mx-2 inline h-4 w-4 fill-current"
                  style={{ color: draft.accentColor ?? draft.mainColor }}
                />
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
          {(draft.mainGreeting || draft.invitationMessage) && (
            <section className="border-t border-border px-6 py-14 text-center">
              {draft.mainGreeting && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-text-muted md:text-base">
                  {draft.mainGreeting}
                </p>
              )}
              {draft.invitationMessage && (
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-text md:text-base">
                  {draft.invitationMessage}
                </p>
              )}
              {draft.additionalMessage && (
                <p className="mt-4 whitespace-pre-line text-xs leading-relaxed text-text-muted">
                  {draft.additionalMessage}
                </p>
              )}
            </section>
          )}

          {/* 예식 정보 */}
          {(draft.venueName || draft.venueDetail) && (
            <section className="border-t border-border px-6 py-14 text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <CalendarCheck className="h-4 w-4 text-primary" />
                <h2 className="font-serif text-lg font-semibold text-text">예식 안내</h2>
              </div>
              <p className="text-sm font-medium text-text">{draft.venueName || "예식장"}</p>
              {draft.venueDetail && <p className="mt-1 text-xs text-text-muted">{draft.venueDetail}</p>}
            </section>
          )}

          {/* 혼주 정보 */}
          {(draft.groomParents || draft.brideParents) && (
            <section className="border-t border-border px-6 py-14 text-center">
              <div className="mb-6 flex items-center justify-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h2 className="font-serif text-lg font-semibold text-text">혼주 안내</h2>
              </div>
              <div className="space-y-4">
                {draft.groomParents && (
                  <div>
                    <p className="text-sm text-text">{draft.groomParents}</p>
                    {draft.groomParentContact && (
                      <p className="mt-1 text-xs text-text-muted">{draft.groomParentContact}</p>
                    )}
                  </div>
                )}
                {draft.brideParents && (
                  <div>
                    <p className="text-sm text-text">{draft.brideParents}</p>
                    {draft.brideParentContact && (
                      <p className="mt-1 text-xs text-text-muted">{draft.brideParentContact}</p>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 오시는 길 */}
          {(draft.venueAddress || draft.transportGuide || draft.parkingGuide || draft.publicTransportGuide) && (
            <section className="border-t border-border px-6 py-14">
              <div className="mb-4 flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h2 className="font-serif text-lg font-semibold text-text">오시는 길</h2>
              </div>
              <div className="space-y-3 text-center">
                {draft.venueAddress && <p className="text-sm text-text">{draft.venueAddress}</p>}
                {draft.transportGuide && (
                  <p className="text-xs text-text-muted">{draft.transportGuide}</p>
                )}
                {draft.parkingGuide && (
                  <p className="text-xs text-text-muted">{draft.parkingGuide}</p>
                )}
                {draft.publicTransportGuide && (
                  <p className="text-xs text-text-muted">{draft.publicTransportGuide}</p>
                )}
              </div>

              {draft.venueAddress && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                  <iframe
                    title="오시는 길 지도"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(draft.venueAddress)}&z=16&output=embed`}
                    className="h-56 w-full"
                    loading="lazy"
                  />
                </div>
              )}
            </section>
          )}

          {/* 갤러리 - 항상 그리드 중앙 정렬 + object-center 크롭으로 이미지가 가운데 기준으로 보이게 함 */}
          {galleryImages.length > 0 && (
            <section className="border-t border-border px-6 py-14">
              <div className="mb-6 flex items-center justify-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <h2 className="font-serif text-lg font-semibold text-text">갤러리</h2>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {galleryImages.map((url, idx) => (
                  <div
                    key={idx}
                    className="aspect-square w-[calc(50%-6px)] max-w-[220px] overflow-hidden rounded-xl bg-primary-light"
                  >
                    <img
                      src={url}
                      alt={`gallery-${idx + 1}`}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        // 깨진 이미지 URL이 들어와도 레이아웃이 무너지지 않도록 아이콘 플레이스홀더로 대체
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.style.display = "none";
                        target.parentElement?.classList.add(
                          "flex",
                          "items-center",
                          "justify-center",
                        );
                        const fallback = document.createElement("div");
                        fallback.className = "text-text-muted text-xs";
                        fallback.innerText = "이미지를 불러올 수 없어요";
                        target.parentElement?.appendChild(fallback);
                      }}
                    />
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
                {hasGroomAccount && (
                  <div>
                    <p className="mb-2 text-xs font-semibold text-text-muted">신랑측</p>
                    <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text">
                      {draft.groomBank} {draft.groomAccount}{" "}
                      <span className="text-text-muted">({draft.groomAccountHolder})</span>
                    </div>
                  </div>
                )}
                {hasBrideAccount && (
                  <div>
                    <p className="mb-2 text-xs font-semibold text-text-muted">신부측</p>
                    <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text">
                      {draft.brideBank} {draft.brideAccount}{" "}
                      <span className="text-text-muted">({draft.brideAccountHolder})</span>
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

            {footerActions}
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
