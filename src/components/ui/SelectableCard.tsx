import type { ReactNode } from 'react';
import clsx from 'clsx';

interface SelectableCardProps {
  isSelected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export default function SelectableCard({ isSelected = false, onClick, children, className }: SelectableCardProps) {
  return (
    <button
      type="button"
      className={clsx(
        'block w-full text-left bg-white border-2 rounded-xl p-4 cursor-pointer transition-colors hover:border-primary/40',
        isSelected ? 'border-primary bg-primary-light' : 'border-border',
        className,
      )}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      {children}
    </button>
  );
}
