






import { Before, BeforeAll, BeforeStep } from '@cucumber/cucumber';
import { ICustomWorld } from '../world/customWorld';
import { getEnvironmentConfig } from '../../config/environment';
import { createLogger } from '../utilities/logger';

// Global logger for hooks
const logger = createLogger({ filePath: './reports/hooks.log' });

/**
 * Before All Hook - Runs once before all scenarios
 */
BeforeAll(async function () {
  const config = getEnvironmentConfig();
  
  logger.info('===============================================================================');
  logger.info('TEST EXECUTION STARTED');
  logger.info('===============================================================================');
  logger.info('Environment Configuration', {
    environment: config.environment,
    baseUrl: config.baseUrl,
    browser: config.browser,
    headed: config.headed,
    viewport: config.viewport,
    parallel: config.parallel,
    retry: config.retry
  });
  
  // Create reports directories
  const fs = require('fs');
  const path = require('path');
  
  const reportDirs = [
    './reports',
    './reports/screenshots',
    './reports/videos',
    './reports/traces',
    './reports/cucumber-html',
    './reports/allure'
  ];
  
  reportDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  });
  
  logger.info('Test environment setup completed');
});

/**
 * Before Hook - Runs before each scenario
 */
Before(async function (this: ICustomWorld, scenario) {
  // Set scenario information
  const featureName = scenario.gherkinDocument?.feature?.name || 'Unknown Feature';
  const scenarioName = scenario.pickle.name;
  const tags = scenario.pickle.tags.map(tag => tag.name);
  
  this.setScenarioInfo(featureName, scenarioName, tags);
  this.startTimer();
  
  // Log scenario start
  this.logger.scenarioStart(scenarioName, tags);
  
  // Initialize browser for UI tests
  if (this.shouldInitializeBrowser(tags)) {
    await this.initializeBrowser();
    
    // Start video recording if enabled
    if (this.config.enableVideoRecording) {
      await this.startVideoRecording();
    }
    
    // Start tracing if enabled
    if (this.config.enableTracing) {
      await this.startTracing();
    }
  }
  
  // Set up API client for API tests
  if (this.shouldInitializeApiClient(tags)) {
    await this.initializeApiClient();
  }
  
  // Set up database client for database tests
  if (this.shouldInitializeDatabaseClient(tags)) {
    await this.initializeDatabaseClient();
  }
  
  this.logger.info('Scenario setup completed', {
    feature: featureName,
    scenario: scenarioName,
    tags
  });
});

/**
 * Before Hook for critical tests - Additional setup
 */
Before({ tags: '@critical' }, async function (this: ICustomWorld) {
  this.logger.info('Critical test detected - enabling enhanced monitoring');
  
  // Enable video recording for critical tests
  if (this.browser && !this.config.enableVideoRecording) {
    this.logger.info('Enabling video recording for critical test');
    // Video recording is handled at context level
  }
  
  // Enable tracing for critical tests
  if (this.context && !this.config.enableTracing) {
    this.logger.info('Enabling tracing for critical test');
    await this.startTracing();
  }
});

/**
 * Before Hook for performance tests - Performance monitoring setup
 */
Before({ tags: '@performance' }, async function (this: ICustomWorld) {
  this.logger.info('Performance test detected - setting up performance monitoring');
  
  if (this.page) {
    // Enable performance monitoring
    await this.page.addInitScript(() => {
      // Mark performance start
      performance.mark('test-start');
    });
  }
  
  // Set performance test data
  this.setTestData('performanceMetrics', {
    startTime: Date.now(),
    thresholds: this.config.performance
  });
});

/**
 * Before Hook for accessibility tests - Accessibility setup
 */
Before({ tags: '@accessibility' }, async function (this: ICustomWorld) {
  this.logger.info('Accessibility test detected - setting up accessibility monitoring');
  
  if (this.page) {
    // Inject axe-core for accessibility testing
    try {
      await this.page.addScriptTag({
        url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js'
      });
      this.logger.info('Axe-core injected for accessibility testing');
    } catch (error) {
      this.logger.warn('Failed to inject axe-core', error);
    }
  }
});

