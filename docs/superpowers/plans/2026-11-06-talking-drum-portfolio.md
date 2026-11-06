# The Talking Drum Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Josue's Awwwards-grade, 3D, sound-rich portfolio on AWS Amplify Hosting with a real serverless Drum Telegraph, and submit it to the AWS Student Builder Challenge before the deadline.

**Architecture:** A Next.js static export (`web/`) hosted on Amplify Hosting (platform `WEB`) renders every section as static HTML; the 3D drum scene, GSAP motion and Web Audio sound are progressive layers on top. A separate AWS CDK stack (`infra/`, us-east-1) provides `GET/POST /drum` (API Gateway HTTP API → Lambda → DynamoDB counter + SNS fan-out to email and SQS) plus monitoring and budgets. The site works fully if the API or WebGL is missing.

**Tech Stack:** Next.js (latest, App Router, TypeScript) · Tailwind CSS v4 · GSAP 3.13+ (`@gsap/react`, ScrollTrigger, SplitText) · Lenis · three + @react-three/fiber + @react-three/drei · Web Audio API · Vitest · Playwright · @axe-core/playwright · AWS CDK v2 (TypeScript) · Node.js 22 Lambda (arm64) · AWS SDK v3.

**Spec:** `docs/superpowers/specs/2026-11-06-talking-drum-portfolio-design.md` (approved). **Content source of truth:** `plan.md`. Older PRD (`docs/03-…`) acceptance criteria AC-H1, AC1–AC12 apply where the spec doesn't override them.

## Timeline & phase gates (WAT, Fri 6 Nov 2026)

| Phase | Tasks | Gate (must be true before the next phase) | Target |
|---|---|---|---|
| 1 Safety net | 1–4 | Live Amplify URL serves all content + 2D drum with 8 messages; reviewer approved | 13:00 |
| 2 Cloud | 5–7 | `POST /drum` works from the live site; SNS email + SQS receive it; canary green; `/how-it-works/` live | 15:00 |
| 3 Wow | 8–9 | 3D hero + drum stage, fan-out animation, sound design, motion — all with fallbacks | 17:30 |
| 4 Ship | 10–11 | QA green, screenshots, GIF, write-up ready; **feature freeze 18:00**; owner submits by **22:00** | 21:00 |

**Overrun rule:** if a phase is late, cut the remaining unbuilt Phase-3 items (in this order: Stage-Mode clave → magnetic buttons → marquee velocity → fan-out packets → 3D hero teaser). Never cut Phase 1, 2, or 4. Hard deadline Sat 7 Nov 08:59 WAT.

**Git rule:** work on local `main`; **push to `origin main` only at the end of a phase after its reviewer approves** (Amplify auto-deploys every push). Commit after each task.

## Global Constraints

- Hosting: AWS Amplify Hosting, platform `WEB`, Next `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`; monorepo `appRoot: web`, artifacts `out`.
- AWS: default AWS CLI profile, region `us-east-1`; CDK v2 TypeScript in `infra/`; no Amplify Gen 2 backend.
- Repo: `Joshua4-0p/joshua.cloud-portfolio-website` (public). Never commit `assets/`, `docs/design-references/`, `.env*`.
- Content: every fact from `plan.md` only. LinkedIn-sourced facts in plan.md override the CV. No invented skills, numbers, roles or quotes.
- Never publish: ID number, date of birth, phone/WhatsApp numbers, home address, CGPA, the original CV.
- Hint text exactly: `The drum has a message for you — tap it` (real `<a href="#drum">`, static HTML, visible above the fold at 360×640 and 1280×720).
- Tagline exactly: `Before SNS, there was the drum.`
- Cultural framing exactly: `inspired by the talking-drum and slit-drum traditions of Cameroon and West & Central Africa`. Name no specific people's tradition.
- Secret phrase `LLHL` (● ● ○ ●). Low pad key `F`, high pad key `J`, only while focus is inside `#drum`.
- Palette tokens: `--ink #0B0B0C`, `--bone #F2EDE4`, `--copper #C8743C`, `--copper-hi #E8A06A`, `--ash #8A8580`, `--signal #4FD1C5` (signal only for AWS-delivery states). Text contrast ≥ 4.5:1.
- Fonts via `next/font/google`: Anton (display), Inter Tight (body), JetBrains Mono (labels/nav/notation).
- No gates: no START / "enter with sound" screen, no blocking loader, no scroll-jacking. Sound off by default, never before a user gesture. No audio files.
- `prefers-reduced-motion`: no Lenis, no reveals, no pulse, no 3D animation (static poster), sound still works.
- Budgets: critical path ≤ 200 KB gz without the 3D chunk; 3D chunk ≤ 350 KB gz, lazy; drum JS (excl. three) ≤ 40 KB gz. Lighthouse mobile: perf ≥ 90, a11y/best-practices/SEO ≥ 95.
- API: `GET /drum` → `200 {"count": number}`; `POST /drum` body `{"phrase": "^[LH]{4}$"}` → `200 {"count": number, "messageId": string}`; anything else → `400 {"error": "invalid phrase"}`. Client timeout 3000 ms; failures are silent.
- Mood-board images and reference screenshots are inspiration only: never copy their text, assets, logos or signature effects; never ship them.
- One creative feature only (The Talking Drum). No theme switcher, terminal, game, or chatbot.

## Review Focus

1. **Double-firing hits** — a touch tap fires `pointerdown` and then `click`; a key press while a pad is focused fires `keydown` and the button's `click`. Each physical hit must count exactly once. → Task 3 test `pad hit counts once per pointer tap and once per key press`.
2. **API down, slow, or blocked (CORS/CSP)** — the drum must still decode instantly and show no error; the delivery line and counter just don't appear. → Task 7 tests `sendPhrase returns null on timeout/HTTP 500/network error`, and Task 10 e2e `drum works with API blocked`.
3. **Storage unavailable** (Safari private mode, blocked site data) — `localStorage` throws; the drum and sound toggle must still work for the session. → Task 3 test `storage helpers swallow exceptions`.
4. **The 9th phrase and beyond** — after all 8 messages are decoded, further phrases replay messages from #1 in order (progress stays 8/8); never crash or show an empty card. → Task 3 test `after 8 decodes the next phrase replays message 0`.
5. **Hostile POST bodies** — non-JSON, missing/extra-long/lowercase phrase, 10 KB body, wrong method. Lambda must return 400 without touching DynamoDB or SNS. → Task 5 tests `rejects invalid bodies without side effects`.

---

## File map

