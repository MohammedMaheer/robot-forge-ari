import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DatasetCard } from '@robotforge/ui';
import { apiClient } from '@/lib/api';
import type { Dataset, RobotTask, RobotEmbodiment, DatasetFormat } from '@robotforge/types';

// ---------------------------------------------------------------------------
// Fallback datasets (used when API is unavailable)
// ---------------------------------------------------------------------------

const FALLBACK_DATASETS: Dataset[] = [
  {
    id: 'ds-1',
    name: 'UR5 Bin Picking Pro',
    description: 'High-quality bin picking demonstrations with a UR5 robot across 12 object categories.',
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
    tags: ['industrial', 'manipulation', 'grasping'],
    downloads: 1820,
    rating: 4.8,
    sampleEpisodes: [],
    accessLevel: 'public',
    licenseType: 'cc_by',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-02-20'),
  },
  {
    id: 'ds-2',
    name: 'Franka Assembly Benchmark',
    description: 'Precision assembly tasks with the Franka Panda, including peg-in-hole and gear meshing.',
    ownerId: 'user-101',
    task: 'assembly',
    embodiments: ['franka_panda'],
    episodeCount: 1800,
    totalDurationHours: 36,
    sizeGb: 45,
    qualityScore: 88,
    format: 'robotforge_native',
    pricingTier: 'starter',
    pricePerEpisode: 3,
    tags: ['assembly', 'precision', 'panda'],
    downloads: 940,
    rating: 4.5,
    sampleEpisodes: [],
    accessLevel: 'public',
    licenseType: 'cc_by_nc',
    createdAt: new Date('2026-01-22'),
    updatedAt: new Date('2026-02-18'),
  },
  {
    id: 'ds-3',
    name: 'Spot Navigation Indoor',
    description: 'Indoor navigation and obstacle avoidance demonstrations with Boston Dynamics Spot.',
    ownerId: 'user-102',
    task: 'navigation',
    embodiments: ['boston_dynamics_spot'],
    episodeCount: 3200,
    totalDurationHours: 80,
    sizeGb: 120,
    qualityScore: 85,
    format: 'open_x_embodiment',
    pricingTier: 'enterprise',
    pricePerEpisode: 8,
    tags: ['navigation', 'mobile', 'indoor'],
    downloads: 620,
    rating: 4.3,
    sampleEpisodes: [],
    accessLevel: 'public',
    licenseType: 'proprietary',
    createdAt: new Date('2025-12-05'),
    updatedAt: new Date('2026-02-15'),
  },
  {
    id: 'ds-4',
    name: 'xArm6 Packing Dataset',
    description: 'Box packing and palletizing tasks in a warehouse environment with xArm6.',
    ownerId: 'user-103',
    task: 'packing',
    embodiments: ['xarm6'],
    episodeCount: 1500,
    totalDurationHours: 25,
    sizeGb: 34,
    qualityScore: 79,
    format: 'lerobot_hdf5',
    pricingTier: 'free',
    tags: ['packing', 'logistics', 'warehouse'],
    downloads: 2100,
    rating: 4.1,
    sampleEpisodes: [],
    accessLevel: 'public',
    licenseType: 'cc_by',
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-22'),
  },
  {
    id: 'ds-5',
    name: 'Unitree H1 Whole-Body Locomotion',
    description: 'Whole-body locomotion and manipulation with Unitree H1 humanoid across diverse terrains.',
    ownerId: 'user-104',
    task: 'whole_body_loco',
    embodiments: ['unitree_h1'],
    episodeCount: 4000,
    totalDurationHours: 100,
    sizeGb: 210,
    qualityScore: 94,
    format: 'robotforge_native',
    pricingTier: 'enterprise',
    pricePerEpisode: 12,
    tags: ['humanoid', 'locomotion', 'whole-body'],
    downloads: 380,
    rating: 4.9,
    sampleEpisodes: [],
    accessLevel: 'public',
    licenseType: 'research_only',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-02-24'),
  },
  {
    id: 'ds-6',
    name: 'Multi-Robot Inspection Suite',
    description: 'Visual inspection tasks combining UR10 and Franka Panda with defect annotations.',
    ownerId: 'user-105',
    task: 'inspection',
    embodiments: ['ur10', 'franka_panda'],
    episodeCount: 2800,
    totalDurationHours: 56,
    sizeGb: 78,
    qualityScore: 86,
    format: 'open_x_embodiment',
    pricingTier: 'professional',
    pricePerEpisode: 6,
    tags: ['inspection', 'quality-control', 'multi-robot'],
    downloads: 710,
    rating: 4.4,
    sampleEpisodes: [],
    accessLevel: 'public',
    licenseType: 'cc_by_nc',
    createdAt: new Date('2025-11-20'),
    updatedAt: new Date('2026-02-10'),
  },
  {
    id: 'ds-7',
    name: 'Figure01 Manipulation v2',
    description: 'Dexterous object manipulation with Figure01 humanoid robot in kitchen environments.',
    ownerId: 'user-106',
    task: 'manipulation',
    embodiments: ['figure01'],
    episodeCount: 1200,
    totalDurationHours: 30,
    sizeGb: 55,
    qualityScore: 90,
    format: 'robotforge_native',
    pricingTier: 'professional',
    pricePerEpisode: 10,
    tags: ['humanoid', 'manipulation', 'kitchen'],
    downloads: 450,
    rating: 4.7,
    sampleEpisodes: [],
    accessLevel: 'public',
    licenseType: 'cc_by',
    createdAt: new Date('2026-02-05'),
    updatedAt: new Date('2026-02-23'),
  },
];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ALL_TASKS: RobotTask[] = [
  'bin_picking', 'assembly', 'packing', 'palletizing',
  'navigation', 'inspection', 'surgical', 'manipulation',
  'whole_body_loco', 'custom',
];

