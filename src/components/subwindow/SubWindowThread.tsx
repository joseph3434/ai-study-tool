import { ChatThread } from '../chat/ChatThread';
import { ChatInput } from '../chat/ChatInput';
import { useConversationStore } from '../../store/conversationStore';

interface SubWindowThreadProps {
  conversationId: string;
}

export function SubWindowThread({ conversationId }: SubWindowThreadProps) {
  const { tree, sendSubMessage } = useConversationStore();
  const conv = tree.conversations[conversationId];

  if (!conv) return null;

  const isStreaming = conv.messages.some((m) => m.isStreaming);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <ChatThread messages={conv.messages} conversationId={conversationId} />
      <ChatInput
        onSend={(content) => sendSubMessage(conversationId, content)}
        disabled={isStreaming}
        placeholder="Ask a follow-up question\u2026"
      />
    </div>
  );
}
