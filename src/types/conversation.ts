export interface HighlightOrigin {
  text: string;
  parentConversationId: string;
  parentMessageId: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streamingContent?: string;
  isStreaming: boolean;
  timestamp: number;
}

export interface Conversation {
  id: string;
  parentConversationId: string | null;
  parentMessageId: string | null;
  origin: HighlightOrigin | null;
  messages: Message[];
  depth: number;
}

export interface ConversationTree {
  rootId: string;
  conversations: Record<string, Conversation>;
  activeSubWindowIds: string[];
}

export interface BreadcrumbItem {
  label: string;
  conversationId: string;
}
