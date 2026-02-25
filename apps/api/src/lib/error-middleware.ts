import type { ErrorHandler } from 'hono';
import { ApiError } from './api-error';

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof ApiError) {
    return c.json(
      { error: { code: err.code, message: err.message, status: err.status } },
      err.status as never,
    );
  }

  console.error('Unhandled error:', err);
  return c.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        status: 500,
      },
    },
    500,
  );
};
