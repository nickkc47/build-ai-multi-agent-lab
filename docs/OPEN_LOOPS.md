# Open Loops

> งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ  
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 15:50 +07:00

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L3 | เติม PROFILE: เหตุผล 1 บรรทัดต่อฮีโร่ใน `## Hero Pool` (ชื่อ 5 ตัวใส่แล้ว) · ยืนยันช่องทางติดต่อนามแฝง (หรือฟอร์มอย่างเดียว) + ลบบรรทัด Contact ที่ว่าง · Bio เวอร์ชันเว็บมุม B ไม่โยงตัวตน | human | High | ก่อน Lab 04 | ดู DECISIONS D7 · D8 · D9 |
| L4 | ตอบคำถาม privacy: "valentine" ซ้ำชื่อในเกม/Discord ไหม · URL / repo / git author มีชื่อจริงไหม | human | High | ก่อน Lab 04 | DEBATE › Devil's Advocate ข้อ 1–2 |
| L6 | Guestbook: ขั้น approve (pending → approved · script/CLI ภายใน ไม่ใช่ route สาธารณะ) + rate limit ก่อนเปิดฟอร์มบนเว็บ — ตอนนี้ GET ตอบ `[]` เสมอเพราะยังไม่มีขั้นนี้ | OpenCode | Medium | ก่อนเปิด Guestbook | D5 · schema `status` + blocklist มีแล้ว (Lab 05) · UI ยังปิด |
| L7 | อัปเดต `src/data/heroes.ts` (GUIDE_PATCH + META บนสุด) เมื่อแพตช์ใหม่ออก · ตรวจ build/matchup ของ 7.41f กับเกมจริง | human | Low | แพตช์ถัดไป | D10 · ข้อมูล win rate ปน 7.41e/7.41f |
| L9 | `/api/contact`: rate limit / กันสแปม + จำกัดขนาด request body (เช่นเช็ค `content-length` ≤ 8 KB ก่อน parse) · (เลือก) 201 ส่งแค่ `{id, created_at}` (B2) | OpenCode | Medium | ก่อน ship (Lab 08) | review PR #29 · Devil R5 |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L8 | Contact: แยกข้อความ 5xx (F1) · ลบ branch 501 (F2) | 2026-09-25 |
| L5 | Lab 05: `insertContact` / guestbook ใน `db.ts` · validation → 400 · runtime → 500 · error คงที่ · `test:labs` เขียว (PR #29) | 2026-09-25 |
| — | Lab 04 UI ทุกหน้า + contract check + handoff | 2026-09-25 |
| — | Lab 03 issues #21–#26 | 2026-09-25 |
| L2 | แก้ parser `profile.ts` อ่านทุกบรรทัด + `## Tagline` + Bio แยกย่อหน้าบน Home/About | 2026-09-25 |
| — | Lab 02 Debate → `docs/DECISIONS.md` D1–D9 | 2026-09-25 |
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-24 |
| — | Lab 01 เขียน `docs/PROFILE.md` | 2026-09-24 |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
