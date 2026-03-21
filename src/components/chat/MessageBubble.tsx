import { motion } from 'framer-motion';
import { MessageContent } from './MessageContent';
import { TypingIndicator } from './TypingIndicator';
import type { Message } from '../../types/conversation';

interface MessageBubbleProps {
  message: Message;
  conversationId: string;
}

export function MessageBubble({ message, conversationId }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const content = message.streamingContent ?? message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {isUser ? (
        <div
          className="max-w-[75%] px-4 py-3 rounded-2xl text-white text-sm font-medium shadow-glow-brand"
          style={{ background: 'var(--gradient-brand)' }}
        >
          {content}
        </div>
      ) : (
        <div
          data-message-id={message.id}
          data-conversation-id={conversationId}
          className="max-w-[90%] px-4 py-3 rounded-2xl text-sm relative"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--glow-subtle)',
            borderLeft: '3px solid var(--color-brand-500)',
          }}
        >
          {message.isStreaming && !content ? (
            <TypingIndicator />
          ) : (
            <MessageContent content={content} />
          )}
        </div>
      )}
    </motion.div>
  );
}
