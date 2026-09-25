# Agents — Build AI Multi-Agent Lab (V4) · seed

กติการ่วมสำหรับ **Claude Code** และ **OpenCode** (Claude อ่านไฟล์นี้ผ่าน `CLAUDE.md` → `@AGENTS.md`)
สินค้า = เว็บ personal branding (Astro) ใน root นี้ · ทำ Lab ที่ **root เท่านั้น**

หลัง Lab 00: `/init` แล้ว **merge** — อย่าลบ Ownership / สี่เสา / Native harness

## เริ่มเซสชัน (≤ 8 บรรทัด)

1. อ่าน `docs/STATUS.md` + `docs/OPEN_LOOPS.md` + handoff ล่าสุดใน `docs/handoffs/` (ถ้ามี)
2. สรุปให้คนดู: Current goal · Latest D-id (ถ้ามี) · Open loops · Blockers — ไม่เกิน 8 บรรทัด
3. ไฟล์ขัดแย้งกัน → **หยุดวิเคราะห์ก่อนแก้โค้ด** · ห้ามสมมุติสิ่งที่เกิดใน CLI อีกฝั่ง ถ้าไม่ได้เขียนใน `docs/`
4. จบงานที่เปลี่ยนสถานะ → อัปเดต `STATUS.md` / `OPEN_LOOPS.md` (+ handoff ถ้าสลับ harness)

**Single-writer:** `STATUS.md` / `OPEN_LOOPS.md` มีคนเขียนคนเดียวต่อรอบ — สลับ Claude ↔ OpenCode หลัง commit หรือหลังเขียน handoff · reviewer อ่านอย่างเดียวจนโอนงานชัดใน handoff · อย่าให้สอง agent แก้ไฟล์เดียวกันพร้อมกันโดยไม่แยก branch

## สี่เสา + Workflow

```text
00 Init → 01 Interview → 02 Debate → 03 Issues → 04 FE → 05 BE → 05b Swarm(≤20) → 06 QA → 07 Review → 08 Ship
```

1. **Multi-Agent** — หน้าที่และความจำแยก (ไฟล์ใน `.claude/agents/`, `.opencode/agents/` + คนละ CLI)
2. **Sub-Agent** — spawn ใช้แล้วทิ้ง; สิ่งที่ต้องจำต่อ = เขียนลง `docs/` เท่านั้น
3. **การประสานงาน** — handoff ผ่าน docs / issues / PR / review สำคัญกว่าแชทเดียว
4. **Swarm** — หยุดเมื่อ done **หรือ** ครบ **20 turns** แล้วสรุปช่องว่าง (Lab 05b · บันทึกใน `docs/SWARM.md`)

งาน implement / swarm / ship → ใช้ skill **`public-site-safe`** (มีทั้ง `.claude/skills/` และ `.opencode/skills/` — เนื้อหาเดียวกัน)

## สี่ชั้นความรู้ (อ่านก่อนลงมือ)

| ชั้น | ไฟล์หลัก |
|---|---|
| Rules | ไฟล์นี้ · `CLAUDE.md` · skill `public-site-safe` |
| Context | `COURSE.md` · `docs/PROFILE.md` · `docs/DECISIONS.md` |
| State (Hot) | `docs/STATUS.md` · `docs/OPEN_LOOPS.md` |
| Artifacts | `src/` · tests · `docs/QA.md` · PR |

**Hot / Warm / Cold:** Hot = STATUS + OPEN_LOOPS + handoff ล่าสุด · Warm = PROFILE/DECISIONS/Ownership · Cold = `_cli-*` / logs เก่า
**Proposed vs Approved:** `DEBATE.md` = ยังไม่ปิด · `DECISIONS.md` = อนุมัติแล้วเท่านั้น
**ยังไม่มีจริงจนกว่าจะถึง Lab:** `DEBATE.md`/`DECISIONS.md` (Lab 02) · `docs/QA.md` (06) · `docs/SWARM.md` (05b) · `docs/SHIP.md` (08) — อย่าถือว่าหาย และอย่าสร้างล่วงหน้า · `docs/STATUS.md`/`OPEN_LOOPS.md` เริ่มจาก copy `*.example` ใน Lab 00

