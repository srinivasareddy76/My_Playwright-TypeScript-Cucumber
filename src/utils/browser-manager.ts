


import { Browser, BrowserContext, Page, chromium, firefox, webkit, BrowserType } from '@playwright/test';
import { EnvironmentManager } from '../config/environment';
import { Logger } from './logger';

export class BrowserManager {
  private static instance: BrowserManager;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private environmentManager: EnvironmentManager;
  private logger: Logger;

  private constructor() {
    this.environmentManager = EnvironmentManager.getInstance();
    this.logger = Logger.getInstance();
  }

  public static getInstance(): BrowserManager {
    if (!BrowserManager.instance) {
      BrowserManager.instance = new BrowserManager();
    }
    return BrowserManager.instance;
  }

  public async launchBrowser(): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }

    const browserConfig = this.environmentManager.getBrowserConfig();
    const browserType = this.getBrowserType();

    this.logger.info(`Launching ${browserType} browser`, {
      headless: browserConfig.headless,
      viewport: browserConfig.viewport
    });

    try {
      // Platform-specific browser arguments
      const isWindows = process.platform === 'win32';
      const baseArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--allow-running-insecure-content',
        '--disable-features=VizDisplayCompositor'
      ];

      // Add Windows-specific args for better headed mode support
      if (isWindows && !browserConfig.headless) {
        baseArgs.push(
          '--disable-gpu-sandbox',
          '--disable-software-rasterizer',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        );
      }

      this.browser = await browserType.launch({
        headless: browserConfig.headless,
        slowMo: browserConfig.slowMo,
        args: baseArgs
      });

      this.logger.info('Browser launched successfully');
      return this.browser;
    } catch (error) {
      this.logger.error('Failed to launch browser', error);
      throw error;
    }
  }

  public async createContext(): Promise<BrowserContext> {
    if (!this.browser) {
      await this.launchBrowser();
    }

    if (this.context) {
      return this.context;
    }

    const browserConfig = this.environmentManager.getBrowserConfig();

    this.logger.info('Creating browser context', {
      viewport: browserConfig.viewport,
      video: browserConfig.video,
      screenshot: browserConfig.screenshot
    });

    try {
      const contextOptions: any = {
        viewport: browserConfig.viewport,
        recordHar: {
          path: './reports/network.har'
        }
      };

      if (browserConfig.video) {
        contextOptions.recordVideo = {
          dir: './reports/videos/',
          size: browserConfig.viewport
        };
      }

      this.context = await this.browser!.newContext(contextOptions);

      // Set default timeouts
      this.context.setDefaultTimeout(browserConfig.timeout);
      this.context.setDefaultNavigationTimeout(this.environmentManager.getConfig().pageLoadTimeout);

      this.logger.info('Browser context created successfully');
      return this.context;
    } catch (error) {
      this.logger.error('Failed to create browser context', error);
      throw error;
    }
  }

  public async createPage(): Promise<Page> {
    if (!this.context) {
      await this.createContext();
    }

    if (this.page && !this.page.isClosed()) {
      return this.page;
    }

    this.logger.info('Creating new page');

    try {
      this.page = await this.context!.newPage();

      // Set page-specific timeouts
      const config = this.environmentManager.getConfig();
      this.page.setDefaultTimeout(config.elementTimeout);
      this.page.setDefaultNavigationTimeout(config.pageLoadTimeout);

      // Add console and error listeners
      this.page.on('console', (msg) => {
        if (msg.type() === 'error') {
          this.logger.error(`Console error: ${msg.text()}`);
        } else if (process.env.DEBUG === 'true') {
          this.logger.debug(`Console ${msg.type()}: ${msg.text()}`);
        }
      });

      this.page.on('pageerror', (error) => {
        this.logger.error('Page error occurred', error);
      });

      this.page.on('requestfailed', (request) => {
        this.logger.warn(`Request failed: ${request.url()} - ${request.failure()?.errorText}`);
      });

      this.logger.info('Page created successfully');
      return this.page;
    } catch (error) {
      this.logger.error('Failed to create page', error);
      throw error;
    }
  }

  public async getCurrentPage(): Promise<Page> {
    if (!this.page || this.page.isClosed()) {
      return await this.createPage();
    }
    return this.page;
  }

  public async closePage(): Promise<void> {
    if (this.page && !this.page.isClosed()) {
      this.logger.info('Closing page');
      await this.page.close();
      this.page = null;
    }
  }

  public async closeContext(): Promise<void> {
    if (this.context) {
      try {
        this.logger.info('Closing browser context');
        // Try to close the context, but handle if it's already closed
        await Promise.race([
          this.context.close(),
          new Promise(resolve => setTimeout(resolve, 1000)) // 1 second timeout
        ]);
      } catch (error) {
        // Context might already be closed, log but don't throw
        this.logger.info('Context already closed or error during close - this is expected for some tests');
      } finally {
        this.context = null;
        this.page = null;
      }
    }
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      this.logger.info('Closing browser');
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
  }

  public async takeScreenshot(name: string): Promise<string> {
    const page = await this.getCurrentPage();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    const path = `./reports/screenshots/${filename}`;

    try {
      await page.screenshot({
        path,
        fullPage: true
      });
      this.logger.screenshot(path);
      return path;
    } catch (error) {
      this.logger.error('Failed to take screenshot', error);
      throw error;
    }
  }

  public async captureTrace(name: string): Promise<string> {
    if (!this.context) {
      throw new Error('Browser context not available for trace capture');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.zip`;
    const path = `./reports/traces/${filename}`;

    try {
      await this.context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true
      });

      // Trace will be stopped and saved by the caller
      this.logger.info(`Trace capture started for: ${name}`);
      return path;
    } catch (error) {
      this.logger.error('Failed to start trace capture', error);
      throw error;
    }
  }

  public async stopTrace(path: string): Promise<void> {
    if (!this.context) {
      throw new Error('Browser context not available for trace stop');
    }

    try {
      await this.context.tracing.stop({ path });
      this.logger.info(`Trace saved to: ${path}`);
    } catch (error) {
      this.logger.error('Failed to stop trace capture', error);
      throw error;
    }
  }

  private getBrowserType(): BrowserType {
    const browserName = process.env.BROWSER || 'chromium';

    switch (browserName.toLowerCase()) {
      case 'firefox':
        return firefox;
      case 'webkit':
      case 'safari':
        return webkit;
      case 'chromium':
      case 'chrome':
      default:
        return chromium;
    }
  }

  public async navigateToUrl(url: string): Promise<void> {
    const page = await this.getCurrentPage();
    const startTime = Date.now();

    this.logger.pageAction('BrowserManager', `Navigating to: ${url}`);

    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: this.environmentManager.getConfig().pageLoadTimeout
      });

      const duration = Date.now() - startTime;
      this.logger.performance(`Navigation to ${url}`, duration);

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (error) {
      this.logger.error(`Failed to navigate to ${url}`, error);
      throw error;
    }
  }

  public async waitForPageLoad(): Promise<void> {
    const page = await this.getCurrentPage();
    
    try {
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      this.logger.info('Page loaded successfully');
    } catch (error) {
      this.logger.warn('Page load wait timed out, continuing...', error);
    }
  }

  public async refreshPage(): Promise<void> {
    const page = await this.getCurrentPage();
    this.logger.pageAction('BrowserManager', 'Refreshing page');
    
    try {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await this.waitForPageLoad();
    } catch (error) {
      this.logger.error('Failed to refresh page', error);
      throw error;
    }
  }
}

export default BrowserManager;



