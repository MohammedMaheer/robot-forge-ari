import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { EpisodePlayer } from '@robotforge/ui';
import { apiClient } from '@/lib/api';
import type { Episode } from '@robotforge/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EpisodeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: episode, isLoading, isError } = useQuery<Episode>({
    queryKey: ['episode', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/collection/episodes/${id}`);
      return data.data ?? data;
    },
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isError || !episode) {
    return <div className="text-center py-10 text-red-400">Failed to load data</div>;
  }

  const qualityColor =
    episode.qualityScore >= 80
      ? 'text-accent-green'
      : episode.qualityScore >= 50
        ? 'text-amber-400'
        : 'text-red-400';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-text-secondary hover:text-text-primary text-sm transition-colors"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            Episode <span className="font-mono">{episode.id}</span>
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {episode.task.replace(/_/g, ' ')} · {episode.embodiment.replace(/_/g, ' ')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player */}
        <div className="lg:col-span-2">
          <EpisodePlayer episode={episode} />
        </div>

        {/* Metadata sidebar */}
        <div className="space-y-4">
          {/* Quality */}
          <div className="bg-surface-elevated border border-surface-border rounded-lg p-4">
            <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Quality</h2>
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-bold ${qualityColor}`}>{episode.qualityScore}</span>
              <span className="text-xs text-text-secondary">/ 100</span>
            </div>
            {episode.metadata.successLabel !== null && (
              <p className={`text-xs mt-2 ${episode.metadata.successLabel ? 'text-accent-green' : 'text-red-400'}`}>
                {episode.metadata.successLabel ? '✓ Task succeeded' : '✗ Task failed'}
              </p>
            )}
          </div>

          {/* Robot Info */}
          <div className="bg-surface-elevated border border-surface-border rounded-lg p-4">
            <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Robot Info</h2>
            <div className="space-y-2 text-sm">
              <Row label="Robot ID" value={episode.robotId} />
              <Row label="Embodiment" value={episode.embodiment.replace(/_/g, ' ')} />
              <Row label="Task" value={episode.task.replace(/_/g, ' ')} />
              <Row label="Environment" value={episode.metadata.environment} />
              <Row label="Lighting" value={episode.metadata.lighting} />
              <Row label="Object Variety" value={String(episode.metadata.objectVariety)} />
              <Row label="AI Assisted" value={episode.metadata.aiAssisted ? 'Yes' : 'No'} />
            </div>
          </div>

          {/* Sensor Modalities */}
          <div className="bg-surface-elevated border border-surface-border rounded-lg p-4">
            <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Sensors</h2>
            <div className="flex flex-wrap gap-1.5">
              {episode.sensorModalities.map((s) => (
                <span
                  key={s}
                  className="px-2 py-1 bg-mid-blue/20 text-mid-blue text-[10px] rounded-full font-medium"
                >
                  {s.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Storage & Timestamps */}
          <div className="bg-surface-elevated border border-surface-border rounded-lg p-4">
            <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Storage</h2>
            <div className="space-y-2 text-sm">
              <Row label="Raw Size" value={formatBytes(episode.metadata.rawSizeBytes)} />
              <Row label="Compressed" value={formatBytes(episode.metadata.compressedSizeBytes)} />
              <Row label="Compression" value={`${episode.metadata.compressionRatio.toFixed(1)}×`} />
              <Row label="Frames" value={String(episode.frameCount)} />
              <Row label="Duration" value={`${(episode.durationMs / 1000).toFixed(1)}s`} />
            </div>
          </div>

          <div className="bg-surface-elevated border border-surface-border rounded-lg p-4">
            <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Timestamps</h2>
            <div className="space-y-2 text-sm">
              <Row label="Created" value={formatDate(episode.createdAt)} />
              <Row label="Session" value={episode.sessionId} />
              <Row label="Status" value={episode.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary capitalize">{value}</span>
    </div>
  );
}
