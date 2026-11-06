import { test as base, expect, type BrowserContext } from '@playwright/test';

// RULE: no spec may reach a real drum API (POST /drum emails the owner). Specs import `test` from here, and every
// `browser.newContext(...)` MUST be followed by `await blockApi(ctx)` (new contexts skip the fixture below).
// Page-level routes in a spec override this.
// It also pins the 3D gate's real low-memory fallback (poster, no WebGL): headless chromium renders WebGL in software,
// and a canvas in every parallel worker starves the suite. three.spec.ts opts in with `{ with3D: true }`.
export const blockApi = async (ctx: BrowserContext, { with3D = false } = {}) => {
  if (!with3D) await ctx.addInitScript(() => Object.defineProperty(Navigator.prototype, 'deviceMemory', { get: () => 2 }));
  await ctx.route(/execute-api\..*\.amazonaws\.com/, (r) => r.abort());
};
export const test = base.extend({
  context: async ({ context }, run) => {
    await blockApi(context);
    await run(context);
  },
});
export { expect };
