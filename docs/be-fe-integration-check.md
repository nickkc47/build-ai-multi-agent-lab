# BE ↔ FE Integration Check — Contact / Guestbook (หลัง Lab 05)

> รายงานจาก Claude (frontend) ตาม `docs/_call-claude-prompt.md` · 2026-09-25 · อ่านอย่างเดียว ไม่ได้แก้ไฟล์อื่น
> อ้างอิง: D5 (Guestbook ปิดใน v1 · แก้ไขหลังอนุมัติ) · D7 (ฟอร์ม Contact 3 ช่อง) ใน `docs/DECISIONS.md` · `docs/handoffs/04-claude-to-opencode.md` · `docs/fe-be-contract-check.md`
> ไฟล์ที่ตรวจ: `src/pages/contact.astro`, `src/pages/guestbook.astro`, `src/lib/db.ts`, `src/lib/api.ts`, `src/pages/api/contact.ts`, `src/pages/api/guestbook.ts`
> วิธีตรวจ: อ่านโค้ดเทียบกัน (static) — **ยังไม่ได้รัน** `npm test` / `test:labs` / e2e ในรอบนี้

**สรุป:** ฟอร์ม Contact ใช้กับ API ใหม่ได้โดยไม่ต้องแก้ UI · ไม่มี mismatch ระดับบล็อก · มีจุดไม่ตรงเล็ก ๆ 4 ข้อ (อีเมลที่ไม่มีจุด, ช่องที่มีแต่ช่องว่าง, branch 501 ที่ไม่มีทางถูกเรียกแล้ว, ข้อความตอน 500 ไม่บอกว่าข้อความยังไม่ถูกบันทึก) · Guestbook ปิดสนิททั้ง UI และปลอดภัยเรื่อง escaping เพราะยังไม่ render อะไรจาก DB

---

## ตรงกัน (match)

### Contact

| ประเด็น | Frontend | Backend |
|---|---|---|
| ฟิลด์ `{name, email, message}` (D7 · ไม่มีช่อง "เรื่อง") | `contact.astro:19,21,23` ส่งด้วย `Object.fromEntries(new FormData(form))` (`contact.astro:47`) | `db.ts:112-114` อ่าน `src.name` / `src.email` / `src.message` |
| Method + path | `fetch('/api/contact', { method: 'POST' })` (`contact.astro:51-52`) | `export const POST` (`api/contact.ts:11`) |
| Content-type | `content-type: application/json` + `JSON.stringify` (`contact.astro:53-54`) | `request.json()` (`api/contact.ts:14`) · ตอบ `application/json` เสมอ (`api.ts:9-12`) |
| Maxlength 80 / 120 / 2000 | `maxlength` ที่ `contact.astro:19,21,23` | `LIMITS` ที่ `db.ts:45-50` ใช้ใน `db.ts:112-114` — ค่าเดียวกันทุกช่อง |
| Required | `required` + `checkValidity()` (`contact.astro:42`) | `requireText` ปฏิเสธค่าที่ไม่ใช่ string / ว่างหลัง trim (`db.ts:60-65`) |
| 2xx | `res.ok` → "ได้รับแล้ว…" + `form.reset()` (`contact.astro:56-58`) | 201 + row (`api/contact.ts:20`) |
| 400 | → "ข้อมูลไม่ครบหรือรูปแบบอีเมลไม่ถูกต้อง…" (`contact.astro:59-60`) | `ValidationError` → 400 `{error:'invalid input'}` (`api.ts:21-22`) · JSON พัง → 400 `{error:'invalid json'}` (`api/contact.ts:15-16`) |
| 500 | ตกไป branch `else` → "ส่งไม่สำเร็จ ลองอีกครั้ง" (`contact.astro:63-64`) | error อื่น → log ฝั่ง server + 500 `{error:'server error'}` (`api.ts:24-25`) — แก้ mismatch เดิมใน `fe-be-contract-check.md` ข้อ "Contact 500 ไม่มีทางเกิด" แล้ว |
| Network error | `catch` → "ส่งไม่สำเร็จ ตรวจการเชื่อมต่อ…" (`contact.astro:66-67`) | — |
| Error body ไม่รั่ว | UI แยกตาม status อย่างเดียว ไม่อ่าน/ไม่แสดง body (`contact.astro:56-65`) | body เป็นค่าคงที่ 3 แบบ · `ValidationError` ตั้ง message ตายตัว (`db.ts:37-42`) · ไม่ส่ง `err.message` ของ error อื่น (`api.ts:24-25`) |
| กดซ้ำระหว่างส่ง | ปิดปุ่มระหว่าง fetch แล้วเปิดคืนใน `finally` (`contact.astro:49,68-70`) | — |
| ข้อความไม่หายเมื่อส่งพลาด | `form.reset()` เฉพาะตอน `res.ok` (`contact.astro:58`) | — |
| Body แปลก ๆ | UI ส่ง object เสมอ | `null` / array / ตัวเลข → `(input ?? {})` แล้วฟิลด์เป็น `undefined` → 400 ไม่ใช่ 500 (`db.ts:111`) |

