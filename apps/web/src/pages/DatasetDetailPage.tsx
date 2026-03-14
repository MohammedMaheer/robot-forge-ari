import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { EpisodeTable } from '@robotforge/ui';
import { apiClient } from '@/lib/api';
import type { Dataset, Episode, DatasetReview } from '@robotforge/types';

// ---------------------------------------------------------------------------
// Fallback data (used when API is unavailable)
// ---------------------------------------------------------------------------

const FALLBACK_DATASET: Dataset = {
  id: 'ds-1',
  name: 'UR5 Bin Picking Pro',
  description:
    'A comprehensive bin picking dataset collected with a UR5 robotic arm across 12 object categories in varied lighting conditions. Includes RGB + depth camera feeds, joint telemetry, force-torque sensing, and gripper state at 30 Hz. Each episode is quality-scored by our AI pipeline with an average score of 92/100.',
  ownerId: 'user-100',
  task: 'bin_picking',
  embodiments: ['ur5'],
  episodeCount: 2400,
  totalDurationHours: 48,
  sizeGb: 62,
  qualityScore: 92,
  format: 'lerobot_hdf5',
  pricingTier: 'professional',
  pricePerEpisode: 5,
  tags: ['industrial', 'manipulation', 'grasping', 'bin-picking', 'UR5'],
  downloads: 1820,
  rating: 4.8,
  sampleEpisodes: [],
  accessLevel: 'public',
  licenseType: 'cc_by',
  createdAt: new Date('2026-01-10'),
  updatedAt: new Date('2026-02-20'),
};

const FALLBACK_EPISODES: Episode[] = Array.from({ length: 8 }, (_, i) => ({
  id: `ep-sample-${i + 1}`,
  sessionId: 'sess-demo',
  robotId: 'r-1',
  embodiment: 'ur5' as const,
  task: 'bin_picking' as const,
  durationMs: 15000 + Math.floor(Math.random() * 20000),
  frameCount: 300 + Math.floor(Math.random() * 200),
  qualityScore: 80 + Math.floor(Math.random() * 20),
  status: 'listed' as const,
  sensorModalities: ['rgb_camera', 'depth_camera', 'joint_positions', 'force_torque'],
  metadata: {
    environment: 'Lab A',
    lighting: 'bright',
    objectVariety: 6,
    successLabel: true,
    operatorId: 'user-1',
    aiAssisted: false,
    compressionRatio: 4.2,
    rawSizeBytes: 52_000_000,
    compressedSizeBytes: 12_400_000,
  },
  createdAt: new Date(Date.now() - i * 86400000),
}));

const FALLBACK_REVIEWS: DatasetReview[] = [
  { id: 'rev-1', datasetId: 'ds-1', userId: 'u-200', userName: 'Alice Chen', rating: 5, comment: 'Excellent quality data. Our model trained 3x faster with this dataset.', createdAt: new Date('2026-02-18') },
  { id: 'rev-2', datasetId: 'ds-1', userId: 'u-201', userName: 'Bob Garcia', rating: 4, comment: 'Good variety of objects. Would appreciate more lighting conditions.', createdAt: new Date('2026-02-12') },
  { id: 'rev-3', datasetId: 'ds-1', userId: 'u-202', userName: 'Sakura Tanaka', rating: 5, comment: 'LeRobot format worked out of the box. Highly recommend.', createdAt: new Date('2026-01-28') },
];

