import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useSelectionStore } from '../../store/selectionStore';
import { useConversationStore } from '../../store/conversationStore';
import { Spinner } from '../ui/Spinner';
import { MessageContent } from '../chat/MessageContent';
import { computePopoverPosition } from '../../utils/selectionUtils';

export function HighlightPopover() {
  const {
    selectedText,
    selectedMessageId,
    selectedConversationId,
    selectionRect,
    popoverState,
    popoverAnswer,
    popoverStreamingAnswer,
    clearSelection,
    setPopoverConversationId,
  } = useSelectionStore();

  const { createSubConversation, openSubWindow } = useConversationStore();

  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const isVisible = !!selectedText && (popoverState === 'loading' || popoverState === 'answered' || popoverState === 'error');

  useLayoutEffect(() => {
    if (!selectionRect || !popoverRef.current) return;
    const rect = popoverRef.current.getBoundingClientRect();
    const pos = computePopoverPosition(selectionRect, { w: rect.width || 320, h: rect.height || 200 });
    setPosition(pos);
  }, [selectionRect, popoverState, popoverStreamingAnswer]);

  const handleExpand = () => {
    if (!selectedText || !selectedMessageId || !selectedConversationId) return;

    const content = popoverAnswer ?? popoverStreamingAnswer ?? '';
    const newConvId = createSubConversation(
      {
        text: selectedText,
        parentConversationId: selectedConversationId,
        parentMessageId: selectedMessageId,
      },
      content
    );
    setPopoverConversationId(newConvId);
    openSubWindow(newConvId);
    clearSelection();
  };

  const displayContent = popoverAnswer ?? popoverStreamingAnswer ?? '';

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={popoverRef}
          data-highlight-popover
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed z-[8999] rounded-2xl overflow-hidden"
          style={{
            top: position.top,
            left: position.left,
            width: 340,
            maxHeight: 280,
            background: 'var(--gradient-popover)',
            border: '1px solid var(--color-border-strong)',
            boxShadow: 'var(--glow-subtle), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-3 pt-3 pb-2 border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <p
              className="text-xs font-medium truncate flex-1 mr-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              "{selectedText?.slice(0, 40)}{(selectedText?.length ?? 0) > 40 ? '\u2026' : ''}"
            </p>
            <button
              onClick={clearSelection}
              className="p-0.5 rounded hover:opacity-80 flex-shrink-0"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <X size={12} />
            </button>
          </div>

          {/* Content */}
          <div className="px-3 py-2 overflow-y-auto" style={{ maxHeight: 200 }}>
            {popoverState === 'loading' && !displayContent && (
              <div className="flex items-center gap-2 py-2">
                <Spinner size="sm" />
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Thinking\u2026
                </span>
              </div>
            )}
            {displayContent && (
              <div className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                <MessageContent content={displayContent} />
              </div>
            )}
            {popoverState === 'error' && (
              <p className="text-xs text-red-400 py-1">Something went wrong. Please try again.</p>
            )}
          </div>

          {/* Footer */}
          {(popoverState === 'answered' || (popoverState === 'loading' && displayContent)) && (
            <div
              className="px-3 py-2 border-t flex justify-end"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <button
                onClick={handleExpand}
                className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-150"
                style={{ color: 'var(--color-brand-400)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-brand-300)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-brand-400)')}
              >
                <Maximize2 size={12} />
                Expand in sub-window
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
