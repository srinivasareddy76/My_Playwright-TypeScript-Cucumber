




import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Page, Browser, BrowserContext } from '@playwright/test';
import { BrowserManager } from '../utils/browser-manager';
import { EnvironmentManager } from '../config/environment';
import { Logger } from '../utils/logger';
import { HomePage } from '../../tests/apps/frbsf/pages/home-page';
import { SearchResultsPage } from '../../tests/apps/frbsf/pages/search-results-page';

export interface ICustomWorld extends World {
  // Browser instances
  browser?: Browser | undefined;
  context?: BrowserContext | undefined;
  page?: Page | undefined;
  
  // Managers and utilities
  browserManager: BrowserManager;
  environmentManager: EnvironmentManager;
  logger: Logger;
  
  // Page Object Models
  homePage: HomePage;
  searchResultsPage: SearchResultsPage;
  
  // Test data and state
  testData: Map<string, any>;
  scenarioContext: Map<string, any>;
  
  // Screenshots and artifacts
  screenshots: string[];
  traces: string[];
  
  // Test metadata
  currentScenario?: string | undefined;
  currentStep?: string | undefined;
  testStartTime?: number | undefined;
  
  // Helper methods
  initializePageObjects(): Promise<void>;
  cleanupTestData(): void;
  captureScreenshot(name?: string): Promise<string>;
  captureTrace(name?: string): Promise<string>;
  stopTrace(path: string): Promise<void>;
  setTestData(key: string, value: any): void;
  getTestData(key: string): any;
  setScenarioContext(key: string, value: any): void;
  getScenarioContext(key: string): any;
  
  // Viewport management methods
  setMobileViewport(): Promise<void>;
  setTabletViewport(): Promise<void>;
  setDesktopViewport(): Promise<void>;
  
  // Page management methods
  refreshCurrentPage(): Promise<void>;
  waitForPageLoad(): Promise<void>;
  validateCurrentPageLoaded(): Promise<boolean>;
  
  // Performance measurement methods
  startPerformanceMeasurement(): void;
  endPerformanceMeasurement(actionName: string): number;
}

export class CustomWorld extends World implements ICustomWorld {
  public browser?: Browser | undefined;
  public context?: BrowserContext | undefined;
  public page?: Page | undefined;
  
  public browserManager: BrowserManager;
  public environmentManager: EnvironmentManager;
  public logger: Logger;
  
  public homePage: HomePage;
  public searchResultsPage: SearchResultsPage;
  
  public testData: Map<string, any>;
  public scenarioContext: Map<string, any>;
  
  public screenshots: string[];
  public traces: string[];
  
  public currentScenario?: string;
  public currentStep?: string;
  public testStartTime?: number;

  constructor(options: IWorldOptions) {
    super(options);
    
    // Initialize managers and utilities
    this.browserManager = BrowserManager.getInstance();
    this.environmentManager = EnvironmentManager.getInstance();
    this.logger = Logger.getInstance();
    
    // Initialize data storage
    this.testData = new Map<string, any>();
    this.scenarioContext = new Map<string, any>();
    this.screenshots = [];
    this.traces = [];
    
    // Initialize page objects (will be properly set up in initializePageObjects)
    this.homePage = new HomePage();
    this.searchResultsPage = new SearchResultsPage();
    
    this.logger.info('CustomWorld initialized');
  }

  public async initializePageObjects(): Promise<void> {
    try {
      // Get the current page from browser manager
      this.page = await this.browserManager.getCurrentPage();
      // Note: These will be set when browser context is created
      this.context = this.browserManager['context'] || undefined;
      this.browser = this.browserManager['browser'] || undefined;
      
      // Initialize page objects with the current page
      this.homePage = new HomePage(this.page);
      this.searchResultsPage = new SearchResultsPage(this.page);
      
      this.logger.info('Page objects initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize page objects', error);
      throw error;
    }
  }

  public cleanupTestData(): void {
    this.testData.clear();
    this.scenarioContext.clear();
    this.screenshots = [];
    this.traces = [];
    delete this.currentScenario;
    delete this.currentStep;
    delete this.testStartTime;
    
    this.logger.info('Test data cleaned up');
  }

  public async captureScreenshot(name?: string): Promise<string> {
    try {
      const screenshotName = name || `screenshot-${Date.now()}`;
      const screenshotPath = await this.browserManager.takeScreenshot(screenshotName);
      this.screenshots.push(screenshotPath);
      
      this.logger.screenshot(screenshotPath);
      return screenshotPath;
    } catch (error) {
      this.logger.error('Failed to capture screenshot', error);
      throw error;
    }
  }

  public async captureTrace(name?: string): Promise<string> {
    try {
      const traceName = name || `trace-${Date.now()}`;
      const tracePath = await this.browserManager.captureTrace(traceName);
      this.traces.push(tracePath);
      
      this.logger.info(`Trace capture started: ${tracePath}`);
      return tracePath;
    } catch (error) {
      this.logger.error('Failed to start trace capture', error);
      throw error;
    }
  }

