/**
 * EpisodeDetailPage — Single episode detail view
 *
 * Shows metadata, duration, task, sensor modalities, and
 * provides a download/export action.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface LocalEpisode {
  id: string;
  session_id: string;
  robot_id: string | null;
  task: string;
  embodiment: string | null;
  status: string;
  duration_ms: number;
  quality_score: number | null;
  sensor_modalities: string | null;
  metadata: string | null;
  hdf5_path: string | null;
  created_at: string;
  synced_at: string | null;
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

const STATUS_COLORS: Record<string, string> = {
  recording: 'text-warning',
  processing: 'text-mid-blue',
  packaged: 'text-accent-green',
  listed: 'text-accent-green',
  failed: 'text-error',
};

export function EpisodeDetailPage() {
  const { episodeId: id } = useParams<{ episodeId: string }>();
  const navigate = useNavigate();

  const { data: episode, isLoading } = useQuery<LocalEpisode | null>({
    queryKey: ['episode', id],
    queryFn: () => window.electronAPI?.storage.getEpisode(id!) ?? Promise.resolve(null),
    enabled: !!id,
  });

  const sensorModalities: string[] = (() => {
    if (!episode?.sensor_modalities) return [];
    try {
      return JSON.parse(episode.sensor_modalities);
    } catch {
      return [];
    }
  })();

  const metadata: Record<string, unknown> = (() => {
    if (!episode?.metadata) return {};
    try {
      return JSON.parse(episode.metadata);
    } catch {
      return {};
    }
  })();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface p-8 text-white">
        <p className="text-text-secondary">Loading episode…</p>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-surface p-8 text-white">
        <p className="text-text-secondary">Episode not found.</p>
        <button
          onClick={() => navigate('/episodes')}
          className="mt-4 text-mid-blue hover:underline"
        >
          ← Back to episodes
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-8 text-white">
      {/* Back nav */}
      <button
        onClick={() => navigate('/episodes')}
        className="mb-6 text-sm text-text-secondary transition hover:text-white"
      >
        ← Back to episodes
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{episode.task.replace(/_/g, ' ')}</h1>
          <p className="mt-1 font-mono text-sm text-text-secondary">{episode.id}</p>
        </div>
        <span className={`text-sm font-semibold ${STATUS_COLORS[episode.status] ?? 'text-text-secondary'}`}>
          {episode.status}
        </span>
      </div>

      {/* Info grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <InfoCard label="Duration" value={formatDuration(episode.duration_ms)} />
        <InfoCard label="Session" value={episode.session_id} mono />
        <InfoCard label="Robot" value={episode.robot_id ?? '—'} mono />
        <InfoCard label="Embodiment" value={episode.embodiment ?? '—'} />
        <InfoCard
          label="Quality"
          value={episode.quality_score != null ? `${episode.quality_score.toFixed(0)}%` : '—'}
        />
        <InfoCard
          label="Created"
          value={new Date(episode.created_at).toLocaleString()}
        />
        <InfoCard
          label="Synced"
          value={episode.synced_at ? new Date(episode.synced_at).toLocaleString() : 'Not synced'}
        />
        <InfoCard label="HDF5 Path" value={episode.hdf5_path ?? '—'} mono />
      </div>

      {/* Sensor modalities */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Sensor Modalities
        </h2>
        {sensorModalities.length === 0 ? (
          <p className="text-sm text-text-secondary">None recorded.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sensorModalities.map((mod) => (
              <span
                key={mod}
                className="rounded-md border border-surface-border bg-surface-elevated px-3 py-1 font-mono text-xs text-text-secondary"
              >
                {mod}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Metadata */}
      {Object.keys(metadata).length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Metadata
          </h2>
          <pre className="overflow-x-auto rounded-lg border border-surface-border bg-surface-elevated p-4 font-mono text-xs text-text-secondary">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </section>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          className="rounded-lg bg-mid-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-mid-blue/80"
          onClick={() => {
            // Placeholder: export/download
            console.log('Export episode', episode.id);
          }}
        >
          Export / Download
        </button>
      </div>
    </div>
  );
}

function InfoCard({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-elevated p-4">
      <p className="text-xs uppercase tracking-wider text-text-secondary">{label}</p>
      <p className={`mt-1 truncate text-sm ${mono ? 'font-mono' : ''}`} title={value}>
        {value}
      </p>
    </div>
  );
}
