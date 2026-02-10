


import { Page, Locator, expect } from '@playwright/test';
import { BrowserManager } from '../../src/utils/browser-manager';
import { EnvironmentManager } from '../../src/config/environment';
import { Logger } from '../../src/utils/logger';

export abstract class BasePage {
  protected page?: Page;
  protected browserManager: BrowserManager;
  protected environmentManager: EnvironmentManager;
  protected logger: Logger;
  protected baseUrl: string;

  constructor(page?: Page) {
    this.browserManager = BrowserManager.getInstance();
    this.environmentManager = EnvironmentManager.getInstance();
    this.logger = Logger.getInstance();
    this.baseUrl = this.environmentManager.getBaseUrl();
    
    if (page) {
      this.page = page;
    }
  }

  protected async getPage(): Promise<Page> {
    if (!this.page) {
      this.page = await this.browserManager.getCurrentPage();
    }
    return this.page;
  }

  // Navigation methods
  public async navigateTo(url: string): Promise<void> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    this.logger.pageAction(this.constructor.name, `Navigating to: ${fullUrl}`);
    
    const page = await this.getPage();
    await page.goto(fullUrl, {
      waitUntil: 'domcontentloaded',
      timeout: this.environmentManager.getConfig().pageLoadTimeout
    });
    
    await this.waitForPageLoad();
  }

  public async waitForPageLoad(): Promise<void> {
    const page = await this.getPage();
    try {
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      this.logger.info(`${this.constructor.name}: Page loaded successfully`);
    } catch (error) {
      this.logger.warn(`${this.constructor.name}: Page load timeout, continuing...`);
    }
  }

  public async refreshPage(): Promise<void> {
    this.logger.pageAction(this.constructor.name, 'Refreshing page');
    const page = await this.getPage();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  public async getCurrentUrl(): Promise<string> {
    const page = await this.getPage();
    return page.url();
  }

  public async getPageTitle(): Promise<string> {
    const page = await this.getPage();
    const title = await page.title();
    this.logger.pageAction(this.constructor.name, `Page title: ${title}`);
    return title;
  }

  // Element interaction methods
  protected async findElement(selector: string, timeout?: number): Promise<Locator> {
    const page = await this.getPage();
    const element = page.locator(selector);
    
    if (timeout) {
      await element.waitFor({ timeout });
    }
    
    return element;
  }

  protected async findElements(selector: string): Promise<Locator> {
    const page = await this.getPage();
    return page.locator(selector);
  }

  protected async clickElement(selector: string, options?: { timeout?: number; force?: boolean }): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Clicking element: ${selector}`);
    const element = await this.findElement(selector, options?.timeout);
    
    await element.waitFor({ state: 'visible' });
    const clickOptions: any = {};
    if (options?.force !== undefined) {
      clickOptions.force = options.force;
    }
    await element.click(clickOptions);
  }

  protected async doubleClickElement(selector: string): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Double clicking element: ${selector}`);
    const element = await this.findElement(selector);
    await element.waitFor({ state: 'visible' });
    await element.dblclick();
  }

  protected async hoverElement(selector: string): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Hovering over element: ${selector}`);
    const element = await this.findElement(selector);
    await element.waitFor({ state: 'visible' });
    await element.hover();
  }

  protected async typeText(selector: string, text: string, options?: { clear?: boolean; delay?: number }): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Typing text into element: ${selector}`);
    const element = await this.findElement(selector);
    
    await element.waitFor({ state: 'visible' });
    
    if (options?.clear) {
      await element.clear();
    }
    
    await element.fill(text, { timeout: this.environmentManager.getConfig().elementTimeout });
  }

  protected async selectOption(selector: string, option: string | string[]): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Selecting option in: ${selector}`);
    const element = await this.findElement(selector);
    await element.waitFor({ state: 'visible' });
    await element.selectOption(option);
  }

  protected async uploadFile(selector: string, filePath: string | string[]): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Uploading file to: ${selector}`);
    const element = await this.findElement(selector);
    await element.setInputFiles(filePath);
  }

  // Wait methods
  protected async waitForElement(selector: string, options?: { state?: 'visible' | 'hidden' | 'attached' | 'detached'; timeout?: number }): Promise<Locator> {
    this.logger.pageAction(this.constructor.name, `Waiting for element: ${selector}`);
    const element = await this.findElement(selector);
    await element.waitFor({
      state: options?.state || 'visible',
      timeout: options?.timeout || this.environmentManager.getConfig().elementTimeout
    });
    return element;
  }

  protected async waitForText(selector: string, text: string, timeout?: number): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Waiting for text "${text}" in element: ${selector}`);
    const element = await this.findElement(selector);
    await expect(element).toContainText(text, { timeout: timeout || this.environmentManager.getConfig().elementTimeout });
  }

  protected async waitForUrl(urlPattern: string | RegExp, timeout?: number): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Waiting for URL pattern: ${urlPattern}`);
    const page = await this.getPage();
    await page.waitForURL(urlPattern, { timeout: timeout || this.environmentManager.getConfig().pageLoadTimeout });
  }

  // Assertion methods
  protected async assertElementVisible(selector: string, message?: string): Promise<void> {
    const element = await this.findElement(selector);
    await expect(element).toBeVisible();
    this.logger.assertion(message || `Element ${selector} is visible`, true);
  }

  protected async assertElementHidden(selector: string, message?: string): Promise<void> {
    const element = await this.findElement(selector);
    await expect(element).toBeHidden();
    this.logger.assertion(message || `Element ${selector} is hidden`, true);
  }

  protected async assertElementText(selector: string, expectedText: string, message?: string): Promise<void> {
    const element = await this.findElement(selector);
    await expect(element).toContainText(expectedText);
    this.logger.assertion(message || `Element ${selector} contains text: ${expectedText}`, true);
  }

  protected async assertElementValue(selector: string, expectedValue: string, message?: string): Promise<void> {
    const element = await this.findElement(selector);
    await expect(element).toHaveValue(expectedValue);
    this.logger.assertion(message || `Element ${selector} has value: ${expectedValue}`, true);
  }

  protected async assertPageTitle(expectedTitle: string, message?: string): Promise<void> {
    const page = await this.getPage();
    await expect(page).toHaveTitle(expectedTitle);
    this.logger.assertion(message || `Page title is: ${expectedTitle}`, true);
  }

  protected async assertPageUrl(expectedUrl: string | RegExp, message?: string): Promise<void> {
    const page = await this.getPage();
    await expect(page).toHaveURL(expectedUrl);
    this.logger.assertion(message || `Page URL matches: ${expectedUrl}`, true);
  }

  // Utility methods
  protected async getElementText(selector: string): Promise<string> {
    const element = await this.findElement(selector);
    const text = await element.textContent() || '';
    this.logger.pageAction(this.constructor.name, `Retrieved text from ${selector}: ${text}`);
    return text.trim();
  }

  protected async getElementAttribute(selector: string, attribute: string): Promise<string | null> {
    const element = await this.findElement(selector);
    const value = await element.getAttribute(attribute);
    this.logger.pageAction(this.constructor.name, `Retrieved attribute ${attribute} from ${selector}: ${value}`);
    return value;
  }

  protected async getElementValue(selector: string): Promise<string> {
    const element = await this.findElement(selector);
    const value = await element.inputValue();
    this.logger.pageAction(this.constructor.name, `Retrieved value from ${selector}: ${value}`);
    return value;
  }

  protected async isElementVisible(selector: string): Promise<boolean> {
    try {
      const page = await this.getPage();
      const elements = await page.locator(selector).all();
      
      // Check if any of the matching elements is visible
      for (const element of elements) {
        const isVisible = await element.isVisible();
        if (isVisible) {
          this.logger.pageAction(this.constructor.name, `Element ${selector} visibility: ${isVisible}`);
          return true;
        }
      }
      
      this.logger.pageAction(this.constructor.name, `Element ${selector} visibility: false (no visible elements found)`);
      return false;
    } catch (error) {
      this.logger.pageAction(this.constructor.name, `Element ${selector} visibility check failed: ${error}`);
      return false;
    }
  }

  protected async isElementEnabled(selector: string): Promise<boolean> {
    try {
      const element = await this.findElement(selector);
      const isEnabled = await element.isEnabled();
      this.logger.pageAction(this.constructor.name, `Element ${selector} enabled: ${isEnabled}`);
      return isEnabled;
    } catch {
      return false;
    }
  }

  protected async getElementCount(selector: string): Promise<number> {
    const elements = await this.findElements(selector);
    const count = await elements.count();
    this.logger.pageAction(this.constructor.name, `Element count for ${selector}: ${count}`);
    return count;
  }

  // Screenshot methods
  public async takeScreenshot(name?: string): Promise<string> {
    const screenshotName = name || `${this.constructor.name}-${Date.now()}`;
    return await this.browserManager.takeScreenshot(screenshotName);
  }

  // Scroll methods
  protected async scrollToElement(selector: string): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Scrolling to element: ${selector}`);
    const element = await this.findElement(selector);
    await element.scrollIntoViewIfNeeded();
  }

  protected async scrollToTop(): Promise<void> {
    this.logger.pageAction(this.constructor.name, 'Scrolling to top of page');
    const page = await this.getPage();
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  protected async scrollToBottom(): Promise<void> {
    this.logger.pageAction(this.constructor.name, 'Scrolling to bottom of page');
    const page = await this.getPage();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  // Performance methods
  protected async measurePageLoadTime(): Promise<number> {
    const page = await this.getPage();
    const startTime = Date.now();
    
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    this.logger.performance(`${this.constructor.name} page load`, loadTime);
    return loadTime;
  }

  // Mobile/responsive methods
  protected async setViewport(width: number, height: number): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Setting viewport to ${width}x${height}`);
    const page = await this.getPage();
    await page.setViewportSize({ width, height });
  }

  // Abstract methods that must be implemented by subclasses
  public abstract isPageLoaded(): Promise<boolean>;
}

export default BasePage;



