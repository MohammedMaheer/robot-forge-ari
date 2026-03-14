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
import { v4 as uuid } from 'uuid';

interface DaemonConfig {
  sessionId: string;
  robotId: string;
  task: string;
  sampleRateHz: number;
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
  endEffectorPose: number[];  // [x, y, z, qx, qy, qz, qw]
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

    this._currentEpisodeId = uuid();
    this._buffer = [];

    return this._currentEpisodeId;
  }

  async stopEpisode(episodeId: string): Promise<void> {
    if (this._currentEpisodeId !== episodeId) {
      throw new Error(`Episode ${episodeId} is not the active episode`);
    }

    const duration = this._buffer.length > 0
      ? this._buffer[this._buffer.length - 1].timestamp - this._buffer[0].timestamp
      : 0;

    // In production: write buffer to HDF5 via subprocess, queue for sync
    this.emit('episode-complete', {
      id: episodeId,
      durationMs: duration,
      task: this.config?.task ?? 'unknown',
      samples: this._buffer.length,
    });

    this._currentEpisodeId = null;
    this._buffer = [];
    this._episodesRecorded++;
  }

  /**
   * Generate a mock telemetry sample.
   * In production: read from ROS 2 topics or hardware SDK.
   */
  private generateTelemetrySample(): TelemetrySample {
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
      endEffectorPose: [
        0.4 + Math.sin(phase) * 0.1,
        Math.cos(phase) * 0.15,
        0.5 + Math.sin(phase * 0.5) * 0.05,
        0, 0, Math.sin(phase * 0.25), Math.cos(phase * 0.25),
      ],
      gripperPosition: (Math.sin(phase * 2) + 1) / 2, // 0-1
      forceTorque: Array.from({ length: 6 }, () => (Math.random() - 0.5) * 2),
    };
  }
}
