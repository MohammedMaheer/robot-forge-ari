import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type {
  FleetStatus,
  FleetRobot,
  Ros2NodeStatus,
  Ros2TopicInfo,
} from '@robotforge/types';

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'connected'
      ? 'bg-accent-green/20 text-accent-green'
      : status === 'recording'
        ? 'bg-red-500/20 text-red-400'
        : status === 'error'
          ? 'bg-red-500/20 text-red-400'
          : 'bg-gray-500/20 text-gray-400';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'connected' ? 'bg-accent-green' : status === 'recording' ? 'bg-red-500 animate-pulse' : status === 'error' ? 'bg-red-500' : 'bg-gray-500'}`} />
      {status}
    </span>
  );
}

function ControllerBadge({ state }: { state: string }) {
  const cls =
    state === 'active'
      ? 'bg-accent-green/20 text-accent-green'
      : state === 'inactive'
        ? 'bg-amber-500/20 text-amber-400'
        : 'bg-gray-500/20 text-gray-400';
  return <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${cls}`}>{state}</span>;
}

// ---------------------------------------------------------------------------
// Topic table
// ---------------------------------------------------------------------------

function TopicTable({ topics }: { topics: Ros2TopicInfo[] }) {
  if (topics.length === 0) {
    return <p className="text-xs text-text-secondary italic">No topics discovered</p>;
  }
  return (
    <div className="max-h-48 overflow-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-text-secondary border-b border-surface-border">
            <th className="text-left py-1 pr-3 font-medium">Topic</th>
            <th className="text-left py-1 pr-3 font-medium">Type</th>
            <th className="text-right py-1 font-medium">Hz</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((t) => (
            <tr key={t.name} className="border-b border-surface-border/50">
              <td className="py-1 pr-3 font-mono text-text-primary">{t.name}</td>
              <td className="py-1 pr-3 text-text-secondary">{t.messageType}</td>
              <td className="py-1 text-right text-text-secondary">{t.hz?.toFixed(1) ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Robot detail card
// ---------------------------------------------------------------------------

function RobotCard({ robot, expanded, onToggle }: { robot: FleetRobot; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="bg-surface-elevated border border-surface-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${robot.connectionType === 'ros2' ? 'bg-mid-blue/20' : 'bg-surface'}`}>
            🤖
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{robot.name}</p>
            <p className="text-xs text-text-secondary">
              {robot.embodiment.replace(/_/g, ' ')} · {robot.connectionType.toUpperCase()}
              {robot.namespace && <span className="font-mono ml-1 text-mid-blue">{robot.namespace}</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={robot.status} />
          <svg
            className={`w-4 h-4 text-text-secondary transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && robot.ros2Status && (
        <div className="px-4 pb-4 space-y-3 border-t border-surface-border">
          {/* Node health */}
          <div className="grid grid-cols-3 gap-3 pt-3">
            <div className="bg-surface rounded p-2.5">
              <p className="text-[10px] text-text-secondary uppercase tracking-wider">Node</p>
              <p className={`text-sm font-medium ${robot.ros2Status.nodeActive ? 'text-accent-green' : 'text-red-400'}`}>
                {robot.ros2Status.nodeActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="bg-surface rounded p-2.5">
              <p className="text-[10px] text-text-secondary uppercase tracking-wider">Controller</p>
              <ControllerBadge state={robot.ros2Status.controllerState} />
            </div>
            <div className="bg-surface rounded p-2.5">
              <p className="text-[10px] text-text-secondary uppercase tracking-wider">DDS</p>
              <p className={`text-sm font-medium ${robot.ros2Status.ddsConnected ? 'text-accent-green' : 'text-red-400'}`}>
                {robot.ros2Status.ddsConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>

          {/* Last heartbeat */}
          {robot.ros2Status.lastHeartbeat && (
            <p className="text-[10px] text-text-secondary">
              Last heartbeat: {new Date(robot.ros2Status.lastHeartbeat).toLocaleTimeString()}
            </p>
          )}

          {/* Topics */}
          <div>
            <p className="text-xs font-medium text-text-secondary mb-1">
              Discovered Topics ({robot.ros2Status.topics.length})
            </p>
            <TopicTable topics={robot.ros2Status.topics} />
          </div>
        </div>
      )}

      {expanded && !robot.ros2Status && (
        <div className="px-4 pb-4 border-t border-surface-border pt-3">
          <p className="text-xs text-text-secondary italic">
            No ROS 2 status available — robot may use a non-ROS connection type
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function FleetPage() {
  const [expandedRobotId, setExpandedRobotId] = useState<string | null>(null);
  const [namespaceFilter, setNamespaceFilter] = useState<string>('');

  // Fetch fleet status
  const { data: fleet, isLoading, isError } = useQuery<FleetStatus>({
    queryKey: ['fleet', 'status'],
    queryFn: async () => {
      const { data } = await apiClient.get('/collection/fleet/status');
      return data.data ?? data;
    },
    refetchInterval: 5_000,
    staleTime: 3_000,
  });

  const filteredRobots = (fleet?.robots ?? []).filter(
    (r) => !namespaceFilter || r.namespace.includes(namespaceFilter)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Fleet Management</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            ROS 2 DDS graph discovery and robot node monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${fleet?.ddsGraphHealthy ? 'bg-accent-green/20 text-accent-green border border-accent-green/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            <span className={`w-2 h-2 rounded-full ${fleet?.ddsGraphHealthy ? 'bg-accent-green' : 'bg-red-500'}`} />
            DDS Graph {fleet?.ddsGraphHealthy ? 'Healthy' : 'Unhealthy'}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-surface-elevated border border-surface-border rounded-lg p-4">
          <p className="text-xs text-text-secondary uppercase tracking-wider">Total Robots</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{fleet?.totalRobots ?? 0}</p>
        </div>
        <div className="bg-surface-elevated border border-surface-border rounded-lg p-4">
          <p className="text-xs text-text-secondary uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-accent-green mt-1">{fleet?.activeRobots ?? 0}</p>
        </div>
        <div className="bg-surface-elevated border border-surface-border rounded-lg p-4">
          <p className="text-xs text-text-secondary uppercase tracking-wider">Namespaces</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{fleet?.namespaces?.length ?? 0}</p>
        </div>
        <div className="bg-surface-elevated border border-surface-border rounded-lg p-4">
          <p className="text-xs text-text-secondary uppercase tracking-wider">DDS Status</p>
          <p className={`text-2xl font-bold mt-1 ${fleet?.ddsGraphHealthy ? 'text-accent-green' : 'text-red-400'}`}>
            {fleet?.ddsGraphHealthy ? '●' : '○'}
          </p>
        </div>
      </div>

      {/* Namespace filter */}
      {(fleet?.namespaces?.length ?? 0) > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Filter by namespace:</span>
          <button
            onClick={() => setNamespaceFilter('')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${!namespaceFilter ? 'bg-mid-blue text-white' : 'bg-surface-elevated text-text-secondary border border-surface-border hover:text-text-primary'}`}
          >
            All
          </button>
          {fleet?.namespaces?.map((ns) => (
            <button
              key={ns}
              onClick={() => setNamespaceFilter(ns)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${namespaceFilter === ns ? 'bg-mid-blue text-white' : 'bg-surface-elevated text-text-secondary border border-surface-border hover:text-text-primary'}`}
            >
              {ns}
            </button>
          ))}
        </div>
      )}

      {/* Robot list */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : isError ? (
        <div className="text-center py-10">
          <p className="text-red-400">Failed to load fleet status</p>
          <p className="text-xs text-text-secondary mt-1">Ensure the collection-service is running with rclpy</p>
        </div>
      ) : filteredRobots.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          {namespaceFilter ? 'No robots in this namespace' : 'No robots discovered on the DDS graph'}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredRobots.map((robot) => (
            <RobotCard
              key={robot.robotId}
              robot={robot}
              expanded={expandedRobotId === robot.robotId}
              onToggle={() => setExpandedRobotId(expandedRobotId === robot.robotId ? null : robot.robotId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