```
amplify.yml                         monorepo build spec
web/
  next.config.ts  package.json  vitest.config.ts  playwright.config.ts  customHttp.yml
  scripts/export-images.mjs          sharp: ../assets → public/images/*.webp
  scripts/check-pii.mjs              grep src/ and out/ for never-publish strings (exit 1 on hit)
  public/images/  public/og.png  public/favicon.svg  public/robots.txt  public/sitemap.xml
  src/content/site.ts                ALL copy, typed (from plan.md)
  src/lib/drum-engine.ts             pure phrase/decode state machine
  src/lib/storage.ts                 safe localStorage helpers
  src/lib/telegraph.ts               API client (sendPhrase, getCount)
  src/lib/audio.ts                   Web Audio synth (singleton)
  src/lib/motion.ts                  GSAP/Lenis setup + reduced-motion helpers
  src/app/layout.tsx  page.tsx  globals.css  not-found.tsx  how-it-works/page.tsx
  src/components/Nav.tsx  SoundPill.tsx  Emblem.tsx  MagneticButton.tsx  ProjectCover.tsx
  src/components/sections/{Hero,About,Superpowers,Work,Recognition,Community,Contact,Footer}.tsx
  src/components/drum/{DrumSection,Pads,MessageCard,MessageList}.tsx
  src/components/three/{SlitDrum,Stage,FanOut,DrumCanvas}.tsx  (lazy chunk)
  src/**/*.test.ts                   vitest unit tests
  e2e/*.spec.ts                      Playwright
infra/
  bin/app.ts  lib/talking-drum-stack.ts  lambda/drum.ts  lambda/drum.test.ts  test/stack.test.ts
docs/submission/project-post.md  docs/submission/screenshots/  docs/submission/demo.gif
README.md
```

---

## Phase 1 — Safety net (target live by 13:00)

### Task 1: Scaffold, design system, content module, images

**Files:**
- Create: `web/` (via create-next-app), `web/src/content/site.ts`, `web/src/content/site.test.ts`, `web/src/app/globals.css`, `web/src/app/layout.tsx`, `web/src/components/Emblem.tsx`, `web/scripts/export-images.mjs`, `web/scripts/check-pii.mjs`, `web/public/favicon.svg`, `web/public/robots.txt`, `amplify.yml`, `web/customHttp.yml`

**Interfaces:**
- Produces `site.ts` exports (exact names; later tasks import these):
  - `profile: { name: string; shortName: string; titlesPrimary: string[]; titlesSecondary: string[]; status: string; location: string; tagline: string; hint: string; email: string; links: { linkedin: string; github: string; devto: string; repo: string }; builderCenterHandle: string; aboutStory: string /* ≤120 words */ }`
  - `experience: { org: string; role: string; period: string; summary: string }[]`
  - `superpowers: { index: string /* "00-1" */; title: string; skills: string[]; proofs: { label: string; href: string }[] }[]` (5 columns: Cloud & Serverless · Security & Resilience · DevOps & Monitoring · Full-Stack · People)
  - `projects: { slug: string; name: string; period: string; problem: string; role: string; stack: string[]; decisions: string; outcome: string; links: { label: string; href: string }[]; learning: boolean; tags: string[] }[]` (6, in plan.md order)
  - `moreProjects: string[]`
  - `achievements: { name: string; issuer: string; date: string; href?: string }[]` (AWS Certified Cloud Practitioner first)
  - `community: { org: string; role: string; period: string; summary: string }[]`
  - `talks: { title: string; host: string; date: string; format: string }[]`
  - `writing: { title: string; date: string; href: string }[]`
  - `photos: { src: string; alt: string; caption: string }[]`
  - `DRUM_MESSAGES: readonly string[]` (exactly the 8 from plan.md, in order), `PUNCHLINE: string`, `SECRET_PHRASE = 'LLHL'`, `CULTURAL_FRAMING: string`, `LAST_UPDATED = '6 Nov 2026'`
- Produces CSS tokens (Global Constraints palette) and Tailwind theme mapping `ink/bone/copper/copper-hi/ash/signal`, font CSS variables `--font-display`, `--font-body`, `--font-mono`.
- Produces `<Emblem className? />`: original SVG line-art — a fist holding two crossed drumsticks inside a ring with a geometric band. Drawn from scratch; must not trace mood-board images.

- [ ] **Step 1: Scaffold.** From repo root: `npx create-next-app@latest web --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack`. Add deps: `npm i gsap @gsap/react lenis three @react-three/fiber @react-three/drei` and dev deps `npm i -D vitest jsdom @playwright/test @axe-core/playwright sharp serve`. Set `next.config.ts`: `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`. Add scripts: `"test": "vitest run"`, `"e2e": "playwright test"`, `"pii": "node scripts/check-pii.mjs"`, `"images": "node scripts/export-images.mjs"`, `"preview": "serve out -l 4321"`.
- [ ] **Step 2: Write failing test `web/src/content/site.test.ts`**

```ts
import { DRUM_MESSAGES, SECRET_PHRASE, profile, projects, achievements } from './site';
test('exactly 8 drum messages, each ≤140 chars, no placeholders', () => {
  expect(DRUM_MESSAGES).toHaveLength(8);
  for (const m of DRUM_MESSAGES) { expect(m.length).toBeLessThanOrEqual(140); expect(m).not.toMatch(/TODO|TBD|\[|lorem/i); }
});
test('pinned copy', () => {
  expect(profile.hint).toBe('The drum has a message for you — tap it');
  expect(profile.tagline).toBe('Before SNS, there was the drum.');
  expect(SECRET_PHRASE).toBe('LLHL');
});
test('six projects in plan.md order; DocuSmart has no repo link', () => {
  expect(projects.map(p => p.slug)).toEqual(['his','dailyreport-ai','afripay','docusmart','apache-nagios','talking-drum']);
  expect(projects.find(p => p.slug === 'docusmart')!.links).toEqual([]);
});
test('AWS certification listed first', () => { expect(achievements[0].name).toBe('AWS Certified Cloud Practitioner'); });
```
- [ ] **Step 3: Run `npm test` in `web/`** → FAIL (module missing).
- [ ] **Step 4: Write `site.ts` from plan.md**, verbatim facts. `aboutStory`: Bafoussam → Dschang → Buea → cloud, bilingual home, drums since Lower Sixth; ≤120 words. `talking-drum` project `links` = `[{label:'Repo', href:'https://github.com/Joshua4-0p/joshua.cloud-portfolio-website'}]`.
- [ ] **Step 5: `npm test`** → PASS.
- [ ] **Step 6: Images.** `export-images.mjs` reads `../assets`, applies EXIF rotation, writes WebP (quality 78) at widths 640 and 1280 to `public/images/<name>-<w>.webp` for: `headshot-blue-suit.png`→`headshot`, `speaker-green-suit.png`→`speaker`, `flyer-unbreakable-cloud-2026-10-31.jpg`→`flyer` (crop the bottom 22% to remove the QR/register bar), `PXL_20260117_130945347.MP.jpg`→`odc-talk-1`, `PXL_20260117_130948486.MP.jpg`→`odc-talk-2`, `IMG-20260117-WA0016.jpg`→`odc-talk-3`, `IMG_3145.jpg`→`community-day-2026`, `IMG-20260727-WA0030.jpg`→`community-day-booth`. Run `npm run images`; confirm 16 files, each < 250 KB.
- [ ] **Step 7: PII guard.** The real values must never appear in the repo, so `check-pii.mjs` uses only generic patterns: Cameroon phone numbers `/(?:\+?237[\s-]?)?6\d{8}/`, slash dates `/\b\d{2}\/\d{2}\/(19|20)\d{2}\b/`, `/CGPA/i`, `/date of birth|place of birth|whatsapp/i`, and long uppercase ID-like tokens `/\b[A-Z0-9]{18,}\b/`. It additionally reads exact strings, one per line, from an **untracked** `web/.pii-local.txt` if that file exists (add `.pii-local.txt` to `.gitignore`; the owner/orchestrator fills it locally from the CV — never paste the values into any tracked file, prompt or commit). Scans `src/` and (if present) `out/` text files; exit 1 listing file:line hits. Run `npm run pii` → exit 0.
- [ ] **Step 8: Design system.** `globals.css`: tokens, base `body{background:var(--ink);color:var(--bone)}`, focus ring `2px solid var(--copper)` offset 3px, `.sr-only`, reduced-motion block disabling transitions/animations. `layout.tsx`: fonts, `<html lang="en">`, metadata (title `Tiaya Fotseu Josue — Cloud & DevOps Engineer`, description, Open Graph/Twitter with `/og.png`, canonical placeholder updated in Task 4), JSON-LD `Person` (name, jobTitle, url, sameAs LinkedIn/GitHub/dev.to — no phone/address). `favicon.svg` = Emblem. `robots.txt` allows all.
- [ ] **Step 9: Build files.** `amplify.yml`:

