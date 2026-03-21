import type { BreadcrumbItem, Conversation, ConversationTree, Message } from '../types/conversation';

export function buildBreadcrumb(
  conversationId: string,
  tree: ConversationTree
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];
  let current: Conversation | undefined = tree.conversations[conversationId];

  while (current) {
    items.unshift({
      label: current.origin
        ? truncateText(current.origin.text, 28)
        : 'Main Chat',
      conversationId: current.id,
    });
    current = current.parentConversationId
      ? tree.conversations[current.parentConversationId]
      : undefined;
  }

  return items;
}

export function getLastNMessages(
  conversation: Conversation,
  n: number
): Message[] {
  return conversation.messages.slice(-n);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '\u2026';
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function buildSubWindowMessages(
  conversationId: string,
  tree: ConversationTree
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const conv = tree.conversations[conversationId];
  if (!conv) return [];

  const result: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  // Inject parent context (last 4 messages from parent)
  if (conv.parentConversationId) {
    const parent = tree.conversations[conv.parentConversationId];
    if (parent) {
      const parentMsgs = getLastNMessages(parent, 4);
      for (const msg of parentMsgs) {
        if (msg.content) {
          result.push({ role: msg.role, content: msg.content });
        }
      }
    }
  }

  // Context injection for the highlighted origin
  if (conv.origin) {
    result.push({
      role: 'user',
      content: `[Context: I was studying and came across this text: "${conv.origin.text}"]`,
    });
  }

  // Sub-conversation messages
  for (const msg of conv.messages) {
    if (msg.content) {
      result.push({ role: msg.role, content: msg.content });
    }
  }

  return result;
}
