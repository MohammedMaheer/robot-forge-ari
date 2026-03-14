/**
 * ROBOTFORGE Desktop — Preload Script
 *
 * Exposes a typed `window.electronAPI` bridge to the renderer
 * process via contextBridge. All IPC communication flows
 * through this surface — never expose ipcRenderer directly.
 */

import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  // ─── Robots ──────────────────────────────────────────────
  robots: {
    discover(): Promise<DiscoveredRobot[]>;
    connect(config: RobotConnectionConfig): Promise<ConnectedRobotInfo>;
    disconnect(robotId: string): Promise<void>;
    sendCommand(robotId: string, command: RobotCommand): Promise<void>;
    getStatus(robotId: string): Promise<RobotStatusInfo>;
    onTelemetry(callback: (data: TelemetryData) => void): () => void;
  };

  // ─── Storage (local SQLite + sync) ──────────────────────
  storage: {
    getEpisodes(filter?: EpisodeFilter): Promise<LocalEpisode[]>;
    getEpisode(id: string): Promise<LocalEpisode | null>;
    deleteEpisode(id: string): Promise<void>;
    getSyncQueue(): Promise<SyncQueueItem[]>;
    triggerSync(): Promise<SyncResult>;
    getStorageStats(): Promise<StorageStats>;
  };

  // ─── Collection Daemon ──────────────────────────────────
  daemon: {
    start(config: DaemonConfig): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    getStatus(): Promise<DaemonStatus>;
    startEpisode(): Promise<string>;
    stopEpisode(episodeId: string): Promise<void>;
    onTelemetry(callback: (data: TelemetryData) => void): () => void;
    onEpisodeComplete(callback: (episode: EpisodeInfo) => void): () => void;
    onError(callback: (error: ErrorInfo) => void): () => void;
  };

  // ─── Window ─────────────────────────────────────────────
  window: {
    minimize(): Promise<void>;
    maximize(): Promise<void>;
    close(): Promise<void>;
  };

  // ─── App ────────────────────────────────────────────────
  app: {
    getVersion(): Promise<string>;
  };
}

// Minimal type stubs for the preload surface — full types live in @robotforge/types
interface DiscoveredRobot { id: string; name: string; host: string; port: number; type: string }
interface RobotConnectionConfig { host: string; port: number; protocol: string; timeout?: number }
interface ConnectedRobotInfo { id: string; name: string; connected: boolean }
interface RobotCommand { type: string; payload: Record<string, unknown> }
interface RobotStatusInfo { id: string; connected: boolean; batteryLevel: number; temperature: number }
interface TelemetryData { robotId: string; timestamp: number; jointPositions: number[]; jointVelocities: number[]; endEffectorPose: number[] }
interface EpisodeFilter { sessionId?: string; status?: string; task?: string }
interface LocalEpisode { id: string; sessionId: string; task: string; status: string; durationMs: number; createdAt: string; syncedAt?: string }
interface SyncQueueItem { episodeId: string; status: string; retries: number }
interface SyncResult { synced: number; failed: number; remaining: number }
interface StorageStats { totalEpisodes: number; pendingSync: number; diskUsageMb: number }
interface DaemonConfig { sessionId: string; robotId: string; task: string; sampleRateHz: number }
interface DaemonStatus { running: boolean; paused: boolean; currentEpisodeId?: string; episodesRecorded: number; uptimeMs: number }
interface EpisodeInfo { id: string; durationMs: number; task: string }
interface ErrorInfo { message: string }

// Helper: create a listener that returns an unsubscribe function
function createListener(channel: string, callback: (...args: unknown[]) => void): () => void {
  const handler = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => callback(...args);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
}

const electronAPI: ElectronAPI = {
  robots: {
    discover: () => ipcRenderer.invoke('robots:discover'),
    connect: (config) => ipcRenderer.invoke('robots:connect', config),
    disconnect: (robotId) => ipcRenderer.invoke('robots:disconnect', robotId),
    sendCommand: (robotId, command) => ipcRenderer.invoke('robots:send-command', robotId, command),
    getStatus: (robotId) => ipcRenderer.invoke('robots:get-status', robotId),
    onTelemetry: (callback) => createListener('robots:telemetry', callback as (...a: unknown[]) => void),
  },

  storage: {
    getEpisodes: (filter) => ipcRenderer.invoke('storage:get-episodes', filter),
    getEpisode: (id) => ipcRenderer.invoke('storage:get-episode', id),
    deleteEpisode: (id) => ipcRenderer.invoke('storage:delete-episode', id),
    getSyncQueue: () => ipcRenderer.invoke('storage:get-sync-queue'),
    triggerSync: () => ipcRenderer.invoke('storage:trigger-sync'),
    getStorageStats: () => ipcRenderer.invoke('storage:get-stats'),
  },

  daemon: {
    start: (config) => ipcRenderer.invoke('daemon:start', config),
    stop: () => ipcRenderer.invoke('daemon:stop'),
    pause: () => ipcRenderer.invoke('daemon:pause'),
    resume: () => ipcRenderer.invoke('daemon:resume'),
    getStatus: () => ipcRenderer.invoke('daemon:get-status'),
    startEpisode: () => ipcRenderer.invoke('daemon:start-episode'),
    stopEpisode: (episodeId) => ipcRenderer.invoke('daemon:stop-episode', episodeId),
    onTelemetry: (callback) => createListener('daemon:telemetry', callback as (...a: unknown[]) => void),
    onEpisodeComplete: (callback) => createListener('daemon:episode-complete', callback as (...a: unknown[]) => void),
    onError: (callback) => createListener('daemon:error', callback as (...a: unknown[]) => void),
  },

  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },

  app: {
    getVersion: () => ipcRenderer.invoke('app:version'),
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
