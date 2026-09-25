/**
 * SQLite helpers for contact + guestbook.
 * Lab 05 (OpenCode): server-side validation + persistence.
 * Messages are stored raw — any page that renders them must escape
 * (textContent / Astro escaping only, never innerHTML).
 */
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export type GuestbookStatus = 'pending' | 'approved';

export type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  status: GuestbookStatus;
  created_at: string;
};

/** Input accepted by the helpers — runtime types are validated below, never trusted. */
export type ContactInput = { name: unknown; email: unknown; message: unknown };
export type GuestbookInput = { name: unknown; message: unknown };

/**
 * Input failed server-side validation. The API maps this to 400 and answers
 * with `err.message` — which is a fixed, safe string (never user or DB detail).
 */
export class ValidationError extends Error {
  constructor() {
    super('invalid input');
    this.name = 'ValidationError';
  }
}

/** Maxlength mirrors the form in contact.astro (D7); guestbook message capped at 500. */
const LIMITS = {
  name: 80,
  email: 120,
  contactMessage: 2000,
  guestbookMessage: 500,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Minimal blocklist while the guestbook is closed (D5): no links or markup —
 * the UI never renders HTML, but this keeps obvious spam/doxxing bait out.
 */
// Tag pattern is intentionally narrow (`</?letter...>`) so plain text like
// "a < b > c" is not rejected (see docs/be-fe-integration-check.md · B5).
const BLOCKED = [/https?:\/\//i, /\bwww\./i, /<\/?[a-z][^>]*>/i];

function requireText(value: unknown, max: number): string {
  if (typeof value !== 'string') throw new ValidationError();
  const text = value.trim();
  if (!text || text.length > max) throw new ValidationError();
  return text;
}

function requireEmail(value: unknown): string {
  const email = requireText(value, LIMITS.email);
  if (!EMAIL_RE.test(email)) throw new ValidationError();
  return email;
}

function requireClean(value: string): string {
  if (BLOCKED.some((re) => re.test(value))) throw new ValidationError();
  return value;
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const dir = process.env.DATA_DIR || join(process.cwd(), 'data');
  mkdirSync(dir, { recursive: true });
  db = new Database(join(dir, 'site.sqlite'));
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  // Migration for DBs created before moderation (D5 / open loop L6).
  const columns = db.prepare('PRAGMA table_info(guestbook)').all() as Array<{ name: string }>;
  if (!columns.some((c) => c.name === 'status')) {
    db.exec(`ALTER TABLE guestbook ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'`);
  }
  return db;
}

/** Validate + persist a contact message. Throws ValidationError → 400. */
export function insertContact(input: ContactInput): ContactMessage {
  const src = (input ?? {}) as Record<string, unknown>;
  const name = requireText(src.name, LIMITS.name);
  const email = requireEmail(src.email);
  const message = requireText(src.message, LIMITS.contactMessage);

  const row = getDb()
    .prepare(
      `INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)
       RETURNING id, name, email, message, created_at`
    )
    .get(name, email, message) as ContactMessage | undefined;
  if (!row) throw new Error('contact insert returned no row');
  return row;
}

/**
 * List guestbook entries. Default `all` includes pending rows (used by tests
 * and internal tooling) — public endpoints must pass `'approved'` explicitly.
 */
export function listGuestbook(status: 'all' | GuestbookStatus = 'all'): GuestbookEntry[] {
  const database = getDb();
  if (status === 'all') {
    return database
      .prepare('SELECT id, name, message, status, created_at FROM guestbook ORDER BY id DESC')
      .all() as GuestbookEntry[];
  }
  return database
    .prepare(
      `SELECT id, name, message, status, created_at FROM guestbook
       WHERE status = ? ORDER BY id DESC`
    )
    .all(status) as GuestbookEntry[];
}

/**
 * Validate + persist a guestbook entry. New rows are always `pending` —
 * nothing reaches the public list until an approval step exists (D5 / L6).
 * Throws ValidationError → 400.
 */
export function insertGuestbook(input: GuestbookInput): GuestbookEntry {
  const src = (input ?? {}) as Record<string, unknown>;
  const name = requireClean(requireText(src.name, LIMITS.name));
  const message = requireClean(requireText(src.message, LIMITS.guestbookMessage));

  const row = getDb()
    .prepare(
      `INSERT INTO guestbook (name, message, status) VALUES (?, ?, 'pending')
       RETURNING id, name, message, status, created_at`
    )
    .get(name, message) as GuestbookEntry | undefined;
  if (!row) throw new Error('guestbook insert returned no row');
  return row;
}

/**
 * Moderation step (L6): approve one entry so GET /api/guestbook may return it.
 * Internal only — exposed through scripts/guestbook-approve.mjs, never a route.
 * Returns null when the id does not exist.
 */
export function approveGuestbook(id: number): GuestbookEntry | null {
  const row = getDb()
    .prepare(
      `UPDATE guestbook SET status = 'approved' WHERE id = ?
       RETURNING id, name, message, status, created_at`
    )
    .get(id) as GuestbookEntry | undefined;
  return row ?? null;
}
