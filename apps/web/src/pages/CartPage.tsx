import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { CartItem, Dataset } from '@robotforge/types';

// ---------------------------------------------------------------------------
// Fallback cart items (used while API is loading / unavailable)
// ---------------------------------------------------------------------------

function makeDataset(overrides: Partial<Dataset> & { id: string; name: string }): Dataset {
  return {
    description: '',
    ownerId: 'user-100',
    task: 'bin_picking',
    embodiments: ['ur5'],
    episodeCount: 1000,
    totalDurationHours: 20,
    sizeGb: 30,
    qualityScore: 85,
    format: 'lerobot_hdf5',
    pricingTier: 'professional',
    pricePerEpisode: 5,
    tags: [],
    downloads: 500,
    rating: 4.5,
    sampleEpisodes: [],
    accessLevel: 'public',
    licenseType: 'cc_by',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

const FALLBACK_CART: CartItem[] = [
  {
    datasetId: 'ds-1',
    dataset: makeDataset({ id: 'ds-1', name: 'UR5 Bin Picking Pro', episodeCount: 2400, pricePerEpisode: 5 }),
    addedAt: new Date(),
  },
  {
    datasetId: 'ds-5',
    dataset: makeDataset({
      id: 'ds-5',
      name: 'Unitree H1 Whole-Body Locomotion',
      task: 'whole_body_loco',
      embodiments: ['unitree_h1'],
      episodeCount: 4000,
      pricePerEpisode: 12,
      pricingTier: 'enterprise',
    }),
    addedAt: new Date(),
  },
  {
    datasetId: 'ds-4',
    dataset: makeDataset({
      id: 'ds-4',
      name: 'xArm6 Packing Dataset',
      task: 'packing',
      embodiments: ['xarm6'],
      episodeCount: 1500,
      pricePerEpisode: 0,
      pricingTier: 'free',
    }),
    addedAt: new Date(),
  },
];

async function fetchCart(): Promise<CartItem[]> {
  try {
    const res = await apiClient.get('/marketplace/cart');
    return res.data.data ?? res.data;
  } catch {
    return FALLBACK_CART;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: items = FALLBACK_CART } = useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: fetchCart,
    staleTime: 30_000,
  });

  const removeMutation = useMutation({
    mutationFn: async (datasetId: string) => {
      await apiClient.delete(`/marketplace/cart/${datasetId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeItem = (datasetId: string) => {
    removeMutation.mutate(datasetId);
  };

  const totalCents = items.reduce(
    (sum, item) => sum + (item.dataset.pricePerEpisode ?? 0) * item.dataset.episodeCount,
    0
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Your Cart</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          {items.length} item{items.length !== 1 ? 's' : ''} in your cart
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-surface-elevated border border-surface-border rounded-lg p-12 text-center">
          <p className="text-text-secondary text-sm">Your cart is empty.</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="mt-4 px-4 py-2 bg-mid-blue text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
          >
            Browse Marketplace
          </button>
        </div>
      ) : (
        <>
          {/* Items */}
          <div className="space-y-3">
            {items.map((item) => {
              const price = (item.dataset.pricePerEpisode ?? 0) * item.dataset.episodeCount;
              return (
                <div
                  key={item.datasetId}
                  className="flex items-center gap-4 bg-surface-elevated border border-surface-border rounded-lg p-4"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-text-secondary opacity-40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{item.dataset.name}</p>
                    <p className="text-xs text-text-secondary">
                      {item.dataset.episodeCount.toLocaleString()} episodes ·{' '}
                      <span className="capitalize">{item.dataset.task.replace(/_/g, ' ')}</span> ·{' '}
                      {item.dataset.embodiments.map((e) => e.replace(/_/g, ' ')).join(', ')}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-text-primary">
                      {price === 0 ? 'Free' : `$${(price / 100).toFixed(2)}`}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.datasetId)}
                    className="p-1.5 text-text-secondary hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Total + Checkout */}
          <div className="bg-surface-elevated border border-surface-border rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-text-secondary">Total</span>
              <span className="text-xl font-bold text-text-primary">
                {totalCents === 0 ? 'Free' : `$${(totalCents / 100).toFixed(2)}`}
              </span>
            </div>
            <button className="w-full py-2.5 bg-accent-green text-white text-sm font-bold rounded-md hover:bg-green-600 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
