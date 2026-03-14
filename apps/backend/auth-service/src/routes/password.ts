import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
export const passwordRouter = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => { fn(req, res, next).catch(next); };
}

const forgotSchema = z.object({ email: z.string().email() });
const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

// POST /auth/forgot-password
passwordRouter.post('/forgot-password', asyncHandler(async (req: Request, res: Response) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid email' }); return; }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Always return 200 to prevent email enumeration
  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    // In production: store resetHash + expiry in DB, send email with link containing resetToken
    console.log(`[auth] Password reset token for ${user.email}: ${resetToken} (hash: ${resetHash})`);
  }

  res.json({ data: { message: 'If an account exists with that email, a password reset link has been sent.' } });
}));

// POST /auth/reset-password
passwordRouter.post('/reset-password', asyncHandler(async (req: Request, res: Response) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid input' }); return; }

  // In production: look up reset token hash in DB, verify not expired
  // For now, return a placeholder
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  console.log(`[auth] Password reset with token: ${parsed.data.token}, new hash: ${passwordHash.slice(0, 10)}...`);

  res.json({ data: { message: 'Password has been reset successfully. You can now sign in.' } });
}));
