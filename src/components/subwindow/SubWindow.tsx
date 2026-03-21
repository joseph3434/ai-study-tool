import { motion } from 'framer-motion';
import { SubWindowHeader } from './SubWindowHeader';
import { OriginContext } from './OriginContext';
import { SubWindowThread } from './SubWindowThread';
import { useConversationStore } from '../../store/conversationStore';

interface SubWindowProps {
  conversationId: string;
}

export function SubWindow({ conversationId }: SubWindowProps) {
  const { tree } = useConversationStore();
  const conv = tree.conversations[conversationId];

  if (!conv) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'var(--color-surface-1)' }}
    >
      <SubWindowHeader conversationId={conversationId} />
      {conv.origin && <OriginContext text={conv.origin.text} />}
      <SubWindowThread conversationId={conversationId} />
    </motion.div>
  );
}