```yaml
version: 1
applications:
  - appRoot: web
    frontend:
      phases:
        preBuild:
          commands: ['nvm install 22', 'nvm use 22', 'npm ci']
        build:
          commands: ['npm run build', 'npm run pii']
      artifacts: { baseDirectory: out, files: ['**/*'] }
      cache: { paths: ['node_modules/**/*'] }
```
`web/customHttp.yml`: for pattern `**/*` set `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY`, `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.execute-api.us-east-1.amazonaws.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`. (Task 7 narrows `connect-src` to the real API host.)
- [ ] **Step 10: `npm run build`** → `web/out/index.html` exists. Commit: `feat(web): scaffold, design tokens, content module, optimised images`.

### Task 2: All content sections (static, final visual identity, no 3D)

Before building each section, open its reference screenshots in `docs/design-references/<site>/` (desktop + mobile) and follow spec §6 "take / change" columns. Copy structure and pacing only.

**Files:**
- Create: `web/src/components/{Nav,MagneticButton,ProjectCover}.tsx`, `web/src/components/sections/{Hero,About,Superpowers,Work,Recognition,Community,Contact,Footer}.tsx`, `web/src/lib/motion.ts`, `web/e2e/content.spec.ts`, `web/playwright.config.ts`
- Modify: `web/src/app/page.tsx`

**Interfaces:**
- Consumes: everything from `site.ts`; `Emblem`.
- Produces: section ids `hero, about, superpowers, work, achievements, community, drum, contact` (drum placeholder `<section id="drum">` with heading + no-JS description + `<details>` listing all 8 messages, filled by Task 3); `MagneticButton({ href, children, className })` (magnetic only on `(pointer: fine)`, no-op under reduced motion); `ProjectCover({ project })` (typographic cover: name in Anton, tags, emblem glyph, ink/copper); `motion.ts` exports `initMotion(): () => void` (Lenis + ScrollTrigger + SplitText line reveals on `[data-reveal]`; returns cleanup; returns no-op under reduced motion).
- Hero right-side copy: `titlesPrimary` large, `titlesSecondary` small. Hero left pill = hint link to `#drum` with Emblem and an 8 s pulse ring (CSS, disabled under reduced motion). Marquee text `TIAYA FOTSEU JOSUE — ` repeated, CSS animation. Hero centre: a static poster area reserved for the 3D drum (Task 8) — until then an SVG silhouette of a slit drum in copper.
- Nav: `[ ABOUT ] [ SUPERPOWERS ] [ WORK ] [ DRUM ] [ CONTACT ]` in mono; skip link "Skip to content" first; after 120 px scroll collapses into a round menu button; mobile (<768 px) round button opens a full-screen menu (focus-trapped, `Esc` closes).
- Work: `list • grid` toggle (buttons with `aria-pressed`); default list ≥1024 px, grid below. List rows: big name, tags right; cover preview follows the cursor with a round "View" (pointer:fine only). Click/Enter on a row/card expands an inline case-study panel (`<details>`-like disclosure with `aria-expanded`): problem · my role · stack · decisions · outcome · links; "Learning project" badge when `learning`.
- Recognition: ruled rows icon · name · superscript date · ↗ link (Olha pattern). Community: experience timeline (DIGISOL, Cloud Builders Africa, Educloud Academy, Codveda), roles, talk (flyer + speaker photo), photo strip with captions, Writing list (3 dev.to articles), Builder Center handle as text.
- Contact: huge `LET'S BUILD`, headshot chip, magnetic "Get in touch" (`mailto:`), pill links email/LinkedIn/GitHub/dev.to, live Buea time (`Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Douala',hour:'2-digit',minute:'2-digit'})`, rendered client-side, static fallback "WAT, UTC+1"). Footer: repo link, `How this site is built` → `/how-it-works/`, `Last updated 6 Nov 2026`, `© 2026 Tiaya Fotseu Josue`.

- [ ] **Step 1: Write failing e2e `web/e2e/content.spec.ts`** (Playwright against `npm run preview` via `webServer` in config, baseURL `http://localhost:4321`):

