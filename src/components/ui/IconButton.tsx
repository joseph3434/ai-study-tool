import { cn } from '../../utils/cn';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function IconButton({ label, className, children, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        'p-1.5 rounded-lg transition-all duration-150',
        'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
        'hover:bg-[var(--color-surface-3)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