## Ownership

| Artifact | Owner |
|---|---|
| UI (`src/pages/*.astro`, `src/layouts/`, styles) | Claude · agent `frontend` |
| API + SQLite (`src/lib/db.ts`, `src/pages/api/*`) | OpenCode · agent `backend` |
| E2E / a11y (`docs/QA.md`) | Playwright MCP + either CLI |
| Profile / debate docs | Claude (Lab 01–02 · subagents) |
| Hot state (`STATUS.md` · `OPEN_LOOPS.md`) | ผู้ถืองานรอบนั้น (single-writer) |
| Handoffs (`docs/handoffs/`) | ผู้ส่งงานก่อนสลับ harness |
| Review artifacts | Lab 07 · agent `reviewer` (Claude) / OpenCode review |
| Ship (`docs/SHIP.md`) | Lab 08 |

## ความจำ

| ชนิด | อยู่ที่ | ตัวอย่าง |
|---|---|---|
| ร่วม (shared) | `docs/`, git, PR | STATUS, OPEN_LOOPS, PROFILE, DECISIONS, QA, handoffs |
| แยก (agent-local) | เซสชัน + ไฟล์ agent | frontend ไม่ถือ context backend |
| **Harness persistent** | Claude / OpenCode native | ดูตารางล่าง — **ห้ามสร้าง memory bus เอง** |
| ทิ้งได้ | Sub-Agent รอบเดียว | Brand/UX/Devil หลังจบ Lab 02 |

| เครื่องมือ | ใช้ของอะไร |
|---|---|
| Claude Code | `memory: project` บน agent → `.claude/agent-memory/<name>/` · auto memory ผ่าน `/memory` |
| OpenCode | `AGENTS.md` + agent file + **resume session** (เซสชันใหม่ไม่บังคับ recall ปากเปล่า) |

ความจำร่วมของคอร์ส (`docs/`) คนละชั้นกับ harness memory — สิ่งที่ต้องโชว์ข้ามคน/CLI ให้เขียนลง docs
Adapter (`AGENTS.md` / `CLAUDE.md`) ต้อง**ชี้ไป**ไฟล์กลาง — อย่าคัดลอกเนื้อหา STATUS/DECISIONS ซ้ำใน adapter

## Native harness only

harness = ความสามารถถาวรที่ Claude Code / OpenCode มีให้ในตัว (memory, plugin, session) — ใช้ของเดิม ไม่สร้างชั้นเอง

- Plugins project scope: superpowers (oh-my-openagent ยังไม่รองรับ OpenCode v2 — ใช้ native agents)
- **Call ข้าม harness ทำได้** — แต่ละตัวรันบน harness ตนเอง: ฝั่ง OpenCode เรียก `claude -p` · ฝั่ง Claude เรียก `opencode run` (headless one-shot · ท่อ = ไฟล์ใน `docs/`)
- **กติกา call:** ฝั่งที่ถูกเรียกเขียนได้**เฉพาะไฟล์รายงาน**ที่ prompt ระบุ (เช่น `docs/review-*.md`) — ห้ามแตะไฟล์ ownership ของผู้เรียก · อย่าให้สอง harness เขียน working tree พร้อมกัน (commit ก่อน)
- ห้ามสร้างระบบส่งข้อความ/สถานะระหว่าง CLI เอง (เช่น ไฟล์ JSON เป็นท่อส่งงาน) · ห้าม daemon/loop ถาวร
- MCP = งานผลิต — **ไม่ใช่**ท่อระหว่างสอง CLI · Swarm หยุดเมื่อ done หรือครบ 20 turns

## คำสั่ง

```powershell
npm install                      # template ไม่มี node_modules
copy .env.example .env           # ทำครั้งแรก (Windows)
npm run dev                      # http://localhost:4321
npm test                         # tests/** ยกเว้น tests/labs — เขียวบน template ใหม่
npm run test:labs                # tests/labs/** — RED โดย design จนกว่าจะถึง Lab 05
npx vitest run tests/smoke.test.ts   # รันไฟล์เดียว
npm run test:e2e                 # playwright/ — ต้องมี server เอง (ดูด้านล่าง)
npm run build; npm start         # start = node ./dist/server/entry.mjs ต้อง build ก่อน
node scripts/create-course-issues.mjs   # สร้าง course issues (ต้อง login gh)
```

