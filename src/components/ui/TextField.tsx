import type { InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: ReactNode;
}

export default function TextField({ error, icon, className, ...props }: TextFieldProps) {
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <div
        className={clsx(
          'flex items-center rounded-lg px-3 bg-white transition-colors focus-within:border-primary border',
          error ? 'border-error' : 'border-border',
        )}
      >
        {icon && <span className="text-text-muted mr-2">{icon}</span>}
        <input className="flex-1 border-0 outline-none py-2.5 text-sm bg-transparent" {...props} />
      </div>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}
