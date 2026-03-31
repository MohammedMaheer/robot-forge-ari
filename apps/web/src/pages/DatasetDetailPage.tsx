import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { EpisodeTable } from '@robotforge/ui';
import { apiClient } from '@/lib/api';
import { useNotifications } from '@/contexts/NotificationContext';
import type { Dataset, Episode, DatasetReview } from '@robotforge/types';

type Tab = 'overview' | 'episodes' | 'statistics' | 'reviews';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DatasetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const { push } = useNotifications();

  const { data: dataset, isLoading, isError } = useQuery<Dataset>({
    queryKey: ['dataset', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/marketplace/datasets/${id}`);
      return data.data ?? data;
    },
    staleTime: 30_000,
  });

  // Reviews and sample episodes are included in the dataset response (backend includes them)
  const episodes: Episode[] = (dataset as (Dataset & { sampleEpisodes?: Episode[] }) | undefined)?.sampleEpisodes ?? [];
  const reviews: DatasetReview[] = (dataset as (Dataset & { reviews?: DatasetReview[] }) | undefined)?.reviews ?? [];

  const addToCartMutation = useMutation({
    mutationFn: () => apiClient.post('/marketplace/cart', { datasetId: dataset!.id }),
    onSuccess: () => push('success', 'Added to cart!'),
    onError: () => push('error', 'Failed to add to cart', 'Please try again.'),
  });

  const purchaseMutation = useMutation({
    mutationFn: () => apiClient.post(`/marketplace/datasets/${id}/purchase`),
    onSuccess: (res) => {
      const url = res.data?.checkoutUrl ?? res.data?.data?.checkoutUrl;
      if (url) {
        window.location.href = url;
      } else {
        push('success', 'Purchase initiated!');
      }
    },
    onError: () => push('error', 'Purchase failed', 'Please try again.'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isError || !dataset) {
    return <div className="text-center py-10 text-red-400">Failed to load data</div>;
  }

  const priceDisplay = dataset.pricePerEpisode
    ? `$${(dataset.pricePerEpisode / 100).toFixed(2)}/episode`
    : 'Free';

  const totalPrice = dataset.pricePerEpisode
    ? `$${((dataset.pricePerEpisode * dataset.episodeCount) / 100).toFixed(0)} total`
    : 'Free';

  // Compute success rate from sample episodes or fall back to quality score
  const successRate = (() => {
    if (episodes.length > 0) {
      const successful = episodes.filter((e) => e.metadata?.successLabel === true).length;
      return `${Math.round((successful / episodes.length) * 100)}%`;
    }
    return `${dataset.qualityScore}%`;
  })();

  // Unique objects / category tags
  const uniqueObjects = (dataset as Dataset & { categoryTags?: string[] }).categoryTags?.length ?? 0;

  // Sensor modalities
  const sensorModalitiesCount = (dataset as Dataset & { sensorModalities?: string[] }).sensorModalities?.length ?? 0;

  // Compression ratio
  const compressionRatio = (dataset as Dataset & { compressionRatio?: number }).compressionRatio ?? null;

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
              {episodes.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No sample episodes available</div>
              ) : (
                <EpisodeTable
                  episodes={episodes}
                  onSelect={(epId) => navigate(`/episodes/${epId}`)}
                />
              )}
            </div>
          )}

          {tab === 'statistics' && (
            <div className="bg-surface-elevated border border-surface-border rounded-lg p-6 space-y-4">
              <h2 className="text-sm font-semibold text-text-primary">Dataset Statistics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatBlock label="Avg Episode Duration" value={`${((dataset.totalDurationHours * 3600) / dataset.episodeCount).toFixed(1)}s`} />
                <StatBlock label="Avg Quality Score" value={String(dataset.qualityScore)} />
                <StatBlock label="Success Rate" value={successRate} />
                <StatBlock label="Unique Objects" value={String(uniqueObjects)} />
                <StatBlock label="Sensor Modalities" value={String(sensorModalitiesCount)} />
                {compressionRatio !== null && (
                  <StatBlock label="Compression Ratio" value={`${compressionRatio}×`} />
                )}
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No reviews yet</div>
              ) : (
                reviews.map((review) => (
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
                ))
              )}
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

            <button
              onClick={() => addToCartMutation.mutate()}
              disabled={addToCartMutation.isPending}
              className="w-full py-2.5 bg-accent-green text-white text-sm font-bold rounded-md hover:bg-green-600 disabled:opacity-60 transition-colors">
              {addToCartMutation.isPending ? 'Adding…' : 'Add to Cart'}
            </button>
            <button
              onClick={() => purchaseMutation.mutate()}
              disabled={purchaseMutation.isPending}
              className="w-full py-2.5 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-blue-800 disabled:opacity-60 transition-colors">
              {purchaseMutation.isPending ? 'Processing…' : 'Purchase Now'}
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
