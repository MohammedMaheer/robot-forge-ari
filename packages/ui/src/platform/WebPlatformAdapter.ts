/**
 * WebPlatformAdapter
 *
 * Implementation of PlatformAdapter that uses REST API calls
 * (via axios) and WebSocket connections for the PWA web app.
 */

import axios, { type AxiosInstance } from 'axios';
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

function createAxios(baseUrl: string, getToken: () => string | null): AxiosInstance {
  const instance = axios.create({ baseURL: baseUrl });
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return instance;
}

// ─── Web Storage ─────────────────────────────────────────────
class WebStorageAdapter implements StorageAdapter {
  constructor(private api: AxiosInstance) {}

  async getEpisodes(filter?: EpisodeFilterParams): Promise<Episode[]> {
    const { data } = await this.api.get('/api/collection/episodes', { params: filter });
    return data.data;
  }

  async getEpisode(id: string): Promise<Episode | null> {
    try {
      const { data } = await this.api.get(`/api/collection/episodes/${id}`);
      return data.data;
    } catch {
      return null;
    }
  }

  async deleteEpisode(id: string): Promise<void> {
    await this.api.delete(`/api/collection/episodes/${id}`);
  }

  async getStorageStats(): Promise<StorageStats> {
    const { data } = await this.api.get('/api/collection/stats');
    return data.data;
  }

  async triggerSync(): Promise<SyncResult> {
    // Web app doesn't need local sync — episodes already on server
    return { syncedCount: 0, failedCount: 0, errors: [] };
  }
}

// ─── Web Robots ──────────────────────────────────────────────
class WebRobotAdapter implements RobotAdapter {
  private telemetryWs: WebSocket | null = null;

  constructor(private api: AxiosInstance) {}

  async discover(): Promise<DiscoveredRobot[]> {
    const { data } = await this.api.get('/api/collection/robots');
    return data.data;
  }

  async connect(config: RobotConnectionParams): Promise<ConnectedRobotInfo> {
    const { data } = await this.api.post('/api/collection/robots/connect', config);
    return data.data;
  }

  async disconnect(robotId: string): Promise<void> {
    await this.api.post(`/api/collection/robots/${robotId}/disconnect`);
  }

  async sendCommand(robotId: string, command: RobotCommand): Promise<void> {
    await this.api.post(`/api/collection/robots/${robotId}/command`, command);
  }

  subscribeTelemetry(robotId: string, callback: (data: RobotTelemetry) => void): () => void {
    if (this.telemetryWs) {
      this.telemetryWs.close();
      this.telemetryWs = null;
    }
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/collection/ws/teleoperation/${robotId}`;
    this.telemetryWs = new WebSocket(wsUrl);

    this.telemetryWs.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        callback(parsed);
      } catch {
        // Skip malformed messages
      }
    };

    return () => {
      this.telemetryWs?.close();
      this.telemetryWs = null;
    };
  }
}

// ─── Web Collection ──────────────────────────────────────────
class WebCollectionAdapter implements CollectionAdapter {
  constructor(private api: AxiosInstance) {}

  async startSession(config: SessionConfig): Promise<CollectionSession> {
    const { data } = await this.api.post('/api/collection/sessions', config);
    return data.data;
  }

  async stopSession(sessionId: string): Promise<void> {
    await this.api.post(`/api/collection/sessions/${sessionId}/stop`);
  }

  async pauseSession(sessionId: string): Promise<void> {
    await this.api.post(`/api/collection/sessions/${sessionId}/pause`);
  }

  async resumeSession(sessionId: string): Promise<void> {
    await this.api.post(`/api/collection/sessions/${sessionId}/resume`);
  }

  async startEpisode(sessionId: string): Promise<string> {
    const { data } = await this.api.post(`/api/collection/sessions/${sessionId}/episodes`);
    return data.data.id;
  }

  async stopEpisode(sessionId: string, episodeId: string): Promise<void> {
    await this.api.post(`/api/collection/sessions/${sessionId}/episodes/${episodeId}/stop`);
  }
}

// ─── Web Notifications ───────────────────────────────────────
class WebNotificationAdapter implements NotificationAdapter {
  show(title: string, body: string, _type?: 'info' | 'success' | 'warning' | 'error'): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }
}

// ─── Factory ─────────────────────────────────────────────────
export function createWebPlatformAdapter(
  baseUrl: string,
  getToken: () => string | null,
): PlatformAdapter {
  const api = createAxios(baseUrl, getToken);

  return {
    platform: 'web',
    storage: new WebStorageAdapter(api),
    robots: new WebRobotAdapter(api),
    collection: new WebCollectionAdapter(api),
    notifications: new WebNotificationAdapter(),
  };
}
