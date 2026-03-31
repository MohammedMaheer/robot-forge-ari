import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTheme, type ThemeMode } from '@/contexts/ThemeContext';
import { apiClient } from '@/lib/api';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SettingsPage() {
  const { user, logout, setUser } = useAuthStore();
  const { mode, setMode } = useTheme();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.name ?? '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [accentColor, setAccentColor] = useState(
    () => localStorage.getItem('accentColor') ?? 'Blue'
  );

  const handleAccentColor = (name: string) => {
    setAccentColor(name);
    localStorage.setItem('accentColor', name);
  };

  const handleSaveProfile = async () => {
    setSaveStatus('saving');
    try {
      const { data } = await apiClient.patch('/auth/profile', { name: displayName });
      if (user && data?.data) {
        setUser({ ...user, ...data.data });
      } else if (user) {
        setUser({ ...user, name: displayName });
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await apiClient.delete('/auth/account');
      await logout();
      navigate('/login');
    } catch {
      alert('Failed to delete account. Please contact support.');
    }
  };

  const saveLabel = saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save Changes';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-0.5">Manage your account and preferences</p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Profile Section                                                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-surface-elevated border border-surface-border rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary">Profile</h2>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-blue flex items-center justify-center text-white text-xl font-bold shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{user?.name ?? 'Operator'}</p>
            <p className="text-xs text-text-secondary">{user?.email ?? 'user@robotforge.dev'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Display Name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-surface border border-surface-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-mid-blue transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
            <input
              defaultValue={user?.email ?? ''}
              disabled
              className="w-full bg-surface border border-surface-border rounded-md px-3 py-2 text-sm text-text-primary opacity-60 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Account Tier</label>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-blue/20 text-brand-blue rounded-md text-xs font-medium capitalize">
            {user?.tier ?? 'starter'}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveProfile}
            disabled={saveStatus === 'saving'}
            className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-blue-800 disabled:opacity-60 transition-colors">
            {saveLabel}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Theme / Appearance                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-surface-elevated border border-surface-border rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary">Appearance</h2>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Theme</label>
          <div className="flex gap-3">
            {(['dark', 'light', 'system'] as ThemeMode[]).map((t) => (
              <button
                key={t}
                onClick={() => setMode(t)}
                className={`flex-1 py-2.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  mode === t
                    ? 'bg-brand-blue text-white'
                    : 'bg-surface border border-surface-border text-text-secondary hover:text-text-primary'
                }`}
              >
                {t === 'dark' ? '🌙 Dark' : t === 'light' ? '☀️ Light' : '💻 System'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Accent Color</label>
          <div className="flex gap-2">
            {[
              { name: 'Blue', class: 'bg-brand-blue' },
              { name: 'Green', class: 'bg-accent-green' },
              { name: 'Purple', class: 'bg-purple-500' },
              { name: 'Amber', class: 'bg-amber-500' },
            ].map((color) => (
              <button
                key={color.name}
                onClick={() => handleAccentColor(color.name)}
                className={`w-8 h-8 rounded-full ${color.class} border-2 ${
                  accentColor === color.name ? 'border-white' : 'border-transparent'
                } hover:border-white/60 transition-colors`}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* API Keys link                                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-surface-elevated border border-surface-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">API Keys</h2>
            <p className="text-xs text-text-secondary mt-0.5">Manage programmatic access to ROBOTFORGE</p>
          </div>
          <Link
            to="/settings/api-keys"
            className="px-4 py-2 bg-mid-blue text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
          >
            Manage Keys →
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Danger zone                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-surface-elevated border border-red-500/30 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-red-400">Danger Zone</h2>
        <p className="text-xs text-text-secondary mt-1 mb-4">Irreversible and destructive actions</p>
        <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-500/20 text-red-400 text-sm font-medium rounded-md border border-red-500/30 hover:bg-red-500/30 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
