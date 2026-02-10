

/**
 * @fileoverview BasePage - Abstract base class for all page objects in the test framework
 * 
 * This class provides a comprehensive set of common functionality for page object models,
 * including navigation, element interaction, assertions, and utility methods.
 * All page objects should extend this class to inherit standard behaviors.
 * 
 * @author Test Automation Team
 * @version 1.0.0
 * @since 2026-02-10
 * 
 * @example
 * ```typescript
 * export class HomePage extends BasePage {
 *   constructor(page?: Page) {
 *     super(page);
 *   }
 * 
 *   public async isPageLoaded(): Promise<boolean> {
 *     return await this.isElementVisible('.homepage-header');
 *   }
 * }
 * ```
 */

import { Page, Locator, expect } from '@playwright/test';
import { BrowserManager } from '../../src/utils/browser-manager';
import { EnvironmentManager } from '../../src/config/environment';
import { Logger } from '../../src/utils/logger';

/**
 * Abstract base class for all page objects in the test framework.
 * 
 * Provides common functionality including:
 * - Navigation and page management
 * - Element interaction (click, type, hover, etc.)
 * - Wait strategies and timeouts
 * - Assertions and validations
 * - Screenshot and performance utilities
 * - Mobile/responsive testing support
 * 
 * @abstract
 * @class BasePage
 */
export abstract class BasePage {
  /** The Playwright Page instance for browser interactions */
  protected page?: Page;
  
  /** Browser management singleton for page lifecycle */
  protected browserManager: BrowserManager;
  
  /** Environment configuration manager */
  protected environmentManager: EnvironmentManager;
  
  /** Logging utility for test actions and debugging */
  protected logger: Logger;
  
  /** Base URL for the application under test */
  protected baseUrl: string;

  /**
   * Creates an instance of BasePage.
   * 
   * Initializes all required managers and utilities, sets up the base URL
   * from environment configuration, and optionally accepts a Page instance.
   * 
   * @param {Page} [page] - Optional Playwright Page instance
   * 
   * @example
   * ```typescript
   * // Create page object without existing page
   * const homePage = new HomePage();
   * 
   * // Create page object with existing page
   * const homePage = new HomePage(page);
   * ```
   */
  constructor(page?: Page) {
    this.browserManager = BrowserManager.getInstance();
    this.environmentManager = EnvironmentManager.getInstance();
    this.logger = Logger.getInstance();
    this.baseUrl = this.environmentManager.getBaseUrl();
    
    if (page) {
      this.page = page;
    }
  }

  /**
   * Gets the current Page instance, creating one if it doesn't exist.
   * 
   * This method ensures that a valid Page instance is always available
   * for browser interactions. If no page is set, it retrieves the current
   * page from the BrowserManager.
   * 
   * @protected
   * @returns {Promise<Page>} The current Playwright Page instance
   * 
   * @example
   * ```typescript
   * const page = await this.getPage();
   * await page.goto('https://example.com');
   * ```
   */
  protected async getPage(): Promise<Page> {
    if (!this.page) {
      this.page = await this.browserManager.getCurrentPage();
    }
    return this.page;
  }

  // ========================================
  // NAVIGATION METHODS
  // ========================================

  /**
   * Navigates to a specified URL with proper error handling and logging.
   * 
   * Supports both absolute URLs (starting with http/https) and relative URLs
   * (which will be appended to the base URL). Includes automatic page load
   * waiting and timeout handling.
   * 
   * @public
   * @param {string} url - The URL to navigate to (absolute or relative)
   * @returns {Promise<void>}
   * 
   * @example
   * ```typescript
   * // Navigate to absolute URL
   * await this.navigateTo('https://example.com/page');
   * 
   * // Navigate to relative URL
   * await this.navigateTo('/about');
   * ```
   * 
   * @throws {Error} If navigation fails or times out
   */
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

  /**
   * Waits for the page to fully load with multiple load state checks.
   * 
   * Uses a combination of 'domcontentloaded' and 'networkidle' states
   * to ensure the page is fully loaded. Includes timeout handling to
   * prevent indefinite waiting.
   * 
   * @public
   * @returns {Promise<void>}
   * 
   * @example
   * ```typescript
   * await page.goto('https://example.com');
   * await this.waitForPageLoad();
   * ```
   */
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

  // ========================================
  // ELEMENT INTERACTION METHODS
  // ========================================

  /**
   * Finds a single element using a CSS selector with optional timeout.
   * 
   * Returns a Playwright Locator that can be used for further interactions.
   * Optionally waits for the element to appear within the specified timeout.
   * 
   * @protected
   * @param {string} selector - CSS selector to locate the element
   * @param {number} [timeout] - Optional timeout in milliseconds
   * @returns {Promise<Locator>} Playwright Locator for the element
   * 
   * @example
   * ```typescript
   * const button = await this.findElement('.submit-button');
   * const input = await this.findElement('#email-input', 5000);
   * ```
   */
  protected async findElement(selector: string, timeout?: number): Promise<Locator> {
    const page = await this.getPage();
    const element = page.locator(selector);
    
    if (timeout) {
      await element.waitFor({ timeout });
    }
    
    return element;
  }