### Guestbook (D5)

| ประเด็น | Frontend | Backend |
|---|---|---|
| ปิดใน v1 | หน้า "ยังไม่เปิด" ไม่มีฟอร์ม ไม่มี `fetch` (`guestbook.astro:11-19`) · ไม่มีไฟล์ไหนใน `src/` เรียก `/api/guestbook` จากฝั่ง UI | POST เก็บเป็น `pending` เสมอ (`db.ts:157`) · GET ส่งเฉพาะ `approved` (`api/guestbook.ts:13`) |
| Validation | — | `name` ≤80 · `message` ≤500 · trim · required (`db.ts:152-153`) · blocklist ลิงก์/แท็ก (`db.ts:58,73-76`) |
| Escaping | ไม่ render ข้อมูลจาก DB เลย · comment กำหนดให้ใช้ `textContent` / Astro escaping ห้าม `innerHTML` (`guestbook.astro:7-9`) · grep ทั้ง `src/` ไม่เจอ `innerHTML` หรือ `set:html` | เก็บข้อความดิบ ไม่ sanitize เป็น HTML (`db.ts:4-5`) — ตรงกับข้อตกลงว่าฝั่งแสดงผลเป็นคน escape |
| Error mapping GET/POST เหมือนกัน | — | ทั้งสอง method ใช้ `errorResponse` (`api/guestbook.ts:16,36`) — แก้ mismatch เดิมเรื่อง GET→500 / POST→400 แล้ว |
| Schema moderation | — | มีคอลัมน์ `status` + migration สำหรับ DB เก่า (`db.ts:97,101-105`) |

---

## ไม่ตรง (mismatch)

ไม่มีข้อไหนทำให้ฟอร์มพัง — ทุกข้อเป็นจุดที่ UI กับ server ตีความข้อมูลต่างกันเล็กน้อย

### Frontend

1. **Branch 501 ไม่มีทางถูกเรียกแล้ว** — `contact.astro:61-62` ยังรอ 501 ("ช่องทางนี้ยังไม่เปิดรับข้อความ") แต่ `api/contact.ts` ไม่ตอบ 501 แล้ว (ตอบแค่ 201/400/500) · ไม่มีผลเสียตอนใช้งาน แต่เป็นโค้ดที่ไม่มีทางถูกใช้ และทำให้คนอ่านเข้าใจผิดว่า contract ยังมี 501
2. **ข้อความตอน 500 ปนกับกรณีอื่น** — 500, 404, 502 จาก proxy และ status อื่นทั้งหมดตกไปที่ข้อความเดียว "ส่งไม่สำเร็จ ลองอีกครั้ง" (`contact.astro:63-64`) · ตอนนี้ server ตอบ 500 ได้จริงแล้ว (`api.ts:25`) แต่ user ไม่รู้ว่า**ข้อความยังไม่ถูกบันทึก**และเป็นปัญหาฝั่งระบบ (ไม่ใช่ที่ตัวเองกรอกผิด) · ข้อความนี้ไม่ผิด แต่ยังไม่ครบ

