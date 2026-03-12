





import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../../core/base/basePage';
import { Logger } from '../../../core/utilities/logger';

export class LoginPage extends BasePage {
  // Page elements
  private readonly usernameInput: string = '#username, input[name="username"], input[type="email"]';
  private readonly passwordInput: string = '#password, input[name="password"], input[type="password"]';
  private readonly loginButton: string = '#login-btn, button[type="submit"], .login-button';
  private readonly loginForm: string = '#login-form, .login-form, form';
  private readonly errorMessage: string = '.error-message, .alert-error, .error';
  private readonly usernameError: string = '#username-error, .username-error';
  private readonly passwordError: string = '#password-error, .password-error';
  private readonly welcomeMessage: string = '.welcome-message, .greeting, h1';
  private readonly userMenu: string = '.user-menu, .profile-menu, .account-menu';
  private readonly mobileNavigation: string = '.mobile-nav, .mobile-menu, .hamburger-menu';

  constructor(page: Page, logger?: Logger) {
    super(page, logger);
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
  }

  /**
   * Wait for login form to be visible
   */
  async waitForLoginForm(): Promise<void> {
    await this.waitForElement(this.loginForm);
  }

  /**
   * Check if login form is visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.loginForm);
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    this.logger.pageAction(`Entering username: ${username}`);
    await this.typeText(this.usernameInput, username);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    this.logger.pageAction('Entering password');
    await this.typeText(this.passwordInput, password);
  }

  /**
   * Clear username field
   */
  async clearUsername(): Promise<void> {
    this.logger.pageAction('Clearing username field');
    await this.clearText(this.usernameInput);
  }

  /**
   * Clear password field
   */
  async clearPassword(): Promise<void> {
    this.logger.pageAction('Clearing password field');
    await this.clearText(this.passwordInput);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    this.logger.pageAction('Clicking login button');
    await this.clickElement(this.loginButton);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    try {
      return await this.getText(this.errorMessage);
    } catch (error) {
      this.logger.warn('No error message found');
      return '';
    }
  }

  /**
   * Get username field error
   */
  async getUsernameError(): Promise<string> {
    try {
      return await this.getText(this.usernameError);
    } catch (error) {
      this.logger.warn('No username error found');
      return '';
    }
  }

  /**
   * Get password field error
   */
  async getPasswordError(): Promise<string> {
    try {
      return await this.getText(this.passwordError);
    } catch (error) {
      this.logger.warn('No password error found');
      return '';
    }
  }

