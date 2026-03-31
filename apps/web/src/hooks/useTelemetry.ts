import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import type { TelemetryDataPoint } from '@robotforge/ui';

interface RobotTelemetry {
  robotId: string;
  jointPositions: number[];
  endEffectorPose: { x: number; y: number; z: number; rx: number; ry: number; rz: number };
  gripperPosition: number;
  batteryLevel: number;
  temperature: number;
  timestamp: number;
}

const MAX_HISTORY = 500;

export function useTelemetry(robotId: string | null) {
  const { on, emit, connected } = useWebSocket({ namespace: '/teleoperation', autoConnect: !!robotId });
  const [latest, setLatest] = useState<RobotTelemetry | null>(null);
  const historyRef = useRef<TelemetryDataPoint[]>([]);
  const [history, setHistory] = useState<TelemetryDataPoint[]>([]);

  useEffect(() => {
    if (!robotId || !connected) return;

    // Subscribe to this robot's telemetry stream
    emit('subscribe', { robotId });

    const cleanup = on('robot:state', (data: unknown) => {
      const telemetry = data as RobotTelemetry;
      if (telemetry.robotId !== robotId) return;

      setLatest(telemetry);

      const point: TelemetryDataPoint = {
        timestamp: telemetry.timestamp,
        ...Object.fromEntries(telemetry.jointPositions.map((v, i) => [`j${i}`, v])),
        gripper: telemetry.gripperPosition,
        battery: telemetry.batteryLevel,
        temp: telemetry.temperature,
      };

      historyRef.current = [...historyRef.current.slice(-MAX_HISTORY + 1), point];
      setHistory([...historyRef.current]);
    });

    return () => {
      cleanup?.();
      emit('unsubscribe', { robotId });
    };
  }, [robotId, connected, emit, on]);

  const sendCommand = useCallback(
    (command: { type: string; payload: Record<string, unknown> }) => {
      if (robotId) emit('robot:command', { robotId, ...command });
    },
    [robotId, emit],
  );

  return { latest, history, connected, sendCommand };
}
