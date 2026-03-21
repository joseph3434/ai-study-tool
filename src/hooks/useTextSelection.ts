import { useEffect } from 'react';
import { useSelectionStore } from '../store/selectionStore';

export function useTextSelection(
  containerRef: React.RefObject<HTMLElement | null>,
  conversationId: string
) {
  const { setSelection, clearSelection } = useSelectionStore();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.toString().trim() === '') return;

      const anchorNode = selection.anchorNode;
      if (!anchorNode || !container.contains(anchorNode)) return;

      // Find nearest message bubble
      const element = anchorNode instanceof Element
        ? anchorNode
        : anchorNode.parentElement;
      const messageBubble = element?.closest('[data-message-id]');

      if (!messageBubble) return;

      const messageId = messageBubble.getAttribute('data-message-id') ?? '';
      const convId = messageBubble.getAttribute('data-conversation-id') ?? conversationId;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (rect.width === 0) return;

      setSelection(selection.toString().trim(), messageId, convId, rect);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('[data-selection-action]') ||
        target.closest('[data-highlight-popover]')
      ) {
        return;
      }
      clearSelection();
    };

    const handleScroll = () => {
      clearSelection();
    };

    container.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, conversationId, setSelection, clearSelection]);
}
