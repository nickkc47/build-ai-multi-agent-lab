# Project Status

> อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 16:00 +07:00  
Updated by: Claude

## Current goal

- Lab 05b เสร็จ → Lab 06 (Playwright MCP + a11y)

## Done

- Lab 00–01: init · agents · hot state · `docs/PROFILE.md` (valentine · Dota 2 Carry · นามแฝงเท่านั้น)
- Lab 02: `docs/DEBATE.md` (Agent Teams 2 รอบ) → `docs/DECISIONS.md` D1–D9 · L2 parser ปิดแล้ว
- Lab 03: issues #21–#26 จาก D-ids (MCP 5 · `gh` 1) · `## Lab 03 — MCP vs gh` ใน DECISIONS
- Lab 04: UI ทุกหน้า (ธีมดำ/แดงเบอร์กันดี · nav ไทย · Hero Pool · Contact microcopy · Guestbook "ยังไม่เปิด") · `docs/fe-be-contract-check.md` จาก OpenCode · PR #27 merge แล้ว (2026-09-25)
- D10 ไกด์ฮีโร่ + หน้าเมตา · PR #28 merge แล้ว (รวมแก้ `.gitignore` `/data/` ให้ track `src/data/`) (2026-09-25)
- Lab 05: API ทำงานจริง — `insertContact`/`listGuestbook`/`insertGuestbook` + `src/lib/api.ts` (error คงที่ 400/500 · ไม่ส่ง `err.message`) · guestbook คอลัมน์ `status` pending/approved + blocklist (D5) · `test:labs` 2/2 · `npm test` 17/17 · build · manual curl ครบ · `docs/be-fe-integration-check.md` จาก Claude · PR #29 review (Claude) + merge แล้ว (2026-09-25)
- L8: Contact แยกข้อความ 5xx "ระบบขัดข้องชั่วคราว ข้อความยังไม่ถูกส่ง…" · ลบ branch 501 · ตรวจในเบราว์เซอร์ 201/400/500/502/network ครบ · PR #30 merge แล้ว
- Lab 05b: swarm 8/20 turns (3 subagent รีวิว + 5 รอบแก้/ตรวจ) · a11y 8 ข้อ · หน้า 404 · แหล่งข้อมูล D10 · `docs/SWARM.md` (2026-09-25)

## In progress

- PR Lab 05b (branch `lab-05b-swarm`) รอ review/merge

## Blocked

- —

## Next actions

1. Merge PR Lab 05b → Lab 06 Playwright
2. L3 / L4 — เจ้าของเติม PROFILE (เหตุผล Hero Pool · ช่องทางติดต่อ · Bio มุม B) + ตอบคำถาม privacy · ไม่ต้องแก้โค้ด
3. L6 / L9 — backend (OpenCode): guestbook approve + rate limit · contact rate limit + body size · `/api/interests` try/catch

## Files changed in latest session

- `src/layouts/BaseLayout.astro` · `src/pages/contact.astro` · `src/pages/404.astro` (new) · `src/pages/heroes/[slug].astro` · `src/pages/meta.astro`
- `docs/SWARM.md` (new) · `docs/STATUS.md` · `docs/OPEN_LOOPS.md`

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- PROFILE มีหัวข้อ `## Privacy`: ห้ามแสดงข้อมูลส่วนตัวบนเว็บ
