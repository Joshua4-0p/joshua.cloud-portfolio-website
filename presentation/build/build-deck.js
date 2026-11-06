// Generates ../Josue-Portfolio-Feature-Strategy.pptx
// Run: NODE_PATH=./node_modules node build-deck.js   (from this folder)
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

const OUT = path.join(__dirname, "..", "Josue-Portfolio-Feature-Strategy.pptx");

const THEME = {
  name: "Talking Drum",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1A1033", lt1: "FFFFFF", dk2: "3A2A63", lt2: "F3F0F9",
    accent1: "F2A33A", accent2: "E2553A", accent3: "138F82", accent4: "7A5CFA",
    accent5: "9BD21E", accent6: "6B6480", hlink: "7A5CFA", folHlink: "3A2A63",
  },
};
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Josue.cloud — Portfolio Feature Strategy";
pres.author = "Tiaya Fotseu Josue";
pres.subject = "AWS Student Builder Challenge";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const W = 13.333, M = 0.6, CW = W - 2 * M;

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "TITLE_DARK",
  background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 2.3, w: 7.6, h: 2.0, fontSize: 48, bold: true, color: C.background1, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: M, y: 4.4, w: 7.4, h: 1.2, fontSize: 20, color: C.background2, valign: "top", align: "left", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "SECTION_DARK",
  background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 3.0, w: 8.0, h: 1.2, fontSize: 44, bold: true, color: C.background1, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: M, y: 4.2, w: 8.0, h: 0.8, fontSize: 20, color: C.background2, valign: "top", align: "left", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: C.background1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.4, w: CW, h: 0.9, fontSize: 36, bold: true, color: C.text1, valign: "middle", align: "left", margin: 0 }, text: "" } },
    { text: { text: "Josue.cloud · Portfolio feature strategy · AWS Student Builder Challenge", options: { x: M, y: 7.0, w: 8, h: 0.3, fontSize: 10, color: C.accent6, margin: 0 } } },
  ],
  slideNumber: { x: W - M - 0.6, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: C.accent6, align: "right" },
});