```ts
test('every section is in static HTML (JS disabled)', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false }); const page = await ctx.newPage();
  await page.goto('/');
  for (const id of ['hero','about','superpowers','work','achievements','community','drum','contact'])
    await expect(page.locator(`section#${id} h2, section#${id} h1`).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'The drum has a message for you — tap it' })).toHaveAttribute('href', '#drum');
  await expect(page.locator('#drum details li')).toHaveCount(8);
});
test('hint above the fold at 360x640 and 1280x720', async ({ page }) => {
  for (const s of [{width:360,height:640},{width:1280,height:720}]) {
    await page.setViewportSize(s); await page.goto('/');
    const box = await page.getByRole('link', { name: /The drum has a message/ }).boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(s.height);
  }
});
test('no horizontal scroll at 360px; nav link reaches its section', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 }); await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  await page.getByRole('button', { name: /menu/i }).click();
  await page.getByRole('link', { name: /WORK/ }).click();
  await expect(page.locator('section#work')).toBeInViewport();
});
```
- [ ] **Step 2: `npm run build && npx playwright install chromium && npm run e2e`** → FAIL.
- [ ] **Step 3: Build the sections** per the interface notes and spec §5–6. Every text node comes from `site.ts`. All images have meaningful `alt`. `<h1>` = name in Hero; each section `<h2>`.
- [ ] **Step 4: `npm run build && npm run e2e && npm run pii`** → PASS, exit 0.
- [ ] **Step 5: Visual check.** Playwright screenshots at 1440×900 and 390×844 of each section into `web/e2e/__shots__/` (gitignored); compare side by side with the matching reference screenshots; fix spacing/scale until the pacing matches.
- [ ] **Step 6: Commit** `feat(web): all portfolio sections in final visual identity`.

### Task 3: Talking Drum core (2D, accessible, sound basics)

**Files:**
- Create: `web/src/lib/drum-engine.ts`, `web/src/lib/drum-engine.test.ts`, `web/src/lib/storage.ts`, `web/src/lib/storage.test.ts`, `web/src/lib/audio.ts`, `web/src/components/SoundPill.tsx`, `web/src/components/drum/{DrumSection,Pads,MessageCard,MessageList}.tsx`, `web/e2e/drum.spec.ts`
- Modify: `web/src/app/page.tsx` (replace drum placeholder, keep its no-JS `<noscript>`/`<details>` content)

**Interfaces:**
- `drum-engine.ts`:
  - `type Tone = 'L' | 'H'`
  - `interface DrumState { phrase: Tone[]; decoded: number[]; nextIndex: number; lastHitAt: number; stageUnlocked: boolean; stage: boolean }`
  - `initialState(decoded?: number[]): DrumState`
  - `hit(s: DrumState, tone: Tone, now: number): { state: DrumState; decoded?: { index: number; phrase: string; secret: boolean; replay: boolean } }` — if `now - s.lastHitAt > 2000` the partial phrase resets before adding; on the 4th tone it emits `decoded` for `nextIndex`, adds it to `decoded` (unique), advances `nextIndex = (nextIndex+1) % 8`, clears the phrase; `replay = decoded already contained index`; `secret = phrase === SECRET_PHRASE`; `stageUnlocked` becomes true when `decoded.length >= 3` or `secret`; a secret phrase also sets `stage = true`.
  - `enterStage(s): DrumState` (only if unlocked), `exitStage(s): DrumState`, `revealAll(s): DrumState` (decoded = 0..7, unlocked, stage = true — used by `?mode=stage`).
  - `toNotation(phrase: string): string` — `L`→`●`, `H`→`○`.
- `storage.ts`: `loadDecoded(): number[]`, `saveDecoded(d: number[]): void`, `loadSound(): boolean`, `saveSound(on: boolean): void` — keys `td.decoded`, `td.sound`; every access in try/catch; invalid JSON → defaults.
- `audio.ts` (singleton, lazily creates one `AudioContext` on first call from a user gesture): `audio.isSupported(): boolean`, `audio.isOn(): boolean`, `audio.setOn(on: boolean): void`, `audio.drum(tone: Tone): void`, `audio.click(): void`, `audio.hover(): void`, `audio.swell(): void`, `audio.chime(): void`, `audio.startClave(): void`, `audio.stopClave(): void`. In this task implement `drum` and `chime` and `setOn`; others are no-op stubs filled in Task 9. Drum voice: sine at 110 Hz (L) / 165 Hz (H), pitch bend −15% over 120 ms, gain envelope 4 ms attack / 300 ms exp decay, plus 30 ms band-passed noise transient (1.2 kHz, Q 2) for the wood knock; master gain 0.25.
- `DrumSection` props: `{ initialMode: 'normal' | 'stage' }`; reads `?mode=` client-side (`drum` → scroll to `#drum`, `stage` → `revealAll`). Exposes `onDecoded?: (d) => void` hook point consumed by Task 7 (telegraph) and Task 8 (3D): implement as a tiny event bus `web/src/lib/drum-bus.ts` with `emitHit(tone)`, `emitDecoded(d)`, `onHit(cb) → unsubscribe`, `onDecoded(cb) → unsubscribe`, `emitDelivered(info: { messageId: string; count: number })`, `onDelivered(cb)`.
- UI (spec §7): two `<button>` pads `aria-label="Low drum"` / `"High drum"` ≥ 64×64 px on mobile; visual feedback via a CSS class set on `pointerdown` (same frame); keys `F`/`J` handled by a `keydown` listener on the section element only (ignore when `e.target` is an input/textarea or has modifiers); notation row; progress `N / 8 messages decoded`; stamped `MessageCard` (index, notation, message, punchline + link `/how-it-works/` on the first card ever shown, slot for the delivery line); `aria-live="polite"` region announcing each message; "Read the messages" button toggling `MessageList` (decoded messages as text); "Enter Stage Mode" button when unlocked; Stage Mode = `data-stage="on"` on `<html>` switching tokens to a warm stage palette + all 8 messages viewable; exit via "✕ Back to the quiet site", `Esc` inside the section, or any nav link click; `SoundPill` fixed bottom-right (`aria-pressed`, label "Sound on/off"), mirrored in footer; "Sound not supported" note when `!audio.isSupported()`; framing line `CULTURAL_FRAMING`.

- [ ] **Step 1: Write failing unit tests `drum-engine.test.ts`**

```ts
const play = (s, tones: string, t0 = 0) => { let r; [...tones].forEach((c, i) => { r = hit(r?.state ?? s, c as Tone, t0 + i * 200); }); return r; };
test('4 hits decode message 0 then 1, in order', () => {
  const a = play(initialState(), 'LHLH'); expect(a.decoded).toMatchObject({ index: 0, phrase: 'LHLH', secret: false, replay: false });
  const b = play(a.state, 'HHHH', 2000); expect(b.decoded!.index).toBe(1);
});
test('partial phrase resets after 2 s idle', () => {
  let r = hit(initialState(), 'L', 0); r = hit(r.state, 'L', 100);
  r = hit(r.state, 'H', 2201); expect(r.state.phrase).toEqual(['H']);
});
test('secret phrase LLHL unlocks and enters stage', () => {
  const r = play(initialState(), 'LLHL'); expect(r.decoded!.secret).toBe(true); expect(r.state.stage).toBe(true);
});
test('stage unlocks after 3 decodes', () => {
  let s = initialState(); for (let i = 0; i < 3; i++) s = play(s, 'HLHH', i * 3000).state;
  expect(s.stageUnlocked).toBe(true); expect(s.stage).toBe(false);
});
test('after 8 decodes the next phrase replays message 0', () => {
  let s = initialState(); for (let i = 0; i < 8; i++) s = play(s, 'HHLH', i * 3000).state;
  const r = play(s, 'HHLH', 99999); expect(r.decoded).toMatchObject({ index: 0, replay: true }); expect(r.state.decoded).toHaveLength(8);
});
test('revealAll shows everything in stage', () => { const s = revealAll(initialState()); expect(s.decoded).toHaveLength(8); expect(s.stage).toBe(true); });
test('toNotation', () => expect(toNotation('LLHL')).toBe('●●○●'));
```
`storage.test.ts`: `storage helpers swallow exceptions` — stub `globalThis.localStorage` whose methods throw; `loadDecoded()` → `[]`, `saveDecoded([1])` doesn't throw, `loadSound()` → `false`; invalid JSON in `td.decoded` → `[]`.
- [ ] **Step 2: `npm test`** → FAIL.
- [ ] **Step 3: Implement `drum-engine.ts`, `storage.ts`, `drum-bus.ts`.** → `npm test` PASS.
- [ ] **Step 4: Write failing e2e `drum.spec.ts`**

