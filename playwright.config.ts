import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Playwright Configuration
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './applications',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : parseInt(process.env.RETRY || '1'),
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : parseInt(process.env.PARALLEL || '3'),
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'reports/playwright-html' }],
    ['json', { outputFile: 'reports/playwright-results.json' }],
    ['junit', { outputFile: 'reports/playwright-junit.xml' }]
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'https://frbsf.org',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Global timeout for each action */
    actionTimeout: parseInt(process.env.TIMEOUT || '30000'),
    
    /* Global timeout for navigation */
    navigationTimeout: parseInt(process.env.TIMEOUT || '30000'),
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
    
    /* Client certificates */
    clientCertificates: process.env.CLIENT_CERT_PATH ? [{
      origin: process.env.BASE_URL || 'https://frbsf.org',
      certPath: process.env.CLIENT_CERT_PATH,
      keyPath: process.env.CLIENT_KEY_PATH,
      passphrase: process.env.CLIENT_CERT_PASSPHRASE,
    }] : [],
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: getViewport(),
        headless: process.env.HEADED !== 'true'
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: getViewport(),
        headless: process.env.HEADED !== 'true'
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: getViewport(),
        headless: process.env.HEADED !== 'true'
      },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        headless: process.env.HEADED !== 'true'
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        headless: process.env.HEADED !== 'true'
      },
    },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { 
        ...devices['Desktop Edge'], 
        channel: 'msedge',
        viewport: getViewport(),
        headless: process.env.HEADED !== 'true'
      },
    },
    {
      name: 'Google Chrome',
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome',
        viewport: getViewport(),
        headless: process.env.HEADED !== 'true'
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

  /* Global setup and teardown */
  globalSetup: require.resolve('./core/fixtures/globalSetup.ts'),
  globalTeardown: require.resolve('./core/fixtures/globalTeardown.ts'),

  /* Output directory for test artifacts */
  outputDir: 'reports/test-results',
});

/**
 * Get viewport configuration based on environment variable
 */
function getViewport() {
  const viewport = process.env.VIEWPORT || 'desktop';
  
  switch (viewport.toLowerCase()) {
    case 'mobile':
      return { width: 375, height: 667 };
    case 'tablet':
      return { width: 768, height: 1024 };
    case 'desktop':
    default:
      return { width: 1920, height: 1080 };
  }
}
