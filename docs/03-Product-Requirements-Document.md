# 03 — Product Requirements Document (PRD)
## "Josue.cloud — The Talking Drum Portfolio"
Owner: Tiaya Fotseu Josue · Version 1.1 (reviewed) · 5 Nov 2026
Inputs: [01-Requirements-Analysis.md](01-Requirements-Analysis.md), [02-Market-Research.md](02-Market-Research.md), [04-Review-Report.md](04-Review-Report.md)

> **How to read this document.** It's a *telescopic* view: every feature we would build if time and complexity were no object. Each feature is tagged with a **Release** so the vision never endangers the deadline:
> - **R1 — Submission-critical** (must be live before 6 Nov 23:59 PST = 7 Nov 08:59 WAT). Internal target: **submitted by 6 Nov 22:00 WAT** (about 11 h of buffer).
> - **R1s — Stretch** (only with time left over before 6 Nov 17:00 WAT, after every R1 build item is live; dropped first, never traded against R1)
> - **R2 — Post-submission** (built on a `staging` branch from 7 Nov; merged to `main` only after winners are announced, week of 23 Nov, unless the Official Rules explicitly allow post-deadline changes. The write-up is fixed at submission, so R2 work is not what Gate 1 scores)
> - **R3 — Vision** (post-hackathon product)
>
> *Working title: "Josue.cloud" is a brand name only until the domain is registered (F34). The submission uses the `amplifyapp.com` URL.*

---

## 1. Vision & positioning

**Product vision:** a portfolio that a recruiter can read in **60 seconds**, that an AWS engineer can **audit in 5 minutes**, and that anyone can **remember a week later**. Here Josue's two identities, *Cameroonian drummer* and *cloud builder*, turn out to be the same superpower: **sending messages across distance, reliably**.

**Tagline:** *"Before SNS, there was the drum."*

**Positioning statement:** For recruiters, AWS judges and the student community who need to evaluate a young cloud engineer quickly and trust what they see, Josue.cloud is a bilingual, AWS-native portfolio. It pairs an instant recruiter view with a **talking-drum experience** that decodes rhythm into the story of who Josue is. Template portfolios list skills. This one *proves* them (documented architecture, monitoring, open repo) and *performs* them.

### 1.1 Personas

| Persona | Goal | Time budget | Success = |
|---|---|---|---|
| **Gate-1 AI scorer** | Map submission to the rubric | Seconds per entry | Finds every criterion and deliverable, explicitly evidenced **in text** (headings, captions, static HTML) |
| **AWS judge (Gate 2)** | Is it creative, real and well-communicated? | 3–5 min | Plays the drum, smiles, opens "How this site is built", nods |
| **Recruiter / hiring manager** | Shortlist or skip | 60 s | Name, role, top projects and contact without friction |
| **Tech lead** | Verify depth | 5–10 min | Case studies, repo, architecture, honest trade-offs |
| **Cloud Club UB student** | Learn and copy | Open-ended | Forks the template, follows the build log |

### 1.2 Design principles
1. **Content first, delight second.** The creative layer never blocks content (rule D3).
2. **Prove, don't claim.** Every skill links to evidence.
3. **Static core, cloud superpowers on top.** If every API dies, the portfolio still works 100%.
4. **Fast on Cameroonian 3G.** Under 200 KB first load, zero frameworks.
5. **Accessible by default.** WCAG 2.2 AA, keyboard-complete, motion-safe, sound-safe.
6. **Bilingual by design.** EN/FR (FR ships in R2; copy is written with translation in mind from day one).
7. **Nothing invented.** All content comes from a confirmed `plan.md`.
8. **One creative feature.** Everything playful (sound, rhythm, Stage Mode) lives inside F20 *The Talking Drum*. No other gamified feature, "mode" or theme switcher ships on the live site during judging, so neither the AI scorer nor a judge can be unsure which feature is "the one".
9. **Machine-legible.** All core content and the drum hint are in the static HTML (not injected by JS), so a scorer that fetches the page without running JS still sees every section.

---

## 2. Information architecture

```
/ (single page, anchored sections)
├── #hero          Name · role · one-liner · CTAs · 🥁 hint (link to #drum)
├── #about         Story: Bafoussam → Dschang → Buea → the cloud
├── #superpowers   Skills, evidence-linked
├── #projects      Case-study cards (+ /projects/<slug> deep pages in R2)
├── #achievements  Awards · certifications · community timeline
├── #drum          THE TALKING DRUM (creative feature; deep links /#drum and ?mode=stage)
├── #contact       Email · LinkedIn · GitHub · form (R2)
└── footer         GitHub repo · "How this site is built" (F45) · last-updated date · language (R2)
/how-it-works      Static architecture page (F45, R1); interactive X-ray replaces it (F30, R2)
/build-log         Making-of journal (R2)
/cv.pdf            Sanitised one-pager exported from the print stylesheet (R1s)
```

