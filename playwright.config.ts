import { defineConfig, devices } from '@playwright/test'

const PORT = 3100

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    port: PORT,
    env: { CONTACT_TRANSPORT: 'stream' },
    // Never reuse: a stray server on the port would mean testing a stale build.
    reuseExistingServer: false,
    timeout: 240_000,
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] }, testIgnore: /visual\.spec/ },
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'] }, testIgnore: /visual\.spec/ },
    { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'] }, testIgnore: /visual\.spec/ },
    { name: 'webkit-mobile', use: { ...devices['iPhone 14'] }, testIgnore: /visual\.spec/ },
    { name: 'visual', use: { ...devices['Desktop Chrome'] }, testMatch: /visual\.spec/ },
  ],
})
