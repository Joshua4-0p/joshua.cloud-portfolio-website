import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';

const reduced = (page: Page) => page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
const count = (page: Page, key: string) => page.evaluate((k) => (window as unknown as Record<string, number>)[k], key);

test('no AudioContext before a gesture, even with sound remembered on and after hover + scroll', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('td.sound', 'true');
    const w = window as unknown as { __ctx: number };
    w.__ctx = 0;
    const O = window.AudioContext;
    window.AudioContext = class extends O { constructor(o?: AudioContextOptions) { super(o); w.__ctx++; } } as typeof AudioContext;
  });
  await page.goto('/');
  await page.waitForTimeout(1500); // past load + the motion layer
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'WORK' }).hover();
  await page.mouse.wheel(0, 2500);
  await page.waitForTimeout(800);
  expect(await count(page, '__ctx')).toBe(0);
  await page.locator('[data-sound-toggle]').last().click();
  expect(await count(page, '__ctx')).toBe(1);
});

test('Stage Mode plays the clave only with sound on, and stops on exit', async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __osc: number };
    w.__osc = 0;
    const c = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function () { w.__osc++; return c.call(this); };
  });
  await page.goto('/?mode=stage');
  await expect(page.locator('html')).toHaveAttribute('data-stage', 'on');
  await page.locator('#drum [data-sound-toggle]').click();
  await page.waitForTimeout(400);
  const a = await count(page, '__osc');
  await page.waitForTimeout(1500);
  expect(await count(page, '__osc')).toBeGreaterThan(a); // the groove keeps scheduling notes
  await page.getByRole('button', { name: '✕ Back to the quiet site' }).click();
  await page.waitForTimeout(400);
  const b = await count(page, '__osc');
  await page.waitForTimeout(1500);
  expect(await count(page, '__osc')).toBe(b);
});

test('reveals: on-screen headings are never hidden; below-fold ones are split for the reveal', async ({ page }) => {
  await page.goto('/#superpowers');
  test.skip(await reduced(page), 'no reveals under reduced motion');
  await page.waitForTimeout(2000);
  await expect(page.locator('#superpowers-title')).toBeInViewport();
  expect(await page.locator('#superpowers-title div').count()).toBe(0); // left alone: no hide-then-show flash
  expect(await page.locator('#achievements-title div').count()).toBeGreaterThan(0); // the motion layer did run
});

test('hero marquee speeds up with scroll velocity (1x-4x) and settles back', async ({ page }) => {
  await page.goto('/');
  const rate = () => page.locator('.marquee-track').evaluate((el) => el.getAnimations()[0]?.playbackRate ?? 0);
  if (await reduced(page)) {
    expect(await rate()).toBe(0); // no marquee animation at all
    return;
  }
  await page.waitForTimeout(1500);
  expect(await rate()).toBe(1);
  let peak = 1;
  for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 400); peak = Math.max(peak, await rate()); }
  expect(peak).toBeGreaterThan(1.2);
  expect(peak).toBeLessThanOrEqual(4);
  await expect.poll(rate, { timeout: 5000 }).toBe(1);
});
