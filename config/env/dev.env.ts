
export const devConfig = {
  environment: 'dev',
  baseUrl: 'https://dev.frbsf.org',
  apiUrl: 'https://api-dev.frbsf.org',
  
  // Browser settings
  browser: 'chromium',
  headed: false,
  viewport: { width: 1920, height: 1080 },
  
  // Timeouts
  timeout: 30000,
  slowMo: 0,
  
  // Execution settings
  parallel: 3,
  retry: 2,
  
  // Feature flags
  enableVideoRecording: true,
  enableScreenshots: true,
  enableTracing: true,
  enableNetworkLogs: true,
  
  // Database settings
  database: {
    host: process.env.DEV_DB_HOST || 'dev-db.frbsf.org',
    port: parseInt(process.env.DEV_DB_PORT || '1521'),
    serviceName: process.env.DEV_DB_SERVICE || 'DEVDB',
    username: process.env.DEV_DB_USERNAME || 'testuser',
    password: process.env.DEV_DB_PASSWORD || 'testpass'
  },
  
  // API settings
  api: {
    timeout: 30000,
    retries: 3,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  
  // Authentication
  auth: {
    enabled: true,
    type: 'oauth2',
    clientId: process.env.DEV_CLIENT_ID,
    clientSecret: process.env.DEV_CLIENT_SECRET,
    tokenUrl: 'https://auth-dev.frbsf.org/oauth/token'
  },
  
  // Logging
  logging: {
    level: 'debug',
    enableConsole: true,
    enableFile: true,
    filePath: './reports/dev-execution.log'
  },
  
  // Test data
  testData: {
    users: {
      admin: {
        username: 'dev_admin',
        password: process.env.DEV_ADMIN_PASSWORD
      },
      user: {
        username: 'dev_user',
        password: process.env.DEV_USER_PASSWORD
      }
    }
  }
};
