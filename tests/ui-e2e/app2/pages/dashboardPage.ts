
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../../../core/base/basePage';

export class DashboardPage extends BasePage {
  // Page elements
  private readonly dashboardHeader: Locator;
  private readonly accountSummary: Locator;
  private readonly recentActivity: Locator;
  private readonly profileSection: Locator;
  private readonly navigationMenu: Locator;
  private readonly loadingSpinner: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeader = page.locator('[data-testid="dashboard-header"]');
    this.accountSummary = page.locator('[data-testid="account-summary"]');
    this.recentActivity = page.locator('[data-testid="recent-activity"]');
    this.profileSection = page.locator('[data-testid="profile-section"]');
    this.navigationMenu = page.locator('[data-testid="navigation-menu"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  /**
   * Navigate to dashboard page
   */
  async navigateToDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.waitForPageLoad();
  }

  /**
   * Wait for dashboard to load completely
   */
  async waitForDashboardLoad(): Promise<void> {
    await this.dashboardHeader.waitFor({ state: 'visible' });
    await this.loadingSpinner.waitFor({ state: 'hidden' });
  }

  /**
   * Get account summary information
   */
  async getAccountSummary(): Promise<string> {
    await this.accountSummary.waitFor({ state: 'visible' });
    return await this.accountSummary.textContent() || '';
  }

  /**
   * Check if recent activity is displayed
   */
  async isRecentActivityVisible(): Promise<boolean> {
    return await this.recentActivity.isVisible();
  }

  /**
   * Click on profile section
   */
  async clickProfileSection(): Promise<void> {
    await this.profileSection.click();
  }

  /**
   * Navigate to specific dashboard section
   */
  async navigateToSection(sectionName: string): Promise<void> {
    const sectionLink = this.navigationMenu.locator(`text="${sectionName}"`);
    await sectionLink.click();
  }

  /**
   * Verify dashboard elements are present
   */
  async verifyDashboardElements(): Promise<boolean> {
    const elements = [
      this.dashboardHeader,
      this.accountSummary,
      this.recentActivity,
      this.navigationMenu
    ];

    for (const element of elements) {
      if (!(await element.isVisible())) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get dashboard load time
   */
  async measureLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.waitForDashboardLoad();
    return Date.now() - startTime;
  }

  /**
   * Check if mobile layout is active
   */
  async isMobileLayoutActive(): Promise<boolean> {
    const mobileIndicator = this.page.locator('[data-testid="mobile-layout"]');
    return await mobileIndicator.isVisible();
  }
}

