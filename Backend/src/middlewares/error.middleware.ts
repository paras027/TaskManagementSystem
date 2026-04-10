import { NextFunction, Request, Response } from 'express';

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  const details = err instanceof ApiError ? err.details : undefined;

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {})
  });
};

export default errorHandler;
