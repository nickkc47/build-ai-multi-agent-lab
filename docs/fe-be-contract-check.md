# FE ↔ BE Contract Check — Contact / Guestbook / Interests

> รายงานจาก OpenCode (backend) ตาม `docs/_call-opencode-prompt.md` · 2026-09-25
> อ้างอิง: D5 (Guestbook ปิดใน v1) · D7 (ฟอร์ม Contact เดิม 3 ช่อง) ใน `docs/DECISIONS.md`
> ไฟล์ที่ตรวจ: `src/pages/contact.astro`, `src/pages/guestbook.astro`, `src/pages/api/{contact,guestbook,interests}.ts`, `src/lib/db.ts`

## ตรงกัน

- **Path + method:** UI ยิง `POST /api/contact` พร้อม `content-type: application/json` (`contact.astro:51-55`) ตรงกับ `POST` ใน `src/pages/api/contact.ts`
- **JSON fields ที่ส่ง:** UI ส่ง `Object.fromEntries(new FormData(form))` = `{name, email, message}` ตรงกับ signature ของ `insertContact({name, email, message})` ใน `src/lib/db.ts:50-54` และตรง D7 (ฟอร์มเดิม ไม่มีช่อง "เรื่อง")
- **ความยาวฟิลด์ฝั่ง UI:** `maxlength` 80 / 120 / 2000 (name / email / message) — backend ควรใช้เพดานเดียวกันตอน validate
- **Status code ที่ UI รองรับครบ:** `res.ok` (201) → ข้อความสำเร็จ + `form.reset()` · `400` → ข้อมูลไม่ครบ/อีเมลผิด · `501` → ยังไม่เปิดรับ · อื่น ๆ (รวม 500) → ส่งไม่สำเร็จ · `catch` → network error (`contact.astro:56-67`) — ตรงกับพฤติกรรม stub ปัจจุบันที่ map `NOT_IMPLEMENTED*` → 501 และ error อื่น → 400
- **Error body:** API ทุกตัวตอบ `{error: string}` เป็น JSON เสมอ — UI ไม่อ่าน body ของ error (แยกตาม status เท่านั้น) จึงไม่ขัดกัน
- **Guestbook ตาม D5:** หน้า `guestbook.astro` ไม่มีฟอร์ม ไม่มี `fetch` แสดงแค่ "ยังไม่เปิด" + CTA ไป Contact — สอดคล้องกับที่ API ยัง 501 ทั้ง GET และ POST และ comment ในหน้าระบุชัดว่าเปิดเมื่อมี validation + moderation และต้อง render ด้วย `textContent` / Astro escaping เท่านั้น
- **Interests:** `GET /api/interests` ตอบ 200 `{interests, source: 'profile'}` อ่านจาก `loadProfile()` โดยตรง ไม่แตะ DB — ไม่มีส่วนผูกกับ stub และไม่มี UI ฝั่ง client ยิงมาที่ endpoint นี้ตอนนี้

## ไม่ตรง (mismatch)

- **Contact 500 ไม่มีทางเกิดจาก stub ปัจจุบัน:** `api/contact.ts:20` map ทุก error ที่ไม่ใช่ `NOT_IMPLEMENTED` → **400** (ไม่มี branch 500) เมื่อ Lab 05 implement จริง หาก DB พัง (เช่น disk เต็ม/เขียนไม่ได้) แล้วโยน error ธรรมดา ผู้ใช้จะเห็นข้อความ "ข้อมูลไม่ครบหรือรูปแบบอีเมลไม่ถูกต้อง" ทั้งที่เป็นความผิดฝั่ง server — ผิดความหมายของ 400 และทำให้ debug ยาก
- **Guestbook GET กับ POST map error ไม่เหมือนกัน:** `GET` map error อื่น → 500 แต่ `POST` map error อื่น → 400 (`api/guestbook.ts:15,33`) — สัญญาไม่สม่ำเสมอในไฟล์เดียวกัน
- **ไม่มีการแยก "validation error" ออกจาก "server error" ในรูปแบบ body:** ตอนนี้ทุกอย่างคือ `{error: message}` โดย `message` มาจาก `err.message` ซึ่งอาจหลุดรายละเอียดภายใน (เช่น ชื่อตาราง/SQL) ออกสู่ client — UI ไม่แสดง แต่ response ยังรั่วอยู่ดี
- **UI ไม่ได้ส่ง header ระบุ charset/accept และไม่ได้ตรวจ content-type ของคำตอบ:** ไม่ใช่ปัญหาเร่งด่วน (API ตอบ JSON เสมอ) แต่ถ้า proxy หน้าเว็บตอบ HTML error (เช่น 502 จาก reverse proxy ตอน deploy) UI จะตกไปที่ branch "อื่น ๆ" ซึ่งรับได้ แต่ควรรู้ไว้ว่า `res.ok` เช็คแค่ status ไม่ได้เช็คว่า body เป็น JSON จริง
- **Guestbook ไม่มี mismatch กับ UI โดยตรง** (เพราะ UI ปิดสนิท) แต่ type `GuestbookEntry` ไม่มีฟิลด์สถานะ moderation — ถ้าเปิดในอนาคตโดยต้องคัดกรองก่อนแสดง schema ปัจจุบัน (id/name/message/created_at) ยังไม่รองรับ

