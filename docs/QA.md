# QA — Personal Site

> Lab 06 · 2026-09-25 · Claude Code + Playwright MCP (`@playwright/mcp`) · branch `lab-06-qa`

## Setup

- `npm run dev -- --host 127.0.0.1 --port 4321` with `RATE_LIMIT_MAX=0` (no 429 during the test) and `DATA_DIR=./data/e2e-lab06` (demo submits stay out of the real DB · gitignored)
- Before the run: `npm run test:labs` 2/2 · `npm test` 25/25 on `main` (`1a3117e`)
- Browser: Chromium via Playwright MCP · desktop viewport plus mobile 375×800
- Base URL `http://127.0.0.1:4321`

## E2E Playwright

| # | Step | Result | Evidence |
|---|------|--------|----------|
| 1 | Home: h1 = `## Name` in PROFILE | **Pass** · h1 "valentine" · headline "Carry สาย Phantom Assassin · กำลังไต่สู่ Immortal" · tagline matches `## Tagline` | `screenshots/01-home.png` |
| 2 | Status of every main page | **Pass** · `/` `/about` `/interests` `/meta` `/heroes/phantom-assassin` `/guestbook` `/contact` = 200 | fetch in browser |
| 3 | Wrong URL | **Pass** · `/heroes/nope` and `/nope` = **404** · 404 page shows "ไม่พบหน้านี้" (not blank) | fetch in browser |
| 4 | Structure on every page | **Pass** · 1 h1 per page · heading levels never skip · `lang="th"` · no empty links · no img without alt · nav `aria-current="page"` correct | DOM audit |
| 5 | Contact: submit empty | **Pass** · status "กรอกชื่อ อีเมล และข้อความให้ครบ…" · focus → `#name` · `aria-invalid` on all 3 fields | |
| 6 | Contact: bad email (`not-an-email`) | **Pass** · focus → `#email` · `aria-invalid` only on email · no request sent | |
| 7 | Contact: valid demo data | **Pass** · 201 · "ได้รับแล้ว จะตอบกลับทางอีเมลที่ให้ไว้" · form reset · `aria-invalid` cleared | `screenshots/02-contact-success.png` |
| 8 | Guestbook page | **Pass (expected)** · "ยังไม่เปิด" · no form / textarea (D5) | `screenshots/03-guestbook-closed.png` |
| 9 | Guestbook API (demo) | **Pass** · POST → 201 `{id, status:"pending"}` · POST with link → 400 · GET → `[]` (pending never shows before approve) | fetch in browser |
| 10 | Keyboard: first Tab on Home | **Pass** · skip link "ข้ามไปเนื้อหา" appears with a visible focus ring (CSS `:focus-visible` 2px accent + offset) | `screenshots/04-home-skip-link-focus.png` |
| 11 | Mobile 375px | **Pass** · no horizontal scroll on any of the 7 pages · nav wraps to 2 rows | `screenshots/05-home-mobile-375.png` |
| 12 | Text contrast (computed) | **Pass** · muted text 8.2–8.7:1 · eyebrow 6.8:1 · label 15.8:1 · button 13.5:1 (min AA 4.5:1) | computed style |
| 13 | `npm run test:e2e` (`playwright/smoke.spec.ts`) against the same server | **Pass** 2/2 | terminal |
| — | Console errors | 2 · both expected: the 404 from step 3 and the 400 from step 9 | console log |

413/429 in the Contact form were checked in the browser during L10 (PR #33) and not repeated here, because this run turns the rate limit off.

## a11y Debate

Input: the E2E table above plus `src/pages/contact.astro` and `src/layouts/BaseLayout.astro`

### Advocate

- **A1 · The error message doesn't say which field is wrong.** In step 6 only the email is wrong, but status still says "กรอกชื่อ อีเมล และข้อความให้ครบ และตรวจรูปแบบอีเมล". A screen reader user hears one message covering all 3 fields, and has to guess from focus which one failed (WCAG 3.3.1 Error Identification: the error should be described in text).
- **A2 · `aria-describedby="status"` on every field (L11).** After a successful send, tabbing back into the name field reads its description "ได้รับแล้ว…", a stale message that isn't about that field. Status is already `role="status"` + `aria-live="polite"`, so describedby only repeats it.
- **A3 · Nav links on mobile are 21px tall.** That's below the 24px of WCAG 2.2 SC 2.5.8. It technically passes on the spacing exception (row pitch 25px), but it's still cramped for touch, and the platform recommendation is ≥ 44px.
- **A4 · There's no visual sign that fields are required.** They all are, and `required` makes screen readers announce it, but sighted users only find out after they submit.
- Checked and fine: skip link · focus ring · heading order · labels match inputs · contrast · 404 · `lang` · `aria-current`

### Pragmatist

- **Fix before ship: A1 + A2.** Both live in the one file `contact.astro`, take about 15 minutes combined, and don't touch the API. The form is the site's only communication channel (D7), so a confusing error costs a real message.
- **A3 can wait:** it already passes AA on the spacing exception. Add padding to the nav when it's next restyled, and check that the underline on `aria-current` stays in place.
- **A4 can wait:** the microcopy above the form is short and every field is required, so one line "กรอกครบทุกช่อง" is enough. Nothing is broken.
- **Don't do now:** a full axe/Lighthouse audit or a 200% zoom / reduced-motion pass. Do those against the real URL in Lab 08, because dev mode includes the Astro toolbar and skews the results.

## a11y Action items

| Priority | Item | File | Est. |
|---|---|---|---|
| **P0 ✅** | A1 — status names the fields that are wrong (e.g. "ตรวจช่อง: อีเมล") instead of one message for all 3 | `src/pages/contact.astro` | 10 min |
| **P0 ✅** | A2 / L11 — remove `aria-describedby="status"` from the 3 fields (the live region already announces it) | `src/pages/contact.astro` | 5 min |
| **P1 ✅** | A4 — one line in the form microcopy: "กรอกครบทุกช่อง" | `src/pages/contact.astro` | 5 min |
| **P2** | A3 — nav link padding to about 44px tall on mobile · check the underline on `aria-current` | `src/layouts/BaseLayout.astro` | 15 min |
| **P2** | axe / Lighthouse + zoom 200% + reduced motion on the real URL | Lab 08 | — |

## Fixes after the debate (P0 ×2 + P1 · owner approved)

`src/pages/contact.astro` · re-tested in the browser with Playwright MCP after the edit

| Case | Status says | Focus | `aria-invalid` |
|---|---|---|---|
| All fields empty | "ตรวจช่อง: ชื่อ · อีเมล · ข้อความ" | `#name` | all 3 |
| Bad email only | "ตรวจช่อง: อีเมล (รูปแบบไม่ถูกต้อง)" | `#email` | email |
| Name + message are spaces only | "ตรวจช่อง: ชื่อ · ข้อความ" | `#name` | name, message |
| Valid data | "ได้รับแล้ว จะตอบกลับทางอีเมลที่ให้ไว้" (201) | — | none |

- A2: `aria-describedby` on the fields = 0 (the live region `role="status"` still announces as before)
- A4: "กรอกครบทุกช่อง" line under the microcopy · muted colour 8.2:1
- `npm test` 25/25 · `test:labs` 2/2 · `test:e2e` 2/2 · build pass
- Evidence: `screenshots/06-contact-field-error.png`
