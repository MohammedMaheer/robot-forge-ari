import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';

interface DashboardKpis {
  totalEpisodes: number;
  storageUsedGb: number;
  storageQuotaGb: number;
  activeRobots: number;
  avgQuality: number;
  weeklyGrowth: string;
}

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  time: string;
}

function KpiCard({ title, value, sub, trend }: { title: string; value: string; sub?: string; trend?: string }) {
  return (
    <div className="bg-surface-elevated border border-surface-border rounded-lg p-4">
      <p className="text-xs text-text-secondary">{title}</p>
      <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
      <div className="flex items-center gap-2 mt-1">
        {sub && <span className="text-xs text-text-secondary">{sub}</span>}
        {trend && <span className="text-xs text-accent-green">{trend}</span>}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuthStore();

  // ── Fetch KPIs from API ───────────────────────────────
  const { data: kpis, isLoading: kpisLoading, isError: kpisError } = useQuery<DashboardKpis>({
    queryKey: ['dashboard', 'kpis'],
    queryFn: async () => {
      const { data } = await apiClient.get('/collection/dashboard/kpis');
      return data.data;
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  // ── Fetch recent activity ─────────────────────────────
  const { data: activity, isLoading: activityLoading, isError: activityError } = useQuery<ActivityItem[]>({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => {
      const { data } = await apiClient.get('/collection/dashboard/activity');
      return data.data;
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  // ── Fetch efficiency chart data ───────────────────────
  const { data: efficiency } = useQuery({
    queryKey: ['dashboard', 'efficiency'],
    queryFn: async () => {
      const { data } = await apiClient.get('/collection/dashboard/efficiency');
      return data.data;
    },
    staleTime: 60_000,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">
          Welcome back, {user?.name?.split(' ')[0] ?? 'Operator'}
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">Here's your Physical AI data overview</p>
      </div>

      {/* KPI Grid */}
      {kpisLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : kpisError ? (
        <div className="text-center py-10 text-red-400">Failed to load data</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Episodes Collected"
            value={(kpis?.totalEpisodes ?? 0).toLocaleString()}
            trend={`${kpis?.weeklyGrowth ?? '+0%'} vs last week`}
          />
          <KpiCard
            title="Storage Used"
            value={`${kpis?.storageUsedGb ?? 0} GB`}
            sub={`of ${kpis?.storageQuotaGb ?? 500} GB quota`}
          />
          <KpiCard title="Active Robots" value={String(kpis?.activeRobots ?? 0)} sub="connected now" />
          <KpiCard title="Avg Quality Score" value={String(kpis?.avgQuality ?? 0)} sub="out of 100" />
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/collect"
          className="px-4 py-2 bg-accent-green text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
        >
          ▶ Start Collection
        </Link>
        <Link
          to="/marketplace"
          className="px-4 py-2 bg-mid-blue text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
        >
          🏪 Browse Marketplace
        </Link>
        <Link
          to="/datasets/new"
          className="px-4 py-2 bg-surface-elevated text-text-primary text-sm font-medium rounded-md border border-surface-border hover:bg-surface transition-colors"
        >
          📤 Upload Dataset
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Efficiency Chart */}
        <div className="lg:col-span-2 bg-surface-elevated border border-surface-border rounded-lg p-4">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Collection Efficiency (episodes/day)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={efficiency ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#F8FAFC' }}
              />
              <Area type="monotone" dataKey="episodes" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface-elevated border border-surface-border rounded-lg p-4">
          <h2 className="text-sm font-semibold text-text-primary mb-3">Recent Activity</h2>
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
              {activity.map((a) => (
                <div key={a.id} className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-mid-blue mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs text-text-primary">{a.message}</p>
                    <p className="text-[10px] text-text-secondary">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
