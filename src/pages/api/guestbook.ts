import type { APIRoute } from 'astro';
import { insertGuestbook, listGuestbook } from '../../lib/db';
import { errorResponse, json } from '../../lib/api';

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
 * and stores as `pending`; 201 on accept · 400 invalid · 500 server error.
 * The guestbook page stays closed until an approval flow ships (D5 / L6).
 */
export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid json' }, 400);
  }
  try {
    const row = insertGuestbook(body as Parameters<typeof insertGuestbook>[0]);
    return json(row, 201);
  } catch (err) {
    return errorResponse(err, 'guestbook');
  }
};
