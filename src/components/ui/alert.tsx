import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type Tone = 'info' | 'success' | 'warning' | 'error';

const tones: Record<Tone, string> = {
  info: 'border-info/30 bg-info/5 text-info',
  success: 'border-success/30 bg-success/5 text-success',
  warning: 'border-warning/30 bg-warning/5 text-warning',
  error: 'border-error/30 bg-error/5 text-error'
};

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  tone?: Tone;
  title?: string;
};

export function Alert({ className, tone = 'info', title, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn('rounded-md border p-4 text-sm', tones[tone], className)}
      {...props}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      {children ? <div className={title ? 'mt-1' : ''}>{children}</div> : null}
    </div>
  );
}