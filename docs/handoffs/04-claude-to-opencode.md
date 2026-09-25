# Handoff: Claude (frontend) → OpenCode (backend)

Timestamp: 2026-09-25 12:30 +07:00
Task: Lab 04 Frontend pages → Lab 05 Backend API + SQLite
Status: IMPLEMENTED (UI) · NEEDS_REVIEW (PR)

## What changed

- UI ทุกหน้าจาก `docs/PROFILE.md` + `docs/DECISIONS.md` (D1–D9): ธีมดำ/แดงเบอร์กันดี · nav ภาษาไทย (หน้าแรก · เกี่ยวกับ · ความสนใจ · สมุดเยี่ยม · ติดต่อ)
- Contact: ฟอร์มเดิม `{name, email, message}` → `POST /api/contact` · UI แยกข้อความตาม status: 2xx · 400 · 501 · อื่น ๆ · network error · ไม่แสดง error body ดิบ
- Guestbook: หน้า "ยังไม่เปิด" — ไม่มีฟอร์ม ไม่มี fetch (D5 แก้ไข · ลบ `innerHTML` เดิมที่เสี่ยง XSS)
- `src/lib/profile.ts`: เพิ่ม `tagline` · `bioParagraphs` · `heroPool` · ตัด emoji นำหน้า list item

## Files

- `src/layouts/BaseLayout.astro` · `src/components/ContactCta.astro` · `src/pages/{index,about,interests,contact,guestbook}.astro`
- `src/lib/profile.ts` · `tests/profile.test.ts`
- `docs/fe-be-contract-check.md` (OpenCode เขียน · call ข้าม harness) · `docs/DECISIONS.md` (D5 แก้ไข)

## Verification

- Unit / smoke: PASS — `npm test` 11/11 · `npm run build` ผ่าน
- E2E: PASS — `npx playwright test` 2/2 กับ server ที่ build แล้ว (`PLAYWRIGHT_BASE_URL=http://127.0.0.1:4399`)
- Labs (`npm run test:labs`): FAIL โดย design — API ยัง `NOT_IMPLEMENTED` (งาน Lab 05)
- Manual / localhost: ทุกหน้า 200 · `/nope` 404 · ไม่มี horizontal scroll ที่ 390px · Contact แสดง "ช่องทางนี้ยังไม่เปิดรับข้อความ…" เมื่อ API ตอบ 501

## Assumptions to challenge

1. UI แยกข้อความตาม **status อย่างเดียว** ไม่อ่าน `body.error` — ถ้า backend อยากให้ข้อความละเอียดขึ้น ต้องตกลงรหัส error ก่อน (ยังไม่อยู่ใน scope)
2. Guestbook ยังไม่เปิดใน v1 (D5) — Lab 05 implement API + ผ่าน `test:labs` ได้ แต่**ไม่ต้อง**เปิดฟอร์มบนหน้าเว็บ · ถ้าจะเปิด UI ต้องมี moderation ก่อนและ render ด้วย escaping เท่านั้น

## Request to next agent

Implement ใน Lab 05 (OpenCode · agent `backend`) ตาม `docs/DECISIONS.md` D5 · D7 และ `docs/fe-be-contract-check.md`:

- `insertContact` / `listGuestbook` / `insertGuestbook` ใน `src/lib/db.ts` ให้ `npm run test:labs` เขียว
- validation ฝั่ง server: required · trim · email format · maxlength 80 / 120 / 2000 (ตรงฟอร์ม) → **400**
- runtime/DB error → **500** (ตอนนี้ `api/contact.ts` และ `api/guestbook.ts` POST map เป็น 400) · ตอบ error คงที่ ห้ามส่ง `err.message` ดิบ
- เตรียม guestbook moderation (สถานะ pending/approved หรือ blocklist) — ถ้าไม่ทันให้เปิด open loop
- **อย่าแตะ UI** (`src/pages/*.astro` · `src/layouts/` · `src/components/`) · field names ของ Contact ต้องคงเดิม

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md`
- [x] `docs/DECISIONS.md` (D5 แก้ไข · L3/L4 ทำ UI ไปก่อน)
- [x] อื่น ๆ: `docs/fe-be-contract-check.md`

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = OpenCode (Lab 05) — หลัง commit นี้
