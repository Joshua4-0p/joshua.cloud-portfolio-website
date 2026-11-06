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
