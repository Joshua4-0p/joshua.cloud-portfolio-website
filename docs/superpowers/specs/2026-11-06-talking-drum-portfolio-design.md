# The Talking Drum Portfolio — Design

Date: 6 Nov 2026 · Owner: Tiaya Fotseu Josue · Status: **approved 6 Nov 2026 ~09:20 WAT** (all §14 calls accepted; §15 answered)
Supersedes PRD v1.1 (`docs/03-Product-Requirements-Document.md`) where they conflict. Every PRD acceptance criterion for F20 (AC-H1, AC1–AC12) still applies unless changed below.
Content source of truth: `/plan.md`. Rules source: hackathon Rules tab (summary in §11).

---

## 1. Intent

Win the AWS Student Builder Challenge (5 winners of ~1,433; top 50 pass Gate 1). The owner wants an **Awwwards-grade, 3D, sound-rich portfolio**, not a safe minimal one. The site has one identity: **Josue is a Cameroonian drummer who builds cloud messaging systems — "Before SNS, there was the drum."** Every visual, motion and sound decision serves that one idea, so judges see *one* creative feature (The Talking Drum) expressed everywhere, not a pile of effects.

Who it serves, in order: Gate-1 AI + human scorers (must find every rubric item in text), AWS judges at Gate 2 (3–5 min, want to smile and see real AWS), recruiters (60 s: name, role, projects, contact).

## 2. Goals, non-goals, anti-goals

**Goals**
1. A recruiter sees name, role, projects and contact in 10 s, with or without JS.
2. A judge plays the drum and gets a personal message within 10 s on a phone; the message visibly travels through real AWS (API Gateway → Lambda → DynamoDB + SNS).
3. The site looks and feels like a 2025–26 Awwwards Site of the Day: 3D hero, smooth motion, big type, tactile sound.
4. All 6 deliverables and the 4 rubric criteria are evidenced (PRD §4.6 traceability still holds).

**Non-goals (today)**: FR translation, contact form, blog engine, CMS, visitor analytics, AI chatbot, custom domain, CI pipeline for infra.

**Anti-goals (failure even if it "works")**
- Any gate before content: no "START" / "enter with sound" screen, no loader that blocks reading. (Rules: the feature must not impair navigation.)
- A copy of any reference site's text, assets, logo or signature effect. References are for structure, pacing and feel only. (Rules: original, non-infringing.)
- Shipping the mood-board drum images or any image we don't own.
- A second "creative feature" (theme switcher, terminal, game, chatbot).
- Any invented fact. Any PII from the "never publish" list.
- Missing the deadline. Hard deadline **Sat 7 Nov 08:59 WAT**. Feature freeze **18:00 WAT Fri 6 Nov**; submit by **22:00 WAT**.

## 3. Constraints

- **Hosting:** AWS Amplify Hosting, Git-connected (Rules require the Amplify path). Static site only (`output: 'export'`, platform `WEB`, not `WEB_COMPUTE`).
- **Backend:** AWS CDK v2 (TypeScript), default AWS CLI profile, **us-east-1**. Separate from Amplify (no Amplify Gen 2 backend), so PR previews keep working.
- **Toolchain present:** Node 24, AWS CLI 2, CDK CLI 2.1136, git, gh (authenticated as owner — verify).
- **Budget:** < $1/month expected; Budgets alerts at $1 and $5.
- **Accessibility:** WCAG 2.2 AA intent; full keyboard path; `prefers-reduced-motion` honoured; sound never before a user gesture.
- **Machine legibility:** every section's text is in the exported HTML (no JS needed to read it).
- **Network:** Cameroon 3G — content must render fast even if 3D never loads.

