import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalEpisodes: number;
  episodesToday: number;
  totalDatasets: number;
  datasetsThisWeek: number;
  totalStorage: string;
  avgQuality: number;
  systemHealth: ServiceStatus;
  services: { name: string; status: ServiceStatus; latency: string }[];
}

interface AdminActivity {
  id: string;
  action: string;
  detail: string;
  time: string;
}

type ServiceStatus = 'healthy' | 'degraded' | 'down';

function statusColor(status: ServiceStatus): string {
  switch (status) {
    case 'healthy': return 'bg-accent-green';
    case 'degraded': return 'bg-amber-500';
    case 'down': return 'bg-red-500';
  }
}

function statusTextColor(status: ServiceStatus): string {
  switch (status) {
    case 'healthy': return 'text-accent-green';
    case 'degraded': return 'text-amber-400';
    case 'down': return 'text-red-400';
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AdminPage() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/stats');
      return data.data ?? data;
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  const { data: activity, isLoading: activityLoading, isError: activityError } = useQuery<AdminActivity[]>({
    queryKey: ['admin', 'activity'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/activity');
      return data.data ?? data;
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Admin Dashboard</h1>
        <p className="text-sm text-text-secondary mt-0.5">Platform overview and system health</p>
      </div>

      {/* KPI Grid */}
      {statsLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : statsError || !stats ? (
        <div className="text-center py-10 text-red-400">Failed to load data</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Total Users" value={stats.totalUsers.toLocaleString()} sub={`${stats.activeToday} active today`} />
            <KpiCard title="Total Episodes" value={stats.totalEpisodes.toLocaleString()} sub={`+${stats.episodesToday.toLocaleString()} today`} />
            <KpiCard title="Total Datasets" value={stats.totalDatasets.toLocaleString()} sub={`+${stats.datasetsThisWeek} this week`} />
            <KpiCard title="Storage Used" value={stats.totalStorage} sub={`Avg quality: ${stats.avgQuality}`} />
          </div>

          {/* System Health Overview */}
          <div className="bg-surface-elevated border border-surface-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${statusColor(stats.systemHealth)}`} />
              <h2 className="text-sm font-semibold text-text-primary">
                System Health:{' '}
                <span className={`capitalize ${statusTextColor(stats.systemHealth)}`}>
                  {stats.systemHealth}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.services.map((svc) => (
                <div
                  key={svc.name}
                  className="flex items-center gap-3 bg-surface rounded-lg border border-surface-border p-3"
                >
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusColor(svc.status)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary font-medium">{svc.name}</p>
                    <p className={`text-xs capitalize ${statusTextColor(svc.status)}`}>{svc.status}</p>
                  </div>
                  <span className="text-xs text-text-secondary font-mono">{svc.latency}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Recent Admin Actions */}
      <div className="bg-surface-elevated border border-surface-border rounded-lg p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Recent Admin Activity</h2>
        {activityLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : activityError ? (
          <div className="text-center py-10 text-red-400">Failed to load data</div>
        ) : !activity?.length ? (
          <div className="text-center py-10 text-gray-400">No activity yet</div>
        ) : (
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-mid-blue mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs text-text-primary">{item.action}</p>
                  <p className="text-[10px] text-text-secondary">{item.detail} · {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component
// ---------------------------------------------------------------------------

function KpiCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="bg-surface-elevated border border-surface-border rounded-lg p-4">
      <p className="text-xs text-text-secondary">{title}</p>
      <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
      {sub && <p className="text-xs text-text-secondary mt-1">{sub}</p>}
    </div>
  );
}
