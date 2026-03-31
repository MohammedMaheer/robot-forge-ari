/**
 * CollectionDaemon
 *
 * Core background process that manages real-time telemetry
 * collection from a connected robot. Buffers data in memory,
 * writes to HDF5 files via h5py subprocess or local binary,
 * and manages episode lifecycle.
 *
 * Runs in the main Electron process and emits events to
 * the renderer via IPC.
 */

import { EventEmitter } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';

interface DaemonConfig {
  sessionId: string;
  robotId: string;
  task: string;
  sampleRateHz: number;
  /** Directory to write episode telemetry JSON files; defaults to os.tmpdir(). */
  episodeDataDir?: string;
}

interface DaemonStatus {
  running: boolean;
  paused: boolean;
  currentEpisodeId?: string;
  episodesRecorded: number;
  uptimeMs: number;
}

interface TelemetrySample {
  timestamp: number;
  jointPositions: number[];
  jointVelocities: number[];
  jointTorques: number[];
  /** 6-DOF end-effector pose matching the Pose6D type (x, y, z in metres; rx, ry, rz euler). */
  endEffectorPose: { x: number; y: number; z: number; rx: number; ry: number; rz: number };
  gripperPosition: number;
  forceTorque: number[];      // [fx, fy, fz, tx, ty, tz]
}

export class CollectionDaemon extends EventEmitter {
  private config: DaemonConfig | null = null;
  private _running = false;
  private _paused = false;
  private _currentEpisodeId: string | null = null;
  private _episodesRecorded = 0;
  private _startTime = 0;
  private _intervalHandle: ReturnType<typeof setInterval> | null = null;
  private _buffer: TelemetrySample[] = [];
  /** Cached real telemetry from the collection-service WebSocket */
  private _latestRemoteTelemetry: TelemetrySample | null = null;
  private _wsConnection: any = null;

  private static readonly COLLECTION_SERVICE_URL =
    process.env.COLLECTION_SERVICE_URL ?? 'http://localhost:8001';

  get isRunning(): boolean {
    return this._running;
  }

  async start(config: DaemonConfig): Promise<void> {
    if (this._running) throw new Error('Daemon already running');

    this.config = config;
    this._running = true;
    this._paused = false;
    this._startTime = Date.now();
    this._episodesRecorded = 0;

    // Attempt to connect to collection-service for real telemetry
    this.connectToRemoteTelemetry(config.robotId);

    const intervalMs = Math.round(1000 / config.sampleRateHz);

    this._intervalHandle = setInterval(() => {
      if (this._paused || !this._currentEpisodeId) return;

      const sample = this.generateTelemetrySample();
      this._buffer.push(sample);

      this.emit('telemetry', {
        robotId: config.robotId,
        episodeId: this._currentEpisodeId,
        ...sample,
      });
    }, intervalMs);
  }

  async stop(): Promise<void> {
    if (!this._running) return;

    if (this._currentEpisodeId) {
      await this.stopEpisode(this._currentEpisodeId);
    }

    if (this._intervalHandle) {
      clearInterval(this._intervalHandle);
      this._intervalHandle = null;
    }

    // Clean up WebSocket
    if (this._wsConnection) {
      try { this._wsConnection.close(); } catch { /* ignore */ }
      this._wsConnection = null;
    }
    this._latestRemoteTelemetry = null;

    this._running = false;
    this._paused = false;
    this.config = null;
  }

  pause(): void {
    if (!this._running) throw new Error('Daemon not running');
    this._paused = true;
  }

  resume(): void {
    if (!this._running) throw new Error('Daemon not running');
    this._paused = false;
  }

  getStatus(): DaemonStatus {
    return {
      running: this._running,
      paused: this._paused,
      currentEpisodeId: this._currentEpisodeId ?? undefined,
      episodesRecorded: this._episodesRecorded,
      uptimeMs: this._running ? Date.now() - this._startTime : 0,
    };
  }

  startEpisode(): string {
    if (!this._running) throw new Error('Daemon not running');
    if (this._currentEpisodeId) throw new Error('Episode already in progress');

    this._currentEpisodeId = crypto.randomUUID();
    this._buffer = [];

    return this._currentEpisodeId;
  }