Navigation: sticky top nav (hamburger below 768 px) with skip-link and active-section highlight. **No global single-key shortcuts** (WCAG 2.1.4); the drum's `F`/`J` keys work only while focus is inside the drum section.

---

## 3. Signature creative feature — F20 "The Talking Drum" (hero feature, 30% of score)

### 3.1 Concept
Across Cameroon and West & Central Africa, **talking drums** and two-tone slit drums carried messages between villages by imitating the tones of speech. They are one of the oldest long-distance messaging networks. Josue plays drums. The feature lets visitors **play a drum to "send a message" and receive a hidden truth about Josue**, then reveals the punchline: *this is exactly how pub/sub cloud messaging works*. The drum is the publisher, the rhythm is the message, and the villages are subscribers.

> ✅ **Content check (owner must confirm):** default framing is regional: *"inspired by the talking-drum traditions of Cameroon and West & Central Africa"*, plus Josue's own drumming. Do **not** present a specific tradition as Josue's own heritage. The Beti *nkul*, for example, belongs to peoples of the Centre/South regions, while Josue is from Bafoussam in the West region. Name a specific drum or people only if Josue confirms it and can cite a source, and credit it as that community's tradition.

### 3.2 Visible hint (mandatory)
- In the hero: a drum icon with the label **"The drum has a message for you — tap it"** (🥁 emoji marked `aria-hidden`). It is a real link to `#drum`, so it works without JS.
- In the nav: a "Drum" item.
- A subtle repeating "pulse" ring every 8 s. It's disabled under `prefers-reduced-motion`.
- **AC-H1:** the hint is plain HTML text (not image, canvas or JS-injected), visible without scrolling at 360×640 and 1280×720, contrast ≥ 4.5:1.

### 3.3 Interaction design

| Step | Visitor action | System response |
|---|---|---|
| 0 | Sees hint | Nothing plays; **no autoplay audio** |
| 1 | Taps the hint or nav "Drum" (or opens `/#drum`) | Page scrolls to the always-visible drum section (no open step, no modal): 2 drum pads (**low** = `F`, **high** = `J`) plus a "🔊 Sound on/off" toggle. Sound starts on the first pad hit (the user gesture satisfies the autoplay policy). Focus moves to the low pad |
| 2 | Plays hits | Each hit gives visual feedback on `pointerdown` within one frame and a tone synthesised via Web Audio. The phrase so far shows as notation (● low, ○ high). **R1s:** a wave travels along a stylised line Bafoussam → Buea → you (CSS/SVG; static under reduced motion) |
| 3 | Completes a **4-hit phrase** (any pattern) | The drum "speaks": the **next undecoded** message of 8 appears as a stamped "Message received" card showing the phrase played. No repeats until all 8 are decoded. The first card also carries the one-line punchline (step 6). An unfinished phrase resets after 2 s idle |
| 4 | Collects messages | A progress row "3 / 8 messages decoded" (stored in `localStorage`, wrapped in try/catch) encourages exploration without forcing it |
| 5 | Decodes 3 messages, or plays the **secret phrase** shown in notation on the 3rd card | An **"Enter Stage Mode"** button appears (the secret phrase enters directly). **Stage Mode** = a CSS theme swap (stage lights, warm palette) plus a short on-stage message from Josue. Phrases are tone-only (no timing detection, which is unreliable on touch); the owner picks the secret phrase and does not claim it encodes his name unless he confirms a tonal basis. *(Superpowers drum kit moved to F24, R2. Stats card and drum-kit cursor cut.)* |
| 6 | Reads the punchline | *"Before SNS, there was the drum. Drummer = publisher, rhythm = message, villages = subscribers. I build the modern version on AWS →"* links to "How this site is built" (F45; F30 in R2) |
| 7 | Exits | "✕ Back to the quiet site" leaves Stage Mode; so does `Esc` while focus is in the drum, or any nav link. All content stays reachable at every step |

### 3.4 Rules & acceptance criteria
- AC1: The feature is never required to reach any section. Nav works in every state.
- AC2: Fully playable by **mouse, touch, and keyboard**. Pads are `<button>`s (`Enter`/`Space` activate the focused pad); `F`/`J` work only while focus is inside the drum section. Hit targets ≥ 44×44 px (≥ 64 px recommended for thumbs on mobile).
- AC3: **Screen-reader alternative**: "Read the messages" button lists all decoded messages as text. `aria-live="polite"` announces each decode. Pads have accessible names ("Low drum", "High drum").
- AC4: `prefers-reduced-motion` gives static visuals with no pulsing and no map animation, and sound still works.
- AC5: Sound is never played before a user gesture. A persistent mute toggle sits in the panel and the footer. The feature is fully understandable with sound off (e.g. the iOS silent switch can mute Web Audio).
- AC6: Works offline once loaded. No network calls are needed for the core feature.
- AC7: JS for the feature ≤ 25 KB min+gzip. No audio files (synthesis only). Visual feedback within one frame (≤ 16 ms) of `pointerdown`; audio latency best-effort, target ≤ 100 ms on a mid-range Android (device output latency is outside our control).
- AC8: Deep link `/#drum` (works without JS) scrolls to the drum; `?mode=drum` is an alias; `?mode=stage` opens Stage Mode with all 8 messages viewable (so judges can jump in, and screenshots are reproducible).
- AC9: If Web Audio is unsupported, visuals still run with a "sound not supported" note.
- AC10: **10-second test:** 3 people who have not seen the site each get their first decoded message within 10 s of landing, on a phone, with no instructions.
- AC11: **Message content:** exactly 8 messages, each traceable to `plan.md` and owner-confirmed; at least 4 reveal something about Josue **not already stated elsewhere** on the page (e.g. music, drawing, roots, languages); each ≤ 140 characters; no placeholder text ships.
- AC12: With JS disabled, the drum section shows a one-paragraph text description of the feature, and the rest of the site is unaffected.

