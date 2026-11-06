import { test, expect } from './fixtures';

test('how-it-works: heading, accessible diagram, services table', async ({ page }) => {
  await page.goto('/how-it-works/');
  await expect(page.locator('h1')).toContainText('How this site is built');
  const svg = page.locator('svg[role="img"]').first();
  await expect(svg).toBeVisible();
  expect((await svg.getAttribute('aria-label'))?.length ?? 0).toBeGreaterThan(20);
  const table = page.locator('table');
  for (const s of ['AWS Amplify Hosting', 'Amazon API Gateway', 'AWS Lambda', 'Amazon DynamoDB', 'Amazon SNS', 'Amazon SQS', 'Amazon CloudWatch Synthetics', 'AWS Budgets'])
    await expect(table.getByText(s, { exact: true })).toBeVisible();
});

test('unknown path shows the 404 page', async ({ page }) => {
  await page.goto('/nope/');
  await expect(page.getByText('missed the beat')).toBeVisible();
  await expect(page.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
});

test('footer link "How this site is built" resolves 200', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.getByRole('contentinfo').getByRole('link', { name: 'How this site is built' }).getAttribute('href');
  expect(href).toBe('/how-it-works/');
  expect((await request.get(href!)).status()).toBe(200);
});
