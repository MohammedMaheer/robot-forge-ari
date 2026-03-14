// ============================================================================
// ROBOTFORGE — Robot SDK
//
// Provides a pluggable driver interface for connecting to robots,
// streaming telemetry, and sending commands.
// ============================================================================

import type { RobotConnectionConfig } from '@robotforge/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const ROBOT_TIMEOUT_MS = 5000;
export const DEFAULT_SAMPLE_RATE_HZ = 50;

// ---------------------------------------------------------------------------
// Telemetry & Command types
// ---------------------------------------------------------------------------

export interface TelemetryFrame {
  robotId: string;
  timestamp: number;
  jointPositions: number[];
  jointVelocities: number[];
  endEffectorPose: { x: number; y: number; z: number; rx: number; ry: number; rz: number };
  gripperPosition: number;
}

export interface RobotCommand {
  type: 'move_joints' | 'move_cartesian' | 'gripper' | 'stop' | 'home';
  payload: Record<string, unknown>;
}

export type RobotDriverStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// ---------------------------------------------------------------------------
// Driver interface
// ---------------------------------------------------------------------------

export interface RobotDriver {
  readonly status: RobotDriverStatus;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendCommand(command: RobotCommand): Promise<void>;
  getTelemetry(): TelemetryFrame | null;
  getStatus(): { status: RobotDriverStatus; uptimeMs: number; sampleRateHz: number };
  onTelemetry(callback: (frame: TelemetryFrame) => void): () => void;
}

// ---------------------------------------------------------------------------
// MockRobotDriver — generates sine wave telemetry for development
// ---------------------------------------------------------------------------

export class MockRobotDriver implements RobotDriver {
  status: RobotDriverStatus = 'disconnected';

  private jointCount: number;
  private sampleRateHz: number;
  private interval: ReturnType<typeof setInterval> | null = null;
  private startTime = 0;
  private lastFrame: TelemetryFrame | null = null;
  private listeners = new Set<(frame: TelemetryFrame) => void>();
  private robotId: string;

  constructor(config: Pick<RobotConnectionConfig, 'name'>, sampleRateHz = DEFAULT_SAMPLE_RATE_HZ, jointCount = 7) {
    this.robotId = config.name ?? 'mock-robot';
    this.sampleRateHz = sampleRateHz;
    this.jointCount = jointCount;
  }

  async connect(): Promise<void> {
    this.status = 'connecting';
    // Simulate connection latency
    await new Promise((r) => setTimeout(r, 150));
    this.status = 'connected';
    this.startTime = Date.now();
    this.startTelemetry();
  }

  async disconnect(): Promise<void> {
    this.stopTelemetry();
    this.status = 'disconnected';
    this.lastFrame = null;
  }

  async sendCommand(command: RobotCommand): Promise<void> {
    if (this.status !== 'connected') throw new Error('Robot not connected');
    // Mock: log command
    console.debug('[MockRobotDriver] command:', command.type, command.payload);
  }

  getTelemetry(): TelemetryFrame | null {
    return this.lastFrame;
  }

  getStatus() {
    return {
      status: this.status,
      uptimeMs: this.status === 'connected' ? Date.now() - this.startTime : 0,
      sampleRateHz: this.sampleRateHz,
    };
  }

