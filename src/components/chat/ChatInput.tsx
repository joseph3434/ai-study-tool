import { useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = 'Ask anything about your studies\u2026' }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 144) + 'px';
  };

  return (
    <div
      className="p-3 border-t"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-1)' }}
    >
      <div
        className="flex items-end gap-2 rounded-xl border px-3 py-2 transition-all duration-150 focus-within:border-brand-500/50"
        style={{
          background: 'var(--color-surface-2)',
          borderColor: 'var(--color-border-strong)',
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'flex-1 bg-transparent resize-none text-sm leading-relaxed',
            'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
            'focus:outline-none',
            'max-h-36 min-h-[24px]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={cn(
            'p-1.5 rounded-lg transition-all duration-150 flex-shrink-0',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
            value.trim() && !disabled
              ? 'text-white opacity-100'
              : 'text-[var(--color-text-muted)] opacity-50 cursor-not-allowed'
          )}
          style={
            value.trim() && !disabled
              ? { background: 'var(--gradient-brand)', boxShadow: 'var(--glow-brand)' }
              : {}
          }
        >
          <Send size={16} />
        </button>
      </div>
      <p className="text-center text-xs mt-1.5" style={{ color: 'var(--color-text-muted)' }}>
        Press Enter to send &middot; Shift+Enter for new line &middot; Highlight text to ask
      </p>
    </div>
  );
}
