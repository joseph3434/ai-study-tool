import { AnimatePresence, motion } from 'framer-motion';
import { SubWindow } from '../subwindow/SubWindow';
import { useConversationStore } from '../../store/conversationStore';

export function SubWindowStack() {
  const { tree } = useConversationStore();
  const { activeSubWindowIds } = tree;
  const isOpen = activeSubWindowIds.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 480, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative flex-shrink-0 h-full overflow-hidden"
          style={{
            borderLeft: '1px solid var(--color-border-strong)',
          }}
        >
          <AnimatePresence>
            {activeSubWindowIds.map((id) => (
              <SubWindow key={id} conversationId={id} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
