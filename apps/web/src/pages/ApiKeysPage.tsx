import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { ApiKey, ApiScope } from '@robotforge/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ALL_SCOPES: ApiScope[] = [
  'read:datasets',
  'write:episodes',
  'stream:teleoperation',
  'admin:platform',
];

// ---------------------------------------------------------------------------
// Fallback data (used while API is loading / unavailable)
// ---------------------------------------------------------------------------

const FALLBACK_KEYS: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Production Ingest',
    prefix: 'rf_prod_',
    scopes: ['write:episodes', 'stream:teleoperation'],
    rateLimit: 1000,
    ipAllowlist: [],
    lastUsedAt: new Date('2026-02-24T18:30:00Z'),
    expiresAt: new Date('2027-02-24'),
  },
  {
    id: 'key-2',
    name: 'Read-Only Dashboard',
    prefix: 'rf_dash_',
    scopes: ['read:datasets'],
    rateLimit: 500,
    ipAllowlist: [],
    lastUsedAt: new Date('2026-02-25T10:00:00Z'),
  },
  {
    id: 'key-3',
    name: 'CI Pipeline',
    prefix: 'rf_ci__',
    scopes: ['read:datasets', 'write:episodes'],
    rateLimit: 2000,
    ipAllowlist: [],
    lastUsedAt: undefined,
    expiresAt: new Date('2026-06-01'),
  },
];

async function fetchApiKeys(): Promise<ApiKey[]> {
  try {
    const res = await apiClient.get('/auth/api-keys');
    return res.data.data ?? res.data;
  } catch {
    return FALLBACK_KEYS;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ApiKeysPage() {
  const queryClient = useQueryClient();

  const { data: keys = FALLBACK_KEYS } = useQuery<ApiKey[]>({
    queryKey: ['api-keys'],
    queryFn: fetchApiKeys,
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string; scopes: ApiScope[]; rateLimit: number }) => {
      const res = await apiClient.post('/auth/api-keys', payload);
      return res.data.data ?? res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/auth/api-keys/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  // Create form state
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newScopes, setNewScopes] = useState<Set<ApiScope>>(new Set());
  const [newRateLimit, setNewRateLimit] = useState(1000);

  const toggleScope = (s: ApiScope) => {
    setNewScopes((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newScopes.size === 0) return;

    createMutation.mutate(
      { name: newName, scopes: Array.from(newScopes), rateLimit: newRateLimit },
      {
        onSuccess: () => {
          setNewName('');
          setNewScopes(new Set());
          setNewRateLimit(1000);
          setShowCreate(false);
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const inputClasses =
    'w-full bg-surface border border-surface-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-mid-blue transition-colors';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">API Keys</h1>
          <p className="text-sm text-text-secondary mt-0.5">Manage programmatic access to the ROBOTFORGE platform</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-accent-green text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
        >
          {showCreate ? 'Cancel' : '+ New API Key'}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="bg-surface-elevated border border-surface-border rounded-lg p-6 space-y-4"
        >
          <h2 className="text-sm font-semibold text-text-primary">Create New API Key</h2>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Key Name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              placeholder="e.g. Production Ingest"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Scopes</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SCOPES.map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer text-xs transition-colors ${
                    newScopes.has(s)
                      ? 'border-mid-blue bg-mid-blue/10 text-text-primary'
                      : 'border-surface-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={newScopes.has(s)}
                    onChange={() => toggleScope(s)}
                    className="sr-only"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Rate Limit (requests/hour): <span className="text-text-primary font-bold">{newRateLimit}</span>
            </label>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={newRateLimit}
              onChange={(e) => setNewRateLimit(Number(e.target.value))}
              className="w-full accent-brand-blue"
            />
            <div className="flex justify-between text-[10px] text-text-secondary mt-1">
              <span>100</span>
              <span>10,000</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-accent-green text-white text-sm font-bold rounded-md hover:bg-green-600 transition-colors"
            >
              Create Key
            </button>
          </div>
        </form>
      )}

      {/* Key list */}
      <div className="space-y-3">
        {keys.length === 0 ? (
          <div className="bg-surface-elevated border border-surface-border rounded-lg p-12 text-center">
            <p className="text-text-secondary text-sm">No API keys yet.</p>
          </div>
        ) : (
          keys.map((key) => (
            <div
              key={key.id}
              className="bg-surface-elevated border border-surface-border rounded-lg p-4 flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-lg bg-mid-blue/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-mid-blue" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{key.name}</p>
                <p className="text-xs text-text-secondary font-mono mt-0.5">
                  {key.prefix}••••••••
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {key.scopes.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-surface text-text-secondary text-[10px] rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-text-secondary">
                  <span>Rate limit: {key.rateLimit.toLocaleString()}/hr</span>
                  {key.lastUsedAt && (
                    <span>
                      Last used:{' '}
                      {new Date(key.lastUsedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  {key.expiresAt && (
                    <span>
                      Expires:{' '}
                      {new Date(key.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(key.id)}
                className="p-1.5 text-text-secondary hover:text-red-400 transition-colors shrink-0"
                title="Delete key"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
