import { ApiError } from '../utils/ApiError.js';

/**
 * Validates { body, params, query } against a zod schema.
 * On success, replaces req.body/params/query with the parsed (and
 * coerced/trimmed/lowercased) values so controllers get clean input.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return next(new ApiError(400, 'Validation failed', details));
  }

  if (result.data.body) req.body = result.data.body;
  if (result.data.params) req.params = result.data.params;
  if (result.data.query) req.query = result.data.query;

  next();
};
