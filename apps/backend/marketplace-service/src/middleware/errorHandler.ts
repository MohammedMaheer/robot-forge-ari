import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error & { statusCode?: number; code?: string }, _req: Request, res: Response, _next: NextFunction): void {
  const statusCode = (err as Record<string, unknown>).statusCode as number || 500;
  const code = (err as Record<string, unknown>).code as string || 'INTERNAL_ERROR';
  console.error(`[marketplace-service] Error: ${err.message}`, err.stack);
  res.status(statusCode).json({ code, message: statusCode === 500 ? 'Internal server error' : err.message });
}
