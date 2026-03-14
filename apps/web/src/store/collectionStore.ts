import { create } from 'zustand';
import type { CollectionSession, ConnectedRobot, SessionConfig, RobotConnectionConfig } from '@robotforge/types';
import { apiClient } from '@/lib/api';

interface CollectionState {
  activeSessions: CollectionSession[];
  activeRobots: ConnectedRobot[];
  isConnecting: boolean;

  startSession: (config: SessionConfig) => Promise<CollectionSession>;
  stopSession: (sessionId: string) => Promise<void>;
  connectRobot: (config: RobotConnectionConfig) => Promise<ConnectedRobot>;
  disconnectRobot: (robotId: string) => Promise<void>;
  setActiveSessions: (sessions: CollectionSession[]) => void;
  setActiveRobots: (robots: ConnectedRobot[]) => void;
}

export const useCollectionStore = create<CollectionState>()((set, get) => ({
  activeSessions: [],
  activeRobots: [],
  isConnecting: false,

  startSession: async (config: SessionConfig) => {
    const response = await apiClient.post('/collection/sessions', config);
    const session: CollectionSession = response.data.data;
    set((state) => ({
      activeSessions: [...state.activeSessions, session],
    }));
    return session;
  },

  stopSession: async (sessionId: string) => {
    await apiClient.post(`/collection/sessions/${sessionId}/stop`);
    set((state) => ({
      activeSessions: state.activeSessions.filter((s) => s.id !== sessionId),
    }));
  },

  connectRobot: async (config: RobotConnectionConfig) => {
    set({ isConnecting: true });
    try {
      const response = await apiClient.post('/collection/robots/connect', config);
      const robot: ConnectedRobot = response.data.data;
      set((state) => ({
        activeRobots: [...state.activeRobots, robot],
        isConnecting: false,
      }));
      return robot;
    } catch (error) {
      set({ isConnecting: false });
      throw error;
    }
  },

  disconnectRobot: async (robotId: string) => {
    await apiClient.post(`/collection/robots/${robotId}/disconnect`);
    set((state) => ({
      activeRobots: state.activeRobots.filter((r) => r.id !== robotId),
    }));
  },

  setActiveSessions: (sessions) => set({ activeSessions: sessions }),
  setActiveRobots: (robots) => set({ activeRobots: robots }),
}));
