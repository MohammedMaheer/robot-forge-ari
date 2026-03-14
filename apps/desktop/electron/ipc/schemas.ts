/**
 * IPC Zod Validation Schemas
 *
 * All incoming IPC messages are validated against these schemas
 * before being processed by handlers (spec §7.3).
 */

import { z } from 'zod';

// ── Robot IPC schemas ─────────────────────────────────────

export const robotConnectSchema = z.object({
  host: z.string().min(1),
  port: z.number().int().min(1).max(65535),
  protocol: z.string().min(1),
  timeout: z.number().int().positive().optional(),
});

export const robotIdSchema = z.string().min(1);

export const robotCommandSchema = z.object({
  type: z.string().min(1),
  payload: z.record(z.unknown()),
});

// ── Daemon IPC schemas ────────────────────────────────────

export const daemonStartSchema = z.object({
  sessionId: z.string().min(1),
  robotId: z.string().min(1),
  task: z.string().min(1),
  sampleRateHz: z.number().positive().max(1000),
});

export const episodeIdSchema = z.string().min(1);

// ── Storage IPC schemas ───────────────────────────────────

export const storageFilterSchema = z.object({
  sessionId: z.string().optional(),
  status: z.string().optional(),
  task: z.string().optional(),
}).optional();

export const storageEpisodeIdSchema = z.string().min(1);

// ── Helper: validate and throw ────────────────────────────

export function validateIpc<T>(schema: z.ZodSchema<T>, data: unknown, channel: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new Error(`[IPC] Validation failed on "${channel}": ${message}`);
  }
  return result.data;
}