  onTelemetry(callback: (frame: TelemetryFrame) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // ─── Internal ───

  private startTelemetry() {
    const intervalMs = Math.round(1000 / this.sampleRateHz);
    this.interval = setInterval(() => {
      const t = (Date.now() - this.startTime) / 1000;
      const frame: TelemetryFrame = {
        robotId: this.robotId,
        timestamp: Date.now(),
        jointPositions: Array.from({ length: this.jointCount }, (_, i) =>
          Math.sin(t * (0.5 + i * 0.3)) * (Math.PI / 2),
        ),
        jointVelocities: Array.from({ length: this.jointCount }, (_, i) =>
          Math.cos(t * (0.5 + i * 0.3)) * 0.5,
        ),
        endEffectorPose: {
          x: 0.4 + 0.1 * Math.sin(t),
          y: 0.0 + 0.1 * Math.cos(t * 0.7),
          z: 0.3 + 0.05 * Math.sin(t * 1.3),
          rx: 0,
          ry: Math.PI,
          rz: Math.sin(t * 0.2) * 0.3,
        },
        gripperPosition: (Math.sin(t * 0.5) + 1) / 2,
      };
      this.lastFrame = frame;
      for (const listener of this.listeners) {
        listener(frame);
      }
    }, intervalMs);
  }

  private stopTelemetry() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

// ---------------------------------------------------------------------------
// WebSocketRobotDriver — connects to a robot via WebSocket bridge
// ---------------------------------------------------------------------------

export class WebSocketRobotDriver implements RobotDriver {
  status: RobotDriverStatus = 'disconnected';

  private ws: WebSocket | null = null;
  private startTime = 0;
  private lastFrame: TelemetryFrame | null = null;
  private listeners = new Set<(frame: TelemetryFrame) => void>();
  private readonly url: string;
  private readonly robotId: string;
  private readonly timeoutMs: number;
  private readonly sampleRateHz: number;

  constructor(
    config: RobotConnectionConfig,
    sampleRateHz = DEFAULT_SAMPLE_RATE_HZ,
    timeoutMs = ROBOT_TIMEOUT_MS,
  ) {
    const port = config.port ?? 9090;
    this.url = `ws://${config.ipAddress}:${port}`;
    this.robotId = config.name;
    this.timeoutMs = timeoutMs;
    this.sampleRateHz = sampleRateHz;
  }

  async connect(): Promise<void> {
    if (typeof WebSocket === 'undefined') {
      throw new Error('WebSocket is not available in this environment');
    }

    this.status = 'connecting';

    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.ws?.close();
        this.status = 'error';
        reject(new Error(`Connection timeout after ${this.timeoutMs}ms`));
      }, this.timeoutMs);

      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        clearTimeout(timer);
        this.status = 'connected';
        this.startTime = Date.now();
        resolve();
      };

      this.ws.onerror = (event) => {
        clearTimeout(timer);
        this.status = 'error';
        reject(new Error(`WebSocket error: ${String(event)}`));
      };

      this.ws.onclose = () => {
        this.status = 'disconnected';
      };

      this.ws.onmessage = (event) => {
        try {
          const frame = JSON.parse(String(event.data)) as TelemetryFrame;
          this.lastFrame = frame;
          for (const listener of this.listeners) {
            listener(frame);
          }
        } catch {
          // Skip malformed frames
        }
      };
    });
  }

  async disconnect(): Promise<void> {
    this.ws?.close();
    this.ws = null;
    this.status = 'disconnected';
    this.lastFrame = null;
  }

  async sendCommand(command: RobotCommand): Promise<void> {
    if (!this.ws || this.status !== 'connected') {
      throw new Error('Robot not connected');
    }
    this.ws.send(JSON.stringify(command));
  }

  getTelemetry(): TelemetryFrame | null {
    return this.lastFrame;
  }

  getStatus() {
    return {
      status: this.status,
      uptimeMs: this.status === 'connected' ? Date.now() - this.startTime : 0,
      sampleRateHz: this.sampleRateHz,
    };
  }

  onTelemetry(callback: (frame: TelemetryFrame) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export type RobotDriverType = 'mock' | 'websocket';

export function createRobotDriver(
  type: RobotDriverType,
  config: RobotConnectionConfig,
  sampleRateHz = DEFAULT_SAMPLE_RATE_HZ,
): RobotDriver {
  switch (type) {
    case 'mock':
      return new MockRobotDriver(config, sampleRateHz);
    case 'websocket':
      return new WebSocketRobotDriver(config, sampleRateHz);
    default:
      throw new Error(`Unsupported robot driver type: ${type}`);
  }
}