// ---------- helpers ----------
let n = 0;
const nm = (p) => `${p}-${++n}`;
function T(slide, text, opts) {
  slide.addText(text, { isTextBox: true, objectName: nm("text"), fontSize: 14, color: C.text1, valign: "top", ...opts });
}
function box(slide, opts) {
  slide.addShape(opts.shape || pres.shapes.ROUNDED_RECTANGLE, { objectName: nm("shape"), rectRadius: 0.08, line: { type: "none" }, ...opts });
}
const ICONS = {};
async function renderIcon(key, Comp, hex) {
  const svg = renderToStaticMarkup(React.createElement(Comp, { color: "#" + hex, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  ICONS[key] = "image/png;base64," + buf.toString("base64");
}
function iconCircle(slide, key, x, y, d, fill) {
  slide.addShape(pres.shapes.OVAL, { objectName: nm("icon-bg"), x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" } });
  const p = d * 0.24;
  slide.addImage({ objectName: nm("icon"), data: ICONS[key], x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
}
function rings(slide, cx, cy, radii, color, transparency) {
  radii.forEach((r, i) =>
    slide.addShape(pres.shapes.OVAL, { objectName: nm("ring"), x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { type: "none" }, line: { color, width: 1.5, transparency: transparency + i * 12 } }));
}
const content = (title, section) => { const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section }); s.addText(title, { placeholder: "title" }); return s; };
const bullets = (items, o = {}) => items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 6, ...o } }));

async function main() {
  const iconList = {
    drum: fa.FaDrum, cloud: fa.FaCloud, github: fa.FaGithub, globe: fa.FaGlobeAfrica, layers: fa.FaLayerGroup,
    star: fa.FaStar, check: fa.FaCheckCircle, file: fa.FaFileAlt, user: fa.FaUserTie, robot: fa.FaRobot,
    code: fa.FaCode, users: fa.FaUsers, mobile: fa.FaMobileAlt, access: fa.FaUniversalAccess, eye: fa.FaEye,
    keyboard: fa.FaKeyboard, volume: fa.FaVolumeMute, wifi: fa.FaWifi, feather: fa.FaFeatherAlt, link: fa.FaLink,
    shield: fa.FaShieldAlt, chart: fa.FaChartLine, bullhorn: fa.FaBullhorn, palette: fa.FaPalette, rocket: fa.FaRocket,
    clock: fa.FaClock, search: fa.FaSearch, flag: fa.FaFlagCheckered,
  };
  for (const [k, Comp] of Object.entries(iconList)) await renderIcon(k, Comp, "FFFFFF");
  await renderIcon("drumAmber", fa.FaDrum, HEX.dk1);

  // 1 ── Title
  pres.addSection({ title: "Opening" });
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Opening" });
  T(s, "AWS STUDENT BUILDER CHALLENGE · PRODUCT STRATEGY", { x: M, y: 1.6, w: 8, h: 0.4, fontSize: 14, bold: true, color: C.accent1, charSpacing: 2, margin: 0 });
  s.addText("Before SNS, there was the drum", { placeholder: "title" });
  s.addText("Feature strategy for Josue.cloud: a portfolio built to finish among 5 winners out of 1,401 entrants", { placeholder: "body" });
  T(s, "Tiaya Fotseu Josue · University of Buea, Cameroon · 5 Nov 2026 · v1.1 (reviewed)", { x: M, y: 6.4, w: 8, h: 0.4, fontSize: 12, color: C.background2, margin: 0 });
  rings(s, 10.4, 3.75, [1.55, 2.05, 2.55], HEX.accent1, 30);
  s.addShape(pres.shapes.OVAL, { objectName: "drum-disc", x: 9.3, y: 2.65, w: 2.2, h: 2.2, fill: { color: C.accent1 }, line: { type: "none" } });
  s.addImage({ objectName: "drum-icon", data: ICONS.drumAmber, x: 9.75, y: 3.1, w: 1.3, h: 1.3 });
  s.addNotes("Positioning: we compete on identity (a Cameroonian drummer who builds cloud messaging systems) and prove it with visible AWS engineering. The deck is a pre-read; every slide carries one message.");

  // 2 ── Exec summary
  s = content("Win on identity, then prove it on AWS", "Opening");
  const pts = [
    ["Creativity · 30%", "The Talking Drum: a feature only a Cameroonian drummer turned cloud engineer could build."],
    ["AWS + Communication · 50%", "Show the cloud, don't hide it: a \"How this site is built\" page, uptime monitoring, a rubric-mapped write-up."],
    ["Usability · 20%", "A 60-second recruiter path that is bilingual, accessible and fast on 3G."],
  ];
  pts.forEach(([h, b], i) => {
    const y = 1.75 + i * 1.6;
    s.addShape(pres.shapes.OVAL, { objectName: nm("num"), x: M, y, w: 0.6, h: 0.6, fill: { color: C.accent4 }, line: { type: "none" } });
    T(s, String(i + 1), { x: M, y, w: 0.6, h: 0.6, fontSize: 20, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0 });
    T(s, h, { x: 1.45, y: y - 0.05, w: 5.8, h: 0.4, fontSize: 18, bold: true, margin: 0 });
    T(s, b, { x: 1.45, y: y + 0.38, w: 5.8, h: 0.9, fontSize: 15, color: C.text2, margin: 0 });
  });
  const stats = [["1,401", "entrants in the challenge"], ["3.6%", "advance past Gate 1 (top 50)"], ["50%", "of the score is earned outside the creative feature"]];
  stats.forEach(([v, l], i) => {
    const y = 1.6 + i * 1.7;
    box(s, { x: 7.8, y, w: 4.93, h: 1.5, fill: { color: C.background2 } });
    T(s, v, { x: 8.1, y: y + 0.15, w: 2.2, h: 1.2, fontSize: 44, bold: true, color: C.accent2, valign: "middle", fontFace: THEME.headFontFace, margin: 0 });
    T(s, l, { x: 10.3, y: y + 0.15, w: 2.25, h: 1.2, fontSize: 14, color: C.text2, valign: "middle", margin: 0 });
  });
  s.addNotes("Three bets mapped to the four rubric criteria. The key insight: AWS implementation plus communication is half the score and is the cheapest place to beat other students.");

  // 3 ── Section: challenge
  pres.addSection({ title: "The challenge" });
  s = pres.addSlide({ masterName: "SECTION_DARK", sectionTitle: "The challenge" });
  T(s, "01", { x: M, y: 1.8, w: 2, h: 1.1, fontSize: 60, bold: true, color: C.accent1, fontFace: THEME.headFontFace, margin: 0 });
  s.addText("The challenge", { placeholder: "title" });
  s.addText("What the judges require, and what they reward", { placeholder: "body" });
  rings(s, 11.0, 3.75, [1.2, 1.7, 2.2], HEX.accent1, 40);

  // 4 ── Six deliverables
  s = content("Six deliverables gate every entry", "The challenge");
  const dels = [
    ["cloud", "D1 · Live AWS URL", "Loads over HTTPS on Amplify Hosting and stays up through winners week (23 Nov)"],
    ["layers", "D2 · Three core sections", "About Me · Tech Superpowers · Projects or Achievements (learning projects count)"],
    ["drum", "D3 · One creative feature", "Interactive and working, with a visible hint, and never blocks navigation"],
    ["github", "D4 · GitHub repository", "Public repo, linked from the site footer and from the submission"],
    ["file", "D5 · Project write-up", "Creative feature, portfolio + AWS screenshots, services used, learnings and challenges"],
    ["star", "D6 · Original site", "New repo, new Amplify app, never published before. One entry per person"],
  ];
  dels.forEach(([ic, h, b], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * 4.1, y = 1.65 + row * 2.6;
    box(s, { x, y, w: 3.85, h: 2.35, fill: { color: C.background2 } });
    iconCircle(s, ic, x + 0.3, y + 0.3, 0.7, i === 2 ? C.accent2 : C.accent4);
    T(s, h, { x: x + 1.15, y: y + 0.35, w: 2.55, h: 0.6, fontSize: 17, bold: true, valign: "middle", margin: 0 });
    T(s, b, { x: x + 0.3, y: y + 1.15, w: 3.3, h: 1.1, fontSize: 14, color: C.text2, margin: 0 });
  });
  s.addNotes("Missing any of these six means disqualification, whatever the quality. D3 is the creative-feature rule: it is opt-in, has a hint, and never gets in the way of navigation.");

  // 5 ── Rubric chart
  s = content("Half the score lives outside the feature", "The challenge");
  s.addChart(pres.charts.BAR, [{ name: "Weight", labels: ["Creativity & memorability", "Working AWS implementation", "Communication quality", "Completeness & usability"], values: [30, 25, 25, 20] }], {
    objectName: "rubric-chart", x: M, y: 1.6, w: 6.6, h: 5.0, barDir: "bar", catAxisOrientation: "maxMin",
    chartColors: [HEX.accent2, HEX.accent4, HEX.accent4, HEX.accent3], showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0"%"',
    dataLabelFontSize: 14, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: HEX.dk1, catAxisLabelFontSize: 14, catAxisLabelFontFace: "+mn-lt", valAxisHidden: true, valAxisMaxVal: 35,
    valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 60,
    showTitle: true, title: "Judging rubric weight", titleFontSize: 14, titleColor: HEX.accent6, titleFontFace: "+mn-lt",
  });
  const wins = [
    ["Creativity", "Identity-rooted concept no one else can copy"],
    ["AWS", "Zero broken links, hourly uptime canary, documented services"],
    ["Communication", "Exact rubric headings, captioned screenshots, demo GIF, LLM dry run"],
    ["Usability", "Mobile-first, keyboard-complete, under 200 KB first load"],
  ];
  T(s, "How we win each criterion", { x: 7.7, y: 1.6, w: 5.0, h: 0.5, fontSize: 18, bold: true, margin: 0 });
  wins.forEach(([h, b], i) => {
    const y = 2.25 + i * 1.08;
    T(s, [{ text: h + "  ", options: { bold: true, color: C.accent2 } }, { text: b, options: { color: C.text2 } }], { x: 7.7, y, w: 5.0, h: 0.95, fontSize: 15, margin: 0 });
  });
  s.addNotes("Gate 1 is AI plus human scoring on this rubric. Most students over-invest in the creative feature and under-invest in proof and documentation.");

  // 6 ── Timeline
  s = content("The deadline: Saturday 08:59 in Buea", "The challenge");
  const tl = [
    ["27 Oct", "Launch", "Guides drop Day 1–4"],
    ["6 Nov 23:59 PST", "Submission closes", "= Sat 7 Nov, 08:59 WAT"],
    ["Week of 9 Nov", "Gate 1", "AI + human scoring, top 50 advance"],
    ["Week of 16 Nov", "Gate 2", "AWS expert panel"],
    ["Week of 23 Nov", "Winners", "5 winners announced"],
  ];
  s.addShape(pres.shapes.LINE, { objectName: "timeline", x: M + 0.3, y: 3.1, w: CW - 0.6, h: 0, line: { color: HEX.accent6, width: 2 } });
  tl.forEach(([d, h, b], i) => {
    const cx = M + 0.3 + i * ((CW - 0.6) / 4);
    const hot = i === 1;
    s.addShape(pres.shapes.OVAL, { objectName: nm("milestone"), x: cx - 0.22, y: 2.88, w: 0.44, h: 0.44, fill: { color: hot ? C.accent2 : C.accent4 }, line: { color: HEX.lt1, width: 3 } });
    const x = Math.min(Math.max(cx - 1.2, M), W - M - 2.4);
    T(s, d, { x, y: 1.95, w: 2.4, h: 0.7, fontSize: 15, bold: true, color: hot ? C.accent2 : C.text1, align: "center", valign: "bottom", margin: 0 });
    T(s, h, { x, y: 3.55, w: 2.4, h: 0.4, fontSize: 17, bold: true, align: "center", margin: 0 });
    T(s, b, { x, y: 3.95, w: 2.4, h: 0.7, fontSize: 14, color: C.text2, align: "center", margin: 0 });
  });
  box(s, { x: M, y: 5.15, w: CW, h: 1.4, fill: { color: C.text1 } });
  iconCircle(s, "clock", M + 0.35, 5.45, 0.8, C.accent2);
  T(s, [{ text: "The site is judged live for three weeks.  ", options: { bold: true, color: C.accent1 } }, { text: "Uptime monitoring and link checks are scoring features, not ops hygiene. Submit by Fri 22:00 WAT, then main takes fixes only.", options: { color: C.background1 } }],
    { x: M + 1.45, y: 5.3, w: CW - 1.8, h: 1.1, fontSize: 16, valign: "middle", margin: 0 });
  s.addNotes("US daylight saving ended on 1 Nov, so the deadline is PST (UTC-8). That's 07:59 UTC, or 08:59 in Cameroon on Saturday 7 Nov.");

  // 7 ── Section: research
  pres.addSection({ title: "Research" });
  s = pres.addSlide({ masterName: "SECTION_DARK", sectionTitle: "Research" });
  T(s, "02", { x: M, y: 1.8, w: 2, h: 1.1, fontSize: 60, bold: true, color: C.accent1, fontFace: THEME.headFontFace, margin: 0 });
  s.addText("Research", { placeholder: "title" });
  s.addText("What the best portfolios in the world teach us", { placeholder: "body" });
  rings(s, 11.0, 3.75, [1.2, 1.7, 2.2], HEX.accent1, 40);

  // 8 ── Benchmarks table
  s = content("Every famous portfolio owns one idea", "Research");
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text1 } } });
  const rowsB = [
    ["Bruno Simon", "Drive a 3D car between projects", "One playful mechanic = unforgettable", "Heavy WebGL; content behind gameplay"],
    ["daedalOS", "A full desktop OS in the browser", "Deep links into any state", "OS desktops are now a cliché"],
    ["Josh W. Comeau", "Whimsical, sound-reactive UI", "Opt-in sound; respects reduced motion", "—"],
    ["Cloud Resume Challenge", "Static site + Lambda counter + CI/CD", "Visible, verifiable AWS depth", "Generic look"],
    ["\"Ask my résumé\" bots", "Bedrock RAG over the CV", "Instant answers for recruiters", "Hallucination, cost abuse"],
    ["Organiser reference build", "Pixel retro + skateboard fun fact", "Plan → hint → reveal pattern", "Imitation: judges know it by heart"],
  ];
  s.addTable([[hdr("Benchmark"), hdr("Signature idea"), hdr("What we take"), hdr("What we avoid")],
    ...rowsB.map((r, i) => r.map((c, j) => ({ text: c, options: { bold: j === 0, fill: { color: i % 2 ? HEX.lt1 : HEX.lt2 } } })))], {
    objectName: "benchmark-table", x: M, y: 1.6, w: CW, colW: [2.7, 3.3, 3.2, 2.93], fontSize: 14, color: HEX.dk1, rowH: 0.68,
    border: { type: "none" }, valign: "middle", margin: [0.05, 0.12, 0.05, 0.12],
  });
  s.addNotes("Sources: Awwwards, the daedalOS README, Elementor and Hostinger roundups, dev.to Cloud Resume Challenge write-ups, and Builder Center Bedrock articles. Full list in docs/02-Market-Research.md.");

  // 9 ── Pain points
  s = content("Six pain points we must solve", "Research");
  const pains = [
    ["clock", "Recruiter", "\"I give a portfolio 60 seconds.\"", "10-second hero + printable CV"],
    ["eye", "Recruiter", "\"Creative sites hide the content.\"", "Opt-in drum; navigation is never blocked"],
    ["search", "Tech lead", "\"I can't verify skill claims.\"", "Evidence-linked skills, real case studies"],
    ["robot", "Tech lead", "\"Did you build it, or did the AI?\"", "Build log, decisions and trade-offs"],
    ["cloud", "AWS judge", "\"Is the AWS work real?\"", "\"How this site is built\" page, canary, console shots"],
    ["mobile", "Everyone", "\"Phone? French? 3G?\"", "Mobile-first, EN/FR, under 200 KB"],
  ];
  pains.forEach(([ic, who, q, a], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * 4.1, y = 1.6 + row * 2.65;
    box(s, { x, y, w: 3.85, h: 2.4, fill: { color: C.background2 } });
    iconCircle(s, ic, x + 0.3, y + 0.3, 0.6, C.accent4);
    T(s, who.toUpperCase(), { x: x + 1.05, y: y + 0.35, w: 2.6, h: 0.5, fontSize: 12, bold: true, color: C.accent6, valign: "middle", charSpacing: 1, margin: 0 });
    T(s, q, { x: x + 0.3, y: y + 1.0, w: 3.3, h: 0.65, fontSize: 16, italic: true, bold: true, color: C.text1, margin: 0 });
    T(s, "→ " + a, { x: x + 0.3, y: y + 1.65, w: 3.3, h: 0.65, fontSize: 14, color: C.accent3, bold: true, margin: 0 });
  });
  s.addNotes("Twelve pain points are catalogued in the research doc; these six carry most of the rubric weight.");

  // 10 ── Saturation matrix
  s = content("Hundreds will copy the examples", "Research");
  const mx = M + 0.5, my = 1.6, mw = 6.6, mh = 4.7;
  box(s, { shape: pres.shapes.RECTANGLE, x: mx, y: my, w: mw, h: mh, fill: { color: C.background2 } });
  box(s, { shape: pres.shapes.RECTANGLE, x: mx + mw / 2, y: my, w: mw / 2, h: mh / 2, fill: { color: C.accent1, transparency: 75 } });
  s.addShape(pres.shapes.LINE, { objectName: "axis-x", x: mx, y: my + mh, w: mw, h: 0, line: { color: HEX.dk1, width: 1.5, endArrowType: "triangle" } });
  s.addShape(pres.shapes.LINE, { objectName: "axis-y", x: mx, y: my, w: 0, h: mh, line: { color: HEX.dk1, width: 1.5, beginArrowType: "triangle" } });
  T(s, "More distinctive →", { x: mx, y: my + mh + 0.08, w: mw, h: 0.35, fontSize: 12, color: C.accent6, align: "right", margin: 0 });
  T(s, "Reflects Josue →", { x: M - 0.55, y: my + mh / 2 - 0.2, w: 1.9, h: 0.35, fontSize: 12, color: C.accent6, rotate: 270, align: "center", margin: 0 });
  T(s, "WINNING ZONE", { x: mx + mw / 2 + 0.15, y: my + 0.1, w: 3, h: 0.3, fontSize: 12, bold: true, color: C.accent2, margin: 0 });
  const dots = [
    ["Win98 desktop · arcade · vending machine", 0.13, 0.15, C.accent6],
    ["Cloud terminal", 0.24, 0.45, C.accent6],
    ["Sketchbook doodles", 0.66, 0.6, C.accent4],
    ["Guitar fretboard", 0.73, 0.75, C.accent4],
    ["The Talking Drum", 0.86, 0.9, C.accent2],
  ];
  dots.forEach(([label, fx, fy, col], i) => {
    const d = i === 4 ? 0.42 : 0.28;
    const cx = mx + fx * mw, cy = my + mh - fy * mh;
    s.addShape(pres.shapes.OVAL, { objectName: nm("dot"), x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: col }, line: { type: "none" } });
    const lw = 2.6, right = cx + d / 2 + 0.1 + lw <= mx + mw;
    T(s, label, { x: right ? cx + d / 2 + 0.1 : cx - d / 2 - 0.1 - lw, y: cy - 0.2, w: lw, h: 0.4, fontSize: i === 4 ? 15 : 13, bold: i === 4, align: right ? "left" : "right", valign: "middle", margin: 0 });
  });
  T(s, "Prediction", { x: 8.2, y: 1.6, w: 4.5, h: 0.45, fontSize: 18, bold: true, margin: 0 });
  T(s, "Most of the 1,401 entrants will prompt a coding agent with an organiser example. Terminals and pixel-retro clones of the reference build will dominate.", { x: 8.2, y: 2.1, w: 4.5, h: 1.7, fontSize: 15, color: C.text2, margin: 0 });
  T(s, "Strategy", { x: 8.2, y: 4.0, w: 4.5, h: 0.45, fontSize: 18, bold: true, margin: 0 });
  T(s, "Compete on identity, not mechanics. Nobody else is a Cameroonian drummer who builds cloud messaging systems.", { x: 8.2, y: 4.5, w: 4.5, h: 1.5, fontSize: 15, color: C.text2, margin: 0 });
  s.addNotes("Positions are a qualitative judgement from the concept scoring in the PRD (section 3.6).");

  // 11 ── Section: product
  pres.addSection({ title: "The product" });
  s = pres.addSlide({ masterName: "SECTION_DARK", sectionTitle: "The product" });
  T(s, "03", { x: M, y: 1.8, w: 2, h: 1.1, fontSize: 60, bold: true, color: C.accent1, fontFace: THEME.headFontFace, margin: 0 });
  s.addText("The product", { placeholder: "title" });
  s.addText("Josue.cloud: the features, the architecture, the release plan", { placeholder: "body" });
  rings(s, 11.0, 3.75, [1.2, 1.7, 2.2], HEX.accent1, 40);

  // 12 ── Personas
  s = content("Five audiences, five time budgets", "The product");
  const per = [
    ["robot", "Gate-1 AI scorer", "Seconds", "Finds every rubric criterion, explicitly evidenced"],
    ["cloud", "AWS judge", "3–5 min", "Plays the drum, smiles, opens \"How this site is built\""],
    ["user", "Recruiter", "60 s", "Name, top projects and contact without friction"],
    ["code", "Tech lead", "5–10 min", "Case studies, repo, IaC, honest trade-offs"],
    ["users", "Cloud Club student", "Ongoing", "Forks the template, follows the build log"],
  ];
  const pw = (CW - 4 * 0.25) / 5;
  per.forEach(([ic, h, t, b], i) => {
    const x = M + i * (pw + 0.25);
    box(s, { x, y: 1.6, w: pw, h: 5.0, fill: { color: i === 1 ? C.text1 : C.background2 } });
    const dark = i === 1;
    iconCircle(s, ic, x + pw / 2 - 0.45, 1.95, 0.9, dark ? C.accent1 : C.accent4);
    T(s, h, { x: x + 0.15, y: 3.05, w: pw - 0.3, h: 0.7, fontSize: 17, bold: true, align: "center", valign: "middle", color: dark ? C.background1 : C.text1, margin: 0 });
    T(s, t, { x: x + 0.15, y: 3.8, w: pw - 0.3, h: 0.7, fontSize: 26, bold: true, align: "center", valign: "middle", color: dark ? C.accent1 : C.accent2, fontFace: THEME.headFontFace, margin: 0 });
    T(s, b, { x: x + 0.2, y: 4.7, w: pw - 0.4, h: 1.6, fontSize: 14, align: "center", color: dark ? C.background2 : C.text2, margin: 0 });
  });
  s.addNotes("The AWS judge is highlighted because Gate 2 decides the winners. Every feature must serve at least one of these five time budgets.");

  // 13 ── Concept
  s = content("The talking drum: the first pub/sub", "The product");
  T(s, "Across Cameroon and West & Central Africa, talking drums carried messages between villages by imitating the tones of speech. Josue plays drums. Visitors play a drum to send a message and get back a hidden truth about him, then the punchline lands:", { x: M, y: 1.6, w: 5.3, h: 2.3, fontSize: 16, color: C.text2, margin: 0 });
  T(s, "\"Before SNS, there was the drum.\"", { x: M, y: 4.0, w: 5.3, h: 0.8, fontSize: 24, italic: true, bold: true, color: C.accent2, fontFace: THEME.headFontFace, margin: 0 });
  T(s, "Content check: the framing stays regional. A specific tradition is named only if Josue confirms it and can credit its community.", { x: M, y: 5.9, w: 5.3, h: 0.6, fontSize: 12, color: C.accent6, italic: true, margin: 0 });
  const mapRows = [
    [["drum", "Drummer"], ["bullhorn", "Rhythm"], ["globe", "Villages"]],
    [["user", "Publisher"], ["layers", "SNS topic"], ["users", "Subscribers"]],
  ];
  T(s, "TRADITION", { x: 6.4, y: 1.75, w: 6.3, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 1, margin: 0 });
  T(s, "AWS", { x: 6.4, y: 4.15, w: 6.3, h: 0.3, fontSize: 12, bold: true, color: C.accent4, charSpacing: 1, margin: 0 });
  mapRows.forEach((row, r) => {
    const y = r === 0 ? 2.15 : 4.55;
    row.forEach(([ic, label], c) => {
      const x = 6.4 + c * 2.2;
      box(s, { x, y, w: 1.85, h: 1.5, fill: { color: r === 0 ? C.text1 : C.background2 } });
      iconCircle(s, ic, x + 0.6, y + 0.18, 0.65, r === 0 ? C.accent1 : C.accent4);
      T(s, label, { x: x + 0.05, y: y + 0.9, w: 1.75, h: 0.45, fontSize: 15, bold: true, align: "center", color: r === 0 ? C.background1 : C.text1, margin: 0 });
      if (c < 2) s.addShape(pres.shapes.LINE, { objectName: nm("arrow"), x: x + 1.9, y: y + 0.75, w: 0.3, h: 0, line: { color: HEX.accent6, width: 2, endArrowType: "triangle" } });
    });
  });
  T(s, "= same pattern", { x: 6.4, y: 3.72, w: 6.3, h: 0.35, fontSize: 13, italic: true, color: C.accent6, align: "center", margin: 0 });
  s.addNotes("The concept unites three identities: Cameroon, drummer, cloud engineer. The pub/sub analogy turns a fun fact into proof of technical understanding, and in R2 it becomes a real SNS demo (the Drum Telegraph).");

  // 14 ── Interaction flow
  s = content("From hint to Stage Mode in a minute", "The product");
  const steps = [
    ["See the hint", "\"The drum has a message for you: tap it\" (a plain #drum link)"],
    ["Reach the drum", "Always-visible section: low (F) and high (J) pads"],
    ["Play 4 hits", "Synthesised tones; the phrase shows as ● ○ notation"],
    ["Message decoded", "Next of 8 hidden facts; card 1 carries the punchline"],
    ["Stage Mode", "Unlocks after 3 messages (or the secret phrase)"],
    ["Punchline", "\"Before SNS…\" → links to How this site is built"],
  ];
  const sw = (CW - 5 * 0.2) / 6;
  steps.forEach(([h, b], i) => {
    const x = M + i * (sw + 0.2);
    box(s, { x, y: 1.75, w: sw, h: 3.6, fill: { color: i === 4 ? C.text1 : C.background2 } });
    const dark = i === 4;
    s.addShape(pres.shapes.OVAL, { objectName: nm("step"), x: x + sw / 2 - 0.35, y: 2.0, w: 0.7, h: 0.7, fill: { color: dark ? C.accent1 : C.accent2 }, line: { type: "none" } });
    T(s, String(i + 1), { x: x + sw / 2 - 0.35, y: 2.0, w: 0.7, h: 0.7, fontSize: 22, bold: true, color: dark ? C.text1 : C.background1, align: "center", valign: "middle", margin: 0 });
    T(s, h, { x: x + 0.12, y: 2.9, w: sw - 0.24, h: 0.65, fontSize: 16, bold: true, align: "center", valign: "middle", color: dark ? C.accent1 : C.text1, margin: 0 });
    T(s, b, { x: x + 0.15, y: 3.6, w: sw - 0.3, h: 1.6, fontSize: 14, align: "center", color: dark ? C.background2 : C.text2, margin: 0 });
  });
  box(s, { x: M, y: 5.65, w: CW, h: 0.95, fill: { color: C.background2 } });
  iconCircle(s, "flag", M + 0.25, 5.8, 0.65, C.accent3);
  T(s, [{ text: "Exit any time:  ", options: { bold: true } }, { text: "✕ leaves Stage Mode, as do Esc inside the drum and any nav link. Progress (\"3 / 8 messages decoded\") invites exploration without forcing it.", options: { color: C.text2 } }],
    { x: M + 1.15, y: 5.7, w: CW - 1.4, h: 0.85, fontSize: 15, valign: "middle", margin: 0 });
  s.addNotes("Deep links /#drum (works without JS) and ?mode=stage let judges jump straight in and make screenshots reproducible. Stage Mode is a CSS theme swap with a short on-stage message; the playable skills drum kit (F24) comes in R2. Phrases are tone-only, because timing detection is unreliable on touch.");

  // 15 ── Guardrails
  s = content("The feature can never cost us points", "The product");
  const guards = [
    ["link", "Never blocks navigation", "Always-visible section; no modal, splash screen or scroll-jacking"],
    ["keyboard", "Keyboard + touch + mouse", "Pads are buttons; F/J only while focus is in the drum; ≥ 44 px"],
    ["access", "Screen-reader alternative", "\"Read the messages\" text list; aria-live announcements"],
    ["eye", "Reduced-motion safe", "Static visuals under prefers-reduced-motion"],
    ["volume", "No autoplay sound", "Audio only after a gesture; persistent mute toggle"],
    ["clock", "10-second test", "3 first-time visitors decode a message within 10 s on a phone"],
    ["feather", "Featherweight, offline-safe", "≤ 25 KB JS, synthesised audio, no API needed"],
    ["rocket", "Deep links", "/#drum works without JS; ?mode=stage for judges"],
  ];
  guards.forEach(([ic, h, b], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * 6.15, y = 1.6 + row * 1.28;
    iconCircle(s, ic, x, y + 0.08, 0.75, col ? C.accent3 : C.accent4);
    T(s, h, { x: x + 0.95, y, w: 4.9, h: 0.45, fontSize: 17, bold: true, margin: 0 });
    T(s, b, { x: x + 0.95, y: y + 0.45, w: 4.9, h: 0.6, fontSize: 14, color: C.text2, margin: 0 });
  });
  s.addNotes("These are acceptance criteria AC-H1 and AC1–AC12 in PRD section 3.4. They protect both rule D3 and the 20% usability score. Keys are scoped to the drum to meet WCAG 2.1.4 (no global single-key shortcuts).");

  // 16 ── Pillars
  s = content("45 features across six pillars", "The product");
  const pillars = [
    ["drum", "4", "Signature creative", "Talking Drum, Superpowers drum kit, Village Wall, Rhythm Map", C.accent2],
    ["layers", "7", "Core content", "10-second hero, evidence-linked skills, case studies, timeline", C.accent4],
    ["access", "9", "Usability & a11y", "Print CV, EN/FR, automatic themes, WCAG 2.2 AA, performance budget", C.accent3],
    ["cloud", "11", "AWS proof", "Amplify CI/CD, security headers, hourly canary, Drum Telegraph (SNS)", C.accent4],
    ["bullhorn", "6", "Communication", "Rubric-mapped write-up, How this site is built, screenshots, README, GIF", C.accent2],
    ["rocket", "8", "Vision (R3)", "Fork-my-portfolio template for 500+ students, PWA, mini CMS", C.accent3],
  ];
  pillars.forEach(([ic, num, h, b, col], i) => {
    const c = i % 3, r = Math.floor(i / 3);
    const x = M + c * 4.1, y = 1.6 + r * 2.6;
    box(s, { x, y, w: 3.85, h: 2.35, fill: { color: C.background2 } });
    iconCircle(s, ic, x + 0.3, y + 0.3, 0.7, col);
    T(s, num, { x: x + 2.55, y: y + 0.15, w: 1.1, h: 0.9, fontSize: 40, bold: true, color: col, align: "right", fontFace: THEME.headFontFace, margin: 0 });
    T(s, h, { x: x + 0.3, y: y + 1.05, w: 3.3, h: 0.4, fontSize: 17, bold: true, margin: 0 });
    T(s, b, { x: x + 0.3, y: y + 1.45, w: 3.3, h: 0.85, fontSize: 14, color: C.text2, margin: 0 });
  });
  s.addNotes("Full catalogue with descriptions, pain points, rubric mapping, MoSCoW priority and release in PRD section 4.");

  // 17 ── Architecture
  s = content("Static core, cloud superpowers on top", "The product");
  const node = (label, sub, x, y, w, h, dashed, dark) => {
    box(s, { x, y, w, h, fill: { color: dark ? C.text1 : C.background2 }, line: dashed ? { color: HEX.accent4, width: 1.5, dashType: "dash" } : { type: "none" } });
    T(s, [{ text: label, options: { bold: true, breakLine: !!sub } }, ...(sub ? [{ text: sub, options: { fontSize: 12, color: dark ? C.background2 : C.text2 } }] : [])],
      { x: x + 0.1, y, w: w - 0.2, h, fontSize: 15, align: "center", valign: "middle", color: dark ? C.background1 : C.text1, margin: 0 });
  };
  const arrow = (x, y, w, h) => s.addShape(pres.shapes.LINE, { objectName: nm("arrow"), x, y, w, h, line: { color: HEX.accent6, width: 1.75, endArrowType: "triangle" } });
  node("GitHub repo", "push → Amplify CI/CD", 3.1, 1.6, 3.0, 0.85);
  arrow(4.6, 2.45, 0, 0.45);
  node("Visitor", "desktop · phone · 3G", M, 2.9, 1.9, 1.0);
  arrow(2.5, 3.4, 0.6, 0);
  node("Amplify Hosting", "CloudFront CDN · HTTPS · headers", 3.1, 2.9, 3.0, 1.0, false, true);
  arrow(6.1, 3.4, 0.55, 0);
  node("Static core", "HTML · CSS · JS · drum", 6.65, 2.9, 2.6, 1.0);
  arrow(4.6, 3.9, 0, 0.5);
  node("API Gateway (HTTP API)", "throttled · optional extras", 3.1, 4.4, 3.0, 0.85, true);
  const svc = [["SNS", "Drum Telegraph · R1s"], ["DynamoDB", "visitor counter · R2"], ["SES", "contact form · R2"], ["Bedrock", "Ask Josue · R3"]];
  svc.forEach(([l, sub], i) => {
    const x = M + i * 2.2;
    node(l, sub, x, 5.75, 2.0, 0.85, true);
  });
  s.addShape(pres.shapes.LINE, { objectName: "fan", x: M + 1.0, y: 5.5, w: 6.6, h: 0, line: { color: HEX.accent6, width: 1.5 } });
  s.addShape(pres.shapes.LINE, { objectName: "fan-stem", x: 4.6, y: 5.25, w: 0, h: 0.25, line: { color: HEX.accent6, width: 1.5 } });
  [0, 1, 2, 3].forEach((i) => arrow(M + 1.0 + i * 2.2, 5.5, 0, 0.25));
  box(s, { x: 9.75, y: 1.6, w: 2.98, h: 5.0, fill: { color: C.text1 } });
  iconCircle(s, "shield", 9.98, 1.8, 0.6, C.accent1);
  T(s, "Ops & guardrails", { x: 10.7, y: 1.8, w: 1.95, h: 0.6, fontSize: 16, bold: true, color: C.background1, valign: "middle", margin: 0 });
  T(s, bullets(["Hourly CloudWatch Synthetics canary → SNS alert", "AWS Budgets alerts at $1 / $5 (alerts, not caps)", "Security headers via customHttp.yml", "AWS CDK infrastructure as code (R2)", "≈ $0–1 / month for R1"]),
    { x: 10.0, y: 2.6, w: 2.55, h: 3.1, fontSize: 14, color: C.background2, margin: 0 });
  T(s, "Solid = R1 · dashed = later", { x: 10.0, y: 6.0, w: 2.55, h: 0.4, fontSize: 12, color: C.accent1, margin: 0 });
  s.addNotes("If every API dies, the portfolio still works 100%. All dynamic features call the API with a 3-second timeout and a static fallback.");

  // 18 ── Release plan
  s = content("Ship the cut-line, freeze, then grow", "The product");
  const rel = [
    ["R1 · Must ship", "Submit by Fri 6 Nov, 22:00 WAT", ["Hero + three core sections", "Talking Drum + Stage Mode", "Auto themes, a11y, performance", "Amplify, headers, Budgets, hourly canary", "\"How this site is built\" page", "README, screenshots, GIF, write-up"], C.accent2, true],
    ["R1s · Stretch", "Only if done before Fri 17:00", ["Print CV + sanitised cv.pdf", "Designed share image", "Message map wave", "Demo video", "Drum Telegraph (SNS), last"], C.accent1, false],
    ["R2 · Post-submission", "Staging from 7 Nov; live after winners", ["Architecture X-ray", "Visitor counter", "EN/FR toggle, Recruiter Mode", "Superpowers drum kit", "CDK, custom domain, build log"], C.accent4, false],
    ["R3 · Vision", "After 23 Nov", ["Fork-my-portfolio template", "Ask Josue (Bedrock)", "Village Wall + Rhythm Map", "JSON content + mini CMS", "PWA, RUM, WAF"], C.accent3, false],
  ];
  const rw = (CW - 3 * 0.25) / 4;
  rel.forEach(([h, d, items, col, dark], i) => {
    const x = M + i * (rw + 0.25);
    box(s, { x, y: 1.6, w: rw, h: 5.0, fill: { color: dark ? C.text1 : C.background2 } });
    T(s, h, { x: x + 0.25, y: 1.8, w: rw - 0.5, h: 0.45, fontSize: 18, bold: true, color: dark ? C.accent1 : col, margin: 0 });
    T(s, d, { x: x + 0.25, y: 2.25, w: rw - 0.5, h: 0.6, fontSize: 13, italic: true, color: dark ? C.background2 : C.accent6, margin: 0 });
    T(s, bullets(items), { x: x + 0.25, y: 2.95, w: rw - 0.5, h: 3.5, fontSize: 14, color: dark ? C.background1 : C.text1, margin: 0 });
  });
  s.addNotes("The write-up is fixed at submission, so only R1 (and any R1s that ships) is scored. From submission until winners are announced, main takes fixes only. R2 waits on a staging branch, unless the Official Rules explicitly allow post-deadline changes.");

  // 19 ── Risks
  s = content("Risks we are designing around", "The product");
  const risks = [
    ["Over-scoping misses the deadline", "Fatal", "Hard R1 cut-line; submit by Fri 22:00 WAT (11 h buffer)"],
    ["Site down or broken links in judging", "−25%", "Static core, hourly canary, main frozen to fixes only"],
    ["Playful extras blur \"one creative feature\"", "−30%", "Everything playful lives inside the drum; no theme switcher"],
    ["Feature blocks nav or fails on mobile", "DQ risk", "Always visible, skippable, touch + keyboard, 360 px tests"],
    ["Surprise bill or endpoint abuse", "Cost", "Budgets alerts, API throttling, no Bedrock in scope"],
    ["Privacy leak from CV data", "Trust", "Never publish ID, date of birth, phone or address; no original CV"],
  ];
  s.addTable([[hdr("Risk"), hdr("Impact"), hdr("Mitigation")],
    ...risks.map((r, i) => r.map((c, j) => ({ text: c, options: { bold: j !== 2, color: j === 1 ? HEX.accent2 : HEX.dk1, fill: { color: i % 2 ? HEX.lt1 : HEX.lt2 } } })))], {
    objectName: "risk-table", x: M, y: 1.6, w: CW, colW: [4.6, 1.4, 6.13], fontSize: 15, color: HEX.dk1, rowH: 0.7,
    border: { type: "none" }, valign: "middle", margin: [0.05, 0.15, 0.05, 0.15],
  });
  s.addNotes("Impact is expressed as the rubric weight at risk. Full register in docs/01-Requirements-Analysis.md section 9 and docs/04-Review-Report.md.");

  // 20 ── Metrics
  s = content("How we will know we are winning", "The product");
  const mets = [["Top 50", "pass Gate 1 out of 1,401"], ["≥ 95", "Lighthouse score in all 4 categories (mobile)"], ["100%", "hourly uptime checks passed through 30 Nov"], ["10 s", "for a first-time visitor to decode a message"], ["≤ 2", "clicks to contact from any state"]];
  const mw2 = (CW - 4 * 0.25) / 5;
  mets.forEach(([v, l], i) => {
    const x = M + i * (mw2 + 0.25);
    box(s, { x, y: 1.9, w: mw2, h: 2.6, fill: { color: i === 0 ? C.text1 : C.background2 } });
    T(s, v, { x: x + 0.1, y: 2.1, w: mw2 - 0.2, h: 1.2, fontSize: 44, bold: true, align: "center", valign: "middle", color: i === 0 ? C.accent1 : C.accent2, fontFace: THEME.headFontFace, margin: 0 });
    T(s, l, { x: x + 0.2, y: 3.35, w: mw2 - 0.4, h: 1.0, fontSize: 14, align: "center", color: i === 0 ? C.background2 : C.text2, margin: 0 });
  });
  box(s, { x: M, y: 4.9, w: CW, h: 1.7, fill: { color: C.background2 } });
  iconCircle(s, "check", M + 0.3, 5.35, 0.8, C.accent3);
  T(s, [{ text: "Definition of done:  ", options: { bold: true } }, { text: "student verified · live HTTPS URL on phone and desktop · three sections in static HTML · drum passes the 10-second test · new public repo · no private data · links checked · Budgets + canary on · 6+ portfolio and 4+ AWS screenshots, captioned · write-up passes an LLM rubric dry run", options: { color: C.text2 } }],
    { x: M + 1.35, y: 5.0, w: CW - 1.6, h: 1.5, fontSize: 15, valign: "middle", margin: 0 });
  s.addNotes("The full checklist is PRD section 10. Engagement metrics such as the drum open rate need analytics (F51), so they are measured after judging.");

  // 21 ── Review
  s = content("What the independent review changed", "The product");
  const rv = [
    ["Releases", "R2 shipped live during judging", "Main frozen; R2 goes live after winners, since the write-up can't change"],
    ["Focus", "Theme switcher, chatbot, stats card", "One creative feature: everything playful lives in the drum"],
    ["AWS proof", "Footer linked to an R2 page", "Static \"How this site is built\" page + hourly canary in R1"],
    ["Drum UX", "Timing-based secret rhythm, global keys", "Tone-only phrases, keys scoped to the drum, 10-second test"],
  ];
  rv.forEach(([h, a, b], i) => {
    const y = 1.6 + i * 1.25;
    T(s, h, { x: M, y, w: 1.7, h: 1.05, fontSize: 16, bold: true, color: C.accent4, valign: "middle", margin: 0 });
    box(s, { x: 2.4, y, w: 3.4, h: 1.05, fill: { color: C.background2 } });
    T(s, a, { x: 2.6, y, w: 3.0, h: 1.05, fontSize: 14, color: C.accent6, valign: "middle", margin: 0 });
    s.addShape(pres.shapes.LINE, { objectName: nm("arrow"), x: 5.9, y: y + 0.52, w: 0.45, h: 0, line: { color: HEX.accent6, width: 2, endArrowType: "triangle" } });
    box(s, { x: 6.45, y, w: 3.55, h: 1.05, fill: { color: C.background2 } });
    T(s, b, { x: 6.65, y, w: 3.2, h: 1.05, fontSize: 14, bold: true, color: C.text1, valign: "middle", margin: 0 });
  });
  box(s, { x: 10.35, y: 1.6, w: 2.38, h: 4.75, fill: { color: C.text1 } });
  T(s, "Rubric estimate", { x: 10.5, y: 1.85, w: 2.1, h: 0.4, fontSize: 14, bold: true, color: C.background2, align: "center", margin: 0 });
  T(s, "72", { x: 10.5, y: 2.35, w: 2.1, h: 0.9, fontSize: 40, bold: true, color: C.accent6, align: "center", valign: "middle", fontFace: THEME.headFontFace, margin: 0 });
  T(s, "v1.0", { x: 10.5, y: 3.2, w: 2.1, h: 0.35, fontSize: 12, color: C.background2, align: "center", margin: 0 });
  T(s, "85", { x: 10.5, y: 3.8, w: 2.1, h: 1.0, fontSize: 54, bold: true, color: C.accent1, align: "center", valign: "middle", fontFace: THEME.headFontFace, margin: 0 });
  T(s, "v1.1 / 100", { x: 10.5, y: 4.8, w: 2.1, h: 0.35, fontSize: 12, color: C.background2, align: "center", margin: 0 });
  T(s, "Judgement, not measurement", { x: 10.5, y: 5.5, w: 2.1, h: 0.6, fontSize: 11, italic: true, color: C.background2, align: "center", margin: 0 });
  s.addNotes("A second agent reviewed the PRD as an ex-hackathon judge and senior PM. Full findings in docs/04-Review-Report.md; every change is listed in the PRD change log.");

  // 22 ── Next steps
  pres.addSection({ title: "Next steps" });
  s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Next steps" });
  T(s, "BETWEEN NOW AND FRIDAY 22:00 WAT", { x: M, y: 0.7, w: 8, h: 0.4, fontSize: 14, bold: true, color: C.accent1, charSpacing: 2, margin: 0 });
  T(s, "Ship R1, then let the drum speak", { x: M, y: 1.15, w: 11, h: 0.9, fontSize: 40, bold: true, color: C.background1, fontFace: THEME.headFontFace, margin: 0 });
  const nx = [
    ["Tonight: confirm plan.md", "8 drum messages, cultural framing, job title, projects; new repo + Amplify app"],
    ["Fri 08:00–13:00: build", "Static site first, then the Talking Drum; pass the 10-second test"],
    ["Fri 13:00–17:00: guard", "Security headers, Budgets, hourly canary, How-it's-built page, link check"],
    ["Fri 17:00–22:00: document", "Captioned screenshots, GIF, rubric write-up, LLM dry run"],
    ["Fri 22:00: submit", "Then freeze main to fixes only; R2 waits on staging"],
  ];
  nx.forEach(([h, b], i) => {
    const y = 2.45 + i * 0.88;
    s.addShape(pres.shapes.OVAL, { objectName: nm("num"), x: M, y, w: 0.6, h: 0.6, fill: { color: C.accent1 }, line: { type: "none" } });
    T(s, String(i + 1), { x: M, y, w: 0.6, h: 0.6, fontSize: 20, bold: true, color: C.text1, align: "center", valign: "middle", margin: 0 });
    T(s, [{ text: h + "   ", options: { bold: true, color: C.background1 } }, { text: b, options: { color: C.background2 } }], { x: 1.45, y, w: 8.2, h: 0.6, fontSize: 16, valign: "middle", margin: 0 });
  });
  rings(s, 11.65, 4.6, [0.8, 1.15, 1.5], HEX.accent1, 30);
  s.addShape(pres.shapes.OVAL, { objectName: "drum-disc-end", x: 11.05, y: 4.0, w: 1.2, h: 1.2, fill: { color: C.accent1 }, line: { type: "none" } });
  s.addImage({ objectName: "drum-icon-end", data: ICONS.drumAmber, x: 11.3, y: 4.25, w: 0.7, h: 0.7 });
  s.addNotes("Timebox from PRD section 8.1. The decisions needed from Josue are the open questions in docs/04-Review-Report.md: drum messages, cultural framing, title, HIS role, GitHub account, eligibility, rules on post-deadline edits, photo and domain.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
}
main().catch((e) => { console.error(e); process.exit(1); });
