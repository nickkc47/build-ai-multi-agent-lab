# Handoff: Claude (frontend) → OpenCode (backend)

Timestamp: 2026-09-25 16:05 +07:00
Task: L6 + L9 — backend hardening ก่อนเปิด Guestbook / ก่อน ship (Lab 08)
Status: NEEDS_REVIEW (PR #31 Lab 05b) · งานใหม่ฝั่ง backend = IN_PROGRESS เมื่อ OpenCode รับ

## What changed

- Lab 05 (PR #29) · L8 (PR #30) merge แล้ว · Lab 05b swarm (PR #31) — แก้เฉพาะ UI: a11y ฟอร์ม · `404.astro` · แหล่งข้อมูล D10 · ไม่แตะ `src/lib/db.ts` / `src/lib/api.ts` / `src/pages/api/**`
- ฟอร์ม Contact ตอนนี้ trim ค่าก่อนส่ง และจับช่องว่างล้วนฝั่ง UI (ไม่ยิง request) — contract เดิม 201 / 400 / 500 ไม่เปลี่ยน · field names เดิม

## Files

- อ่าน: `docs/SWARM.md` (Gaps) · `docs/OPEN_LOOPS.md` (L6 · L9) · `docs/be-fe-integration-check.md` (B2–B4) · review comment ใน PR #29

## Verification

- Unit / smoke: PASS — `npm test` 17/17
- Labs: PASS — `npm run test:labs` 2/2
- Manual: Contact demo 201 → แถวใน SQLite · guestbook POST → `pending` · GET `[]`

## Assumptions to challenge

1. Rate limit แบบ in-memory ต่อ IP พอสำหรับ single instance (Node standalone) — ถ้า deploy หลาย instance ต้องคิดใหม่
2. การ approve guestbook เป็น script/CLI ภายใน (ไม่ใช่ route สาธารณะ) — ไม่มี auth ในเว็บนี้

## Request to next agent

OpenCode · agent `backend` — ทำใน ownership ตัวเองเท่านั้น:

- **L9** `/api/contact`: rate limit ต่อ IP (เช่น 5 ครั้ง / 10 นาที → **429** body คงที่) · จำกัดขนาด body (เช็ค `content-length` ≤ 8 KB ก่อน parse → **413**) · (เลือก) 201 ตอบแค่ `{id, created_at}` · `/api/interests` ใส่ try/catch → `errorResponse`
- **L6** Guestbook: rate limit เดียวกันบน POST · script approve (`pending` → `approved`) เช่น `node scripts/guestbook-approve.mjs <id>` · หรือ POST ตอบ 403 จนกว่าจะเปิด — ตัดสินแล้วบันทึกเหตุผลใน PR
- ถ้าเพิ่ม status code ใหม่ (429 / 413 / 403) → เขียนใน handoff กลับ · ฝั่ง UI แสดงผ่าน branch 5xx/อื่น ๆ อยู่แล้ว แต่ 429 ควรมีข้อความของตัวเอง — **อย่าแก้ UI เอง** แจ้งกลับมา
- ห้ามแก้ไฟล์ test ให้ผ่านปลอม · `test:labs` ต้องยังเขียว · เพิ่มเทสต์สำหรับ 429 / 413 ได้

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md` (L6 · L9 owner = OpenCode)
- [ ] `docs/DECISIONS.md` — ไม่มี decision ใหม่
- [x] อื่น ๆ: `docs/SWARM.md`

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = **OpenCode** — หลัง merge PR #31 และ commit นี้
