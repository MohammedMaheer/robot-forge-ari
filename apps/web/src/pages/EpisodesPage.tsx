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
  const { data: episodes, isLoading, isError } = useQuery<Episode[]>({
    queryKey: ['episodes', taskFilter, embodimentFilter, statusFilter],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (taskFilter) params.task = taskFilter;
      if (embodimentFilter) params.embodiment = embodimentFilter;
      if (statusFilter) params.status = statusFilter;
      const { data } = await apiClient.get('/collection/episodes', { params });
      return data.data ?? data;
    },
    staleTime: 15_000,
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
          {(episodes ?? []).length} episode{(episodes ?? []).length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-elevated border border-surface-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-mid-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-400">Failed to load data</div>
        ) : !episodes?.length ? (
          <div className="text-center py-10 text-gray-400">No episodes yet</div>
        ) : (
          <EpisodeTable episodes={episodes} onSelect={handleSelect} />
        )}
      </div>
    </div>
  );
}