```ts
test('first message within one phrase, keyboard + pointer', async ({ page }) => {
  await page.goto('/#drum');
  const low = page.getByRole('button', { name: 'Low drum' }), high = page.getByRole('button', { name: 'High drum' });
  await low.click(); await high.click(); await low.click(); await high.click();
  await expect(page.getByText('1 / 8 messages decoded')).toBeVisible();
  await expect(page.getByText('Before SNS, there was the drum.', { exact: false }).first()).toBeVisible();
});
test('pad hit counts once per pointer tap and once per key press', async ({ page }) => {
  await page.goto('/#drum'); await page.getByRole('button', { name: 'Low drum' }).focus();
  await page.keyboard.press('Enter'); await page.keyboard.press('f');
  await expect(page.getByTestId('notation')).toHaveText('●●');
});
test('F/J ignored outside the drum section', async ({ page }) => {
  await page.goto('/'); await page.keyboard.press('f'); await page.goto('/#drum');
  await expect(page.getByTestId('notation')).toHaveText('');
});
test('?mode=stage shows all 8 and exits with Esc', async ({ page }) => {
  await page.goto('/?mode=stage'); await expect(page.locator('html')).toHaveAttribute('data-stage', 'on');
  await page.getByRole('button', { name: 'Read the messages' }).click();
  await expect(page.getByTestId('message-list').locator('li')).toHaveCount(8);
  await page.getByRole('button', { name: 'Low drum' }).focus(); await page.keyboard.press('Escape');
  await expect(page.locator('html')).not.toHaveAttribute('data-stage', 'on');
});
```
- [ ] **Step 5: Implement `audio.ts` (drum, chime, setOn), `SoundPill`, drum components.** Prevent double counting: handle hits on `pointerdown` (record `pointerType`), and on `click` only when `event.detail === 0` (keyboard activation); the section `keydown` for F/J calls the same `onHit`. Persist `decoded` and sound with `storage.ts`.
- [ ] **Step 6: `npm run build && npm run e2e`** → PASS. Manually: tap on a phone-sized viewport, sound on, check the tone is soft and has no click.
- [ ] **Step 7: Commit** `feat(drum): talking drum core — engine, pads, messages, stage mode, sound`.

### Task 4: How-it-works page, 404, SEO files, Amplify app, first deploy

**Files:**
- Create: `web/src/app/how-it-works/page.tsx`, `web/src/app/not-found.tsx`, `web/public/sitemap.xml`, `web/public/og.png` (1200×630: emblem + name + tagline, rendered via a Playwright screenshot of a hidden `/og` route or drawn with sharp from SVG; then delete the route), `web/e2e/pages.spec.ts`, `README.md` (replace)
- Modify: `web/src/app/layout.tsx` (canonical/OG URL)

**Interfaces:**
- Produces the live URL `https://main.<appId>.amplifyapp.com` — record it in `docs/submission/urls.md` (create) as `SITE_URL=…` and `AMPLIFY_APP_ID=…`; Tasks 6, 7, 10, 11 read it from there.
- `/how-it-works/` (static, same visual language): inline SVG architecture diagram (Visitor → Amplify Hosting (CloudFront) → static site; browser → API Gateway HTTP API → Lambda → DynamoDB + SNS → {Email, SQS village-archive}; Synthetics canary → CloudWatch alarm → SNS ops-alerts; Budgets; GitHub → Amplify CI/CD), services table (service · purpose · est. monthly cost: Amplify Hosting ~$0, API Gateway ~$0, Lambda ~$0 free tier, DynamoDB ~$0, SNS ~$0, SQS ~$0, Synthetics hourly ~$0.74, Budgets $0), security headers list, monitoring, links to repo `web/` and `infra/`. Phase-1 version marks the API path "deploying in Phase 2" only in a code comment — the page copy describes the final architecture, which is live by 15:00, before submission.
- 404: "This page missed the beat" + link home. (Static `not-found.tsx`; Amplify rewrite serves it.)

- [ ] **Step 1: Failing e2e `pages.spec.ts`**: `/how-it-works/` has `h1` containing `How this site is built` and an `svg[role="img"]` with `aria-label`; a table lists `AWS Amplify Hosting`, `Amazon API Gateway`, `AWS Lambda`, `Amazon DynamoDB`, `Amazon SNS`, `Amazon SQS`, `Amazon CloudWatch Synthetics`, `AWS Budgets`; `/nope/` shows `missed the beat`; footer link `How this site is built` resolves 200.
- [ ] **Step 2: Implement; `npm run build && npm run e2e`** → PASS. Commit `feat(web): how-it-works, 404, SEO`.
- [ ] **Step 3: README.md** — what it is, live URL placeholder, architecture image (same SVG exported to `docs/architecture.svg`), stack, AWS services, local run (`cd web && npm ci && npm run dev`; `cd infra && npm ci && npx cdk deploy`), accessibility statement, credits (fonts, libraries; "design inspired by structure/pacing of award-winning portfolios; all assets original"), MIT license (`LICENSE`), coding-agent disclosure. Commit.
- [ ] **Step 4: Push** `git push origin main`.
- [ ] **Step 5: Create the Amplify app (agent-run, owner-approved):**

```bash
TOKEN=$(gh auth token)
aws amplify create-app --region us-east-1 --name talking-drum-portfolio --platform WEB \
  --repository https://github.com/Joshua4-0p/joshua.cloud-portfolio-website --access-token "$TOKEN" \
  --environment-variables AMPLIFY_MONOREPO_APP_ROOT=web \
  --custom-rules '[{"source":"/<*>","target":"/404.html","status":"404-200"}]'
aws amplify create-branch --region us-east-1 --app-id <appId> --branch-name main --enable-auto-build --stage PRODUCTION
aws amplify start-job --region us-east-1 --app-id <appId> --branch-name main --job-type RELEASE
```
Poll `aws amplify get-job … --query job.summary.status` until `SUCCEED` (≈ 3–6 min). On `FAILED`, read the build log URL from `get-job` steps, fix, push.
- [ ] **Step 6: Verify live.** `curl -sI $SITE_URL` → `200` with the custom headers (`strict-transport-security`, `content-security-policy`); `curl -s $SITE_URL | grep -c "The drum has a message for you"` → ≥1; run `npx playwright test` with `BASE_URL=$SITE_URL` (config reads `process.env.BASE_URL ?? 'http://localhost:4321'` and skips `webServer` when set) → PASS. Update canonical/OG URLs in `layout.tsx`, `sitemap.xml`, README with `SITE_URL`; commit; push.
- [ ] **Step 7: Phase 1 review gate** (reviewer agent): spec §6–7 compliance, Global Constraints, PII grep, Review Focus items 1, 3, 4 tested. Only then Phase 2.

---

## Phase 2 — Cloud (target 15:00)

### Task 5: Drum Telegraph backend (CDK + Lambda)

**Files:**
- Create: `infra/` (`npx cdk init app --language typescript`), `infra/lib/talking-drum-stack.ts`, `infra/lambda/drum.ts`, `infra/lambda/drum.test.ts`, `infra/test/stack.test.ts`
- Modify: `infra/bin/app.ts` (env `{ region: 'us-east-1' }`, account from CLI default)

