# Project Status

> อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 16:25 +07:00  
Updated by: Claude

## Current goal

- L6/L9 เสร็จ → merge PR Lab 05b (#31) + PR hardening → Lab 06 (Playwright MCP + a11y)

## Done

- Lab 00–01: init · agents · hot state · `docs/PROFILE.md` (valentine · Dota 2 Carry · นามแฝงเท่านั้น)
- Lab 02: `docs/DEBATE.md` (Agent Teams 2 รอบ) → `docs/DECISIONS.md` D1–D9 · L2 parser ปิดแล้ว
- Lab 03: issues #21–#26 จาก D-ids (MCP 5 · `gh` 1) · `## Lab 03 — MCP vs gh` ใน DECISIONS
- Lab 04: UI ทุกหน้า (ธีมดำ/แดงเบอร์กันดี · nav ไทย · Hero Pool · Contact microcopy · Guestbook "ยังไม่เปิด") · `docs/fe-be-contract-check.md` จาก OpenCode · PR #27 merge แล้ว (2026-09-25)
- D10 ไกด์ฮีโร่ + หน้าเมตา · PR #28 merge แล้ว (รวมแก้ `.gitignore` `/data/` ให้ track `src/data/`) (2026-09-25)
- Lab 05: API ทำงานจริง — `insertContact`/`listGuestbook`/`insertGuestbook` + `src/lib/api.ts` (error คงที่ 400/500 · ไม่ส่ง `err.message`) · guestbook คอลัมน์ `status` pending/approved + blocklist (D5) · `test:labs` 2/2 · `npm test` 17/17 · build · manual curl ครบ · `docs/be-fe-integration-check.md` จาก Claude · PR #29 review (Claude) + merge แล้ว (2026-09-25)
- L8: Contact แยกข้อความ 5xx "ระบบขัดข้องชั่วคราว ข้อความยังไม่ถูกส่ง…" · ลบ branch 501 · ตรวจในเบราว์เซอร์ 201/400/500/502/network ครบ · PR #30 merge แล้ว
- Lab 05b: swarm 8/20 turns (3 subagent รีวิว + 5 รอบแก้/ตรวจ) · a11y 8 ข้อ · หน้า 404 · แหล่งข้อมูล D10 · `docs/SWARM.md` (2026-09-25)
- L3/L4: Bio มุม B (เจ้าของอนุมัติ) · Interests ข้อ 1 ไม่โยงตัวตน · Contact = ฟอร์มอย่างเดียว · privacy ตอบครบ
- L6/L9: backend hardening ตาม handoff `05b-claude-to-opencode.md` — rate limit 5/10min ต่อ IP (contact + guestbook คนละ bucket) → **429** · body ≤ 8 KB → **413** · 201 ตอบน้อยลง (contact `{id, created_at}` · guestbook + `status`) ตาม B2 · `/api/interests` try/catch → `errorResponse` · approve step: `approveGuestbook` + `scripts/guestbook-approve.mjs` (list / `<id>`) · **ตัดสิน:** guestbook POST ยังรับ (201 `pending`) เพราะ moderation ครบแล้ว (blocklist + pending + rate limit + approve) · `npm test` 25/25 · `test:labs` 2/2 · build · manual curl ครบ (2026-09-25)
- L10: ฟอร์ม Contact แยกข้อความ 413 ("ข้อความยาวเกินไป…") / 429 ("ส่งข้อความถี่เกินไป…") · ข้อความยังอยู่ในฟอร์ม · ตรวจในเบราว์เซอร์ (`RATE_LIMIT_MAX=2`) 413/201/429 ครบ · review PR #32 (Claude) ไม่มีข้อบล็อก (2026-09-25)

## In progress

- PR Lab 05b (branch `lab-05b-swarm`) รอ review/merge
- PR backend hardening (branch `lab-05c-backend-hardening` · base `lab-05b-swarm` แบบ stacked) รอ review/merge
- PR L10 (branch `fix/contact-429-413` · base `lab-05c-backend-hardening`) รอ merge

## Blocked

- —

## Next actions

1. Merge ตามลำดับ #31 → #32 → PR L10 → Lab 06 Playwright (ตั้ง `RATE_LIMIT_MAX=0` ตอนรัน e2e)
2. เจ้าของเปิดฟอร์ม Guestbook เมื่อพร้อม (D5 — moderation ครบแล้ว เหลือ UI)

## Files changed in latest session

- `src/pages/contact.astro` (branch 413 / 429) · `docs/STATUS.md` · `docs/OPEN_LOOPS.md`

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- PROFILE มีหัวข้อ `## Privacy`: ห้ามแสดงข้อมูลส่วนตัวบนเว็บ
