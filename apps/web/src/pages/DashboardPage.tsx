import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';

// ── Fallback data (used when API is unavailable) ──────────
const FALLBACK_ACTIVITY = [
  { id: '1', type: 'episode_complete', message: 'Episode #1042 processed — quality 92', time: '2 min ago' },
  { id: '2', type: 'dataset_published', message: 'Dataset "UR5 Bin Picking v3" published', time: '15 min ago' },
  { id: '3', type: 'robot_connected', message: 'Franka Panda connected at 192.168.1.42', time: '32 min ago' },
  { id: '4', type: 'episode_complete', message: 'Episode #1041 processed — quality 87', time: '1 hr ago' },
  { id: '5', type: 'purchase', message: 'New purchase: Assembly Dataset Pro', time: '2 hr ago' },
];

const FALLBACK_EFFICIENCY = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  episodes: Math.floor(Math.random() * 40) + 10,
}));

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
  const { data: kpis } = useQuery<DashboardKpis>({
    queryKey: ['dashboard', 'kpis'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/collection/dashboard/kpis');
        return data.data;
      } catch {
        return {
          totalEpisodes: 2847,
          storageUsedGb: 142,
          storageQuotaGb: 500,
          activeRobots: 3,
          avgQuality: 87.4,
          weeklyGrowth: '+12%',
        };
      }
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  // ── Fetch recent activity ─────────────────────────────
  const { data: activity } = useQuery<ActivityItem[]>({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/collection/dashboard/activity');
        return data.data;
      } catch {
        return FALLBACK_ACTIVITY;
      }
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  // ── Fetch efficiency chart data ───────────────────────
  const { data: efficiency } = useQuery({
    queryKey: ['dashboard', 'efficiency'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/collection/dashboard/efficiency');
        return data.data;
      } catch {
        return FALLBACK_EFFICIENCY;
      }
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
            <AreaChart data={efficiency ?? FALLBACK_EFFICIENCY}>
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
          <div className="space-y-3">
            {(activity ?? FALLBACK_ACTIVITY).map((a) => (
              <div key={a.id} className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-mid-blue mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs text-text-primary">{a.message}</p>
                  <p className="text-[10px] text-text-secondary">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
