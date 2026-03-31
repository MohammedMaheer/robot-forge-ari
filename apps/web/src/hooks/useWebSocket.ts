import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3003';

interface UseWebSocketOptions {
  namespace: '/teleoperation' | '/collection' | '/processing' | '/marketplace';
  autoConnect?: boolean;
}

export function useWebSocket({ namespace, autoConnect = true }: UseWebSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!autoConnect) return;

    const socket = io(`${WS_URL}${namespace}`, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`[ws] Connected to ${namespace}`);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error(`[ws] ${namespace} connection error:`, err.message);
      setConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [namespace, accessToken, autoConnect]);

  const emit = useCallback((event: string, data?: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback((event: string, handler: (...args: unknown[]) => void) => {
    socketRef.current?.on(event, handler);
    return () => {
      socketRef.current?.off(event, handler);
    };
  }, []);

  return {
    socket: socketRef.current,
    emit,
    on,
    connected,
  };
}
