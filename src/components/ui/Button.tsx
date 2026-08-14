import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'main' | 'secondary' | 'wishlist' | 'pill' | 'hero' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const PRIMARY_GRADIENT = 'gradient-primary-bg shadow-gradient-primary';
const PRIMARY_GRADIENT_ANIMATED = 'gradient-primary-bg-animated shadow-gradient-primary';

const variantClasses: Record<ButtonVariant, string> = {
  main:      `${PRIMARY_GRADIENT} text-white border-0 hover:enabled:opacity-90`,
  secondary: 'bg-white text-text border border-border hover:enabled:bg-primary-light/40',
  wishlist:  `${PRIMARY_GRADIENT} text-white border-0 hover:enabled:opacity-90 transition-opacity`,
  pill:      `rounded-full ${PRIMARY_GRADIENT} text-white border-0 hover:enabled:opacity-90`,
  hero:      `${PRIMARY_GRADIENT_ANIMATED} text-white border-0 hover:enabled:opacity-90`,
  // 이미지/그라디언트 배경 위에 얹히는 반투명 테두리 버튼 — 히어로 섹션 보조 CTA 전용
  outline:   'border border-white/60 bg-transparent text-white transition-colors hover:enabled:bg-white/10',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export default function Button({
  variant = 'main',
  size = 'md',
  type = 'button',
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        'rounded-full cursor-pointer font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}