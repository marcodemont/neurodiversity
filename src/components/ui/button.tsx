import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'solid' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
  }
>;

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  solid: 'bg-primary text-white hover:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/50',
  ghost: 'bg-transparent hover:bg-emerald-50 text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500/20',
  outline:
    'border border-emerald-200 text-emerald-700 hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-500/30'
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

export function Button({
  children,
  className,
  variant = 'solid',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
