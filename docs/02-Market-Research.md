# 02 — Market Research & Benchmarking
**What "the best portfolio in the world" looks like, and what pain points it solves**
Date: 5 Nov 2026 · Method: desk research (web), benchmark teardown, and synthesis against the hackathon rubric.

---

## 1. Benchmark set

| Benchmark | What it is | Why it's famous | Lesson we take | Lesson we avoid |
|---|---|---|---|---|
| **Bruno Simon** (bruno-simon.com) | 3D Three.js world where you drive a car between projects | Awwwards Developer Site of the Year 2019; Site of the Month again in Jan 2026 | A *playful mechanic* makes a portfolio unforgettable | Heavy WebGL, slow on low-end phones, and recruiters have to "play" to find content |
| **daedalOS** (Dustin Brett) | Full desktop OS in the browser: draggable windows, taskbar, start menu, deep links (`/?app=…`) | One of the most-starred portfolio repos on GitHub | **Deep links** into any state, and a strong single concept carried everywhere | Win98/OS desktops are now a cliché, and the hackathon itself lists the idea |
| **Henry Heffernan** | 3D room with a retro computer you can "use" | Viral; widely forked | Storytelling through a *personal object* | Forks look alike, so originality is lost |
| **Josh W. Comeau** | Whimsical, sound-reactive UI and tutorials | Best-in-class micro-interactions; respects `prefers-reduced-motion` | Delight in small details; **sound opt-in** with a visible toggle | — |
| **Lynn Fisher** | Portfolio redesigned every year, illustrated | Proves personality > template | Personal visual voice | — |
| **Terminal portfolios** (many) | `$ help`, `$ projects` | Easy to build | Power-user shortcut is nice as a *secondary* layer | Over-saturated: listed twice in the challenge examples |
| **Cloud Resume Challenge** sites | Static site + visitor counter (Lambda/DynamoDB) + CI/CD + IaC | The canonical "prove AWS skills" format | AWS depth that can be **shown** (counter, pipeline, IaC) | Visually generic; all look the same |
| **AI "Ask my résumé" bots** (Bedrock RAG) | Chat grounded in CV via Bedrock Knowledge Bases / Nova Micro | 2025-26 trend; several Builder Center articles | Answers recruiter questions instantly | Hallucination, cost abuse, generic if unbounded |
| **Ana Cunha's reference build** (Day-3 guide) | Retro pixel site, "Press Start", skateboard-girl fun fact, Star Wars section | It's the organisers' example | Exact pattern judges expect: plan → personality → hint → interaction → stats card | **Do not imitate it.** Judges have seen it many times |

Sources: Awwwards (sites/brunos-portfolio, Developer Award listings), Elementor and Hostinger portfolio roundups, daedalOS README, Muz.li 2026 list, dev.to Cloud Resume Challenge write-ups, Builder Center Bedrock résumé articles, uxdesign.cc on accessible animation. Full URL list in §6.

## 2. What hiring managers and judges actually need (pain points)

| # | Pain point (audience) | Evidence | Feature response (see doc 03) |
|---|---|---|---|
| P1 | **"I give a portfolio about 60 seconds."** (recruiter) | Multiple 2026 hiring guides say portfolios are filtered in about 60 s | F01 10-second hero, F07 Recruiter Mode, F11 LCP ≤ 2.5 s |
| P2 | **"Creative sites hide the content."** (recruiter) | Bruno-Simon-style critiques; hackathon rule D3 | Creative feature is opt-in and never gates content (F20 rules) |
| P3 | **"I can't verify skill claims."** (tech lead) | "Show real work"; progress bars are meaningless | F03 evidence-linked skills, F04 case studies with live + repo links |
| P4 | **"I can't tell what *you* did vs. the AI or tutorial."** (tech lead) | 2026: managers recognise unmodified AI repos | F40 build log, F04 "my role / decisions / trade-offs" blocks, honest README |
| P5 | **"Does it work on my phone?"** (everyone; judges score mobile) | Rubric 20% | F12 mobile-first, touch-playable feature |
| P6 | **"Show impact, not code."** (recruiter) | Recruiters rely on diagrams, metrics, write-ups | F04 outcome metrics, F30 architecture X-ray |
| P7 | **"Is the AWS work real?"** (AWS judges, 25%) | Rubric says "documented" | F45 "How this site is built" (F30 X-ray in R2), F31 live counter, F36 uptime/observability, F42 screenshot pack |
| P8 | **"I need to contact or shortlist you fast."** (recruiter) | Friction kills conversion | F06 one-click contact, F07 print/PDF CV, F13 rich LinkedIn previews |
| P9 | **Accessibility excluded users** (visitors with disabilities, slow networks) | WCAG 2.2, reduced-motion research | F10 a11y, F11 performance budget, text alternative for the creative feature |
| P10 | **Language barrier** (Francophone Africa and EU recruiters) | Cameroon is officially bilingual | F08 EN/FR toggle |
| P11 | **Students in my community lack portfolios** (the 500+ Cloud Club UB members) | Community role on CV | F54 open-source "Fork my portfolio" template |
| P12 | **Judges reviewing 1,400 entries suffer fatigue** (AI and human judges) | Gate-1 volume | F41 rubric-mapped write-up, 60-s demo GIF, consistent screenshots |

