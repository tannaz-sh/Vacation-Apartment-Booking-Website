import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/cms-ui',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  outputDir: 'test-results/cms-ui',
  use: {
    baseURL: 'http://127.0.0.1:5144',
    channel: process.env.PLAYWRIGHT_CHANNEL,
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : undefined,
    // Do not write even disposable credentials or auth cookies into trace artifacts.
    trace: 'off',
    video: 'off',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'tablet', use: { ...devices['iPad Mini'], defaultBrowserType: 'chromium' } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: 'node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 5144',
    url: 'http://127.0.0.1:5144/admin/login',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
