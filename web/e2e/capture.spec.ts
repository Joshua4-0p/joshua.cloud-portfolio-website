// Submission screenshots + demo video, against the LIVE site only:
//   CAPTURE=1 BASE_URL=https://main.d2edrxdeaouf1j.amplifyapp.com npx playwright test e2e/capture.spec.ts --project=chromium
// Skipped by normal runs (playwright.config.ts testIgnore). Deliberately does NOT import ./fixtures: the demo sends
// exactly ONE real phrase (POST /drum emails the owner); every other POST is aborted in the browser.
import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { readFileSync, mkdirSync, copyFileSync } from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(__dirname, '../../docs/submission/screenshots');
const VIDEO = process.env.VIDEO_OUT ?? path.resolve(__dirname, '../test-results/demo.webm');
mkdirSync(OUT, { recursive: true });

test.describe.configure({ mode: 'serial', retries: 0 });
test.setTimeout(180_000);
test.skip(!process.env.BASE_URL, 'live site only');

const noPosts = (ctx: BrowserContext) => ctx.route('**/drum', (r) => (r.request().method() === 'POST' ? r.abort() : r.continue()));
const settle = async (page: Page, ms = 2500) => { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(ms); };
const shot = (page: Page, name: string) => page.screenshot({ path: path.join(OUT, `${name}.png`) });
const toSection = async (page: Page, sel: string) => {
  await page.mouse.move(2, 2);
  await page.evaluate((s) => document.querySelector(s)!.scrollIntoView({ block: 'start' }), sel);
  await settle(page);
};
const hit = async (page: Page, tones: string) => {
  for (const t of tones) { await page.getByRole('button', { name: t === 'L' ? 'Low drum' : 'High drum' }).click(); await page.waitForTimeout(380); }
};

test('architecture diagram as PNG', async ({ page }) => {
  const svg = readFileSync(path.resolve(__dirname, '../../docs/architecture.svg'), 'utf8');
  await page.setViewportSize({ width: 1240, height: 610 });
  await page.setContent(`<body style="margin:0;background:#0B0B0C">${svg.replace('<svg ', '<svg width="1240" height="610" ')}</body>`);
  await page.locator('svg').first().screenshot({ path: path.join(OUT, '00-architecture.png') });
});

test('desktop sections', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await noPosts(ctx);
  const page = await ctx.newPage();
  await page.goto('/'); await settle(page, 3500);
  await shot(page, '01-hero-desktop');
  for (const [sel, name] of [['#about', '02-about'], ['#superpowers', '03-superpowers'], ['#work', '04-work-list']] as const) {
    await toSection(page, sel); await shot(page, name);
  }
  const first = page.locator('#work details').first();
  await first.locator('summary').click();
  await page.evaluate(() => document.querySelector('#work details')!.scrollIntoView({ block: 'start' }));
  await page.mouse.move(2, 2); await settle(page, 1500); await shot(page, '05-work-case-study');
  await toSection(page, '#achievements'); await shot(page, '06-recognition-community');
  await toSection(page, '#drum'); await settle(page, 2500); await shot(page, '07-drum-section');
  await page.goto('/?mode=stage'); await settle(page, 1000);
  await toSection(page, '#drum'); await settle(page, 2500); await shot(page, '09-stage-mode');
  await page.goto('/how-it-works/'); await settle(page); await shot(page, '12-how-it-works');
  await ctx.close();
});

test('mobile', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await noPosts(ctx);
  const page = await ctx.newPage();
  await page.goto('/'); await settle(page, 3500); await shot(page, '10-mobile-hero');
  await page.goto('/#drum'); await settle(page, 3500); await shot(page, '11-mobile-drum');
  await ctx.close();
});

// The one real phrase: hero → hint → 4 hits (LHLH, real POST) → delivered card → secret phrase (POST aborted) → Stage Mode.
test('demo video + delivered screenshot', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: path.dirname(VIDEO), size: { width: 1280, height: 720 } } });
  let posts = 0;
  await ctx.route('**/drum', (r) => {
    if (r.request().method() !== 'POST') return r.continue();
    return ++posts === 1 ? r.continue() : r.abort();
  });
  const page = await ctx.newPage();
  await page.goto('/'); await settle(page, 2000);
  await page.getByRole('link', { name: /The drum has a message for you/ }).first().click();
  await page.waitForTimeout(1800);
  await hit(page, 'LHLH');
  await expect(page.getByText('Delivered via Amazon SNS')).toBeVisible({ timeout: 8000 });
  await page.waitForTimeout(1200);
  await page.getByTestId('message-card').scrollIntoViewIfNeeded();
  await shot(page, '08-message-delivered');
  await page.waitForTimeout(800);
  await hit(page, 'LLHL');
  await page.waitForTimeout(3000);
  const video = page.video()!;
  await ctx.close();
  copyFileSync(await video.path(), VIDEO);
  expect(posts).toBeLessThanOrEqual(2);
});

// Re-shoot only the two hero frames (no phrase, no POST): -g "hero shots".
test('hero shots', async ({ browser }) => {
  for (const [name, opts] of [
    ['01-hero-desktop', { viewport: { width: 1440, height: 900 } }],
    ['10-mobile-hero', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ] as const) {
    const ctx = await browser.newContext(opts);
    await noPosts(ctx);
    const page = await ctx.newPage();
    await page.goto('/'); await settle(page, 3500); await shot(page, name);
    await ctx.close();
  }
});
