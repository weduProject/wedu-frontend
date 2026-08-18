import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Plus } from "lucide-react";
import type { InvitationGalleryImage } from "../invitationApi";

interface InvitationTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InvitationTextField({ label, className = "", ...props }: InvitationTextFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-text-muted">{label}</label>
      <input
        {...props}
        className={`h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-text outline-none transition placeholder:text-text-muted/50 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 ${className}`}
      />
    </div>
  );
}

interface InvitationTimeSelectProps {
  label?: string;
  value?: string;
  onChange: (time: string) => void;
  className?: string;
}

export function InvitationTimeSelect({
  label,
  value = '12:00',
  onChange,
  className = '',
}: InvitationTimeSelectProps) {
  const safeValue = value || '12:00';
  const [currentHour = '12', currentMinute = '00'] = safeValue.split(':');

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(`${e.target.value}:${currentMinute}`);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(`${currentHour}:${e.target.value}`);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-text-muted">{label}</label>
      )}

      <div className="flex gap-2">
        <select
          value={currentHour}
          onChange={handleHourChange}
          className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-text outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
        >
          {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map((h) => (
            <option key={h} value={h}>
              {h}시
            </option>
          ))}
        </select>

        <select
          value={currentMinute}
          onChange={handleMinuteChange}
          className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-text outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
        >
          {['00', '30'].map((m) => (
            <option key={m} value={m}>
              {m}분
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

interface InvitationTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function InvitationTextArea({ label, className = "", ...props }: InvitationTextAreaProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-text-muted">{label}</label>
      <textarea
        {...props}
        className={`w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition placeholder:text-text-muted/50 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 ${className}`}
      />
    </div>
  );
}

export function InvitationSectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-6 text-base font-bold text-text font-serif">{children}</h2>;
}

export function InvitationAddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-text-muted transition hover:border-primary/30 hover:bg-primary-light hover:text-primary"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

// 청첩장 작성 폼 데이터 형태 — CreatePage(작성)와 DetailPage(미리보기)가 공유
// ⚠️ 실제 백엔드 DTO(InvitationDraft)와 필드명을 그대로 맞춤 (2026-08-17 스웨거 확정 기준)
export interface InvitationDraftForm {
  id?: number;
  status?: "DRAFT" | "PUBLISHED";
  templateId: string;
  title: string;

  groomName: string;
  brideName: string;
  groomPhoto: string;
  bridePhoto: string;
  groomContact: string;
  brideContact: string;

  groomParents: string;
  brideParents: string;
  groomParentContact: string;
  brideParentContact: string;

  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  venueDetail: string;

  mainGreeting: string;
  invitationMessage: string;
  additionalMessage: string;

  transportGuide: string;
  parkingGuide: string;
  publicTransportGuide: string;

  // 계좌는 신랑측/신부측 각 1개만 지원 (배열 아님)
  groomBank: string;
  groomAccount: string;
  groomAccountHolder: string;
  brideBank: string;
  brideAccount: string;
  brideAccountHolder: string;

  gallery: InvitationGalleryImage[];

  mainColor: string;
  // 배경(mainColor)과 별개로 구분선·강조 텍스트에 쓰는 포인트 색. 백엔드엔 없는 프론트 전용 값이라
  // 저장 시에는 InvitationDraft로 변환하면서 제외한다. 없으면 mainColor를 그대로 씀
  accentColor?: string;
  // 템플릿에서 넘어온 원본 3단 그라디언트 CSS 값(프론트 전용). 저장 시 제외됨
  backgroundGradient?: string;
  bgmUrl: string;
}

// 숫자만 추출해서 010-0000-0000 형태로 자동 하이픈을 넣어줌.
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}