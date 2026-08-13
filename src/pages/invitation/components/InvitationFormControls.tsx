import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import { Trash2, Plus } from "lucide-react";
import type { InvitationAccount } from "../invitationApi";

const FIELD_BASE =
  "w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 " +
  "focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] " +
  "transition-all placeholder:text-gray-400";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/** 라벨 + input 을 묶은 공용 텍스트 필드 (청첩장 폼 전체에서 재사용) */
export function InvitationTextField({ label, className, ...props }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">{label}</label>
      <input className={`${FIELD_BASE} ${className ?? ""}`} {...props} />
    </div>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function InvitationTextArea({ label, className, ...props }: TextAreaProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">{label}</label>
      <textarea className={`${FIELD_BASE} resize-none ${className ?? ""}`} {...props} />
    </div>
  );
}

/** 섹션 제목 (로즈골드 포인트 바 + 타이틀) - 모든 탭에서 동일한 스타일 사용 */
export function InvitationSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-8 flex items-center gap-2 text-xl font-bold text-gray-900">
      <div className="h-6 w-1.5 rounded-full bg-[#C9A96E]" />
      {children}
    </h2>
  );
}

/** 신랑측/신부측 계좌를 한 줄로 입력하는 공용 로우 (계좌정보 탭에서 반복 사용) */
export function InvitationAccountRow({
  account,
  onChange,
  onRemove,
}: {
  account: InvitationAccount;
  onChange: (next: InvitationAccount) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-4 sm:grid-cols-[1fr_1fr_1.4fr_auto]">
      <input
        value={account.bank}
        onChange={(e) => onChange({ ...account, bank: e.target.value })}
        placeholder="은행명"
        className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30"
      />
      <input
        value={account.accountHolder}
        onChange={(e) => onChange({ ...account, accountHolder: e.target.value })}
        placeholder="예금주"
        className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30"
      />
      <input
        value={account.accountNumber}
        onChange={(e) => onChange({ ...account, accountNumber: e.target.value })}
        placeholder="계좌번호"
        className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30"
      />
      <button
        type="button"
        onClick={onRemove}
        className="flex h-10 w-10 items-center justify-center justify-self-end rounded-full text-gray-300 transition hover:bg-red-50 hover:text-red-400"
        aria-label="계좌 삭제"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function InvitationAddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border border-dashed border-[#C9A96E]/50 px-4 py-2 text-xs font-bold text-[#C9A96E] transition hover:bg-[#FDFAF6]"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