  /**
   * Finds multiple elements using a CSS selector.
   * 
   * Returns a Playwright Locator that represents all matching elements.
   * Use .count() to get the number of elements or .nth(index) to access specific elements.
   * 
   * @protected
   * @param {string} selector - CSS selector to locate elements
   * @returns {Promise<Locator>} Playwright Locator for all matching elements
   * 
   * @example
   * ```typescript
   * const buttons = await this.findElements('.menu-button');
   * const count = await buttons.count();
   * const firstButton = buttons.nth(0);
   * ```
   */
  protected async findElements(selector: string): Promise<Locator> {
    const page = await this.getPage();
    return page.locator(selector);
  }

  /**
   * Clicks on an element with comprehensive error handling and options.
   * 
   * Waits for the element to be visible before clicking. Supports force clicking
   * for elements that might be obscured. Includes automatic logging of actions.
   * 
   * @protected
   * @param {string} selector - CSS selector for the element to click
   * @param {Object} [options] - Click options
   * @param {number} [options.timeout] - Timeout for finding the element
   * @param {boolean} [options.force] - Force click even if element is not actionable
   * @returns {Promise<void>}
   * 
   * @example
   * ```typescript
   * // Standard click
   * await this.clickElement('.submit-button');
   * 
   * // Click with timeout
   * await this.clickElement('.dynamic-button', { timeout: 10000 });
   * 
   * // Force click (bypass actionability checks)
   * await this.clickElement('.overlay-button', { force: true });
   * ```
   * 
   * @throws {Error} If element is not found or not clickable within timeout
   */
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

  /**
   * Double-clicks on an element.
   * 
   * Waits for the element to be visible before performing the double-click action.
   * Useful for actions that require double-click interactions like opening files.
   * 
   * @protected
   * @param {string} selector - CSS selector for the element to double-click
   * @returns {Promise<void>}
   * 
   * @example
   * ```typescript
   * await this.doubleClickElement('.file-item');
   * ```
   * 
   * @throws {Error} If element is not found or not actionable
   */
  protected async doubleClickElement(selector: string): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Double clicking element: ${selector}`);
    const element = await this.findElement(selector);
    await element.waitFor({ state: 'visible' });
    await element.dblclick();
  }

  /**
   * Hovers over an element to trigger hover states or tooltips.
   * 
   * Waits for the element to be visible before hovering. Useful for dropdown
   * menus, tooltips, or any hover-triggered interactions.
   * 
   * @protected
   * @param {string} selector - CSS selector for the element to hover over
   * @returns {Promise<void>}
   * 
   * @example
   * ```typescript
   * // Hover to show dropdown menu
   * await this.hoverElement('.menu-item');
   * 
   * // Hover to show tooltip
   * await this.hoverElement('.info-icon');
   * ```
   * 
   * @throws {Error} If element is not found or not visible
   */
  protected async hoverElement(selector: string): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Hovering over element: ${selector}`);
    const element = await this.findElement(selector);
    await element.waitFor({ state: 'visible' });
    await element.hover();
  }

  /**
   * Types text into an input element with advanced options.
   * 
   * Supports clearing existing text before typing and custom typing delays.
   * Waits for the element to be visible and uses fill() for reliable text input.
   * 
   * @protected
   * @param {string} selector - CSS selector for the input element
   * @param {string} text - Text to type into the element
   * @param {Object} [options] - Typing options
   * @param {boolean} [options.clear] - Clear existing text before typing
   * @param {number} [options.delay] - Delay between keystrokes in milliseconds
   * @returns {Promise<void>}
   * 
   * @example
   * ```typescript
   * // Type text (replaces existing content)
   * await this.typeText('#email', 'user@example.com');
   * 
   * // Clear field first, then type
   * await this.typeText('#search', 'new query', { clear: true });
   * 
   * // Type with delay (for slow systems)
   * await this.typeText('#password', 'secret', { delay: 100 });
   * ```
   * 
   * @throws {Error} If element is not found or not editable
   */
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

  protected async isElementPresent(selector: string): Promise<boolean> {
    try {
      const count = await this.getElementCount(selector);
      const isPresent = count > 0;
      this.logger.pageAction(this.constructor.name, `Element ${selector} present: ${isPresent} (count: ${count})`);
      return isPresent;
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

  // ========================================
  // ABSTRACT METHODS
  // ========================================

  /**
   * Abstract method to check if the page has loaded successfully.
   * 
   * This method must be implemented by all subclasses to provide page-specific
   * loading validation. Typically checks for the presence of key elements
   * that indicate the page has loaded correctly.
   * 
   * @abstract
   * @public
   * @returns {Promise<boolean>} True if the page is loaded, false otherwise
   * 
   * @example
   * ```typescript
   * // Implementation in HomePage class
   * public async isPageLoaded(): Promise<boolean> {
   *   return await this.isElementVisible('.homepage-header') &&
   *          await this.isElementVisible('.main-navigation');
   * }
   * 
   * // Implementation in SearchPage class
   * public async isPageLoaded(): Promise<boolean> {
   *   return await this.isElementVisible('.search-results') ||
   *          await this.isElementVisible('.no-results-message');
   * }
   * ```
   * 
   * @throws {Error} Should be implemented by subclass
   */
  public abstract isPageLoaded(): Promise<boolean>;
}

export default BasePage;



