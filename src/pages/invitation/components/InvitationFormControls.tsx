import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Plus, X } from "lucide-react";
import type { InvitationAccount } from "../invitationApi";

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

interface InvitationAccountRowProps {
  account: InvitationAccount;
  onChange: (account: InvitationAccount) => void;
  onRemove: () => void;
}

export function InvitationAccountRow({ account, onChange, onRemove }: InvitationAccountRowProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-xs font-medium text-text-muted">은행</label>
          <input
            value={account.bank}
            onChange={(e) => onChange({ ...account, bank: e.target.value })}
            placeholder="은행명"
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none placeholder:text-text-muted/50 focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-text-muted">예금주</label>
          <input
            value={account.accountHolder}
            onChange={(e) => onChange({ ...account, accountHolder: e.target.value })}
            placeholder="예금주"
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none placeholder:text-text-muted/50 focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-text-muted">계좌번호</label>
          <div className="flex gap-2">
            <input
              value={account.accountNumber}
              onChange={(e) => onChange({ ...account, accountNumber: e.target.value })}
              placeholder="계좌번호"
              className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-white px-3 text-sm outline-none placeholder:text-text-muted/50 focus:border-primary"
            />
            <button
              type="button"
              onClick={onRemove}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-text-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
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