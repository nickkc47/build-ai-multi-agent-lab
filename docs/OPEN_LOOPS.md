# Open Loops

> งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ  
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 16:14 +07:00

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L7 | อัปเดต `src/data/heroes.ts` (GUIDE_PATCH + META บนสุด) เมื่อแพตช์ใหม่ออก · ตรวจ build/matchup ของ 7.41f กับเกมจริง | human | Low | แพตช์ถัดไป | D10 · ข้อมูล win rate ปน 7.41e/7.41f |
| L10 | รอบ frontend: ข้อความ 429 ("ส่งถี่เกินไป") / 413 เฉพาะของตัวเองในฟอร์ม Contact (ตอนนี้ตก branch "อื่น ๆ") · e2e ตั้ง `RATE_LIMIT_MAX` กันชนเพดาน 5/10min | Claude | Medium | รอบ frontend / Lab 06 | สัญญาใหม่ `docs/handoffs/05c-opencode-to-claude.md` |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L6 | Guestbook: approve step (`approveGuestbook` + `scripts/guestbook-approve.mjs`) + rate limit POST · ตัดสินให้ POST ยังรับเป็น `pending` | 2026-09-25 |
| L9 | `/api/contact` rate limit 429 · body ≤ 8 KB → 413 · 201 ตอบ `{id, created_at}` (B2) · `/api/interests` try/catch | 2026-09-25 |
| L3 | PROFILE: Bio มุม B · Interests · Contact = ฟอร์ม · เหตุผลรายฮีโร่ = ไม่ใช้ (เจ้าของตัดสิน · ไกด์ D10 แทน) | 2026-09-25 |
| L4 | privacy: "valentine" ใช้บนเว็บเท่านั้น · repo/author ไม่โยงชื่อจริง | 2026-09-25 |
| — | L3 บางส่วน: Bio มุม B (อนุมัติแล้ว) · Interests ข้อ 1 · Contact = ฟอร์มอย่างเดียว | 2026-09-25 |
| — | Lab 05b swarm 8/20 turns · a11y 8 ข้อ + 404 + แหล่งข้อมูล D10 (`docs/SWARM.md`) | 2026-09-25 |
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
