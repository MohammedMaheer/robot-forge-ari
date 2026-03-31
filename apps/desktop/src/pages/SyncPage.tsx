/**
 * SyncPage — Sync management dashboard
 *
 * Shows storage statistics, the sync queue, and lets the
 * operator trigger cloud syncing.
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatBytes } from '@robotforge/utils';

interface StorageStats {
  totalEpisodes: number;
  pendingSync: number;
  diskUsageMb: number;
}

interface SyncQueueItem {
  id: number;
  episode_id: string;
  status: string;
  retries: number;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

interface SyncResult {
  syncedCount: number;
  failedCount: number;
  errors: string[];
}

export function SyncPage() {
  const queryClient = useQueryClient();

  const { data: stats } = useQuery<StorageStats>({
    queryKey: ['storage:stats'],
    queryFn: () =>
      window.electronAPI?.storage.getStorageStats() ??
      Promise.resolve({ totalEpisodes: 0, pendingSync: 0, diskUsageMb: 0 }),
    refetchInterval: 5000,
  });

  const { data: queue = [] } = useQuery<SyncQueueItem[]>({
    queryKey: ['storage:sync-queue'],
    queryFn: () => window.electronAPI?.storage.getSyncQueue() ?? Promise.resolve([]),
    refetchInterval: 3000,
  });

  const syncMutation = useMutation<SyncResult>({
    mutationFn: () =>
      window.electronAPI?.storage.triggerSync() ??
      Promise.resolve({ synced: 0, failed: 0, remaining: 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storage:stats'] });
      queryClient.invalidateQueries({ queryKey: ['storage:sync-queue'] });
    },
  });

  const handleSync = useCallback(() => {
    syncMutation.mutate();
  }, [syncMutation]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-warning';
      case 'uploading':
        return 'text-mid-blue';
      case 'completed':
        return 'text-accent-green';
      case 'failed':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-surface p-8 text-white">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Sync</h1>

      {/* Storage stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Episodes" value={String(stats?.totalEpisodes ?? 0)} />
        <StatCard label="Pending Sync" value={String(stats?.pendingSync ?? 0)} />
        <StatCard
          label="Disk Usage"
          value={formatBytes((stats?.diskUsageMb ?? 0) * 1024 * 1024)}
        />
      </div>

      {/* Sync action */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={handleSync}
          disabled={syncMutation.isPending}
          className="rounded-lg bg-mid-blue px-6 py-3 font-semibold text-white transition hover:bg-mid-blue/80 disabled:opacity-40"
        >
          {syncMutation.isPending ? 'Syncing…' : 'Sync Now'}
        </button>

        {syncMutation.data && (
          <div className="flex gap-4 text-sm">
            <span className="text-accent-green">
              ✓ {syncMutation.data.syncedCount} synced
            </span>
            {syncMutation.data.failedCount > 0 && (
              <span className="text-error">✕ {syncMutation.data.failedCount} failed</span>
            )}
          </div>
        )}
      </div>

      {/* Sync queue */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-text-secondary">Sync Queue</h2>

        {queue.length === 0 ? (
          <p className="text-sm text-text-secondary">No items in queue — all synced!</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-surface-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-surface-border bg-surface-elevated text-xs uppercase tracking-wider text-text-secondary">
                <tr>
                  <th className="px-4 py-3">Episode</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Retries</th>
                  <th className="px-4 py-3">Last Error</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {queue.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-elevated/60 transition">
                    <td className="px-4 py-3 font-mono text-xs">{item.episode_id}</td>
                    <td className={`px-4 py-3 font-medium ${statusColor(item.status)}`}>
                      {item.status}
                    </td>
                    <td className="px-4 py-3 font-mono">{item.retries}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-text-secondary" title={item.last_error ?? ''}>
                      {item.last_error ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(item.updated_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-elevated p-4">
      <p className="text-xs uppercase tracking-wider text-text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
