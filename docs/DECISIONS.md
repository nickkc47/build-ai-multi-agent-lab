# Decisions — Personal Site

> อนุมัติแล้วเท่านั้น · สังเคราะห์จาก `docs/DEBATE.md` (Agent Teams: Brand · UX · Devil · 2 รอบ) · 2026-09-25

## สรุปการโต้วาที

ทั้งสามบทบาทเห็นตรงกันว่า positioning "valentine · Carry สาย Phantom Assassin · กำลังไต่สู่ Immortal" พร้อมใช้แล้ว และ tagline "ฟาร์มในเงามืด แล้วปิดเกมในจังหวะเดียว" คือ signature ของ brand
ประเด็นที่เถียงกันคือ proof — Brand อยากใช้แชมป์โรงเรียน แต่ Devil ชี้ว่าโยงตัวตนได้และยืนยันไม่ได้ จึงตกลงใช้ Hero Pool เป็นหลักฐานแทน
UX ชนะเรื่อง nav: ใช้คำไทยตรง ๆ ให้ผู้เยี่ยมเข้าใจก่อน ส่วนโทนนักลอบสังหารย้ายไปอยู่ที่ CTA และหัว section
v1 จึงเล็กลง: Home + About มุม B + Interests (Hero Pool) + Contact ฟอร์มเดิม โดยตัด Rank Journey, ช่อง "เรื่อง" และ Guestbook ออก

## การตัดสินใจ (ตาราง)

| ID | หัวข้อ | ตัดสินใจ | เหตุผลสั้น | ใครเสนอ (Brand/UX/Devil) |
|----|--------|----------|------------|---------------------------|
| D1 | Headline / Tagline | คงตาม PROFILE: Headline "Carry สาย Phantom Assassin · กำลังไต่สู่ Immortal" + Tagline "ฟาร์มในเงามืด แล้วปิดเกมในจังหวะเดียว" · tagline ซ้ำที่ Hero · ท้าย About · หัวฟอร์ม Contact | ไม่เคลมเกิน · signature line เดียวทั้งเว็บ | Brand |
| D2 | กลุ่มเป้าหมาย | หลัก = ทีม e-sports/แมวมอง + เพื่อนร่วมปาร์ตี้ · รอง = นายจ้าง ผ่าน About มุม B · คนดูสตรีมพักไว้ | ข้อความจำกัด · ยังไม่มีช่องสตรีมที่ใช้นามแฝง | Brand |
| D3 | กติกาเสียง + ภาษา | ตามบรรทัด "กติกาเสียงบนเว็บ" ใน PROFILE › Tone · UI ภาษาไทยทั้งหมด · CTA หลัก "ส่งสัญญาณมา" | Tone "พูดน้อย เงียบ มั่นใจ" ต้องคงเส้นคงวา · แก้ภาษาปน | Brand · UX |
| D4 | IA และ nav | nav 4 ลิงก์ คำไทยตรง ๆ "หน้าแรก · เกี่ยวกับ · ความสนใจ · ติดต่อ" (ติดต่อขวาสุด เด่นสุด) · ทุกหน้าจบด้วย CTA ไป Contact · Interests = Hero Pool + สิ่งที่สนใจ ไม่ซ้ำ Home | ผู้เยี่ยมครั้งแรกต้องเดาได้ · มีทางไปต่อทุกหน้า | UX (Brand ยอม) |
| D5 | Guestbook | ไม่อยู่ใน v1 — เอาออกจาก nav และการ์ด Home · route ต้องไม่เปิดให้โพสต์จนกว่ามี moderation | spam/doxxing · API ยัง 501 | UX · Devil |
| D6 | Rank Journey | ตัด section/แถบความคืบหน้า · ใช้ "กำลังไต่สู่ Immortal" ใน headline แทน · ไม่แสดงตัวเลขแรงค์ | ตรวจสอบไม่ได้ · ต้องดูแลต่อเนื่อง | Devil (UX · Brand เห็นด้วย) |
| D7 | ฟอร์ม Contact | ฟอร์มเดิม (name / email / message) ไม่เพิ่มช่อง "เรื่อง" · ใต้หัวฟอร์มบอกเวลาตอบกลับ · ซ่อนข้อความนักพัฒนา · error ภาษาคน | ช่องเรื่องต้องแก้ API/DB ฝั่ง OpenCode · ลด scope ข้าม owner | Devil · UX |
| D8 | Proof / Hero Pool | ใช้ Hero Pool (PA signature + PL · LS · Slark · Spectre · Razor) เป็นหลักฐานบนหน้า Interests · ไม่ใช้เรื่อง "แชมป์โรงเรียน" ใน v1 · การ์ด Playstyle รวมเข้า Hero | proof ที่ไม่โยงตัวตน · ลดการ์ดซ้ำ | Devil · Brand (หลังรอบ 2) |
| D9 | About และ Privacy | About มุม B "ปรัชญานักลอบสังหาร" · Bio เวอร์ชันเว็บ 3 ประโยค ไม่เล่า ประถม/ร้านเกม/แชมป์โรงเรียน/ที่ทำงาน · ห้ามลิงก์ Dotabuff/OpenDota/Steam | กันการต่อจิ๊กซอว์ตัวตน | Brand · Devil |

