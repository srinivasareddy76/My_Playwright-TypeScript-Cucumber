


import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { getEnvironmentConfig, getBrowserConfig } from '../../config/environment';
import { Logger } from '../utilities/logger';
import { BrowserManager } from '../utilities/browserManager';

export interface ICustomWorld extends World {
  // Browser instances
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  
  // Configuration
  config: ReturnType<typeof getEnvironmentConfig>;
  browserConfig: ReturnType<typeof getBrowserConfig>;
  
  // Utilities
  logger: Logger;
  browserManager: BrowserManager;
  
  // Test data
  testData: Record<string, any>;
  
  // Screenshots and videos
  screenshotPath?: string;
  videoPath?: string;
  tracePath?: string;
  
  // API client
  apiClient?: any;
  
  // Database client
  dbClient?: any;
  
  // Feature and scenario info
  featureName?: string;
  scenarioName?: string;
  scenarioTags?: string[];
  
  // Test results
  testResults: {
    startTime?: Date;
    endTime?: Date;
    duration?: number;
    status?: 'passed' | 'failed' | 'skipped';
    error?: Error;
    screenshots?: string[];
    videos?: string[];
    traces?: string[];
  };

  // Viewport management methods
  setMobileViewport(): Promise<void>;
  setTabletViewport(): Promise<void>;
  setDesktopViewport(): Promise<void>;

  // Navigation helper methods
  goBack(): Promise<void>;
  goForward(): Promise<void>;
  refreshCurrentPage(): Promise<void>;
}

