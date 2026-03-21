import { useEffect } from 'react';
import { useConversationStore } from '../store/conversationStore';

export function useKeyboardShortcuts() {
  const { tree, closeSubWindow } = useConversationStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const ids = tree.activeSubWindowIds;
        if (ids.length > 0) {
          closeSubWindow(ids[ids.length - 1]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [tree.activeSubWindowIds, closeSubWindow]);
}
