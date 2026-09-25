#!/usr/bin/env node
/**
 * Internal moderation CLI for the guestbook (L6) — NOT a public route.
 * The site has no auth, so approval happens from this script only.
 *
 * Usage:
 *   node scripts/guestbook-approve.mjs list    # show pending entries
 *   node scripts/guestbook-approve.mjs <id>    # approve entry <id>
 *
 * DATA_DIR picks the database (default ./data/site.sqlite).
 * Needs Node 22.18+ (imports src/lib/db.ts via native type stripping).
 */
import { approveGuestbook, listGuestbook } from '../src/lib/db.ts';

const [cmd] = process.argv.slice(2);

if (cmd === 'list') {
  const rows = listGuestbook('pending');
  if (rows.length === 0) {
    console.log('(no pending entries)');
  } else {
    for (const r of rows) {
      console.log(`#${r.id} ${r.created_at} <${r.name}> ${r.message.slice(0, 60)}`);
    }
  }
} else if (cmd && /^\d+$/.test(cmd)) {
  const row = approveGuestbook(Number(cmd));
  if (!row) {
    console.error(`no guestbook entry #${cmd}`);
    process.exit(1);
  }
  console.log(`approved #${row.id} <${row.name}> — status=${row.status}`);
} else {
  console.error('usage: node scripts/guestbook-approve.mjs list | <id>');
  process.exit(1);
}
