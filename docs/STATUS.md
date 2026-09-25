# Project Status

> อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 12:30 +07:00  
Updated by: Claude

## Current goal

- Lab 05 Backend (OpenCode) — implement Contact/Guestbook API ตาม handoff `docs/handoffs/04-claude-to-opencode.md`

## Done

- Lab 00–01: init · agents · hot state · `docs/PROFILE.md` (valentine · Dota 2 Carry · นามแฝงเท่านั้น)
- Lab 02: `docs/DEBATE.md` (Agent Teams 2 รอบ) → `docs/DECISIONS.md` D1–D9 · L2 parser ปิดแล้ว
- Lab 03: issues #21–#26 จาก D-ids (MCP 5 · `gh` 1) · `## Lab 03 — MCP vs gh` ใน DECISIONS
- Lab 04: UI ทุกหน้า (ธีมดำ/แดงเบอร์กันดี · nav ไทย · Hero Pool · Contact microcopy · Guestbook "ยังไม่เปิด") บน branch `lab-04-frontend` · `docs/fe-be-contract-check.md` จาก OpenCode · `npm test` 11/11 · build · e2e 2/2 (2026-09-25)

## In progress

- PR Lab 04 รอ review/merge

## Blocked

- —

## Next actions

1. Merge PR Lab 04 → เปิด OpenCode ทำ Lab 05 ตาม handoff (writer STATUS/OPEN_LOOPS รอบถัดไป = OpenCode)
2. L3 / L4 — เจ้าของเติม PROFILE (เหตุผล Hero Pool · ช่องทางติดต่อ · Bio มุม B) + ตอบคำถาม privacy · ไม่ต้องแก้โค้ด

## Files changed in latest session

- `src/layouts/BaseLayout.astro` · `src/components/ContactCta.astro` · `src/pages/*.astro` · `src/lib/profile.ts` · `tests/profile.test.ts`
- `docs/DECISIONS.md` · `docs/fe-be-contract-check.md` · `docs/handoffs/04-claude-to-opencode.md` · `docs/STATUS.md` · `docs/OPEN_LOOPS.md`

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- PROFILE มีหัวข้อ `## Privacy`: ห้ามแสดงข้อมูลส่วนตัวบนเว็บ
