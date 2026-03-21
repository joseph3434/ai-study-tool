import { BookOpen, Moon, Sun } from 'lucide-react';
import { ChatThread } from '../chat/ChatThread';
import { ChatInput } from '../chat/ChatInput';
import { useConversationStore } from '../../store/conversationStore';
import { useUIStore } from '../../store/uiStore';
import { IconButton } from '../ui/IconButton';

export function MainPanel() {
  const { tree, sendMainMessage, isMainStreaming } = useConversationStore();
  const { theme, toggleTheme } = useUIStore();

  const rootConv = tree.conversations[tree.rootId];
  const messages = rootConv?.messages ?? [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
        style={{
          borderColor: 'var(--color-border)',
          background: 'rgba(19, 19, 26, 0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--glow-brand)' }}
          >
            <BookOpen size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Study AI
            </h1>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              AP Courses &middot; Highlight text to explore
            </p>
          </div>
        </div>

        <IconButton label="Toggle theme" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </IconButton>
      </div>

      {/* Chat */}
      <ChatThread messages={messages} conversationId={tree.rootId} />

      {/* Input */}
      <ChatInput
        onSend={sendMainMessage}
        disabled={isMainStreaming}
      />
    </div>
  );
}
