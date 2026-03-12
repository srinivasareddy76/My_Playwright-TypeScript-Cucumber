


export const prodConfig = {
  environment: 'prod',
  baseUrl: 'https://www.frbsf.org',
  apiUrl: 'https://api.frbsf.org',
  
  // Browser settings
  browser: 'chromium',
  headed: false,
  viewport: { width: 1920, height: 1080 },
  
  // Timeouts (longer for production)
  timeout: 60000,
  slowMo: 0,
  
  // Execution settings (conservative for production)
  parallel: 2,
  retry: 3,
  
  // Feature flags (minimal recording for production)
  enableVideoRecording: false,
  enableScreenshots: true,
  enableTracing: false,
  enableNetworkLogs: false,
  
  // Database settings (read-only for production)
  database: {
    host: process.env.PROD_DB_HOST || 'prod-db.frbsf.org',
    port: parseInt(process.env.PROD_DB_PORT || '1521'),
    serviceName: process.env.PROD_DB_SERVICE || 'PRODDB',
    username: process.env.PROD_DB_USERNAME || 'readonly_user',
    password: process.env.PROD_DB_PASSWORD || 'readonly_pass',
    readOnly: true
  },
  
  // API settings
  api: {
    timeout: 60000,
    retries: 5,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Environment': 'production'
    }
  },
  
  // Authentication
  auth: {
    enabled: true,
    type: 'oauth2',
    clientId: process.env.PROD_CLIENT_ID,
    clientSecret: process.env.PROD_CLIENT_SECRET,
    tokenUrl: 'https://auth.frbsf.org/oauth/token'
  },
  
  // Logging (minimal for production)
  logging: {
    level: 'error',
    enableConsole: false,
    enableFile: true,
    filePath: './reports/prod-execution.log'
  },
  
  // Test data (production-safe)
  testData: {
    users: {
      readonly: {
        username: 'prod_readonly',
        password: process.env.PROD_READONLY_PASSWORD
      }
    }
  },
  
  // Performance thresholds (stricter for production)
  performance: {
    pageLoadTime: 3000,
    apiResponseTime: 1000,
    resourceLoadTime: 2000
  },
  
  // Accessibility settings
  accessibility: {
    enabled: true,
    standards: ['WCAG2A', 'WCAG2AA', 'WCAG2AAA'],
    includeWarnings: true
  },
  
  // Security settings
  security: {
    enableSSLVerification: true,
    allowSelfSignedCerts: false,
    enableCSPValidation: true
  },
  
  // Rate limiting
  rateLimiting: {
    enabled: true,
    requestsPerSecond: 5,
    burstLimit: 10
  }
};