### แก้ไขหลังอนุมัติ

- **D5 (2026-09-25 · เจ้าของเลือก):** เกณฑ์ Lab 04 ต้องมีลิงก์ Guestbook ใน nav → คงลิงก์ "สมุดเยี่ยม" ไว้ แต่หน้าเป็น "ยังไม่เปิด" ไม่มีฟอร์มโพสต์ ไม่มี fetch · การ์ดบน Home ยังเอาออก · เปิดจริงเมื่อ API มี validation + moderation (ดู `docs/fe-be-contract-check.md`)
- **L3/L4 ยังไม่ปิด (เจ้าของเลือก):** Lab 04 ทำ UI ด้วย PROFILE ปัจจุบันไปก่อน — Hero Pool แสดงชื่อ ไม่มีเหตุผล · About ใช้ Bio เดิม · Contact มีแค่ฟอร์ม · เติม PROFILE ภายหลังได้โดยไม่ต้องแก้โค้ด

- **D10 (2026-09-25 · เจ้าของขอเพิ่ม):** เพิ่มไกด์ฮีโร่ `/heroes/[slug]` 6 ตัว (PA signature + Hero Pool) — สไตล์การเล่น · ไอเท็ม (ต้น / แกน / ตามสถานการณ์) · ชนะทาง · แพ้ทาง · จังหวะเกม และหน้า `/meta` Carry ที่แนะนำรายแพตช์ (7.41f · 7.41e) ลิงก์ใน nav "เมตา" · ข้อมูลใน `src/data/heroes.ts` = ความรู้เกมทั่วไป (ไม่ใช่ข้อมูลส่วนตัว · ไม่ลิงก์โปรไฟล์) · แหล่งอ้างอิง: patch notes dota2.com + สถิติ OpenDota + meta report (Dotabuff/Stratz เข้าไม่ได้ตอนค้น) · ต้องอัปเดตเมื่อแพตช์ใหม่ออก · เหตุผลส่วนตัวต่อฮีโร่ยังเป็นของเจ้าของ (L3)

### การแก้ `docs/PROFILE.md` ในรอบนี้

- **ไม่ได้แก้** — Headline / Tagline / กติกาเสียงใน Tone อัปเดตไว้แล้วก่อนรอบนี้ และตรงกับ D1 · D3
- Bio เวอร์ชันเว็บ (D9) และเหตุผล Hero Pool (D8) ต้องให้เจ้าของเขียน — ไม่ให้ agent แต่งแทน (ดู open loop L3)

## สิ่งที่เลื่อนออก (Out of scope v1)

- Guestbook ทั้ง UI และ API (D5)
- Rank Journey / ตัวเลขแรงค์ (D6)
- ช่อง "เรื่อง" ในฟอร์ม Contact (D7)
- Achievements รวมถึง "แชมป์รายการโรงเรียน" (D8 · D9)
- Draft & Meta Notes — จนกว่าเจ้าของจะมีเนื้อหาจริง
- คลิปไฮไลต์ / ลิงก์สตรีม · หน้า Setup · สถิติจาก API ภายนอก
- login · จับคู่ปาร์ตี้ · leaderboard · CMS บล็อก · หลายภาษา

## เกณฑ์พร้อม Frontend (Lab 04)

