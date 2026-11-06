# 01 — Requirements Analysis
**AWS Student Builder Challenge: Build Your Tech Superpower**
Prepared for: Tiaya Fotseu Josue (entrant) · Date: 5 Nov 2026 · Status: v1.0 (pre-review)

Source documents:
- Hackathon page — https://builder.aws.com/build/hackathons/3bff5627-ef21-3bfc-acfc-fce21d39a4f6/aws-student-builder-challenge-build-your-tech-superpower
- Day-3 guide — "How to plan and build your portfolio" (Ana Cunha, AWS, 29 Oct 2026)
- Series: Day 1 *Create your AWS account*, Day 2 *Connect your coding agent*, Day 3 *Plan & build*, Day 4 *Deploy globally* (AWS Amplify Hosting)

---

## 1. The challenge in one sentence
Build and deploy an **original personal portfolio website on AWS (Amplify Hosting)** that tells your story, shows your skills and projects, and contains **one interactive creative feature, with a visible hint, that reveals something unique about you** without getting in the way of navigation.

## 2. Critical dates (time-zone converted for Buea, Cameroon — WAT, UTC+1)

| Milestone | Official | In Cameroon (WAT) | Note |
|---|---|---|---|
| Launch | 27 Oct 2026, 00:00 PDT | 27 Oct, 08:00 | — |
| **Submission deadline** | **6 Nov 2026, 23:59 PST** | **Sat 7 Nov, 08:59** | US DST ended 1 Nov, so PST = UTC-8 |
| Gate 1 (AI + human scoring) | Week of 9 Nov | — | Site **must be live** |
| Gate 2 (human judging, top 50) | Week of 16 Nov | — | Site **must be live** |
| Winners announced | Week of 23 Nov | — | Keep it live until then at least |

> ⚠️ **PM flag:** today is 5 Nov. The submission window closes in roughly 1.5 days. The feature spec (doc 03) is deliberately "telescopic", but it is sliced into a **Release 1 (submission-critical)** cut that must ship first. Never risk the deadline for a Tier-2/3 feature.

## 3. Eligibility & rules (hard gates — a miss = disqualification)

| # | Rule | Implication for us |
|---|---|---|
| R1 | Verified student, 18+, with a Builder Center profile | Confirm student verification on the Builder Center profile before submitting |
| R2 | Individual only, no teams, **one entry per person** | Submit once, and only when complete; AI agents are allowed (the guides encourage them) |
| R3 | Country / employee exclusions per Official Rules | Read the Rules page and confirm Cameroon is eligible |
| R4 | **Original portfolio, not published before** | New repo, new Amplify app; do not reuse an existing portfolio site |
| R5 | Hosted on AWS, built per the guides with **AWS Amplify Hosting** | Amplify Hosting is the primary host. Other AWS services are add-ons |

## 4. Mandatory submission contents (the six deliverables)

| # | Deliverable (verbatim intent) | Acceptance test we'll apply |
|---|---|---|
| D1 | Public portfolio on AWS at a live URL that **stays accessible through the judging window** | `*.amplifyapp.com` (or custom domain) returns 200 over HTTPS from 3 networks; uptime monitor on until 30 Nov |
| D2 | Three core sections: **About Me**, **Skills / Tech Superpowers**, **Projects or Achievements** (learning projects count) | Each section has an anchor, a nav link and real content, with nothing invented |
| D3 | **One creative feature** that works **without getting in the way of navigation** | Feature is opt-in, has a visible hint, can be skipped or exited, and works by keyboard and touch |
| D4 | Link to the **GitHub repository** | Public repo, linked from the site footer and from the submission |
| D5 | A project entered under "Your project" on the hackathon page that: describes the creative feature · shows **screenshots of the portfolio and the AWS setup** · **documents the AWS services used** · shares **what you learned and the challenges you hit** | Write-up uses one heading per rubric criterion. It includes at least 6 portfolio screenshots and at least 4 AWS console screenshots |
| D6 | Original, unpublished website | See R4 |

## 5. How we are judged (the scoring model)

**Gate 1 is AI + human scoring on the rubric, and only the top 50 advance.** About 1,401 participants entered, so about 3.6% pass Gate 1. The write-up and the site have to be **machine-legible** (clear headings, explicit rubric language, alt text) and also **memorable to a human**.

| Criterion | Weight | What the judges literally said | What wins it |
|---|---|---|---|
| **Creativity & memorability** | **30%** | "how distinctive your creative feature is and how well it reflects you" | A feature *nobody else can have*, rooted in your identity. Avoid the example ideas on the hackathon page, because hundreds of entrants will copy them |
| **Working AWS implementation** | **25%** | "site loads during the judging periods, core links work, and your AWS usage is documented" | Zero broken links, monitored uptime, and AWS services that are **documented** (architecture diagram, console screenshots, cost) |
| **Communication quality** | **25%** | "how clearly your project, screenshots, and write-up explain your process and what you learned" | A story-driven write-up structured by rubric, plus annotated screenshots, a short demo GIF and honest challenges |
| **Completeness & usability** | **20%** | "all three core sections, navigation works, content reads well on desktop and mobile" | Mobile-first, accessible, fast, with an obvious nav |

