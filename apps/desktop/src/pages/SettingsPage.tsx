/**
 * SettingsPage — Desktop settings
 *
 * Cloud endpoint, auth token, default sample rate,
 * storage info, version display, and data management.
 */

import { useState, useEffect, useCallback } from 'react';

interface SettingsState {
  apiEndpoint: string;
  defaultSampleRate: number;
  storageLocation: string;
  appVersion: string;
}

const STORAGE_KEY = 'robotforge:settings';

function loadSettings(): Partial<SettingsState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSettings(s: Partial<SettingsState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function SettingsPage() {
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:4000');
  const [defaultSampleRate, setDefaultSampleRate] = useState(50);
  const [storageLocation, setStorageLocation] = useState('');
  const [appVersion, setAppVersion] = useState('');
  const [saved, setSaved] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // Load persisted settings + version on mount
  useEffect(() => {
    const persisted = loadSettings();
    if (persisted.apiEndpoint) setApiEndpoint(persisted.apiEndpoint);
    if (persisted.defaultSampleRate) setDefaultSampleRate(persisted.defaultSampleRate);

    window.electronAPI?.app.getVersion().then((v) => setAppVersion(v ?? ''));

    // Storage location heuristic: electron userData path
    setStorageLocation(
      typeof window !== 'undefined' && 'electronAPI' in window
        ? 'userData/robotforge.db'
        : 'localStorage',
    );
  }, []);

  const handleSave = useCallback(() => {
    saveSettings({ apiEndpoint, defaultSampleRate });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [apiEndpoint, defaultSampleRate]);

  const handleClearData = useCallback(async () => {
    setClearing(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Also clear episode records from the SQLite DB
      const episodes = await window.electronAPI?.storage.getEpisodes();
      if (episodes) {
        for (const ep of episodes) {
          await window.electronAPI?.storage.deleteEpisode(ep.id);
        }
      }
      // Reset state
      setApiEndpoint('http://localhost:4000');
      setDefaultSampleRate(50);
    } finally {
      setClearing(false);
      setConfirmClear(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-surface p-8 text-white">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Settings</h1>

      <div className="max-w-lg space-y-6">
        {/* API Endpoint */}
        <Field label="Cloud API Endpoint">
          <input
            type="url"
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value)}
            placeholder="https://api.robotforge.io"
            className="w-full rounded-md border border-surface-border bg-surface-elevated px-4 py-2 text-sm text-white placeholder:text-text-secondary focus:border-mid-blue focus:outline-none"
          />
        </Field>

        {/* Default Sample Rate */}
        <Field label={`Default Sample Rate: ${defaultSampleRate} Hz`}>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={defaultSampleRate}
            onChange={(e) => setDefaultSampleRate(Number(e.target.value))}
            className="w-full accent-mid-blue"
          />
          <div className="mt-1 flex justify-between text-xs text-text-secondary">
            <span>10 Hz</span>
            <span>100 Hz</span>
          </div>
        </Field>

        {/* Storage Location (read-only) */}
        <Field label="Storage Location">
          <p className="font-mono text-sm text-text-secondary">{storageLocation || '—'}</p>
        </Field>

        {/* App Version */}
        <Field label="App Version">
          <p className="font-mono text-sm text-text-secondary">{appVersion || 'unknown'}</p>
        </Field>

        {/* Save */}
        <button
          onClick={handleSave}
          className="rounded-lg bg-mid-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-mid-blue/80"
        >
          {saved ? '✓ Saved' : 'Save Settings'}
        </button>

        {/* Danger zone */}
        <div className="border-t border-surface-border pt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-error">
            Danger Zone
          </h2>
          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              className="rounded-md border border-error/40 px-4 py-2 text-sm text-error transition hover:bg-error/10"
            >
              Clear Local Data
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">Are you sure?</span>
              <button
                onClick={handleClearData}
                disabled={clearing}
                className="rounded-md bg-error px-4 py-2 text-sm font-medium text-white transition hover:bg-error/80 disabled:opacity-40"
              >
                {clearing ? 'Clearing…' : 'Yes, clear all'}
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="text-sm text-text-secondary hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-secondary">{label}</label>
      {children}
    </div>
  );
}
