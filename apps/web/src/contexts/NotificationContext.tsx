/**
 * ROBOTFORGE — Notification Context
 *
 * Manages a toast notification queue with auto-dismiss.
 * Components dispatch notifications via the context; the
 * NotificationProvider renders the toast stack.
 */

import React, { createContext, useContext, useCallback, useState, type ReactNode } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  /** Auto-dismiss after this many ms. 0 = sticky. Default 5000. */
  duration?: number;
  createdAt: number;
}

interface NotificationContextValue {
  notifications: Notification[];
  push(type: NotificationType, title: string, message?: string, duration?: number): void;
  dismiss(id: string): void;
  clearAll(): void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  push: () => {},
  dismiss: () => {},
  clearAll: () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

let _nextId = 1;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const push = useCallback(
    (type: NotificationType, title: string, message?: string, duration = 5000) => {
      const id = `notif-${_nextId++}`;
      const notif: Notification = { id, type, title, message, duration, createdAt: Date.now() };
      setNotifications((prev) => [...prev, notif]);

      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss],
  );

  const clearAll = useCallback(() => setNotifications([]), []);

  return (
    <NotificationContext.Provider value={{ notifications, push, dismiss, clearAll }}>
      {children}

      {/* Toast stack */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[9999] space-y-2 max-w-sm w-full pointer-events-none">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`pointer-events-auto rounded-lg border p-3 shadow-lg animate-slide-in-right ${typeStyles[n.type]}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm font-semibold">{n.title}</span>
                <button
                  onClick={() => dismiss(n.id)}
                  className="ml-auto text-xs opacity-60 hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
              {n.message && <p className="text-xs mt-1 opacity-80">{n.message}</p>}
            </div>
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

const typeStyles: Record<NotificationType, string> = {
  info: 'bg-blue-900/90 border-blue-600/50 text-blue-100',
  success: 'bg-green-900/90 border-green-600/50 text-green-100',
  warning: 'bg-amber-900/90 border-amber-600/50 text-amber-100',
  error: 'bg-red-900/90 border-red-600/50 text-red-100',
};
