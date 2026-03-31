/**
 * CollectPage — Desktop collection wizard
 *
 * Discovers local robots, lets the operator configure a session
 * (task type, sample rate) and kick off the CollectionDaemon.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface DiscoveredRobot {
  id: string;
  name: string;
  host: string;
  port: number;
  type: string;
}

const TASK_OPTIONS = [
  'bin_picking',
  'assembly',
  'packing',
  'palletizing',
  'navigation',
  'inspection',
  'surgical',
  'manipulation',
  'whole_body_loco',
  'custom',
] as const;

export function CollectPage() {
  const navigate = useNavigate();

  const [selectedRobot, setSelectedRobot] = useState<DiscoveredRobot | null>(null);
  const [connectedRobotId, setConnectedRobotId] = useState<string | null>(null);
  const sessionStartedRef = useRef(false);

  // Disconnect robot if we leave the page before starting a session
  useEffect(() => {
    return () => {
      if (connectedRobotId && !sessionStartedRef.current) {
        window.electronAPI?.robots.disconnect(connectedRobotId);
      }
    };
  }, [connectedRobotId]);
  const [task, setTask] = useState<string>(TASK_OPTIONS[0]);
  const [sampleRate, setSampleRate] = useState(50);
  const [starting, setStarting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  const {
    data: robots = [],
    isLoading: discovering,
    refetch: rediscover,
  } = useQuery<DiscoveredRobot[]>({
    queryKey: ['robots:discover'],
    queryFn: () => window.electronAPI?.robots.discover() ?? Promise.resolve([]),
    refetchInterval: 10_000,
  });

  const handleSelectRobot = useCallback(async (robot: DiscoveredRobot) => {
    // Disconnect the previous robot before connecting a new one
    if (connectedRobotId) {
      try {
        await window.electronAPI?.robots.disconnect(connectedRobotId);
      } catch {
        // best-effort disconnect
      }
      setConnectedRobotId(null);
    }
    setSelectedRobot(robot);
    setConnectionStatus('connecting');
    try {
      const connected = await window.electronAPI?.robots.connect({
        host: robot.host,
        port: robot.port,
        protocol: 'websocket',
      });
      if (connected) setConnectedRobotId(connected.id);
      setConnectionStatus('connected');
    } catch {
      setConnectionStatus('error');
    }
  }, [connectedRobotId]);

  const handleStart = useCallback(async () => {
    if (!selectedRobot) return;
    setStarting(true);
    try {
      const sessionId = `session-${Date.now().toString(36)}`;
      await window.electronAPI?.daemon.start({
        sessionId,
        robotId: connectedRobotId ?? selectedRobot.id,
        task,
        sampleRateHz: sampleRate,
      });
      sessionStartedRef.current = true;
      navigate(`/session/${sessionId}`);
    } catch (err) {
      console.error('Failed to start session', err);
      setStarting(false);
    }
  }, [selectedRobot, connectedRobotId, task, sampleRate, navigate, sessionStartedRef]);

  return (
    <div className="min-h-screen bg-surface p-8 text-white">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">New Collection</h1>

      {/* ── Step 1: Discover Robots ─────────────────────────── */}
      <section className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-text-secondary">1. Select a Robot</h2>
          <button
            onClick={() => rediscover()}
            disabled={discovering}
            className="rounded-md bg-surface-elevated px-3 py-1 text-sm text-text-secondary hover:text-white transition disabled:opacity-40"
          >
            {discovering ? 'Scanning…' : 'Rescan'}
          </button>
        </div>

        {robots.length === 0 && !discovering && (
          <p className="text-sm text-text-secondary">No robots found on the network.</p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {robots.map((robot) => {
            const isSelected = selectedRobot?.id === robot.id;
            return (
              <button
                key={robot.id}
                onClick={() => handleSelectRobot(robot)}
                className={`flex flex-col rounded-lg border p-4 text-left transition ${
                  isSelected
                    ? 'border-mid-blue bg-brand-blue/40'
                    : 'border-surface-border bg-surface-elevated hover:border-mid-blue/60'
                }`}
              >
                <span className="font-mono text-sm text-mid-blue">{robot.type}</span>
                <span className="mt-1 text-base font-medium">{robot.name}</span>
                <span className="mt-0.5 text-xs text-text-secondary">
                  {robot.host}:{robot.port}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Connection Status Indicator ────────────────────── */}
      {selectedRobot && (
        <div className="mb-6 flex items-center gap-2 text-sm">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-accent-green'
                : connectionStatus === 'connecting'
                  ? 'bg-warning animate-pulse'
                  : connectionStatus === 'error'
                    ? 'bg-error'
                    : 'bg-text-secondary'
            }`}
          />
          <span className="text-text-secondary">
            {connectionStatus === 'connected' && `Connected to ${selectedRobot.name}`}
            {connectionStatus === 'connecting' && `Connecting to ${selectedRobot.name}…`}
            {connectionStatus === 'error' && `Failed to connect to ${selectedRobot.name}`}
            {connectionStatus === 'idle' && 'Not connected'}
          </span>
        </div>
      )}

      {/* ── Step 2: Session Config ─────────────────────────── */}
      <section className="mb-8 max-w-md">
        <h2 className="mb-3 text-lg font-semibold text-text-secondary">2. Configure Session</h2>

        <label className="mb-1 block text-sm text-text-secondary">Task Type</label>
        <select
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="mb-4 w-full rounded-md border border-surface-border bg-surface-elevated px-3 py-2 text-sm text-white focus:border-mid-blue focus:outline-none"
        >
          {TASK_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        <label className="mb-1 block text-sm text-text-secondary">
          Sample Rate: <span className="font-mono text-white">{sampleRate} Hz</span>
        </label>
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={sampleRate}
          onChange={(e) => setSampleRate(Number(e.target.value))}
          className="mb-2 w-full accent-mid-blue"
        />
        <div className="flex justify-between text-xs text-text-secondary">
          <span>10 Hz</span>
          <span>100 Hz</span>
        </div>
      </section>

      {/* ── Step 3: Start ──────────────────────────────────── */}
      <button
        onClick={handleStart}
        disabled={!selectedRobot || connectionStatus !== 'connected' || starting}
        className="rounded-lg bg-mid-blue px-8 py-3 text-base font-semibold text-white transition hover:bg-mid-blue/80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {starting ? 'Starting…' : 'Start Session'}
      </button>
    </div>
  );
}