const ALL_EMBODIMENTS: RobotEmbodiment[] = [
  'ur5', 'ur10', 'franka_panda', 'xarm6', 'xarm7',
  'unitree_h1', 'unitree_g1', 'figure01', 'agility_digit',
  'boston_dynamics_spot', 'clearpath_husky', 'custom',
];

const ALL_FORMATS: DatasetFormat[] = ['lerobot_hdf5', 'open_x_embodiment', 'robotforge_native'];

type SortOption = 'downloads' | 'newest' | 'quality' | 'price';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MarketplacePage() {
  const navigate = useNavigate();

  // Search
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchTerm(value), 300);
  }, []);

  // Filters
  const [selectedTasks, setSelectedTasks] = useState<Set<RobotTask>>(new Set());
  const [selectedEmbodiments, setSelectedEmbodiments] = useState<Set<RobotEmbodiment>>(new Set());
  const [selectedFormat, setSelectedFormat] = useState<DatasetFormat | ''>('');
  const [minQuality, setMinQuality] = useState(0);
  const [sort, setSort] = useState<SortOption>('downloads');

  // ── Fetch datasets from API ─────────────────────────
  const { data: datasets = FALLBACK_DATASETS } = useQuery<Dataset[]>({
    queryKey: ['marketplace', 'datasets', searchTerm],
    queryFn: async () => {
      try {
        const params: Record<string, string> = { limit: '50' };
        if (searchTerm) params.q = searchTerm;
        const { data } = await apiClient.get('/marketplace/datasets', { params });
        return data.data ?? data;
      } catch {
        return FALLBACK_DATASETS;
      }
    },
    staleTime: 30_000,
  });

  const toggleTask = (t: RobotTask) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const toggleEmbodiment = (e: RobotEmbodiment) => {
    setSelectedEmbodiments((prev) => {
      const next = new Set(prev);
      next.has(e) ? next.delete(e) : next.add(e);
      return next;
    });
  };

  // Filtered + sorted datasets
  const results = useMemo(() => {
    let sets = datasets.filter((ds) => {
      if (searchTerm && !ds.name.toLowerCase().includes(searchTerm.toLowerCase()) && !ds.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (selectedTasks.size > 0 && !selectedTasks.has(ds.task)) return false;
      if (selectedEmbodiments.size > 0 && !ds.embodiments.some((e) => selectedEmbodiments.has(e))) return false;
      if (selectedFormat && ds.format !== selectedFormat) return false;
      if (ds.qualityScore < minQuality) return false;
      return true;
    });

    sets = [...sets].sort((a, b) => {
      switch (sort) {
        case 'downloads': return b.downloads - a.downloads;
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'quality': return b.qualityScore - a.qualityScore;
        case 'price': return (a.pricePerEpisode ?? 0) - (b.pricePerEpisode ?? 0);
        default: return 0;
      }
    });

    return sets;
  }, [searchTerm, selectedTasks, selectedEmbodiments, selectedFormat, minQuality, sort]);

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* ---------------------------------------------------------------- */}
      {/* Left sidebar filters                                             */}
      {/* ---------------------------------------------------------------- */}
      <aside className="w-64 shrink-0 space-y-5">
        <h2 className="text-sm font-semibold text-text-primary">Filters</h2>

        {/* Task multi-select */}
        <div>
          <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">Task Type</p>
          <div className="space-y-1 max-h-48 overflow-auto">
            {ALL_TASKS.map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer text-sm text-text-primary hover:text-text-primary/80">
                <input
                  type="checkbox"
                  checked={selectedTasks.has(t)}
                  onChange={() => toggleTask(t)}
                  className="accent-mid-blue"
                />
                <span className="capitalize">{t.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Embodiment multi-select */}
        <div>
          <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">Embodiment</p>
          <div className="space-y-1 max-h-48 overflow-auto">
            {ALL_EMBODIMENTS.map((e) => (
              <label key={e} className="flex items-center gap-2 cursor-pointer text-sm text-text-primary hover:text-text-primary/80">
                <input
                  type="checkbox"
                  checked={selectedEmbodiments.has(e)}
                  onChange={() => toggleEmbodiment(e)}
                  className="accent-mid-blue"
                />
                <span className="capitalize">{e.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Format select */}
        <div>
          <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">Format</p>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as DatasetFormat | '')}
            className="w-full bg-surface border border-surface-border rounded-md px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-mid-blue transition-colors"
          >
            <option value="">All Formats</option>
            {ALL_FORMATS.map((f) => (
              <option key={f} value={f}>{f.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* Quality min slider */}
        <div>
          <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
            Min Quality: <span className="text-text-primary font-bold">{minQuality}</span>
          </p>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={minQuality}
            onChange={(e) => setMinQuality(Number(e.target.value))}
            className="w-full accent-brand-blue"
          />
        </div>
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* Main content                                                     */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex-1 space-y-4">
        {/* Search + sort bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search datasets..."
              className="w-full bg-surface-elevated border border-surface-border rounded-md pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-mid-blue transition-colors"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-surface-elevated border border-surface-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-mid-blue transition-colors"
          >
            <option value="downloads">Most Downloaded</option>
            <option value="newest">Newest</option>
            <option value="quality">Quality Score</option>
            <option value="price">Price: Low → High</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-xs text-text-secondary">{results.length} dataset{results.length !== 1 ? 's' : ''} found</p>

        {/* Grid */}
        {results.length === 0 ? (
          <div className="text-center py-16 text-text-secondary text-sm">
            No datasets match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map((ds) => (
              <DatasetCard
                key={ds.id}
                dataset={ds}
                onPreview={() => navigate(`/marketplace/${ds.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
