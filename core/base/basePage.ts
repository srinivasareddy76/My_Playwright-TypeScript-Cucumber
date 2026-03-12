









import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utilities/logger';
import { getEnvironmentConfig } from '../../config/environment';

export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;
  protected config: ReturnType<typeof getEnvironmentConfig>;
  protected baseUrl: string;

  constructor(page: Page, logger?: Logger) {
    this.page = page;
    this.config = getEnvironmentConfig();
    this.baseUrl = this.config.baseUrl;
    this.logger = logger || new Logger({
      level: 'info',
      enableConsole: true,
      enableFile: false,
      filePath: ''
    });
  }

  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string, options?: any): Promise<void> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    
    this.logger.pageAction(`Navigating to: ${fullUrl}`);
    
    try {
      await this.page.goto(fullUrl, {
        waitUntil: 'domcontentloaded',
        timeout: this.config.timeout,
        ...options
      });
      
      await this.waitForPageLoad();
      this.logger.pageAction('Navigation completed successfully');
      
    } catch (error) {
      this.logger.error('Navigation failed', { url: fullUrl, error });
      throw error;
    }
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    try {
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (error) {
      this.logger.warn('Page load timeout, continuing anyway');
    }
  }

  /**
   * Find element by selector
   */
  protected findElement(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Find multiple elements by selector
   */
  protected findElements(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout?: number): Promise<Locator> {
    const element = this.findElement(selector);
    await element.waitFor({ 
      state: 'visible', 
      timeout: timeout || this.config.timeout 
    });
    return element;
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementToBeHidden(selector: string, timeout?: number): Promise<void> {
    const element = this.findElement(selector);
    await element.waitFor({ 
      state: 'hidden', 
      timeout: timeout || this.config.timeout 
    });
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.findElement(selector);
      await element.waitFor({ state: 'visible', timeout: 5000 });
      return await element.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if element exists in DOM
   */
  async isElementPresent(selector: string): Promise<boolean> {
    try {
      const count = await this.findElements(selector).count();
      return count > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Click on element
   */
  async clickElement(selector: string, options?: any): Promise<void> {
    this.logger.pageAction(`Clicking element: ${selector}`);
    
    try {
      const element = await this.waitForElement(selector);
      await element.click({
        timeout: this.config.timeout,
        ...options
      });
      
      this.logger.pageAction(`Element clicked successfully: ${selector}`);
    } catch (error) {
      this.logger.error('Click failed', { selector, error });
      throw error;
    }
  }

  /**
   * Double click on element
   */
  async doubleClickElement(selector: string): Promise<void> {
    this.logger.pageAction(`Double clicking element: ${selector}`);
    
    try {
      const element = await this.waitForElement(selector);
      await element.dblclick();
      
      this.logger.pageAction(`Element double clicked successfully: ${selector}`);
    } catch (error) {
      this.logger.error('Double click failed', { selector, error });
      throw error;
    }
  }

  /**
   * Right click on element
   */
  async rightClickElement(selector: string): Promise<void> {
    this.logger.pageAction(`Right clicking element: ${selector}`);
    
    try {
      const element = await this.waitForElement(selector);
      await element.click({ button: 'right' });
      
      this.logger.pageAction(`Element right clicked successfully: ${selector}`);
    } catch (error) {
      this.logger.error('Right click failed', { selector, error });
      throw error;
    }
  }

  /**
   * Hover over element
   */
  async hoverOverElement(selector: string): Promise<void> {
    this.logger.pageAction(`Hovering over element: ${selector}`);
    
    try {
      const element = await this.waitForElement(selector);
      await element.hover();
      
      this.logger.pageAction(`Hover completed successfully: ${selector}`);
    } catch (error) {
      this.logger.error('Hover failed', { selector, error });
      throw error;
    }
  }

  /**
   * Type text into element
   */
  async typeText(selector: string, text: string, options?: any): Promise<void> {
    this.logger.pageAction(`Typing text into element: ${selector}`, { text });
    
    try {
      const element = await this.waitForElement(selector);
      await element.fill(text, {
        timeout: this.config.timeout,
        ...options
      });
      
      this.logger.pageAction(`Text typed successfully: ${selector}`);
    } catch (error) {
      this.logger.error('Type text failed', { selector, text, error });
      throw error;
    }
  }

  /**
   * Clear text from element
   */
  async clearText(selector: string): Promise<void> {
    this.logger.pageAction(`Clearing text from element: ${selector}`);
    
    try {
      const element = await this.waitForElement(selector);
      await element.clear();
      
      this.logger.pageAction(`Text cleared successfully: ${selector}`);
    } catch (error) {
      this.logger.error('Clear text failed', { selector, error });
      throw error;
    }
  }

  /**
   * Get text from element
   */
  async getText(selector: string): Promise<string> {
    this.logger.pageAction(`Getting text from element: ${selector}`);
    
    try {
      const element = await this.waitForElement(selector);
      const text = await element.textContent() || '';
      
      this.logger.pageAction(`Text retrieved: ${selector}`, { text });
      return text.trim();
    } catch (error) {
      this.logger.error('Get text failed', { selector, error });
      throw error;
    }
  }

  /**
   * Get attribute value from element
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    this.logger.pageAction(`Getting attribute from element: ${selector}`, { attribute });
    
    try {
      const element = await this.waitForElement(selector);
      const value = await element.getAttribute(attribute);
      
      this.logger.pageAction(`Attribute retrieved: ${selector}`, { attribute, value });
      return value;
    } catch (error) {
      this.logger.error('Get attribute failed', { selector, attribute, error });
      throw error;
    }
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, option: string | number): Promise<void> {
    this.logger.pageAction(`Selecting option from dropdown: ${selector}`, { option });
    
    try {
      const element = await this.waitForElement(selector);
      
      if (typeof option === 'string') {
        await element.selectOption({ label: option });
      } else {
        await element.selectOption({ index: option });
      }
      
      this.logger.pageAction(`Option selected successfully: ${selector}`);
    } catch (error) {
      this.logger.error('Select option failed', { selector, option, error });
      throw error;
    }
  }

  /**
   * Check checkbox or radio button
   */
  async checkElement(selector: string): Promise<void> {
    this.logger.pageAction(`Checking element: ${selector}`);
    
    try {
      const element = await this.waitForElement(selector);
      await element.check();
      
      this.logger.pageAction(`Element checked successfully: ${selector}`);
    } catch (error) {
      this.logger.error('Check element failed', { selector, error });
      throw error;
    }
  }

  /**
   * Uncheck checkbox
   */
  async uncheckElement(selector: string): Promise<void> {
    this.logger.pageAction(`Unchecking element: ${selector}`);
    
    try {
      const element = await this.waitForElement(selector);
      await element.uncheck();
      
      this.logger.pageAction(`Element unchecked successfully: ${selector}`);
    } catch (error) {
      this.logger.error('Uncheck element failed', { selector, error });
      throw error;
    }
  }

  /**
   * Check if element is checked
   */
  async isElementChecked(selector: string): Promise<boolean> {
    try {
      const element = await this.waitForElement(selector);
      return await element.isChecked();
    } catch (error) {
      this.logger.error('Check element state failed', { selector, error });
      return false;
    }
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string): Promise<void> {
    this.logger.pageAction(`Scrolling to element: ${selector}`);
    
    try {
      const element = await this.waitForElement(selector);
      await element.scrollIntoViewIfNeeded();
      
      this.logger.pageAction(`Scrolled to element successfully: ${selector}`);
    } catch (error) {
      this.logger.error('Scroll to element failed', { selector, error });
      throw error;
    }
  }

  /**
   * Scroll to top of page
   */
  async scrollToTop(): Promise<void> {
    this.logger.pageAction('Scrolling to top of page');
    
    try {
      await this.page.evaluate(() => window.scrollTo(0, 0));
      this.logger.pageAction('Scrolled to top successfully');
    } catch (error) {
      this.logger.error('Scroll to top failed', error);
      throw error;
    }
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom(): Promise<void> {
    this.logger.pageAction('Scrolling to bottom of page');
    
    try {
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      this.logger.pageAction('Scrolled to bottom successfully');
    } catch (error) {
      this.logger.error('Scroll to bottom failed', error);
      throw error;
    }
  }

  /**
   * Wait for URL to match pattern
   */
  async waitForUrl(urlPattern: string | RegExp, timeout?: number): Promise<void> {
    this.logger.pageAction('Waiting for URL pattern', { pattern: urlPattern.toString() });
    
    try {
      await this.page.waitForURL(urlPattern, { 
        timeout: timeout || this.config.timeout 
      });
      
      this.logger.pageAction('URL pattern matched', { currentUrl: this.page.url() });
    } catch (error) {
      this.logger.error('Wait for URL failed', { pattern: urlPattern.toString(), error });
      throw error;
    }
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    try {
      const title = await this.page.title();
      this.logger.pageAction('Page title retrieved', { title });
      return title;
    } catch (error) {
      this.logger.error('Get page title failed', error);
      throw error;
    }
  }

  /**
   * Refresh page
   */
  async refreshPage(): Promise<void> {
    this.logger.pageAction('Refreshing page');
    
    try {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await this.waitForPageLoad();
      
      this.logger.pageAction('Page refreshed successfully');
    } catch (error) {
      this.logger.error('Page refresh failed', error);
      throw error;
    }
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    this.logger.pageAction('Going back in browser history');
    
    try {
      await this.page.goBack({ waitUntil: 'domcontentloaded' });
      await this.waitForPageLoad();
      
      this.logger.pageAction('Navigated back successfully');
    } catch (error) {
      this.logger.error('Go back failed', error);
      throw error;
    }
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    this.logger.pageAction('Going forward in browser history');
    
    try {
      await this.page.goForward({ waitUntil: 'domcontentloaded' });
      await this.waitForPageLoad();
      
      this.logger.pageAction('Navigated forward successfully');
    } catch (error) {
      this.logger.error('Go forward failed', error);
      throw error;
    }
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = name || `screenshot-${timestamp}`;
    const screenshotPath = `./reports/screenshots/${screenshotName}.png`;
    
    try {
      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      
      this.logger.pageAction('Screenshot taken', { path: screenshotPath });
      return screenshotPath;
    } catch (error) {
      this.logger.error('Screenshot failed', { path: screenshotPath, error });
      throw error;
    }
  }

  /**
   * Execute JavaScript
   */
  async executeScript(script: string, ...args: any[]): Promise<any> {
    this.logger.pageAction('Executing JavaScript', { script });
    
    try {
      const result = await this.page.evaluate(script, ...args);
      this.logger.pageAction('JavaScript executed successfully');
      return result;
    } catch (error) {
      this.logger.error('JavaScript execution failed', { script, error });
      throw error;
    }
  }

  /**
   * Wait for specified time
   */
  async wait(milliseconds: number): Promise<void> {
    this.logger.pageAction(`Waiting for ${milliseconds}ms`);
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string): Promise<void> {
    this.logger.pageAction(`Pressing key: ${key}`);
    
    try {
      await this.page.keyboard.press(key);
      this.logger.pageAction(`Key pressed successfully: ${key}`);
    } catch (error) {
      this.logger.error('Key press failed', { key, error });
      throw error;
    }
  }

  /**
   * Type text using keyboard
   */
  async typeWithKeyboard(text: string): Promise<void> {
    this.logger.pageAction(`Typing with keyboard: ${text}`);
    
    try {
      await this.page.keyboard.type(text);
      this.logger.pageAction('Keyboard typing completed');
    } catch (error) {
      this.logger.error('Keyboard typing failed', { text, error });
      throw error;
    }
  }

  /**
   * Drag and drop
   */
  async dragAndDrop(sourceSelector: string, targetSelector: string): Promise<void> {
    this.logger.pageAction('Performing drag and drop', { 
      source: sourceSelector, 
      target: targetSelector 
    });
    
    try {
      const sourceElement = await this.waitForElement(sourceSelector);
      const targetElement = await this.waitForElement(targetSelector);
      
      await sourceElement.dragTo(targetElement);
      
      this.logger.pageAction('Drag and drop completed successfully');
    } catch (error) {
      this.logger.error('Drag and drop failed', { 
        source: sourceSelector, 
        target: targetSelector, 
        error 
      });
      throw error;
    }
  }

  /**
   * Upload file
   */
  async uploadFile(selector: string, filePath: string): Promise<void> {
    this.logger.pageAction('Uploading file', { selector, filePath });
    
    try {
      const element = await this.waitForElement(selector);
      await element.setInputFiles(filePath);
      
      this.logger.pageAction('File uploaded successfully');
    } catch (error) {
      this.logger.error('File upload failed', { selector, filePath, error });
      throw error;
    }
  }

  /**
   * Get element count
   */
  async getElementCount(selector: string): Promise<number> {
    try {
      const count = await this.findElements(selector).count();
      this.logger.pageAction(`Element count: ${selector}`, { count });
      return count;
    } catch (error) {
      this.logger.error('Get element count failed', { selector, error });
      return 0;
    }
  }

  /**
   * Assert element is visible
   */
  async assertElementVisible(selector: string, message?: string): Promise<void> {
    const element = this.findElement(selector);
    await expect(element).toBeVisible({ timeout: this.config.timeout });
    this.logger.pageAction(`Element visibility assertion passed: ${selector}`);
  }

  /**
   * Assert element contains text
   */
  async assertElementContainsText(selector: string, expectedText: string): Promise<void> {
    const element = this.findElement(selector);
    await expect(element).toContainText(expectedText, { timeout: this.config.timeout });
    this.logger.pageAction(`Element text assertion passed: ${selector}`, { expectedText });
  }

  /**
   * Assert page title
   */
  async assertPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle, { timeout: this.config.timeout });
    this.logger.pageAction('Page title assertion passed', { expectedTitle });
  }

  /**
   * Assert page URL
   */
  async assertPageUrl(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl, { timeout: this.config.timeout });
    this.logger.pageAction('Page URL assertion passed', { expectedUrl: expectedUrl.toString() });
  }
}









