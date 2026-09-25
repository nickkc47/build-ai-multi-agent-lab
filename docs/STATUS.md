# Project Status

> อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 14:57 +07:00  
Updated by: OpenCode

## Current goal

- Lab 05 done → merge PR #29 แล้วไป Lab 05b (swarm to green) หรือ Lab 06 (Playwright)

## Done

- Lab 00–01: init · agents · hot state · `docs/PROFILE.md` (valentine · Dota 2 Carry · นามแฝงเท่านั้น)
- Lab 02: `docs/DEBATE.md` (Agent Teams 2 รอบ) → `docs/DECISIONS.md` D1–D9 · L2 parser ปิดแล้ว
- Lab 03: issues #21–#26 จาก D-ids (MCP 5 · `gh` 1) · `## Lab 03 — MCP vs gh` ใน DECISIONS
- Lab 04: UI ทุกหน้า (ธีมดำ/แดงเบอร์กันดี · nav ไทย · Hero Pool · Contact microcopy · Guestbook "ยังไม่เปิด") · `docs/fe-be-contract-check.md` จาก OpenCode · PR #27 merge แล้ว (2026-09-25)
- D10 ไกด์ฮีโร่ + หน้าเมตา บน branch `feat/hero-guides` · PR #28 merge แล้ว · `npm test` 16/16 (2026-09-25)
- Lab 05: API ทำงานจริง — `insertContact`/`listGuestbook`/`insertGuestbook` + `src/lib/api.ts` (error คงที่ 400/500 · ไม่ส่ง `err.message`) · guestbook คอลัมน์ `status` pending/approved + blocklist (D5) · `test:labs` 2/2 · `npm test` 17/17 · build · manual curl ครบ · `docs/be-fe-integration-check.md` จาก Claude · PR #29 (2026-09-25)

## In progress

- PR Lab 05 (#29) รอ review/merge

## Blocked

- —

## Next actions

1. Merge PR #29 → Lab 05b (`labs/lab-05b-swarm-to-green`) หรือ Lab 06 Playwright
2. L3 / L4 — เจ้าของเติม PROFILE (เหตุผล Hero Pool · ช่องทางติดต่อ · Bio มุม B) + ตอบคำถาม privacy · ไม่ต้องแก้โค้ด
3. L8 — รอบ frontend: แยกข้อความ 500 · เก็บ branch 501 (ตาม `docs/be-fe-integration-check.md`)

## Files changed in latest session

- `src/lib/db.ts` · `src/lib/api.ts` (new) · `src/pages/api/{contact,guestbook}.ts`
- `docs/be-fe-integration-check.md` (Claude เขียน · call ข้าม harness) · `docs/STATUS.md` · `docs/OPEN_LOOPS.md`

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- PROFILE มีหัวข้อ `## Privacy`: ห้ามแสดงข้อมูลส่วนตัวบนเว็บ
