import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { EpisodeTable } from '@robotforge/ui';
import { apiClient } from '@/lib/api';
import type { Episode, RobotTask, RobotEmbodiment, EpisodeStatus } from '@robotforge/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TASKS: RobotTask[] = [
  'bin_picking', 'assembly', 'packing', 'palletizing',
  'navigation', 'inspection', 'manipulation', 'whole_body_loco',
];

const EMBODIMENTS: RobotEmbodiment[] = [
  'ur5', 'franka_panda', 'xarm6', 'unitree_h1', 'boston_dynamics_spot',
];

const STATUSES: EpisodeStatus[] = ['recording', 'processing', 'packaged', 'listed', 'failed'];

// Fallback data when API is unavailable
const FALLBACK_EPISODES: Episode[] = Array.from({ length: 24 }, (_, i) => ({
  id: `ep-${1000 + i}`,
  sessionId: `sess-${Math.floor(i / 4) + 1}`,
  robotId: `r-${(i % 3) + 1}`,
  embodiment: EMBODIMENTS[i % EMBODIMENTS.length],
  task: TASKS[i % TASKS.length],
  durationMs: 10000 + Math.floor(Math.random() * 30000),
  frameCount: 200 + Math.floor(Math.random() * 500),
  qualityScore: 55 + Math.floor(Math.random() * 45),
  status: i < 20 ? 'packaged' : STATUSES[i % STATUSES.length],
  sensorModalities: ['rgb_camera', 'joint_positions', 'end_effector_pose'],
  thumbnailUrl: undefined,
  metadata: {
    environment: 'lab',
    lighting: 'bright',
    objectVariety: 3 + (i % 5),
    successLabel: i % 5 !== 0 ? true : null,
    operatorId: 'user-1',
    aiAssisted: i % 3 === 0,
    compressionRatio: 3.5 + Math.random(),
    rawSizeBytes: 40_000_000 + Math.floor(Math.random() * 20_000_000),
    compressedSizeBytes: 10_000_000 + Math.floor(Math.random() * 5_000_000),
  },
  createdAt: new Date(Date.now() - i * 3600 * 1000),
}));

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EpisodesPage() {
  const navigate = useNavigate();

  // Filters
  const [taskFilter, setTaskFilter] = useState<RobotTask | ''>('');
  const [embodimentFilter, setEmbodimentFilter] = useState<RobotEmbodiment | ''>('');
  const [statusFilter, setStatusFilter] = useState<EpisodeStatus | ''>('');

  // ── Fetch episodes from API with server-side filter ───
  const { data: episodes = FALLBACK_EPISODES, isLoading } = useQuery<Episode[]>({
    queryKey: ['episodes', taskFilter, embodimentFilter, statusFilter],
    queryFn: async () => {
      try {
        const params: Record<string, string> = {};
        if (taskFilter) params.task = taskFilter;
        if (embodimentFilter) params.embodiment = embodimentFilter;
        if (statusFilter) params.status = statusFilter;
        const { data } = await apiClient.get('/collection/episodes', { params });
        return data.data ?? data;
      } catch {
        // Graceful fallback to local data when API unavailable
        return FALLBACK_EPISODES;
      }
    },
    staleTime: 15_000,
  });

  const filteredEpisodes = episodes.filter((ep) => {
    if (taskFilter && ep.task !== taskFilter) return false;
    if (embodimentFilter && ep.embodiment !== embodimentFilter) return false;
    if (statusFilter && ep.status !== statusFilter) return false;
    return true;
  });

  const handleSelect = (id: string) => {
    navigate(`/episodes/${id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Episodes</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Browse and manage collected robot episodes
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 bg-surface-elevated border border-surface-border rounded-lg p-4">
        <div>
          <label className="block text-[10px] text-text-secondary uppercase tracking-wide mb-1">Task</label>
          <select
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value as RobotTask | '')}
            className="bg-surface border border-surface-border rounded-md px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-mid-blue transition-colors"
          >
            <option value="">All Tasks</option>
            {TASKS.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-text-secondary uppercase tracking-wide mb-1">Embodiment</label>
          <select
            value={embodimentFilter}
            onChange={(e) => setEmbodimentFilter(e.target.value as RobotEmbodiment | '')}
            className="bg-surface border border-surface-border rounded-md px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-mid-blue transition-colors"
          >
            <option value="">All Robots</option>
            {EMBODIMENTS.map((e) => (
              <option key={e} value={e}>{e.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-text-secondary uppercase tracking-wide mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EpisodeStatus | '')}
            className="bg-surface border border-surface-border rounded-md px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-mid-blue transition-colors"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-xs text-text-secondary self-end pb-1">
          {filteredEpisodes.length} episode{filteredEpisodes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-elevated border border-surface-border rounded-lg overflow-hidden">
        <EpisodeTable episodes={filteredEpisodes} onSelect={handleSelect} />
      </div>
    </div>
  );
}
