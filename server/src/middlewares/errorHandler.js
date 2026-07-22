import { env } from '../config/env.js';

// Must be registered last. Catches everything forwarded via next(err),
// including errors thrown inside asyncHandler-wrapped controllers.
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational === true;

  if (!isOperational) {
    // Unexpected errors are logged with full detail server-side but never
    // leaked to the client.
    console.error('[UNHANDLED ERROR]', err);
  }

  res.status(statusCode).json({
    success: false,
    message: isOperational ? err.message : 'Something went wrong',
    details: isOperational ? err.details ?? undefined : undefined,
    stack: !env.isProd && !isOperational ? err.stack : undefined,
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}
