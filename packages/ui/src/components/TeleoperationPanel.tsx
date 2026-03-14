import React, { useState, useEffect, useCallback } from 'react';
import type { CollectionSession } from '@robotforge/types';
import { TelemetryChart } from './TelemetryChart';
import { cn } from '../utils/cn';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TeleoperationPanelProps {
  session: CollectionSession;
  onStart: () => void;
  onStop: () => void;
  /** Callback when user presses the emergency stop. */
  onEmergencyStop?: () => void;
  /** LiveKit room token for video streaming (when available). */
  livekitToken?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Camera Feed (placeholder for LiveKit VideoTrack)
// ---------------------------------------------------------------------------

function CameraFeed({ name, status, livekitToken }: { name: string; status: string; livekitToken?: string }) {
  return (
    <div className="relative bg-black rounded-lg overflow-hidden aspect-video group">
      {livekitToken ? (
        // When LiveKit token is provided, this would render a real VideoTrack
        // import { VideoTrack } from '@livekit/components-react';
        // <VideoTrack trackRef={...} />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-accent-green/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-accent-green animate-pulse" />
            </div>
            <p className="text-xs text-green-400">Live Stream Active</p>
            <p className="text-[10px] text-text-secondary mt-0.5">{name}</p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-surface-elevated flex items-center justify-center">
              <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
            </div>
            <p className="text-xs text-text-secondary">{name}</p>
            <p className="text-[10px] text-text-secondary mt-0.5">{status}</p>
          </div>
        </div>
      )}

      {/* Camera label */}
      <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded backdrop-blur-sm">
        {name}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TeleoperationPanel({ session, onStart, onStop, onEmergencyStop, livekitToken, className }: TeleoperationPanelProps) {
  const [aiAssist, setAiAssist] = useState(session.mode === 'ai_assisted');

  const isRecording = session.status === 'recording';
  const isPaused = session.status === 'paused';

  // Keyboard shortcuts (Spec §4.3.4)
  const handleEmergencyStop = useCallback(() => {
    onEmergencyStop?.();
    onStop();
  }, [onEmergencyStop, onStop]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Space: toggle recording
      if (e.code === 'Space' && !e.repeat && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        isRecording ? onStop() : onStart();
      }
      // Escape: emergency stop
      if (e.code === 'Escape') {
        handleEmergencyStop();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isRecording, onStart, onStop, handleEmergencyStop]);

  // Collect all cameras from all connected robots
  const allCameras = session.robots.flatMap((robot) =>
    robot.cameras.map((cam) => ({
      ...cam,
      robotName: robot.name,
      robotStatus: robot.status,
    }))
  );

  return (
    <div className={cn('bg-surface rounded-lg border border-surface-border overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className={cn('w-2.5 h-2.5 rounded-full', isRecording ? 'bg-red-500 animate-pulse' : 'bg-surface-border')} />
          <h2 className="text-sm font-semibold text-text-primary">Teleoperation</h2>
          <span className="text-xs text-text-secondary">
            Session: <span className="font-mono">{session.id.slice(0, 8)}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* AI-Assist Toggle */}
          <button
            onClick={() => setAiAssist(!aiAssist)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors',
              aiAssist
                ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                : 'bg-surface-elevated text-text-secondary border border-surface-border'
            )}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.5-9.11 0-12.58 3.51-3.47 9.14-3.49 12.65 0L21 3v7.12z" />
            </svg>
            AI Assist {aiAssist ? 'ON' : 'OFF'}
          </button>

          {/* Episode count */}
          <span className="text-xs text-text-secondary bg-surface-elevated px-2 py-1 rounded">
            Episodes: <span className="text-text-primary font-medium">{session.episodeCount}</span>
            {session.targetEpisodes && (
              <span className="text-text-secondary"> / {session.targetEpisodes}</span>
            )}
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Camera Grid */}
        <div className="flex-1 p-3">
          <div className={cn(
            'grid gap-2',
            allCameras.length <= 1 ? 'grid-cols-1' : allCameras.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
          )}>
            {allCameras.length > 0 ? (
              allCameras.map((cam) => (
                <CameraFeed
                  key={cam.id}
                  name={`${cam.robotName} / ${cam.name}`}
                  status={cam.robotStatus}
                  livekitToken={livekitToken}
                />
              ))
            ) : (
              <div className="col-span-full aspect-video bg-black rounded-lg flex items-center justify-center">
                <p className="text-text-secondary text-sm">No cameras connected</p>
              </div>
            )}
          </div>

          {/* Telemetry chart below cameras */}
          {session.robots.length > 0 && (
            <div className="mt-3">
              <TelemetryChart
                robotId={session.robots[0].id}
                modalities={['joint_positions', 'joint_velocities', 'end_effector_pose']}
                windowSeconds={15}
              />
            </div>
          )}
        </div>

        {/* Sidebar: Robot Status */}
        <div className="w-64 border-l border-surface-border p-3 space-y-3">
          <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">Connected Robots</h3>
          {session.robots.map((robot) => (
            <div key={robot.id} className="bg-surface-elevated rounded p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-primary">{robot.name}</span>
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    robot.status === 'connected' || robot.status === 'recording'
                      ? 'bg-accent-green'
                      : robot.status === 'error'
                        ? 'bg-error'
                        : 'bg-surface-border'
                  )}
                />
              </div>
              <p className="text-[10px] text-text-secondary mt-1">{robot.embodiment} — {robot.connectionType}</p>
              {robot.batteryLevel !== undefined && (
                <div className="mt-1.5">
                  <div className="flex justify-between text-[10px] text-text-secondary">
                    <span>Battery</span>
                    <span>{robot.batteryLevel}%</span>
                  </div>
                  <div className="h-1 bg-surface rounded-full mt-0.5">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        robot.batteryLevel > 20 ? 'bg-accent-green' : 'bg-error'
                      )}
                      style={{ width: `${robot.batteryLevel}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Quality Score Live */}
          <div className="bg-surface-elevated rounded p-2.5">
            <h4 className="text-[10px] text-text-secondary uppercase tracking-wider">Live Quality</h4>
            <div className="text-2xl font-bold text-accent-green mt-1">87</div>
            <p className="text-[10px] text-text-secondary">AI-estimated score</p>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border bg-surface-elevated">
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <button
              onClick={onStart}
              className="px-4 py-2 bg-accent-green text-white text-sm font-medium rounded hover:bg-green-600 transition-colors"
            >
              ▶ Start Recording
            </button>
          ) : (
            <button
              onClick={onStop}
              className="px-4 py-2 bg-surface text-text-primary text-sm font-medium rounded border border-surface-border hover:bg-surface-elevated transition-colors"
            >
              ⏹ Stop Recording
            </button>
          )}
        </div>

        {/* Emergency Stop (Esc shortcut) */}
        <button
          onClick={handleEmergencyStop}
          className="px-6 py-2.5 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/25"
          title="Emergency Stop (Esc)"
        >
          ⛔ EMERGENCY STOP
        </button>
      </div>
    </div>
  );
}
