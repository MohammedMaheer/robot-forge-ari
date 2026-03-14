/**
 * ROBOTFORGE Marketplace — Data Provenance Routes (Spec §5 Step 3.3)
 *
 * Tracks the full lineage of a dataset: creation, episode additions,
 * quality rescoring, format conversions, publication events, downloads,
 * forks, and license changes. Provides both append and query APIs.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';

const prisma = new PrismaClient();
export const provenanceRouter = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

// ── Validation ───────────────────────────────────────────────

const provenanceEventSchema = z.object({
  action: z.enum([
    'created',
    'episodes_added',
    'quality_rescored',
    'format_converted',
    'published',
    'downloaded',
    'forked',
    'license_changed',
  ]),
  details: z.record(z.unknown()).optional(),
  parentId: z.string().uuid().optional(),
});

// ── GET /datasets/:id/provenance ─────────────────────────────
// Returns the full provenance chain for a dataset.

provenanceRouter.get(
  '/:id/provenance',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const dataset = await prisma.dataset.findUnique({ where: { id } });
    if (!dataset) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'Dataset not found' });
      return;
    }

    const events = await prisma.provenanceEvent.findMany({
      where: { datasetId: id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        actor: true,
        action: true,
        details: true,
        parentId: true,
        createdAt: true,
      },
    });

    res.json({
      data: events,
      meta: {
        datasetId: id,
        total: events.length,
        firstEvent: events[0]?.createdAt ?? null,
        lastEvent: events[events.length - 1]?.createdAt ?? null,
      },
    });
  }),
);

// ── POST /datasets/:id/provenance ────────────────────────────
// Record a new provenance event (authenticated).

provenanceRouter.post(
  '/:id/provenance',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const parsed = provenanceEventSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const dataset = await prisma.dataset.findUnique({ where: { id } });
    if (!dataset) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'Dataset not found' });
      return;
    }

    // Validate parent exists if specified
    if (parsed.data.parentId) {
      const parent = await prisma.provenanceEvent.findUnique({
        where: { id: parsed.data.parentId },
      });
      if (!parent || parent.datasetId !== id) {
        res.status(400).json({
          code: 'INVALID_PARENT',
          message: 'Parent event not found or belongs to different dataset',
        });
        return;
      }
    }

    const event = await prisma.provenanceEvent.create({
      data: {
        datasetId: id,
        actor: req.user!.sub,
        action: parsed.data.action,
        details: parsed.data.details ?? undefined,
        parentId: parsed.data.parentId ?? undefined,
      },
    });

    res.status(201).json({ data: event });
  }),
);

// ── Helper: auto-record provenance (used by other routes) ────

export async function recordProvenance(
  datasetId: string,
  actor: string,
  action: string,
  details?: Record<string, unknown>,
  parentId?: string,
) {
  return prisma.provenanceEvent.create({
    data: {
      datasetId,
      actor,
      action,
      details: details ?? undefined,
      parentId: parentId ?? undefined,
    },
  });
}
