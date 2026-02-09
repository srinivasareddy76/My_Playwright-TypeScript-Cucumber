






import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { ICustomWorld } from './world';
import { BrowserManager } from '../utils/browser-manager';
import { EnvironmentManager } from '../config/environment';
import { Logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

// Global instances
let browserManager: BrowserManager;
let environmentManager: EnvironmentManager;
let logger: Logger;

// Test execution statistics
const testStats = {
  totalScenarios: 0,
  passedScenarios: 0,
  failedScenarios: 0,
  skippedScenarios: 0,
  startTime: 0,
  endTime: 0
};

BeforeAll(async function () {
  // Initialize global instances
  browserManager = BrowserManager.getInstance();
  environmentManager = EnvironmentManager.getInstance();
  logger = Logger.getInstance();

  // Create necessary directories
  await createDirectories();

  // Log test execution start
  testStats.startTime = Date.now();
  logger.info('='.repeat(80));
  logger.info('TEST EXECUTION STARTED');
  logger.info('='.repeat(80));
  logger.info(`Environment: ${environmentManager.getEnvironmentName()}`);
  logger.info(`Base URL: ${environmentManager.getBaseUrl()}`);
  logger.info(`Browser: ${process.env.BROWSER || 'chromium'}`);
  logger.info(`Headless: ${environmentManager.getBrowserConfig().headless}`);
  logger.info(`Viewport: ${JSON.stringify(environmentManager.getBrowserConfig().viewport)}`);
  logger.info('='.repeat(80));

  // Launch browser
  try {
    await browserManager.launchBrowser();
    logger.info('Browser launched successfully for test suite');
  } catch (error) {
    logger.error('Failed to launch browser for test suite', error);
    throw error;
  }
});

AfterAll(async function () {
  // Calculate test execution statistics
  testStats.endTime = Date.now();
  const totalDuration = testStats.endTime - testStats.startTime;

  // Log test execution summary
  logger.info('='.repeat(80));
  logger.info('TEST EXECUTION COMPLETED');
  logger.info('='.repeat(80));
  logger.info(`Total Scenarios: ${testStats.totalScenarios}`);
  logger.info(`Passed: ${testStats.passedScenarios}`);
  logger.info(`Failed: ${testStats.failedScenarios}`);
  logger.info(`Skipped: ${testStats.skippedScenarios}`);
  logger.info(`Total Duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);
  logger.info(`Success Rate: ${testStats.totalScenarios > 0 ? ((testStats.passedScenarios / testStats.totalScenarios) * 100).toFixed(2) : 0}%`);
  logger.info('='.repeat(80));

  // Close browser
  try {
    await browserManager.closeBrowser();
    logger.info('Browser closed successfully');
  } catch (error) {
    logger.error('Failed to close browser', error);
  }

  // Generate test summary report
  await generateTestSummary();
});

Before(async function (this: ICustomWorld, scenario) {
  // Initialize scenario
  this.currentScenario = scenario.pickle.name;
  testStats.totalScenarios++;

  logger.scenario(this.currentScenario, 'START');

  try {
    // Create browser context for scenario
    await browserManager.createContext();
    
    // Initialize page objects
    // await this.initializePageObjects();

    // Set scenario start time for performance measurement
    // this.startPerformanceMeasurement();

    // Log scenario tags
    const tags = scenario.pickle.tags.map(tag => tag.name).join(', ');
    if (tags) {
      logger.info(`Scenario tags: ${tags}`);
    }

    // Set up scenario-specific configuration
    await setupScenarioConfiguration(this, scenario);

  } catch (error) {
    logger.error(`Failed to set up scenario: ${this.currentScenario}`, error);
    throw error;
  }
});

After(async function (this: ICustomWorld, scenario) {
  const scenarioName = this.currentScenario || 'Unknown Scenario';
  let scenarioStatus: 'PASSED' | 'FAILED' | 'SKIPPED' = 'PASSED';

  try {
    // Determine scenario status
    if (scenario.result?.status === Status.FAILED) {
      scenarioStatus = 'FAILED';
      testStats.failedScenarios++;
      
      // Handle test failure
      const error = scenario.result.message ? new Error(scenario.result.message) : new Error('Scenario failed');
      // await this.handleTestFailure(error, scenarioName);
      
    } else if (scenario.result?.status === Status.SKIPPED) {
      scenarioStatus = 'SKIPPED';
      testStats.skippedScenarios++;
    } else {
      testStats.passedScenarios++;
    }

    // Measure scenario performance
    // const scenarioDuration = this.endPerformanceMeasurement(`Scenario: ${scenarioName}`);

    // Capture final screenshot for failed scenarios
    if (scenarioStatus === 'FAILED') {
      try {
        await this.captureScreenshot(`failed-scenario-${scenarioName.replace(/\s+/g, '-')}`);
      } catch (screenshotError) {
        logger.error('Failed to capture failure screenshot', screenshotError);
      }
    }

    // Log scenario completion
    logger.scenario(scenarioName, 'END', scenarioStatus);
    logger.info(`Scenario duration: ${scenarioDuration}ms`);

  } catch (error) {
    logger.error(`Error in After hook for scenario: ${scenarioName}`, error);
  } finally {
    try {
      // Clean up scenario data
      // this.cleanupTestData();

      // Close browser context
      await browserManager.closeContext();

    } catch (cleanupError) {
      logger.error('Error during scenario cleanup', cleanupError);
    }
  }
});

// Helper function to create necessary directories
async function createDirectories(): Promise<void> {
  const directories = [
    'reports',
    'reports/screenshots',
    'reports/videos',
    'reports/traces',
    'test-results'
  ];

  for (const dir of directories) {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.info(`Created directory: ${dirPath}`);
    }
  }
}

// Helper function to set up scenario-specific configuration
async function setupScenarioConfiguration(world: ICustomWorld, scenario: any): Promise<void> {
  const tags = scenario.pickle.tags.map((tag: any) => tag.name);

  // Handle responsive design tags
  if (tags.includes('@mobile')) {
    await world.setMobileViewport();
  } else if (tags.includes('@tablet')) {
    await world.setTabletViewport();
  } else if (tags.includes('@desktop')) {
    await world.setDesktopViewport();
  }

  // Handle performance testing tags
  if (tags.includes('@performance')) {
    world.setScenarioContext('performanceTest', true);
    world.setScenarioContext('performanceThreshold', 5000); // 5 seconds default
  }

  // Handle critical test tags
  if (tags.includes('@critical')) {
    world.setScenarioContext('criticalTest', true);
    // Enable video recording for critical tests
    if (world.context) {
      // Video recording is already enabled in browser config
      logger.info('Video recording enabled for critical test');
    }
  }

  // Handle smoke test tags
  if (tags.includes('@smoke')) {
    // world.setScenarioContext('smokeTest', true);
  }

  // Handle specific page tags
  if (tags.includes('@homepage')) {
    // world.setScenarioContext('targetPage', 'home');
  } else if (tags.includes('@search')) {
    // world.setScenarioContext('targetPage', 'search');
  } else if (tags.includes('@research')) {
    // world.setScenarioContext('targetPage', 'research');
  } else if (tags.includes('@news')) {
    // world.setScenarioContext('targetPage', 'news');
  }

  // Handle browser-specific tags
  if (tags.includes('@chromium-only') && process.env.BROWSER !== 'chromium') {
    throw new Error('This scenario requires Chromium browser');
  }
  if (tags.includes('@firefox-only') && process.env.BROWSER !== 'firefox') {
    throw new Error('This scenario requires Firefox browser');
  }
  if (tags.includes('@webkit-only') && process.env.BROWSER !== 'webkit') {
    throw new Error('This scenario requires WebKit browser');
  }

  // Handle environment-specific tags
  if (tags.includes('@t3-only') && environmentManager.getEnvironmentName() !== 't3') {
    throw new Error('This scenario can only run in T3 environment');
  }
  if (tags.includes('@t5-only') && environmentManager.getEnvironmentName() !== 't5') {
    throw new Error('This scenario can only run in T5 environment');
  }

  logger.info(`Scenario configuration completed for: ${scenario.pickle.name}`);
}

// Helper function to generate test summary report
async function generateTestSummary(): Promise<void> {
  const summaryData = {
    executionSummary: {
      startTime: new Date(testStats.startTime).toISOString(),
      endTime: new Date(testStats.endTime).toISOString(),
      duration: testStats.endTime - testStats.startTime,
      environment: environmentManager.getEnvironmentName(),
      baseUrl: environmentManager.getBaseUrl(),
      browser: process.env.BROWSER || 'chromium',
      headless: environmentManager.getBrowserConfig().headless,
      viewport: environmentManager.getBrowserConfig().viewport
    },
    results: {
      total: testStats.totalScenarios,
      passed: testStats.passedScenarios,
      failed: testStats.failedScenarios,
      skipped: testStats.skippedScenarios,
      successRate: testStats.totalScenarios > 0 ? ((testStats.passedScenarios / testStats.totalScenarios) * 100).toFixed(2) : '0'
    }
  };

  const summaryPath = path.join(process.cwd(), 'reports', 'test-summary.json');
  
  try {
    fs.writeFileSync(summaryPath, JSON.stringify(summaryData, null, 2));
    logger.info(`Test summary report generated: ${summaryPath}`);
  } catch (error) {
    logger.error('Failed to generate test summary report', error);
  }
}

// Export test statistics for external use
export { testStats };







