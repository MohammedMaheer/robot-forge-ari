/**
 * Robots IPC Handlers
 *
 * Handles robot discovery, connection, telemetry streaming,
 * and command dispatch.
 *
 * For ROS 2 robots: delegates to the collection-service fleet API
 * which manages rclpy nodes server-side.  Falls back to mock
 * discovery when the backend is unreachable.
 */

import type { IpcMain } from 'electron';
import {
  robotConnectSchema,
  robotIdSchema,
  robotCommandSchema,
  validateIpc,
} from './schemas';

interface ConnectedRobot {
  id: string;
  name: string;
  host: string;
  port: number;
  connected: boolean;
  batteryLevel: number;
  temperature: number;
  ros2Namespace?: string;
  connectionType?: string;
}

// In-memory connected robots
const connectedRobots = new Map<string, ConnectedRobot>();

const COLLECTION_SERVICE_URL =
  process.env.COLLECTION_SERVICE_URL ?? 'http://localhost:8001';

export function registerRobotsIpc(ipcMain: IpcMain): void {
  /**
   * Discover robots on the local network.
   * First tries the collection-service fleet API (ROS 2 DDS graph),
   * falls back to mock data if the backend is unreachable.
   */
  ipcMain.handle('robots:discover', async () => {
    try {
      const res = await fetch(`${COLLECTION_SERVICE_URL}/fleet/robots`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        return (json.data ?? []).map((r: any) => ({
          id: r.robot_id ?? r.robotId,
          name: r.name,
          host: COLLECTION_SERVICE_URL,
          port: 8001,
          type: r.embodiment ?? 'custom',
          connectionType: r.connection_type ?? r.connectionType ?? 'ros2',
          ros2Namespace: r.namespace ?? '',
        }));
      }
    } catch {
      // Backend unreachable — fall back to mock
    }

    // Mock discovery fallback
    return [
      { id: 'franka-sim-01', name: 'Franka Emika Panda (Sim)', host: '127.0.0.1', port: 9090, type: 'franka', connectionType: 'websocket' },
      { id: 'ur5e-sim-01', name: 'UR5e (Sim)', host: '127.0.0.1', port: 9091, type: 'ur5e', connectionType: 'websocket' },
      { id: 'so101-sim-01', name: 'SO-101 (Sim)', host: '127.0.0.1', port: 9092, type: 'so101', connectionType: 'ros2', ros2Namespace: '/robot/so101' },
    ];
  });

  /**
   * Connect to a robot given its config.
   * Enforces the 5000ms timeout rule.
   */
  ipcMain.handle('robots:connect', async (_event, rawConfig: unknown) => {
    const config = validateIpc(robotConnectSchema, rawConfig, 'robots:connect');
    const timeout = config.timeout ?? 5000;
    const robotId = `robot-${crypto.randomUUID().slice(0, 8)}`;

    // Simulate connection with timeout
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Connection timeout after ${timeout}ms`)), timeout);
      // Mock: connection succeeds after 200ms
      setTimeout(() => {
        clearTimeout(timer);
        resolve();
      }, 200);
    });

    const robot: ConnectedRobot = {
      id: robotId,
      name: `Robot@${config.host}:${config.port}`,
      host: config.host,
      port: config.port,
      connected: true,
      batteryLevel: 95,
      temperature: 32.5,
    };

    connectedRobots.set(robotId, robot);
    return { id: robot.id, name: robot.name, connected: true };
  });

  /**
   * Disconnect a robot.
   */
  ipcMain.handle('robots:disconnect', async (_event, rawId: unknown) => {
    const robotId = validateIpc(robotIdSchema, rawId, 'robots:disconnect');
    const robot = connectedRobots.get(robotId);
    if (!robot) throw new Error(`Robot ${robotId} not found`);
    robot.connected = false;
    connectedRobots.delete(robotId);
  });

  /**
   * Send a command to a connected robot.
   */
  ipcMain.handle('robots:send-command', async (_event, rawRobotId: unknown, rawCommand: unknown) => {
    const robotId = validateIpc(robotIdSchema, rawRobotId, 'robots:send-command');
    const command = validateIpc(robotCommandSchema, rawCommand, 'robots:send-command');
    const robot = connectedRobots.get(robotId);
    if (!robot) throw new Error(`Robot ${robotId} not found`);
    if (!robot.connected) throw new Error(`Robot ${robotId} is not connected`);

    // In production: forward command to ROS 2 action server / serial port
    console.log(`[robots.ipc] Command to ${robotId}:`, command.type, command.payload);
  });

  /**
   * Get live status of a connected robot.
   */
  ipcMain.handle('robots:get-status', async (_event, rawRobotId: unknown) => {
    const robotId = validateIpc(robotIdSchema, rawRobotId, 'robots:get-status');
    const robot = connectedRobots.get(robotId);
    if (!robot) throw new Error(`Robot ${robotId} not found`);

    return {
      id: robot.id,
      connected: robot.connected,
      batteryLevel: Math.max(0, Math.min(100, robot.batteryLevel + (Math.random() - 0.5) * 2)),
      temperature: robot.temperature + (Math.random() - 0.5) * 0.2,
    };
  });
}
