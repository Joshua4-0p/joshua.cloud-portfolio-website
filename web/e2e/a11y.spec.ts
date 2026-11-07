import { test, expect } from './fixtures';
import AxeBuilder from '@axe-core/playwright';

// Motion is ON in the chromium project, which is where SplitText reveals run; e2e:reduced covers the static path.
for (const path of ['/', '/how-it-works/', '/?mode=stage'])
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }])
    test(`no serious/critical axe violations on ${path} at ${vp.width}px`, async ({ page }) => {
      test.slow(); // axe over the full home page is heavy when the suite runs in parallel
      await page.setViewportSize(vp);
      await page.goto(path);
      await page.waitForTimeout(1500); // let SplitText reveals run
      const r = await new AxeBuilder({ page }).analyze();
      const bad = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
