import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { useTextSelection } from '../../hooks/useTextSelection';
import type { Message } from '../../types/conversation';

interface ChatThreadProps {
  messages: Message[];
  conversationId: string;
}

export function ChatThread({ messages, conversationId }: ChatThreadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useTextSelection(containerRef, conversationId);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, messages[messages.length - 1]?.streamingContent]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-1"
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--glow-brand)' }}
          >
            📚
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Ready to study?
            </h2>
            <p className="text-sm max-w-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Ask me anything about AP Calculus, Physics, Chemistry, and more. Highlight any text in my response to get a quick explanation.
            </p>
          </div>
        </div>
      )}

      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            conversationId={conversationId}
          />
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
