import { cn } from '../../utils/cn';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      className={cn(
        'rounded-full animate-spin border-transparent',
        sizeClasses[size],
        className
      )}
      style={{
        borderTopColor: 'var(--color-brand-500)',
        borderRightColor: 'var(--color-brand-300)',
      }}
    />
  );
}
