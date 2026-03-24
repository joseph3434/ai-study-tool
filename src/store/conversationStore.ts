import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { streamMessage } from '../api/client';
import { MAIN_SYSTEM_PROMPT, buildSubWindowSystemPrompt } from '../api/prompts';
import type { ConversationTree, HighlightOrigin, Message } from '../types/conversation';
import { buildSubWindowMessages } from '../utils/treeUtils';
import { useSessionStore, makeInitialTree } from './sessionStore';

interface ConversationStore {
  tree: ConversationTree;
  isMainStreaming: boolean;

  loadTree: (tree: ConversationTree) => void;
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

function getStartingTree(): ConversationTree {
  const session = useSessionStore.getState().getCurrentSession();
  return session?.tree ?? makeInitialTree();
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  tree: getStartingTree(),
  isMainStreaming: false,

  loadTree: (tree) => {
    set({ tree });
  },

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
      const newTree = {
        ...state.tree,
        conversations: {
          ...state.tree.conversations,
          [conversationId]: {
            ...conv,
            messages: conv.messages.map((m) =>
              m.id === messageId
                ? {
                    ...m,
                    content: m.streamingContent ?? '',
                    streamingContent: undefined,
                    isStreaming: false,
                  }
                : m
            ),
          },
        },
      };
      // Auto-save to session store after each finalized message
      useSessionStore.getState().saveSession(newTree);
      return { tree: newTree };
    });
  },

  sendMainMessage: async (content) => {
    const { tree, addMessage, appendStreamChunk, finalizeMessage } = get();
    const rootId = tree.rootId;
    const rootConv = tree.conversations[rootId];

    // Auto-name the session from the first user message
    if (rootConv.messages.length === 0) {
      useSessionStore.getState().autoNameSession(content);
    }

    // Add user message
    const userMsgId = nanoid();
    addMessage(rootId, { id: userMsgId, role: 'user', content, isStreaming: false });

    // Add placeholder assistant message
    const assistantMsgId = nanoid();
    addMessage(rootId, { id: assistantMsgId, role: 'assistant', content: '', isStreaming: true });

    set({ isMainStreaming: true });

    try {
      const messages = [
        ...rootConv.messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content },
      ];

      for await (const chunk of streamMessage(messages, MAIN_SYSTEM_PROMPT)) {
        appendStreamChunk(rootId, assistantMsgId, chunk);
      }
      finalizeMessage(rootId, assistantMsgId);
    } catch (_err) {
      finalizeMessage(rootId, assistantMsgId);
    } finally {
      set({ isMainStreaming: false });
    }
  },

  sendSubMessage: async (conversationId, content) => {
    const { addMessage, appendStreamChunk, finalizeMessage } = get();
    const conv = get().tree.conversations[conversationId];
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
    } catch (_err) {
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
