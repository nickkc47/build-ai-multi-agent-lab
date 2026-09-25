# BE ↔ FE Integration Check — Contact / Guestbook (หลัง Lab 05)

> รายงานจาก Claude (frontend) · 2026-09-25 · อ่านอย่างเดียว ไม่ได้แก้ไฟล์ใน `src/`
> อ้างอิง: D5 (Guestbook ปิดใน v1 · แก้ไขหลังอนุมัติ) · D7 (ฟอร์ม Contact 3 ช่อง) ใน `docs/DECISIONS.md` · `docs/handoffs/04-claude-to-opencode.md` · `docs/fe-be-contract-check.md` · open loop L6
> ไฟล์ที่ตรวจ: `src/pages/contact.astro`, `src/pages/guestbook.astro`, `src/lib/db.ts`, `src/lib/api.ts`, `src/pages/api/contact.ts`, `src/pages/api/guestbook.ts`
> วิธีตรวจ: อ่านโค้ดเทียบกัน (static) + grep ทั้ง `src/` — **ยังไม่ได้รัน** `npm test` / `test:labs` / e2e ในรอบนี้ (ผลรันล่าสุดดูใน `docs/STATUS.md`)
> รอบนี้เขียนทับฉบับก่อน: อัปเดตเลขบรรทัดให้ตรง `db.ts` ปัจจุบัน · ข้อเสนอ B5 (regex แท็ก) ทำแล้ว · B3 มี open loop L6 แล้ว

**สรุป:** ฟอร์ม Contact ใช้กับ API ที่ทำเสร็จแล้วได้เลยโดยไม่ต้องแก้ UI · ไม่มี mismatch ที่ทำให้ใช้งานไม่ได้ · มีจุดไม่ตรงเล็ก ๆ ที่ยอมรับได้ (อีเมลที่ไม่มีจุด, ช่องที่มีแต่ช่องว่าง) และจุดที่ควรแก้ฝั่ง UI 2 ข้อ (branch 501 ที่ไม่มีทางถูกเรียกแล้ว, ข้อความตอน 500 ไม่บอกว่าข้อความยังไม่ถูกบันทึก) · Guestbook ปิดสนิทฝั่ง UI และไม่มีความเสี่ยงเรื่อง escaping เพราะยังไม่ render อะไรจาก DB

---

## ตรงกัน (match)

### Contact

| ประเด็น | Frontend | Backend |
|---|---|---|
| ฟิลด์ `{name, email, message}` (D7 · ไม่มีช่อง "เรื่อง") | `name=` ที่ `contact.astro:19,21,23` ส่งด้วย `Object.fromEntries(new FormData(form).entries())` (`contact.astro:47`) | `insertContact` อ่าน `src.name` / `src.email` / `src.message` (`db.ts:114-116`) — ชื่อฟิลด์คงเดิมตาม handoff 04 |
| Method + path | `fetch('/api/contact', { method: 'POST' })` (`contact.astro:51-52`) | `export const POST` (`api/contact.ts:11`) |
| Content-type | `content-type: application/json` + `JSON.stringify` (`contact.astro:53-54`) | `request.json()` (`api/contact.ts:14`) · ตอบ `application/json` ทุกกรณี (`api.ts:8-13`) |
| Maxlength 80 / 120 / 2000 | `maxlength` ที่ `contact.astro:19,21,23` | `LIMITS` (`db.ts:45-50`) ใช้ที่ `db.ts:114-116` — ค่าตรงกันทุกช่อง |
| Required | `required` + `checkValidity()` (`contact.astro:42`) | `requireText` ปฏิเสธค่าที่ไม่ใช่ string และค่าว่างหลัง trim (`db.ts:62-67`) |
| อีเมล | `type="email"` (`contact.astro:21`) | `requireEmail` + `EMAIL_RE` (`db.ts:52,69-73`) — ดูข้อ mismatch 3 |
| 2xx | `res.ok` → "ได้รับแล้ว…" + `form.reset()` (`contact.astro:56-58`) | 201 + row (`api/contact.ts:20`) |
| 400 | → "ข้อมูลไม่ครบหรือรูปแบบอีเมลไม่ถูกต้อง…" (`contact.astro:59-60`) | `ValidationError` → 400 `{error:'invalid input'}` (`api.ts:21-23`) · JSON พัง → 400 `{error:'invalid json'}` (`api/contact.ts:15-16`) |
| 500 | ตก branch `else` → "ส่งไม่สำเร็จ ลองอีกครั้ง" (`contact.astro:63-64`) | error อื่น → log ฝั่ง server + 500 `{error:'server error'}` (`api.ts:24-25`) — **ปิด mismatch เดิม** "Contact 500 ไม่มีทางเกิด" ใน `fe-be-contract-check.md` แล้ว |
| Network error | `catch` → "ส่งไม่สำเร็จ ตรวจการเชื่อมต่อ…" (`contact.astro:66-67`) | — |
| Error body ไม่รั่ว | UI แยกตาม status อย่างเดียว ไม่อ่าน/ไม่แสดง body (`contact.astro:56-65` · Assumption 1 ใน handoff 04) | body เป็นค่าคงที่ 3 แบบ · `ValidationError` ตั้ง message ตายตัว (`db.ts:37-42`) · ไม่ส่ง `err.message` ของ error อื่น (`api.ts:24-25`) — **ปิด mismatch เดิม** เรื่อง `err.message` รั่ว |
| กดซ้ำระหว่างส่ง | ปิดปุ่มระหว่าง fetch แล้วเปิดคืนใน `finally` (`contact.astro:49,68-70`) | — |
| ข้อความไม่หายเมื่อส่งพลาด | `form.reset()` เฉพาะตอน `res.ok` (`contact.astro:58`) | — |
| Body แปลก ๆ | UI ส่ง object เสมอ | `null` → `(input ?? {})` แล้วฟิลด์เป็น `undefined` → 400 ไม่ใช่ 500 (`db.ts:113`) |