  /**
   * Check if validation errors are present
   */
  async hasValidationErrors(): Promise<boolean> {
    const usernameError = await this.isElementVisible(this.usernameError);
    const passwordError = await this.isElementVisible(this.passwordError);
    return usernameError || passwordError;
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage(): Promise<string> {
    try {
      await this.waitForElement(this.welcomeMessage);
      return await this.getText(this.welcomeMessage);
    } catch (error) {
      this.logger.warn('No welcome message found');
      return '';
    }
  }

  /**
   * Check if user menu is visible
   */
  async isUserMenuVisible(): Promise<boolean> {
    return await this.isElementVisible(this.userMenu);
  }

  /**
   * Check if login form is disabled
   */
  async isLoginFormDisabled(): Promise<boolean> {
    try {
      const usernameDisabled = await this.getAttribute(this.usernameInput, 'disabled');
      const passwordDisabled = await this.getAttribute(this.passwordInput, 'disabled');
      const buttonDisabled = await this.getAttribute(this.loginButton, 'disabled');
      
      return usernameDisabled !== null || passwordDisabled !== null || buttonDisabled !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if mobile navigation is visible
   */
  async isMobileNavigationVisible(): Promise<boolean> {
    return await this.isElementVisible(this.mobileNavigation);
  }

  /**
   * Login with credentials
   */
  async login(username: string, password: string): Promise<void> {
    this.logger.pageAction(`Logging in with username: ${username}`);
    
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    
    // Wait for navigation or error
    try {
      await this.waitForUrl(/\/dashboard/, 5000);
      this.logger.pageAction('Login successful - redirected to dashboard');
    } catch (error) {
      // Check for error message
      const errorMsg = await this.getErrorMessage();
      if (errorMsg) {
        this.logger.pageAction(`Login failed with error: ${errorMsg}`);
      } else {
        this.logger.warn('Login result unclear - no redirect or error message');
      }
    }
  }

  /**
   * Accessibility: Check if form has proper labels
   */
  async hasProperLabels(): Promise<boolean> {
    try {
      const usernameLabel = await this.page.locator('label[for*="username"], label:has(input[name="username"])').count();
      const passwordLabel = await this.page.locator('label[for*="password"], label:has(input[name="password"])').count();
      
      return usernameLabel > 0 && passwordLabel > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Accessibility: Check if form is keyboard navigable
   */
  async isKeyboardNavigable(): Promise<boolean> {
    try {
      // Test tab navigation
      await this.page.keyboard.press('Tab');
      const focusedElement = await this.page.locator(':focus').count();
      return focusedElement > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Accessibility: Check for ARIA attributes
   */
  async hasAriaAttributes(): Promise<boolean> {
    try {
      const ariaLabels = await this.page.locator('[aria-label], [aria-labelledby]').count();
      const ariaRequired = await this.page.locator('[aria-required="true"]').count();
      
      return ariaLabels > 0 && ariaRequired > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Accessibility: Check for ARIA live region for error announcements
   */
  async hasAriaLiveRegion(): Promise<boolean> {
    try {
      const ariaLive = await this.page.locator('[aria-live], [role="alert"]').count();
      return ariaLive > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate login form elements
   */
  async validateLoginForm(): Promise<{
    hasUsernameField: boolean;
    hasPasswordField: boolean;
    hasLoginButton: boolean;
    isFormAccessible: boolean;
  }> {
    const hasUsernameField = await this.isElementVisible(this.usernameInput);
    const hasPasswordField = await this.isElementVisible(this.passwordInput);
    const hasLoginButton = await this.isElementVisible(this.loginButton);
    const isFormAccessible = await this.hasProperLabels() && await this.hasAriaAttributes();

    this.logger.pageAction('Login form validation completed', {
      hasUsernameField,
      hasPasswordField,
      hasLoginButton,
      isFormAccessible
    });

    return {
      hasUsernameField,
      hasPasswordField,
      hasLoginButton,
      isFormAccessible
    };
  }

  /**
   * Get login form validation state
   */
  async getFormValidationState(): Promise<{
    usernameValid: boolean;
    passwordValid: boolean;
    formValid: boolean;
  }> {
    try {
      const usernameValue = await this.getAttribute(this.usernameInput, 'value') || '';
      const passwordValue = await this.getAttribute(this.passwordInput, 'value') || '';
      
      const usernameValid = usernameValue.length > 0;
      const passwordValid = passwordValue.length > 0;
      const formValid = usernameValid && passwordValid;

      return {
        usernameValid,
        passwordValid,
        formValid
      };
    } catch (error) {
      return {
        usernameValid: false,
        passwordValid: false,
        formValid: false
      };
    }
  }

  /**
   * Wait for login to complete (success or failure)
   */
  async waitForLoginResult(): Promise<'success' | 'error' | 'timeout'> {
    try {
      // Race between success (redirect) and error message
      const result = await Promise.race([
        this.waitForUrl(/\/dashboard/).then(() => 'success'),
        this.waitForElement(this.errorMessage).then(() => 'error'),
        new Promise(resolve => setTimeout(() => resolve('timeout'), 10000))
      ]);

      this.logger.pageAction(`Login result: ${result}`);
      return result as 'success' | 'error' | 'timeout';
    } catch (error) {
      this.logger.error('Error waiting for login result', error);
      return 'timeout';
    }
  }
}





