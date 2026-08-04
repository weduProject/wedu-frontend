import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'main' | 'secondary' | 'wishlist' | 'pill';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const PRIMARY_GRADIENT =
  'bg-[linear-gradient(111.47deg,#F79689_0%,#E8796C_33.33%,#FEABA0_66.67%,#E8796C_100%)] shadow-[0px_4px_14px_rgba(161,86,77,0.18),0px_0px_24px_rgba(232,121,108,0.28),inset_0px_1px_0px_rgba(255,255,255,0.2)]';

const variantClasses: Record<ButtonVariant, string> = {
  main: `${PRIMARY_GRADIENT} text-white border-0 hover:enabled:opacity-90`,
  secondary: 'bg-white text-text border border-border hover:enabled:bg-primary-light/40',
  wishlist:
    `${PRIMARY_GRADIENT} text-white border-0 hover:enabled:opacity-90 transition-opacity`,
  pill: `rounded-full ${PRIMARY_GRADIENT} text-white border-0 hover:enabled:opacity-90`,
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