### Guestbook (D5)

| ประเด็น | Frontend | Backend |
|---|---|---|
| ปิดใน v1 | หน้า "ยังไม่เปิด" ไม่มีฟอร์ม ไม่มี `fetch` (`guestbook.astro:11-19`) · grep ทั้ง `src/` ไม่มีไฟล์ UI ไหนเรียก `/api/guestbook` | POST เก็บเป็น `pending` เสมอ (`db.ts:159`) · GET ส่งเฉพาะ `approved` (`api/guestbook.ts:13`) |
| Validation | — | `name` ≤80 · `message` ≤500 · trim · required (`db.ts:154-155`) · blocklist ลิงก์/แท็ก (`db.ts:60,75-78`) |
| Escaping | ไม่ render ข้อมูลจาก DB เลย · comment กำหนดให้ใช้ `textContent` / Astro escaping ห้าม `innerHTML` (`guestbook.astro:7-9`) · grep ทั้ง `src/` ไม่เจอ `innerHTML` หรือ `set:html` ในโค้ด (เจอแค่ใน comment) | เก็บข้อความดิบ ไม่ sanitize เป็น HTML (`db.ts:4-5`) — ตรงข้อตกลงว่าฝั่งแสดงผลเป็นคน escape |
| Error mapping GET/POST เหมือนกัน | — | ทั้งสอง method ใช้ `errorResponse` (`api/guestbook.ts:16,36`) — **ปิด mismatch เดิม** GET→500 / POST→400 แล้ว |
| Schema moderation | — | คอลัมน์ `status` + migration สำหรับ DB เก่า (`db.ts:99,104-107`) — **ปิด mismatch เดิม** "GuestbookEntry ไม่มีสถานะ" แล้ว |
| Regex แท็กไม่บล็อกข้อความธรรมดา | — | `/<\/?[a-z][^>]*>/i` (`db.ts:60`) — `a < b > c` ผ่าน (ข้อเสนอ B5 ฉบับก่อน ทำแล้ว) |

---

## ไม่ตรง (mismatch)

ไม่มีข้อไหนทำให้ฟอร์มพัง — ทุกข้อคือจุดที่ UI กับ server ตีความข้อมูลต่างกันเล็กน้อย หรือโค้ดที่ไม่ได้ใช้แล้ว

### Frontend

