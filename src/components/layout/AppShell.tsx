import { useEffect } from 'react';
import { MainPanel } from './MainPanel';
import { SubWindowStack } from './SubWindowStack';
import { SelectionActionButton } from '../selection/SelectionActionButton';
import { HighlightPopover } from '../selection/HighlightPopover';
import { useUIStore } from '../../store/uiStore';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export function AppShell() {
  const { theme } = useUIStore();
  useKeyboardShortcuts();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: 'var(--color-surface-0)' }}
    >
      <MainPanel />
      <SubWindowStack />
      <SelectionActionButton />
      <HighlightPopover />
    </div>
  );
}
