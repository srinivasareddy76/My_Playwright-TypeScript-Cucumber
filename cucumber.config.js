
const { config } = require('dotenv');

// Load environment variables
config();

/**
 * Cucumber Configuration
 * See https://cucumber.io/docs/cucumber/api/#options
 */
const cucumberConfig = {
  // Feature files location
  paths: [
    'tests/ui-e2e/app1/features/*.feature',
    'tests/ui-e2e/app2/features/*.feature',
    'tests/ui-e2e/frbsf/features/*.feature',
    'tests/api/features/*.feature'
  ],

  // Step definitions location
  require: [
    'tests/ui-e2e/app1/step-definitions/*.ts',
    'tests/ui-e2e/app2/step-definitions/*.ts',
    'tests/ui-e2e/frbsf/step-definitions/*.ts',
    'tests/api/step-definitions/*.ts',
    'core/hooks/*.ts'
  ],

  // Require modules
  requireModule: [
    'ts-node/register',
    'tsconfig-paths/register'
  ],

  // World parameters
  worldParameters: {
    environment: process.env.ENV || 't3',
    baseUrl: getBaseUrl(),
    browser: process.env.BROWSER || 'chromium',
    headed: process.env.HEADED === 'true',
    viewport: getViewport(),
    timeout: parseInt(process.env.TIMEOUT || '30000'),
    slowMo: parseInt(process.env.SLOW_MO || '0'),
    parallel: parseInt(process.env.PARALLEL || '3'),
    retry: parseInt(process.env.RETRY || '2'),
    debug: process.env.DEBUG === 'true',
    verbose: process.env.VERBOSE === 'true',
    ci: process.env.CI === 'true',
    reportPath: process.env.REPORT_PATH || './reports',
    screenshotPath: process.env.SCREENSHOT_PATH || './reports/screenshots',
    videoPath: process.env.VIDEO_PATH || './reports/videos',
    tracePath: process.env.TRACE_PATH || './reports/traces'
  },

  // Formatters and reporters
  format: [
    'progress-bar',
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-html/index.html',
    '@cucumber/pretty-formatter'
  ],

  // Parallel execution
  parallel: parseInt(process.env.PARALLEL || '3'),

  // Retry failed scenarios
  retry: parseInt(process.env.RETRY || '2'),

  // Tags to run
  tags: process.env.TAGS || '@smoke',

  // Fail fast
  failFast: process.env.FAIL_FAST === 'true',

  // Strict mode
  strict: true,

  // Dry run
  dryRun: process.env.DRY_RUN === 'true',

  // Publish results
  publish: process.env.PUBLISH_RESULTS === 'true',

  // Profiles
  profiles: {
    default: {
      parallel: 1,
      retry: 0,
      tags: '@smoke'
    },
    
    headless: {
      worldParameters: {
        headed: false
      },
      parallel: 3,
      retry: 2
    },
    
    headed: {
      worldParameters: {
        headed: true
      },
      parallel: 1,
      retry: 0
    },
    
    smoke: {
      tags: '@smoke',
      parallel: 3,
      retry: 1
    },
    
    regression: {
      tags: 'not @skip',
      parallel: 5,
      retry: 2
    },
    
    critical: {
      tags: '@critical',
      parallel: 2,
      retry: 3
    },
    
    api: {
      paths: ['tests/api/features/*.feature'],
      require: [
        'tests/api/step-definitions/*.ts',
        'core/hooks/*.ts'
      ],
      tags: '@api',
      parallel: 5,
      retry: 2
    },
    
    ui: {
      paths: ['tests/ui-e2e/*/features/*.feature'],
      require: [
        'tests/ui-e2e/*/step-definitions/*.ts',
        'core/hooks/*.ts'
      ],
      tags: '@ui',
      parallel: 3,
      retry: 2
    },
    
    mobile: {
      worldParameters: {
        viewport: { width: 375, height: 667 }
      },
      tags: '@mobile or @responsive',
      parallel: 2,
      retry: 2
    },
    
    tablet: {
      worldParameters: {
        viewport: { width: 768, height: 1024 }
      },
      tags: '@tablet or @responsive',
      parallel: 2,
      retry: 2
    },
    
    desktop: {
      worldParameters: {
        viewport: { width: 1920, height: 1080 }
      },
      tags: '@desktop',
      parallel: 3,
      retry: 2
    },
    
    performance: {
      tags: '@performance',
      parallel: 1,
      retry: 1,
      worldParameters: {
        timeout: 60000
      }
    },
    
    accessibility: {
      tags: '@accessibility',
      parallel: 2,
      retry: 1
    },
    
    cross_browser: {
      parallel: 1,
      retry: 2,
      tags: '@cross-browser'
    }
  }
};

/**
 * Get base URL based on environment
 */
function getBaseUrl() {
  const env = process.env.ENV || 't3';
  
  switch (env.toLowerCase()) {
    case 't3':
      return 'https://frbsf.org';
    case 't5':
      return 'https://frbsf.org';
    case 'dev':
      return process.env.DEV_BASE_URL || 'https://dev.frbsf.org';
    case 'qa':
      return process.env.QA_BASE_URL || 'https://qa.frbsf.org';
    case 'staging':
      return process.env.STAGING_BASE_URL || 'https://staging.frbsf.org';
    case 'prod':
      return process.env.PROD_BASE_URL || 'https://www.frbsf.org';
    default:
      return 'https://frbsf.org';
  }
}

/**
 * Get viewport configuration
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

module.exports = cucumberConfig;

