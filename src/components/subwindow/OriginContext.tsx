import { Quote } from 'lucide-react';

interface OriginContextProps {
  text: string;
}

export function OriginContext({ text }: OriginContextProps) {
  return (
    <div
      className="mx-4 mt-3 mb-2 px-3 py-2 rounded-xl flex gap-2"
      style={{
        background: 'var(--color-surface-3)',
        border: '1px solid var(--color-border)',
      }}
    >
      <Quote size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-brand-400)' }} />
      <p className="text-xs leading-relaxed italic" style={{ color: 'var(--color-text-secondary)' }}>
        {text}
      </p>
    </div>
  );
}
