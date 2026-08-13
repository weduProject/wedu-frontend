import type { ReactNode } from 'react';
import clsx from 'clsx';

interface SelectableCardProps {
  isSelected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function SelectableCard({ isSelected = false, onClick, children, className, disabled = false }: SelectableCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        'block w-full text-left bg-white border-2 rounded-xl p-4 cursor-pointer transition-colors hover:border-primary/40',
        isSelected ? 'border-primary bg-primary-light' : 'border-border',
        disabled && 'opacity-40 cursor-not-allowed',
        className,
      )}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      {children}
    </button>
  );
}
