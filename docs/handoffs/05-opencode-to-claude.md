# Handoff: OpenCode (backend) → Claude (frontend)

Timestamp: 2026-09-25 15:36 +07:00
Task: Lab 05 Backend API เสร็จ → ส่งคืนฝั่ง frontend · เตรียม Lab 05b / 06
Status: IMPLEMENTED (PR #29) · NEEDS_REVIEW

## What changed

- `src/lib/db.ts`: implement `insertContact` / `listGuestbook` / `insertGuestbook` — validation ฝั่ง server (required · trim · email format · maxlength 80/120/2000 ตรงฟอร์ม D7 · guestbook name ≤80 / message ≤500) → `ValidationError`
- `src/lib/api.ts` (ใหม่): error mapping คงที่ให้ทุก route เหมือนกัน — validation → **400** `{error:'invalid input'}` · JSON พัง → **400** `{error:'invalid json'}` · runtime/DB → **500** `{error:'server error'}` (log ฝั่ง server · **ไม่ส่ง `err.message` ดิบ**)
- **Contract Contact ปัจจุบัน = 201 / 400 / 500 — ไม่มี 501 แล้ว** (handoff 04 ยังเขียนถึง 501 · ดู F6 ในรายงาน)
- Guestbook (D5): คอลัมน์ `status` pending/approved + migration สำหรับ DB เก่า · POST เก็บเป็น `pending` เสมอ · GET ตอบเฉพาะ `approved` (ตอนนี้ได้ `[]` เสมอ) · blocklist ลิงก์ + HTML tag (regex แคบ `/<\/?[a-z][^>]*>/i` — `a < b > c` ผ่าน)
- ไม่แตะ UI · field names ของ Contact คงเดิมตาม handoff 04

## Files

- `src/lib/db.ts` · `src/lib/api.ts` (new) · `src/pages/api/contact.ts` · `src/pages/api/guestbook.ts`
- `docs/be-fe-integration-check.md` (Claude เขียน · call ข้าม harness · ฉบับ 2 ตรงเลขบรรทัดปัจจุบัน)
- ไม่มีไฟล์ใน `src/pages/*.astro` / `src/layouts/` / `src/components/` ถูกแก้

## Verification

- Unit / smoke: PASS — `npm test` 17/17
- Labs: PASS — `npm run test:labs` 2/2 (เดิมแดง 2/2 NOT_IMPLEMENTED ตั้งแต่ template)
- Build: PASS — `npm run build`
- Manual / localhost (`npm run dev`): contact 201 · 400 ครบเคส (missing · bad email · maxlength 81 · bad JSON) · guestbook 201 `pending` · 400 (ลิงก์ · tag · 501 ตัวอักษร) · GET `[]` · `/contact` 200 · `/guestbook` 200 · `/nope` 404

## Assumptions to challenge

1. **POST `/api/guestbook` เปิดรับจากภายนอกแล้ว** แม้ UI ปิด — ยอมรับเพราะ README step 3 ใช้ curl ทดสอบ และ moderation `pending` กันไม่ให้อะไรขึ้นหน้าเว็บ (ตรงเจตนา D5) แต่ยังไม่มี rate limit → แถว `pending` สะสมได้ไม่จำกัด · **ติดตามใน L6** ห้ามเปิดฟอร์มบนเว็บก่อนปิด L6
2. **Email regex เข้มกว่าเบราว์เซอร์** (`EMAIL_RE` ไม่ยอม `a@localhost`) — คงไว้ · ข้อความ 400 ฝั่ง UI ถูกความหมายอยู่แล้ว · ถ้าจะผ่อนให้ตรง HTML spec ต้องคุยกันก่อนแก้

## Request to next agent

- **Claude (frontend):** รีวิว PR #29 · ทำ **L8** ในรอบ frontend — F1 แยกข้อความ 5xx · F2 เก็บ/คอมเมนต์ branch 501 ที่ `contact.astro:61-64` — ตาม `docs/be-fe-integration-check.md`
- **ห้ามแตะ** `src/lib/db.ts` / `src/lib/api.ts` / `src/pages/api/**` โดยไม่ตกลง contract กับ backend ก่อน (เช่น B2 ที่จะลด response 201 เหลือ `{id, created_at}`)
- ลำดับถัดไปของคอร์ส: merge PR #29 → Lab 05b (`labs/lab-05b-swarm-to-green`) หรือ Lab 06 Playwright

## Canonical state updated

- [x] `docs/STATUS.md` (Lab 05 → Done · PR #29 → In progress · Next actions)
- [x] `docs/OPEN_LOOPS.md` (L5 ปิด · L6 ขยาย approve+rate limit · L8 เปิดให้ frontend)
- [ ] `docs/DECISIONS.md` — ไม่มี decision ใหม่ที่อนุมัติแล้ว
- [x] อื่น ๆ: `docs/be-fe-integration-check.md`

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = **Claude** — commit ของ handoff ไฟล์นี้คือจุดส่งงาน · OpenCode ไม่แก้ไฟล์สองไฟล์นี้อีกจนกว่าจะมี handoff กลับมา
