import type { ReactNode } from 'react';
import clsx from 'clsx';

interface BaseCardProps {
  title?: ReactNode;
  extra?: ReactNode;
  shadow?: boolean;
  children: ReactNode;
  className?: string;
  /** children을 감싸는 내부 flex 컨테이너의 간격을 조정하고 싶을 때 사용 (기본값: gap-1) */
  contentClassName?: string;
}

export default function BaseCard({ title, extra, shadow = true, children, className, contentClassName }: BaseCardProps) {
  return (
    <article
      className={clsx(
        'bg-white border border-border rounded-xl p-5 min-w-45',
        shadow && 'shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
        className,
      )}
    >
      {(title || extra) && (
        <div className="flex justify-between items-center mb-3">
          {title && <h3 className="text-sm font-semibold text-text-muted">{title}</h3>}
          {extra && <div className="text-[13px]">{extra}</div>}
        </div>
      )}
      <div className={clsx('flex flex-col gap-1', contentClassName)}>{children}</div>
    </article>
  );
}