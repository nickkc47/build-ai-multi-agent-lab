/**
 * Shared JSON response helpers for API routes (Lab 05 · backend).
 * Error bodies are fixed strings — details stay in the server log so we never
 * leak stack/SQL to the client (see docs/fe-be-contract-check.md).
 */
import { ValidationError } from './db';

export function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/**
 * Map a thrown error consistently across routes:
 * ValidationError → 400 `{error: 'invalid input'}` · anything else → 500
 * `{error: 'server error'}` after logging the detail server-side.
 */
export function errorResponse(err: unknown, scope: string): Response {
  if (err instanceof ValidationError) {
    return json({ error: err.message }, 400);
  }
  console.error(`[api/${scope}]`, err);
  return json({ error: 'server error' }, 500);
}
