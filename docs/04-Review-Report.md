# 04 — Independent Review Report
**PRD under review:** 03-Product-Requirements-Document.md v1.0 → v1.1
Reviewer: ex-AWS hackathon judge / senior PM · Date: 5 Nov 2026 (Thursday) · Deadline: 6 Nov 23:59 PST = Sat 7 Nov 08:59 WAT

---

## 1. Executive verdict

**The concept is a top-50 contender. The v1.0 plan was not.** "The Talking Drum" is the strongest part of the package. It is personal (drummer), cultural (Cameroon), technical (pub/sub), and it fits none of the organisers' nine example ideas. Most of the 1,401 entrants will not have anything like it.

v1.0 left points on the table in three ways:

1. **It assumed R2 work would raise the score.** The write-up is fixed at submission, so the Gate-1 AI scorer and the Gate-2 panel score R1 plus a document that cannot mention R2. Pushing new features to the live URL during judging also puts the 25% "site loads, core links work" criterion at risk.
2. **It diluted "one creative feature".** A theme switcher (an organiser example), a Recruiter Mode, an AI chatbot, a 404 drum fill and a stats card all competed with the drum for the judges' attention.
3. **R1's AWS story was thin and partly broken.** R1 was Amplify + Budgets only, and the footer and drum punchline linked to an R2 page that would not exist at submission.

v1.1 fixes these. It also tightens the drum so it pays off in under 10 seconds, makes the cultural framing safe, fixes cost and accessibility errors, and adds a timeboxed R1 with an 11-hour buffer.

### Self-scored rubric estimate (assumes R1 is executed as specified)

| Criterion (weight) | v1.0 | v1.1 | Why it moved |
|---|---|---|---|
| Creativity and memorability (30) | 22 | 25 | Single, clearly signposted feature; payoff in ≤ 10 s; Stage Mode reachable; messages must reveal new facts (AC11); no imitation of the reference build's stats card |
| Working AWS implementation (25) | 16 | 20 | Static "How this site is built" (F45) in R1; hourly canary and Budgets documented with screenshots; no broken internal link; freeze during judging; optional F21 makes the pub/sub punchline real |
| Communication quality (25) | 18 | 22 | Exact rubric headings, deliverables checklist, text captions for a text-only AI scorer, LLM dry run, short GIF |
| Portfolio completeness and usability (20) | 16 | 18 | Static-HTML content, WCAG 2.1.4 fix, no confusing modes, reduced R1 scope so polish time exists |
| **Total** | **72** | **85** | |

These are judgement calls, not measurements. Execution quality (real content, visual polish, a working drum on a cheap Android) will swing the result more than any line in the PRD. Top 50 of 1,401 is about the top 3.6%. At 85 the entry is plausibly in that band, not guaranteed.

---

## 2. Findings ranked by severity

Severity: **Critical** = can cost the gate or disqualify · **High** = several rubric points · **Medium** = a point or two, or a real cost or legal risk · **Low** = polish or consistency.

### Critical

**C1. R2 "score-maximisers during judging" is a false premise and a reliability risk.** *Applied.*
- *Evidence:* v1.0 header and §8 put F30, F31, F21, F32, F06 form, F34 and F40 on `main` during Nov 7–20. Deliverable D5 (the write-up) is submitted by 6 Nov and can't describe them. Rubric: "site loads during judging periods, core links work". The Official Rules on post-deadline changes are unknown to us.
- *Recommendation:* R2 = staging branch from 7 Nov, merged after winners are announced unless the rules allow earlier. Fixes only on `main` during judging. Anything that should score must be in R1 or a new R1s (stretch) tier.

**C2. Gate-1 machine legibility.** *Applied.*
- *Evidence:* F08 put all copy in `i18n/en.json` (JS-injected), so a scorer that fetches HTML without running JS would see an empty page. F41 headings didn't match the rubric names ("Completeness & usability" vs "Portfolio completeness and usability"; "Communication quality" was used as a label for learnings). Screenshots had no required text captions.
- *Recommendation:* EN content in static HTML (principle 9, §4.1 shared acceptance, AC12). Exact rubric headings, a D1–D6 checklist at the top, captions on every image, and an LLM dry run of the write-up (F41).

**C3. "One creative feature" diluted.** *Applied.*
- *Evidence:* F09 theme toggle (the organisers list "theme switcher" as an example creative feature), F07 Recruiter Mode toggle with an `R` shortcut, F32 AI chatbot, F16 404 drum fill, Stage Mode stats card. A rubric scorer asked to judge "the creative feature" could pick the wrong one or mark the entry as unfocused.
- *Recommendation:* principle 8. F09 becomes automatic theming with no switcher, the Recruiter Mode toggle moves to R2, F32 moves to R3/Won't, F16 stays in R2, and the stats card is cut.

### High

