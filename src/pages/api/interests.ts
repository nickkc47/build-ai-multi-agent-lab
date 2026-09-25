import type { APIRoute } from 'astro';
import { loadProfile } from '../../lib/profile';
import { errorResponse, json } from '../../lib/api';

export const prerender = false;

/** GET /api/interests — returns interests from PROFILE.md / content (read-only). */
export const GET: APIRoute = async () => {
  try {
    const profile = loadProfile();
    return json({ interests: profile.interests, source: 'profile' }, 200);
  } catch (err) {
    return errorResponse(err, 'interests');
  }
};
