import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { streamMessage } from '../api/client';
import { MAIN_SYSTEM_PROMPT, buildSubWindowSystemPrompt } from '../api/prompts';
import type { ConversationTree, HighlightOrigin, Message } from '../types/conversation';
import { buildSubWindowMessages } from '../utils/treeUtils';

interface ConversationStore {
  tree: ConversationTree;
  isMainStreaming: boolean;

  sendMainMessage: (content: string) => Promise<void>;
  sendSubMessage: (conversationId: string, content: string) => Promise<void>;
  createSubConversation: (origin: HighlightOrigin, initialAnswer: string) => string;
  openSubWindow: (conversationId: string) => void;
  closeSubWindow: (conversationId: string) => void;
  closeAllSubWindowsFrom: (depth: number) => void;
  appendStreamChunk: (conversationId: string, messageId: string, chunk: string) => void;
  finalizeMessage: (conversationId: string, messageId: string) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'timestamp'>) => void;
}

const ROOT_ID = 'root';

const initialTree: ConversationTree = {
  rootId: ROOT_ID,
  conversations: {
    [ROOT_ID]: {
      id: ROOT_ID,
      parentConversationId: null,
      parentMessageId: null,
      origin: null,
      messages: [],
      depth: 0,
    },
  },
  activeSubWindowIds: [],
};

export const useConversationStore = create<ConversationStore>((set, get) => ({
  tree: initialTree,
  isMainStreaming: false,

  addMessage: (conversationId, message) => {
    set((state) => {
      const conv = state.tree.conversations[conversationId];
      if (!conv) return state;
      return {
        tree: {
          ...state.tree,
          conversations: {
            ...state.tree.conversations,
            [conversationId]: {
              ...conv,
              messages: [...conv.messages, { ...message, timestamp: Date.now() }],
            },
          },
        },
      };
    });
  },

  appendStreamChunk: (conversationId, messageId, chunk) => {
    set((state) => {
      const conv = state.tree.conversations[conversationId];
      if (!conv) return state;
      return {
        tree: {
          ...state.tree,
          conversations: {
            ...state.tree.conversations,
            [conversationId]: {
              ...conv,
              messages: conv.messages.map((m) =>
                m.id === messageId
                  ? { ...m, streamingContent: (m.streamingContent ?? '') + chunk }
                  : m
              ),
            },
          },
        },
      };
    });
  },

  finalizeMessage: (conversationId, messageId) => {
    set((state) => {
      const conv = state.tree.conversations[conversationId];
      if (!conv) return state;
      return {
        tree: {
          ...state.tree,
          conversations: {
            ...state.tree.conversations,
            [conversationId]: {
              ...conv,
              messages: conv.messages.map((m) =>
                m.id === messageId
                  ? { ...m, content: m.streamingContent ?? '', streamingContent: undefined, isStreaming: false }
                  : m
              ),
            },
          },
        },
      };
    });
  },

  sendMainMessage: async (content) => {
    const { tree, addMessage, appendStreamChunk, finalizeMessage } = get();
    const rootConv = tree.conversations[ROOT_ID];

    // Add user message
    const userMsgId = nanoid();
    addMessage(ROOT_ID, { id: userMsgId, role: 'user', content, isStreaming: false });

    // Add placeholder assistant message
    const assistantMsgId = nanoid();
    addMessage(ROOT_ID, { id: assistantMsgId, role: 'assistant', content: '', isStreaming: true });

    set({ isMainStreaming: true });

    try {
      const messages = [
        ...rootConv.messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content },
      ];

      for await (const chunk of streamMessage(messages, MAIN_SYSTEM_PROMPT)) {
        appendStreamChunk(ROOT_ID, assistantMsgId, chunk);
      }
      finalizeMessage(ROOT_ID, assistantMsgId);
    } catch (err) {
      finalizeMessage(ROOT_ID, assistantMsgId);
    } finally {
      set({ isMainStreaming: false });
    }
  },

  sendSubMessage: async (conversationId, content) => {
    const { tree, addMessage, appendStreamChunk, finalizeMessage } = get();
    const conv = tree.conversations[conversationId];
    if (!conv || !conv.origin) return;

    const userMsgId = nanoid();
    addMessage(conversationId, { id: userMsgId, role: 'user', content, isStreaming: false });

    const assistantMsgId = nanoid();
    addMessage(conversationId, { id: assistantMsgId, role: 'assistant', content: '', isStreaming: true });

    try {
      const messages = buildSubWindowMessages(conversationId, get().tree);
      messages.push({ role: 'user', content });

      const systemPrompt = buildSubWindowSystemPrompt(conv.origin);

      for await (const chunk of streamMessage(messages, systemPrompt)) {
        appendStreamChunk(conversationId, assistantMsgId, chunk);
      }
      finalizeMessage(conversationId, assistantMsgId);
    } catch (err) {
      finalizeMessage(conversationId, assistantMsgId);
    }
  },

  createSubConversation: (origin, initialAnswer) => {
    const newId = nanoid();
    const parentConv = get().tree.conversations[origin.parentConversationId];
    const depth = parentConv ? parentConv.depth + 1 : 1;

    const initialMsg: Message = {
      id: nanoid(),
      role: 'assistant',
      content: initialAnswer,
      isStreaming: false,
      timestamp: Date.now(),
    };

    set((state) => ({
      tree: {
        ...state.tree,
        conversations: {
          ...state.tree.conversations,
          [newId]: {
            id: newId,
            parentConversationId: origin.parentConversationId,
            parentMessageId: origin.parentMessageId,
            origin,
            messages: [initialMsg],
            depth,
          },
        },
      },
    }));

    return newId;
  },

  openSubWindow: (conversationId) => {
    set((state) => {
      const conv = state.tree.conversations[conversationId];
      if (!conv) return state;

      // Close any sub-windows at same or deeper depth first
      const filtered = state.tree.activeSubWindowIds.filter((id) => {
        const c = state.tree.conversations[id];
        return c && c.depth < conv.depth;
      });

      return {
        tree: {
          ...state.tree,
          activeSubWindowIds: [...filtered, conversationId],
        },
      };
    });
  },

  closeSubWindow: (conversationId) => {
    set((state) => {
      const conv = state.tree.conversations[conversationId];
      if (!conv) return state;

      // Remove this conv and all deeper ones
      const filtered = state.tree.activeSubWindowIds.filter((id) => {
        const c = state.tree.conversations[id];
        return c && c.depth < conv.depth;
      });

      return {
        tree: {
          ...state.tree,
          activeSubWindowIds: filtered,
        },
      };
    });
  },

  closeAllSubWindowsFrom: (depth) => {
    set((state) => ({
      tree: {
        ...state.tree,
        activeSubWindowIds: state.tree.activeSubWindowIds.filter((id) => {
          const c = state.tree.conversations[id];
          return c && c.depth < depth;
        }),
      },
    }));
  },
}));
