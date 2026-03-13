

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../../../core/world/customWorld';
import { DashboardPage } from '../pages/dashboardPage';

let dashboardPage: DashboardPage;

Given('I am logged into app2', async function (this: ICustomWorld) {
  // Simulate login process for app2
  await this.page!.goto('/login');
  await this.page!.fill('[data-testid="username"]', 'testuser@app2.com');
  await this.page!.fill('[data-testid="password"]', 'testpassword');
  await this.page!.click('[data-testid="login-button"]');
  
  // Wait for login to complete
  await this.page!.waitForURL('**/dashboard');
  this.logger.info('Successfully logged into app2');
});

Given('I am on the dashboard page', async function (this: ICustomWorld) {
  dashboardPage = new DashboardPage(this.page!);
  await dashboardPage.navigateToDashboard();
  await dashboardPage.waitForDashboardLoad();
  this.logger.info('Navigated to dashboard page');
});

Given('I am using a mobile viewport', async function (this: ICustomWorld) {
  await this.setMobileViewport();
  this.logger.info('Set mobile viewport');
});

When('I view the dashboard overview', async function (this: ICustomWorld) {
  const isVisible = await dashboardPage.verifyDashboardElements();
  expect(isVisible).toBeTruthy();
  this.logger.info('Viewed dashboard overview');
});

When('I click on the {string} section', async function (this: ICustomWorld, sectionName: string) {
  await dashboardPage.navigateToSection(sectionName);
  this.logger.info(`Clicked on ${sectionName} section`);
});

When('I view the dashboard', async function (this: ICustomWorld) {
  await dashboardPage.waitForDashboardLoad();
  this.logger.info('Viewed dashboard');
});

When('I measure the page load time', async function (this: ICustomWorld) {
  const loadTime = await dashboardPage.measureLoadTime();
  this.setTestData('loadTime', loadTime);
  this.logger.info(`Dashboard load time: ${loadTime}ms`);
});

Then('I should see my account summary', async function (this: ICustomWorld) {
  const accountSummary = await dashboardPage.getAccountSummary();
  expect(accountSummary).toBeTruthy();
  expect(accountSummary.length).toBeGreaterThan(0);
  this.logger.info('Account summary is visible');
});

Then('I should see recent activity', async function (this: ICustomWorld) {
  const isVisible = await dashboardPage.isRecentActivityVisible();
  expect(isVisible).toBeTruthy();
  this.logger.info('Recent activity is visible');
});

Then('I should be redirected to the profile page', async function (this: ICustomWorld) {
  await this.page!.waitForURL('**/profile');
  const currentUrl = this.page!.url();
  expect(currentUrl).toContain('/profile');
  this.logger.info('Redirected to profile page');
});

Then('the profile information should be displayed', async function (this: ICustomWorld) {
  const profileInfo = this.page!.locator('[data-testid="profile-info"]');
  await expect(profileInfo).toBeVisible();
  this.logger.info('Profile information is displayed');
});

Then('the mobile layout should be displayed', async function (this: ICustomWorld) {
  const isMobileLayout = await dashboardPage.isMobileLayoutActive();
  expect(isMobileLayout).toBeTruthy();
  this.logger.info('Mobile layout is active');
});

Then('all elements should be accessible', async function (this: ICustomWorld) {
  // Check accessibility of key elements
  const elements = [
    '[data-testid="dashboard-header"]',
    '[data-testid="account-summary"]',
    '[data-testid="navigation-menu"]'
  ];

  for (const selector of elements) {
    const element = this.page!.locator(selector);
    await expect(element).toBeVisible();
  }
  this.logger.info('All elements are accessible');
});

Then('the dashboard should load within {int} seconds', async function (this: ICustomWorld, maxSeconds: number) {
  const loadTime = this.getTestData('loadTime');
  const maxLoadTime = maxSeconds * 1000; // Convert to milliseconds
  
  expect(loadTime).toBeLessThanOrEqual(maxLoadTime);
  this.logger.info(`Dashboard loaded in ${loadTime}ms (within ${maxSeconds}s limit)`);
});


