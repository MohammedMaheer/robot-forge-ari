import React, { useState, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Episode } from '@robotforge/types';
import { RobotViewer } from './RobotViewer';
import { cn } from '../utils/cn';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EpisodePlayerProps {
  episode: Episode;
  autoPlay?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Speed options
// ---------------------------------------------------------------------------

const SPEED_OPTIONS = [0.25, 0.5, 1, 2] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EpisodePlayer({ episode, autoPlay = false, className }: EpisodePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState<number>(1);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);

  const progress = episode.durationMs > 0 ? (currentTimeMs / episode.durationMs) * 100 : 0;

  // Animation loop
  const animationRef = React.useRef<number | null>(null);
  const lastFrameRef = React.useRef<number>(0);
  // Track current playback time in a ref so we can check it synchronously
  // inside the rAF callback without going through async React state.
  const currentTimeRef = React.useRef(0);

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastFrameRef.current) lastFrameRef.current = timestamp;
      const delta = (timestamp - lastFrameRef.current) * speed;
      lastFrameRef.current = timestamp;

      const next = currentTimeRef.current + delta;
      if (next >= episode.durationMs) {
        currentTimeRef.current = episode.durationMs;
        setCurrentTimeMs(episode.durationMs);
        setIsPlaying(false);
        return; // end reached — do NOT schedule next frame
      }

      currentTimeRef.current = next;
      setCurrentTimeMs(next);
      animationRef.current = requestAnimationFrame(animate);
    },
    [speed, episode.durationMs]
  );

  React.useEffect(() => {
    if (isPlaying) {
      lastFrameRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, animate]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock joint data for the graph area
  const graphData = useMemo(() => {
    const points = [];
    const frameCount = Math.min(episode.frameCount, 200);
    for (let i = 0; i < frameCount; i++) {
      points.push({
        frame: i,
        j0: Math.sin(i * 0.05) * 1.2,
        j1: Math.cos(i * 0.04) * 0.8,
        j2: Math.sin(i * 0.06 + 1) * 1.0,
        j3: Math.cos(i * 0.03 + 0.5) * 0.6,
      });
    }
    return points;
  }, [episode.frameCount]);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    currentTimeRef.current = value;
    setCurrentTimeMs(value);
  };

  return (
    <div className={cn('bg-surface-elevated rounded-lg border border-surface-border overflow-hidden', className)}>
      {/* Robot Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <RobotViewer urdfUrl="" height={320} />
        <div className="bg-surface flex items-center justify-center text-text-secondary text-sm p-4">
          <div className="text-center">
            <div className="w-full h-48 bg-surface-elevated rounded flex items-center justify-center mb-2">
              {episode.thumbnailUrl ? (
                <img src={episode.thumbnailUrl} alt="Camera feed" className="object-cover w-full h-full rounded" />
              ) : (
                <span className="text-text-secondary">Camera Feed</span>
              )}
            </div>
            <p className="text-xs text-text-secondary">
              {episode.embodiment} — {episode.task}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="px-4 py-3 border-t border-surface-border">
        <input
          type="range"
          min={0}
          max={episode.durationMs}
          value={currentTimeMs}
          onChange={handleScrub}
          className="w-full h-1.5 bg-surface rounded-full appearance-none cursor-pointer accent-mid-blue"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-text-secondary font-mono">{formatTime(currentTimeMs)}</span>
          <span className="text-xs text-text-secondary font-mono">{formatTime(episode.durationMs)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 px-4 py-2 border-t border-surface-border">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-3 py-1.5 bg-mid-blue text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <div className="flex gap-1">
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={cn(
                'px-2 py-1 rounded text-xs font-mono transition-colors',
                speed === s
                  ? 'bg-mid-blue text-white'
                  : 'bg-surface text-text-secondary hover:text-text-primary'
              )}
            >
              {s}x
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-text-secondary">
            Quality: <span className="text-accent-green font-medium">{episode.qualityScore}</span>/100
          </span>
          <span className="text-xs text-text-secondary">
            Frames: {episode.frameCount}
          </span>
        </div>
      </div>

      {/* Joint Position Graphs */}
      <div className="px-4 py-3 border-t border-surface-border">
        <p className="text-xs text-text-secondary mb-2 font-medium">Joint Positions</p>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="frame" tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 8 }}
              labelStyle={{ color: '#F8FAFC' }}
            />
            <Line type="monotone" dataKey="j0" stroke="#2563EB" dot={false} strokeWidth={1.5} />
            <Line type="monotone" dataKey="j1" stroke="#2ECC71" dot={false} strokeWidth={1.5} />
            <Line type="monotone" dataKey="j2" stroke="#F59E0B" dot={false} strokeWidth={1.5} />
            <Line type="monotone" dataKey="j3" stroke="#EF4444" dot={false} strokeWidth={1.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
