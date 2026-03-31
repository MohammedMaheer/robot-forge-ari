import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import type { JwtPayload, UserRole, UserTier, ApiScope, AuthTokens } from '@robotforge/types';

export const authRouter = Router();

// ── Validation Schemas ────────────────────────────────────

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100),
  role: z.enum(['operator', 'developer', 'enterprise']).optional().default('developer'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z.array(z.enum(['read:datasets', 'write:episodes', 'stream:teleoperation', 'admin:platform'])),
  rateLimit: z.number().int().positive().max(100000).optional().default(1000),
  ipAllowlist: z.array(z.string()).optional().default([]),
  expiresInDays: z.number().int().positive().optional(),
});

// ── Helpers ───────────────────────────────────────────────

function generateTokens(user: { id: string; email: string; name: string; role: string; tier: string }): AuthTokens {
  const jwtSecret = process.env.JWT_SECRET!;
  const refreshSecret = process.env.JWT_REFRESH_SECRET!;

  const accessPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    tier: user.tier as UserTier,
  };

  const accessToken = jwt.sign(accessPayload, jwtSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: user.id }, refreshSecret, { expiresIn: '30d' });

  return {
    accessToken,
    refreshToken,
    expiresIn: 900, // 15 min in seconds
  };
}

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

// ── POST /auth/register ───────────────────────────────────

authRouter.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password, name, role } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ code: 'EMAIL_EXISTS', message: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, passwordHash, name, role },
    });

    const tokens = generateTokens(user);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(201).json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tier: user.tier,
          createdAt: user.createdAt,
        },
        tokens,
      },
    });
  })
);

// ── POST /auth/login ──────────────────────────────────────

authRouter.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
      return;
    }

    const tokens = generateTokens(user);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tier: user.tier,
          createdAt: user.createdAt,
        },
        tokens,
      },
    });
  })
);

// ── POST /auth/refresh ────────────────────────────────────

authRouter.post(
  '/refresh',
  asyncHandler(async (req: Request, res: Response) => {
    // Accept refresh token from JSON body (password flow) OR HttpOnly cookie (OAuth flow)
    const cookieHeader = req.headers.cookie ?? '';
    const cookieToken = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('refreshToken='))
      ?.split('=')
      .slice(1)
      .join('=')
      .trim();
    const refreshToken: string | undefined = req.body.refreshToken ?? cookieToken;
    if (!refreshToken) {
      res.status(400).json({ code: 'MISSING_TOKEN', message: 'Refresh token is required' });
      return;
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET!;

    let payload: { sub: string };
    try {
      payload = jwt.verify(refreshToken, refreshSecret) as { sub: string };
    } catch {
      res.status(401).json({ code: 'INVALID_REFRESH_TOKEN', message: 'Invalid or expired refresh token' });
      return;
    }

    const storedToken = await prisma.refreshToken.findFirst({
      where: { token: refreshToken, revokedAt: null },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      res.status(401).json({ code: 'TOKEN_REVOKED', message: 'Refresh token has been revoked or expired' });
      return;
    }

    // Rotate: revoke old, issue new
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const user = storedToken.user;
    const tokens = generateTokens(user);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({ data: { tokens } });
  })
);

// ── DELETE /auth/logout ───────────────────────────────────

authRouter.delete(
  '/logout',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    // Accept refresh token from JSON body (password/email flow) OR from
    // the HttpOnly cookie set by the OAuth exchange endpoint.
    const cookieHeader = req.headers.cookie ?? '';
    const cookieToken = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('refreshToken='))
      ?.split('=')
      .slice(1)
      .join('=')
      .trim();

    const refreshToken: string | undefined = req.body.refreshToken ?? cookieToken;

    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    // Always clear the OAuth HttpOnly cookie regardless of auth flow
    res.clearCookie('refreshToken', { path: '/auth' });

    res.json({ data: { message: 'Logged out successfully' } });
  })
);

// ── GET /auth/me ──────────────────────────────────────────

authRouter.get(
  '/me',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      include: {
        apiKeys: {
          select: {
            id: true,
            name: true,
            prefix: true,
            scopes: true,
            rateLimit: true,
            ipAllowlist: true,
            lastUsedAt: true,
            expiresAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ code: 'USER_NOT_FOUND', message: 'User not found' });
      return;
    }

    res.json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tier: user.tier,
        apiKeys: user.apiKeys,
        createdAt: user.createdAt,
      },
    });
  })
);

// ── GET /auth/keys ────────────────────────────────────────

authRouter.get(
  '/keys',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const keys = await prisma.apiKey.findMany({
      where: { userId: req.user!.sub },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        prefix: true,
        scopes: true,
        rateLimit: true,
        ipAllowlist: true,
        expiresAt: true,
        createdAt: true,
      },
    });
    res.json({ data: keys });
  })
);

// ── POST /auth/keys ───────────────────────────────────────

authRouter.post(
  '/keys',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = createApiKeySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, scopes, rateLimit, ipAllowlist, expiresInDays } = parsed.data;

    // Generate a secure API key: rf_<random>
    const rawKey = `rf_${crypto.randomBytes(32).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const prefix = rawKey.slice(0, 11); // "rf_" + first 8 hex chars

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: req.user!.sub,
        name,
        keyHash,
        prefix,
        scopes,
        rateLimit,
        ipAllowlist,
        expiresAt,
      },
    });

    // Return the raw key ONLY on creation — it is never stored
    res.status(201).json({
      data: {
        id: apiKey.id,
        name: apiKey.name,
        key: rawKey, // Only time the full key is shown
        prefix: apiKey.prefix,
        scopes: apiKey.scopes,
        rateLimit: apiKey.rateLimit,
        ipAllowlist: apiKey.ipAllowlist,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
      },
    });
  })
);

// ── DELETE /auth/keys/:id ─────────────────────────────────

authRouter.delete(
  '/keys/:id',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const apiKey = await prisma.apiKey.findFirst({
      where: { id, userId: req.user!.sub },
    });

    if (!apiKey) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'API key not found' });
      return;
    }

    await prisma.apiKey.delete({ where: { id } });

    res.json({ data: { message: 'API key revoked successfully' } });
  })
);

// ── PATCH /auth/profile ───────────────────────────────────

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

authRouter.patch(
  '/profile',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.flatten().fieldErrors });
      return;
    }

    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data: parsed.data,
      select: { id: true, email: true, name: true, role: true, tier: true },
    });

    res.json({ data: user });
  })
);

// ── DELETE /auth/account ──────────────────────────────────

authRouter.delete(
  '/account',
  requireAuth(),
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.user.delete({ where: { id: req.user!.sub } });
    res.json({ data: { message: 'Account deleted successfully' } });
  })
);
