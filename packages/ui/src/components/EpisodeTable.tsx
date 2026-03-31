import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import type { Episode } from '@robotforge/types';
import { cn } from '../utils/cn';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EpisodeTableProps {
  episodes: Episode[];
  onSelect: (id: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_STYLES: Record<string, string> = {
  recording: 'bg-red-500/20 text-red-400',
  processing: 'bg-amber-500/20 text-amber-400',
  packaged: 'bg-blue-500/20 text-blue-400',
  listed: 'bg-green-500/20 text-green-400',
  failed: 'bg-red-500/20 text-red-300',
};

function formatDurationMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

const columnHelper = createColumnHelper<Episode>();

function buildColumns(onSelect: (id: string) => void) {
  return [
    columnHelper.display({
      id: 'thumbnail',
      header: '',
      cell: (info) => (
        <div className="w-12 h-8 bg-surface rounded overflow-hidden">
          {info.row.original.thumbnailUrl ? (
            <img
              src={info.row.original.thumbnailUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-4 h-4 text-text-secondary opacity-40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>
          )}
        </div>
      ),
      size: 60,
    }),
    columnHelper.accessor('task', {
      header: 'Task',
      cell: (info) => (
        <span className="text-text-primary text-xs capitalize">
          {info.getValue().replace(/_/g, ' ')}
        </span>
      ),
    }),
    columnHelper.accessor('embodiment', {
      header: 'Robot',
      cell: (info) => (
        <span className="text-text-secondary text-xs font-mono">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('durationMs', {
      header: 'Duration',
      cell: (info) => (
        <span className="text-text-secondary text-xs font-mono">
          {formatDurationMs(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('qualityScore', {
      header: 'Quality',
      cell: (info) => {
        const score = info.getValue();
        const color = score >= 80 ? 'text-accent-green' : score >= 50 ? 'text-amber-400' : 'text-red-400';
        return <span className={cn('text-xs font-medium', color)}>{score}</span>;
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        return (
          <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium', STATUS_STYLES[status] ?? '')}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(info.row.original.id);
          }}
          className="text-mid-blue text-xs hover:underline"
        >
          View
        </button>
      ),
      size: 60,
    }),
  ];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EpisodeTable({ episodes, onSelect, className }: EpisodeTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(() => buildColumns(onSelect), [onSelect]);

  const table = useReactTable({
    data: episodes,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className={cn('bg-surface-elevated rounded-lg border border-surface-border overflow-hidden', className)}>
      {/* Search */}
      <div className="px-4 py-3 border-b border-surface-border">
        <input
          type="text"
          placeholder="Search episodes..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full bg-surface border border-surface-border rounded px-3 py-1.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-mid-blue"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-surface-border">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary select-none"
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' && ' ↑'}
                      {header.column.getIsSorted() === 'desc' && ' ↓'}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onSelect(row.original.id)}
                className="border-b border-surface-border/50 hover:bg-surface cursor-pointer transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {table.getRowModel().rows.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-text-secondary">No episodes found</div>
        )}
      </div>
    </div>
  );
}
