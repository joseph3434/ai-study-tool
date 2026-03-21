import { create } from 'zustand';

interface UIStore {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'dark',
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),
}));
