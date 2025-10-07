import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.baseUrl || 'https://www.chess.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
  },

  /* Configure projects for UI (mocked), E2E (live), Login (no auth), and Accessibility */
  projects: [
    {
      name: 'ui-mocked',
      testDir: './tests/ui',
      use: { 
        ...devices['Desktop Chrome'],
        // Use stored authentication state
        storageState: path.resolve(__dirname, 'auth-state.json'),
      },
    },
    {
      name: 'e2e-live',
      testDir: './tests/e2e',
      use: { 
        ...devices['Desktop Chrome'],
        // Use stored authentication state for E2E tests too
        storageState: path.resolve(__dirname, 'auth-state.json'),
      },
    },
    {
      name: 'a11y-live',
      testDir: './tests/a11y',
      use: { 
        ...devices['Desktop Chrome'],
        // Use stored authentication state for accessibility tests
        storageState: path.resolve(__dirname, 'auth-state.json'),
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
