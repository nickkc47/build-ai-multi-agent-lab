Verdict: APPROVE

# รีวิว PR #35 — [Lab 06] Playwright MCP E2E + a11y fixes (P0×2, P1)

> Reviewer: OpenCode (อิสระ · ผู้เขียน PR คือ Claude) · 2026-09-25
> ขอบเขต: `git diff main...lab-06-qa` — `src/pages/contact.astro` · `docs/QA.md` · `docs/STATUS.md` · `docs/OPEN_LOOPS.md` · `docs/screenshots/*.png` (ไม่ได้เปิดรูป)
> รันเพิ่มเติม (อ่านอย่างเดียว): `npm test` 25/25 ผ่าน · `npm run test:labs` 2/2 ผ่าน บน working tree `lab-06-qa`

## Findings (เรียงตามความรุนแรง — ไม่มีข้อ blocking)

1. **`src/pages/contact.astro:62-66` · ข้อความ status ไม่อัปเดตตามการแก้ช่อง (non-blocking)**
   - ปัญหา: listener `input` เรียก `markInvalid()` ซึ่งเคลียร์ `aria-invalid` ทันที แต่ข้อความ "ตรวจช่อง: …" ใน `#status` ค้างเป็นค่าเดิมจนกว่าจะกดส่งอีกครั้ง
   - สถานการณ์ที่พัง: ผู้ใช้แก้ช่องจนถูกหมดแล้ว แต่บนหน้าจอยังอ่านว่า "ตรวจช่อง: อีเมล (รูปแบบไม่ถูกต้อง)" — สับสนเล็กน้อยสำหรับผู้ใช้สายตาปกติ (screen reader ไม่โดน เพราะ live region ไม่อ่านซ้ำเมื่อ textContent ไม่เปลี่ยน)
   - ไม่ blocking: พฤติกรรมเดิมก่อน PR ก็ไม่อัปเดต status ตอน input เช่นกัน — ไม่ใช่ regression

2. **`src/pages/contact.astro:57-61` · `fieldNames` เป็น lookup แบบ hardcode (non-blocking)**
   - ปัญหา: ถ้าอนาคตเพิ่มช่องใหม่ในฟอร์มโดยลืมเติม `fieldNames` · `describeInvalid` จะ render คำว่า "undefined" ลงในข้อความผู้ใช้
   - สถานการณ์ที่พัง: เพิ่มช่อง เช่น `subject` แล้ว submit ว่าง → "ตรวจช่อง: undefined"
   - ไม่ blocking: ตอนนี้ 3 ช่อง (`name`/`email`/`message`) ครบใน lookup · เป็นเรื่อง robustness เผื่ออนาคตเท่านั้น

3. **`docs/QA.md` (ส่วน Fixes) · ตัวเลข contrast 8.2:1 ของ `.hint` ตรวจจากโค้ดไม่ได้ (non-blocking)**
   - ปัญหา: อ้าง "muted colour 8.2:1" จาก computed style ในเบราว์เซอร์ — reviewer ตรวจซ้ำจาก diff ไม่ได้ แต่ `.hint` ใช้ `var(--color-muted)` ตัวเดียวกับแถว 12 ที่วัดได้ 8.2–8.7:1 จึงสอดคล้องกันภายใน
   - ไม่ blocking: มีหลักฐานประกอบในเอกสารเดียวกัน · ไม่เกินจริงเท่าที่เทียบได้

## ตรวจแล้วไม่พบปัญหา

- **`markInvalid` คืน array + `describeInvalid` + "ตรวจช่อง: …"** (`contact.astro:47-61, 71-75`): ตรรกะถูกต้อง — ครอบคลุม edge case ที่ prompt ระบุครบ:
  - ช่องว่างล้วน (spaces only): `setCustomValidity('required')` จับได้ · ข้อความออก "ตรวจช่อง: ชื่อ · ข้อความ" ตามตารางใน QA.md
  - อีเมลมีค่าแต่ผิดรูปแบบ: `checkValidity()` จับ type=email · ออก "อีเมล (รูปแบบไม่ถูกต้อง)" · อีเมลว่างออกแค่ "อีเมล" (เงื่อนไข `f.value.trim()` ถูก)
  - แก้ช่องแล้ว `aria-invalid` เคลียร์: listener `input` re-mark ทุกช่อง · หลัง 201 ก็ reset + เคลียร์ `aria-invalid="false"` ครบ
  - focus ไปช่องผิดแรก (`invalid[0].focus()`) ตรงตามตาราง re-test ใน QA.md ทั้ง 4 เคส
- **branch ตอบกลับครบ**: 201 (`res.ok`) / 400 / 413 / 429 / `>=500` / else / network (`catch`) — ไม่เปลี่ยนจากก่อน PR · ข้อความ 413/429 เฉพาะจาก L10 ยังอยู่
- **a11y — ลบ `aria-describedby="status"` ถูกต้อง**: `#status` ยังมี `role="status"` + `aria-live="polite"` จึงยังประกาศอัตโนมัติ · การลบ describedby ตัดปัญหา L11 (อ่านข้อความระดับฟอร์มซ้ำทุกช่อง/อ่านข้อความเก่าค้าง) โดยไม่เสียการประกาศ · hint "กรอกครบทุกช่อง" เป็นข้อความมองเห็นได้จริง (`contact.astro:17`) ตอบ A4/WCAG 3.3.1 ร่วมกับ error ที่ระบุชื่อช่อง
- **QA.md เทียบโค้ดจริง**: ตาราง "Fixes after the debate" ทั้ง 4 แถวตรงกับโค้ดทุกข้อ (ข้อความ · focus · aria-invalid) · ตาราง E2E ชุดแรก (แถว 5–6) เป็นผลก่อนแก้และเอกสารแยกชัดเจนว่า re-test หลังแก้ · ไม่พบข้ออ้างเกินจริง · การไม่ re-test 413/429 มีเหตุผลระบุไว้ (ปิด rate limit ในรอบนี้) สมเหตุสมผล
- **markup ไม่พูดถึงคอร์ส/lab**: `npm test` 25/25 ผ่าน (รวม `tests/public-site.test.ts`) · ตรวจ comment ใน `<script>` เองแล้วไม่มีคำว่า lab/แล็บ
- **Privacy**: ไม่มีข้อมูลส่วนตัวเพิ่มใน markup · microcopy เดิมยังบอก "ไม่ต้องใส่ข้อมูลส่วนตัวเกินจำเป็น"
- **STATUS/OPEN_LOOPS สอดคล้องกัน**: L11 ย้ายไปตาราง "ปิดแล้ว" พร้อมคำอธิบายตรงกับ diff · L12/L13 ยังเปิดและชี้ไป QA.md A3/P2 ถูกต้อง · STATUS ระบุ "Lab 06 เสร็จ (รอ merge PR)" ตรงกับ In progress · ตัวเลขทดสอบที่อ้าง (25/25 · 2/2) ตรงกับที่ reviewer รันซ้ำได้