## 3. Competitive landscape inside this hackathon (prediction)
The challenge page lists example ideas: retro arcade toggle, scratch card, fortune cookie, project "levels", guess-my-tech mini-game, Superpower Vending Machine, Win98 desktop, command line, and neon/pastel/dark theme switcher. The guide adds flip cards, terminal, mini-game, and style switch.

**Prediction:** a large share of the 1,401 entrants will ship one of these, often prompted verbatim to a coding agent. Pixel-retro styling (copied from the reference build) and terminals will be the most common.

**Strategy:** score creativity through **identity**, not mechanics. The only thing no other entrant has is *Josue's own story*: a **Cameroonian drummer and guitarist who builds cloud systems**. This leads to the concept in doc 03: **"The Talking Drum"**. Cameroon's talking-drum traditions are one of the oldest long-distance messaging networks, and it maps directly onto cloud pub/sub messaging (SNS/SQS). It is personal, cultural, technical and playful at once, and it fits none of the organiser templates.

## 4. Best-in-class feature patterns distilled

1. **One unforgettable concept, executed everywhere** (Bruno, daedalOS), but as a *layer* on top of a fast, conventional site.
2. **A fast path for busy people** (recruiter mode, print CV, a 10-second hero).
3. **Proof over claims** (live demos, repos, metrics, diagrams).
4. **The site explains itself** ("how this site is built" pages are rare and impress technical judges).
5. **Opt-in sound with a visible mute toggle** (Comeau pattern).
6. **Deep links into states**, e.g. `?mode=drum` (daedalOS pattern). Judges can link straight to the feature.
7. **Progressive enhancement**: the core is static HTML, and the extras degrade gracefully.
8. **Accessibility as a feature**, not an afterthought (reduced motion, keyboard, contrast).
9. **Real AWS backends shown, not hidden** (Cloud Resume Challenge counter, CI/CD badge).
10. **A grounded AI assistant** with strict context and visible "sources".

## 5. Technology choices validated by research

| Need | Choice | Why |
|---|---|---|
| Frontend | Vanilla HTML, CSS, JS (guide-mandated) | Zero build risk, Lighthouse 95+, works on 3G |
| Sound | Web Audio API, **synthesised** drums (no audio files) | About 0 KB of assets, instant, no licensing issues |
| Hosting | **AWS Amplify Hosting**, Git-connected CI/CD | Required by the rules; global CDN; preview branches; custom headers |
| Dynamic APIs | API Gateway (HTTP API) + Lambda + DynamoDB (on-demand) | Free-tier friendly; Cloud Resume Challenge standard |
| AI assistant | Amazon Bedrock (Nova Micro or Claude Haiku) + Knowledge Base on S3, or a static-context prompt | Cheap; grounded; Guardrails available |
| Email | Amazon SES | Contact form delivery |
| Monitoring | CloudWatch Synthetics canary, CloudWatch RUM, AWS Budgets | Proves "stays accessible through the judging window" |
| IaC | AWS CDK (TypeScript) or Amplify Gen 2 backend | Shows engineering maturity |
| Performance targets | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (Google "good" thresholds) | Usability score |

## 6. Sources
- https://www.awwwards.com/sites/brunos-portfolio
- https://awwwards.com/bruno-simon-portfolio-wins-site-of-the-month-november.html
- https://www.awwwards.com/websites/winner_category_portfolio/
- https://elementor.com/blog/best-web-developer-portfolio-examples/
- https://www.hostinger.com/ca/tutorials/web-developer-portfolio/
- https://feed.muz.li/?p=200032
- https://cdn.jsdelivr.net/gh/DustinBrett/daedalOS@main/README.md
- https://www.github.com/QC20/selected-works-website
- https://rosetta.to/u/t3dotgg/web-dev-portfolios-that-blew-my-mind
- https://dev.to/getcraftly/how-to-build-a-developer-portfolio-that-gets-you-hired-in-2026-4oih
- https://mentorcruise.com/blog/how-to-build-a-portfolio-that-gets-hiring-managers-to-care/
- https://simeononsecurity.com/software-development-career-playbook/getting-started-in-software-development/building-a-developer-portfolio/
- https://devplaybook.cc/blog/developer-portfolio-checklist-20-things-hiring-managers
- https://dev.to/rabeea2100/i-built-my-cloud-resume-with-terraform-amplify-lambda-api-gateway-heres-how-4idd
- https://dev.to/aktran321/aws-cloud-resume-challenge-37md
- https://dev.to/prathamesh_gawade_16/i-built-an-ai-chatbot-into-my-portfolio-website-using-aws-bedrock-heres-exactly-how-1hj
- https://jeremylem.github.io/blogging/2026/01/11/Virtual_Me_RAG_Chatbot.html
- https://community.aws/content/2ZBSO9sud5G4ZLP2ggMpq5jFRLr/create-a-rag-cv-chatbot-using-bedrock-and-knowledge-bases
- https://uxdesign.cc/animated-sites-are-unique-but-not-always-accessible-5af54fefa092
- https://sagar-shrivas.vercel.app/blog/building-a-100-lighthouse-portfolio

*Caveat: most hiring-manager evidence comes from practitioner blogs (consistent, but anecdotal). Lighthouse claims in sources are self-reported.*