## 4. Stack (decided)

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router), TypeScript, `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true` |
| Styling | Tailwind CSS v4 + CSS variables for tokens |
| 3D | `three`, `@react-three/fiber`, `@react-three/drei` (only what's used). Procedural geometry — **no downloaded models** |
| Motion | GSAP (core, ScrollTrigger, SplitText — all free since 3.13) via `@gsap/react`; Lenis smooth scroll |
| Sound | Web Audio API, fully synthesised. **No audio files** |
| Fonts | `next/font/google`, self-hosted at build: **Anton** (display, condensed), **Inter Tight** (body), **JetBrains Mono** (labels, nav, notation) |
| Icons | inline SVG |
| Infra | AWS CDK v2 TS in `infra/`: HTTP API, Lambda (Node.js 22, arm64), DynamoDB, SNS, CloudWatch Synthetics, CloudWatch alarms, Budgets |
| QA | Playwright (smoke + screenshots), Lighthouse, axe (`@axe-core/playwright`), lychee or a small link-check script |

Repo: the owner's existing repo **`Joshua4-0p/joshua.cloud-portfolio-website`** (created 6 Nov 2026 06:24 UTC — originality evidence; currently private, made **public** before the first Amplify deploy, owner-approved). Repo root = `D:\AWS-Student-Builder-Challenge`. Layout:
```
web/        Next.js app (Amplify appRoot)
infra/      CDK app
docs/       planning docs, specs, design-references (screenshots), write-up
plan.md     content source of truth
amplify.yml monorepo build spec (appRoot: web, baseDirectory: out)
```
`.gitignore` (already applied): `node_modules/`, `assets/` (raw photos), **`docs/design-references/`** (third-party screenshots + mood board — local only, must never be pushed), `presentation/build/`, Office lock files `~$*`, `.next/`, `out/`, `cdk.out/`, `.env*`, `.playwright-mcp/`. Publishing `docs/` planning files and the strategy `.pptx` is fine (shows process). Optimised photos the site uses are exported into `web/public/images/` and committed.

## 5. Visual identity

- **Palette (tokens):** `--ink #0B0B0C` (base dark), `--bone #F2EDE4` (base light), `--copper #C8743C` (accent: drum wood, links, focus), `--copper-hi #E8A06A`, `--ash #8A8580` (muted text, ≥4.5:1 on ink checked), `--signal #4FD1C5` (only for "delivered via AWS" states — the cloud colour). Dark sections dominate; one or two bone sections for rhythm (like Snellenberg's grey hero → white body).
- **Type:** Anton for giant titles and the marquee (uppercase, tight tracking). Inter Tight for body. JetBrains Mono for nav in brackets (`[ ABOUT ]`), indices (`00-1`), notation (● ○) and small labels.
- **Emblem / logo:** original SVG — a fist holding two drumsticks inside a ring with a geometric pattern band (inspired by mood board #4/#5; redrawn from scratch, simpler line art, copper on ink). Used as nav logo, favicon, OG image element.
- **Imagery:** owner's own photos only (`plan.md` → Photos). Treated consistently: slight warm grade, black-and-white with copper duotone on hover for community photos.
- **Project covers:** generated typographic covers (project name in Anton, stack chips, a simple glyph) — consistent and ours. AfriPay may use a real screenshot captured with Playwright. Owner may supply real screenshots later.

## 6. Page structure and reference mapping

Single page `/` + `/how-it-works/` + custom 404. Reference screenshots live in `docs/design-references/<site>/` (desktop and mobile). The builder must open the matching screenshots before building each section.

| # | Section (id) | Reference | What to take | What to change / never copy |
|---|---|---|---|---|
| 0 | Nav | Olha (09) + Snellenberg (02) | Mono bracket links `[ ABOUT ] [ SUPERPOWERS ] [ WORK ] [ DRUM ] [ CONTACT ]`; after scrolling, collapses into a round magnetic menu button (02) | Logo = our emblem + "JOSUE". Skip link first. Mobile: round button opens full-screen menu |
| 1 | Hero `#hero` | Snellenberg (02) structure + Jesse Zhou (04) 3D diorama | 02: giant marquee name running behind the subject, location-style pill at left, role text at right. 04: one stylised 3D object on a dark reflective floor with spotlights | Subject is the **3D slit drum**, not a portrait. Marquee text: `TIAYA FOTSEU JOSUE —`. The left pill is the **drum hint**: "The drum has a message for you — tap it" (real `<a href="#drum">`, emblem icon, pulse ring every 8 s). Right: titles from plan.md. No START gate; a ≤1.2 s non-blocking intro (SplitText reveal) |
| 2 | About `#about` | Snellenberg (02) | Large statement paragraph left, small paragraph right, round magnetic "More about me" → `#superpowers`; portrait with slow parallax | Portrait = `headshot-blue-suit`. Story ≤120 words: Bafoussam → Dschang → Buea → cloud, bilingual, drums |
| 3 | Superpowers `#superpowers` | Olha (09) services | Giant "SUPERPOWERS" title, row of numbered columns `00-1…00-5` with condensed titles and vertical rules | Columns: Cloud & Serverless · Security & Resilience · DevOps & Monitoring · Full-Stack · People. Each lists skills + **proof chips** linking to the project/cert/talk. Mobile: stacked rows with rules. No % bars |
| 4 | Work `#work` | Snellenberg (02) list + Lusion (10) grid + Pacôme (08) toggle | Toggle `list • grid`. **List:** big project names in rows with rules; a cover preview follows the cursor with a round "View" button (02). **Grid:** 2-column rounded cards with tags row under each (10). | Default: list on ≥1024 px, grid below (hover doesn't exist on touch). Each item opens an inline case-study panel (problem · my role · stack · decisions · outcome · links). "Learning project" badge where applicable. Every link must return 200 |
| 5 | Recognition `#achievements` | Olha (09) awards list | Rows: icon · name · small superscript count/date · ↗ arrow, ruled | Achievements & certs from plan.md (Credly links). Then **Community & Speaking**: photo strip (ODC talks, Community Day, flyer) + roles timeline + dev.to link |
| 6 | The Talking Drum `#drum` | Jesse Zhou (04) diorama + Pacôme (08) sound UI | Full-viewport dark stage, the same slit drum large and centred under warm spotlights, reflective floor | See §7. HTML pads always present on top of the canvas |
| 7 | Contact `#contact` + footer | Snellenberg (02) footer | Huge "LET'S BUILD" title with portrait chip, round magnetic "Get in touch" button, pill buttons for email / LinkedIn / GitHub / dev.to, **local time in Buea** | Footer: repo link, "How this site is built", last-updated date (manual), sound toggle mirror, "© 2026 Tiaya Fotseu Josue" |
| 8 | `/how-it-works/` | — | Static SVG architecture diagram, services table (service → purpose → cost), headers, monitoring, link to repo and `infra/` | Same visual language |

Motion rules (all sections): GSAP reveals on enter (SplitText lines up, 0.8 s, `power3.out`); marquee speed reacts to scroll velocity; magnetic buttons on pointer devices only; Lenis smooth scroll with native scroll position (no hijacking, anchors work). Everything off or instant under `prefers-reduced-motion`.

## 7. The Talking Drum (the one creative feature)

**Instrument:** a procedural **two-tone slit drum** (carved log, a slit with two lips — a low lip and a high lip — and two beaters), copper/wood material, on a dark reflective stage. Framing text: "inspired by the talking-drum and slit-drum traditions of Cameroon and West & Central Africa". The two lips map exactly to the two pads.

**Flow (PRD §3.3 stands; changes in bold):**
1. Hero hint → `#drum`. Hero drum is also tappable: plays a note and ripples (a teaser), and its label says "Play me below ↓".
2. `#drum`: two big HTML `<button>` pads (Low = `F`, High = `J`, keys only while focus is in the section), sound toggle, notation row (● ○), progress "3 / 8 messages decoded", "Read the messages" text list (screen-reader alternative), live counter **"N rhythms have crossed the cloud"** (from `GET /drum`; hidden if the API fails).
3. Each hit: pad + 3D lip light up within one frame (CSS class on `pointerdown`, 3D follows), synthesised slit-drum tone, short ripple on the floor.
4. 4 hits → next undecoded message (plan.md order) appears as a stamped card. Card 1 carries the punchline linking to `/how-it-works/`.
5. **Drum Telegraph (now R1):** on each completed phrase the client `POST`s `{phrase:"LLHL"}` to the API (fire-and-forget, 3 s timeout). The card shows **"Delivered via Amazon SNS · msg 3f2a… · rhythm #148"** (`--signal` colour) when it succeeds, nothing extra when it fails. In 3D, a glowing packet leaves the drum and fans out to **exactly two "village" nodes labelled with the real subscribers: "Josue's inbox (email)" and "Village archive (SQS)"** — a true SNS fan-out, nothing implied that doesn't exist. Static under reduced motion.
6. After 3 messages, or the secret phrase ● ● ○ ●: "Enter Stage Mode" → lights dim, spotlights warm, soft clave groove starts (if sound on), all 8 messages viewable. Exit: "✕ Back to the quiet site", `Esc` in section, or any nav link.
7. Deep links: `/#drum`, `?mode=drum`, `?mode=stage` (Stage Mode with all 8 messages, for judges and reproducible screenshots).
8. No-JS: the section shows a paragraph describing the feature and lists all 8 messages in a `<details>` element.

PRD AC1–AC12 apply, with AC7 changed: the drum's own JS (excluding three.js) ≤ 40 KB gz; the 3D chunk is lazy (see §9).

## 8. Sound design (synthesised, soft — "like running water")

- **Off by default.** Turned on by the sound toggle (fixed bottom-right pill, like Pacôme) or by the first drum hit. Choice remembered in `localStorage` (try/catch). One `AudioContext`, created on first gesture. Master gain ≈ 0.25; everything soft, rounded attacks, no clicks.
- **Palette:** slit-drum low (≈110 Hz) and high (≈165 Hz) tones with a short downward pitch bend and woody filtered noise transient; hover = very quiet high wood tick (throttled 80 ms); button click = soft low tap; **section navigation = a soft filtered-noise "water" swell (~400 ms, rain-stick-like)**; message decoded = gentle two-note wood chime; Stage Mode = quiet **son-clave (3-2) groove** at ~90 BPM on woodblock + low drum.
- Sound is never required to understand anything (iOS silent switch). "Sound not supported" note if Web Audio is missing.

## 9. Performance & resilience

- Two budgets: **critical path ≤ 200 KB gz** (HTML, CSS, fonts subset, non-3D JS) renders all content; **3D chunk** (three + r3f + scene) lazy-loaded with `next/dynamic` after first paint / idle, ≤ 350 KB gz.
- 3D fallback: a static poster image of the scene (pre-rendered PNG/WebP from the scene itself) when WebGL is unavailable, under reduced motion, on `navigator.deviceMemory < 4` or `hardwareConcurrency < 4`, or when Save-Data is on. Pads work identically on the poster.
- DPR capped at 1.5; canvas paused when off-screen (`frameloop="demand"` or IntersectionObserver).
- Targets: LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms (mobile). Lighthouse ≥ 90 performance (3D cost accepted, down from PRD's 95), ≥ 95 a11y / best practices / SEO.
- Every API call: timeout 3 s, failure invisible except the counter/delivery line disappearing.

## 10. Backend (CDK, us-east-1)

Stack `TalkingDrumStack`:
- **API Gateway HTTP API**: `GET /drum` → `{count}`; `POST /drum` body `{phrase}` validated `^[LH]{4}$` → `{count, messageId}`. Default stage throttling rate 2 rps, burst 10. CORS: Amplify domain + `http://localhost:3000`.
- **Lambda** (Node.js 22, arm64, 128 MB, 3 s, `NodejsFunction`/esbuild): DynamoDB `UpdateItem ADD count :1` (pk `drums`), `sns:Publish` "Someone just drummed at you: ●●○●". Returns `{count, messageId}`. Log retention 14 days. Least-privilege via `grant*`.
- **DynamoDB** on-demand table, pk `pk` (string), `RemovalPolicy.RETAIN`.
- **SNS** topic `drum-telegraph` with **two subscribers (real fan-out)**: email josuefotseu02@gmail.com (owner must confirm the subscription email) and an **SQS queue `village-archive`** (SSE-SQS, 4-day retention, raw message delivery). Queue policy allows only this topic.
- **Ops:** CloudWatch Synthetics canary (heartbeat, every 1 h) on the Amplify URL (CDK context `siteUrl`), alarm → SNS topic `ops-alerts` (same email); alarm on Lambda errors ≥ 1 in 5 min; AWS Budgets $1 and $5 monthly cost alerts to the email.
- Outputs: API URL → set as `NEXT_PUBLIC_DRUM_API` in Amplify env vars.
- Security headers in `web/customHttp.yml` (Amplify): HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, `frame-ancestors 'none'`, CSP with `script-src 'self' 'unsafe-inline'` (Next static export inline scripts), `connect-src 'self' <api-url>`.

## 11. Rules check (from the Rules tab, read 6 Nov)

- Pass/fail: live AWS-hosted URL through the judging window (7–23 Nov PT), GitHub link, three sections + one creative feature, completed project post with screenshots of portfolio **and AWS implementation**, learnings and challenges, AWS services documented. Verified student by end of submission period.
- Must deploy via the "Build a Website on the Cloud" path with **AWS Amplify Hosting**.
- Disqualification includes "submission after the published deadline" and IP infringement.
- **No rule about editing the site after the deadline.** Decision: after submission `main` takes fixes only (broken link, typo, outage) until winners are announced; the write-up is final at submission.
- Tie-break goes to Creativity and memorability.

## 12. Delivery shape (for the implementation plan)

Subagent-driven: one builder agent per phase (front end + back end for that phase), one separate reviewer agent per phase, a whole-branch review at the end. Each phase ends deployed and working.

Hard rule — **safety net first**: the first phase that touches the site must end with a live Amplify URL serving all core content (hero text, about, superpowers, work, achievements, contact, a working 2D drum with all 8 messages) in the final visual identity but without 3D. From that point the site is always submittable; later phases only add.

Time checkpoints (WAT): safety-net site live by ~13:00 · backend + telegraph by ~15:00 · 3D + sound by ~17:30 · **feature freeze 18:00** · screenshots, GIF, write-up 18:00–21:00 · **submit by 22:00**. If a phase overruns, the remaining unbuilt 3D/sound items are cut, never the submission.

Owner actions (cannot be done by agents), scheduled first because everything waits on them: approve making the repo public; **Amplify app creation — see §15 Q2**; confirm the two SNS subscription emails as soon as the infra phase deploys; run the 10-second phone test with 3 people (~17:00); submit the project post.

`gh` is authenticated as `Joshua4-0p`; AWS CLI default profile works (us-east-1).

## 13. Left to the builder

Exact copy wording within plan.md facts; component structure; animation timings; 3D materials and lighting details; cover-art layout; how the poster fallback is rendered; test approach within the QA list.

## 14. Calls made by Claude (owner to check)

1. 3D hero reference: **Jesse Zhou (#4)** over Bruno Simon (#1) — a single object diorama fits one drum and loads lighter; Bruno's drive-around world would turn the site into a game.
2. The instrument is a **slit drum**, not an hourglass talking drum: two lips = two tones = two pads, and it's a Central African form (framed regionally, no specific people named).
3. Pacôme's "enter with sound / without sound" screen is **not** copied (it's a gate); we use its bottom-right sound pill instead.
4. Fonts Anton / Inter Tight / JetBrains Mono; palette ink / bone / copper + signal teal for AWS states.
5. Use the owner's existing repo `joshua.cloud-portfolio-website`; app in `web/`, infra in `infra/`; raw `assets/` and `docs/design-references/` never committed; the stray Office lock file and `presentation/build/` were untracked.
6. Lighthouse performance target lowered from 95 to 90 to afford 3D; content budget kept at 200 KB.
7. DocuSmart card ships without a repo link (repo is private today).
8. `GET /drum` added so the live counter is visible before anyone plays.
9. The fan-out is real: SNS → email + SQS `village-archive`, and the 3D scene shows exactly those two subscribers.
10. Until the owner confirms them, the club is written "GDSC University of Buea" only if confirmed, otherwise the line reads "Google Developer student community, University of Buea — Education team"; the Builder Center link is omitted.

## 15. Owner answers (6 Nov)

1. Repo `Joshua4-0p/joshua.cloud-portfolio-website` is **already public**.
2. **The agent creates the Amplify app** (`aws amplify create-app` with the `gh` token as GitHub access token, `create-branch main`, env vars, `start-job`). No console step for the owner.
3. Club: **GDG on Campus University of Buea**. Also core team of the **AWS Student Builder Group, University of Buea** (Nov 2025 – Nov 2026). Builder Center: handle `@josuefotseu02` shown as text, no link. plan.md updated from his LinkedIn (AWS Certified Cloud Practitioner Oct 2026, Cloud Builders Africa, Educloud Academy, PyCon Cameroon, dev.to articles) — LinkedIn wins over the older CV where they differ.
4. No objections to §14.

Content additions this implies: Experience gets its own block inside About (or a compact timeline under Recognition) — DIGISOL (Software Engineer), Cloud Builders Africa, Educloud Academy, Codveda. Recognition leads with **AWS Certified Cloud Practitioner**. Community & Speaking lists the 3 dev.to articles as "Writing".
