/**
 * Shared JSON response helpers for API routes (backend · OpenCode).
 * Error bodies are fixed strings — details stay in the server log so we never
 * leak stack/SQL to the client (see docs/fe-be-contract-check.md).
 *
 * Hardening (L9): request body size cap + per-IP rate limit for write routes.
 */
import { ValidationError } from './db';

export function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/** Body cap shared by write routes → 413. UTF-16 length ≈ bytes for our payloads. */
export const MAX_BODY_BYTES = 8 * 1024;

export class InvalidJsonError extends Error {
  constructor() {
    super('invalid json');
    this.name = 'InvalidJsonError';
  }
}

export class PayloadTooLargeError extends Error {
  constructor() {
    super('payload too large');
    this.name = 'PayloadTooLargeError';
  }
}

export class RateLimitError extends Error {
  constructor() {
    super('too many requests');
    this.name = 'RateLimitError';
  }
}

/**
 * Read and parse a JSON body with a size cap. Checks `content-length` first
 * (cheap reject) and the actual text afterwards (header can lie).
 */
export async function readJsonBody(request: Request): Promise<unknown> {
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) throw new PayloadTooLargeError();
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) throw new PayloadTooLargeError();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new InvalidJsonError();
  }
}

/**
 * Rate limit state is in-memory per instance — fine for the single Node
 * standalone deployment (handoff 05b · assumption 1). Multiple instances or a
 * reverse proxy in front would need shared storage / trusted-proxy IPs.
 * Tuning: RATE_LIMIT_MAX (≤0 disables · e2e can use this) · RATE_LIMIT_WINDOW_MS.
 */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function rateLimitConfig(): { max: number; windowMs: number } {
  return {
    max: Number(process.env.RATE_LIMIT_MAX ?? 5),
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 10 * 60 * 1000),
  };
}

/** Throws RateLimitError → 429 once `max` calls per window are used up. */
export function rateLimit(key: string, scope: string): void {
  const { max, windowMs } = rateLimitConfig();
  if (max <= 0) return;
  const now = Date.now();
  const id = `${scope}:${key}`;
  const bucket = buckets.get(id);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(id, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count += 1;
  if (bucket.count > max) throw new RateLimitError();
  if (buckets.size > 1000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }
}

/** Tests only — clears all buckets so runs are independent. */
export function resetRateLimits(): void {
  buckets.clear();
}

/**
 * Client identity for rate limiting. Prefers `clientAddress` (real socket);
 * falls back to `x-forwarded-for` when the adapter can't provide it (tests).
 * Behind a reverse proxy every client shares the proxy IP — then this needs
 * trusted-proxy handling before tuning the limit.
 */
export function clientKey(request: Request, clientAddress?: string): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return clientAddress || forwarded || 'unknown';
}

/**
 * Map a thrown error consistently across routes:
 * ValidationError / InvalidJsonError → 400 · PayloadTooLargeError → 413 ·
 * RateLimitError → 429 · anything else → 500 after logging server-side.
 * Every body is a fixed string (never `err.message` of runtime errors).
 */
export function errorResponse(err: unknown, scope: string): Response {
  if (err instanceof ValidationError) {
    return json({ error: err.message }, 400);
  }
  if (err instanceof InvalidJsonError) {
    return json({ error: err.message }, 400);
  }
  if (err instanceof PayloadTooLargeError) {
    return json({ error: err.message }, 413);
  }
  if (err instanceof RateLimitError) {
    return json({ error: err.message }, 429);
  }
  console.error(`[api/${scope}]`, err);
  return json({ error: 'server error' }, 500);
}
