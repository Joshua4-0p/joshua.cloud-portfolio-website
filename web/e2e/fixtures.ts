import { test as base, expect, type BrowserContext } from '@playwright/test';

// RULE: no spec may reach a real drum API (POST /drum emails the owner). Specs import `test` from here, and every
// `browser.newContext(...)` MUST be followed by `await blockApi(ctx)` (new contexts skip the fixture below).
// Page-level routes in a spec override this.
export const blockApi = (ctx: BrowserContext) => ctx.route(/execute-api\..*\.amazonaws\.com/, (r) => r.abort());
export const test = base.extend({
  context: async ({ context }, run) => {
    await blockApi(context);
    await run(context);
  },
});
export { expect };
