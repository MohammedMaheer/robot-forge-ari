import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DatasetCard } from '@robotforge/ui';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import type { Dataset } from '@robotforge/types';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MyDatasetsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: datasets, isLoading, isError } = useQuery<Dataset[]>({
    queryKey: ['my-datasets', user?.id],
    queryFn: async () => {
      const { data } = await apiClient.get('/marketplace/datasets/mine');
      return data.data ?? data;
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
            Manage datasets you've created or published · {(datasets ?? []).length} dataset{(datasets ?? []).length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/datasets/new"
          className="px-4 py-2 bg-accent-green text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
        >
          + Create New Dataset
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : isError ? (
        <div className="text-center py-10 text-red-400">Failed to load data</div>
      ) : !datasets?.length ? (
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
              onPreview={() => navigate(`/marketplace/${ds.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
