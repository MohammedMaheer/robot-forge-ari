import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { TeleoperationPanel, EpisodeTable } from '@robotforge/ui';
import { apiClient } from '@/lib/api';
import type { CollectionSession, Episode } from '@robotforge/types';

// ---------------------------------------------------------------------------
// Fallback session data (used when API is unavailable)
// ---------------------------------------------------------------------------

const FALLBACK_SESSION: CollectionSession = {
  id: 'sess-abc12345',
  operatorId: 'user-1',
  robots: [
    {
      id: 'r-1',
      name: 'UR5 Workstation A',
      embodiment: 'ur5',
      connectionType: 'ros2',
      ipAddress: '192.168.1.10',
      status: 'recording',
      cameras: [
        { id: 'c1', name: 'overview', resolution: { width: 1280, height: 720 }, fps: 30 },
        { id: 'c2', name: 'wrist', resolution: { width: 640, height: 480 }, fps: 30 },
      ],
    },
  ],
  status: 'recording',
  mode: 'manual',
  episodeCount: 12,
  startedAt: new Date(Date.now() - 45 * 60 * 1000),
  targetEpisodes: 50,
};

const FALLBACK_EPISODES: Episode[] = Array.from({ length: 12 }, (_, i) => ({
  id: `ep-${i + 1}`,
  sessionId: 'sess-abc12345',
  robotId: 'r-1',
  embodiment: 'ur5' as const,
  task: 'bin_picking' as const,
  durationMs: 15000 + Math.floor(Math.random() * 20000),
  frameCount: 300 + Math.floor(Math.random() * 200),
  qualityScore: 70 + Math.floor(Math.random() * 30),
  status: i < 10 ? 'packaged' as const : 'processing' as const,
  sensorModalities: ['rgb_camera', 'joint_positions', 'end_effector_pose'],
  metadata: {
    environment: 'lab',
    lighting: 'bright',
    objectVariety: 5,
    successLabel: i % 3 !== 0 ? true : null,
    operatorId: 'user-1',
    aiAssisted: false,
    compressionRatio: 4.2,
    rawSizeBytes: 52_000_000,
    compressedSizeBytes: 12_400_000,
  },
  createdAt: new Date(Date.now() - (12 - i) * 3 * 60 * 1000),
}));

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ActiveSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  // ── Fetch session from API ──────────────────────────────────
  const { data: fetchedSession } = useQuery<CollectionSession>({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get(`/collection/sessions/${sessionId}`);
        return data;
      } catch {
        return FALLBACK_SESSION;
      }
    },
    refetchInterval: 5_000,
    staleTime: 3_000,
  });

  // ── Fetch episodes for this session ─────────────────────────
  const { data: fetchedEpisodes = FALLBACK_EPISODES } = useQuery<Episode[]>({
    queryKey: ['session', sessionId, 'episodes'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get(`/collection/sessions/${sessionId}/episodes`);
        return data.data ?? data;
      } catch {
        return FALLBACK_EPISODES;
      }
    },
    refetchInterval: 5_000,
    staleTime: 3_000,
  });

  const [session, setSession] = useState<CollectionSession>(FALLBACK_SESSION);
  const [episodes, setEpisodes] = useState<Episode[]>(FALLBACK_EPISODES);

  useEffect(() => {
    if (fetchedSession) setSession(fetchedSession);
  }, [fetchedSession]);

  useEffect(() => {
    if (fetchedEpisodes.length > 0) setEpisodes(fetchedEpisodes);
  }, [fetchedEpisodes]);

  // Timer
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const start = session.startedAt.getTime();
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session.startedAt]);

  const formatElapsed = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const avgQuality =
    episodes.length > 0
      ? Math.round(episodes.reduce((sum, e) => sum + e.qualityScore, 0) / episodes.length)
      : 0;

  const handleStartRecording = () => {
    setSession((prev) => ({ ...prev, status: 'recording' }));
  };

  const handleStopRecording = () => {
    setSession((prev) => ({ ...prev, status: 'paused' }));
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-elevated border-b border-surface-border shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/collect')}
            className="text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${session.status === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-surface-border'}`} />
            <h1 className="text-sm font-semibold text-text-primary">
              Session <span className="font-mono">{(sessionId ?? session.id).slice(0, 12)}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-center">
            <p className="text-[10px] text-text-secondary uppercase tracking-wide">Timer</p>
            <p className="text-sm font-mono text-text-primary">{formatElapsed(elapsed)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-text-secondary uppercase tracking-wide">Episodes</p>
            <p className="text-sm font-mono text-text-primary">
              {session.episodeCount}
              {session.targetEpisodes && <span className="text-text-secondary">/{session.targetEpisodes}</span>}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-text-secondary uppercase tracking-wide">Avg Quality</p>
            <p className={`text-sm font-mono ${avgQuality >= 80 ? 'text-accent-green' : avgQuality >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {avgQuality}
            </p>
          </div>
          <button
            onClick={() => navigate('/collect')}
            className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs font-medium rounded-md border border-red-500/30 hover:bg-red-500/30 transition-colors"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 min-h-0">
        {/* Teleoperation panel */}
        <div className="flex-1 p-4 overflow-auto">
          <TeleoperationPanel
            session={session}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
            className="h-full"
          />
        </div>

        {/* Episode sidebar */}
        <div className="w-96 border-l border-surface-border bg-surface-elevated flex flex-col">
          <div className="px-4 py-3 border-b border-surface-border">
            <h2 className="text-sm font-semibold text-text-primary">Collected Episodes</h2>
            <p className="text-xs text-text-secondary mt-0.5">{episodes.length} episodes this session</p>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <EpisodeTable
              episodes={episodes}
              onSelect={(id) => navigate(`/episodes/${id}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
