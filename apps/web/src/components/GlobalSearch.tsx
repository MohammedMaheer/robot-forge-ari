import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

interface SearchResult {
  id: string;
  type: 'dataset' | 'episode' | 'session';
  title: string;
  description: string;
}

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const { data: results } = useQuery({
    queryKey: ['global-search', query],
    queryFn: async (): Promise<SearchResult[]> => {
      if (query.length < 2) return [];
      try {
        const { data } = await apiClient.get('/marketplace/datasets', { params: { q: query, limit: 8 } });
        return (data.data ?? []).map((d: Record<string, string>) => ({
          id: d.id,
          type: 'dataset' as const,
          title: d.name ?? d.title ?? 'Untitled',
          description: d.description?.slice(0, 80) ?? '',
        }));
      } catch {
        return [];
      }
    },
    enabled: query.length >= 2,
    staleTime: 10_000,
  });

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    if (result.type === 'dataset') navigate(`/marketplace/${result.id}`);
    else if (result.type === 'episode') navigate(`/episodes/${result.id}`);
  };

  const typeIcons: Record<string, string> = { dataset: '📦', episode: '🎬', session: '🤖' };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-surface-border rounded-md text-sm text-text-secondary hover:border-mid-blue/50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-surface-elevated border border-surface-border rounded">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 w-96 bg-surface-elevated border border-surface-border rounded-lg shadow-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-surface-border">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search datasets, episodes, robots..."
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none"
            />
          </div>

          {results && results.length > 0 && (
            <ul className="max-h-64 overflow-y-auto py-1">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-mid-blue/10 text-left transition-colors"
                  >
                    <span>{typeIcons[result.type] ?? '🔍'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">{result.title}</p>
                      <p className="text-xs text-text-secondary truncate">{result.description}</p>
                    </div>
                    <span className="text-[10px] text-text-secondary capitalize bg-surface px-1.5 py-0.5 rounded">{result.type}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {query.length >= 2 && (!results || results.length === 0) && (
            <div className="p-6 text-center text-sm text-text-secondary">
              No results found for "{query}"
            </div>
          )}

          {query.length < 2 && (
            <div className="p-4 text-center text-xs text-text-secondary">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      )}
    </div>
  );
}
