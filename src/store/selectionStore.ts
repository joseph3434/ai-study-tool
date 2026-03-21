import { create } from 'zustand';
import type { PopoverState } from '../types/selection';

interface SelectionStore {
  selectedText: string | null;
  selectedMessageId: string | null;
  selectedConversationId: string | null;
  selectionRect: DOMRect | null;

  popoverState: PopoverState;
  popoverAnswer: string | null;
  popoverStreamingAnswer: string | null;
  popoverConversationId: string | null;

  setSelection: (
    text: string,
    messageId: string,
    convId: string,
    rect: DOMRect
  ) => void;
  clearSelection: () => void;
  setPopoverState: (state: PopoverState) => void;
  appendPopoverChunk: (chunk: string) => void;
  finalizePopoverAnswer: () => void;
  setPopoverConversationId: (id: string) => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
  selectedText: null,
  selectedMessageId: null,
  selectedConversationId: null,
  selectionRect: null,

  popoverState: 'idle',
  popoverAnswer: null,
  popoverStreamingAnswer: null,
  popoverConversationId: null,

  setSelection: (text, messageId, convId, rect) =>
    set({
      selectedText: text,
      selectedMessageId: messageId,
      selectedConversationId: convId,
      selectionRect: rect,
      popoverState: 'idle',
      popoverAnswer: null,
      popoverStreamingAnswer: null,
      popoverConversationId: null,
    }),

  clearSelection: () =>
    set({
      selectedText: null,
      selectedMessageId: null,
      selectedConversationId: null,
      selectionRect: null,
      popoverState: 'idle',
      popoverAnswer: null,
      popoverStreamingAnswer: null,
      popoverConversationId: null,
    }),

  setPopoverState: (state) => set({ popoverState: state }),

  appendPopoverChunk: (chunk) =>
    set((s) => ({
      popoverStreamingAnswer: (s.popoverStreamingAnswer ?? '') + chunk,
    })),

  finalizePopoverAnswer: () =>
    set((s) => ({
      popoverAnswer: s.popoverStreamingAnswer,
      popoverState: 'answered',
    })),

  setPopoverConversationId: (id) => set({ popoverConversationId: id }),
}));
