import type { Request, Response, NextFunction } from 'express';

export class HttpError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500;
  const payload = {
    error: { message: err.message ?? 'Internal Server Error', details: err.details ?? undefined }
  };
  res.status(status).json(payload);
}