- ไม่มี script lint / typecheck / format — **อย่าเดา** ให้ใช้ `npm test` + `npm run build` เท่านั้น
- CI (`.github/workflows/ci.yml`): `npm ci` → `npm test` → `npm run build` บน Node 22 — PR ต้องผ่านสองคำสั่งหลัง
- E2E: `playwright.config.ts` **ไม่มี `webServer`** — ต้อง start เอง (`npm run dev`) แล้วชี้ `PLAYWRIGHT_BASE_URL` (ค่าเริ่ม `http://127.0.0.1:4321`)

## โค้ดเบส (ตรวจแล้ว)

- Astro 7 · `output: 'server'` + `@astrojs/node` standalone · better-sqlite3 · Node ≥ 22.12
- `src/pages/*.astro` + `src/layouts/BaseLayout.astro` — UI ทุกหน้า `export const prerender = false`
- `src/lib/profile.ts` — อ่าน `docs/PROFILE.md` มาแสดงบนเว็บ · **ข้อจำกัดตอนนี้:** regex ใช้ `$` กับ flag `m` → แต่ละหัวข้ออ่านได้แค่บรรทัดแรก (Bio ได้ย่อหน้าแรก · Interests ได้ข้อแรก) — ดู open loop L2
- `src/lib/db.ts` — `getDb()` สร้าง `$DATA_DIR/site.sqlite` (ค่าเริ่ม `./data` — gitignore แล้ว) + ตาราง `contact_messages`, `guestbook` · `insertContact` / `listGuestbook` / `insertGuestbook` เป็น stub โยน `NOT_IMPLEMENTED` จน Lab 05
- `src/pages/api/{contact,guestbook,interests}.ts` — error ขึ้นต้น `NOT_IMPLEMENTED` → **501** · validation → 400 · อื่น ๆ → 500
- Env: `.env` จาก `.env.example` — `STUDENT_SLUG`, `SITE_URL` (ใช้เป็น `site` ใน astro config), `PORT`, `DATA_DIR`, `GITHUB_PERSONAL_ACCESS_TOKEN` (MCP github อ่านผ่าน `opencode.json` / `.mcp.json`)
- Local-only (gitignore · มี `.example` เป็นต้นแบบ): `.env` · `.mcp.json` · `.claude/settings.local.json`
- Commit ได้ (project scope ของทีม · สร้างจาก `.example` ใน Lab 00): `opencode.json` · `.claude/settings.json`

## การทดสอบ (quirks)

- `tests/public-site.test.ts` จับคำว่า "lab N" / "แล็บ" ใน **markup ที่ render ออกหน้าเว็บ** (`.astro`/`.html` ตัด frontmatter + HTML comment แล้ว) — หน้าเว็บต้องไม่พูดถึงคอร์ส · comment ใน `.ts` พูดถึง Lab ได้ · แก้ UI แล้วต้องรัน `npm test` ทุกครั้ง
- `tests/labs/lab05-api.test.ts` ตั้ง `DATA_DIR` + ลบ/สร้าง `data/vitest-lab` เอง — ไม่ต้องเตรียม DB
- `docs/PROFILE.md` มีหัวข้อ `## Privacy` — ห้ามแสดงข้อมูลส่วนตัวบนเว็บ

## ห้าม

- Commit `.env`, PAT, Coolify webhook, `node_modules`
- เคลม deploy สำเร็จโดยไม่มี URL 200 จริง
- บังคับ tmux บน Windows
- PR เข้า `Onto-IQ/*` — เข้า learner repo เท่านั้น
- ปล่อย swarm เกิน 20 turns โดยไม่สรุปหยุด

## Labs

[`SETUP.md`](./SETUP.md) → [`labs/lab-00-project-init`](./labs/lab-00-project-init/README.md) → [`labs/README.md`](./labs/README.md)
