import { create } from 'zustand';
import type { AppNotification } from '@robotforge/types';
import { v4 as uuidv4 } from 'uuid';

interface UiState {
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  notifications: AppNotification[];

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  sidebarOpen: true,
  theme: 'dark',
  notifications: [],

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: uuidv4(),
          timestamp: new Date(),
          read: false,
        },
        ...state.notifications,
      ].slice(0, 50), // Keep max 50
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
