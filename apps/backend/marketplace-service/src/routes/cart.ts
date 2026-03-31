import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { prisma } from '../lib/prisma';

export const cartRouter = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

// ── GET /cart ──────────────────────────────────────────────

cartRouter.get(
  '/',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user!.sub },
      include: { dataset: true },
      orderBy: { addedAt: 'desc' },
    });

    res.json({
      data: items.map((item) => ({
        datasetId: item.datasetId,
        dataset: item.dataset,
        addedAt: item.addedAt,
      })),
    });
  })
);

// ── POST /cart ─────────────────────────────────────────────

const addSchema = z.object({
  datasetId: z.string().uuid(),
});

cartRouter.post(
  '/',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = addSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.flatten().fieldErrors });
      return;
    }

    const dataset = await prisma.dataset.findUnique({ where: { id: parsed.data.datasetId } });
    if (!dataset) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'Dataset not found' });
      return;
    }

    const item = await prisma.cartItem.upsert({
      where: { userId_datasetId: { userId: req.user!.sub, datasetId: parsed.data.datasetId } },
      create: { userId: req.user!.sub, datasetId: parsed.data.datasetId },
      update: {},
      include: { dataset: true },
    });

    res.status(201).json({
      data: {
        datasetId: item.datasetId,
        dataset: item.dataset,
        addedAt: item.addedAt,
      },
    });
  })
);

// ── DELETE /cart/:datasetId ────────────────────────────────

cartRouter.delete(
  '/:datasetId',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user!.sub, datasetId: req.params.datasetId },
    });
    res.json({ data: { message: 'Item removed from cart' } });
  })
);
