import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = 'text', ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm',
        'placeholder:text-neutral-500',
        'focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100',
        'disabled:cursor-not-allowed disabled:bg-neutral-100',
        className
      )}
      {...props}
    />
  );
});