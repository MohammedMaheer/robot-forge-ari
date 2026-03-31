import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useNotifications } from '@/contexts/NotificationContext';
import type {
  PolicyServerStatus,
  PolicyProtocol,
  FleetRobot,
} from '@robotforge/types';

// ---------------------------------------------------------------------------
// Models
// ---------------------------------------------------------------------------

const POLICY_MODELS = [
  { name: 'act', label: 'ACT', description: 'Action Chunking Transformer' },
  { name: 'smolvla', label: 'SmolVLA', description: 'Compact vision-language-action model' },
  { name: 'pi0', label: 'π₀ (Pi-Zero)', description: 'Physical Intelligence foundation model' },
  { name: 'diffusion_policy', label: 'Diffusion Policy', description: 'Denoising diffusion action model' },
  { name: 'custom', label: 'Custom', description: 'Custom model endpoint' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PolicyPage() {
  const { push } = useNotifications();
  const queryClient = useQueryClient();

  // Connection form state
  const [address, setAddress] = useState('localhost:50051');
  const [protocol, setProtocol] = useState<PolicyProtocol>('grpc');
  const [modelName, setModelName] = useState('act');
  const [customModel, setCustomModel] = useState('');
  const [bindRobotId, setBindRobotId] = useState('');
  const [connecting, setConnecting] = useState(false);

  // Fetch current policy status
  const { data: policyStatus, isLoading } = useQuery<PolicyServerStatus>({
    queryKey: ['policy', 'status'],
    queryFn: async () => {
      const { data } = await apiClient.get('/collection/policy/status');
      return data.data ?? data;
    },
    refetchInterval: 3_000,
    staleTime: 2_000,
  });

  // Fetch fleet robots for binding
  const { data: robots = [] } = useQuery<FleetRobot[]>({
    queryKey: ['fleet', 'robots'],
    queryFn: async () => {
      const { data } = await apiClient.get('/collection/fleet/robots');
      return data.data ?? data;
    },
    staleTime: 10_000,
  });

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await apiClient.post('/collection/policy/connect', {
        address,
        protocol,
        model_name: modelName === 'custom' ? customModel : modelName,
        robot_id: bindRobotId || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['policy'] });
      push('success', 'Policy server connected', `Connected to ${address} using ${protocol.toUpperCase()}`);
    } catch {
      push('error', 'Connection failed', 'Could not reach the policy server. Check the address and port.');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await apiClient.post('/collection/policy/disconnect');
      queryClient.invalidateQueries({ queryKey: ['policy'] });
      push('info', 'Disconnected', 'Policy server disconnected');
    } catch {
      push('error', 'Disconnect failed', 'Could not disconnect from policy server');
    }
  };

  const handleTestInference = async () => {
    try {
      await apiClient.post('/collection/policy/infer', { test: true });
      push('success', 'Inference OK', 'Test inference completed successfully');
      queryClient.invalidateQueries({ queryKey: ['policy'] });
    } catch {
      push('error', 'Inference failed', 'Test inference returned an error');
    }
  };

  const isConnected = policyStatus?.connected ?? false;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Policy Server</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Connect to a learned-policy inference server for autonomous data collection
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection form */}
        <div className="bg-surface-elevated border border-surface-border rounded-lg p-6 space-y-5">
          <h2 className="text-sm font-semibold text-text-primary">Connection</h2>

          {/* Protocol toggle */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Protocol</label>
            <div className="flex gap-2">
              {(['grpc', 'zmq'] as PolicyProtocol[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setProtocol(p)}
                  disabled={isConnected}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                    protocol === p
                      ? 'bg-mid-blue text-white'
                      : 'bg-surface border border-surface-border text-text-secondary hover:text-text-primary'
                  } disabled:opacity-50`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Server Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isConnected}
              placeholder={protocol === 'grpc' ? 'localhost:50051' : 'tcp://localhost:5555'}
              className="w-full bg-surface border border-surface-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-mid-blue transition-colors disabled:opacity-50"
            />
          </div>

          {/* Model selection */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Model</label>
            <div className="space-y-1.5">
              {POLICY_MODELS.map((m) => (
                <label
                  key={m.name}
                  className={`flex items-center gap-3 p-2.5 rounded-md border cursor-pointer transition-colors ${
                    modelName === m.name
                      ? 'border-mid-blue bg-mid-blue/10'
                      : 'border-surface-border bg-surface hover:bg-surface-elevated'
                  } ${isConnected ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <input
                    type="radio"
                    name="model"
                    value={m.name}
                    checked={modelName === m.name}
                    onChange={() => setModelName(m.name)}
                    className="accent-mid-blue"
                  />
                  <div>
                    <p className="text-sm text-text-primary font-medium">{m.label}</p>
                    <p className="text-[10px] text-text-secondary">{m.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {modelName === 'custom' && (
              <input
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                disabled={isConnected}
                placeholder="custom_model_name"
                className="mt-2 w-full bg-surface border border-surface-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-mid-blue transition-colors disabled:opacity-50 font-mono"
              />
            )}
          </div>

          {/* Robot binding */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Bind to Robot <span className="text-text-secondary/50">(optional)</span>
            </label>
            <select
              value={bindRobotId}
              onChange={(e) => setBindRobotId(e.target.value)}
              disabled={isConnected}
              className="w-full bg-surface border border-surface-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-mid-blue transition-colors disabled:opacity-50"
            >
              <option value="">No binding (broadcast)</option>
              {robots.map((r) => (
                <option key={r.robotId} value={r.robotId}>
                  {r.name} ({r.namespace || 'default'})
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                disabled={connecting || !address}
                className="flex-1 py-2.5 bg-accent-green text-white text-sm font-medium rounded-md hover:bg-green-600 disabled:opacity-40 transition-colors"
              >
                {connecting ? 'Connecting…' : 'Connect'}
              </button>
            ) : (
              <>
                <button
                  onClick={handleTestInference}
                  className="flex-1 py-2.5 bg-mid-blue text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
                >
                  Test Inference
                </button>
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2.5 bg-red-500/20 text-red-400 text-sm font-medium rounded-md border border-red-500/30 hover:bg-red-500/30 transition-colors"
                >
                  Disconnect
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status panel */}
        <div className="space-y-4">
          {/* Connection status */}
          <div className="bg-surface-elevated border border-surface-border rounded-lg p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Status</h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Connection</span>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${isConnected ? 'bg-accent-green/20 text-accent-green' : 'bg-gray-500/20 text-gray-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-accent-green' : 'bg-gray-500'}`} />
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                {isConnected && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Address</span>
                      <span className="text-xs font-mono text-text-primary">{policyStatus?.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Protocol</span>
                      <span className="text-xs text-text-primary uppercase">{policyStatus?.protocol}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Model</span>
                      <span className="text-xs text-text-primary">{policyStatus?.modelName}</span>
                    </div>
                    {policyStatus?.boundRobotId && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">Bound Robot</span>
                        <span className="text-xs font-mono text-text-primary">{policyStatus.boundRobotId}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Performance metrics */}
          {isConnected && policyStatus && (
            <div className="bg-surface-elevated border border-surface-border rounded-lg p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-4">Performance</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface rounded-lg p-3">
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider">Avg Latency</p>
                  <p className={`text-xl font-bold mt-1 ${policyStatus.avgLatencyMs < 50 ? 'text-accent-green' : policyStatus.avgLatencyMs < 100 ? 'text-amber-400' : 'text-red-400'}`}>
                    {policyStatus.avgLatencyMs.toFixed(1)}<span className="text-xs font-normal ml-0.5">ms</span>
                  </p>
                </div>
                <div className="bg-surface rounded-lg p-3">
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider">Inferences</p>
                  <p className="text-xl font-bold text-text-primary mt-1">
                    {policyStatus.inferenceCount.toLocaleString()}
                  </p>
                </div>
              </div>
              {policyStatus.lastInferenceAt && (
                <p className="text-[10px] text-text-secondary mt-3">
                  Last inference: {new Date(policyStatus.lastInferenceAt).toLocaleTimeString()}
                </p>
              )}
            </div>
          )}

          {/* Quick start guide */}
          {!isConnected && (
            <div className="bg-surface-elevated border border-surface-border rounded-lg p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-3">Quick Start</h2>
              <ol className="space-y-2 text-xs text-text-secondary list-decimal list-inside">
                <li>Launch your policy server (e.g. <code className="bg-surface px-1 rounded text-text-primary">python -m lerobot.serve --model act</code>)</li>
                <li>Select the protocol matching your server (gRPC or ZMQ)</li>
                <li>Enter the server address and port</li>
                <li>Choose the model architecture</li>
                <li>Optionally bind to a specific robot for targeted inference</li>
                <li>Click Connect and run a test inference</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
