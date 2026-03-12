



import { Browser, BrowserContext, Page, chromium, firefox, webkit, BrowserType } from '@playwright/test';
import { EnvironmentConfig } from '../../config/environment';
import { Logger } from './logger';

export class BrowserManager {
  private config: EnvironmentConfig;
  private logger: Logger;

  constructor(config: EnvironmentConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  /**
   * Launch browser based on configuration
   */
  async launchBrowser(): Promise<Browser> {
    const browserType = this.getBrowserType();
    const launchOptions = this.getLaunchOptions();

    this.logger.info('Launching browser', {
      browser: this.config.browser,
      options: launchOptions
    });

    try {
      const browser = await browserType.launch(launchOptions);
      this.logger.info('Browser launched successfully');
      return browser;
    } catch (error) {
      this.logger.error('Failed to launch browser', error);
      throw error;
    }
  }

  /**
   * Create browser context with configuration
   */
  async createContext(browser: Browser): Promise<BrowserContext> {
    const contextOptions = this.getContextOptions();

    this.logger.info('Creating browser context', { options: contextOptions });

    try {
      const context = await browser.newContext(contextOptions);
      
      // Set up event listeners
      this.setupContextEventListeners(context);
      
      this.logger.info('Browser context created successfully');
      return context;
    } catch (error) {
      this.logger.error('Failed to create browser context', error);
      throw error;
    }
  }

  /**
   * Create new page
   */
  async createPage(context: BrowserContext): Promise<Page> {
    this.logger.info('Creating new page');

    try {
      const page = await context.newPage();
      
      // Set up event listeners
      this.setupPageEventListeners(page);
      
      // Set default timeout
      page.setDefaultTimeout(this.config.timeout);
      page.setDefaultNavigationTimeout(this.config.timeout);
      
      this.logger.info('Page created successfully');
      return page;
    } catch (error) {
      this.logger.error('Failed to create page', error);
      throw error;
    }
  }

  /**
   * Get browser type based on configuration
   */
  private getBrowserType(): BrowserType {
    switch (this.config.browser.toLowerCase()) {
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

  /**
   * Get browser launch options
   */
  private getLaunchOptions() {
    return {
      headless: !this.config.headed,
      slowMo: this.config.slowMo,
      args: this.getBrowserArgs(),
      timeout: this.config.timeout,
      devtools: this.config.headed && process.env.DEBUG === 'true'
    };
  }

  /**
   * Get browser arguments
   */
  private getBrowserArgs(): string[] {
    const args = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ];

    // Add viewport args if not headed
    if (!this.config.headed) {
      args.push(`--window-size=${this.config.viewport.width},${this.config.viewport.height}`);
    }

    // Add additional args based on environment
    if (this.config.environment === 'ci' || process.env.CI === 'true') {
      args.push(
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      );
    }

    return args;
  }

  /**
   * Get browser context options
   */
  private getContextOptions() {
    const options: any = {
      viewport: this.config.viewport,
      ignoreHTTPSErrors: true,
      acceptDownloads: true,
      
      // Recording options
      recordVideo: this.config.enableVideoRecording ? {
        dir: this.config.logging.filePath.replace('.log', '/videos/'),
        size: this.config.viewport
      } : undefined,
      
      recordHar: this.config.enableNetworkLogs ? {
        path: this.config.logging.filePath.replace('.log', '/network.har')
      } : undefined
    };

    // Add authentication if configured
    if (this.config.auth.enabled && this.config.auth.type === 'basic') {
      options.httpCredentials = {
        username: process.env.AUTH_USERNAME || '',
        password: process.env.AUTH_PASSWORD || ''
      };
    }

    // Add client certificates if configured
    if (process.env.CLIENT_CERT_PATH) {
      options.clientCertificates = [{
        origin: this.config.baseUrl,
        certPath: process.env.CLIENT_CERT_PATH,
        keyPath: process.env.CLIENT_KEY_PATH,
        passphrase: process.env.CLIENT_CERT_PASSPHRASE
      }];
    }

    // Add extra HTTP headers
    options.extraHTTPHeaders = {
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': this.getUserAgent(),
      ...this.config.api.headers
    };

    return options;
  }

  /**
   * Get user agent string
   */
  private getUserAgent(): string {
    const baseUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    return `${baseUA} (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 TestAutomation/1.0`;
  }

  /**
   * Set up context event listeners
   */
  private setupContextEventListeners(context: BrowserContext): void {
    // Log page creation
    context.on('page', (page) => {
      this.logger.debug('New page created', { url: page.url() });
    });

    // Log requests if network logging is enabled
    if (this.config.enableNetworkLogs) {
      context.on('request', (request) => {
        this.logger.debug('Request', {
          method: request.method(),
          url: request.url(),
          headers: request.headers()
        });
      });

      context.on('response', (response) => {
        this.logger.debug('Response', {
          status: response.status(),
          url: response.url(),
          headers: response.headers()
        });
      });
    }

    // Log console messages
    context.on('console', (msg) => {
      if (msg.type() === 'error') {
        this.logger.warn('Console error', { message: msg.text() });
      }
    });
  }

  /**
   * Set up page event listeners
   */
  private setupPageEventListeners(page: Page): void {
    // Log page errors
    page.on('pageerror', (error) => {
      this.logger.error('Page error occurred', error);
    });

    // Log console messages
    page.on('console', (msg) => {
      const level = msg.type();
      if (level === 'error') {
        this.logger.error('Console error', { message: msg.text() });
      } else if (level === 'warning') {
        this.logger.warn('Console warning', { message: msg.text() });
      } else if (process.env.DEBUG === 'true') {
        this.logger.debug(`Console ${level}`, { message: msg.text() });
      }
    });

    // Log failed requests
    page.on('requestfailed', (request) => {
      this.logger.warn('Request failed', {
        url: request.url(),
        method: request.method(),
        failure: request.failure()?.errorText
      });
    });

    // Log dialog events
    page.on('dialog', async (dialog) => {
      this.logger.info('Dialog appeared', {
        type: dialog.type(),
        message: dialog.message()
      });
      await dialog.accept();
    });

    // Log popup events
    page.on('popup', (popup) => {
      this.logger.info('Popup opened', { url: popup.url() });
    });
  }

  /**
   * Wait for page to be ready
   */
  async waitForPageReady(page: Page): Promise<void> {
    try {
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      this.logger.debug('Page is ready');
    } catch (error) {
      this.logger.warn('Page ready timeout, continuing anyway', error);
    }
  }

  /**
   * Navigate to URL with retry logic
   */
  async navigateToUrl(page: Page, url: string, options?: any): Promise<void> {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        this.logger.info(`Navigating to URL (attempt ${attempt + 1})`, { url });
        
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: this.config.timeout,
          ...options
        });
        
        await this.waitForPageReady(page);
        this.logger.info('Navigation successful', { url });
        return;
      } catch (error) {
        attempt++;
        this.logger.warn(`Navigation attempt ${attempt} failed`, { url, error });
        
        if (attempt >= maxRetries) {
          this.logger.error('All navigation attempts failed', { url, error });
          throw error;
        }
        
        // Wait before retry
        await page.waitForTimeout(2000);
      }
    }
  }

  /**
   * Take screenshot with error handling
   */
  async takeScreenshot(page: Page, path: string, options?: any): Promise<void> {
    try {
      await page.screenshot({
        path,
        fullPage: true,
        ...options
      });
      this.logger.info('Screenshot taken', { path });
    } catch (error) {
      this.logger.error('Failed to take screenshot', { path, error });
    }
  }

  /**
   * Get page performance metrics
   */
  async getPerformanceMetrics(page: Page): Promise<any> {
    try {
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
          totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
        };
      });
      
      this.logger.info('Performance metrics collected', metrics);
      return metrics;
    } catch (error) {
      this.logger.error('Failed to collect performance metrics', error);
      return {};
    }
  }
}




