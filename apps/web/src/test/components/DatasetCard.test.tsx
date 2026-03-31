import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DatasetCard } from '@robotforge/ui';

describe('DatasetCard', () => {
  const mockDataset = {
    id: 'ds-001',
    name: 'Franka Pick and Place',
    description: 'High quality pick-and-place episodes with a Franka Emika Panda robot',
    ownerId: 'user-001',
    task: 'manipulation' as const,
    embodiments: ['franka_panda' as const],
    episodeCount: 5000,
    totalDurationHours: 100,
    sizeGb: 12.5,
    qualityScore: 85,
    format: 'lerobot_v3' as const,
    pricingTier: 'starter' as const,
    pricePerEpisode: 10,
    tags: ['pick-and-place', 'franka'],
    downloads: 1200,
    rating: 4.5,
    sampleEpisodes: [],
    accessLevel: 'public' as const,
    licenseType: 'cc_by' as const,
    createdAt: new Date('2026-01-15T00:00:00Z'),
    updatedAt: new Date('2026-01-20T00:00:00Z'),
  };

  it('renders dataset name', () => {
    render(<DatasetCard dataset={mockDataset} />);
    expect(screen.getByText('Franka Pick and Place')).toBeInTheDocument();
  });

  it('renders episode count', () => {
    render(<DatasetCard dataset={mockDataset} />);
    expect(screen.getByText(/5,?000/)).toBeInTheDocument();
  });

  it('renders task type', () => {
    render(<DatasetCard dataset={mockDataset} />);
    expect(screen.getByText(/manipulation/i)).toBeInTheDocument();
  });
});