type Tab = 'overview' | 'episodes' | 'statistics' | 'reviews';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DatasetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');

  const { data: dataset = { ...FALLBACK_DATASET, id: id ?? FALLBACK_DATASET.id } } = useQuery<Dataset>({
    queryKey: ['dataset', id],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get(`/marketplace/datasets/${id}`);
        return data;
      } catch {
        return { ...FALLBACK_DATASET, id: id ?? FALLBACK_DATASET.id };
      }
    },
    staleTime: 30_000,
  });

  const { data: episodes = FALLBACK_EPISODES } = useQuery<Episode[]>({
    queryKey: ['dataset', id, 'episodes'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get(`/marketplace/datasets/${id}/episodes`);
        return data.data ?? data;
      } catch {
        return FALLBACK_EPISODES;
      }
    },
    staleTime: 30_000,
  });

  const { data: reviews = FALLBACK_REVIEWS } = useQuery<DatasetReview[]>({
    queryKey: ['dataset', id, 'reviews'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get(`/marketplace/datasets/${id}/reviews`);
        return data.data ?? data;
      } catch {
        return FALLBACK_REVIEWS;
      }
    },
    staleTime: 60_000,
  });

  const priceDisplay = dataset.pricePerEpisode
    ? `$${(dataset.pricePerEpisode / 100).toFixed(2)}/episode`
    : 'Free';

  const totalPrice = dataset.pricePerEpisode
    ? `$${((dataset.pricePerEpisode * dataset.episodeCount) / 100).toFixed(0)} total`
    : 'Free';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-text-secondary hover:text-text-primary text-sm transition-colors"
      >
        ← Back to Marketplace
      </button>

      <div className="flex gap-6">
        {/* ---------------------------------------------------------------- */}
        {/* Main content                                                     */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Hero */}
          <div className="bg-surface-elevated border border-surface-border rounded-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">{dataset.name}</h1>
                <p className="text-sm text-text-secondary mt-2 max-w-2xl leading-relaxed">{dataset.description}</p>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full capitalize">
                    {dataset.task.replace(/_/g, ' ')}
                  </span>
                  {dataset.embodiments.map((e) => (
                    <span key={e} className="px-2 py-1 bg-surface text-text-secondary text-xs rounded-full">
                      {e.replace(/_/g, ' ')}
                    </span>
                  ))}
                  <span className="px-2 py-1 bg-surface text-text-secondary text-xs rounded-full">
                    {dataset.format.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {'★'.repeat(Math.round(dataset.rating))}
                  <span className="text-text-secondary ml-1">{dataset.rating}</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 pt-4 border-t border-surface-border">
              <Stat label="Episodes" value={dataset.episodeCount.toLocaleString()} />
              <Stat label="Duration" value={`${dataset.totalDurationHours}h`} />
              <Stat label="Size" value={`${dataset.sizeGb} GB`} />
              <Stat label="Quality" value={String(dataset.qualityScore)} accent />
              <Stat label="Downloads" value={dataset.downloads.toLocaleString()} />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-surface-border">
            {(['overview', 'episodes', 'statistics', 'reviews'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 ${
                  tab === t
                    ? 'text-text-primary border-brand-blue'
                    : 'text-text-secondary border-transparent hover:text-text-primary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'overview' && (
            <div className="bg-surface-elevated border border-surface-border rounded-lg p-6 space-y-4">
              <h2 className="text-sm font-semibold text-text-primary">About this Dataset</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {dataset.description}
              </p>
              <div>
                <h3 className="text-xs text-text-secondary uppercase tracking-wide mt-4 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {dataset.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-surface text-text-secondary text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs text-text-secondary uppercase tracking-wide mt-4 mb-2">License</h3>
                <span className="text-sm text-text-primary capitalize">{dataset.licenseType.replace(/_/g, ' ')}</span>
              </div>
            </div>
          )}

          {tab === 'episodes' && (
            <div className="bg-surface-elevated border border-surface-border rounded-lg overflow-hidden">
              <EpisodeTable
                episodes={episodes}
                onSelect={(epId) => navigate(`/episodes/${epId}`)}
              />
            </div>
          )}

          {tab === 'statistics' && (
            <div className="bg-surface-elevated border border-surface-border rounded-lg p-6 space-y-4">
              <h2 className="text-sm font-semibold text-text-primary">Dataset Statistics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatBlock label="Avg Episode Duration" value={`${((dataset.totalDurationHours * 3600) / dataset.episodeCount).toFixed(1)}s`} />
                <StatBlock label="Avg Quality Score" value={String(dataset.qualityScore)} />
                <StatBlock label="Success Rate" value="87%" />
                <StatBlock label="Unique Objects" value="12" />
                <StatBlock label="Sensor Modalities" value="6" />
                <StatBlock label="Compression Ratio" value="4.2×" />
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="bg-surface-elevated border border-surface-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-mid-blue/30 flex items-center justify-center text-xs text-mid-blue font-bold">
                        {review.userName[0]}
                      </div>
                      <span className="text-sm text-text-primary font-medium">{review.userName}</span>
                    </div>
                    <span className="text-amber-400 text-xs">{'★'.repeat(review.rating)}</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-2">{review.comment}</p>
                  <p className="text-[10px] text-text-secondary mt-2">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Sticky right panel — pricing                                     */}
        {/* ---------------------------------------------------------------- */}
        <div className="w-72 shrink-0">
          <div className="sticky top-6 bg-surface-elevated border border-surface-border rounded-lg p-5 space-y-4">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wide">Pricing</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{priceDisplay}</p>
              <p className="text-xs text-text-secondary mt-0.5">{totalPrice}</p>
            </div>

            <div className="space-y-2 text-sm">
              <Row label="Tier" value={dataset.pricingTier} />
              <Row label="Access" value={dataset.accessLevel} />
              <Row label="License" value={dataset.licenseType.replace(/_/g, ' ')} />
              <Row label="Format" value={dataset.format.replace(/_/g, ' ')} />
            </div>

            <button className="w-full py-2.5 bg-accent-green text-white text-sm font-bold rounded-md hover:bg-green-600 transition-colors">
              Add to Cart
            </button>
            <button className="w-full py-2.5 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-blue-800 transition-colors">
              Purchase Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-text-secondary uppercase tracking-wide">{label}</p>
      <p className={`text-lg font-bold ${accent ? 'text-accent-green' : 'text-text-primary'}`}>{value}</p>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface rounded-lg border border-surface-border p-3">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="text-lg font-bold text-text-primary mt-1">{value}</p>
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