**Interfaces:**
- `drum.ts`: `export const handler = makeHandler({ ddb, sns, tableName: process.env.TABLE_NAME!, topicArn: process.env.TOPIC_ARN! })`; `export function makeHandler(deps: { ddb: DynamoDBDocumentClient; sns: SNSClient; tableName: string; topicArn: string }): (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResultV2>`.
  - `GET /drum` → `GetCommand` on `{pk:'drums'}` → `{count}` (0 if missing).
  - `POST /drum` → reject with 400 `{"error":"invalid phrase"}` if body > 200 bytes, not JSON, or `phrase` not matching `^[LH]{4}$`; else `UpdateCommand ADD #c :one` `ReturnValues: 'UPDATED_NEW'`, then `PublishCommand` with `Subject: 'Someone just drummed at you'`, `Message: 'Someone just drummed at you: ' + notation + ' (rhythm #' + count + ')'`, `MessageAttributes: { phrase: { DataType: 'String', StringValue: phrase } }` → 200 `{count, messageId}`.
  - Any other route/method → 404. All responses `content-type: application/json`. Errors → 500 `{"error":"internal"}` (logged with `console.error`, no stack to client).
- Stack resources (spec §10): `Table` (pk string, PAY_PER_REQUEST, RETAIN), `Topic drum-telegraph`, `EmailSubscription(josuefotseu02@gmail.com)`, `Queue village-archive` (SQS-managed SSE, 4-day retention) + `SqsSubscription(rawMessageDelivery: true)`, `NodejsFunction` (Node 22, ARM_64, 128 MB, 3 s, `logRetention` or `logGroup` 14 days, env TABLE_NAME/TOPIC_ARN), `table.grantReadWriteData(fn)`, `topic.grantPublish(fn)`, `HttpApi` with CORS `allowOrigins: [SITE_URL, 'http://localhost:3000', 'http://localhost:4321']`, `allowMethods: GET, POST`, `allowHeaders: ['content-type']`; routes `GET /drum`, `POST /drum`; default stage throttling `rateLimit: 2, burstLimit: 10` (via `CfnStage` override if L2 lacks it). `CfnOutput ApiUrl`. Pass `SITE_URL` via `-c siteUrl=…`.

- [ ] **Step 1: Failing tests `drum.test.ts`** (vitest + `aws-sdk-client-mock`):
  - `GET returns count 0 when item missing` → `{count:0}`.
  - `POST LLHL increments, publishes ●●○●, returns count and messageId` (mock Update → `Attributes:{count:7}`, Publish → `MessageId:'m-1'`) → 200 `{count:7,messageId:'m-1'}`; Publish called with Message containing `●●○●` and `#7`.
  - `rejects invalid bodies without side effects` for each of: `'not json'`, `'{}'`, `'{"phrase":"llhl"}'`, `'{"phrase":"LLHLL"}'`, `'{"phrase":"LXHL"}'`, a 10 000-char body → 400 and **zero** DynamoDB/SNS calls.
  - `unknown route → 404`; `SNS failure → 500 {"error":"internal"}`.
  `stack.test.ts` (aws-cdk-lib/assertions): one `AWS::SNS::Subscription` with `Protocol: email` and one with `Protocol: sqs`; Lambda `Architectures: ['arm64']`, `Runtime: nodejs22.x`, `Timeout: 3`; table `BillingMode: PAY_PER_REQUEST`; stage throttling 2/10.
- [ ] **Step 2: `npx vitest run` / `npm test` in `infra/`** → FAIL.
- [ ] **Step 3: Implement handler and stack.** → tests PASS; `npx cdk synth -c siteUrl=$SITE_URL` succeeds.
- [ ] **Step 4: Deploy.** `npx cdk bootstrap aws://<account>/us-east-1` (skip if already bootstrapped), `npx cdk deploy TalkingDrumStack -c siteUrl=$SITE_URL --require-approval never`. Record `API_URL` in `docs/submission/urls.md`. **Tell the owner to confirm the SNS subscription email now.**
- [ ] **Step 5: Live check.** `curl -s $API_URL/drum` → `{"count":0}`; `curl -s -XPOST $API_URL/drum -H 'content-type: application/json' -d '{"phrase":"LLHL"}'` → `{"count":1,"messageId":"…"}`; `curl -s -XPOST … -d '{"phrase":"xx"}'` → 400; `aws sqs receive-message --queue-url <url>` → body contains `●●○●`. Commit `feat(infra): drum telegraph API — Lambda, DynamoDB, SNS fan-out to email + SQS`.

### Task 6: Monitoring and cost guardrails

**Files:**
- Modify: `infra/lib/talking-drum-stack.ts`, `infra/test/stack.test.ts`
- Create: `infra/canary/index.js` (only if a custom script is needed; prefer inline heartbeat code)

**Interfaces:**
- Consumes: `SITE_URL`, the stack from Task 5.
- Produces: `Topic ops-alerts` (+ email subscription), `synthetics.Canary` (latest Node.js Puppeteer/Playwright runtime available in aws-cdk-lib, schedule `rate(1 hour)`, heartbeat: open `SITE_URL`, assert HTTP 200 and that the page contains `The drum has a message for you`, artifacts bucket lifecycle 7 days), CloudWatch alarm `SuccessPercent < 100` for 1 period → `ops-alerts`, alarm on Lambda `Errors >= 1` in 5 min → `ops-alerts`, `budgets.CfnBudget` monthly COST $5 with notifications at actual > $1 (20%) and > $5 (100%) and forecast > $5, subscriber email josuefotseu02@gmail.com.

- [ ] **Step 1: Failing `stack.test.ts` additions:** one `AWS::Synthetics::Canary` with `Schedule.Expression: 'rate(1 hour)'`; two `AWS::CloudWatch::Alarm`; one `AWS::Budgets::Budget` with `BudgetLimit.Amount: 5`.
- [ ] **Step 2: Implement; `npm test`** → PASS. **Step 3: `cdk deploy`**; owner confirms the second subscription email. **Step 4:** `aws synthetics get-canary-runs --name <name> --max-results 1` → `PASSED` within ~5 min of the first run (trigger with `aws synthetics start-canary` if needed). Commit `feat(infra): hourly canary, alarms, budgets`.

### Task 7: Wire the telegraph into the site

**Files:**
- Create: `web/src/lib/telegraph.ts`, `web/src/lib/telegraph.test.ts`, `web/e2e/telegraph.spec.ts`
- Modify: `web/src/components/drum/DrumSection.tsx`, `MessageCard.tsx`, `web/customHttp.yml` (`connect-src 'self' <API host>`), `web/src/app/how-it-works/page.tsx` (show live endpoint + counter)

**Interfaces:**
- `telegraph.ts`: `sendPhrase(phrase: string, opts?: { base?: string; timeoutMs?: number; fetchImpl?: typeof fetch }): Promise<{ count: number; messageId: string } | null>`; `getCount(opts?): Promise<number | null>`. `base` defaults to `process.env.NEXT_PUBLIC_DRUM_API` (no trailing slash); empty base → `null` without fetching. `AbortController` timeout 3000 ms. Any non-2xx, network error, abort, or malformed JSON → `null`. Never throws.
- DrumSection: on `onDecoded` → `sendPhrase(d.phrase)`; on success `emitDelivered` and the card shows `Delivered via Amazon SNS · msg <first 4 chars of messageId>… · rhythm #<count>` in `--signal`; counter line `N rhythms have crossed the cloud` from `getCount()` on mount (hidden when `null`), updated from each delivery.

