import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  tier: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function requireAuth(roles?: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ code: 'UNAUTHORIZED', message: 'Missing token' });
      return;
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (roles && !roles.includes(payload.role)) {
        res.status(403).json({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
        return;
      }
      req.user = payload;
      next();
    } catch {
      res.status(401).json({ code: 'TOKEN_EXPIRED', message: 'Invalid or expired token' });
    }
  };
}