**H1. Cultural attribution.** *Applied.*
- *Evidence:* §3.1 cited "the *nkul* slit-drum tradition of the Beti peoples". The Beti are associated with the Centre/South regions, while Josue is from Bafoussam (West). Presented next to "Josue plays drums", it reads as his heritage. "The original long-distance messaging network" (02 §3, PRD §3.1) is an overclaim.
- *Recommendation:* regional framing by default. Name a specific tradition only with Josue's confirmation and a source, and credit it to its community. "One of the oldest" instead of "the original".

**H2. R1 AWS evidence gap and a broken R1 link.** *Applied.*
- *Evidence:* F14 (R1) linked to "How this site is built" and F20's punchline linked to F30. Both are `/how-it-works`, which was R2, so the link would 404 at submission. The canary (the only proof of "stays accessible") was R2, so it couldn't be screenshotted for the write-up.
- *Recommendation:* new **F45** static architecture page (R1 Must), canary moved to R1, F21 Drum Telegraph as the last R1s item.

**H3. Drum interaction: payoff and discoverability.** *Applied.*
- *Evidence:* the 16 patterns mapped to 8 messages produce duplicates, and collecting all 8 by chance takes about 22 phrases (coupon-collector). Stage Mode was gated behind a timing-based secret rhythm ("long-short-long"), which is unreliable on touch, collides with the 4-hit decode, and judges with 3–5 minutes would likely never see it. The punchline came at step 6. The hint opened a panel, which added a step.
- *Recommendation:* the drum section is always visible and the hint is a `#drum` link. Each phrase reveals the *next undecoded* message. The punchline is on the first card. Stage Mode unlocks by a button after 3 messages or by a shown tone-only phrase, and `?mode=stage` exists for judges. AC10 adds a 10-second test with 3 people.

**H4. Messages must reveal something new.** *Applied.*
- *Evidence:* the example messages ("Lead intern at DIGISOL", "3rd place, Dev War", "500-member community") repeat facts already in F04/F05. The rubric asks how well the feature "reflects you", and the brief says it "reveals something unique". One example ("I've played drums since …") contained a placeholder.
- *Recommendation:* AC11 requires at least 4 of 8 messages that aren't stated elsewhere on the page, all owner-confirmed, with no placeholders.

**H5. Over-scoped R1 for about 1.5 days.** *Applied.*
- *Evidence:* v1.0 R1 included full Stage Mode (re-skin, drum-kit pads, stats card, custom cursor), map animation, Recruiter Mode, three themes, a designed OG image and F44, with no timebox or buffer.
- *Recommendation:* trimmed R1, added an R1s stretch tier with a 17:00 WAT cut-off, a §8.1 timebox, and an internal submit target of 6 Nov 22:00 WAT.

### Medium

**M1. Accessibility conflicts with the WCAG 2.2 AA claim.** *Applied.* Global single-key shortcuts (`D`, `R`, and `F`/`J`) fail WCAG 2.1.4 unless they can be turned off or only work on focus. `Space` as a global drum key would hijack page scroll. Fix: keys work only while focus is in the drum, pads are buttons with accessible names, and the feature works with sound off (the iOS silent switch can mute Web Audio).

**M2. PII leak via "Download CV".** *Applied.* The source CV contains ID number, DOB and phone. F01's CTA invited uploading it. Fix: `cv.pdf` is exported from the site's print stylesheet (R1s), and the original is never uploaded. Added to §10.

