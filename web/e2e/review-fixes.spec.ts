import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Phase-1 review fixes. Motion is ON here (default context), which is where SplitText runs.
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`no serious/critical axe violations with motion on at ${vp.width}px`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto('/');
    await page.waitForTimeout(1500); // let SplitText reveals run
    const r = await new AxeBuilder({ page }).analyze();
    const bad = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}

test('About lead sentence is exposed to assistive tech with motion on', async ({ page }) => {
  await page.goto('/'); await page.waitForTimeout(1500);
  await expect(page.locator('#about')).toMatchAriaSnapshot(`- paragraph: /I build serverless systems on AWS/`);
});

test('a pad tap (re)activates audio inside a click, not only pointerdown (iOS unlock)', async ({ browser }) => {
  const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
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
  const low = page.getByRole('button', { name: 'Low drum' }), high = page.getByRole('button', { name: 'High drum' });
  await low.click(); await high.click(); await low.click(); await high.click();
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
