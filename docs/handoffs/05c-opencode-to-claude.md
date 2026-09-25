# Handoff: OpenCode (backend) → Claude (frontend)

Timestamp: 2026-09-25 16:14 +07:00
Task: L6 + L9 backend hardening เสร็จ — ส่งคืนฝั่ง frontend · เตรียม Lab 06
Status: IMPLEMENTED (PR hardening) · NEEDS_REVIEW

## What changed

ตาม `docs/handoffs/05b-claude-to-opencode.md` ครบทุกข้อ · **ไม่แตะ UI**:

- **Rate limit (L9 · L6):** in-memory ต่อ IP · **5 ครั้ง / 10 นาที** · contact กับ guestbook คนละ bucket · ฝ่า → **429** `{error:'too many requests'}` · ปรับได้ด้วย env `RATE_LIMIT_MAX` (≤0 = ปิด · ใช้ตอนรัน e2e) · `RATE_LIMIT_WINDOW_MS`
- **Body size cap (L9):** ≤ **8 KB** (เช็ค `content-length` ก่อน แล้วเช็คข้อความจริงกัน header โกหก) → **413** `{error:'payload too large'}`
- **201 ตอบน้อยลง (B2 · review PR #29):** contact → `{id, created_at}` · guestbook → `{id, status, created_at}` — ไม่ส่ง email/ชื่อ/ข้อความกลับ · UI ไม่ได้อ่าน body อยู่แล้ว (res.ok) จึงไม่กระทบ
- **`/api/interests` (L9):** try/catch → `errorResponse` (500 body คงที่ · ไม่ leak `err.message`)
- **Guestbook approve (L6):** `approveGuestbook(id)` ใน `db.ts` + CLI **`node scripts/guestbook-approve.mjs list | <id>`** (internal เท่านั้น · ไม่มี route สาธารณะ · ต้องใช้ Node 22.18+ เพราะ import `db.ts` ผ่าน type stripping)
- **ตัดสินแล้ว (L6):** POST `/api/guestbook` **ยังรับ** (201 `pending`) ไม่ใช่ 403 — เพราะ moderation ครบชั้นแล้ว (blocklist + pending + rate limit + approve) ไม่มีอะไรขึ้นหน้าเว็บโดยไม่ผ่าน approve · ตรงเจตนา D5 และ README Lab 05 ยังใช้ curl ทดสอบได้ · **ฟอร์มบน UI ยังปิดเหมือนเดิม** เจ้าของเปิดเองเมื่อพร้อม

## Files

- `src/lib/api.ts` (rate limit · readJsonBody · error classes 429/413) · `src/lib/db.ts` (`approveGuestbook`)
- `src/pages/api/{contact,guestbook,interests}.ts` · `scripts/guestbook-approve.mjs` (new) · `tests/api-hardening.test.ts` (new · 8 เคส)
- ไม่มีไฟล์ใน `src/pages/*.astro` / `src/layouts/` / `src/components/` ถูกแก้

## Verification

- Unit / smoke: PASS — `npm test` **25/25** (เดิม 17 + hardening 8: 201 shape · 400 ×2 · 413 · 429 + isolated IP · bucket แยก · approve roundtrip · interests)
- Labs: PASS — `npm run test:labs` 2/2 (ไม่ได้แตะ test เดิม)
- Build: PASS
- Manual / localhost (`npm run dev` · เพดานจริง 5/10min): contact 201 `{id,created_at}` → 400 → **413 (9KB)** → 400 → 201 → **429 (ครั้งที่ 6)** · guestbook 201 `pending` → 400 (ลิงก์) → GET `[]` → `guestbook-approve.mjs list` → approve #3 → GET มีเฉพาะ #3 · `/api/interests` 200

## Assumptions to challenge

1. **Rate limit in-memory ต่อ instance** (ตาม assumption 1 ของ handoff 05b) — ถ้ามี reverse proxy ทุก request จะกลายเป็น IP เดียว → ต้องทำ trusted-proxy ก่อนปรับเพดาน
2. **`x-forwarded-for` เป็น fallback เท่านั้น** — ใช้ `clientAddress` (socket จริง) ก่อน · header ใช้ตอนทดสอบ/adapter ไม่ให้ IP
3. 429/413 เป็นสัญญาใหม่ที่ UI ยังไม่มีข้อความเฉพาะ (ตกลงไว้ใน handoff 05b ว่าให้แจ้งกลับ ไม่แตะ UI เอง)

## Request to next agent

- **Claude (frontend) — ทำ L10:** ข้อความ 429 ("ส่งข้อความถี่เกินไป รอสักครู่แล้วลองใหม่") และ 413 ในฟอร์ม Contact · branch 5xx/อื่น ๆ ที่เหลือคงเดิม · ดูรายละเอียดใน `docs/OPEN_LOOPS.md` L10
- **e2e (Lab 06):** ตั้ง `RATE_LIMIT_MAX=0` (หรือค่าสูง) ใน environment ตอนรัน Playwright ไม่งั้นเคสส่งฟอร์มเกิน 5 ครั้ง/10 นาที จะโดน 429
- ถ้าจะเปิดฟอร์ม Guestbook บนเว็บ: workflow = โพสต์ → `node scripts/guestbook-approve.mjs list` → อนุมัติ → GET แสดงเฉพาะ approved · render ด้วย escaping เท่านั้น (F4 ใน `docs/be-fe-integration-check.md`)

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md` (L6 · L9 ปิด · L10 เปิดให้ frontend)
- [ ] `docs/DECISIONS.md` — ไม่มี decision ใหม่ (L6 ตัดสินเรื่อง POST ยังรับ บันทึกใน PR + ไฟล์นี้)
- [x] อื่น ๆ: tests ใหม่ `tests/api-hardening.test.ts`

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = **Claude** — หลัง commit นี้ · OpenCode ไม่แตะสองไฟล์นี้จนกว่าจะมี handoff กลับ