**Insight:** 50% of the score (AWS 25% + Communication 25%) is earned **outside** the creative feature, through reliability and documentation. Most student entrants under-invest there. That's our cheapest competitive advantage.

## 6. Implicit / hidden requirements (read between the lines)

1. **"Visible hint"** for the creative feature is explicit in both the brief and the guide. A hidden easter egg with no hint fails D3.
2. **"Doesn't get in the way"** means no splash screen that has to be played first, no forced audio, and no scroll-jacking.
3. **"Reflects you"**: the guide warns that a generic "developer portfolio" prompt produces a generic page. The content must come from a personal `plan.md`.
4. **"Only use what's in my plan and don't make up details"**: the guide's own prompt forbids invented content. Judges will notice fabricated skills.
5. **Desktop and mobile** are both judged, so the creative feature must work with **touch**.
6. **AWS usage documented** means the judges want evidence: console screenshots, a services list, and an architecture diagram.
7. **Guide stack = plain HTML/CSS/JS, no frameworks, no build step.** Following it lowers risk on Amplify and keeps Lighthouse scores high. Extra AWS services should be **progressive enhancements**: the site must still work if an API is down.
8. **Learning projects count**, so student coursework is valid Projects content.
9. **Tags:** use `#student-builders` (used across the series) in the project post.

## 7. Personal source material available (from CV, for `plan.md`)
Use these only after you confirm them. Never publish ID number, date of birth, phone, or home address.

- **Identity:** Tiaya Fotseu Josue, B.Eng Computer Engineering student (4th year), University of Buea, Cameroon. Born and schooled in Bafoussam and Dschang. Bilingual EN/FR (B2/B2).
- **Experience:** Software Developer Intern and Lead Intern at DIGISOL Group (IMS for clients); Full-Stack Intern at Codveda Technologies.
- **Projects:** AfriPay cross-border payments (Next.js/Node, Nkwa Pay, blockchain wallet, live on Vercel); Apache + SSL hardening + Nagios monitoring; microfinance customer segmentation (K-means); BDD with Cucumber; Healthcare Information System for Cameroon (cloud architecture; found on drive); DIGISOL IMS modules.
- **Achievements:** 3rd place, Dev War (Hustlers Community); Huawei badges (5G Basics, Cloud Computing, on Credly); React/React Native bootcamp (Tech Chantier).
- **Community:** AWS Cloud Club UB core team (onsite lead, 500+ member community moderator); AWS Community Day Cameroon volunteer; GDSC UB education team; Hult Prize UB organizing team.
- **Personality / fun-fact raw material:** **plays drums and guitar**, draws, music, creative writing and blogging. *(This is what the creative feature is built on. See doc 03.)*

## 8. Constraints & assumptions
- **Cost:** stay within AWS Free Tier and promotional credits. Set an AWS Budget alarm at $5. Any paid AI feature (Bedrock) needs hard rate limits.
- **Availability:** about 3 weeks of uptime (to 23 Nov+) with no maintenance window.
- **Connectivity:** Cameroon mobile networks can be slow. Fast first paint over 3G benefits judges and local users alike.
- **Assumption A1:** the user is the sole builder, supported by a coding agent (allowed).
- **Assumption A2:** custom domain is optional. The `amplifyapp.com` URL is acceptable.

## 9. Top risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Missing the deadline by over-scoping | High | Fatal | Release-1 cut-line in doc 03; submit by 6 Nov 22:00 WAT; after submission `main` takes fixes only (see doc 03 §8) |
| Site down or broken links during judging | Med | -25% | Static core, uptime canary, link checker in CI, no expiring links |
| Creative feature judged generic | Med | -30% | Identity-rooted concept (drums + Cameroon + cloud); avoid organiser-listed examples |
| Feature blocks navigation or fails on mobile | Med | DQ / -20% | Opt-in, skippable, touch + keyboard, tested at 360 px |
| Surprise AWS bill / abuse of AI endpoint | Low-Med | Med | Budgets alarm (alerts only, not a spending cap), API Gateway throttling, Bedrock token caps; WAF only if needed (about $5/month or more, above the budget) |
| Fabricated or inaccurate personal content | Low | High (trust) | Content sourced only from confirmed `plan.md` |
| Privacy leak (CV contains ID, DOB, phone) | Med | High | Explicit exclusion list in `plan.md` |