/**
 * Before Hook for mobile tests - Mobile viewport setup
 */
Before({ tags: '@mobile' }, async function (this: ICustomWorld) {
  this.logger.info('Mobile test detected - setting mobile viewport');
  
  if (this.page) {
    await this.page.setViewportSize({ width: 375, height: 667 });
    this.logger.info('Mobile viewport set', { width: 375, height: 667 });
  }
});

/**
 * Before Hook for tablet tests - Tablet viewport setup
 */
Before({ tags: '@tablet' }, async function (this: ICustomWorld) {
  this.logger.info('Tablet test detected - setting tablet viewport');
  
  if (this.page) {
    await this.page.setViewportSize({ width: 768, height: 1024 });
    this.logger.info('Tablet viewport set', { width: 768, height: 1024 });
  }
});

/**
 * Before Hook for API tests - API client setup
 */
Before({ tags: '@api' }, async function (this: ICustomWorld) {
  this.logger.info('API test detected - setting up API client');
  
  if (!this.apiClient) {
    await this.initializeApiClient();
  }
});

/**
 * Before Hook for database tests - Database client setup
 */
Before({ tags: '@database' }, async function (this: ICustomWorld) {
  this.logger.info('Database test detected - setting up database client');
  
  if (!this.dbClient) {
    await this.initializeDatabaseClient();
  }
});

/**
 * Before Step Hook - Runs before each step
 */
BeforeStep(async function (this: ICustomWorld, { pickleStep }) {
  const stepText = pickleStep.text;
  this.logger.step(`Executing: ${stepText}`);
  
  // Take screenshot before step if enabled for debugging
  if (process.env.DEBUG === 'true' && this.page) {
    await this.takeScreenshot(`before-step-${Date.now()}`);
  }
});

/**
 * Helper method to determine if browser should be initialized
 */
declare module '../world/customWorld' {
  interface ICustomWorld {
    shouldInitializeBrowser(tags: string[]): boolean;
    shouldInitializeApiClient(tags: string[]): boolean;
    shouldInitializeDatabaseClient(tags: string[]): boolean;
    initializeApiClient(): Promise<void>;
    initializeDatabaseClient(): Promise<void>;
  }
}

// Extend CustomWorld with helper methods
const { CustomWorld } = require('../world/customWorld');

CustomWorld.prototype.shouldInitializeBrowser = function(tags: string[]): boolean {
  // Don't initialize browser for API-only tests
  if (tags.includes('@api') && !tags.includes('@ui')) {
    return false;
  }
  
  // Don't initialize browser for database-only tests
  if (tags.includes('@database') && !tags.includes('@ui')) {
    return false;
  }
  
  return true;
};

CustomWorld.prototype.shouldInitializeApiClient = function(tags: string[]): boolean {
  return tags.includes('@api');
};

CustomWorld.prototype.shouldInitializeDatabaseClient = function(tags: string[]): boolean {
  return tags.includes('@database');
};

CustomWorld.prototype.initializeApiClient = async function(): Promise<void> {
  try {
    // Import and initialize API client
    const { ApiClient } = require('../services/apiClient');
    this.apiClient = new ApiClient(this.config, this.logger);
    await this.apiClient.initialize();
    this.logger.info('API client initialized');
  } catch (error) {
    this.logger.error('Failed to initialize API client', error);
    throw error;
  }
};

CustomWorld.prototype.initializeDatabaseClient = async function(): Promise<void> {
  try {
    // Import and initialize database client
    const { DatabaseClient } = require('../services/dbClient');
    this.dbClient = new DatabaseClient(this.config.database, this.logger);
    await this.dbClient.connect();
    this.logger.info('Database client initialized');
  } catch (error) {
    this.logger.error('Failed to initialize database client', error);
    throw error;
  }
};






