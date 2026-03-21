import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' && 'text-sm px-3 py-1.5',
        size === 'md' && 'text-sm px-4 py-2',
        variant === 'primary' && [
          'text-white',
          'shadow-glow-brand hover:shadow-none',
        ],
        variant === 'ghost' && [
          'text-[var(--color-text-secondary)]',
          'hover:text-[var(--color-text-primary)]',
          'hover:bg-[var(--color-surface-3)]',
        ],
        variant === 'outline' && [
          'border border-[var(--color-border-strong)]',
          'text-[var(--color-text-secondary)]',
          'hover:border-brand-500/50 hover:text-[var(--color-text-primary)]',
        ],
        className
      )}
      style={
        variant === 'primary'
          ? { background: 'var(--gradient-brand)' }
          : undefined
      }
      {...props}
    >
      {children}
    </button>
  );
}
