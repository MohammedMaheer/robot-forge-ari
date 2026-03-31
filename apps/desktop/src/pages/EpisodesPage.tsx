/**
 * EpisodesPage — Local episodes table
 *
 * Lists all locally stored episodes with search, filtering,
 * and delete capability.
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface LocalEpisode {
  id: string;
  session_id: string;
  task: string;
  status: string;
  duration_ms: number;
  quality_score: number | null;
  created_at: string;
  synced_at: string | null;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m === 0) return `${sec}s`;
  return `${m}m ${sec}s`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

const STATUS_COLORS: Record<string, string> = {
  recording: 'bg-warning',
  processing: 'bg-mid-blue',
  packaged: 'bg-accent-green',
  listed: 'bg-accent-green',
  failed: 'bg-error',
};

export function EpisodesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data: episodes = [], isLoading } = useQuery<LocalEpisode[]>({
    queryKey: ['episodes'],
    queryFn: () => window.electronAPI?.storage.getEpisodes() ?? Promise.resolve([]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      window.electronAPI?.storage.deleteEpisode(id) ?? Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
      setDeleteTarget(null);
    },
  });

  const confirmDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deleteMutation.mutate],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return episodes;
    const q = search.toLowerCase();
    return episodes.filter(
      (ep) =>
        ep.task.toLowerCase().includes(q) ||
        ep.id.toLowerCase().includes(q) ||
        ep.status.toLowerCase().includes(q),
    );
  }, [episodes, search]);

  return (
    <div className="min-h-screen bg-surface p-8 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Episodes</h1>
        <span className="text-sm text-text-secondary">{episodes.length} total</span>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by task, id, or status…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-md border border-surface-border bg-surface-elevated px-4 py-2 text-sm text-white placeholder:text-text-secondary focus:border-mid-blue focus:outline-none"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-sm text-text-secondary">Loading episodes…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-text-secondary">No episodes found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-surface-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-border bg-surface-elevated text-xs uppercase tracking-wider text-text-secondary">
              <tr>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Quality</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Synced</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((ep) => (
                <tr
                  key={ep.id}
                  onClick={() => navigate(`/episodes/${ep.id}`)}
                  className="cursor-pointer transition hover:bg-surface-elevated/60"
                >
                  <td className="px-4 py-3 font-medium">{ep.task.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 font-mono text-text-secondary">
                    {formatDuration(ep.duration_ms)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${STATUS_COLORS[ep.status] ?? 'bg-text-secondary'}`}
                      />
                      {ep.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {ep.quality_score != null ? `${ep.quality_score.toFixed(0)}%` : '—'}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{formatDate(ep.created_at)}</td>
                  <td className="px-4 py-3">
                    {ep.synced_at ? (
                      <span className="text-accent-green">✓ {formatDate(ep.synced_at)}</span>
                    ) : (
                      <span className="text-text-secondary">pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(ep.id);
                      }}
                      className="text-text-secondary transition hover:text-error"
                      title="Delete episode"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-lg border border-surface-border bg-surface-elevated p-6">
            <h3 className="mb-2 text-lg font-semibold">Delete Episode?</h3>
            <p className="mb-4 text-sm text-text-secondary">
              This will permanently remove the episode and its data from local storage.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-md px-4 py-2 text-sm text-text-secondary hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteTarget)}
                disabled={deleteMutation.isPending}
                className="rounded-md bg-error px-4 py-2 text-sm font-medium text-white transition hover:bg-error/80 disabled:opacity-40"
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
