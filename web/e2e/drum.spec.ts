import { test, expect, blockApi } from './fixtures';

test('first message within one phrase, keyboard + pointer', async ({ page }) => {
  await page.goto('/#drum');
  const low = page.getByRole('button', { name: 'Low drum' }), high = page.getByRole('button', { name: 'High drum' });
  await low.click(); await high.click(); await low.click(); await high.click();
  await expect(page.getByText('1 / 8 messages decoded')).toBeVisible();
  await expect(page.getByText('Before SNS, there was the drum.', { exact: false }).first()).toBeVisible();
});
test('pad hit counts once per pointer tap and once per key press', async ({ page }) => {
  await page.goto('/#drum'); await page.getByRole('button', { name: 'Low drum' }).focus();
  await page.keyboard.press('Enter'); await page.keyboard.press('f');
  await expect(page.getByTestId('notation')).toHaveText('●●');
});
test('F/J ignored outside the drum section', async ({ page }) => {
  await page.goto('/'); await page.keyboard.press('f'); await page.goto('/#drum');
  await expect(page.getByTestId('notation')).toHaveText('');
});
test('?mode=stage shows all 8 and exits with Esc', async ({ page }) => {
  await page.goto('/?mode=stage'); await expect(page.locator('html')).toHaveAttribute('data-stage', 'on');
  await page.getByRole('button', { name: 'Read the messages' }).click();
  await expect(page.getByTestId('message-list').locator('li')).toHaveCount(8);
  await page.getByRole('button', { name: 'Low drum' }).focus(); await page.keyboard.press('Escape');
  await expect(page.locator('html')).not.toHaveAttribute('data-stage', 'on');
  expect(page.url()).not.toContain('mode=');
});

// Extra coverage for Review Focus 1, 3, 4.
test('a touch tap counts once (pointerdown + click)', async ({ browser }) => {
  const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } }); await blockApi(ctx);
  const page = await ctx.newPage(); await page.goto('/#drum');
  await page.getByRole('button', { name: 'Low drum' }).tap();
  await expect(page.getByTestId('notation')).toHaveText('●');
  await ctx.close();
});
test('drum still works when localStorage throws', async ({ page }) => {
  await page.addInitScript(() => {
    const boom = () => { throw new DOMException('blocked', 'SecurityError'); };
    Object.defineProperty(window, 'localStorage', { get: boom });
  });
  const errors: string[] = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/#drum');
  for (const n of ['Low drum', 'Low drum', 'High drum', 'Low drum']) await page.getByRole('button', { name: n }).click();
  await expect(page.getByText('1 / 8 messages decoded')).toBeVisible();
  await page.getByRole('button', { name: 'Sound' }).first().click();
  expect(errors).toEqual([]);
});
test('decoded progress survives a reload, and the 9th phrase replays message 1', async ({ page }) => {
  await page.goto('/#drum');
  await page.evaluate(() => localStorage.setItem('td.decoded', JSON.stringify([0, 1, 2, 3, 4, 5, 6, 7])));
  await page.reload();
  await expect(page.getByText('8 / 8 messages decoded')).toBeVisible();
  const low = page.getByRole('button', { name: 'Low drum' });
  for (let i = 0; i < 4; i++) await low.click();
  await expect(page.getByText('8 / 8 messages decoded')).toBeVisible();
  await expect(page.getByTestId('message-card')).toContainText('started drumming in Lower Sixth');
});
