import type { ReactNode } from 'react';
import clsx from 'clsx';

interface SelectableCardProps {
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export default function SelectableCard({
  isSelected = false,
  onClick,
  disabled = false,
  children,
  className,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      className={clsx(
        'block w-full text-left bg-white border-2 rounded-xl p-4 transition-colors',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-primary/40',
        isSelected ? 'border-primary bg-primary-light' : 'border-border',
        className,
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={isSelected}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}