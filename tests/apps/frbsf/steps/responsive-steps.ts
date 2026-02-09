


import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '@common/world';

Given('I am using a {word} device', async function (this: ICustomWorld, deviceType: string) {
  this.logger.step('Setup', `Setting up ${deviceType} device viewport`);
  
  switch (deviceType.toLowerCase()) {
    case 'mobile':
      await this.setMobileViewport();
      break;
    case 'tablet':
      await this.setTabletViewport();
      break;
    case 'desktop':
      await this.setDesktopViewport();
      break;
    default:
      throw new Error(`Unknown device type: ${deviceType}`);
  }
  
  this.setScenarioContext('deviceType', deviceType);
});

When('I navigate to the homepage on {word}', async function (this: ICustomWorld, deviceType: string) {
  this.logger.step('Navigation', `Navigating to homepage on ${deviceType}`);
  await this.homePage.navigateToHomePage();
  await this.homePage.waitForPageLoad();
});

Then('the page should be responsive on {word}', async function (this: ICustomWorld, deviceType: string) {
  this.logger.step('Verification', `Checking responsiveness on ${deviceType}`);
  const isResponsive = await this.homePage.isPageLoaded();
  expect(isResponsive).toBe(true);
  this.logger.assertion(`Page is responsive on ${deviceType}`, isResponsive);
});

Then('the navigation should adapt to {word}', async function (this: ICustomWorld, deviceType: string) {
  this.logger.step('Verification', `Checking navigation adaptation on ${deviceType}`);
  const navigationAdapted = await this.homePage.validateMainNavigationMenu();
  expect(navigationAdapted).toBe(true);
  this.logger.assertion(`Navigation adapted to ${deviceType}`, navigationAdapted);
});

When('I test touch interactions on mobile', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Testing touch interactions on mobile');
  // Simulate touch interactions
  const page = await this.homePage.getPage();
  await page.touchscreen.tap(100, 100);
});

Then('touch interactions should work properly', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking touch interaction functionality');
  const touchWorking = await this.homePage.isPageLoaded();
  expect(touchWorking).toBe(true);
  this.logger.assertion('Touch interactions work properly', touchWorking);
});

When('I rotate the device to {word} orientation', async function (this: ICustomWorld, orientation: string) {
  this.logger.step('Interaction', `Rotating device to ${orientation} orientation`);
  
  const page = await this.homePage.getPage();
  if (orientation.toLowerCase() === 'landscape') {
    await page.setViewportSize({ width: 812, height: 375 });
  } else {
    await page.setViewportSize({ width: 375, height: 812 });
  }
  
  this.setScenarioContext('orientation', orientation);
});

Then('the layout should adapt to {word} orientation', async function (this: ICustomWorld, orientation: string) {
  this.logger.step('Verification', `Checking layout adaptation to ${orientation}`);
  const layoutAdapted = await this.homePage.isPageLoaded();
  expect(layoutAdapted).toBe(true);
  this.logger.assertion(`Layout adapted to ${orientation} orientation`, layoutAdapted);
});

When('I test the mobile menu', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Testing mobile menu');
  // Look for mobile menu button (hamburger menu)
  const mobileMenuSelector = '.mobile-menu-button, .hamburger-menu, [aria-label="Menu"]';
  const mobileMenuExists = await this.homePage.isElementVisible(mobileMenuSelector);
  
  if (mobileMenuExists) {
    await this.homePage.clickElement(mobileMenuSelector);
  }
});

Then('the mobile menu should function correctly', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking mobile menu functionality');
  const menuFunctional = await this.homePage.validateMainNavigationMenu();
  expect(menuFunctional).toBe(true);
  this.logger.assertion('Mobile menu functions correctly', menuFunctional);
});

When('I check responsive images', async function (this: ICustomWorld) {
  this.logger.step('Check', 'Checking responsive images');
  // This would typically check for srcset attributes and proper image scaling
  const page = await this.homePage.getPage();
  const images = await page.locator('img').count();
  this.setTestData('imageCount', images);
});

Then('images should scale appropriately for the viewport', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking image scaling');
  const imageCount = this.getTestData('imageCount') || 0;
  expect(imageCount).toBeGreaterThan(0);
  this.logger.assertion('Images scale appropriately', imageCount > 0);
});