### Backend (เทียบกับพฤติกรรมของเบราว์เซอร์)

3. **กติกาอีเมลเข้มกว่าเบราว์เซอร์** — `type="email"` (`contact.astro:21`) ใช้เกณฑ์ของ HTML spec ซึ่งยอม `a@localhost` (ไม่มีจุด) แต่ `EMAIL_RE` (`db.ts:52`) บังคับให้มีจุดหลัง `@` · ผล: ผ่าน `checkValidity()` แล้วได้ 400 · UI แสดงข้อความที่ถูกต้องอยู่แล้ว ("…รูปแบบอีเมลไม่ถูกต้อง") จึง**ยอมรับได้** — บันทึกไว้เพื่อไม่ให้ใครงงตอนเทสต์
4. **ช่องที่มีแต่ช่องว่างผ่านฝั่ง UI แต่ไม่ผ่าน server** — `required` ของเบราว์เซอร์ถือว่า `"   "` มีค่า (`contact.astro:19,23`) แต่ `requireText` trim แล้วปฏิเสธ (`db.ts:62-63`) → 400 · UI ขึ้น "ข้อมูลไม่ครบ…" ซึ่งถูกความหมาย — **ยอมรับได้** เพราะ server เป็นด่านจริง
5. **(ควรทดสอบ · ยังไม่ยืนยัน) การนับความยาวเมื่อมีขึ้นบรรทัดใน textarea** — เบราว์เซอร์นับ `maxlength` จากค่าที่ normalize ขึ้นบรรทัดเป็น LF แล้ว ส่วน server นับ `.length` ของ string ที่ได้จาก JSON (`db.ts:63`) · ถ้าเบราว์เซอร์ไหนส่งขึ้นบรรทัดเป็น CRLF ผ่าน `FormData` ข้อความยาวเกือบ 2000 ตัวที่มีหลายบรรทัดอาจผ่าน UI แต่ได้ 400 · ความเสี่ยงต่ำ ยังไม่ได้ทดสอบจริง
6. **Response 201 ส่ง row กลับทั้งแถว** — `api/contact.ts:20` ส่ง `{id, name, email, message, created_at}` กลับไป · UI ไม่ได้ใช้ (`contact.astro:56` เช็คแค่ `res.ok`) · ไม่ผิด contract แต่เป็นการส่งอีเมลกลับไปใน response โดยไม่จำเป็น (ดูข้อเสนอ B2)

### Guestbook

7. **GET ได้ `[]` เสมอ** — ยังไม่มีทางเปลี่ยน `pending` → `approved` (ไม่มีฟังก์ชัน/route สำหรับ approve ใน `db.ts`) · ตอนนี้ไม่ใช่ปัญหาเพราะ UI ปิดอยู่ (D5) แต่ถ้าเปิด UI ก่อนมีขั้น approve หน้าเว็บจะว่างตลอด — ควรอยู่ใน open loop L6
8. **400 ของ guestbook บอกเหตุผลไม่ได้** — ถูกบล็อกเพราะมีลิงก์ (`db.ts:58`) หรือยาวเกิน 500 ได้ body เดียวกันคือ `{error:'invalid input'}` · UI ในอนาคตจึงบอก user ได้แค่แบบกว้าง ๆ · และ regex `/<[^>]*>/` จะบล็อกข้อความธรรมดาอย่าง `a < b > c` ด้วย (false positive เล็กน้อย)

---

## ข้อเสนอ (suggestion)

### Frontend (Claude · `src/pages/` — ทำในรอบ frontend ไม่ใช่รอบนี้)