### 3.5 Optional cloud extensions of the drum (R1s/R2/R3)
- **F21 Drum Telegraph (pub/sub for real):** "Send a rhythm to Josue". The visitor's 4-hit phrase is published via API Gateway (HTTP API, throttled to 1 req/s, burst 5) → Lambda → **Amazon SNS**, which emails Josue: *"Someone just drummed at you: ●○●●"*. That's a literal working demonstration of the punchline. Payload is the phrase only: no PII, no free text, no location. Front end uses fire-and-forget `fetch` with a 3 s timeout; failure never affects the drum. **R1s, last item**: build only if R1 is live with time to spare, so it can be documented in the write-up; otherwise R2.
- **F22 The Village Wall:** visitors who unlock Stage Mode can leave a 1-line "message to the village" (guestbook). Lambda → DynamoDB. Moderation runs through Amazon Comprehend toxicity detection + manual approve flag.
- **F23 Live Rhythm Map:** aggregate (anonymous) count of drums played per country (CloudFront viewer-country header → DynamoDB), shown as glowing dots on the map.
- **F24 Superpowers drum kit (new, R2):** inside Stage Mode, the Superpowers grid becomes a drum kit where each skill is a pad that plays a sound and reveals its evidence (moved out of the R1 Stage Mode scope).

### 3.6 Alternative creative concepts considered (for reviewer)

| Concept | Distinctive? | Reflects Josue? | Saturation risk | Verdict |
|---|---|---|---|---|
| **The Talking Drum** | ★★★★★ | ★★★★★ (drums, Cameroon, messaging/cloud) | Very low | **Chosen** |
| Guitar fretboard: each fret is a project | ★★★★ | ★★★★ | Low | Fallback / Stage Mode bonus |
| Sketchbook: hand-drawn doodles reveal facts (he draws) | ★★★★ | ★★★★ | Low | Strong alternative; reuse for art style |
| Cloud console terminal | ★★ | ★★★ | **Very high** (listed twice by organisers) | Reject as primary; maybe hidden power-user extra |
| Win98 desktop / arcade / vending machine | ★ | ★ | **Very high** (organiser examples) | Reject |

---

## 4. Full feature catalogue

Legend: **Rubric** C = Creativity 30% · A = AWS 25% · M = Communication 25% · U = Completeness/Usability 20%. **Pri** = MoSCoW.

### 4.1 Core content (rule D2)

**Shared acceptance for F01–F05:** content is in static HTML and renders with JS disabled; every fact traces to owner-confirmed `plan.md`; each section has an `id`, an `<h2>` and a nav link; reads well at 360 px and 1280 px.

| ID | Feature | Description | Pain point solved | Rubric | Pri | Rel |
|---|---|---|---|---|---|---|
| F01 | **10-second Hero** | Name, "Cloud & Full-Stack Engineer · Computer Engineering student, University of Buea" (title wording owner-confirmed), 1-line value prop, location, CTAs: *View projects · Contact · CV (once F07 ships)*, drum hint | P1 recruiter 60-s filter | U, C | Must | R1 |
| F02 | **About Me story** | Short narrative (≤120 words) + photo: Bafoussam → Buea → cloud; what he's working on now; bilingual (FR in R2) | P4 "who is the human?" | U, M | Must | R1 |
| F03 | **Tech Superpowers (evidence-linked)** | Grouped skills (Cloud/AWS, Frontend, Backend, DevOps/Monitoring, Data, Soft). **No % bars.** Each skill shows "proof" chips linking to the project/cert where used | P3 unverifiable claims | U, M | Must | R1 |
| F04 | **Projects as case studies** | 4–6 cards chosen from: AfriPay, HIS Cameroon (only if owner confirms his role), DIGISOL IMS, Apache+Nagios hardening, Microfinance K-means, BDD/Cucumber, *and this portfolio itself*. Each card: problem · my role · stack · decisions/trade-offs · outcome · live & repo links · thumbnail. "Learning project" badge where applicable. **AC:** every link returns 200 at submission; if a live demo may sleep or expire, link the repo + a screenshot instead | P3, P4, P6 | U, M | Must | R1 |
| F05 | **Achievements & Community timeline** | Dev War 3rd place, Huawei Credly badges (verified links), bootcamp, AWS Community Day volunteer, AWS Cloud Club UB core team (onsite lead), GDSC UB, Hult Prize UB | P6 impact | U | Must | R1 |
| F06 | **Contact** | `mailto:` + LinkedIn + GitHub (no phone, DOB, or ID). R2: form → API Gateway → Lambda → **SES** with honeypot + rate limit | P8 friction | U, A | Must (links) / Should (form) | R1 / R2 |
| F14 | **Footer GitHub link** | Repo link + "How this site is built" (F45) + last-updated date (edited by hand; there is no build step to generate it) | Rule D4 | A, U | Must | R1 |

