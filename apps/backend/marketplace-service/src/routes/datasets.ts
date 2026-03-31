import { Router, Request, Response, NextFunction } from 'express';
import { Client } from '@elastic/elasticsearch';
import Stripe from 'stripe';
import { z } from 'zod';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { recordProvenance } from './provenance';
import { prisma } from '../lib/prisma';
const esClient = new Client({ node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });

export const datasetsRouter = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

// ── Validation ────────────────────────────────────────────

const createDatasetSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(10).max(5000),
  task: z.string(),
  embodiments: z.array(z.string()).min(1),
  format: z.enum(['lerobot_hdf5', 'open_x_embodiment', 'robotforge_native']).default('robotforge_native'),
  pricingTier: z.enum(['free', 'starter', 'professional', 'enterprise']).default('free'),
  pricePerEpisode: z.number().int().min(0).optional(),
  tags: z.array(z.string()).default([]),
  accessLevel: z.enum(['public', 'private', 'organization']).default('public'),
  licenseType: z.enum(['cc_by', 'cc_by_nc', 'proprietary', 'research_only']).default('cc_by'),
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(2000),
});

// ── GET /datasets ─────────────────────────────────────────

datasetsRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      q,
      task,
      embodiment,
      format,
      minQuality,
      maxPrice,
      sort = 'newest',
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));

    // Try Elasticsearch first, fall back to Prisma
    try {
      if (q) {
        const esResult = await esClient.search({
          index: 'datasets',
          body: {
            from: (pageNum - 1) * limitNum,
            size: limitNum,
            query: {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: q as string,
                      fields: ['name^2', 'description', 'tags'],
                    },
                  },
                ],
                filter: [
                  { term: { accessLevel: 'public' } },
                  ...(task ? [{ term: { task } }] : []),
                  ...(embodiment ? [{ term: { embodiments: embodiment } }] : []),
                ],
              },
            },
          },
        });

        const hits = (esResult.hits.hits as any[]).map((h) => ({
          id: h._id,
          ...(h._source as Record<string, unknown>),
        }));
        const total = typeof esResult.hits.total === 'object'
          ? (esResult.hits.total as { value: number }).value
          : esResult.hits.total as number;

        res.json({
          data: hits,
          meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
        });
        return;
      }
    } catch {
      // Elasticsearch unavailable — fall through to Prisma
    }

    // Prisma fallback
    const where: Record<string, unknown> = { accessLevel: 'public' };
    if (task) where.task = task;
    if (format) where.format = format;
    if (minQuality) where.qualityScore = { gte: parseFloat(minQuality as string) };

    const orderBy = sort === 'downloads'
      ? { downloads: 'desc' as const }
      : sort === 'quality'
        ? { qualityScore: 'desc' as const }
        : sort === 'price'
          ? { pricePerEpisode: 'asc' as const }
          : { createdAt: 'desc' as const };

    const [datasets, total] = await Promise.all([
      prisma.dataset.findMany({
        where,
        orderBy,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.dataset.count({ where }),
    ]);

    res.json({
      data: datasets,
      meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  })
);

// ── POST /datasets ────────────────────────────────────────

datasetsRouter.post(
  '/',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = createDatasetSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const dataset = await prisma.dataset.create({
      data: {
        ...parsed.data,
        ownerId: req.user!.sub,
      },
    });

    // Index in Elasticsearch (best-effort)
    try {
      await esClient.index({
        index: 'datasets',
        id: dataset.id,
        body: {
          name: dataset.name,
          description: dataset.description,
          task: dataset.task,
          embodiments: dataset.embodiments,
          tags: dataset.tags,
          qualityScore: dataset.qualityScore,
          episodeCount: dataset.episodeCount,
          pricePerEpisode: dataset.pricePerEpisode,
        },
      });
    } catch {
      console.warn('[marketplace] Failed to index dataset in Elasticsearch');
    }

    // Auto-record provenance
    await recordProvenance(dataset.id, req.user!.sub, 'created', {
      name: dataset.name,
      task: dataset.task,
      format: dataset.format,
      accessLevel: dataset.accessLevel,
      licenseType: dataset.licenseType,
    });

    res.status(201).json({ data: dataset });
  })
);

// ── GET /datasets/mine ────────────────────────────────────

datasetsRouter.get(
  '/mine',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));

    const [datasets, total] = await Promise.all([
      prisma.dataset.findMany({
        where: { ownerId: req.user!.sub },
        orderBy: { updatedAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.dataset.count({ where: { ownerId: req.user!.sub } }),
    ]);

    res.json({
      data: datasets,
      meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  })
);

// ── GET /datasets/:id ─────────────────────────────────────

datasetsRouter.get(
  '/:id',
  optionalAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const dataset = await prisma.dataset.findUnique({
      where: { id: req.params.id },
      include: { reviews: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });

    if (!dataset) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'Dataset not found' });
      return;
    }

    if (dataset.accessLevel === 'private' && req.user?.sub !== dataset.ownerId) {
      res.status(403).json({ code: 'FORBIDDEN', message: 'This dataset is private' });
      return;
    }

    res.json({ data: dataset });
  })
);