**M3. Cost statements wrong.** *Applied.* A 15-minute canary is 2,880 runs/month × $0.0012 after the 100 free runs, about $3.3/month, which would trip the $1 Budgets alert (pricing verified on the CloudWatch pricing page). The PRD said "hard-capped by throttling and Budgets", but Budgets only alert. WAF (F39, and doc 01's mitigation) costs about $5/month per web ACL plus $1 per rule, above the $5 budget. Fix: hourly canary (about $0.74/month), corrected wording in §5, F39 and doc 01.

**M4. Untestable performance criterion.** *Applied.* AC7 asked for "30 ms tap-to-sound on mid-range Android". Android audio output latency is device-dependent and often higher. Replaced with ≤ 16 ms visual feedback on `pointerdown` and a ≤ 100 ms best-effort audio target.

**M5. Imitation of the reference build.** *Applied.* Doc 02 lists "plan → personality → hint → interaction → **stats card**" as the organisers' reference pattern to avoid. The PRD's Stage Mode had a stats card. It is cut.

**M6. AI chatbot vs "don't make up details about me".** *Applied.* Any hallucinated answer from F32 breaks the guide's core rule, adds abuse and cost risk, and competes with F20. Moved to R3 / Won't (hackathon).

**M7. Originality (D6) not tied to a feature.** *Applied.* The template pointed at `github.com/Joshua4-0p/portfolio`. If that repo or an earlier portfolio already exists and was published, it invites a D6 question. F33 now requires a new repo and a new Amplify app, and F41 requires an originality statement with dates.

**M8. Demo GIF size.** *Applied.* A 60–90 s GIF is tens of MB, which hurts the write-up page and may exceed upload limits. Now: GIF ≤ 15 s / ≤ 5 MB in R1, and video in R1s.

### Low

**L1. Build-time timestamp without a build step.** *Applied.* F14's "last-deployed timestamp (from build)" contradicts the no-build guide stack. It is now a manual last-updated date.

**L2. PR previews on a public repo.** *Applied (clarified).* Amplify allows PR previews on public repos only for apps that need no IAM service role. A static site qualifies, but any Amplify-managed backend would not. Verified in the Amplify docs. F33 now names a `staging` branch as the alternative.

**L3. Inconsistencies.** *Applied.*
- Uptime target "through 23 Nov" (§9) vs 30 Nov (§6, doc 01): set to 30 Nov.
- Doc 02 P1 "sub-2 s load" vs F11 LCP ≤ 2.5 s.
- Doc 02 P7 cited F41 as the screenshot pack; it is F42.
- F04 said "3–6 cards" but listed 7.
- F05 said "Cloud Club UB lead"; the source says "core team (onsite lead)".
- The IA's `/cv` route had no page behind it.

**L4. Brand vs domain.** *Applied (note).* "Josue.cloud" is used as the product name, but F34 (domain) is a Could. Noted as a working title, with the `amplifyapp.com` URL used for submission.

**L5. Lambda reserved concurrency.** *Applied by omission.* New accounts often have an account concurrency limit of 10, which leaves nothing to reserve. F21 relies on API Gateway throttling instead.

**L6. Bruno Simon award claim (doc 02 §1).** *Not applied.* "Site of the Month again in Jan 2026" is not supported by the cited URL, whose slug refers to a November award. I couldn't verify either version, so I left it. Verify it or delete it before quoting it anywhere.

**Verified correct, no change:**
- Time-zone math: 23:59 PST on 6 Nov = 07:59 UTC on 7 Nov = 08:59 WAT. US DST ended Sunday 1 Nov 2026. 7 Nov 2026 is a Saturday.
- Launch at 00:00 PDT = 08:00 WAT.
- 50 / 1,401 ≈ 3.6%.

---

## 3. Risks still open

| Risk | Why still open | Mitigation in place |
|---|---|---|
| Official Rules on post-deadline site changes and on editing the submission after it's sent | Not in the ground-truth text | Freeze `main` during judging; submit ~11 h early; read the rules before submitting (§10) |
| How the Gate-1 AI scorer works (reads the write-up only? fetches the site? runs JS? sees images?) | Unknown | Static HTML, text captions, exact rubric headings, LLM dry run |
| External links failing during judging (e.g. AfriPay on Vercel, Credly) | Outside AWS and our control | F04 link AC, repo + screenshot fallback, hourly canary covers the main URL only |
| Drum quality on low-end Android (audio latency, touch) | Only testable on a device | AC7 visual-first feedback, AC10 phone test |
| R1 still a tight 1.5 days | Depends on agent speed and content readiness | Timebox, R1s cut-off at 17:00 WAT, submit target 22:00 WAT |
| Cultural framing | Needs Josue's own judgement | Regional default; owner check in §3.1 |
| Amplify regional or service outage during judging | Outside our control | Canary alert gives early warning; repo can redeploy to a new app quickly, but the URL would change, so this is a last resort |

---

## 4. Questions for the entrant

1. **Drum tradition.** Is there a drum or messaging tradition from your own background (Bafoussam / the West region) you want to name? If not, are you happy with "inspired by the talking-drum traditions of Cameroon and West & Central Africa"?
2. **The 8 messages.** Which personal facts can we use? For example: how long you've played drums and guitar, what you draw, a story from Bafoussam or Dschang, why bilingual matters to you. At least 4 must not appear elsewhere on the site.
3. **Secret phrase.** Which 4-hit low/high phrase do you want for Stage Mode, and does it mean anything to you?
4. **Role title.** Is "Cloud & Full-Stack Engineer" how you want to be described, or e.g. "Cloud & Full-Stack Developer (student)"?
5. **Healthcare Information System.** Is this your project, what was your role, and can it be shown publicly?
6. **AfriPay.** Will the Vercel deployment stay up through 30 Nov?
7. **Repo and originality.** Is `Joshua4-0p` your GitHub handle? Have you published a portfolio site before? (The repo and Amplify app must be new.)
8. **Eligibility.** Is your Builder Center profile student-verified, and have you confirmed Cameroon is eligible under the Official Rules?
9. **Rules.** Do the Official Rules say anything about changing the site or the submission after the deadline?
10. **Photo.** Do you want a photo on the About section?
11. **Domain.** Do you own, or want to buy, `josue.cloud` (or similar)? It is not needed for the hackathon.
12. **Drum Telegraph (F21).** If built, it emails you every time someone sends a phrase (throttled). Are you OK with that inbox volume during judging?
