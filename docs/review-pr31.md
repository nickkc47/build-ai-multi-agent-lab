Verdict: APPROVE

# รีวิว PR #31 — `[Lab 05b] Swarm: a11y fixes, 404, D10 sources` (diff `main...lab-05b-swarm`)

ผู้รีวิว: OpenCode (reviewer อิสระ · ไม่ใช่ผู้เขียน PR) · 2026-09-25
วิธีตรวจ: static review จาก `git diff` / `git show` เท่านั้น — working tree อยู่ branch อื่นและกติกาห้าม switch จึง**ไม่ได้รัน** `npm test` / `build` / e2e ซ้ำ · ตัวเลขเทสต์ใน `docs/SWARM.md` เป็นของผู้เขียน แต่ตรวจ plausibility แบบ static แล้วสอดคล้อง (ดูส่วนท้าย)

## Findings (เรียงตามความรุนแรง — ทั้งหมด non-blocking)

1. **docs/DECISIONS.md:53-56** · checklist "เกณฑ์พร้อม Frontend (Lab 04)" ยังติ๊ก `[ ]` ค้าง 4 ข้อ (เหตุผล Hero Pool · ยืนยันช่องทางติดต่อ · ตอบ privacy · Bio มุม B) ทั้งที่ entry ใหม่ในไฟล์เดียวกัน (บรรทัด 33) บอกว่าเจ้าของตอบ/อนุมัติครบแล้ว · สถานการณ์ที่พัง: คนอ่าน session ถัดไปอาจเข้าใจว่า L3/L4 ยังค้าง แล้วไปถามเจ้าของซ้ำ · **blocking: ไม่** — แก้โดยติ๊ก/ลบ checklist ใน commit ถัดไปได้

2. **docs/handoffs/05b-claude-to-opencode.md:40** · เช็กบ็อกซ์ "[ ] `docs/DECISIONS.md` — ไม่มี decision ใหม่" แต่ PR นี้มี entry ใหม่ "L3 / L4" ใน DECISIONS.md (handoff เขียน 16:05 ก่อน commit `ec20c7f`/`7144bdd`) · สถานการณ์ที่พัง: OpenCode ผู้รับงานอ่าน handoff แล้วอาจไม่เปิด DECISIONS.md พลาดบริบทที่เจ้าของเพิ่งอนุมัติ · **blocking: ไม่** — เป็นเพียงความคลาดเคลื่อนเชิงเวลาในเอกสาร

3. **src/pages/contact.astro:19-23** · `aria-describedby="status"` ผูกทุก field เข้ากับกล่อง status กลางก้อนเดียว — เมื่อ status แสดงข้อความระดับฟอร์ม (เช่น "กำลังส่ง…" หรือ error รวม) screen reader จะอ่านข้อความนั้นเป็น description ของทุกช่อง · สถานการณ์ที่พัง: ผู้ใช้ screen reader ได้ยินข้อความซ้ำ/ไม่ตรงช่อง (verbosity ไม่ใช่ข้อมูลผิด) · **blocking: ไม่** — รับได้ในระดับนี้ ถ้าจะแม่นกว่านี้ค่อยแยก error ราย field ในอนาคต

4. **docs/OPEN_LOOPS.md:20** · แถวปิดแล้ว "— L3 บางส่วน…" ซ้ำซ้อนกับแถว "L3" (บรรทัด 18) ที่ปิดวันเดียวกัน · สถานการณ์ที่พัง: ตารางรก อ่านยาก · **blocking: ไม่** — เก็บกวาดตอนแก้ข้อ 1 พร้อมกันได้

5. **docs/DECISIONS.md:24 vs 33** · D9 เดิมเขียน "Bio เวอร์ชันเว็บ 3 ประโยค" แต่ entry ใหม่และ PROFILE จริงเป็น "3 ย่อหน้า" (ย่อหน้าละ ~1 ประโยค จึงตรงเจตนา) · **blocking: ไม่** — wording drift เล็กน้อยในไฟล์เดียวกัน

## ตรวจแล้วไม่พบปัญหา

