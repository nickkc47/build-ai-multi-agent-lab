# Project Status

> อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 +07:00  
Updated by: Claude

## Current goal

- ปิดเกณฑ์พร้อม Frontend ใน `docs/DECISIONS.md` → เริ่ม Lab 04

## Done

- Lab 00: init · agents · hot state · public-site-safe (commit แล้ว)
- Lab 01: `docs/PROFILE.md` (valentine · Dota 2 Carry · ธีมดำ + แดงเบอร์กันดี · นามแฝงเท่านั้น) + Brainstorm (proposed)
- Lab 02: `docs/DEBATE.md` (Brand · UX · Devil) → `docs/DECISIONS.md` D1–D9 (รันซ้ำแบบ Agent Teams 2 รอบ — nav คำไทยตรง ๆ · Hero Pool เป็น proof) · แก้ PROFILE: Headline ใหม่ · เพิ่ม `## Tagline` · กติกาเสียงใน Tone (2026-09-25)
- L2: `parseProfile()` อ่านทุกบรรทัด · รองรับ `## Tagline` · `bioParagraphs` แสดงบน Home/About · เทสต์ `tests/profile.test.ts` · เพิ่ม `## Hero Pool` (PL · LS · Slark · Spectre · Razor) ใน PROFILE

## In progress

- —

## Blocked

- Lab 04 รอเกณฑ์พร้อม Frontend (DECISIONS) — L3 · L4 ใน OPEN_LOOPS

## Next actions

1. L3 / L4 — เจ้าของเติม PROFILE (เหตุผล Hero Pool · ช่องทางติดต่อ · Bio มุม B) + ตอบคำถาม privacy
2. Lab 03 Issues → Lab 04 UI ตาม D3–D8

## Files changed in latest session

- `src/lib/profile.ts` · `src/pages/index.astro` · `src/pages/about.astro` · `tests/profile.test.ts` · `docs/PROFILE.md` · `docs/STATUS.md` · `docs/OPEN_LOOPS.md`

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- PROFILE มีหัวข้อ `## Privacy`: ห้ามแสดงข้อมูลส่วนตัวบนเว็บ
