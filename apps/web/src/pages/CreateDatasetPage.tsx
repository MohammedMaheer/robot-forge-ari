import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import type {
  RobotTask,
  RobotEmbodiment,
  DatasetFormat,
  DatasetPricingTier,
  DatasetLicense,
} from '@robotforge/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TASKS: RobotTask[] = [
  'bin_picking', 'assembly', 'packing', 'palletizing',
  'navigation', 'inspection', 'surgical', 'manipulation',
  'whole_body_loco', 'custom',
];

const EMBODIMENTS: RobotEmbodiment[] = [
  'ur5', 'ur10', 'franka_panda', 'xarm6', 'xarm7',
  'unitree_h1', 'unitree_g1', 'figure01', 'agility_digit',
  'boston_dynamics_spot', 'clearpath_husky', 'custom',
];

const FORMATS: DatasetFormat[] = ['lerobot_hdf5', 'open_x_embodiment', 'robotforge_native'];
const PRICING_TIERS: DatasetPricingTier[] = ['free', 'starter', 'professional', 'enterprise'];
const LICENSES: DatasetLicense[] = ['cc_by', 'cc_by_nc', 'proprietary', 'research_only'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreateDatasetPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [task, setTask] = useState<RobotTask>('bin_picking');
  const [selectedEmbodiments, setSelectedEmbodiments] = useState<Set<RobotEmbodiment>>(new Set());
  const [format, setFormat] = useState<DatasetFormat>('lerobot_hdf5');
  const [pricingTier, setPricingTier] = useState<DatasetPricingTier>('free');
  const [license, setLicense] = useState<DatasetLicense>('cc_by');

  const toggleEmbodiment = (e: RobotEmbodiment) => {
    setSelectedEmbodiments((prev) => {
      const next = new Set(prev);
      next.has(e) ? next.delete(e) : next.add(e);
      return next;
    });
  };

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const { data } = await apiClient.post('/marketplace/datasets', {
        name,
        description,
        task,
        embodiments: Array.from(selectedEmbodiments),
        format,
        pricingTier,
        licenseType: license,
      });
      const created = data.data ?? data;
      navigate(`/marketplace/${created.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to create dataset';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    'w-full bg-surface border border-surface-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-mid-blue transition-colors';
  const labelClasses = 'block text-xs font-medium text-text-secondary mb-1.5';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Create New Dataset</h1>
        <p className="text-sm text-text-secondary mt-0.5">Publish a collection of episodes to the marketplace</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-elevated border border-surface-border rounded-lg p-6 space-y-5">
        {/* Name */}
        <div>
          <label className={labelClasses}>Dataset Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. UR5 Bin Picking Pro"
            className={inputClasses}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClasses}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Describe the dataset contents, collection environment, and intended use..."
            className={`${inputClasses} resize-y`}
          />
        </div>

        {/* Task */}
        <div>
          <label className={labelClasses}>Task Type</label>
          <select
            value={task}
            onChange={(e) => setTask(e.target.value as RobotTask)}
            className={inputClasses}
          >
            {TASKS.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* Embodiments */}
        <div>
          <label className={labelClasses}>Embodiments (select all that apply)</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-1">
            {EMBODIMENTS.map((e) => (
              <label
                key={e}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer text-xs transition-colors ${
                  selectedEmbodiments.has(e)
                    ? 'border-mid-blue bg-mid-blue/10 text-text-primary'
                    : 'border-surface-border text-text-secondary hover:text-text-primary'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedEmbodiments.has(e)}
                  onChange={() => toggleEmbodiment(e)}
                  className="accent-mid-blue sr-only"
                />
                <span className="capitalize">{e.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Format */}
        <div>
          <label className={labelClasses}>Dataset Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as DatasetFormat)}
            className={inputClasses}
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>{f.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* Pricing Tier */}
        <div>
          <label className={labelClasses}>Pricing Tier</label>
          <div className="grid grid-cols-4 gap-2">
            {PRICING_TIERS.map((tier) => (
              <button
                type="button"
                key={tier}
                onClick={() => setPricingTier(tier)}
                className={`py-2 rounded-md text-xs font-medium capitalize transition-colors ${
                  pricingTier === tier
                    ? 'bg-brand-blue text-white'
                    : 'bg-surface border border-surface-border text-text-secondary hover:text-text-primary'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* License */}
        <div>
          <label className={labelClasses}>License</label>
          <select
            value={license}
            onChange={(e) => setLicense(e.target.value as DatasetLicense)}
            className={inputClasses}
          >
            {LICENSES.map((l) => (
              <option key={l} value={l}>{l.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          {submitError && (
            <p className="text-sm text-red-400 self-center mr-auto">{submitError}</p>
          )}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-surface text-text-secondary text-sm font-medium rounded-md border border-surface-border hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-accent-green text-white text-sm font-bold rounded-md hover:bg-green-600 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? 'Creating…' : 'Create Dataset'}
          </button>
        </div>
      </form>
    </div>
  );
}