// ── POST /datasets/:id/purchase ───────────────────────────

datasetsRouter.post(
  '/:id/purchase',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const dataset = await prisma.dataset.findUnique({ where: { id: req.params.id } });
    if (!dataset) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'Dataset not found' });
      return;
    }

    if (dataset.pricingTier === 'free') {
      // Free dataset — no Stripe needed
      // Duplicate check: return existing completed purchase instead of creating a new one
      const existing = await prisma.purchase.findFirst({
        where: { userId: req.user!.sub, datasetId: dataset.id, status: 'completed' },
      });
      if (existing) {
        res.json({ data: { purchase: existing, downloadUrl: dataset.storageUrl } });
        return;
      }

      const purchase = await prisma.purchase.create({
        data: {
          userId: req.user!.sub,
          datasetId: dataset.id,
          amount: 0,
          status: 'completed',
        },
      });

      await prisma.dataset.update({
        where: { id: dataset.id },
        data: { downloads: { increment: 1 } },
      });

      // Record provenance for free download
      await recordProvenance(dataset.id, req.user!.sub, 'downloaded', {
        purchaseId: purchase.id,
        pricingTier: 'free',
      });

      res.json({ data: { purchase, downloadUrl: dataset.storageUrl } });
      return;
    }

    // Paid dataset — create Stripe checkout
    // Duplicate check: if already purchased, return existing record
    const existingPurchase = await prisma.purchase.findFirst({
      where: { userId: req.user!.sub, datasetId: dataset.id, status: 'completed' },
    });
    if (existingPurchase) {
      res.json({ data: { purchase: existingPurchase, downloadUrl: dataset.storageUrl } });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: dataset.name,
              description: `Robot dataset: ${dataset.episodeCount} episodes`,
            },
            unit_amount: (dataset.pricePerEpisode ?? 100) * dataset.episodeCount,
          },
          quantity: 1,
        },
      ],
      metadata: { datasetId: dataset.id, userId: req.user!.sub },
      success_url: `${process.env.FRONTEND_URL}/marketplace/${dataset.id}?purchased=true`,
      cancel_url: `${process.env.FRONTEND_URL}/marketplace/${dataset.id}`,
    });

    res.json({ data: { checkoutUrl: session.url } });
  })
);

// ── GET /datasets/:id/download ────────────────────────────

datasetsRouter.get(
  '/:id/download',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const dataset = await prisma.dataset.findUnique({ where: { id: req.params.id } });
    if (!dataset) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'Dataset not found' });
      return;
    }

    // Check purchase
    if (dataset.pricingTier !== 'free') {
      const purchase = await prisma.purchase.findFirst({
        where: { userId: req.user!.sub, datasetId: dataset.id, status: 'completed' },
      });
      if (!purchase) {
        res.status(403).json({ code: 'NOT_PURCHASED', message: 'Dataset not purchased' });
        return;
      }
    }

    // In production this would generate a presigned S3 URL
    res.json({
      data: {
        downloadUrl: dataset.storageUrl || `https://storage.robotforge.ai/datasets/${dataset.id}`,
        expiresIn: 3600,
      },
    });
  })
);

// ── POST /datasets/:id/reviews ────────────────────────────

datasetsRouter.post(
  '/:id/reviews',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.flatten().fieldErrors });
      return;
    }

    const dataset = await prisma.dataset.findUnique({ where: { id: req.params.id } });
    if (!dataset) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'Dataset not found' });
      return;
    }

    // Users may only review datasets they have purchased (or own, or are free)
    if (dataset.ownerId !== req.user!.sub && dataset.pricingTier !== 'free') {
      const purchase = await prisma.purchase.findFirst({
        where: { datasetId: dataset.id, userId: req.user!.sub, status: 'completed' },
      });
      if (!purchase) {
        res.status(403).json({ code: 'PURCHASE_REQUIRED', message: 'You must purchase this dataset before reviewing it' });
        return;
      }
    }

    // Prevent duplicate reviews
    const existingReview = await prisma.review.findFirst({
      where: { datasetId: dataset.id, userId: req.user!.sub },
    });
    if (existingReview) {
      res.status(409).json({ code: 'ALREADY_REVIEWED', message: 'You have already reviewed this dataset' });
      return;
    }

    const review = await prisma.review.create({
      data: {
        datasetId: dataset.id,
        userId: req.user!.sub,
        userName: req.user!.name,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      },
    });

    // Update average rating
    const avg = await prisma.review.aggregate({
      where: { datasetId: dataset.id },
      _avg: { rating: true },
    });
    await prisma.dataset.update({
      where: { id: dataset.id },
      data: { rating: avg._avg.rating ?? 0 },
    });

    res.status(201).json({ data: review });
  })
);
