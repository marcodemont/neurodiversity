import type { LabelHTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';

export function Label({ children, className, ...props }: PropsWithChildren<LabelHTMLAttributes<HTMLLabelElement>>) {
  return (
    <label className={clsx('block text-sm font-medium text-slate-600', className)} {...props}>
      {children}
    </label>
  );
}
