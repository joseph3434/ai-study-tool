import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Session } from '../types/session';
import type { ConversationTree } from '../types/conversation';

const ROOT_ID = 'root';

export function makeInitialTree(): ConversationTree {
  return {
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
}

function makeSession(tree?: ConversationTree): Session {
  return {
    id: nanoid(),
    title: 'New Chat',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tree: tree ?? makeInitialTree(),
  };
}

interface SessionStore {
  sessions: Session[];
  currentSessionId: string;

  getCurrentSession: () => Session | undefined;
  newSession: () => ConversationTree;
  loadSession: (id: string) => ConversationTree;
  saveSession: (tree: ConversationTree) => void;
  autoNameSession: (firstUserMessage: string) => void;
  deleteSession: (id: string) => void;
}

const firstSession = makeSession();

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      sessions: [firstSession],
      currentSessionId: firstSession.id,

      getCurrentSession: () => {
        const { sessions, currentSessionId } = get();
        return sessions.find((s) => s.id === currentSessionId);
      },

      newSession: () => {
        const session = makeSession();
        set((state) => ({
          sessions: [session, ...state.sessions],
          currentSessionId: session.id,
        }));
        return session.tree;
      },

      loadSession: (id) => {
        const session = get().sessions.find((s) => s.id === id);
        if (!session) return makeInitialTree();
        set({ currentSessionId: id });
        return session.tree;
      },

      saveSession: (tree) => {
        const { currentSessionId } = get();
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === currentSessionId
              ? { ...s, tree, updatedAt: Date.now() }
              : s
          ),
        }));
      },

      autoNameSession: (firstUserMessage) => {
        const { currentSessionId } = get();
        const title =
          firstUserMessage.length > 52
            ? firstUserMessage.slice(0, 50) + '…'
            : firstUserMessage;
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === currentSessionId && s.title === 'New Chat'
              ? { ...s, title }
              : s
          ),
        }));
      },

      deleteSession: (id) => {
        set((state) => {
          const remaining = state.sessions.filter((s) => s.id !== id);
          if (remaining.length === 0) {
            const fresh = makeSession();
            return { sessions: [fresh], currentSessionId: fresh.id };
          }
          const newCurrentId =
            state.currentSessionId === id ? remaining[0].id : state.currentSessionId;
          return { sessions: remaining, currentSessionId: newCurrentId };
        });
      },
    }),
    { name: 'study-ai-sessions' }
  )
);
