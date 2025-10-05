import type { PropsWithChildren, HTMLAttributes } from 'react';
import clsx from 'clsx';

export function Card({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={clsx(
        'rounded-3xl border border-slate-200 bg-white/80 backdrop-blur shadow-sm transition-shadow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={clsx('px-6 pt-6 pb-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <h3 className={clsx('text-xl font-semibold tracking-tight text-slate-900', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={clsx('px-6 pb-6 space-y-4', className)} {...props}>
      {children}
    </div>
  );
}