1. **Branch 501 ไม่มีทางถูกเรียกแล้ว** — `contact.astro:61-62` ยังรอ 501 ("ช่องทางนี้ยังไม่เปิดรับข้อความ") แต่ `api/contact.ts` ตอบแค่ 201 / 400 / 500 แล้ว · ใช้งานได้ปกติ แต่เป็นโค้ดที่ไม่ถูกใช้ และทำให้คนอ่านเข้าใจผิดว่า contract ยังมี 501 (handoff 04 บรรทัด 10 ก็ยังเขียนถึง 501)
2. **ข้อความตอน 500 ปนกับกรณีอื่น** — 500, 404, 502 จาก proxy และ status อื่นทั้งหมดได้ข้อความเดียว "ส่งไม่สำเร็จ ลองอีกครั้ง" (`contact.astro:63-64`) · ตอนนี้ server ตอบ 500 ได้จริงแล้ว (`api.ts:25`) แต่ user ไม่รู้ว่า**ข้อความยังไม่ถูกบันทึก**และเป็นปัญหาฝั่งระบบ ไม่ใช่ที่ตัวเองกรอกผิด · ข้อความไม่ผิด แต่ยังไม่ครบ

### Backend (เทียบกับพฤติกรรมของเบราว์เซอร์)

3. **กติกาอีเมลเข้มกว่าเบราว์เซอร์** — `type="email"` (`contact.astro:21`) ใช้เกณฑ์ HTML spec ซึ่งยอม `a@localhost` (ไม่มีจุด) แต่ `EMAIL_RE` (`db.ts:52`) บังคับให้มีจุดหลัง `@` · ผล: ผ่าน `checkValidity()` แล้วได้ 400 · UI แสดงข้อความที่ถูกความหมายอยู่แล้ว ("…รูปแบบอีเมลไม่ถูกต้อง") จึง**ยอมรับได้** — บันทึกไว้กันงงตอนเทสต์
4. **ช่องที่มีแต่ช่องว่างผ่าน UI แต่ไม่ผ่าน server** — `required` ของเบราว์เซอร์ถือว่า `"   "` มีค่า (`contact.astro:19,23`) แต่ `requireText` trim แล้วปฏิเสธ (`db.ts:64-65`) → 400 · UI ขึ้น "ข้อมูลไม่ครบ…" ซึ่งถูกความหมาย — **ยอมรับได้** เพราะ server เป็นด่านจริง
5. **(ควรทดสอบ · ยังไม่ยืนยัน) การนับความยาวเมื่อมีขึ้นบรรทัดใน textarea** — เบราว์เซอร์นับ `maxlength` จากค่าที่ normalize ขึ้นบรรทัดเป็น LF ส่วน server นับ `.length` ของ string จาก JSON (`db.ts:65`) · ถ้าเบราว์เซอร์ไหนส่งขึ้นบรรทัดเป็น CRLF ผ่าน `FormData` ข้อความเกือบ 2000 ตัวที่มีหลายบรรทัดอาจผ่าน UI แต่ได้ 400 · ความเสี่ยงต่ำ ยังไม่ได้ทดสอบจริง
6. **Response 201 ส่ง row กลับทั้งแถว** — `api/contact.ts:20` ส่ง `{id, name, email, message, created_at}` · UI ไม่ได้ใช้ (`contact.astro:56` เช็คแค่ `res.ok`) · ไม่ผิด contract แต่ส่งอีเมลกลับใน response โดยไม่จำเป็น (ดู B2)

### Guestbook

7. **GET ได้ `[]` เสมอ** — ยังไม่มีทางเปลี่ยน `pending` → `approved` (ไม่มีฟังก์ชัน/route approve ใน `db.ts`) · ไม่เป็นปัญหาตอนนี้เพราะ UI ปิด (D5) · ติดตามอยู่ใน open loop **L6** แล้ว
8. **400 ของ guestbook บอกเหตุผลไม่ได้** — ถูกบล็อกเพราะลิงก์/แท็ก (`db.ts:60`) หรือยาวเกิน 500 ได้ body เดียวกัน `{error:'invalid input'}` · UI ในอนาคตจึงบอก user ได้แค่แบบกว้าง ๆ
9. **POST `/api/guestbook` เปิดรับจากภายนอกแล้ว แม้ UI ปิด** — D5 เขียนว่า "route ต้องไม่เปิดให้โพสต์จนกว่ามี moderation" · ตอนนี้มี moderation แบบ pending แล้ว (ไม่มีอะไรขึ้นหน้าเว็บ) จึงถือว่า**ตรงเจตนา D5** แต่ยังไม่มี rate limit → แถว `pending` สะสมได้ไม่จำกัด (อยู่ใน L6)