- [x] L2 ปิดแล้ว: `loadProfile()` อ่านได้ทุกบรรทัด · รองรับ `## Tagline` · Bio แยกย่อหน้า
- [ ] `## Hero Pool` มีเหตุผล 1 บรรทัดต่อฮีโร่ (D8)
- [ ] เจ้าของยืนยันช่องทางติดต่อ: อีเมลที่ใช้นามแฝง หรือ "ฟอร์มอย่างเดียว" · ลบบรรทัด Contact ที่ว่าง/ไม่เปิดเผยออกจาก PROFILE (D7)
- [ ] เจ้าของตอบคำถาม privacy ข้อ 1–2 ใน DEBATE › Devil's Advocate (D9)
- [ ] Bio เวอร์ชันเว็บมุม B อยู่ใน PROFILE (D9) — จากนั้น frontend ทำตาม D3–D8 และ `npm test` ต้องเขียว

## Lab 03 — Issues จาก Decisions

| Issue # | Title | มาจาก Decision | สร้างผ่าน | ปิดโดย |
|---|---|---|---|---|
| [#21](https://github.com/nickkc47/build-ai-multi-agent-lab/issues/21) | Home hero: headline + tagline · รวม Playstyle · ไม่มี Rank Journey | D1 · D6 · D8 | GitHub MCP | Lab 04 |
| [#22](https://github.com/nickkc47/build-ai-multi-agent-lab/issues/22) | Nav 4 ลิงก์ภาษาไทย + ธีม + CTA ท้ายทุกหน้า | D3 · D4 | GitHub MCP | Lab 04 |
| [#23](https://github.com/nickkc47/build-ai-multi-agent-lab/issues/23) | หน้า Interests: Hero Pool เป็น proof | D8 · D4 | GitHub MCP | Lab 04 (รอ L3) |
| [#24](https://github.com/nickkc47/build-ai-multi-agent-lab/issues/24) | Contact form: ฟอร์มเดิม · microcopy ไทย · error ภาษาคน | D7 | GitHub MCP | Lab 04 (UI) · Lab 05 (API) |
| [#25](https://github.com/nickkc47/build-ai-multi-agent-lab/issues/25) | About มุม B + privacy guard | D9 · D2 | GitHub MCP | Lab 04 (รอ L3 · L4) |
| [#26](https://github.com/nickkc47/build-ai-multi-agent-lab/issues/26) | Guestbook ไม่เปิดใน v1 · ตัดสินเรื่อง nav | D5 | `gh` CLI | Lab 04 · Lab 05 |

## Lab 03 — MCP vs gh

- **ความเร็ว:** MCP สร้าง 5 issue ขนานกันในรอบเดียวจากในเซสชัน Claude โดยไม่ต้องเขียนไฟล์ body · `gh` ต้องเขียน body ลงไฟล์ก่อน (`--body-file`) แล้วรันทีละใบ แต่เร็วกว่าเมื่อคนสร้างเองใบเดียว
- **สิทธิ์:** MCP ใช้ `GITHUB_PERSONAL_ACCESS_TOKEN` (fine-grained · repo เดียว) ผ่าน `.mcp.json` · `gh` ใช้ OAuth token จาก `gh auth login` ใน keyring ซึ่งสิทธิ์กว้างกว่า — ทั้งคู่ต้องตรวจว่าชี้ repo ของเรา (`get_me` / `gh repo view`) ไม่ใช่ Onto-IQ
- **Audit trail:** ทั้งสองทางขึ้นเป็นผู้ใช้เดียวกันบน GitHub แยกไม่ออกจากหน้าเว็บ · ฝั่ง MCP มี tool call + body เต็มอยู่ใน transcript ของ Claude · ฝั่ง `gh` มีคำสั่งใน shell history และไฟล์ body — จึงบันทึกตารางด้านบนว่าใบไหนมาจากทางไหน
- **ข้อผิดพลาดที่เจอ:** ไม่มี 401 ในรอบนี้ · ความเสี่ยงหลักของ MCP คือ agent สร้างซ้ำได้ง่าย (ต้อง `list` ก่อน — repo มี course issues #1–20 อยู่แล้ว) · `gh` ต้องระวัง quoting ภาษาไทย/markdown ใน PowerShell จึงใช้ `--body-file` แทน `--body`
- **เมื่อไหร่ใช้อะไร:** MCP เหมาะกับงานที่ agent ต้องอ่านเอกสารแล้วสร้าง/อัปเดตหลายใบต่อเนื่อง (plan → issues) · `gh` เหมาะกับงานที่คนสั่งเองครั้งเดียว, script (`create-course-issues.mjs`), CI หรือเมื่อ MCP ใช้ไม่ได้ — และใช้ยืนยันผลหลัง MCP (`gh issue list`)