### 4.2 Usability, accessibility & quality (20% + trust)

| ID | Feature | Description | Pain point | Rubric | Pri | Rel |
|---|---|---|---|---|---|---|
| F07 | **Print CV + Recruiter Mode** | R1s: print stylesheet on `/` and a `cv.pdf` exported from it. **Never upload the original CV** (it contains ID number, DOB, phone). R2: Recruiter Mode toggle (footer button, no single-key shortcut) that collapses the site into a dense one-screen summary | P1, P2, P8 | U, M | Should (print) / Could (toggle) | R1s / R2 |
| F08 | **EN / FR language toggle** | EN copy stays in static HTML; FR swapped in from `i18n/fr.json`; `lang` attribute switches; remembers choice; drum messages bilingual | P10 | C, U | Should | R2 |
| F09 | **Automatic light / dark / high-contrast** | Follows `prefers-color-scheme`; respects `forced-colors` and `prefers-contrast`. **No visible theme switcher** (it's an organiser-listed creative idea and would blur "one creative feature"). Stage Mode belongs to F20 | Comfort, a11y | U | Should | R1 |
| F10 | **Accessibility pack** | Skip link, semantic landmarks, visible focus, alt text, colour contrast ≥ 4.5:1, 44 px targets, reduced-motion, captions/text alternatives, no global single-key shortcuts (WCAG 2.1.4), axe-clean | P9 | U | Must | R1 |
| F11 | **Performance budget** | ≤ 200 KB first load, LCP ≤ 2.5 s on 3G-fast, CLS ≤ 0.1, INP ≤ 200 ms; images AVIF/WebP with `srcset`; fonts `font-display: swap` (or system stack) | P1, P5, P9 | U, A | Must | R1 |
| F12 | **Mobile-first responsive** | Tested at 360, 768, 1280, 1920 px; drum playable by thumbs | P5 | U | Must | R1 |
| F13 | **SEO & social cards** | R1: title/description, Open Graph + Twitter tags, JSON-LD `Person`, sitemap.xml, robots.txt, favicon, canonical. R1s: designed OG image (drum + name) | P8 LinkedIn shares | M, U | Should | R1 / R1s |
| F15 | **Broken-link guarantee** | Link checker (lychee) in CI; external cert links verified | Rubric "core links work" | A | Must | R1 (manual) / R2 (CI) |
| F16 | **404 page with a drum fill** | Custom 404 via Amplify rewrites: "This page missed the beat → back home" | Polish | C, U | Could | R2 |

### 4.3 AWS implementation & proof (25%)

| ID | Feature | Description | AWS services | Pain point | Pri | Rel |
|---|---|---|---|---|---|---|
| F33 | **Amplify Hosting + Git CI/CD** | **New** public GitHub repo connected to a **new** Amplify app (originality rule D6); auto-deploy on push to `main`; changes tested first on PR previews (allowed on a public repo only while the app needs no IAM service role, true for this static site) or a connected `staging` branch; build badge in README | Amplify Hosting (CloudFront CDN + managed storage), IAM | Rules R5, D1, D6 | Must | R1 |
| F35 | **Security headers** | `customHttp.yml`: CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors; `/.well-known/security.txt`; target A+ on securityheaders.com. **AC:** CSP verified on staging before `main`; scripts in files, no `'unsafe-inline'` for scripts | Amplify custom headers | Shows CloudSec mindset (career goal) | Should | R1 |
| F36 | **Uptime & cost guardrails** | AWS Budgets alerts at $1/$5 (alerts only, **not** a spending cap). CloudWatch Synthetics canary **hourly** (≈ $0.74/month after the 100 free runs; every 15 min would be ≈ $3.3/month and trip the $1 alert) → SNS email on failure. Canary moved to R1 so it is screenshotted and documented in the write-up | CloudWatch Synthetics, SNS, Budgets | "Stays accessible through judging window" | Must (Budgets) / Should (canary) | R1 |
| F31 | **Live visitor counter + countries** | Lambda (Python/Node) + DynamoDB atomic counter; country from `CloudFront-Viewer-Country`; displayed in footer "You are visitor #1,234 · from 37 countries" | API Gateway HTTP API, Lambda, DynamoDB | P7 "is AWS real?" | Should | R2 |
| F30 | **Architecture X-Ray** (`/how-it-works`) | Interactive SVG diagram of the real architecture; click a node → what it does, why chosen, cost/month, Well-Architected pillar; "trace a request" animation (motion-safe); links to IaC in repo. Replaces the static F45 page | Documents all of the above | P6, P7 | Should | R2 |
| F37 | **Infrastructure as Code** | All backend resources in AWS CDK (TypeScript) or Amplify Gen 2 `amplify/` backend; `cdk diff` in PR | CDK / CloudFormation | Engineering maturity | Could | R2 |
| F34 | **Custom domain + TLS** | e.g. `josue.cloud` via Route 53 + ACM (managed by Amplify), if available. The `amplifyapp.com` URL keeps working after a domain is added, so the submitted URL never breaks | Route 53, ACM | Memorability, brand | Could | R2 |
| F32 | **"Ask Josue" AI assistant** | Chat widget: answers recruiter questions in EN/FR **only** from his public content; shows sources; guardrails block off-topic/PII; rate limit 10 req/IP/day; monthly cost cap. **Out of hackathon scope:** a second interactive feature competes with F20, any hallucinated answer breaks "don't make up details about me", and it is the main cost/abuse risk | Bedrock (Nova Micro / Claude Haiku), Bedrock Guardrails, Lambda, API Gateway throttling, (Knowledge Base on S3 optional) | P1, P8 | Won't (hackathon) | R3 |
| F21 | **Drum Telegraph** (see §3.5) | Real pub/sub demo | SNS, Lambda, API Gateway | Creativity × AWS combo | Could | R1s / R2 |
| F38 | **Real-user monitoring** | Web vitals from real visitors | CloudWatch RUM | Prove performance claims | Could | R3 |
| F39 | **WAF rate limiting** | Protect APIs from abuse. WAF costs about $5/month per web ACL plus $1 per rule, above the $5 budget, so API Gateway throttling comes first | AWS WAF on API Gateway / CloudFront | Cost safety | Could | R3 |

### 4.4 Communication & submission (25%)

| ID | Feature | Description | Pri | Rel |
|---|---|---|---|---|
| F41 | **Rubric-mapped submission write-up** | Project post that opens with a **deliverables checklist** (D1–D6 → evidence) and uses headings with the **exact** rubric names: *Creativity and memorability · Working AWS implementation · Communication quality · Portfolio completeness and usability*, plus *What I learned* and *Challenges I hit*. Includes live URL, repo, demo GIF, architecture diagram, services table with exact AWS service names, cost, an originality statement (new repo and first deploy dates) and a coding-agent disclosure. **Every image has a text caption** (the AI scorer may read text only). **AC:** dry run: paste the final write-up and the rubric into an LLM and confirm it finds evidence for every criterion and deliverable. Template in §7 | Must | R1 |
| F42 | **Screenshot pack** | Portfolio: hero (desktop), each core section, mobile (3), drum section, message card, Stage Mode. AWS: Amplify app overview, deploy history, custom headers, Budgets, Synthetics canary, (R1s) Lambda/SNS. Consistent browser frame, annotated callouts, numbered captions. **AC:** taken from the final submitted version; AWS account ID, email addresses and ARNs redacted | Must | R1 |
| F40 | **Build log** (`/build-log`) | Day-by-day journal: plan.md → agent prompts → decisions → bugs → fixes; honest "what the AI got wrong and how I fixed it" (the short version goes in F41 for R1) | Should | R2 |
| F43 | **Excellent README** | Badges, screenshot, architecture diagram, services, local run, accessibility statement, credits, license (MIT) | Must | R1 |
| F44 | **Demo GIF / video** | R1: GIF/WebP ≤ 15 s and ≤ 5 MB (hint → 4 taps → message → Stage Mode). R1s: 60–90 s screen capture with voice-over in EN (FR subtitles), linked from the write-up | Must (GIF) / Could (video) | R1 / R1s |
| F45 | **"How this site is built" (static, new)** | Section or `/how-it-works` page: static SVG architecture diagram, services table (service → purpose → monthly cost), security headers and monitoring explained, link to repo. The same diagram is reused in the README and write-up. Target of the F14 footer link and the F20 punchline | Must | R1 |

### 4.5 Telescopic vision (R3 — post-hackathon)

| ID | Feature | Description | Pain point |
|---|---|---|---|
| F50 | JSON-driven content | All content in `content/*.json`; edit without touching HTML; later a tiny admin via Amplify Data + Cognito | Updating portfolio is painful |
| F51 | Privacy-friendly analytics | Own pipeline: beacon → Lambda → DynamoDB → mini dashboard | Know what recruiters read |
| F52 | Cameroonian Pidgin easter egg | Third language toggle "Pidgin" for fun | Cultural memorability |
| F53 | PWA | Installable, offline-capable | Slow networks |
| F54 | **"Fork my portfolio" template** | Open-source the structure (without his content) for AWS Cloud Club UB's 500+ members, with a workshop | P11 community impact; great story for judges |
| F55 | Mentorship / office hours booking | Calendar link for students | Community |
| F56 | Talks & writing hub | Blog posts from Builder Center, cross-posted | Thought leadership |
| F57 | Guitar fretboard projects explorer | Second instrument-based navigation inside Stage Mode | Depth of creative layer |

### 4.6 Compliance traceability (new)

| Requirement | Features | Test |
|---|---|---|
| D1 Live AWS URL, accessible through judging | F33, F36, F15 | HTTPS 200 from 3 networks (Wi-Fi, mobile data, a VPN/other country); canary green; `main` frozen during judging (§8) |
| D2 About Me · Skills/Superpowers · Projects/Achievements | F02, F03, F04, F05 | Shared acceptance §4.1; visible with JS disabled |
| D3 One creative feature, interactive, working, visible hint, doesn't block navigation | F20 (AC-H1, AC1–AC12), principle 8 | AC10 10-second test; nav usable in every drum state |
| D4 GitHub repository link | F14, F43, F41 | Public repo linked from footer and write-up |
| D5 Project post: creative feature, portfolio + AWS screenshots, AWS services, learnings, challenges | F41, F42, F44, F45 | F41 LLM dry run; ≥ 6 portfolio + ≥ 4 AWS screenshots |
| D6 Original, unpublished portfolio | F33, F41 | New repo and new Amplify app; no previously published portfolio reused; originality statement in write-up |
| Eligibility (student, 18+, individual, one entry, country) | §10 | Checked before submitting |

---

## 5. Target architecture

```
Visitor ─HTTPS─► Amplify Hosting (CloudFront global CDN + managed storage)
                  │   static: index.html · styles.css · script.js · drum.js · (R2) i18n/fr.json
                  │   customHttp.yml (security headers) · rewrites (404)
                  │
                  └─(R1s/R2, progressive enhancement, fetch with timeout + fallback)
                      API Gateway (HTTP API, throttled)
                        ├─ /drum      → Lambda → SNS → Josue's email (Drum Telegraph, R1s)
                        ├─ /visit     → Lambda → DynamoDB (counter, countries, R2)
                        ├─ /contact   → Lambda → SES (R2)
                        ├─ /wall      → Lambda → Comprehend (toxicity) → DynamoDB (R3)
                        └─ /ask       → Lambda → Bedrock (+Guardrails, KB on S3) (R3)
GitHub ─push─► Amplify CI/CD (deploy; PR previews or staging branch; link-check in R2)
Ops: CloudWatch Synthetics canary (hourly) → SNS alert · AWS Budgets alerts · CloudWatch logs (RUM in R3)
IaC: AWS CDK stack in /infra (R2)
```
Estimated cost during judging: R1 ≈ $0–1/month (Amplify Hosting at judging traffic is cents; Budgets free; hourly canary ≈ $0.74). F21 adds well under $0.10 at expected traffic. Budgets only **alert**; spend is limited by API Gateway throttling and by keeping Bedrock (F32) out of hackathon scope.

## 6. Non-functional requirements

| Area | Requirement |
|---|---|
| Availability | ≥ 99.9% target from 6 Nov to 30 Nov; hourly canary |
| Performance | Lighthouse ≥ 95 in all 4 categories (mobile); first load ≤ 200 KB |
| Accessibility | WCAG 2.2 AA; zero critical axe violations; full keyboard path including drum; no global single-key shortcuts |
| Security | HTTPS only; security headers; no secrets in repo; least-privilege IAM per Lambda; no PII collected beyond voluntary contact form |
| Privacy | Never publish ID number, DOB, phone, home address (including in any CV file); no third-party trackers; cookie-free |
| Compatibility | Last 2 versions Chrome, Safari (iOS), Firefox, Edge, Samsung Internet |
| Resilience | Every API feature has a timeout (≤ 3 s) and a static fallback; all core content in static HTML; site fully usable with JS disabled except interactive features |
| Content integrity | Every fact traceable to `plan.md`, owner-confirmed |
| Change control | From submission until winners are announced, `main` gets only fixes (broken link, typo, outage); every change is checked on staging first |

## 7. Submission write-up template (F41)

```
# 🥁 Josue.cloud — Before SNS, there was the drum
Live: https://<app>.amplifyapp.com   ·   Repo: https://github.com/Joshua4-0p/<new-repo>
Try the creative feature: https://<app>.amplifyapp.com/#drum   ·   Stage Mode: https://<app>.amplifyapp.com/?mode=stage

## Submission checklist
| Requirement | Where |   (one row per deliverable D1–D6: live URL, three sections, creative feature + hint, repo, screenshots/services/learnings, originality)

## Creativity and memorability
What the Talking Drum is, why it reflects me (drummer, Cameroon, cloud messaging), how the visible hint works, how it stays out of the way of navigation. GIF + captioned screenshots.

## Working AWS implementation
Architecture diagram · services table (AWS Amplify Hosting, Amazon CloudWatch Synthetics, Amazon SNS, AWS Budgets, AWS IAM, … → purpose → cost) · captioned console screenshots (redacted) · uptime monitoring · security headers.

## Communication quality
How I built it: plan.md → coding agent → review → deploy. What the coding agent got wrong and how I fixed it. Originality statement (new repo, first deploy date).

## What I learned
3 learnings.

## Challenges I hit
3 challenges with how I solved them.

## Portfolio completeness and usability
Three sections · mobile screenshots · accessibility & performance scores (Lighthouse, axe).

#student-builders
```

## 8. Release plan

| Release | Scope (feature IDs) | Exit criteria |
|---|---|---|
| **R1 — by 6 Nov 23:59 PST (7 Nov 08:59 WAT); target 6 Nov 22:00 WAT** | F01–F05, F06 (links), F09–F12, F13 (tags), F14, F15 (manual), **F20 core (hint, two pads, 8 messages, Stage Mode theme, a11y; AC-H1, AC1–AC12)**, F33, F35, F36 (Budgets + hourly canary), F41, F42, F43, F44 (GIF), F45 | Live URL, all 6 deliverables met (§4.6), submitted |
| **R1s — stretch, only with time left before 6 Nov 17:00 WAT** | F07 (print CSS + `cv.pdf`), F13 (designed OG image), F20 map wave, F44 video, F21 (last) | Documented in the write-up, or not shipped |
| **R2 — staging from 7 Nov; `main` after winners (week of 23 Nov)** | F06 form, F07 Recruiter Mode, F08, F15 (CI), F16, F24, F30, F31, F34, F37, F40 | No regressions; each deploy link-checked |
| **R3 — after 23 Nov** | F22, F23, F32, F38, F39, F50–F57 | Product roadmap |

> Rule for R2: deploy only from a passing PR preview or staging branch; never touch `main` without the link check and Lighthouse check. During judging (Nov 9–20) `main` takes fixes only, because the judges are watching the live URL and the write-up can't describe later changes. Ship R2 to `main` earlier only if the Official Rules explicitly allow post-deadline changes.

### 8.1 R1 timebox (WAT)

| Window | Work | Exit |
|---|---|---|
| 5 Nov, rest of day | `plan.md` confirmed (facts, 8 drum messages, cultural framing, exclusion list); new repo + new Amplify app; F01–F05 as static HTML, deployed; F36 Budgets | Live URL serving real content |
| 6 Nov 08:00–13:00 | F20 core; F09–F12 | AC10 10-second test passed on a phone |
| 6 Nov 13:00–17:00 | F35, F36 canary, F45, F43, F13 tags, manual link check; R1s only with time left | Every R1 build item live |
| 6 Nov 17:00–22:00 | F42 screenshots, F44 GIF, F41 write-up + LLM dry run, submit | Submitted ≥ 10 h before the deadline |
| 7 Nov 08:59 | **Hard deadline** (6 Nov 23:59 PST) | — |

## 9. Success metrics

| Metric | Target |
|---|---|
| Advance past Gate 1 | Top 50 / 1,401 |
| Rubric self-score before submit | ≥ 90/100 against §10 checklist |
| Lighthouse (mobile) | ≥ 95 ×4 |
| Uptime through 30 Nov | 100% of canary checks |
| Drum engagement (post-judging, needs F51) | ≥ 40% of visitors open it; ≥ 15% unlock Stage Mode |
| Recruiter path | Contact reachable in ≤ 2 clicks from any state |

## 10. Pre-submission checklist (definition of done)
- [ ] Builder Center profile is student-verified (18+); Official Rules read: Cameroon eligible, and rules on post-deadline edits noted
- [ ] Live URL loads over HTTPS on desktop + phone (Wi-Fi and mobile data); the submitted URL is the one that will stay
- [ ] About, Superpowers, Projects/Achievements present, with real content and no invented facts; all visible with JS disabled
- [ ] Drum hint visible above the fold; drum works with mouse, touch, keyboard; exit works; nav never blocked; 10-second test passed by 3 people
- [ ] No other playful mode or theme switcher on the live site (principle 8)
- [ ] GitHub repo public, new for this challenge, and linked; README complete
- [ ] No ID, DOB, phone, or address anywhere (grep the repo, and check any `cv.pdf`)
- [ ] All links checked (lychee / manual)
- [ ] Lighthouse mobile ≥ 95; axe no critical issues; reduced-motion tested
- [ ] AWS Budgets alerts and hourly canary configured
- [ ] Screenshots: ≥ 6 portfolio + ≥ 4 AWS console, captioned, account ID/emails/ARNs redacted
- [ ] Write-up follows §7 template (exact rubric headings, checklist, services list, learnings and challenges); LLM dry run passed
- [ ] Project submitted under "Your project" on the hackathon page, with tag `#student-builders`

---

## Change log (v1.1 — reviewer)
Full rationale in [04-Review-Report.md](04-Review-Report.md).

**Releases & scope**
1. Release definitions: added **R1s (stretch)**; **R2 redefined** from "score-maximisers during judging" to post-submission work on `staging`, merged after winners unless the Official Rules allow otherwise (the write-up is fixed at submission, so R2 isn't scored in Gate 1, and live changes risk the 25% AWS criterion). Internal submit target 6 Nov 22:00 WAT. Added §8.1 R1 timebox and a Change-control NFR.
2. Design principles 8 (one creative feature) and 9 (machine-legible static HTML) added; principle 6 notes FR ships in R2.
3. **F09** changed from a light/dark/high-contrast toggle to automatic theming with no visible switcher (a theme switcher is an organiser-listed creative idea).
4. **F07** split: print CSS + sanitised `cv.pdf` → R1s (never upload the original CV); Recruiter Mode toggle → R2, Could. F01 "Download CV" CTA now conditional.
5. **F32** "Ask Josue" demoted to R3 / Won't (hackathon).
6. **F36** canary moved R2 → R1, set to hourly (15 min ≈ $3.3/month would trip the $1 alert); Budgets labelled as alerts, not caps.
7. **F44** GIF capped at ≤ 15 s / 5 MB; video moved R2 → R1s.
8. **F21** moved R2 → R1s (last stretch item); removed visitor-country from the SNS message; specified throttling.
9. **F13** designed OG image → R1s; tags stay R1.
10. New **F24** Superpowers drum kit (R2), moved out of R1 Stage Mode. New **F45** static "How this site is built" (R1 Must). The F14 footer link and the F20 punchline both pointed to the R2 page F30, which would have been a broken link in R1.

**F20 The Talking Drum**
11. §3.1 cultural framing made regional; Beti *nkul* no longer implied as Josue's heritage; "the original" → "one of the oldest" messaging networks.
12. §3.2 hint is a real `#drum` link; new AC-H1 (static text, above the fold at 360×640 and 1280×720, contrast).
13. §3.3: drum section always visible (no open step); each 4-hit phrase reveals the **next undecoded** message (no duplicates); punchline on the first card; Stage Mode unlocks via a button after 3 messages or a shown tone-only secret phrase (replaced the timing-based "Jo-su-é long-short-long"); Stage Mode cut to a CSS theme; **stats card and drum-kit cursor cut** (stats card imitates the organisers' reference build, and the custom cursor hurts usability); map wave → R1s.
14. AC2 keys scoped to drum focus (WCAG 2.1.4) and pads as buttons; AC3 accessible names; AC5 sound-off comprehension; AC7 replaced the untestable "30 ms tap-to-sound" with ≤ 16 ms visual / ≤ 100 ms best-effort audio; AC8 `/#drum` primary deep link. New AC10 (10-second test), AC11 (message content rules), AC12 (no-JS description).
15. IA/navigation: removed global `D` and `R` shortcuts.

**Catalogue & accuracy fixes**
16. §4.1 shared acceptance for F01–F05 (static HTML, traceability, ids/headings/nav). F04 count fixed to 4–6 cards, link AC, HIS only if role confirmed. F05 "Cloud Club UB lead" → "core team (onsite lead)" to match the source. F14 build-time timestamp → manual last-updated date (no build step).
17. F33 requires new repo + new Amplify app (D6); notes that Amplify PR previews on public repos work only while the app needs no IAM service role, with `staging` as an alternative. F35 CSP AC. F34 domain note. F39 WAF cost note. F08 keeps EN in static HTML.
18. F41 rubric headings corrected to the exact rubric names; added a deliverables checklist, captions, exact service names, originality statement, LLM dry run. F42 redaction and final-version AC, Synthetics screenshot.
19. New §4.6 compliance traceability matrix (D1–D6 + eligibility).
20. §5 architecture labelled by release; cost estimate corrected; "hard-capped by Budgets" removed. §6 NFRs updated. §7 template headings and deep links updated (repo name placeholder, since the repo must be new). §9 uptime through 30 Nov (was 23 Nov, inconsistent with §6 and doc 01). §10 checklist: eligibility, no-JS, 10-second test, principle 8, redaction, LLM dry run.

**Docs 01 and 02**
21. 01 §9: AWS-bill mitigation corrected (Budgets alert but don't cap; WAF costs ≥ $5/month).
22. 02 §2: P1 "sub-2 s load" → "LCP ≤ 2.5 s" (matches F11); P7 screenshot pack ID F41 → F42, adds F45. 02 §3: "the original long-distance messaging network" → "one of the oldest", and "tradition" → "traditions".
