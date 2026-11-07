**Live:** https://main.d2edrxdeaouf1j.amplifyapp.com   ·   **Repo:** https://github.com/Joshua4-0p/joshua.cloud-portfolio-website
**Try the creative feature:** https://main.d2edrxdeaouf1j.amplifyapp.com/#drum   ·   **Stage Mode:** https://main.d2edrxdeaouf1j.amplifyapp.com/?mode=stage
**How it's built (on the site):** https://main.d2edrxdeaouf1j.amplifyapp.com/how-it-works/

> **TL;DR.** A two-tone slit drum sits in the middle of my portfolio.
>
> Play four beats and a real AWS pipeline (Amazon API Gateway → AWS Lambda → Amazon DynamoDB + Amazon SNS → Amazon SQS and email) delivers the rhythm, and the drum answers with a message about me.
>
> Try it: https://main.d2edrxdeaouf1j.amplifyapp.com/#drum

I'm Tiaya Fotseu Josue, a Cloud & DevOps Engineer and Serverless Developer from Buea, Cameroon. I'm a 4th-year B.Eng Computer Engineering student at the University of Buea. I have played the drums since Lower Sixth. This portfolio turns that drum into a real AWS messaging system.

> 📷 **Upload image here!** → `demo.gif` (Demo: the hint, four drum hits, the message card with "Delivered via Amazon SNS", then Stage Mode)

*Demo (15 s, recorded on the live site): I click the hint, play four beats, the drum answers with a message, the card confirms "Delivered via Amazon SNS", and then the secret phrase ● ● ○ ● opens Stage Mode. A sharper MP4 is in the repo: `docs/submission/demo.mp4`.*

## Submission checklist