- [ ] **Step 1: Failing `telegraph.test.ts`:** success parses `{count,messageId}`; `sendPhrase returns null on timeout/HTTP 500/network error` (fake fetch that never resolves with `timeoutMs: 50`; `Response(…,{status:500})`; rejecting fetch; `'not json'` body); empty base → `null` and fetch not called; posts JSON body `{"phrase":"LLHL"}` with `content-type: application/json`.
- [ ] **Step 2: `npm test`** → FAIL; implement; → PASS.
- [ ] **Step 3: Failing e2e `telegraph.spec.ts`:** with `page.route('**/drum', r => r.fulfill({ json: { count: 42, messageId: 'abcd1234' } }))` playing one phrase shows `Delivered via Amazon SNS` and `rhythm #42`; with `page.route('**/drum', r => r.abort())` playing one phrase shows the message card and **no** `Delivered via` text and no counter. Build with `NEXT_PUBLIC_DRUM_API=https://example.execute-api.us-east-1.amazonaws.com` for this test. → implement → PASS.
- [ ] **Step 4: Amplify env + deploy.** `aws amplify update-app --app-id <id> --environment-variables AMPLIFY_MONOREPO_APP_ROOT=web,NEXT_PUBLIC_DRUM_API=$API_URL`; set `connect-src` to the exact API host in `customHttp.yml`; commit `feat(drum): live drum telegraph delivery + counter`; push; wait for `SUCCEED`.
- [ ] **Step 5: Live end-to-end.** On `SITE_URL`, play a phrase in a real browser (Playwright, no route mocks) → card shows `Delivered via Amazon SNS`; browser console has no CSP violation; SQS has a new message.
- [ ] **Step 6: Phase 2 review gate** (reviewer agent): IAM least privilege, input validation, CORS, CSP, Review Focus 2 and 5, costs. Then Phase 3.

---

## Phase 3 — Wow layer (target 17:30)

### Task 8: 3D slit drum, stage, fan-out (lazy, with poster fallback)

**Files:**
- Create: `web/src/components/three/{DrumCanvas,SlitDrum,Stage,FanOut}.tsx`, `web/src/lib/three-gate.ts`, `web/src/lib/three-gate.test.ts`, `web/public/images/drum-poster.webp`
- Modify: `Hero.tsx`, `DrumSection.tsx`