  public async stopTrace(path: string): Promise<void> {
    try {
      await this.browserManager.stopTrace(path);
      this.logger.info(`Trace saved: ${path}`);
    } catch (error) {
      this.logger.error('Failed to stop trace capture', error);
      throw error;
    }
  }

  public setTestData(key: string, value: any): void {
    this.testData.set(key, value);
    this.logger.debug(`Test data set: ${key} = ${JSON.stringify(value)}`);
  }

  public getTestData(key: string): any {
    const value = this.testData.get(key);
    this.logger.debug(`Test data retrieved: ${key} = ${JSON.stringify(value)}`);
    return value;
  }

  public setScenarioContext(key: string, value: any): void {
    this.scenarioContext.set(key, value);
    this.logger.debug(`Scenario context set: ${key} = ${JSON.stringify(value)}`);
  }

  public getScenarioContext(key: string): any {
    const value = this.scenarioContext.get(key);
    this.logger.debug(`Scenario context retrieved: ${key} = ${JSON.stringify(value)}`);
    return value;
  }

  // Helper methods for common test operations
  public async navigateToHomePage(): Promise<void> {
    await this.homePage.navigateToHomePage();
    this.setScenarioContext('currentPage', 'home');
  }

  public async performSearch(searchTerm: string): Promise<void> {
    await this.homePage.performSearch(searchTerm);
    this.setScenarioContext('searchTerm', searchTerm);
    this.setScenarioContext('currentPage', 'search-results');
  }

  // Validation helper methods
  public async validateCurrentPageLoaded(): Promise<boolean> {
    const currentPage = this.getScenarioContext('currentPage');
    
    switch (currentPage) {
      case 'home':
        return await this.homePage.isPageLoaded();
      case 'search-results':
        return await this.searchResultsPage.isPageLoaded();
      default:
        this.logger.warn(`Unknown page type: ${currentPage}`);
        return false;
    }
  }

  // Performance measurement helpers
  public startPerformanceMeasurement(): void {
    this.testStartTime = Date.now();
    this.logger.info('Performance measurement started');
  }

  public endPerformanceMeasurement(actionName: string): number {
    if (!this.testStartTime) {
      this.logger.warn('Performance measurement was not started');
      return 0;
    }
    
    const duration = Date.now() - this.testStartTime;
    this.logger.performance(actionName, duration);
    delete this.testStartTime;
    
    return duration;
  }

  // Error handling helpers
  public async handleTestFailure(error: Error, stepName?: string): Promise<void> {
    this.logger.error(`Test failure in step: ${stepName || 'unknown'}`, error);
    
    try {
      // Capture screenshot on failure
      await this.captureScreenshot(`failure-${stepName || 'unknown'}-${Date.now()}`);
      
      // Log current page information
      if (this.page) {
        const currentUrl = this.page.url();
        const pageTitle = await this.page.title();
        this.logger.error(`Failure occurred on page: ${currentUrl} (${pageTitle})`);
      }
      
      // Log scenario context
      const contextEntries = Array.from(this.scenarioContext.entries());
      if (contextEntries.length > 0) {
        this.logger.error('Scenario context at failure:', Object.fromEntries(contextEntries));
      }
    } catch (screenshotError) {
      this.logger.error('Failed to capture failure screenshot', screenshotError);
    }
  }

  // Browser management helpers
  public async refreshCurrentPage(): Promise<void> {
    if (this.page) {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      this.logger.info('Page refreshed');
    }
  }

  public async goBack(): Promise<void> {
    if (this.page) {
      await this.page.goBack({ waitUntil: 'domcontentloaded' });
      this.logger.info('Navigated back');
    }
  }

  public async goForward(): Promise<void> {
    if (this.page) {
      await this.page.goForward({ waitUntil: 'domcontentloaded' });
      this.logger.info('Navigated forward');
    }
  }

  // Viewport management helpers
  public async setMobileViewport(): Promise<void> {
    if (this.page) {
      await this.page.setViewportSize({ width: 375, height: 667 });
      this.setScenarioContext('viewport', 'mobile');
      this.logger.info('Viewport set to mobile');
    }
  }

  public async setTabletViewport(): Promise<void> {
    if (this.page) {
      await this.page.setViewportSize({ width: 768, height: 1024 });
      this.setScenarioContext('viewport', 'tablet');
      this.logger.info('Viewport set to tablet');
    }
  }

  public async setDesktopViewport(): Promise<void> {
    if (this.page) {
      await this.page.setViewportSize({ width: 1920, height: 1080 });
      this.setScenarioContext('viewport', 'desktop');
      this.logger.info('Viewport set to desktop');
    }
  }

  // Wait helpers
  public async waitForPageLoad(): Promise<void> {
    if (this.page) {
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      this.logger.info('Page load completed');
    }
  }

  public async waitForTimeout(milliseconds: number): Promise<void> {
    await this.page?.waitForTimeout(milliseconds);
    this.logger.info(`Waited for ${milliseconds}ms`);
  }

  

  
}

// Set the custom world constructor for Cucumber
setWorldConstructor(CustomWorld);

export default CustomWorld;





