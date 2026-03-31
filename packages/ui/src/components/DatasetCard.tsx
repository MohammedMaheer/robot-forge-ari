import React from 'react';
import type { Dataset } from '@robotforge/types';
import { cn } from '../utils/cn';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DatasetCardProps {
  dataset: Dataset;
  onPurchase?: () => void;
  onPreview?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TASK_COLORS: Record<string, string> = {
  bin_picking: 'bg-blue-500/20 text-blue-400',
  assembly: 'bg-green-500/20 text-green-400',
  packing: 'bg-amber-500/20 text-amber-400',
  palletizing: 'bg-purple-500/20 text-purple-400',
  navigation: 'bg-cyan-500/20 text-cyan-400',
  inspection: 'bg-red-500/20 text-red-400',
  surgical: 'bg-pink-500/20 text-pink-400',
  manipulation: 'bg-indigo-500/20 text-indigo-400',
  whole_body_loco: 'bg-orange-500/20 text-orange-400',
  custom: 'bg-gray-500/20 text-gray-400',
};

function formatPrice(cents?: number): string {
  if (!cents || cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(2)}/ep`;
}

// Quality score ring (SVG)
function QualityRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#2ECC71' : score >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <svg width={48} height={48} className="shrink-0">
      <circle cx={24} cy={24} r={radius} fill="none" stroke="#334155" strokeWidth={3} />
      <circle
        cx={24}
        cy={24}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90, 24, 24)"
      />
      <text x={24} y={24} textAnchor="middle" dominantBaseline="central" fill="#F8FAFC" fontSize={11} fontWeight={600}>
        {score}
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DatasetCard({ dataset, onPurchase, onPreview, className }: DatasetCardProps) {
  const taskColor = TASK_COLORS[dataset.task] ?? TASK_COLORS.custom;

  return (
    <div
      className={cn(
        'group bg-surface-elevated rounded-lg border border-surface-border overflow-hidden',
        'hover:border-mid-blue/50 transition-all duration-200 cursor-pointer',
        className
      )}
      onClick={onPreview}
    >
      {/* Thumbnail / preview area */}
      <div className="relative h-40 bg-surface flex items-center justify-center overflow-hidden">
        {dataset.sampleEpisodes?.[0]?.thumbnailUrl ? (
          <img
            src={dataset.sampleEpisodes[0].thumbnailUrl}
            alt={dataset.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-text-secondary text-sm">
            <svg className="w-12 h-12 mx-auto mb-1 opacity-30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            No Preview
          </div>
        )}

        {/* Task badge */}
        <span className={cn('absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium', taskColor)}>
          {dataset.task.replace(/_/g, ' ')}
        </span>

        {/* Pricing badge */}
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium bg-surface/80 text-text-primary backdrop-blur-sm">
          {dataset.pricingTier === 'free' ? 'Free' : formatPrice(dataset.pricePerEpisode)}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-text-primary truncate">{dataset.name}</h3>
        <p className="text-xs text-text-secondary mt-1 line-clamp-2">{dataset.description}</p>

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-3">
          <QualityRing score={dataset.qualityScore} />
          <div className="flex-1 grid grid-cols-2 gap-1 text-xs">
            <div>
              <span className="text-text-secondary">Episodes</span>
              <p className="text-text-primary font-medium">{dataset.episodeCount.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-text-secondary">Size</span>
              <p className="text-text-primary font-medium">{dataset.sizeGb.toFixed(1)} GB</p>
            </div>
            <div>
              <span className="text-text-secondary">Downloads</span>
              <p className="text-text-primary font-medium">{dataset.downloads.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-text-secondary">Rating</span>
              <p className="text-text-primary font-medium">{'⭐'.repeat(Math.round(dataset.rating))} {dataset.rating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Embodiment tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {dataset.embodiments.slice(0, 3).map((emb) => (
            <span key={emb} className="px-1.5 py-0.5 bg-surface rounded text-[10px] text-text-secondary">
              {emb}
            </span>
          ))}
          {dataset.embodiments.length > 3 && (
            <span className="px-1.5 py-0.5 bg-surface rounded text-[10px] text-text-secondary">
              +{dataset.embodiments.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        {onPurchase && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPurchase();
            }}
            className="mt-3 w-full py-2 bg-brand-blue text-white text-sm font-medium rounded hover:bg-blue-800 transition-colors"
          >
            {dataset.pricingTier === 'free' ? 'Download Free' : `Purchase — ${formatPrice(dataset.pricePerEpisode)}`}
          </button>
        )}
      </div>
    </div>
  );
}
