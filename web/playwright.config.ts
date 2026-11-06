import { defineConfig, devices } from '@playwright/test';

const external = process.env.BASE_URL;

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  retries: external ? 1 : 0,
  reporter: [['list']],
  use: { baseURL: external ?? 'http://localhost:4321', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // The whole suite again with prefers-reduced-motion: `npm run e2e:reduced` (after a build:e2e).
    { name: 'reduced-motion', use: { ...devices['Desktop Chrome'], reducedMotion: 'reduce' } },
  ],
  webServer: external ? undefined : { command: 'npm run preview', url: 'http://localhost:4321', reuseExistingServer: true, timeout: 60_000 },
});