- **F1 · แยก branch 500** ใน `contact.astro:63` เช่น `res.status >= 500` → "ระบบขัดข้องชั่วคราว ข้อความยังไม่ถูกส่ง ลองใหม่อีกครั้งภายหลัง" · ที่เหลือคงข้อความเดิม — ทำให้ user รู้ว่าไม่ใช่ความผิดตัวเองและต้องส่งใหม่ (ข้อความยังอยู่ในฟอร์มเพราะไม่ได้ reset)
- **F2 · จัดการ branch 501** (`contact.astro:61-62`) — ลบออก หรือเก็บไว้แล้วเขียน comment ว่ากันไว้เผื่อ rollback ตอน deploy · ไม่เร่ง
- **F3 · (เลือก) trim ก่อน `checkValidity()`** เพื่อให้ช่องที่มีแต่ช่องว่างถูกจับที่ UI ทันที ไม่ต้องรอ 400 · หรือใส่ `pattern="\S.*"` / เช็คเองก่อนส่ง
- **F4 · ตอนเปิด Guestbook (หลัง moderation · ต้องแก้ D5 ก่อน):**
  - render ด้วย `{entry.name}` / `{entry.message}` ของ Astro หรือ `textContent` เท่านั้น — ห้าม `innerHTML` / `set:html` (ตาม `guestbook.astro:7-9` และ `db.ts:4-5`)
  - 201 = "ได้รับแล้ว รอตรวจก่อนแสดง" ห้ามพูดว่า "โพสต์แล้ว" เพราะสถานะเป็น `pending` (`db.ts:157`)
  - บอกกติกาไว้ใต้ฟอร์มก่อนส่ง ("ไม่รับลิงก์หรือแท็ก HTML · ไม่เกิน 500 ตัวอักษร") เพราะ 400 ไม่บอกเหตุผล · ใส่ `maxlength="80"` / `maxlength="500"` ให้ตรง `db.ts:46,49`
- **F5 · เพิ่ม e2e** กรณี 400 (อีเมล `a@b`) และ 500 (mock route) ใน `playwright/` เพื่อล็อกข้อความที่ user เห็น

### Backend (OpenCode · `src/lib/db.ts` + `src/pages/api/`)

- **B1 · ไม่มีอะไรบล็อก UI** — contract ตรงกับฟอร์มแล้ว · field names คงเดิมตาม handoff
- **B2 · (เลือก) ส่ง response 201 ให้น้อยลง** — เช่น `{id, created_at}` หรือ `{ok: true}` แทน row เต็ม (`api/contact.ts:20`, `api/guestbook.ts:34`) · UI ไม่ได้ใช้ body อยู่แล้ว เปลี่ยนได้โดยไม่กระทบ frontend · ลดการส่งอีเมลกลับใน response
- **B3 · Guestbook approve** — เพิ่มทาง approve (script/CLI ภายใน ไม่ใช่ route สาธารณะ) หรือเปิด/อัปเดต open loop L6 ให้ชัดว่า GET จะได้ `[]` จนกว่าจะมีขั้นนี้
- **B4 · (เลือก) รหัส error ที่ปลอดภัยสำหรับ guestbook** — เช่น `{error:'invalid input', code:'LINK_NOT_ALLOWED' | 'TOO_LONG'}` ถ้าอยากให้ UI บอกเหตุผลได้ · ต้องตกลงกับ frontend ก่อน (ตาม Assumption 1 ใน handoff 04) · ถ้าไม่ทำ ให้ UI ใช้ F4 (บอกกติกาก่อนส่ง) แทน
- **B5 · (เลือก) ปรับ regex แท็ก** `db.ts:58` เป็นรูปที่แคบลง เช่น `/<\/?[a-z][^>]*>/i` เพื่อไม่บล็อก `a < b > c`
- **B6 · rate limit** ก่อนเปิด POST guestbook จริง (ยังค้างจาก `fe-be-contract-check.md`) — ตอนนี้ POST `/api/guestbook` เรียกได้จากภายนอกแล้ว แม้ UI จะปิด แถว `pending` จึงสะสมได้โดยไม่มีเพดาน
