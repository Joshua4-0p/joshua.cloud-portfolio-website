import { test as base, expect } from '@playwright/test';

// Safety net: no spec may reach a real drum API (POST /drum emails the owner). Page-level routes in a spec override this.
export const test = base.extend({
  context: async ({ context }, run) => {
    await context.route(/execute-api\..*\.amazonaws\.com/, (r) => r.abort());
    await run(context);
  },
});
export { expect };
