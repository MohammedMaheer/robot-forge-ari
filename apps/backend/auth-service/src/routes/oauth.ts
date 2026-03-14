import { Router, Request, Response } from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();
export const oauthRouter = Router();

// Helper to generate tokens (same as auth.ts)
function generateTokens(user: { id: string; email: string; name: string; role: string; tier: string }) {
  const jwtSecret = process.env.JWT_SECRET!;
  const refreshSecret = process.env.JWT_REFRESH_SECRET!;
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier },
    jwtSecret,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign({ sub: user.id }, refreshSecret, { expiresIn: '30d' });
  return { accessToken, refreshToken, expiresIn: 900 };
}

// Find or create user from OAuth profile
async function findOrCreateOAuthUser(profile: { id: string; emails?: Array<{ value: string }>; displayName?: string; provider: string }) {
  const email = profile.emails?.[0]?.value;
  if (!email) throw new Error('No email provided by OAuth provider');

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: profile.displayName ?? email.split('@')[0],
        passwordHash: crypto.randomBytes(32).toString('hex'), // No password for OAuth users
        role: 'developer',
      },
    });
  }
  return user;
}

// Configure GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL ?? 'http://localhost:3001/oauth/github/callback',
      scope: ['user:email'],
    },
    async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
      try {
        const user = await findOrCreateOAuthUser(profile);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  ));
}

// Configure Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3001/oauth/google/callback',
      scope: ['profile', 'email'],
    },
    async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
      try {
        const user = await findOrCreateOAuthUser(profile);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  ));
}

// Serialize/deserialize
passport.serializeUser((user: any, done: any) => done(null, user.id));
passport.deserializeUser(async (id: string, done: any) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

// ─── Temporary auth-code store (in production, use Redis with TTL) ─────
const pendingAuthCodes = new Map<string, { userId: string; accessToken: string; refreshToken: string; expiresAt: number }>();

function createAuthCode(userId: string, tokens: { accessToken: string; refreshToken: string }): string {
  const code = crypto.randomBytes(32).toString('hex');
  pendingAuthCodes.set(code, {
    userId,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: Date.now() + 60_000, // 60 seconds TTL
  });
  return code;
}

// Exchange auth code for tokens (called by frontend after redirect)
oauthRouter.post('/exchange', async (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing auth code' });
  }

  const entry = pendingAuthCodes.get(code);
  if (!entry || entry.expiresAt < Date.now()) {
    pendingAuthCodes.delete(code);
    return res.status(401).json({ error: 'Invalid or expired auth code' });
  }

  pendingAuthCodes.delete(code);

  // Set refresh token as HttpOnly cookie instead of returning in body
  res.cookie('refreshToken', entry.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/auth',
  });

  return res.json({ accessToken: entry.accessToken, expiresIn: 900 });
});

// GitHub routes
oauthRouter.get('/github', passport.authenticate('github', { session: false }));
oauthRouter.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=github_failed` }), async (req: Request, res: Response) => {
  const user = req.user as any;
  const tokens = generateTokens(user);
  await prisma.refreshToken.create({ data: { userId: user.id, token: tokens.refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
  // Redirect with short-lived auth code, NOT raw tokens (Spec §7.1 — never expose tokens in URLs)
  const code = createAuthCode(user.id, tokens);
  res.redirect(`${FRONTEND_URL}/login?code=${code}`);
});

// Google routes
oauthRouter.get('/google', passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));
oauthRouter.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=google_failed` }), async (req: Request, res: Response) => {
  const user = req.user as any;
  const tokens = generateTokens(user);
  await prisma.refreshToken.create({ data: { userId: user.id, token: tokens.refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
  // Redirect with short-lived auth code, NOT raw tokens
  const code = createAuthCode(user.id, tokens);
  res.redirect(`${FRONTEND_URL}/login?code=${code}`);
});