---

## ข้อเสนอ (suggestion)

### Frontend (Claude · `src/pages/` — ทำในรอบ frontend ไม่ใช่รอบนี้)

- **F1 · แยก branch 5xx** ใน `contact.astro:63` เช่น `res.status >= 500` → "ระบบขัดข้องชั่วคราว ข้อความยังไม่ถูกส่ง ลองใหม่อีกครั้งภายหลัง" · ที่เหลือคงข้อความเดิม — ข้อความยังอยู่ในฟอร์มเพราะไม่ได้ reset จึงกดส่งใหม่ได้เลย
- **F2 · จัดการ branch 501** (`contact.astro:61-62`) — ลบออก หรือเก็บไว้แล้วเขียน comment ว่ากันไว้เผื่อ rollback ตอน deploy · ไม่เร่ง
- **F3 · (เลือก) trim ก่อน `checkValidity()`** ให้ช่องที่มีแต่ช่องว่างถูกจับที่ UI ทันที ไม่ต้องรอ 400
- **F4 · ตอนเปิด Guestbook (หลัง L6 · ต้องแก้ D5 ก่อน):**
  - render ด้วย `{entry.name}` / `{entry.message}` ของ Astro หรือ `textContent` เท่านั้น — ห้าม `innerHTML` / `set:html` (`guestbook.astro:7-9` · `db.ts:4-5`)
  - อ่าน `body.entries` จาก GET (`api/guestbook.ts:14`) ไม่ใช่ array ตรง ๆ
  - 201 = "ได้รับแล้ว รอตรวจก่อนแสดง" ห้ามพูดว่า "โพสต์แล้ว" เพราะสถานะเป็น `pending` (`db.ts:159`)
  - บอกกติกาใต้ฟอร์มก่อนส่ง ("ไม่รับลิงก์หรือแท็ก HTML · ไม่เกิน 500 ตัวอักษร") เพราะ 400 ไม่บอกเหตุผล · ใส่ `maxlength="80"` / `maxlength="500"` ให้ตรง `db.ts:46,49`
- **F5 · เพิ่ม e2e** กรณี 400 (อีเมล `a@b`) และ 500 (mock route ด้วย `page.route`) ใน `playwright/` เพื่อล็อกข้อความที่ user เห็น
- **F6 · อัปเดต handoff ถัดไป** ให้ระบุ contract Contact ปัจจุบันเป็น 201 / 400 / 500 (ไม่มี 501 แล้ว)

### Backend (OpenCode · `src/lib/db.ts` + `src/pages/api/`)

- **B1 · ไม่มีอะไรบล็อก UI** — contract ตรงกับฟอร์มแล้ว · field names คงเดิมตาม handoff
- **B2 · (เลือก) ส่ง response 201 ให้น้อยลง** — เช่น `{id, created_at}` หรือ `{ok: true}` แทน row เต็ม (`api/contact.ts:20`, `api/guestbook.ts:34`) · UI ไม่ได้ใช้ body อยู่แล้ว เปลี่ยนได้โดยไม่กระทบ frontend
- **B3 · Guestbook approve + rate limit** — ทำตาม L6 (script/CLI ภายใน ไม่ใช่ route สาธารณะ) ก่อนเปิดฟอร์มบนเว็บ
- **B4 · (เลือก) รหัส error ที่ปลอดภัยสำหรับ guestbook** — เช่น `{error:'invalid input', code:'LINK_NOT_ALLOWED' | 'TOO_LONG'}` ถ้าอยากให้ UI บอกเหตุผลได้ · ต้องตกลงกับ frontend ก่อน (Assumption 1 ใน handoff 04) · ถ้าไม่ทำ ให้ UI ใช้ F4 (บอกกติกาก่อนส่ง) แทน
- **B5 · (เลือก) ให้ `EMAIL_RE` ตรงกับเบราว์เซอร์** ถ้าอยากตัด mismatch 3 — แต่ความเข้มแบบตอนนี้ก็สมเหตุสมผลสำหรับอีเมลตอบกลับจริง แนะนำ**คงไว้**
