import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { SensorModality } from '@robotforge/types';
import { cn } from '../utils/cn';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TelemetryChartProps {
  robotId: string;
  modalities: SensorModality[];
  windowSeconds?: number;
  className?: string;
  /** Optional external data feed. If omitted, generates mock data. */
  dataFeed?: TelemetryDataPoint[];
}

export interface TelemetryDataPoint {
  timestamp: number;
  [key: string]: number;
}

// ---------------------------------------------------------------------------
// Color palette for sensor lines
// ---------------------------------------------------------------------------

const LINE_COLORS = [
  '#2563EB', '#2ECC71', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TelemetryChart({
  robotId,
  modalities,
  windowSeconds = 30,
  className,
  dataFeed,
}: TelemetryChartProps) {
  const [data, setData] = useState<TelemetryDataPoint[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Stabilise the modalities array as a string so a new array literal from the
  // parent does not cause unnecessary effect re-runs.
  const modalitiesKey = modalities.join(',');

  // Generate mock telemetry when no external feed is provided
  const generateMockPoint = useCallback(
    (t: number): TelemetryDataPoint => {
      const mods = modalitiesKey.split(',') as SensorModality[];
      const point: TelemetryDataPoint = { timestamp: t };
      mods.forEach((mod, i) => {
        const freq = 0.1 + i * 0.05;
        const phase = i * 0.7;
        point[mod] = Math.sin(t * freq + phase) * (1 + i * 0.3) + Math.random() * 0.1;
      });
      return point;
    },
    [modalitiesKey]
  );

  useEffect(() => {
    if (dataFeed) {
      // Use external data, trim to window
      const cutoff = Date.now() - windowSeconds * 1000;
      setData(dataFeed.filter((d) => d.timestamp >= cutoff));
      return;
    }

    // Start mock data generation at 20Hz
    let t = 0;
    tickRef.current = setInterval(() => {
      t += 0.05;
      setData((prev) => {
        const newPoint = generateMockPoint(t);
        const trimmed = [...prev, newPoint].slice(-(windowSeconds * 20));
        return trimmed;
      });
    }, 50);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [robotId, modalitiesKey, windowSeconds, dataFeed, generateMockPoint]);

  return (
    <div className={cn('bg-surface-elevated rounded-lg border border-surface-border p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-text-primary">
          Live Telemetry — <span className="text-text-secondary font-mono">{robotId}</span>
        </h3>
        <span className="text-xs text-text-secondary">{windowSeconds}s window</span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            tickFormatter={(v) => typeof v === 'number' ? v.toFixed(1) : v}
          />
          <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#F8FAFC' }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#94A3B8' }}
          />
          {modalities.map((mod, i) => (
            <Line
              key={mod}
              type="monotone"
              dataKey={mod}
              stroke={LINE_COLORS[i % LINE_COLORS.length]}
              dot={false}
              strokeWidth={1.5}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
