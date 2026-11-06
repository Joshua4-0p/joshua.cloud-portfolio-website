import { test, expect, blockApi } from './fixtures';

test('every section is in static HTML (JS disabled)', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false }); await blockApi(ctx); const page = await ctx.newPage();
  await page.goto('/');
  for (const id of ['hero','about','superpowers','work','achievements','community','drum','contact'])
    await expect(page.locator(`section#${id} h2, section#${id} h1`).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'The drum has a message for you — tap it' })).toHaveAttribute('href', '#drum');
  await expect(page.locator('#drum details li')).toHaveCount(8);
});
test('hint above the fold at 360x640 and 1280x720', async ({ page }) => {
  for (const s of [{width:360,height:640},{width:1280,height:720}]) {
    await page.setViewportSize(s); await page.goto('/');
    const box = await page.getByRole('link', { name: /The drum has a message/ }).boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(s.height);
  }
});
test('no horizontal scroll at 360px; nav link reaches its section', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 }); await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  await page.getByRole('button', { name: /menu/i }).click();
  await page.getByRole('link', { name: /WORK/ }).click();
  await expect(page.locator('section#work')).toBeInViewport();
});