export class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  
  config: ReturnType<typeof getEnvironmentConfig>;
  browserConfig: ReturnType<typeof getBrowserConfig>;
  
  logger: Logger;
  browserManager: BrowserManager;
  
  testData: Record<string, any> = {};
  
  screenshotPath?: string;
  videoPath?: string;
  tracePath?: string;
  
  apiClient?: any;
  dbClient?: any;
  
  featureName?: string;
  scenarioName?: string;
  scenarioTags?: string[];
  
  testResults: ICustomWorld['testResults'] = {};

  constructor(options: IWorldOptions) {
    super(options);
    
    // Initialize configuration
    this.config = getEnvironmentConfig();
    this.browserConfig = getBrowserConfig();
    
    // Initialize logger
    this.logger = new Logger({
      level: this.config.logging.level,
      enableConsole: this.config.logging.enableConsole,
      enableFile: this.config.logging.enableFile,
      filePath: this.config.logging.filePath
    });
    
    // Initialize browser manager
    this.browserManager = new BrowserManager(this.config, this.logger);
    
    // Log world initialization
    this.logger.info('CustomWorld initialized', {
      environment: this.config.environment,
      baseUrl: this.config.baseUrl,
      browser: this.browserConfig.browser,
      viewport: this.browserConfig.viewport
    });
  }

  /**
   * Initialize browser for the test
   */
  async initializeBrowser(): Promise<void> {
    try {
      this.logger.info('Initializing browser', {
        browser: this.browserConfig.browser,
        headed: this.browserConfig.headed,
        viewport: this.browserConfig.viewport
      });

      // Launch browser
      this.browser = await this.browserManager.launchBrowser();
      
      // Create context
      this.context = await this.browserManager.createContext(this.browser);
      
      // Create page
      this.page = await this.browserManager.createPage(this.context);
      
      this.logger.info('Browser initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize browser', error);
      throw error;
    }
  }

  /**
   * Close browser and cleanup
   */
  async closeBrowser(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = undefined;
      }
      
      if (this.context) {
        await this.context.close();
        this.context = undefined;
      }
      
      if (this.browser) {
        await this.browser.close();
        this.browser = undefined;
      }
      
      this.logger.info('Browser closed successfully');
    } catch (error) {
      this.logger.error('Failed to close browser', error);
      throw error;
    }
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name?: string): Promise<string | undefined> {
    if (!this.page || !this.config.enableScreenshots) {
      return undefined;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotName = name || `screenshot-${timestamp}`;
      const screenshotPath = `${this.config.logging.filePath.replace('.log', '')}/screenshots/${screenshotName}.png`;
      
      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      
      this.testResults.screenshots = this.testResults.screenshots || [];
      this.testResults.screenshots.push(screenshotPath);
      
      this.logger.info('Screenshot taken', { path: screenshotPath });
      return screenshotPath;
    } catch (error) {
      this.logger.error('Failed to take screenshot', error);
      return undefined;
    }
  }

  /**
   * Start video recording
   */
  async startVideoRecording(): Promise<void> {
    if (!this.page || !this.config.enableVideoRecording) {
      return;
    }

    try {
      // Video recording is handled by browser context options
      this.logger.info('Video recording started');
    } catch (error) {
      this.logger.error('Failed to start video recording', error);
    }
  }

  /**
   * Stop video recording
   */
  async stopVideoRecording(): Promise<string | undefined> {
    if (!this.page || !this.config.enableVideoRecording) {
      return undefined;
    }

    try {
      const videoPath = await this.page.video()?.path();
      if (videoPath) {
        this.testResults.videos = this.testResults.videos || [];
        this.testResults.videos.push(videoPath);
        this.logger.info('Video recording stopped', { path: videoPath });
      }
      return videoPath;
    } catch (error) {
      this.logger.error('Failed to stop video recording', error);
      return undefined;
    }
  }

  /**
   * Start tracing
   */
  async startTracing(): Promise<void> {
    if (!this.context || !this.config.enableTracing) {
      return;
    }

    try {
      await this.context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true
      });
      this.logger.info('Tracing started');
    } catch (error) {
      this.logger.error('Failed to start tracing', error);
    }
  }

  /**
   * Stop tracing
   */
  async stopTracing(name?: string): Promise<string | undefined> {
    if (!this.context || !this.config.enableTracing) {
      return undefined;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const traceName = name || `trace-${timestamp}`;
      const tracePath = `${this.config.logging.filePath.replace('.log', '')}/traces/${traceName}.zip`;
      
      await this.context.tracing.stop({ path: tracePath });
      
      this.testResults.traces = this.testResults.traces || [];
      this.testResults.traces.push(tracePath);
      
      this.logger.info('Tracing stopped', { path: tracePath });
      return tracePath;
    } catch (error) {
      this.logger.error('Failed to stop tracing', error);
      return undefined;
    }
  }

  /**
   * Set test data
   */
  setTestData(key: string, value: any): void {
    this.testData[key] = value;
    this.logger.debug('Test data set', { key, value });
  }

  /**
   * Get test data
   */
  getTestData(key: string): any {
    return this.testData[key];
  }

  /**
   * Clear test data
   */
  clearTestData(): void {
    this.testData = {};
    this.logger.debug('Test data cleared');
  }

  /**
   * Set scenario information
   */
  setScenarioInfo(featureName: string, scenarioName: string, tags: string[]): void {
    this.featureName = featureName;
    this.scenarioName = scenarioName;
    this.scenarioTags = tags;
    
    this.logger.info('Scenario info set', {
      feature: featureName,
      scenario: scenarioName,
      tags
    });
  }

  /**
   * Start test execution timer
   */
  startTimer(): void {
    this.testResults.startTime = new Date();
  }

  /**
   * Stop test execution timer
   */
  stopTimer(): void {
    this.testResults.endTime = new Date();
    if (this.testResults.startTime) {
      this.testResults.duration = this.testResults.endTime.getTime() - this.testResults.startTime.getTime();
    }
  }

  /**
   * Set test result status
   */
  setTestResult(status: 'passed' | 'failed' | 'skipped', error?: Error): void {
    this.testResults.status = status;
    if (error) {
      this.testResults.error = error;
    }
  }

  /**
   * Get test execution summary
   */
  getTestSummary(): ICustomWorld['testResults'] {
    return this.testResults;
  }
}

// Set the custom world constructor
setWorldConstructor(CustomWorld);

export { CustomWorld as World };



