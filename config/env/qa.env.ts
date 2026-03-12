

export const qaConfig = {
  environment: 'qa',
  baseUrl: 'https://qa.frbsf.org',
  apiUrl: 'https://api-qa.frbsf.org',
  
  // Browser settings
  browser: 'chromium',
  headed: false,
  viewport: { width: 1920, height: 1080 },
  
  // Timeouts
  timeout: 45000,
  slowMo: 0,
  
  // Execution settings
  parallel: 5,
  retry: 3,
  
  // Feature flags
  enableVideoRecording: true,
  enableScreenshots: true,
  enableTracing: true,
  enableNetworkLogs: true,
  
  // Database settings
  database: {
    host: process.env.QA_DB_HOST || 'qa-db.frbsf.org',
    port: parseInt(process.env.QA_DB_PORT || '1521'),
    serviceName: process.env.QA_DB_SERVICE || 'QADB',
    username: process.env.QA_DB_USERNAME || 'testuser',
    password: process.env.QA_DB_PASSWORD || 'testpass'
  },
  
  // API settings
  api: {
    timeout: 45000,
    retries: 3,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Environment': 'qa'
    }
  },
  
  // Authentication
  auth: {
    enabled: true,
    type: 'oauth2',
    clientId: process.env.QA_CLIENT_ID,
    clientSecret: process.env.QA_CLIENT_SECRET,
    tokenUrl: 'https://auth-qa.frbsf.org/oauth/token'
  },
  
  // Logging
  logging: {
    level: 'info',
    enableConsole: true,
    enableFile: true,
    filePath: './reports/qa-execution.log'
  },
  
  // Test data
  testData: {
    users: {
      admin: {
        username: 'qa_admin',
        password: process.env.QA_ADMIN_PASSWORD
      },
      user: {
        username: 'qa_user',
        password: process.env.QA_USER_PASSWORD
      }
    }
  },
  
  // Performance thresholds
  performance: {
    pageLoadTime: 5000,
    apiResponseTime: 2000,
    resourceLoadTime: 3000
  },
  
  // Accessibility settings
  accessibility: {
    enabled: true,
    standards: ['WCAG2A', 'WCAG2AA'],
    includeWarnings: false
  }
};

