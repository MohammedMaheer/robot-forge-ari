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
  const { token } = useAuthStore();

  useEffect(() => {
    if (!autoConnect) return;

    const serverUrl = url ?? import.meta.env.VITE_WS_URL ?? window.location.origin;
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

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [url, token, autoConnect]);

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
    socket: socketRef.current,
    connected,
    subscribe,
    emit,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}
