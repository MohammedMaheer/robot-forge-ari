import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCollectionStore } from '@/store/collectionStore';
import { apiClient } from '@/lib/api';
import { useNotifications } from '@/contexts/NotificationContext';
import type {
  ConnectedRobot,
  RobotEmbodiment,
  RobotConnectionType,
  RobotTask,
  SessionMode,
} from '@robotforge/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMBODIMENTS: RobotEmbodiment[] = [
  'ur5', 'ur10', 'franka_panda', 'xarm6', 'xarm7',
  'unitree_h1', 'unitree_g1', 'figure01', 'agility_digit',
  'boston_dynamics_spot', 'clearpath_husky', 'so100', 'so101', 'custom',
];

const CONNECTION_TYPES: RobotConnectionType[] = ['ros2', 'grpc', 'websocket', 'usb'];

const TASKS: RobotTask[] = [
  'bin_picking', 'assembly', 'packing', 'palletizing',
  'navigation', 'inspection', 'surgical', 'manipulation',
  'whole_body_loco', 'custom',
];

// ---------------------------------------------------------------------------
// Status indicator
// ---------------------------------------------------------------------------

function StatusDot({ status }: { status: string }) {
  const color =
    status === 'connected'
      ? 'bg-accent-green'
      : status === 'recording'
        ? 'bg-red-500 animate-pulse'
        : status === 'error'
          ? 'bg-red-500'
          : 'bg-gray-500';
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CollectionPage() {
  const navigate = useNavigate();
  const { startSession } = useCollectionStore();
  const { push } = useNotifications();
  const queryClient = useQueryClient();

  // Step management
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // ── Fetch connected robots from API ─────────────────
  const { data: robots = [], isLoading: robotsLoading, isError: robotsError } = useQuery<ConnectedRobot[]>({
    queryKey: ['robots', 'connected'],
    queryFn: async () => {
      const { data } = await apiClient.get('/collection/robots');
      return data.data ?? data;
    },
    staleTime: 10_000,
    refetchInterval: 15_000,
  });

  // Step 1 — Robot connection state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [newEmbodiment, setNewEmbodiment] = useState<RobotEmbodiment>('ur5');
  const [newConnectionType, setNewConnectionType] = useState<RobotConnectionType>('ros2');
  const [selectedRobotIds, setSelectedRobotIds] = useState<string[]>([]);

  // Step 2 — Session config
  const [task, setTask] = useState<RobotTask>('bin_picking');
  const [mode, setMode] = useState<SessionMode>('manual');
  const [targetEpisodes, setTargetEpisodes] = useState(50);

  // Add robot handler — calls API and invalidates query
  const handleAddRobot = async () => {
    if (!newIp.trim()) return;
    await apiClient.post('/collection/robots/connect', { name: newEmbodiment + ' @ ' + newIp, embodiment: newEmbodiment, connection_type: 'ros2', ip_address: newIp });
    queryClient.invalidateQueries({ queryKey: ['robots'] });
    setShowAddForm(false);
    setNewIp('');
  };

  const toggleRobot = (id: string) => {
    setSelectedRobotIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // Start session
  const handleStart = async () => {
    try {
      const session = await startSession({
        task,
        mode,
        robotIds: selectedRobotIds,
        targetEpisodes,
      });
      navigate(`/collect/${session.id}`);
    } catch {
      push('error', 'Failed to start session', 'Could not connect to the collection service. Please check your robot connections.');
    }
  };

  const canProceedStep1 = selectedRobotIds.length > 0;
  const canProceedStep2 = !!task;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Start Data Collection</h1>
        <p className="text-sm text-text-secondary mt-0.5">Configure robots, task, and begin collecting episodes</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s as 1 | 2 | 3)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              step === s
                ? 'bg-brand-blue text-white'
                : step > s
                  ? 'bg-accent-green/20 text-accent-green'
                  : 'bg-surface-elevated text-text-secondary border border-surface-border'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
              {step > s ? '✓' : s}
            </span>
            {s === 1 ? 'Robots' : s === 2 ? 'Configuration' : 'Launch'}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Step 1 — Robot Connection                                          */}
      {/* ------------------------------------------------------------------ */}
      {step === 1 && (
        <div className="bg-surface-elevated border border-surface-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Connected Robots</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 bg-mid-blue text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors"
            >
              {showAddForm ? 'Cancel' : '+ Add Robot'}
            </button>
          </div>

          {/* Inline add form */}
          {showAddForm && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-surface rounded-lg border border-surface-border p-4">
              <div>
                <label className="block text-xs text-text-secondary mb-1">IP Address</label>
                <input
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="192.168.1.100"
                  className="w-full bg-surface-elevated border border-surface-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-mid-blue transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">Embodiment</label>
                <select
                  value={newEmbodiment}
                  onChange={(e) => setNewEmbodiment(e.target.value as RobotEmbodiment)}
                  className="w-full bg-surface-elevated border border-surface-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-mid-blue transition-colors"
                >
                  {EMBODIMENTS.map((e) => (
                    <option key={e} value={e}>{e.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">Connection</label>
                <select
                  value={newConnectionType}
                  onChange={(e) => setNewConnectionType(e.target.value as RobotConnectionType)}
                  className="w-full bg-surface-elevated border border-surface-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-mid-blue transition-colors"
                >
                  {CONNECTION_TYPES.map((c) => (
                    <option key={c} value={c}>{c.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddRobot}
                  className="w-full py-2 bg-accent-green text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          )}

          {/* Robot list */}
          {robotsLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : robotsError ? (
            <div className="text-center py-10 text-red-400">Failed to load data</div>
          ) : robots.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No robots connected yet</div>
          ) : (
            <div className="space-y-2">
              {robots.map((robot) => (
                <label
                  key={robot.id}
                  className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRobotIds.includes(robot.id)
                      ? 'border-mid-blue bg-mid-blue/10'
                      : 'border-surface-border bg-surface hover:bg-surface-elevated'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRobotIds.includes(robot.id)}
                    onChange={() => toggleRobot(robot.id)}
                    className="accent-mid-blue"
                  />
                  <StatusDot status={robot.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary font-medium truncate">{robot.name}</p>
                    <p className="text-xs text-text-secondary">
                      {robot.embodiment.replace(/_/g, ' ')} · {robot.connectionType.toUpperCase()} · {robot.ipAddress}
                    </p>
                  </div>
                  <span className={`text-xs capitalize ${robot.status === 'connected' ? 'text-accent-green' : 'text-text-secondary'}`}>
                    {robot.status}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
              className="px-5 py-2 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-blue-800 disabled:opacity-40 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Step 2 — Session Configuration                                     */}
      {/* ------------------------------------------------------------------ */}
      {step === 2 && (
        <div className="bg-surface-elevated border border-surface-border rounded-lg p-6 space-y-5">
          <h2 className="text-sm font-semibold text-text-primary">Session Configuration</h2>

          {/* Task type */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Task Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {TASKS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTask(t)}
                  className={`px-3 py-2 rounded-md text-xs font-medium capitalize transition-colors ${
                    task === t
                      ? 'bg-brand-blue text-white'
                      : 'bg-surface border border-surface-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {t.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Mode toggle */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Collection Mode</label>
            <div className="flex gap-3">
              {(['manual', 'ai_assisted', 'leader_follower'] as SessionMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    mode === m
                      ? m === 'ai_assisted'
                        ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                        : m === 'leader_follower'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-brand-blue text-white'
                      : 'bg-surface border border-surface-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {m === 'manual' ? '🎮 Manual' : m === 'ai_assisted' ? '🤖 AI-Assisted' : '🔗 Leader-Follower'}
                </button>
              ))}
            </div>
          </div>

          {/* Target episode count */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Target Episodes: <span className="text-text-primary font-bold">{targetEpisodes}</span>
            </label>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={targetEpisodes}
              onChange={(e) => setTargetEpisodes(Number(e.target.value))}
              className="w-full accent-brand-blue"
            />
            <div className="flex justify-between text-[10px] text-text-secondary mt-1">
              <span>10</span>
              <span>500</span>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2 bg-surface text-text-secondary text-sm font-medium rounded-md border border-surface-border hover:text-text-primary transition-colors"
            >
              ← Back
            </button>
            <button
              disabled={!canProceedStep2}
              onClick={() => setStep(3)}
              className="px-5 py-2 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-blue-800 disabled:opacity-40 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Step 3 — Review & Launch                                           */}
      {/* ------------------------------------------------------------------ */}
      {step === 3 && (
        <div className="bg-surface-elevated border border-surface-border rounded-lg p-6 space-y-5">
          <h2 className="text-sm font-semibold text-text-primary">Review & Launch</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface rounded-lg border border-surface-border p-4 space-y-2">
              <p className="text-xs text-text-secondary">Selected Robots</p>
              {robots
                .filter((r) => selectedRobotIds.includes(r.id))
                .map((r) => (
                  <div key={r.id} className="flex items-center gap-2">
                    <StatusDot status={r.status} />
                    <span className="text-sm text-text-primary">{r.name}</span>
                  </div>
                ))}
            </div>
            <div className="bg-surface rounded-lg border border-surface-border p-4 space-y-2">
              <p className="text-xs text-text-secondary">Session Details</p>
              <p className="text-sm text-text-primary">
                Task: <span className="capitalize">{task.replace(/_/g, ' ')}</span>
              </p>
              <p className="text-sm text-text-primary">
                Mode: <span className="capitalize">{mode.replace(/_/g, ' ')}</span>
              </p>
              <p className="text-sm text-text-primary">Target: {targetEpisodes} episodes</p>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2 bg-surface text-text-secondary text-sm font-medium rounded-md border border-surface-border hover:text-text-primary transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleStart}
              className="px-6 py-2.5 bg-accent-green text-white text-sm font-bold rounded-md hover:bg-green-600 transition-colors"
            >
              ▶ Start Collection Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