| Requirement | Where |
|---|---|
| **D1** Public portfolio on AWS at a live URL that stays up through judging | https://main.d2edrxdeaouf1j.amplifyapp.com, hosted on **AWS Amplify Hosting**. An hourly **Amazon CloudWatch Synthetics** canary checks it and alarms if it fails. |
| **D2** Three core sections: About Me, Skills / Tech Superpowers, Projects or Achievements | Nav links and anchors: [About](https://main.d2edrxdeaouf1j.amplifyapp.com/#about), [Superpowers](https://main.d2edrxdeaouf1j.amplifyapp.com/#superpowers), [Work](https://main.d2edrxdeaouf1j.amplifyapp.com/#work), plus Recognition and Community. Screenshots 02–06. All sections are static HTML and readable without JavaScript. |
| **D3** One creative feature that does not get in the way of navigation | **The Talking Drum** ([/#drum](https://main.d2edrxdeaouf1j.amplifyapp.com/#drum)). Visible hint in the hero: "The drum has a message for you — tap it". Opt-in, no splash screen, no forced sound, nav always works, Stage Mode exits with one button, any nav link, or Escape while the drum has focus. Works with mouse, touch and keyboard. Screenshots 07–09, 11 and the demo GIF. |
| **D4** Link to the GitHub repository | https://github.com/Joshua4-0p/joshua.cloud-portfolio-website (public), linked in the site footer and on /how-it-works/. |
| **D5** Screenshots of the portfolio and the AWS setup, AWS services documented, learnings and challenges | 12 portfolio screenshots, the architecture diagram, a demo GIF, and 8 AWS CLI captures of the live AWS setup (account ID and ARNs redacted), each with a caption. Services table with purpose and monthly cost under "Working AWS implementation". "What I learned" and "Challenges I hit" below. |
| **D6** Original, unpublished website | New repo created on 6 Nov 2026 at 06:24 UTC. New Amplify app, first deployed on 6 Nov 2026. See the originality statement under "Communication quality". |

## Creativity and memorability

**The Talking Drum** is a two-tone slit drum in the middle of my portfolio. It is inspired by the talking-drum and slit-drum traditions of Cameroon and West & Central Africa.

You play four beats: low ● and high ○. The drum answers with one of eight short messages about me. They are true things from my life: I drew cartoons and manga before I wrote code. My first code was C in Level 200. I grew up bilingual. There are eight to find.

**Why it reflects me.** I am a drummer. I started in Lower Sixth, and guitar came later, in Level 300 at the University of Buea. The first message the drum gives you is mine: "I started drumming in Lower Sixth. Years later I'm still sending messages, now they travel through the cloud." I build serverless and messaging systems on AWS. A talking drum was a publish/subscribe system long before the cloud: one drummer sends a rhythm, and every village in earshot receives it. So the punchline on the first card is: *Before SNS, there was the drum. Drummer = publisher, rhythm = message, villages = subscribers.*

**And the drum really publishes.** Every completed four-beat phrase is sent to a real AWS backend:

1. The browser POSTs the phrase to an **Amazon API Gateway** HTTP API.
2. An **AWS Lambda** function checks that it matches `^[LH]{4}$`, adds one to a counter in **Amazon DynamoDB**, and publishes to the **Amazon SNS** topic `drum-telegraph`.
3. SNS fans the rhythm out to two real subscribers (two "villages"):
   - the **Amazon SQS** queue `village-archive`, which keeps every rhythm;
   - my email inbox, capped at one email per minute by an SNS subscription filter policy.
4. The card then shows **"Delivered via Amazon SNS"**, with the message ID and the rhythm number.

The 3D drum shows this fan-out: a pulse travels to the archive, and the inbox lights up only when an email was really sent. The API returns `emailed: true` or `false`, so the picture never lies.

**The secret phrase ● ● ○ ● opens Stage Mode.** The page warms to copper, a groove plays if sound is on, and all eight messages unlock.

**The visible hint.** The hero says, in plain text: **"The drum has a message for you — tap it"**. It is a real link to `#drum`, visible above the fold on a phone and on a laptop.

**It stays out of the way of navigation:**
- No start screen, no loader, no scroll-jacking. The drum is one section of a normal page.
- Sound is off until you tap. It is synthesised with the Web Audio API, so there are no audio files.
- The 3D drum loads lazily. Low-memory devices and reduced-motion users get a static poster instead.
- Any nav link leaves Stage Mode. So does the "✕ Back to the quiet site" button, and the Escape key while focus is inside the drum section.
- The pads are real buttons. On a keyboard, focus the drum and press **F** (low) and **J** (high).
- If the API is down or blocked, the drum still answers instantly. Only the "Delivered" line is missing.

> 📷 **Upload image here!** → `01-hero-desktop.png` (Hero on desktop with the drum hint above the fold)

*01 — Hero on desktop (1440×900). My name, titles, the tagline "Before SNS, there was the drum.", the 3D drum, and the hint "The drum has a message for you — tap it" above the fold.*

> 📷 **Upload image here!** → `07-drum-section.png` (The drum section with two pads and the 3D slit drum)

*07 — The drum section. Two pads (low and high) and the 3D slit drum on a dark stage. The labels show the SNS topic and its two subscribers: my inbox (email) and the village archive (SQS).*

> 📷 **Upload image here!** → `08-message-delivered.png` (A decoded message card that says Delivered via Amazon SNS)

*08 — After one real phrase. The drum decoded a message, and the card confirms "Delivered via Amazon SNS" with the message ID and rhythm number.*

> 📷 **Upload image here!** → `09-stage-mode.png` (Stage Mode with the page warmed to copper)

*09 — Stage Mode (`?mode=stage`, or play ● ● ○ ●). All eight messages unlock. "✕ Back to the quiet site" exits.*

## Working AWS implementation

> 📷 **Upload image here!** → `00-architecture.png` (Architecture diagram: GitHub to Amplify Hosting for the site; browser to API Gateway, Lambda, DynamoDB and SNS, which fans out to SQS and email; CloudWatch Synthetics, alarms and Budgets for operations)

*Architecture. A GitHub push builds and deploys the static site on AWS Amplify Hosting (CloudFront). A drum phrase goes browser → API Gateway → Lambda → DynamoDB + SNS → SQS and email. A CloudWatch Synthetics canary, three CloudWatch alarms and AWS Budgets watch it all.*

### AWS services used

All backend infrastructure is code: **AWS CDK v2** (TypeScript) deploys one **AWS CloudFormation** stack, `TalkingDrumStack`, in us-east-1.

| AWS service | Purpose in this portfolio | Est. monthly cost |
|---|---|---|
| **AWS Amplify Hosting** | Git-connected CI/CD. Every push to `main` builds the Next.js static export and serves it over HTTPS through Amazon CloudFront, with custom security headers. | ~$0 (Free Tier at judging traffic) |
| **Amazon API Gateway** (HTTP API) | `GET /drum` (counter) and `POST /drum` (phrase). POST is throttled to 2 requests/s, burst 10. CORS allows only the site's origin (plus localhost for development). | ~$0 |
| **AWS Lambda** (Node.js 22, arm64, 128 MB) | Validates the phrase, updates the counter, publishes to SNS, returns `emailed`. Bad input gets a 400 and touches nothing. | ~$0 |
| **Amazon DynamoDB** (on-demand) | The "rhythms have crossed the cloud" counter, and the minute stamp for the email cap. | ~$0 |
| **Amazon SNS** | `drum-telegraph`: fans each rhythm out to SQS and email (filter policy, max 1 email/min). `ops-alerts`: delivers alarms to me. | ~$0 |
| **Amazon SQS** | `village-archive`: a subscriber queue that keeps every rhythm (SSE, 4-day retention). | ~$0 |
| **Amazon CloudWatch Synthetics** | Hourly canary loads the live site and checks for the hint text. | ~$0.74 (720 runs − 100 free) |
| **Amazon CloudWatch** (alarms, logs) | Three alarms (canary failing, Lambda errors, API 5xx) → `ops-alerts`. Lambda logs kept 2 weeks. | ~$0 (Free Tier) |
| **Amazon S3** | Canary artifacts, deleted after 7 days. | < $0.01 |
| **AWS Budgets** | $5 monthly cost budget, alerts at $1 and $5 (plus a forecast alert). Credits are excluded, so it really fires. | $0 |
| **AWS IAM** | Least-privilege roles: Lambda may only GetItem/UpdateItem on its table and publish to its topic. | $0 |
| **AWS CloudFormation** (via AWS CDK) | The whole backend in one reviewable, repeatable stack. | $0 |

**Total: under $1 a month** at judging traffic. Throttling caps the worst case, and Budgets alerts me early.

### Evidence from the stack (read-only)

Resources in the CloudFormation stack `TalkingDrumStack` (us-east-1), summarised from the synthesised CDK template (`cdk synth`); the counts match the deployed stack by construction. ARNs and the account ID are left out on purpose.

| Resource type | Count | What it is |
|---|---|---|
| AWS::ApiGatewayV2::Api / Stage / Integration | 1 / 1 / 1 | HTTP API, default stage with throttling, Lambda integration |
| AWS::ApiGatewayV2::Route | 2 | `GET /drum`, `POST /drum` |
| AWS::Lambda::Function | 1 | Drum function (Node.js 22, arm64) |
| AWS::Lambda::Permission | 2 | API Gateway may invoke the function (one per route) |
| AWS::DynamoDB::Table | 1 | Counter table, on-demand |
| AWS::SNS::Topic | 2 | `drum-telegraph`, `ops-alerts` |
| AWS::SNS::Subscription | 3 | SQS archive, email (filtered), ops email |
| AWS::SQS::Queue / QueuePolicy | 1 / 1 | `village-archive`, SNS may send to it |
| AWS::Synthetics::Canary | 1 | `drum-site-heartbeat`, rate(1 hour) |
| AWS::CloudWatch::Alarm | 3 | Canary failing, Lambda errors, API 5xx |
| AWS::Logs::LogGroup | 1 | Lambda logs, 2-week retention |
| AWS::S3::Bucket / BucketPolicy | 1 / 1 | Canary artifacts, 7-day lifecycle |
| AWS::IAM::Role / Policy | 2 / 1 | Lambda role, canary role, least-privilege Lambda policy |
| AWS::Budgets::Budget | 1 | `talking-drum-monthly`, $5 |

Live checks from my terminal on 7 Nov 2026:
- `curl -I` on the live site returns `200`, served by CloudFront, with all six security headers: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.
- `GET /drum` returns a small counter (16 when I checked, 7 Nov 2026).
- `POST /drum` with an invalid phrase returns `400`.

### Uptime monitoring and security

- **Uptime:** the CloudWatch Synthetics canary runs every hour against the live URL. It fails if the page is not `200` or the hint text is missing. A failure alarms to my `ops-alerts` SNS topic. Lambda errors and API 5xx errors alarm too. The hourly canary and alarms stay on through the judging window.
- **Security headers:** set in `customHttp.yml` at the repo root, which Amplify applies to every response. The Content-Security-Policy allows `connect-src` only to my API host.
- **Abuse limits:** API Gateway throttling (POST 2 rps / burst 10), a strict input regex, at most one email a minute, and a $5 budget alert.
- **No secrets** in the repo. No cookies, no trackers.

### AWS evidence: live CLI captures

These are real, read-only AWS CLI calls against the live setup in us-east-1, rendered as images. The account ID and every ARN are redacted. (There is no AWS 02: the security headers are shown by the `curl -I` check above.)

> 📷 **Upload image here!** → `aws-01-amplify.png` (AWS CLI capture of the Amplify app and its deploy jobs)

*AWS 01 — AWS CLI capture (read-only), AWS Amplify Hosting. `get-app` shows the `WEB` app on my GitHub repo with branch `main` at status `SUCCEED`. `list-jobs` shows the latest deploy jobs, every one `SUCCEED`.*

> 📷 **Upload image here!** → `aws-03-api-gateway.png` (AWS CLI capture of the API Gateway routes)

*AWS 03 — AWS CLI capture (read-only), Amazon API Gateway. The HTTP API has exactly two routes, `GET /drum` and `POST /drum`, and both go to the same Lambda integration.*

> 📷 **Upload image here!** → `aws-04-lambda.png` (AWS CLI capture of the Lambda function configuration)

*AWS 04 — AWS CLI capture (read-only), AWS Lambda. The drum function is `Active` on `nodejs22.x`, with 128 MB and a 3 s timeout. Its environment points at the DynamoDB table and the SNS topic (ARN redacted).*

> 📷 **Upload image here!** → `aws-05-dynamodb.png` (AWS CLI capture of the DynamoDB counter item)

*AWS 05 — AWS CLI capture (read-only), Amazon DynamoDB. The `drums` item holds the live counter (`count` 18 at capture time) and the `minute` stamp that limits email to one a minute.*

> 📷 **Upload image here!** → `aws-06-sns.png` (AWS CLI capture of the SNS topic subscriptions)

*AWS 06 — AWS CLI capture (read-only), Amazon SNS. The `drum-telegraph` topic has 2 subscriptions, `sqs` and `email`. Both have a subscription ARN (redacted) instead of `PendingConfirmation`, so both are confirmed.*

> 📷 **Upload image here!** → `aws-07-sqs.png` (AWS CLI capture of the SQS queue attributes)

*AWS 07 — AWS CLI capture (read-only), Amazon SQS. The `village-archive` queue holds 18 archived rhythms (`ApproximateNumberOfMessages`). It has SSE on, 4-day retention, and a policy that lets only SNS send to it.*

> 📷 **Upload image here!** → `aws-08-canary.png` (AWS CLI capture of the CloudWatch Synthetics canary runs)

*AWS 08 — AWS CLI capture (read-only), Amazon CloudWatch Synthetics. The `drum-site-heartbeat` canary shows 6 hourly runs in a row, all `PASSED`, on 7 Nov 2026.*

> 📷 **Upload image here!** → `aws-09-budgets.png` (AWS CLI capture of the AWS Budgets budgets)

*AWS 09 — AWS CLI capture (read-only), AWS Budgets. `talking-drum-monthly` is a $5 monthly cost budget (the other one is my account-wide budget).*

## Communication quality

### How I built it

I built this with Claude Code as a coding agent, and I made the product, content and design calls. The process:

1. **Content first.** I wrote `plan.md`: every fact on the site, the eight drum messages, the cultural framing, and a "never publish" list. The agent may not invent skills, numbers, roles or quotes.
2. **Spec → plan.** A written design spec, then an implementation plan split into tasks, with tests named up front.
3. **Agents per task.** A builder agent implemented each task, tests first. A separate reviewer agent checked each task, and again at the end of each phase.
4. **Audits → fixes → deploy.** Full audits (accessibility, security, cost, copy) produced fix lists. Each fix was verified, then pushed to Amplify and checked on the live URL.

### What the coding agent got wrong, and how it was fixed

**1. The first security headers silently did nothing.** The agent put `customHttp.yml` inside `web/`. In an Amplify monorepo, that file is ignored, and the build still says "success". The phase reviewer caught it. We moved the file to the repo root, under `applications` → `appRoot: web`, and verified every header with `curl -I` on the live URL. Lesson: a green build is not proof. Check the real response.

**2. The 3D drum told a small lie.** After I capped the email at one per minute, the 3D fan-out still lit "Josue's inbox" for every phrase, even when no email went out. We fixed it at the source: Lambda now returns `emailed: true/false`, and the inbox lights only when an email was really sent. The animation is now an honest picture of the system.

### Originality statement

This portfolio is new and was built for this challenge. The GitHub repo was created on **6 Nov 2026 at 06:24 UTC**. The Amplify app is new, and its first deploy ran on **6 Nov 2026**. No earlier portfolio site or code was reused. Design references were mood-board inspiration only. All text, artwork and photos are original or my own.

## What I learned

1. **Pub/sub clicked when I built it as a drum.** One publisher, many subscribers, and each subscriber gets its own rules. An SNS filter policy let the archive keep everything while my inbox gets one email a minute, without changing the publisher.
2. **Verify the deployed thing, not the config.** The headers file looked right and the build passed, but the headers were missing. Now I check live responses with `curl` and run an hourly canary.
3. **Cost control is a design decision.** API throttling, a strict input regex, an email cap and a budget alert keep this under $1 a month. I learned that AWS Budgets counts credits by default, so an alert can stay silent unless you exclude them.

## Challenges I hit

1. **Email flood risk.** Every phrase publishes to SNS. A busy day of judges playing the drum could have sent me hundreds of emails. *Fix:* Lambda stamps the current minute in DynamoDB with the same update that bumps the counter, and tags the SNS message `email=yes` only once a minute. The email subscription filters on that tag. SQS still receives every rhythm.
2. **A budget alert that would never fire.** By default, an AWS budget counts promotional credits. With credits on the account, real spend nets to $0, so the alert stays silent. A review caught this. *Fix:* `includeCredit: false` in the budget, deployed with CDK.
3. **Mobile performance missed my target.** I aimed for 90+ on mobile Lighthouse and measured **56** (median of 3 runs on the live site). All content is static HTML that renders without JavaScript, so the page is readable early (first contentful paint 1.7 s). But the 3D scene, a WebGL capability check and the motion layer (GSAP, Lenis) keep the phone's main thread busy after load. *What I did:* the 3D drum already loads lazily, and low-memory devices and reduced-motion users get a static poster instead. *What I measured next:* deferring the 3D scene, the WebGL check and the motion layer until the visitor's first interaction raised performance to **74** in local runs. It also broke 3 of my end-to-end tests, so I held it back rather than ship an untested change before the deadline. It is my next step.

## Portfolio completeness and usability

**Sections:** Hero → About → Superpowers (skills with evidence) → Work (six projects, each with a case study) → Recognition (certifications and awards) → Community (volunteering, talks, writing) → Contact. The core sections and the drum have nav links, every section has an anchor, and all content is in static HTML.

> 📷 **Upload image here!** → `02-about.png` (About section)

*02 — About: where I'm from, my studies, my work at DIGISOL Group and Cloud Builders Africa, what I'm building now, and a photo of me at an event stage.*

> 📷 **Upload image here!** → `03-superpowers.png` (Superpowers section)

*03 — Superpowers: skill groups (Cloud & Serverless on AWS, Security & Resilience, DevOps, Full-Stack and more), each tied to evidence.*

> 📷 **Upload image here!** → `04-work-list.png` (Work list)

*04 — Work: six projects in a list view (a grid on smaller screens), including the Healthcare Information System on AWS.*

> 📷 **Upload image here!** → `05-work-case-study.png` (An open project case study)

*05 — A project opened into its case study. Every project has a deep link (`#project-…`).*

> 📷 **Upload image here!** → `06-recognition-community.png` (Recognition section)

*06 — Recognition: AWS Certified Cloud Practitioner, 3rd place at Dev War, Huawei badges and a bootcamp. Community, talks and writing follow below it on the page.*

> 📷 **Upload image here!** → `10-mobile-hero.png` (Hero on a phone)

*10 — Hero on a phone (390×844). Name, titles, the tagline, and the drum hint, all above the fold.*

> 📷 **Upload image here!** → `11-mobile-drum.png` (The drum's 3D stage on a phone with the SNS fan-out labels)

*11 — The drum on a phone, right after one real phrase. The 3D stage shows the fan-out: the Amazon SNS topic and its two subscribers, my inbox (email) and the village archive (SQS). Above it is the live DynamoDB counter (21 rhythms at capture time).*

> 📷 **Upload image here!** → `12-how-it-works.png` (How it's built page)

*12 — The /how-it-works/ page explains the architecture on the site itself, with the same diagram.*

**Accessibility:** WCAG 2.2 AA is the target. Automated axe checks run in the end-to-end tests on the home page, /how-it-works/ and Stage Mode, at desktop and phone widths. The drum is fully playable by keyboard, every message is announced through an `aria-live` region, and "Read the messages" gives a text list of all of them. Sound is never needed to understand anything. `prefers-reduced-motion` turns off smooth scrolling, reveals, pulses and 3D animation.

Accessibility, best practices and SEO all score 100 on mobile. Performance is 56, and challenge 3 above explains why.

**Scores (mobile, Lighthouse, live URL, median of 3 runs, 6–7 Nov 2026):**

| Performance | Accessibility | Best practices | SEO |
|---|---|---|---|
| 56 | 100 | 100 | 100 |

Performance is the weak spot. See challenge 3 above for why, and for the fix I measured.

**Usability:** a menu button stays on screen on every device, and every section is one click away. It works on desktop and mobile, with mouse, touch and keyboard.

Thanks for reading, and play the drum: https://main.d2edrxdeaouf1j.amplifyapp.com/#drum

#student-builders
