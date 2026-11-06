import { test, expect, blockApi } from './fixtures';
import type { Browser } from '@playwright/test';

const POSTER = 'img[src="/images/drum-poster.webp"]';
// The default fixture pins the poster path (see fixtures.ts); these tests opt back in to the real gate.
const open3D = async (browser: Browser, opts = {}) => {
  const ctx = await browser.newContext(opts); await blockApi(ctx, { with3D: true });
  return { ctx, page: await ctx.newPage() };
};

test('reduced motion: posters only, no WebGL canvas', async ({ browser }) => {
  const { ctx, page } = await open3D(browser, { reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator(`#hero ${POSTER}`)).toBeVisible();
  await page.goto('/#drum');
  await expect(page.locator(`#drum ${POSTER}`)).toBeVisible();
  await page.waitForTimeout(2500); // past idle + the 800 ms fallback
  await expect(page.locator('canvas')).toHaveCount(0);
  await ctx.close();
});

test('default: the 3D drum mounts over the poster within 5 s, hidden from assistive tech', async ({ browser }) => {
  const { ctx, page } = await open3D(browser);
  await page.goto('/');
  await expect(page.locator('#hero canvas')).toBeAttached({ timeout: 5000 });
  await expect(page.locator('#hero [aria-hidden="true"]').filter({ has: page.locator('canvas') })).toHaveCount(1);
  await expect(page.locator(`#hero ${POSTER}`)).toHaveAttribute('alt', /slit drum/);
  await expect(page.getByRole('link', { name: 'Play me below ↓' })).toHaveAttribute('href', '#drum');
  await ctx.close();
});

test('with the 3D drum running, a phrase still decodes', async ({ browser }) => {
  const { ctx, page } = await open3D(browser);
  await page.goto('/#drum');
  await expect(page.locator('#drum canvas')).toBeAttached({ timeout: 5000 });
  await page.getByRole('button', { name: 'Low drum' }).focus();
  for (const k of ['f', 'j', 'f', 'j']) await page.keyboard.press(k);
  await expect(page.getByText('1 / 8 messages decoded')).toBeVisible();
  await ctx.close();
});
