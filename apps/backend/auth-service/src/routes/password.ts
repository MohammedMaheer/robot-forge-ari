import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

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
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour TTL

    // Delete any existing (unused) reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    // Store the new token hash in the DB
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    // In production: send email with link containing the raw resetToken
    // e.g. https://app.robotforge.ai/reset-password?token=<resetToken>
    // TODO: integrate email service (SendGrid / SES) to deliver the link
    void resetToken; // used by email service in production
  }

  res.json({ data: { message: 'If an account exists with that email, a password reset link has been sent.' } });
}));

// POST /auth/reset-password
passwordRouter.post('/reset-password', asyncHandler(async (req: Request, res: Response) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid input' }); return; }

  const tokenHash = crypto.createHash('sha256').update(parsed.data.token).digest('hex');

  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!record) {
    res.status(400).json({ code: 'INVALID_TOKEN', message: 'Invalid or expired password reset token' });
    return;
  }

  if (record.expiresAt < new Date()) {
    res.status(400).json({ code: 'TOKEN_EXPIRED', message: 'Password reset token has expired' });
    return;
  }

  if (record.usedAt !== null) {
    res.status(400).json({ code: 'TOKEN_USED', message: 'Password reset token has already been used' });
    return;
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  // Update password and mark token as used in a transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    // Revoke all existing refresh tokens to force re-login
    prisma.refreshToken.updateMany({
      where: { userId: record.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  res.json({ data: { message: 'Password has been reset successfully. You can now sign in.' } });
}));
