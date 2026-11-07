import { test, expect, play as phrase } from './fixtures';
import type { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// The live site calls the real API (docs/submission/urls.md); the e2e build calls the example host (scripts/build-e2e.mjs).
const API_URL = process.env.BASE_URL
  ? /^API_URL=(\S+)/m.exec(readFileSync(path.resolve(__dirname, '../../docs/submission/urls.md'), 'utf8'))![1]
  : 'https://example.execute-api.us-east-1.amazonaws.com';

const delivered = (page: Page) => page.getByText('Delivered via Amazon SNS');

test('delivery line and counter appear when the API answers', async ({ page }) => {
  await page.route('**/drum', (r) => r.fulfill({ json: { count: 42, messageId: 'abcd1234' } }));
  await page.goto('/#drum');
  await expect(page.getByText('42 rhythms have crossed the cloud')).toBeVisible();
  await phrase(page, 'LHLH');
  await expect(delivered(page)).toHaveText('Delivered via Amazon SNS · msg abcd… · rhythm #42');
  await expect(page.getByText('Before SNS, there was the drum.', { exact: false }).first()).toBeVisible();
});

test('API failure is silent: message card, no delivery line, no counter', async ({ page }) => {
  await page.route('**/drum', (r) => r.abort());
  await page.goto('/#drum');
  await phrase(page, 'LHLH');
  await expect(page.getByTestId('message-card')).toBeVisible();
  await page.waitForTimeout(500);
  await expect(delivered(page)).toHaveCount(0);
  await expect(page.getByText('rhythms have crossed the cloud')).toHaveCount(0);
});

test('a late reply for phrase 1 never renders on phrase 2\'s card', async ({ page }) => {
  let posts = 0;
  await page.route('**/drum', async (r) => {
    if (r.request().method() !== 'POST') return r.abort();
    const n = ++posts;
    if (n === 1) await new Promise((res) => setTimeout(res, 1500));
    await r.fulfill({ json: { count: n, messageId: n === 1 ? 'aaaa1111' : 'bbbb2222' } }).catch(() => {});
  });
  await page.goto('/#drum');
  await phrase(page, 'LHLH');
  await phrase(page, 'HHLL');
  await expect(page.getByText('MESSAGE 02 / 08')).toBeVisible();
  await expect(delivered(page)).toHaveText('Delivered via Amazon SNS · msg bbbb… · rhythm #2');
  await page.waitForTimeout(1800); // phrase 1's reply has now arrived
  await expect(page.getByText('msg aaaa…')).toHaveCount(0);
  await expect(delivered(page)).toHaveText('Delivered via Amazon SNS · msg bbbb… · rhythm #2');
});

test('secret phrase announces the message and Stage Mode together', async ({ page }) => {
  await page.goto('/#drum');
  await phrase(page, 'LLHL');
  const live = page.locator('[aria-live="polite"]');
  await expect(live).toContainText('Message 1 of 8');
  await expect(live).toContainText('Stage Mode on');
});

// Review Focus 2, no mocks: the API is simply unreachable (as with a CSP/CORS block or an outage).
test('drum works with API blocked', async ({ page }) => {
  const caught: string[] = [];
  await page.route(API_URL + '/**', (r) => { caught.push(r.request().method()); return r.abort(); });
  const errors: string[] = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/#drum');
  await phrase(page, 'LHLH');
  await expect(page.getByText('1 / 8 messages decoded')).toBeVisible({ timeout: 1000 }); // instant, not after the 3 s client timeout
  await expect(page.getByTestId('message-card')).toBeVisible();
  await expect.poll(() => caught).toContain('POST'); // the block really sat in the request path
  await page.waitForTimeout(500);
  await expect(delivered(page)).toHaveCount(0);
  await expect(page.getByText('rhythms have crossed the cloud')).toHaveCount(0);
  expect(errors).toEqual([]);
});
