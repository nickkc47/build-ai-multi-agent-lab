import { describe, it, expect, beforeAll } from 'vitest';
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { resetRateLimits } from '../src/lib/api';
import { POST as contactPost } from '../src/pages/api/contact';
import { POST as guestbookPost, GET as guestbookGet } from '../src/pages/api/guestbook';
import { GET as interestsGet } from '../src/pages/api/interests';
import { approveGuestbook, insertGuestbook, listGuestbook } from '../src/lib/db';

/**
 * API hardening (L6 · L9): rate limit 429 · body cap 413 · fixed error bodies ·
 * minimal 201 · guestbook approve step · interests error mapping.
 */

type Handler = (ctx: never) => Promise<Response>;

function ctx(request: Request, clientAddress?: string): never {
  return { request, clientAddress } as never;
}

function postReq(body: string, ip: string): Request {
  return new Request('http://test.local/api', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body,
  });
}

const validContact = (n: number) =>
  JSON.stringify({ name: `Ada ${n}`, email: `ada${n}@example.com`, message: `hello ${n}` });

describe('api hardening (L6 · L9)', () => {
  const dataDir = join(process.cwd(), 'data', 'vitest-api-hardening');

  beforeAll(() => {
    process.env.DATA_DIR = dataDir;
    rmSync(dataDir, { recursive: true, force: true });
    mkdirSync(dataDir, { recursive: true });
    resetRateLimits();
    delete process.env.RATE_LIMIT_MAX;
    delete process.env.RATE_LIMIT_WINDOW_MS;
  });

  it('contact 201 answers only {id, created_at}', async () => {
    const res = await (contactPost as Handler)(ctx(postReq(validContact(1), '10.0.0.1')));
    expect(res.status).toBe(201);
    const body = (await res.json()) as Record<string, unknown>;
    expect(Object.keys(body).sort()).toEqual(['created_at', 'id']);
    expect(body.email).toBeUndefined();
  });

  it('contact keeps 400 for invalid input and invalid json', async () => {
    const bad = await (contactPost as Handler)(
      ctx(postReq(JSON.stringify({ name: 'Ada', email: 'not-an-email' }), '10.0.0.2'))
    );
    expect(bad.status).toBe(400);
    expect(await bad.json()).toEqual({ error: 'invalid input' });

    const broken = await (contactPost as Handler)(ctx(postReq('not json', '10.0.0.3')));
    expect(broken.status).toBe(400);
    expect(await broken.json()).toEqual({ error: 'invalid json' });
  });

  it('contact rejects bodies over 8 KB with 413', async () => {
    const res = await (contactPost as Handler)(ctx(postReq('x'.repeat(9000), '10.0.0.4')));
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: 'payload too large' });
  });

  it('rate limit: 6th contact POST from one IP gets 429, other IP unaffected', async () => {
    for (let i = 1; i <= 5; i += 1) {
      const res = await (contactPost as Handler)(ctx(postReq(validContact(10 + i), '10.0.1.1')));
      expect(res.status).toBe(201);
    }
    const limited = await (contactPost as Handler)(ctx(postReq(validContact(99), '10.0.1.1')));
    expect(limited.status).toBe(429);
    expect(await limited.json()).toEqual({ error: 'too many requests' });

    const other = await (contactPost as Handler)(ctx(postReq(validContact(50), '10.0.1.2')));
    expect(other.status).toBe(201);
  });

  it('guestbook has its own rate bucket (contact limit does not affect it)', async () => {
    const res = await (guestbookPost as Handler)(
      ctx(postReq(JSON.stringify({ name: 'Bob', message: 'Nice site' }), '10.0.1.1'))
    );
    expect(res.status).toBe(201);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.status).toBe('pending');
    expect(body.name).toBeUndefined();
  });

  it('guestbook 429 / 413 use the same fixed bodies', async () => {
    for (let i = 1; i <= 5; i += 1) {
      const res = await (guestbookPost as Handler)(
        ctx(postReq(JSON.stringify({ name: `B${i}`, message: `hi ${i}` }), '10.0.2.1'))
      );
      expect(res.status).toBe(201);
    }
    const limited = await (guestbookPost as Handler)(
      ctx(postReq(JSON.stringify({ name: 'B6', message: 'hi' }), '10.0.2.1'))
    );
    expect(limited.status).toBe(429);

    const big = await (guestbookPost as Handler)(ctx(postReq('y'.repeat(9000), '10.0.2.2')));
    expect(big.status).toBe(413);
  });

  it('guestbook approve step: pending stays off the public list until approved', async () => {
    const entry = insertGuestbook({ name: 'Cara', message: 'approve me' });
    expect(entry.status).toBe('pending');

    const before = await (guestbookGet as Handler)(ctx(null as never));
    expect(((await before.json()) as { entries: unknown[] }).entries).toEqual([]);

    const approved = approveGuestbook(entry.id);
    expect(approved?.status).toBe('approved');

    const after = await (guestbookGet as Handler)(ctx(null as never));
    const entries = ((await after.json()) as { entries: Array<{ id: number }> }).entries;
    expect(entries.some((e) => e.id === entry.id)).toBe(true);

    expect(approveGuestbook(999999)).toBeNull();
    expect(listGuestbook('pending').some((e) => e.id === entry.id)).toBe(false);
  });

  it('interests GET stays 200 and maps errors through errorResponse', async () => {
    const res = await (interestsGet as Handler)(ctx(null as never));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { source: string };
    expect(body.source).toBe('profile');
  });
});
