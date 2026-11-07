import { test, expect } from './fixtures';

test('360x640: /#drum lands with both pads fully in view', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/#drum');
  // Wait for the hash scroll to settle: scrollY unchanged for 300 ms.
  await page.waitForFunction(() => new Promise<boolean>((res) => {
    const y = scrollY; setTimeout(() => res(scrollY === y), 300);
  }), null, { timeout: 10000, polling: 350 });
  for (const name of ['Low drum', 'High drum']) {
    const b = (await page.getByRole('button', { name }).boundingBox())!;
    expect(b.y).toBeGreaterThanOrEqual(0);
    expect(b.y + b.height).toBeLessThanOrEqual(640);
    expect(b.x).toBeGreaterThanOrEqual(0);
    expect(b.x + b.width).toBeLessThanOrEqual(360);
  }
});
