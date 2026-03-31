/**
 * ElectronPlatformAdapter
 *
 * Implementation of PlatformAdapter that bridges to the Electron
 * main process via window.electronAPI (contextBridge preload).
 */

import type { Episode, CollectionSession, RobotTelemetry, SyncResult } from '@robotforge/types';
import type {
  PlatformAdapter,
  StorageAdapter,
  RobotAdapter,
  CollectionAdapter,
  NotificationAdapter,
  EpisodeFilterParams,
  StorageStats,
  DiscoveredRobot,
  RobotConnectionParams,
  ConnectedRobotInfo,
  RobotCommand,
  SessionConfig,
} from './PlatformAdapter';

function getElectronAPI() {
  const api = (window as Record<string, unknown>).electronAPI;
  if (!api) throw new Error('electronAPI not available — not running in Electron');
  return api as Record<string, Record<string, (...args: unknown[]) => unknown>>;
}

// ─── Electron Storage ────────────────────────────────────────
class ElectronStorageAdapter implements StorageAdapter {
  async getEpisodes(filter?: EpisodeFilterParams): Promise<Episode[]> {
    return getElectronAPI().storage.getEpisodes(filter) as Promise<Episode[]>;
  }

  async getEpisode(id: string): Promise<Episode | null> {
    return getElectronAPI().storage.getEpisode(id) as Promise<Episode | null>;
  }

  async deleteEpisode(id: string): Promise<void> {
    await getElectronAPI().storage.deleteEpisode(id);
  }

  async getStorageStats(): Promise<StorageStats> {
    return getElectronAPI().storage.getStorageStats() as Promise<StorageStats>;
  }

  async triggerSync(): Promise<SyncResult> {
    return getElectronAPI().storage.triggerSync() as Promise<SyncResult>;
  }
}

// ─── Electron Robots ─────────────────────────────────────────
class ElectronRobotAdapter implements RobotAdapter {
  async discover(): Promise<DiscoveredRobot[]> {
    return getElectronAPI().robots.discover() as Promise<DiscoveredRobot[]>;
  }

  async connect(config: RobotConnectionParams): Promise<ConnectedRobotInfo> {
    return getElectronAPI().robots.connect(config) as Promise<ConnectedRobotInfo>;
  }

  async disconnect(robotId: string): Promise<void> {
    await getElectronAPI().robots.disconnect(robotId);
  }

  async sendCommand(robotId: string, command: RobotCommand): Promise<void> {
    await getElectronAPI().robots.sendCommand(robotId, command);
  }

  subscribeTelemetry(_robotId: string, callback: (data: RobotTelemetry) => void): () => void {
    return getElectronAPI().daemon.onTelemetry(callback) as () => void;
  }
}

// ─── Electron Collection ─────────────────────────────────────
class ElectronCollectionAdapter implements CollectionAdapter {
  async startSession(config: SessionConfig): Promise<CollectionSession> {
    if (!config.robotIds.length) {
      throw new Error('At least one robot must be selected to start a session');
    }
    const sessionId = crypto.randomUUID();
    await getElectronAPI().daemon.start({
      sessionId,
      robotId: config.robotIds[0],
      task: config.task,
      sampleRateHz: 20,
    });
    return {
      id: sessionId,
      operatorId: 'local',
      robots: [],
      mode: config.mode,
      status: 'idle',
      episodeCount: 0,
      startedAt: new Date(),
      targetEpisodes: config.targetEpisodes,
    };
  }

  async stopSession(_sessionId: string): Promise<void> {
    await getElectronAPI().daemon.stop();
  }

  async pauseSession(_sessionId: string): Promise<void> {
    await getElectronAPI().daemon.pause();
  }

  async resumeSession(_sessionId: string): Promise<void> {
    await getElectronAPI().daemon.resume();
  }

  async startEpisode(_sessionId: string): Promise<string> {
    return getElectronAPI().daemon.startEpisode() as Promise<string>;
  }

  async stopEpisode(_sessionId: string, episodeId: string): Promise<void> {
    await getElectronAPI().daemon.stopEpisode(episodeId);
  }
}

// ─── Electron Notifications ──────────────────────────────────
class ElectronNotificationAdapter implements NotificationAdapter {
  show(title: string, body: string, _type?: 'info' | 'success' | 'warning' | 'error'): void {
    new Notification(title, { body });
  }

  async requestPermission(): Promise<boolean> {
    return true; // Electron always has notification permission
  }
}

// ─── Factory ─────────────────────────────────────────────────
export function createElectronPlatformAdapter(): PlatformAdapter {
  return {
    platform: 'electron',
    storage: new ElectronStorageAdapter(),
    robots: new ElectronRobotAdapter(),
    collection: new ElectronCollectionAdapter(),
    notifications: new ElectronNotificationAdapter(),
  };
}