## ข้อเสนอ (แยก frontend / backend)

### Frontend (Claude · `src/pages/`)

- **ไม่ต้องแก้อะไรใน v1** — การแยกข้อความตาม status (ok / 400 / 501 / อื่น / network) ครบและตรง D7 แล้ว error เป็นภาษาคนและไม่แสดง `err.message` ดิบ
- (เลือก) ถ้าอยากให้ข้อความ 400 เฉพาะเจาะจงขึ้นในอนาคต อาจอ่าน `body.error` เมื่อ backend ส่งรหัส error ที่เป็นมิตร (เช่น `EMAIL_INVALID`) — แต่ต้องตกลงรูปแบบกันก่อน ยังไม่ทำใน Lab 04/05

### Backend (OpenCode · Lab 05 · `src/lib/db.ts` + `src/pages/api/`)

- **แยก error เป็น 3 ชั้นให้ชัด:** validation (ช่องว่าง / อีเมลผิดรูปแบบ / เกิน maxlength 80·120·2000) → 400 · DB/runtime อื่น → 500 · อย่าให้ error runtime ตกไปเป็น 400 — แก้ทั้ง `api/contact.ts` และ `api/guestbook.ts` ให้ map เหมือนกัน (เช่น ใช้ custom error ชื่อ `ValidationError` หรือ prefix `VALIDATION:`)
- **อย่าส่ง `err.message` ดิบออก client:** ตอบ `{error: 'invalid input'}` / `{error: 'server error'}` แบบคงที่ แล้ว log รายละเอียดฝั่ง server — กันรั่วโครงสร้าง DB
- **Validate ฝั่ง server ซ้ำทุกเงื่อนไขของ UI:** required ทั้ง 3 ช่อง, trim, email format, maxlength เท่ากับฟอร์ม — UI ใช้ `novalidate` + `checkValidity()` ซึ่งข้ามได้ง่าย
- **Guestbook (ตาม D5 — เตรียมก่อนเปิด ยังไม่เปิด):**
  - validation: `name` (≤80) + `message` (จำกัดความยาว เช่น ≤500) required, trim, ปฏิเสธช่องว่างล้วน
  - moderation: เพิ่มคอลัมน์สถานะ (เช่น `approved`/`pending`) หรืออย่างน้อย blocklist คำ/ลิงก์ ก่อนเปิด POST จริง — schema ปัจจุบันยังไม่มี ต้องออกแบบ migration ตอน Lab 05 หรือบันทึกเป็น open loop
  - escaping: ฝั่ง API เก็บข้อความดิบใน DB ได้ แต่ต้องทำให้ชัดในเอกสารว่า **หน้าเว็บต้อง render ด้วย `textContent` / Astro escaping เท่านั้น** (ตาม comment ใน `guestbook.astro`) — GET ไม่ต้อง escape เอง แต่ห้ามส่ง HTML ที่ sanitize แล้วให้ UI ไป `innerHTML`
  - rate limiting พื้นฐาน (เช่น จำกัดต่อ IP) ควรพิจารณาก่อนเปิด เพราะไม่มี auth
- **Interests:** ไม่มีงาน Lab 05 — คงไว้ตามเดิม
