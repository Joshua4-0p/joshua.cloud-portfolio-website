import { test, expect, blockApi, play } from './fixtures';

// Phase-1 review fixes (the axe check moved to a11y.spec.ts).
test('About lead sentence is exposed to assistive tech with motion on', async ({ page }) => {
  await page.goto('/'); await page.waitForTimeout(1500);
  await expect(page.locator('#about')).toMatchAriaSnapshot(`- paragraph: /I build serverless systems on AWS/`);
});

test('a pad tap (re)activates audio inside a click, not only pointerdown (iOS unlock)', async ({ browser }) => {
  const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } }); await blockApi(ctx);
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    const w = window as unknown as { __audioEvents: string[] };
    w.__audioEvents = [];
    const rec = () => w.__audioEvents.push(window.event?.type ?? 'none');
    const O = window.AudioContext;
    window.AudioContext = class extends O { constructor(o?: AudioContextOptions) { super(o); rec(); } } as typeof AudioContext;
    const resume = O.prototype.resume;
    O.prototype.resume = function () { rec(); return resume.call(this); };
  });
  await page.goto('/#drum');
  await page.getByRole('button', { name: 'Low drum' }).tap();
  const events = await page.evaluate(() => (window as unknown as { __audioEvents: string[] }).__audioEvents);
  expect(events).toContain('click');
  await ctx.close();
});

test('pads do not start a page scroll on touch (touch-action: none)', async ({ page }) => {
  await page.goto('/#drum');
  for (const n of ['Low drum', 'High drum'])
    expect(await page.getByRole('button', { name: n }).evaluate((el) => getComputedStyle(el).touchAction)).toBe('none');
});

test('Stage Mode toggle keeps focus and announces the change', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('td.decoded', '[0,1,2]'));
  await page.goto('/#drum');
  const toggle = page.getByRole('button', { name: 'Enter Stage Mode' });
  await toggle.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-stage', 'on');
  await expect(page.locator('#drum [aria-live="polite"]')).toContainText('Stage Mode on');
  expect(await page.evaluate(() => document.activeElement?.textContent)).toContain('Back to the quiet site');
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).not.toHaveAttribute('data-stage', 'on');
  expect(await page.evaluate(() => document.activeElement?.textContent)).toContain('Enter Stage Mode');
  await expect(page.locator('#drum [aria-live="polite"]')).toContainText('Stage Mode off');
});

test('holding Enter on a pad counts one hit', async ({ page }) => {
  await page.goto('/#drum'); await page.getByRole('button', { name: 'Low drum' }).focus();
  for (let i = 0; i < 3; i++) await page.keyboard.down('Enter'); // repeated downs = auto-repeat
  await page.keyboard.up('Enter');
  await expect(page.getByTestId('notation')).toHaveText('●');
});

test('?mode=stage does not persist all 8 as decoded', async ({ page }) => {
  await page.goto('/?mode=stage');
  await play(page, 'LHLH');
  await page.goto('/#drum');
  await expect(page.getByText('1 / 8 messages decoded')).toBeVisible();
});

test('a click on the drum section lets F/J work', async ({ page }) => {
  await page.goto('/#drum');
  await page.locator('#drum-title').click();
  await page.keyboard.press('f');
  await expect(page.getByTestId('notation')).toHaveText('●');
});

test('remembered sound-on is audible on the first pad hit', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('td.sound', 'true');
    const w = window as unknown as { __osc: number };
    w.__osc = 0;
    const O = window.AudioContext;
    const c = O.prototype.createOscillator;
    O.prototype.createOscillator = function () { w.__osc++; return c.call(this); };
  });
  await page.goto('/#drum');
  await page.getByRole('button', { name: 'Low drum' }).click();
  expect(await page.evaluate(() => (window as unknown as { __osc: number }).__osc)).toBeGreaterThan(0);
});

// Re-audit fixes.
test('contact button never overlaps the title at any width', async ({ page }) => {
  for (const width of [360, 390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#contact');
    // Both rects in one frame, after fonts settle: two separate boundingBox() calls could straddle a scroll.
    const [h, b] = await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise(requestAnimationFrame);
      const r = (el: Element | null) => el!.getBoundingClientRect().toJSON() as DOMRect;
      return [r(document.getElementById('contact-title')), r([...document.querySelectorAll('#contact a')].find((a) => a.textContent?.trim() === 'Get in touch') ?? null)];
    });
    const overlap = h.x < b.x + b.width && b.x < h.x + h.width && h.y < b.y + b.height && b.y < h.y + h.height;
    expect(overlap, `overlap at ${width}`).toBe(false);
    if (width === 390) expect(Math.abs(b.width - b.height), 'button is round at 390').toBeLessThanOrEqual(2);
  }
});
test('keyboard focus keeps the round pad radius', async ({ page }) => {
  await page.goto('/#drum');
  const low = page.getByRole('button', { name: 'Low drum' });
  await page.keyboard.press('Tab'); await low.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
  await expect(low).toBeFocused();
  const radius = await low.evaluate((el) => getComputedStyle(el).borderRadius);
  expect(radius).not.toBe('2px');
  expect(parseFloat(radius)).toBeGreaterThan(20);
});
test('a lone beat clears from the notation after the 2 s idle reset', async ({ page }) => {
  await page.goto('/#drum');
  await page.getByRole('button', { name: 'Low drum' }).click();
  await expect(page.getByTestId('notation')).toHaveText('●');
  await page.waitForTimeout(2300);
  await expect(page.getByTestId('notation')).toHaveText('');
});
test('small tap targets are at least 44px tall', async ({ page }) => {
  await page.goto('/#drum');
  const h = async (l: import('@playwright/test').Locator) => (await l.boundingBox())!.height;
  expect(await h(page.locator('#drum [data-sound-toggle]'))).toBeGreaterThanOrEqual(44);
  expect(await h(page.locator('summary', { hasText: 'ALL 8 MESSAGES' }))).toBeGreaterThanOrEqual(44);
});
