import { test, expect, blockApi } from './fixtures';
import type { Browser } from '@playwright/test';

const POSTER = 'img[src="/images/drum-poster.webp"]';
// The default fixture pins the poster path (see fixtures.ts); these tests opt back in to the real gate.
// SwiftShader renders WebGL on the CPU: these tests get triple time, and close the page (stopping its render loop) before
// the context, because a context close with a busy WebGL page could hang past the timeout.
const open3D = async (browser: Browser, opts = {}) => {
  test.slow();
  const ctx = await browser.newContext(opts); await blockApi(ctx, { with3D: true });
  // Pin a capable device so a 2-core / low-memory runner doesn't silently turn these into poster tests.
  await ctx.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'hardwareConcurrency', { get: () => 8 });
    Object.defineProperty(Navigator.prototype, 'deviceMemory', { get: () => 8 });
  });
  const page = await ctx.newPage();
  return { ctx, page, close: async () => { await page.close(); await ctx.close(); } };
};

test('reduced motion: posters only, no WebGL canvas', async ({ browser }) => {
  const { page, close } = await open3D(browser, { reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator(`#hero ${POSTER}`)).toBeVisible();
  await page.goto('/#drum');
  await expect(page.locator(`#drum ${POSTER}`)).toBeVisible();
  await page.waitForTimeout(2500); // past idle + the 800 ms fallback
  await expect(page.locator('canvas')).toHaveCount(0);
  await close();
});

// The two tests below are the motion-on path by definition; under the reduced-motion project the first test covers 3D.
const skipReduced = () => test.skip(test.info().project.use.reducedMotion === 'reduce', 'motion-on path only');


test('default: the 3D drum mounts over the poster within 5 s, hidden from assistive tech', async ({ browser }) => {
  skipReduced();
  const { page, close } = await open3D(browser);
  await page.goto('/');
  await expect(page.locator('#hero canvas')).toBeAttached({ timeout: 5000 });
  await expect(page.locator('#hero [aria-hidden="true"]').filter({ has: page.locator('canvas') })).toHaveCount(1);
  await expect(page.locator(`#hero ${POSTER}`)).toHaveAttribute('alt', /slit drum/);
  await expect(page.getByRole('link', { name: 'Play me below ↓' })).toHaveAttribute('href', '#drum');
  await close();
});

test('with the 3D drum running, a phrase still decodes', async ({ browser }) => {
  skipReduced();
  const { page, close } = await open3D(browser);
  await page.goto('/#drum');
  await expect(page.locator('#drum canvas')).toBeAttached({ timeout: 5000 });
  await page.getByRole('button', { name: 'Low drum' }).focus();
  // While SwiftShader renders, each CDP key press can take 10 s+ to land (measured), past the 2 s idle reset; so the four
  // beats go in as one burst at whatever holds focus, which still proves the canvas neither steals focus nor eats keys.
  await page.evaluate(() => { for (const key of 'fjfj') document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })); });
  await expect(page.getByText('1 / 8 messages decoded')).toBeVisible();
  await close();
});

test('touch: a tap on a 3D lip counts once; a swipe that starts on it scrolls without a beat', async ({ browser }) => {
  skipReduced();
  const { ctx, page, close } = await open3D(browser, { hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  await page.goto('/#drum');
  const box = page.locator('#drum .drum-canvas');
  await box.scrollIntoViewIfNeeded();
  await expect(page.locator('#drum canvas')).toBeAttached({ timeout: 5000 });
  await page.waitForTimeout(1500); // canvas faded in
  const b = (await box.boundingBox())!;
  const x = b.x + b.width * 0.42, y = b.y + b.height * 0.447; // the low lip
  // Count every counted hit (a lip hit takes the pad path, which flashes the pad), immune to the 2 s idle reset.
  await page.getByRole('button', { name: 'Low drum' }).evaluate((el) => {
    const w = window as unknown as { __hits: number };
    w.__hits = 0;
    new MutationObserver(() => { if (el.classList.contains('is-hit')) w.__hits++; }).observe(el, { attributeFilter: ['class'] });
  });
  const hits = () => page.evaluate(() => (window as unknown as { __hits: number }).__hits);
  await page.touchscreen.tap(x, y);
  await expect.poll(hits).toBe(1); // one tap, one beat (and proves the spot is a lip)
  // Tap first: Chrome swallows a tap that stops a fling, so tapping after the swipe would prove nothing.
  const cdp = await ctx.newCDPSession(page);
  const y0 = await page.evaluate(() => scrollY);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let i = 1; i <= 8; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - i * 15 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y0); // it was a real scroll
  await page.waitForTimeout(300);
  expect(await hits()).toBe(1); // the swipe added no beat
  await close();
});
