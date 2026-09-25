import type { APIRoute } from 'astro';
import { insertGuestbook, listGuestbook } from '../../lib/db';
import {
  clientKey,
  errorResponse,
  json,
  rateLimit,
  readJsonBody,
} from '../../lib/api';

export const prerender = false;

/**
 * GET /api/guestbook — approved entries only (D5: moderation before anything
 * is public). Pending rows are never exposed here.
 */
export const GET: APIRoute = async () => {
  try {
    const rows = listGuestbook('approved');
    return json({ entries: rows }, 200);
  } catch (err) {
    return errorResponse(err, 'guestbook');
  }
};

/**
 * POST /api/guestbook — validates (name ≤80, message ≤500, no links/markup)
 * and stores as `pending`; 201 on accept · 400 invalid · 413 body > 8 KB ·
 * 429 rate limit (5/10 min per IP · L6/L9) · 500 server error.
 *
 * Decision (L6): the endpoint keeps accepting posts while the page is closed —
 * `pending` + blocklist + rate limit + approve script = moderation exists, so
 * nothing unmoderated can reach the page (D5 intent). The public UI form is
 * still closed and stays closed until the owner opens it.
 */
export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    rateLimit(clientKey(request, clientAddress), 'guestbook');
    const body = await readJsonBody(request);
    const row = insertGuestbook(body as Parameters<typeof insertGuestbook>[0]);
    return json({ id: row.id, status: row.status, created_at: row.created_at }, 201);
  } catch (err) {
    return errorResponse(err, 'guestbook');
  }
};
