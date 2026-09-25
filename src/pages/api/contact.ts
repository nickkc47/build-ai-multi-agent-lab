import type { APIRoute } from 'astro';
import { insertContact } from '../../lib/db';
import {
  clientKey,
  errorResponse,
  json,
  rateLimit,
  readJsonBody,
} from '../../lib/api';

export const prerender = false;

/**
 * POST /api/contact — validate JSON {name,email,message}, persist, 201.
 * 400 = invalid JSON or failed validation · 413 = body > 8 KB ·
 * 429 = rate limit (5/10 min per IP · L9) · 500 = server/DB error (fixed body).
 * 201 answers `{id, created_at}` only — the UI never reads the body (B2).
 */
export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    rateLimit(clientKey(request, clientAddress), 'contact');
    const body = await readJsonBody(request);
    const row = insertContact(body as Parameters<typeof insertContact>[0]);
    return json({ id: row.id, created_at: row.created_at }, 201);
  } catch (err) {
    return errorResponse(err, 'contact');
  }
};
