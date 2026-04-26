/**
 * ROBOTFORGE — WebSocket Context
 *
 * Provides a shared Socket.io connection to the component tree
 * so that multiple components can subscribe to real-time events
 * (telemetry, collection status, processing progress) without
 * each creating their own connection.
 */

import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

interface WebSocketContextValue {
  /** The underlying Socket.io instance (null until connected). */
  socket: Socket | null;
  /** Whether the socket is currently connected. */
  connected: boolean;
  /** Subscribe to a specific namespace channel. */
  subscribe<T = unknown>(event: string, handler: (data: T) => void): () => void;
  /** Emit an event to the server. */
  emit(event: string, data?: unknown): void;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  socket: null,
  connected: false,
  subscribe: () => () => {},
  emit: () => {},
});

export function useWebSocketContext() {
  return useContext(WebSocketContext);
}

interface WebSocketProviderProps {
  children: ReactNode;
  /** Socket.io server URL. Defaults to VITE_WS_URL or window origin. */
  url?: string;
  /** Auto-connect on mount. Defaults to true. */
  autoConnect?: boolean;
}

export function WebSocketProvider({ children, url, autoConnect = true }: WebSocketProviderProps) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const { accessToken } = useAuthStore();

  // ── Initial connection (runs once) ────────────────────
  useEffect(() => {
    if (!autoConnect) return;

    // Use VITE_WS_URL if set; otherwise fall back to the notification-service
    // address. NEVER use window.location.origin directly because the web app
    // runs on port 5173 while the WebSocket service runs on port 3003.
    const serverUrl = url ?? import.meta.env.VITE_WS_URL ?? 'http://localhost:3003';
    const token = useAuthStore.getState().accessToken;
    const socket = io(serverUrl, {
      auth: token ? { token } : undefined,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1_000,
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socketRef.current = socket;
    setSocketInstance(socket);

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setSocketInstance(null);
      setConnected(false);
    };
  // Intentionally only runs once (url + autoConnect). Token refreshes are
  // handled below WITHOUT disconnecting the socket.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, autoConnect]);

  // ── Token rotation: update auth without reconnecting ──
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !accessToken) return;
    // Socket.io exposes socket.auth for re-auth without reconnect
    (socket as any).auth = { token: accessToken };
  }, [accessToken]);

  const subscribe = React.useCallback(
    <T = unknown,>(event: string, handler: (data: T) => void) => {
      const socket = socketRef.current;
      if (!socket) return () => {};
      socket.on(event, handler as (...args: unknown[]) => void);
      return () => {
        socket.off(event, handler as (...args: unknown[]) => void);
      };
    },
    [],
  );

  const emit = React.useCallback((event: string, data?: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  const value: WebSocketContextValue = {
    socket: socketInstance,
    connected,
    subscribe,
    emit,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}
