/**
 * PlatformAdapter Pattern
 *
 * Abstracts platform-specific functionality (storage, robot control,
 * file system, notifications) behind a unified interface. The web app
 * uses WebPlatformAdapter (REST/WebSocket), while the Electron app
 * uses ElectronPlatformAdapter (IPC to main process).
 *
 * Usage:
 *   import { getPlatformAdapter } from '@robotforge/ui/platform';
 *   const adapter = getPlatformAdapter();
 *   const episodes = await adapter.storage.getEpisodes();
 */

import type {
  Episode,
  CollectionSession,
  RobotTelemetry,
  SyncResult,
} from '@robotforge/types';

// ─── Storage Adapter ──────────────────────────────────────────
export interface StorageAdapter {
  getEpisodes(filter?: EpisodeFilterParams): Promise<Episode[]>;
  getEpisode(id: string): Promise<Episode | null>;
  deleteEpisode(id: string): Promise<void>;
  getStorageStats(): Promise<StorageStats>;
  triggerSync(): Promise<SyncResult>;
}

export interface EpisodeFilterParams {
  sessionId?: string;
  status?: string;
  task?: string;
  limit?: number;
  offset?: number;
}

export interface StorageStats {
  totalEpisodes: number;
  pendingSync: number;
  diskUsageMb: number;
}

// ─── Robot Adapter ────────────────────────────────────────────
export interface RobotAdapter {
  discover(): Promise<DiscoveredRobot[]>;
  connect(config: RobotConnectionParams): Promise<ConnectedRobotInfo>;
  disconnect(robotId: string): Promise<void>;
  sendCommand(robotId: string, command: RobotCommand): Promise<void>;
  subscribeTelemetry(robotId: string, callback: (data: RobotTelemetry) => void): () => void;
}

export interface DiscoveredRobot {
  id: string;
  name: string;
  host: string;
  port: number;
  type: string;
}

export interface RobotConnectionParams {
  host: string;
  port: number;
  protocol: string;
  timeout?: number;
}

export interface ConnectedRobotInfo {
  id: string;
  name: string;
  connected: boolean;
}

export interface RobotCommand {
  type: string;
  payload: Record<string, unknown>;
}

// ─── Collection Adapter ──────────────────────────────────────
export interface CollectionAdapter {
  startSession(config: SessionConfig): Promise<CollectionSession>;
  stopSession(sessionId: string): Promise<void>;
  pauseSession(sessionId: string): Promise<void>;
  resumeSession(sessionId: string): Promise<void>;
  startEpisode(sessionId: string): Promise<string>;
  stopEpisode(sessionId: string, episodeId: string): Promise<void>;
}

export interface SessionConfig {
  robotId: string;
  task: string;
  sampleRateHz: number;
}

// ─── Notification Adapter ────────────────────────────────────
export interface NotificationAdapter {
  show(title: string, body: string, type?: 'info' | 'success' | 'warning' | 'error'): void;
  requestPermission(): Promise<boolean>;
}

// ─── Composite Platform Adapter ──────────────────────────────
export interface PlatformAdapter {
  readonly platform: 'web' | 'electron';
  readonly storage: StorageAdapter;
  readonly robots: RobotAdapter;
  readonly collection: CollectionAdapter;
  readonly notifications: NotificationAdapter;
}

// ─── Singleton accessor ──────────────────────────────────────
let _adapter: PlatformAdapter | null = null;

export function setPlatformAdapter(adapter: PlatformAdapter): void {
  _adapter = adapter;
}

export function getPlatformAdapter(): PlatformAdapter {
  if (!_adapter) {
    throw new Error(
      'PlatformAdapter not initialized. Call setPlatformAdapter() at app startup.',
    );
  }
  return _adapter;
}
