import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useSelectionStore } from '../../store/selectionStore';
import { streamMessage } from '../../api/client';
import { buildMicroQuestionPrompt, MAIN_SYSTEM_PROMPT } from '../../api/prompts';
import { computeActionButtonPosition } from '../../utils/selectionUtils';

export function SelectionActionButton() {
  const {
    selectedText,
    selectionRect,
    popoverState,
    setPopoverState,
    appendPopoverChunk,
    finalizePopoverAnswer,
  } = useSelectionStore();

  const isVisible = !!selectedText && !!selectionRect && popoverState === 'idle';

  const position = selectionRect
    ? computeActionButtonPosition(selectionRect)
    : { x: 0, y: 0 };

  const handleAsk = async () => {
    if (!selectedText) return;
    setPopoverState('loading');

    try {
      const prompt = buildMicroQuestionPrompt(selectedText);
      for await (const chunk of streamMessage(
        [{ role: 'user', content: prompt }],
        MAIN_SYSTEM_PROMPT
      )) {
        appendPopoverChunk(chunk);
        if (useSelectionStore.getState().popoverState === 'loading') {
          setPopoverState('loading'); // keep loading while streaming
        }
      }
      finalizePopoverAnswer();
    } catch {
      setPopoverState('error');
    }
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.button
          data-selection-action
          initial={{ opacity: 0, scale: 0.8, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={handleAsk}
          className="fixed z-[9000] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          style={{
            left: position.x - 40,
            top: position.y,
            background: 'var(--gradient-brand)',
            boxShadow: 'var(--glow-brand), 0 2px 12px rgba(0,0,0,0.3)',
            transform: 'translateX(-50%)',
          }}
        >
          <Sparkles size={14} />
          Ask
        </motion.button>
      )}
    </AnimatePresence>,
    document.body
  );
}
