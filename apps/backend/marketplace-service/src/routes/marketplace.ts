import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const marketplaceRouter = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

// ── GET /marketplace/featured ─────────────────────────────

marketplaceRouter.get(
  '/featured',
  asyncHandler(async (_req: Request, res: Response) => {
    const featured = await prisma.dataset.findMany({
      where: { accessLevel: 'public', qualityScore: { gte: 80 } },
      orderBy: { downloads: 'desc' },
      take: 8,
    });
    res.json({ data: featured });
  })
);

// ── GET /marketplace/trending ─────────────────────────────

marketplaceRouter.get(
  '/trending',
  asyncHandler(async (_req: Request, res: Response) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const trending = await prisma.dataset.findMany({
      where: {
        accessLevel: 'public',
        updatedAt: { gte: sevenDaysAgo },
      },
      orderBy: { downloads: 'desc' },
      take: 10,
    });
    res.json({ data: trending });
  })
);
