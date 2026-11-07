import { test, expect } from './fixtures';

// Hosts that refuse scripted requests but open in a browser. Each was checked by hand in a real browser (docs/submission/qa.md).
const SKIP: Record<string, string> = {
  'www.linkedin.com': 'answers bots with 999; opened manually in a browser',
};

test('every external link on / and /how-it-works/ resolves (< 400)', async ({ page, request }) => {
  test.setTimeout(120_000);
  const hrefs = new Set<string>();
  for (const path of ['/', '/how-it-works/']) {
    await page.goto(path);
    for (const h of await page.locator('a[href^="http"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href))) hrefs.add(h);
  }
  expect(hrefs.size).toBeGreaterThan(5);
  const bad: string[] = [];
  for (const url of hrefs) {
    if (new URL(url).hostname in SKIP) continue;
    const r = await request.get(url, { timeout: 20_000 })
      .catch((e: Error) => ({ status: () => `error ${e.message.split('\n')[0]}` }));
    const s = r.status();
    if (typeof s !== 'number' || s >= 400) bad.push(`${s} ${url}`);
  }
  expect(bad).toEqual([]);
});