**Interfaces:**
- `three-gate.ts`: `shouldRender3D(env: { webgl: boolean; reducedMotion: boolean; deviceMemory?: number; cores?: number; saveData?: boolean }): boolean` → false if `!webgl || reducedMotion || saveData || (deviceMemory ?? 8) < 4 || (cores ?? 8) < 4`. `detect3DEnv(): Parameters<typeof shouldRender3D>[0]` (browser-only).
- `DrumCanvas` props `{ variant: 'hero' | 'stage'; className?: string }`, loaded with `next/dynamic(() => import(...), { ssr: false })` only when `shouldRender3D(detect3DEnv())` and after `requestIdleCallback` (fallback `setTimeout 800`); otherwise render `<img src="/images/drum-poster.webp" alt="A carved two-tone slit drum under warm stage lights">` (also the SSR/no-JS markup, so CLS is 0 — fixed aspect ratio box).
- `SlitDrum`: procedural carved log (lathe/cylinder with slight taper), slit with two lips (low lip larger), two beaters, copper/wood `MeshStandardMaterial` (no external textures); subscribes to `onHit` → the matching lip glows (`emissive` copper-hi) and the drum dips 2–3 % scale with a damped spring; clicking a lip in 3D calls the same `onHit` path as the pads (pointer only; pads remain the accessible control).
- `Stage`: dark reflective floor (`MeshReflectorMaterial` from drei, low resolution 512), two warm spotlights, soft fog; Stage Mode (`data-stage="on"`) dims ambient and warms lights.
- `FanOut` (stage variant only): on `onDelivered`, a glowing packet travels from the drum along a curve to the topic node, then splits to exactly two labelled nodes `Josue's inbox (email)` and `Village archive (SQS)` (labels via drei `Html`, mono font). On `onDecoded` without delivery, no packet.
- Hero variant: same drum smaller, slow idle rotation (±8°), label `Play me below ↓` linking `#drum`; one hit plays a note and ripples (teaser only, doesn't count toward phrases).
- Perf: `dpr={[1, 1.5]}`, `frameloop="demand"` with `invalidate()` on hits/animation, pause when off-screen (IntersectionObserver), `gl={{ antialias: true, powerPreference: 'high-performance' }}`.

- [ ] **Step 1: Failing `three-gate.test.ts`**: false for no WebGL, reduced motion, saveData, deviceMemory 2, cores 2; true for `{webgl:true,reducedMotion:false,deviceMemory:8,cores:8}` and when memory/cores undefined.
- [ ] **Step 2: Implement gate → PASS. Build scene components.** Look at `docs/design-references/04-jesse-zhou/scene-*.jpg` for lighting/mood (single object, dark stage, reflections) — do not copy its objects.
- [ ] **Step 3: Poster.** With the scene running locally, capture a 1600×1000 Playwright screenshot of the stage variant, save as `public/images/drum-poster.webp` (≤ 120 KB).
- [ ] **Step 4: Verify.** `npm run build`; check bundle: initial JS for `/` (from `.next` build output) excludes three; the lazy chunk ≤ 350 KB gz. Playwright: with `reducedMotion: 'reduce'` the poster `img` is present and no `canvas`; default context shows a `canvas` within 5 s; existing e2e suite still PASS.
- [ ] **Step 5: Commit** `feat(3d): procedural slit drum, stage, SNS fan-out, poster fallback`.

### Task 9: Sound design and motion polish

**Files:**
- Modify: `web/src/lib/audio.ts`, `web/src/lib/motion.ts`, `Nav.tsx`, `MagneticButton.tsx`, `Hero.tsx`, `DrumSection.tsx`, section components (add `data-reveal`)
- Create: `web/src/lib/audio.test.ts`

**Interfaces:**
- `audio.ts` fills the stubs (spec §8): `hover()` = 2 ms-attack 2.4 kHz sine tick, gain 0.04, throttled to one per 80 ms; `click()` = soft low tap (180 Hz, 120 ms); `swell()` = 400 ms band-passed noise (centre 800→2400 Hz sweep, gain peak 0.08) — the "running water" nav sound, fired on nav-link activation and on entering a new section via ScrollTrigger (throttled to one per 1.5 s); `chime()` = two wood notes (660 Hz then 880 Hz, 90 ms apart); `startClave()` = son-clave 3-2 at 90 BPM (woodblock 1 kHz + low drum on beat 1), `stopClave()`. All no-ops when `!isOn()`; every voice routed through master gain 0.25.
- Export `CLAVE_3_2: readonly number[]` = sixteenth-note step indices `[0, 3, 6, 10, 12]` over a 16-step bar.
- `motion.ts` completes: SplitText line reveals on `[data-reveal]`, hero marquee speed scaled by Lenis velocity (clamped 1×–4×), nav collapse on scroll, section-enter `swell()` hook. All skipped under reduced motion.
- Stage Mode enter → `startClave()` if sound on; exit → `stopClave()`.

- [ ] **Step 1: Failing `audio.test.ts`**: `CLAVE_3_2` equals `[0,3,6,10,12]`; with `AudioContext` undefined `isSupported()` is false and every method is a silent no-op (no throw); `hover()` called twice within 80 ms schedules one voice (spy on an injected fake context via `__setContextForTest`).
- [ ] **Step 2: Implement → PASS.** Wire hover/click sounds to nav links, buttons, project rows (`pointerenter` / `click`), swell to nav + section enter.
- [ ] **Step 3: Verify by ear and eye** at 1440×900 and 390×844: soft, no clipping, nothing plays before the first gesture (Playwright: load page, listen for `AudioContext` construction via `addInitScript` spy → none until a click). Reduced-motion run of the whole e2e suite → PASS.
- [ ] **Step 4: Commit** `feat(experience): sound design, reveals, marquee, stage clave`; push; wait for Amplify `SUCCEED`; smoke the live URL.
- [ ] **Step 5: Phase 3 review gate** (reviewer agent): spec §5–9, budgets, reduced motion, no gates, one-creative-feature rule, no copied reference assets.

---

## Phase 4 — Ship (QA by 18:00 freeze, submit by 22:00)

### Task 10: QA sweep and freeze

**Files:**
- Create: `web/e2e/a11y.spec.ts`, `web/e2e/links.spec.ts`, `web/scripts/lighthouse.mjs` (optional wrapper)
- Modify: whatever the sweep finds

- [ ] **Step 1: Failing/new tests.** `a11y.spec.ts`: `@axe-core/playwright` on `/`, `/how-it-works/`, `/?mode=stage` → zero `critical` and `serious` violations. `links.spec.ts`: collect every `a[href^="http"]` on `/` and `/how-it-works/`; `request.get` each (skip `linkedin.com` and `mailto:` — LinkedIn blocks bots; check it manually) → status < 400. Add e2e `drum works with API blocked` (no mocks, `page.route(API_URL + '/**', r => r.abort())`, against `SITE_URL`).
- [ ] **Step 2: Run against `SITE_URL`** (`BASE_URL=$SITE_URL npm run e2e`) → fix until PASS.
- [ ] **Step 3: Lighthouse mobile** (`npx lighthouse $SITE_URL --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=docs/submission/lighthouse.json --chrome-flags="--headless"`) → perf ≥ 90, others ≥ 95. If perf < 90: delay the 3D chunk until first interaction or scroll, lower reflector resolution, re-run.
- [ ] **Step 4: Manual checks** (record pass/fail in `docs/submission/qa.md`): securityheaders.com grade; `npm run pii` (with `web/.pii-local.txt` present locally) on `src/` and `out/` → exit 0, and `git grep -nEf web/.pii-local.txt` → nothing; LinkedIn link opens in a browser; real phone (owner): **10-second test with 3 people** (AC10) — time to first decoded message ≤ 10 s, no instructions.
- [ ] **Step 5: Commit, push, verify `SUCCEED`, tag `v1.0-submission`, push tag. FREEZE: from here `main` takes fixes only.**

### Task 11: Submission assets and write-up

**Files:**
- Create: `web/e2e/capture.spec.ts` (screenshots + video, run on demand), `docs/submission/project-post.md`, `docs/submission/screenshots/*.png`, `docs/submission/demo.gif`
- Modify: `README.md` (final URLs, screenshot, Lighthouse scores)

**Interfaces:**
- Consumes: `SITE_URL`, `API_URL`, `AMPLIFY_APP_ID`, Lighthouse JSON, QA results.

- [ ] **Step 1: Portfolio screenshots** via `capture.spec.ts` against `SITE_URL` (sound off, after fonts load), numbered: `01-hero-desktop`, `02-about`, `03-superpowers`, `04-work-list`, `05-work-case-study`, `06-recognition-community`, `07-drum-section`, `08-message-delivered` (after one phrase, shows `Delivered via Amazon SNS`), `09-stage-mode` (`?mode=stage`), `10-mobile-hero` (390×844), `11-mobile-drum`, `12-how-it-works`. ≥ 6 required; all 12 targeted.
- [ ] **Step 2: Demo GIF** ≤ 15 s, ≤ 5 MB: Playwright `recordVideo` (1280×720) of hero → hint click → 4 pad hits → delivered card → Stage Mode; convert with `npx ffmpeg-static`-provided binary (`node -e "console.log(require('ffmpeg-static'))"` for the path): `ffmpeg -i in.webm -vf "fps=12,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" docs/submission/demo.gif`. Also keep `demo.mp4` (H.264) if the GIF exceeds 5 MB.
- [ ] **Step 3: AWS evidence (owner action — needs console login; list the exact shots and redaction rule in the post draft):** Amplify app overview + deploy history + custom headers; API Gateway routes + throttling; Lambda function overview; DynamoDB table item `drums`; SNS topic with 2 subscriptions (email + SQS); SQS message received; CloudWatch Synthetics canary passing; Budgets. Redact account ID, emails, ARNs. Agent adds CLI-derived evidence meanwhile: `aws amplify get-app`, `aws cloudformation describe-stack-resources --stack-name TalkingDrumStack` summarised as a table in the post.
- [ ] **Step 4: Write `docs/submission/project-post.md`** following PRD §7 exactly: title `🥁 Josue.cloud — Before SNS, there was the drum`; live/repo/`/#drum`/`?mode=stage` links; **Submission checklist** table (D1–D6 → evidence); headings exactly `Creativity and memorability`, `Working AWS implementation`, `Communication quality`, `What I learned`, `Challenges I hit`, `Portfolio completeness and usability`; services table with exact AWS names, purpose and monthly cost; architecture diagram; every image with a text caption; originality statement (repo created 6 Nov 2026 06:24 UTC, first Amplify deploy time from `get-job`); coding-agent disclosure (plan → agents → review → deploy; one honest thing the agent got wrong and how it was fixed — take from the phase review notes); Lighthouse scores; `#student-builders`. Content facts only from plan.md.
- [ ] **Step 5: LLM dry run.** Give a fresh subagent only the post text + the rubric + the six deliverables; it must cite evidence for every criterion and deliverable. Fix gaps.
- [ ] **Step 6: Final README update, commit, push** (docs-only change; verify Amplify `SUCCEED` and site unchanged).
- [ ] **Step 7: Hand-off to owner (by 21:00):** paste-ready post, screenshot folder, GIF, AWS screenshot checklist. Owner publishes under "Your project" with `#student-builders` by **22:00 WAT**, confirms student verification, and keeps the site untouched (fixes only) through 23 Nov.
- [ ] **Step 8: Whole-branch review** (final reviewer agent) against the spec and the PRD §10 checklist.