  async stopEpisode(episodeId: string): Promise<void> {
    if (this._currentEpisodeId !== episodeId) {
      throw new Error(`Episode ${episodeId} is not the active episode`);
    }

    const buffer = this._buffer;
    const duration = buffer.length > 0
      ? buffer[buffer.length - 1].timestamp - buffer[0].timestamp
      : 0;

    // Persist telemetry buffer to a JSON file in episodeDataDir (or os.tmpdir())
    let telemetryPath: string | undefined;
    try {
      const dataDir = this.config?.episodeDataDir ?? (await import('node:os')).tmpdir();
      fs.mkdirSync(dataDir, { recursive: true });
      telemetryPath = path.join(dataDir, `${episodeId}.json`);
      fs.writeFileSync(telemetryPath, JSON.stringify({
        episodeId,
        sessionId: this.config?.sessionId,
        robotId: this.config?.robotId,
        task: this.config?.task,
        durationMs: duration,
        sampleCount: buffer.length,
        samples: buffer,
      }, null, 2), 'utf8');
    } catch (err) {
      console.error('[daemon] Failed to persist episode telemetry:', err);
    }

    this.emit('episode-complete', {
      id: episodeId,
      durationMs: duration,
      task: this.config?.task ?? 'unknown',
      samples: buffer.length,
      telemetryPath,
    });

    this._currentEpisodeId = null;
    this._buffer = [];
    this._episodesRecorded++;
  }

  /**
   * Attempt to connect to the collection-service telemetry WebSocket.
   * If the service is reachable, real robot telemetry will be used.
   * Falls back silently to mock data if the connection fails.
   */
  private connectToRemoteTelemetry(robotId: string): void {
    try {
      const wsUrl = CollectionDaemon.COLLECTION_SERVICE_URL
        .replace(/^http/, 'ws') + `/ws/telemetry?robot_id=${encodeURIComponent(robotId)}`;

      // Use dynamic import for WebSocket in case running in an environment without it
      const WS = typeof WebSocket !== 'undefined' ? WebSocket : null;
      if (!WS) {
        console.log('[daemon] WebSocket not available — using mock telemetry');
        return;
      }

      const ws = new WS(wsUrl);
      this._wsConnection = ws;

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(typeof event.data === 'string' ? event.data : '');
          this._latestRemoteTelemetry = {
            timestamp: data.timestamp ?? Date.now(),
            jointPositions: data.joint_positions ?? data.jointPositions ?? [],
            jointVelocities: data.joint_velocities ?? data.jointVelocities ?? [],
            jointTorques: data.joint_torques ?? data.jointTorques ?? [],
            endEffectorPose: data.end_effector_pose ?? data.endEffectorPose ?? { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 },
            gripperPosition: data.gripper_position ?? data.gripperPosition ?? 0,
            forceTorque: data.force_torque ?? data.forceTorque ?? [],
          };
        } catch {
          // Malformed message — ignore
        }
      };

      ws.onerror = () => {
        console.log('[daemon] Telemetry WebSocket error — falling back to mock data');
        this._latestRemoteTelemetry = null;
      };

      ws.onclose = () => {
        console.log('[daemon] Telemetry WebSocket closed');
        this._wsConnection = null;
      };
    } catch {
      console.log('[daemon] Could not connect to remote telemetry — using mock data');
    }
  }

  /**
   * Get telemetry sample — uses real data from remote connection when
   * available, falls back to generated mock data.
   */
  private generateTelemetrySample(): TelemetrySample {
    // Prefer real telemetry from the collection-service
    if (this._latestRemoteTelemetry) {
      return { ...this._latestRemoteTelemetry, timestamp: Date.now() };
    }

    // Fallback: generate mock telemetry
    return this.generateMockTelemetrySample();
  }

  /**
   * Generate a mock telemetry sample.
   * Used when the collection-service is unreachable.
   */
  private generateMockTelemetrySample(): TelemetrySample {
    const t = Date.now();
    const phase = (t % 10000) / 10000 * Math.PI * 2;

    return {
      timestamp: t,
      jointPositions: Array.from({ length: 7 }, (_, i) =>
        Math.sin(phase + i * 0.5) * 0.8,
      ),
      jointVelocities: Array.from({ length: 7 }, (_, i) =>
        Math.cos(phase + i * 0.5) * 0.3,
      ),
      jointTorques: Array.from({ length: 7 }, (_, i) =>
        Math.sin(phase + i * 0.3) * 5.0 + (Math.random() - 0.5) * 0.5,
      ),
      endEffectorPose: {
        x: 0.4 + Math.sin(phase) * 0.1,
        y: Math.cos(phase) * 0.15,
        z: 0.5 + Math.sin(phase * 0.5) * 0.05,
        rx: 0,
        ry: 0,
        rz: Math.sin(phase * 0.25),
      },
      gripperPosition: (Math.sin(phase * 2) + 1) / 2, // 0-1
      forceTorque: Array.from({ length: 6 }, () => (Math.random() - 0.5) * 2),
    };
  }
}
