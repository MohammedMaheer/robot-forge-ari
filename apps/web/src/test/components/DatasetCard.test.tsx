import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DatasetCard } from '@robotforge/ui';

describe('DatasetCard', () => {
  const mockDataset = {
    id: 'ds-001',
    name: 'Franka Pick and Place',
    description: 'High quality pick-and-place episodes with a Franka Emika Panda robot',
    task: 'manipulation' as const,
    embodiment: 'franka' as const,
    episodeCount: 5000,
    totalDuration: 3600000,
    averageQuality: 0.92,
    price: 49.99,
    license: 'cc-by-4.0',
    createdAt: '2026-01-15T00:00:00Z',
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
