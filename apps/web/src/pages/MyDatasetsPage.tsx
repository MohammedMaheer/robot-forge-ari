import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DatasetCard } from '@robotforge/ui';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import type { Dataset } from '@robotforge/types';

// ---------------------------------------------------------------------------
// Fallback user datasets (used when API is unavailable)
// ---------------------------------------------------------------------------

const FALLBACK_DATASETS: Dataset[] = [
  {
    id: 'my-ds-1',
    name: 'UR5 Custom Grasping v1',
    description: 'Custom grasping demonstrations recorded in our lab for internal model training.',
    ownerId: 'user-1',
    task: 'bin_picking',
    embodiments: ['ur5'],
    episodeCount: 420,
    totalDurationHours: 8,
    sizeGb: 11,
    qualityScore: 88,
    format: 'robotforge_native',
    pricingTier: 'free',
    tags: ['internal', 'grasping'],
    downloads: 0,
    rating: 0,
    sampleEpisodes: [],
    accessLevel: 'private',
    licenseType: 'proprietary',
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-20'),
  },
  {
    id: 'my-ds-2',
    name: 'Franka Assembly Training Set',
    description: 'Assembly tasks for peg-in-hole training with Franka Panda.',
    ownerId: 'user-1',
    task: 'assembly',
    embodiments: ['franka_panda'],
    episodeCount: 1100,
    totalDurationHours: 22,
    sizeGb: 28,
    qualityScore: 91,
    format: 'lerobot_hdf5',
    pricingTier: 'starter',
    pricePerEpisode: 3,
    tags: ['assembly', 'panda'],
    downloads: 85,
    rating: 4.6,
    sampleEpisodes: [],
    accessLevel: 'public',
    licenseType: 'cc_by',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-02-22'),
  },
  {
    id: 'my-ds-3',
    name: 'Spot Nav Office Building',
    description: 'Indoor navigation dataset for Boston Dynamics Spot in office environments.',
    ownerId: 'user-1',
    task: 'navigation',
    embodiments: ['boston_dynamics_spot'],
    episodeCount: 650,
    totalDurationHours: 16,
    sizeGb: 42,
    qualityScore: 82,
    format: 'open_x_embodiment',
    pricingTier: 'professional',
    pricePerEpisode: 8,
    tags: ['navigation', 'indoor'],
    downloads: 34,
    rating: 4.2,
    sampleEpisodes: [],
    accessLevel: 'public',
    licenseType: 'cc_by_nc',
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-18'),
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MyDatasetsPage() {
  const { user } = useAuthStore();

  const { data: datasets = FALLBACK_DATASETS } = useQuery<Dataset[]>({
    queryKey: ['my-datasets', user?.id],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/marketplace/datasets/mine');
        return data.data ?? data;
      } catch {
        return FALLBACK_DATASETS;
      }
    },
    staleTime: 30_000,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">My Datasets</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Manage datasets you've created or published · {datasets.length} dataset{datasets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/datasets/new"
          className="px-4 py-2 bg-accent-green text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
        >
          + Create New Dataset
        </Link>
      </div>

      {datasets.length === 0 ? (
        <div className="bg-surface-elevated border border-surface-border rounded-lg p-12 text-center">
          <p className="text-text-secondary text-sm">You haven't created any datasets yet.</p>
          <Link
            to="/datasets/new"
            className="inline-block mt-4 px-4 py-2 bg-accent-green text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
          >
            Create Your First Dataset
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {datasets.map((ds) => (
            <DatasetCard
              key={ds.id}
              dataset={ds}
              onPreview={() => {
                window.location.href = `/marketplace/${ds.id}`;
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
