/**
 * SessionPage — Active session telemetry dashboard
 *
 * Displays live telemetry, episode controls, joint position chart,
 * uptime, and an emergency stop button.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface TelemetryData {
  robotId: string;
  timestamp: number;
  jointPositions: number[];
  jointVelocities: number[];
  endEffectorPose: { x: number; y: number; z: number; rx: number; ry: number; rz: number };
}

interface DaemonStatus {
  running: boolean;
  paused: boolean;
  currentEpisodeId?: string;
  episodesRecorded: number;
  uptimeMs: number;
}

function formatUptime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const JOINT_COLORS = ['#2563EB', '#2ECC71', '#E74C3C', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

export function SessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [jointHistory, setJointHistory] = useState<number[][]>([]);
  const [recording, setRecording] = useState(false);
  const [currentEpisodeId, setCurrentEpisodeId] = useState<string | null>(null);
  // Refs hold the latest values without triggering re-renders on every sample
  const latestTelemetryRef = useRef<TelemetryData | null>(null);
  const historyRef = useRef<number[][]>([]);

  // Subscribe to live telemetry — buffer in refs to avoid re-rendering at 100Hz
  useEffect(() => {
    const unsub = window.electronAPI?.daemon.onTelemetry((data: TelemetryData) => {
      latestTelemetryRef.current = data;
      historyRef.current = [...historyRef.current.slice(-59), data.jointPositions];
    });
    // Flush buffered telemetry to React state at 20 Hz (every 50ms)
    const flushInterval = setInterval(() => {
      if (latestTelemetryRef.current) {
        setTelemetry(latestTelemetryRef.current);
        setJointHistory([...historyRef.current]);
      }
    }, 50);
    return () => {
      unsub?.();
      clearInterval(flushInterval);
    };
  }, []);

  const { data: status, refetch: refetchStatus } = useQuery<DaemonStatus>({
    queryKey: ['daemon:status', sessionId],
    queryFn: () =>
      window.electronAPI?.daemon.getStatus() ??
      Promise.resolve({ running: false, paused: false, episodesRecorded: 0, uptimeMs: 0 }),
    refetchInterval: 1000,
  });

  // Sync recording state from daemon status
  useEffect(() => {
    if (status) {
      setRecording(!!status.currentEpisodeId);
      setCurrentEpisodeId(status.currentEpisodeId ?? null);
    }
  }, [status]);

  const handleStartEpisode = useCallback(async () => {
    try {
      const epId = await window.electronAPI?.daemon.startEpisode();
      if (epId) setCurrentEpisodeId(epId);
      setRecording(true);
      refetchStatus();
    } catch (err) {
      console.error('Failed to start episode', err);
    }
  }, [refetchStatus]);

  const handleStopEpisode = useCallback(async () => {
    if (!currentEpisodeId) return;
    try {
      await window.electronAPI?.daemon.stopEpisode(currentEpisodeId);
      setRecording(false);
      setCurrentEpisodeId(null);
      refetchStatus();
    } catch (err) {
      console.error('Failed to stop episode', err);
    }
  }, [currentEpisodeId, refetchStatus]);

  const handleEmergencyStop = useCallback(async () => {
    try {
      await window.electronAPI?.daemon.stop();
      navigate('/collect');
    } catch (err) {
      console.error('Emergency stop failed', err);
    }
  }, [navigate]);

  const jointCount = telemetry?.jointPositions.length ?? 0;

  return (
    <div className="min-h-screen bg-surface p-8 text-white">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Active Session</h1>
          <p className="mt-0.5 font-mono text-sm text-text-secondary">{sessionId}</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                status?.running ? (status.paused ? 'bg-warning animate-pulse' : 'bg-accent-green') : 'bg-error'
              }`}
            />
            <span className="text-text-secondary">
              {status?.running ? (status.paused ? 'Paused' : 'Running') : 'Stopped'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-surface-border bg-surface-elevated p-4">
          <p className="text-xs uppercase tracking-wider text-text-secondary">Episodes</p>
          <p className="mt-1 text-2xl font-bold">{status?.episodesRecorded ?? 0}</p>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-elevated p-4">
          <p className="text-xs uppercase tracking-wider text-text-secondary">Uptime</p>
          <p className="mt-1 font-mono text-2xl font-bold">{formatUptime(status?.uptimeMs ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-elevated p-4">
          <p className="text-xs uppercase tracking-wider text-text-secondary">Sample</p>
          <p className="mt-1 font-mono text-2xl font-bold">
            {telemetry ? `${telemetry.jointPositions.length}J` : '—'}
          </p>
        </div>
      </div>

      {/* Joint positions chart */}
      <section className="mb-6 rounded-lg border border-surface-border bg-surface-elevated p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Joint Positions (rad)
        </h2>
        <div className="flex h-40 items-end gap-1">
          {telemetry?.jointPositions.map((pos, i) => {
            const normalized = (pos + Math.PI) / (2 * Math.PI); // map -π..π → 0..1
            const height = Math.max(2, Math.min(100, normalized * 100));
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t transition-all duration-150"
                  style={{
                    height: `${height}%`,
                    backgroundColor: JOINT_COLORS[i % JOINT_COLORS.length],
                  }}
                />
                <span className="font-mono text-[10px] text-text-secondary">J{i}</span>
              </div>
            );
          })}
          {!telemetry && (
            <p className="w-full text-center text-sm text-text-secondary">Waiting for telemetry…</p>
          )}
        </div>

        {/* Mini sparkline history */}
        {jointHistory.length > 1 && (
          <div className="mt-4">
            <svg
              viewBox={`0 0 ${jointHistory.length} 100`}
              className="h-16 w-full"
              preserveAspectRatio="none"
            >
              {Array.from({ length: jointCount }, (_, ji) => {
                const points = jointHistory
                  .map((frame, fi) => {
                    const val = ((frame[ji] ?? 0) + Math.PI) / (2 * Math.PI) * 100;
                    return `${fi},${100 - val}`;
                  })
                  .join(' ');
                return (
                  <polyline
                    key={ji}
                    points={points}
                    fill="none"
                    stroke={JOINT_COLORS[ji % JOINT_COLORS.length]}
                    strokeWidth="0.8"
                  />
                );
              })}
            </svg>
          </div>
        )}
      </section>

      {/* Episode controls */}
      <div className="flex items-center gap-4">
        {!recording ? (
          <button
            onClick={handleStartEpisode}
            disabled={!status?.running}
            className="rounded-lg bg-accent-green px-6 py-3 font-semibold text-surface transition hover:bg-accent-green/80 disabled:opacity-40"
          >
            ● Start Episode
          </button>
        ) : (
          <button
            onClick={handleStopEpisode}
            className="rounded-lg border border-accent-green bg-transparent px-6 py-3 font-semibold text-accent-green transition hover:bg-accent-green/10"
          >
            ■ Stop Episode
          </button>
        )}

        <button
          onClick={handleEmergencyStop}
          className="rounded-lg bg-error px-6 py-3 font-bold uppercase tracking-wider text-white transition hover:bg-error/80"
        >
          Emergency Stop
        </button>
      </div>
    </div>
  );
}
