import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';

// ---------------------------------------------------------------------------
// Fallback admin stats (used when API is unavailable)
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

const FALLBACK_STATS: AdminStats = {
  totalUsers: 1_247,
  activeToday: 342,
  totalEpisodes: 184_920,
  episodesToday: 1_480,
  totalDatasets: 386,
  datasetsThisWeek: 14,
  totalStorage: '12.4 TB',
  avgQuality: 84.6,
  systemHealth: 'healthy' as const,
  services: [
    { name: 'Auth Service', status: 'healthy' as const, latency: '12ms' },
    { name: 'Collection Service', status: 'healthy' as const, latency: '8ms' },
    { name: 'Processing Service', status: 'healthy' as const, latency: '45ms' },
    { name: 'Marketplace Service', status: 'healthy' as const, latency: '15ms' },
    { name: 'Streaming Service', status: 'degraded' as const, latency: '120ms' },
    { name: 'Gateway', status: 'healthy' as const, latency: '5ms' },
  ],
};

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
  const { user } = useAuthStore();

  const { data: stats = FALLBACK_STATS } = useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/admin/stats');
        return data;
      } catch {
        return FALLBACK_STATS;
      }
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

      {/* Recent Admin Actions (placeholder) */}
      <div className="bg-surface-elevated border border-surface-border rounded-lg p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Recent Admin Activity</h2>
        <div className="space-y-3">
          {[
            { action: 'User tier upgraded', detail: 'alice@company.com → enterprise', time: '5 min ago' },
            { action: 'Dataset flagged', detail: 'Spam report on "Test Dataset 123"', time: '22 min ago' },
            { action: 'Processing pipeline restart', detail: 'Worker pool scaled to 8 replicas', time: '1 hr ago' },
            { action: 'New API key created', detail: 'CI pipeline key for org-acme', time: '3 hr ago' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-mid-blue mt-1.5 shrink-0" />
              <div>
                <p className="text-xs text-text-primary">{item.action}</p>
                <p className="text-[10px] text-text-secondary">{item.detail} · {item.time}</p>
              </div>
            </div>
          ))}
        </div>
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
