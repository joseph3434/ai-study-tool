import { useState } from 'react';
import { MessageSquarePlus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSessionStore } from '../../store/sessionStore';
import { useConversationStore } from '../../store/conversationStore';

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { sessions, currentSessionId, newSession, loadSession, deleteSession } = useSessionStore();
  const { loadTree } = useConversationStore();

  const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  function handleNewChat() {
    const tree = newSession();
    loadTree(tree);
  }

  function handleLoadSession(id: string) {
    if (id === currentSessionId) return;
    const tree = loadSession(id);
    loadTree(tree);
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    const wasActive = id === currentSessionId;
    deleteSession(id);
    if (wasActive) {
      // After deletion sessionStore already picked a new current; load its tree
      const newCurrent = useSessionStore.getState().getCurrentSession();
      if (newCurrent) loadTree(newCurrent.tree);
    }
  }

  return (
    <div
      className="flex-shrink-0 flex flex-col h-full border-r transition-all duration-200"
      style={{
        width: collapsed ? '48px' : '260px',
        borderColor: 'var(--color-border)',
        background: 'var(--color-surface-1)',
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center px-2 py-3 border-b flex-shrink-0"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {!collapsed && (
          <button
            onClick={handleNewChat}
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              color: 'var(--color-text-primary)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface-2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <MessageSquarePlus size={16} style={{ color: 'var(--color-brand)' }} />
            New Chat
          </button>
        )}
        {collapsed && (
          <button
            onClick={handleNewChat}
            className="w-8 h-8 flex items-center justify-center rounded-lg mx-auto transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface-2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
            title="New Chat"
          >
            <MessageSquarePlus size={16} style={{ color: 'var(--color-brand)' }} />
          </button>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-7 h-7 flex items-center justify-center rounded-md ml-1 flex-shrink-0 transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)';
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Session list */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {sorted.length === 0 && (
            <p
              className="text-xs px-3 py-4 text-center"
              style={{ color: 'var(--color-text-muted)' }}
            >
              No conversations yet
            </p>
          )}
          {sorted.map((session) => {
            const isActive = session.id === currentSessionId;
            return (
              <div
                key={session.id}
                onClick={() => handleLoadSession(session.id)}
                className="group relative flex flex-col px-3 py-2 rounded-lg cursor-pointer transition-colors"
                style={{
                  background: isActive ? 'var(--color-surface-2)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--color-brand)' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                <div className="flex items-start justify-between gap-1">
                  <span
                    className="text-sm leading-snug line-clamp-1 flex-1"
                    style={{ color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
                  >
                    {session.title}
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, session.id)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-0.5 rounded transition-opacity"
                    style={{ color: 'var(--color-text-muted)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = '#ef4444';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)';
                    }}
                    title="Delete conversation"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <span
                  className="text-xs mt-0.5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {formatRelativeTime(session.updatedAt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
