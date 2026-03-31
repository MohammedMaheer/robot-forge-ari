import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload, UserRole } from '@robotforge/types';

declare global {
  namespace Express {
    // Augment Passport's Express.User so req.user carries the JWT payload shape.
    // Passport declares `user?: User` on Request; by extending User with JwtPayload
    // fields, all route handlers get the correct type without conflicting declarations.
    interface User extends JwtPayload {}
  }
}

/**
 * Express middleware that validates JWT access tokens and optionally
 * enforces role-based access control.
 */
export function requireAuth(roles?: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      res.status(401).json({ code: 'UNAUTHORIZED', message: 'Missing authentication token' });
      return;
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET not configured');
      }

      const payload = jwt.verify(token, secret) as JwtPayload;

      if (roles && roles.length > 0 && !roles.includes(payload.role)) {
        res.status(403).json({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
        return;
      }

      req.user = payload;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({ code: 'TOKEN_EXPIRED', message: 'Token has expired' });
        return;
      }
      if (err instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ code: 'INVALID_TOKEN', message: 'Invalid token' });
        return;
      }
      res.status(500).json({ code: 'AUTH_ERROR', message: 'Authentication error' });
    }
  };
}
