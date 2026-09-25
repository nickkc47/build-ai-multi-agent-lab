import type { APIRoute } from 'astro';
import { insertContact } from '../../lib/db';
import { errorResponse, json } from '../../lib/api';

export const prerender = false;

/**
 * POST /api/contact — validate JSON {name,email,message}, persist, 201.
 * 400 = invalid JSON or failed validation · 500 = server/DB error (fixed body).
 */
export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid json' }, 400);
  }
  try {
    const row = insertContact(body as Parameters<typeof insertContact>[0]);
    return json(row, 201);
  } catch (err) {
    return errorResponse(err, 'contact');
  }
};