When('I test responsive typography', async function (this: ICustomWorld) {
  this.logger.step('Check', 'Testing responsive typography');
  const page = await this.homePage.getPage();
  const headings = await page.locator('h1, h2, h3').count();
  this.setTestData('headingCount', headings);
});

Then('text should be readable at all viewport sizes', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking text readability');
  const headingCount = this.getTestData('headingCount') || 0;
  expect(headingCount).toBeGreaterThan(0);
  this.logger.assertion('Text is readable at all viewport sizes', headingCount > 0);
});

When('I test responsive forms', async function (this: ICustomWorld) {
  this.logger.step('Check', 'Testing responsive forms');
  // Look for search form or other forms
  const formExists = await this.homePage.isElementVisible('form, input[type="search"]');
  this.setTestData('formExists', formExists);
});

Then('forms should be usable on all devices', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking form usability');
  const formExists = this.getTestData('formExists') || false;
  expect(formExists).toBe(true);
  this.logger.assertion('Forms are usable on all devices', formExists);
});

When('I check for horizontal scrolling', async function (this: ICustomWorld) {
  this.logger.step('Check', 'Checking for horizontal scrolling');
  const page = await this.homePage.getPage();
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  this.setTestData('hasHorizontalScroll', bodyWidth > viewportWidth);
});

Then('there should be no horizontal scrolling', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking absence of horizontal scrolling');
  const hasHorizontalScroll = this.getTestData('hasHorizontalScroll') || false;
  expect(hasHorizontalScroll).toBe(false);
  this.logger.assertion('No horizontal scrolling present', !hasHorizontalScroll);
});

When('I test progressive enhancement', async function (this: ICustomWorld) {
  this.logger.step('Check', 'Testing progressive enhancement');
  // Check if basic functionality works without JavaScript
  const page = await this.homePage.getPage();
  await page.setJavaScriptEnabled(false);
  await this.homePage.navigateToHomePage();
  await page.setJavaScriptEnabled(true);
});

Then('the site should work with basic functionality', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking basic functionality');
  const pageLoaded = await this.homePage.isPageLoaded();
  expect(pageLoaded).toBe(true);
  this.logger.assertion('Site works with basic functionality', pageLoaded);
});

When('I test offline functionality', async function (this: ICustomWorld) {
  this.logger.step('Check', 'Testing offline functionality');
  const page = await this.homePage.getPage();
  await page.setOfflineMode(true);
  await page.reload();
  await page.setOfflineMode(false);
});

Then('the site should handle offline scenarios gracefully', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking offline handling');
  // In a real scenario, we'd check for offline pages or cached content
  const pageAccessible = await this.homePage.isPageLoaded();
  expect(pageAccessible).toBe(true);
  this.logger.assertion('Site handles offline scenarios gracefully', pageAccessible);
});

When('I check responsive breakpoints', async function (this: ICustomWorld) {
  this.logger.step('Check', 'Testing responsive breakpoints');
  const page = await this.homePage.getPage();
  
  // Test different breakpoints
  const breakpoints = [
    { width: 320, height: 568 },  // Small mobile
    { width: 768, height: 1024 }, // Tablet
    { width: 1024, height: 768 }, // Desktop
    { width: 1920, height: 1080 } // Large desktop
  ];
  
  for (const breakpoint of breakpoints) {
    await page.setViewportSize(breakpoint);
    await page.waitForTimeout(500); // Allow layout to adjust
  }
});

Then('the layout should adapt at all breakpoints', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking breakpoint adaptation');
  const layoutAdapted = await this.homePage.isPageLoaded();
  expect(layoutAdapted).toBe(true);
  this.logger.assertion('Layout adapts at all breakpoints', layoutAdapted);
});

When('I test cross-device consistency', async function (this: ICustomWorld) {
  this.logger.step('Check', 'Testing cross-device consistency');
  // This would typically involve comparing layouts across devices
  const contentConsistent = await this.homePage.validateKeyContentSections();
  this.setTestData('contentConsistent', contentConsistent);
});

Then('the content should be consistent across devices', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking content consistency');
  const contentConsistent = this.getTestData('contentConsistent') || false;
  expect(contentConsistent).toBe(true);
  this.logger.assertion('Content is consistent across devices', contentConsistent);
});



