import { X, ChevronRight } from 'lucide-react';
import { useConversationStore } from '../../store/conversationStore';
import { buildBreadcrumb } from '../../utils/treeUtils';
import { IconButton } from '../ui/IconButton';

interface SubWindowHeaderProps {
  conversationId: string;
}

export function SubWindowHeader({ conversationId }: SubWindowHeaderProps) {
  const { tree, closeAllSubWindowsFrom, closeSubWindow } = useConversationStore();
  const breadcrumbs = buildBreadcrumb(conversationId, tree);

  const handleBreadcrumbClick = (clickedConvId: string) => {
    const conv = tree.conversations[clickedConvId];
    if (!conv) return;
    // If clicking the root (main), close all sub-windows
    if (clickedConvId === tree.rootId) {
      closeAllSubWindowsFrom(1);
    } else {
      closeAllSubWindowsFrom(conv.depth + 1);
    }
  };

  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b"
      style={{
        background: 'rgba(19, 19, 26, 0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 overflow-hidden flex-1 min-w-0">
        {breadcrumbs.map((crumb, i) => (
          <div key={crumb.conversationId} className="flex items-center gap-1 min-w-0">
            {i > 0 && (
              <ChevronRight size={12} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            )}
            <button
              onClick={() => handleBreadcrumbClick(crumb.conversationId)}
              className={`text-xs truncate max-w-[120px] transition-colors duration-150 ${
                i === breadcrumbs.length - 1 ? 'font-medium cursor-default' : 'hover:opacity-80'
              }`}
              style={{
                color: i === breadcrumbs.length - 1
                  ? 'var(--color-text-primary)'
                  : 'var(--color-text-muted)',
              }}
            >
              {crumb.label}
            </button>
          </div>
        ))}
      </div>

      {/* Close button */}
      <IconButton label="Close sub-window" onClick={() => closeSubWindow(conversationId)}>
        <X size={14} />
      </IconButton>
    </div>
  );
}