- **สัญญา API ของฟอร์ม Contact:** เทียบ `src/pages/contact.astro` กับ `src/pages/api/contact.ts` + `src/lib/api.ts` — ครอบคลุมครบ: `res.ok` (201) → ข้อความสำเร็จ + reset · 400 → ข้อความ validation · `>=500` → ข้อความ 5xx แยกต่างหาก · status อื่น → fallback · throw/network → catch · field names `name/email/message` ตรง contract · client trim ก่อนส่งสอดคล้องกับ server ที่ trim · กัน double-submit ด้วย `sending` flag + `aria-disabled` (ปุ่มยังกดได้แต่ guard กันรอบซ้ำ และ focus ไม่หลุดตามที่อ้าง)
- **a11y 8 ข้อใน `docs/SWARM.md` ทำจริงครบในโค้ด:** `--color-field-border: #86666f` คำนวณ contrast ซ้ำได้ ≈3.6–3.9:1 เทียบ bg/surface (ผ่านเกณฑ์ non-text 3:1) · เส้นใต้ nav เปลี่ยนเป็น `--color-accent` ≈6.8:1 ตรงที่อ้าง · trim-validate จับช่องว่างล้วน (F3) · label มีช่องว่าง+วงเล็บ "ชื่อ (Name)" · `aria-invalid` + focus ไป field แรกที่ผิด · หน้า 404 จริง · badge เมตามีตัวคั่น `.sr-only`
- **e2e ไม่แตก:** `playwright/smoke.spec.ts` ใช้ `getByLabel('Name'/'Email'/'Message')` แบบ substring — label ใหม่ "ชื่อ (Name)" ฯลฯ ยัง match
- **404 ถูกต้องตาม pattern Astro 7:** `404.astro` ตั้ง `Astro.response.status = 404` + `prerender = false` · `heroes/[slug].astro` ใช้ `return Astro.rewrite('/404')` ตามเอกสาร Astro — slug ผิดได้หน้า 404 ที่มีสถานะ 404 จริง ไม่ใช่หน้าว่าง
- **Privacy:** Bio/Interests ใหม่ตัด ประถม/ร้านเกม/แชมป์โรงเรียน/ที่ทำงาน ออกครบตาม D9 · ส่วน `## Contact` ของ PROFILE ไม่ถูก render บนเว็บ (type `Profile` ใน `src/lib/profile.ts` ไม่มี field นี้) · ไม่มีลิงก์ Dotabuff/OpenDota/Steam profile — ลิงก์เดียวที่เพิ่มคือ `dota2.com/patches` ซึ่งเป็นหน้าทางการของเกม ไม่โยงตัวตน · ชื่อที่แสดงเป็นนามแฝง "valentine" เท่านั้น
- **Markup ไม่รั่วคอร์ส:** เทียบ pattern ของ `tests/public-site.test.ts` กับ markup ใหม่/ที่แก้ทุกไฟล์ (รวม `<script>` และ `<style>` ที่เทสต์สแกนด้วย) — ไม่พบ "lab N" / "แล็บ" · คำว่า lab อยู่เฉพาะใน `docs/` และ frontmatter/comment ที่เทสต์ตัดทิ้ง
- **Docs สอดคล้องเชิงกติกา:** SWARM ใช้ 8/20 turns ≤ เพดาน 20 และบันทึกเหตุผลหยุด (done criteria ครบ) · DECISIONS เพิ่มเฉพาะสิ่งที่เจ้าของตอบ/อนุมัติ · STATUS/OPEN_LOOPS อัปเดตตรงกัน (L3/L4 ปิด · L6/L9 owner = OpenCode) · single-writer ส่งต่อ OpenCode ระบุชัดใน handoff
- **Ownership ไม่ล้ำ:** diff แตะเฉพาะ `src/layouts/`, `src/pages/*` (frontend ของ Claude) + `docs/` — ไม่แตะ `src/lib/db.ts`, `src/lib/api.ts`, `src/pages/api/**` ตามที่ handoff อ้าง (ยืนยันจาก `--stat`)
