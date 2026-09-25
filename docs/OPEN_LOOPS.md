# Open Loops

> งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ  
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 +07:00

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L3 | เติม PROFILE: เหตุผล 1 บรรทัดต่อฮีโร่ใน `## Hero Pool` (ชื่อ 5 ตัวใส่แล้ว) · ยืนยันช่องทางติดต่อนามแฝง (หรือฟอร์มอย่างเดียว) + ลบบรรทัด Contact ที่ว่าง · Bio เวอร์ชันเว็บมุม B ไม่โยงตัวตน | human | High | ก่อน Lab 04 | ดู DECISIONS D7 · D8 · D9 |
| L4 | ตอบคำถาม privacy: "valentine" ซ้ำชื่อในเกม/Discord ไหม · URL / repo / git author มีชื่อจริงไหม | human | High | ก่อน Lab 04 | DEBATE › Devil's Advocate ข้อ 1–2 |
| L5 | Lab 05: `insertContact` / guestbook ใน `db.ts` · validation → 400 · runtime → 500 · error คงที่ (ไม่ส่ง `err.message`) · `test:labs` เขียว | OpenCode | High | Lab 05 | handoff `04-claude-to-opencode.md` · `fe-be-contract-check.md` |
| L6 | Guestbook moderation (pending/approved หรือ blocklist) ก่อนเปิดฟอร์มบนเว็บ | OpenCode | Medium | ก่อนเปิด Guestbook | D5 แก้ไข · UI ยังปิด |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
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
