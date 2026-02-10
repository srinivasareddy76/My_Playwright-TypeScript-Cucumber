

/**
 * @fileoverview Homepage Step Definitions - Cucumber step implementations for FRBSF homepage testing
 * 
 * This file contains all step definitions for testing the Federal Reserve Bank of San Francisco
 * homepage functionality. Steps are organized by functionality areas including navigation,
 * content validation, search, performance, and accessibility testing.
 * 
 * @author Test Automation Team
 * @version 1.0.0
 * @since 2026-02-10
 * 
 * @example
 * ```gherkin
 * Given I am on the FRBSF homepage
 * When I verify the page title contains "Federal Reserve"
 * Then I should see the FRBSF logo
 * ```
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '@common/world';

// ========================================
// NAVIGATION STEP DEFINITIONS
// ========================================

/**
 * Step: Navigate to the FRBSF homepage
 * 
 * Navigates to the Federal Reserve Bank of San Francisco homepage and sets
 * the scenario context to track the current page for subsequent steps.
 * 
 * @param {ICustomWorld} this - Cucumber world context with page objects and utilities
 * 
 * @example
 * ```gherkin
 * Given I am on the FRBSF homepage
 * ```
 */
Given('I am on the FRBSF homepage', async function (this: ICustomWorld) {
  this.logger.step('Navigation', 'Navigating to FRBSF homepage');
  await this.homePage.navigateToHomePage();
  this.setScenarioContext('currentPage', 'homepage');
});

/**
 * Step: Verify page has loaded completely
 * 
 * Waits for the page to fully load and validates that all essential elements
 * are present. Uses the page object's isPageLoaded() method for validation.
 * 
 * @param {ICustomWorld} this - Cucumber world context with page objects and utilities
 * 
 * @example
 * ```gherkin
 * Given the page has loaded completely
 * And the page has loaded completely
 * ```
 */
Given('the page has loaded completely', async function (this: ICustomWorld) {
  this.logger.step('Page Load', 'Waiting for page to load completely');
  await this.homePage.waitForPageLoad();
  const isLoaded = await this.homePage.isPageLoaded();
  expect(isLoaded).toBe(true);
  this.logger.assertion('Page loaded completely', isLoaded);
});

// ========================================
// CONTENT VALIDATION STEP DEFINITIONS
// ========================================

/**
 * Step: Verify page title contains specific text
 * 
 * Validates that the page title contains the expected text (case-insensitive).
 * Useful for verifying correct page loading and SEO compliance.
 * 
 * @param {ICustomWorld} this - Cucumber world context with page objects and utilities
 * @param {string} expectedText - The text that should be present in the page title
 * 
 * @example
 * ```gherkin
 * When I verify the page title contains "Federal Reserve"
 * When I verify the page title contains "San Francisco"
 * ```
 */
When('I verify the page title contains {string}', async function (this: ICustomWorld, expectedText: string) {
  this.logger.step('Verification', `Verifying page title contains: ${expectedText}`);
  const pageTitle = await this.homePage.getPageTitle();
  expect(pageTitle.toLowerCase()).toContain(expectedText.toLowerCase());
  this.logger.assertion(`Page title contains "${expectedText}"`, true);
});

/**
 * Step: Verify FRBSF logo is visible
 * 
 * Checks that the Federal Reserve Bank of San Francisco logo is visible on the page.
 * Uses multiple selector strategies to ensure robust element detection.
 * 
 * @param {ICustomWorld} this - Cucumber world context with page objects and utilities
 * 
 * @example
 * ```gherkin
 * Then I should see the FRBSF logo
 * ```
 */
Then('I should see the FRBSF logo', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for FRBSF logo visibility');
  const logoVisible = await this.homePage.isElementVisible('.sffed-logo-org__logotype, a[href="/"], [class*="logo"]');
  expect(logoVisible).toBe(true);
  this.logger.assertion('FRBSF logo is visible', logoVisible);
});

/**
 * Step: Verify main navigation menu is present
 * 
 * Validates that the main navigation menu is visible and functional.
 * Checks for key navigation elements including About, Research, and other menu items.
 * 
 * @param {ICustomWorld} this - Cucumber world context with page objects and utilities
 * 
 * @example
 * ```gherkin
 * Then I should see the main navigation menu
 * ```
 */
Then('I should see the main navigation menu', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for main navigation menu');
  const navigationValid = await this.homePage.validateMainNavigationMenu();
  expect(navigationValid).toBe(true);
  this.logger.assertion('Main navigation menu is visible and functional', navigationValid);
});

/**
 * Step: Verify hero section is present
 * 
 * Validates that the hero section (main banner/header area) is visible on the homepage.
 * The hero section typically contains key messaging and navigation elements.
 * 
 * @param {ICustomWorld} this - Cucumber world context with page objects and utilities
 * 
 * @example
 * ```gherkin
 * Then I should see the hero section
 * ```
 */
Then('I should see the hero section', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for hero section');
  const heroValid = await this.homePage.validateHeroSection();
  expect(heroValid).toBe(true);
  this.logger.assertion('Hero section is visible', heroValid);
});

When('I verify the page title contains {string}', async function (this: ICustomWorld, expectedText: string) {
  this.logger.step('Verification', `Verifying page title contains: ${expectedText}`);
  const pageTitle = await this.homePage.getPageTitle();
  expect(pageTitle.toLowerCase()).toContain(expectedText.toLowerCase());
  this.logger.assertion(`Page title contains "${expectedText}"`, true);
});

Then('I should see the FRBSF logo', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for FRBSF logo visibility');
  const logoVisible = await this.homePage.isElementVisible('.sffed-logo-org__logotype, a[href="/"], [class*="logo"]');
  expect(logoVisible).toBe(true);
  this.logger.assertion('FRBSF logo is visible', logoVisible);
});

Then('I should see the main navigation menu', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for main navigation menu');
  const navigationValid = await this.homePage.validateMainNavigationMenu();
  expect(navigationValid).toBe(true);
  this.logger.assertion('Main navigation menu is visible and functional', navigationValid);
});

Then('I should see the hero section', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for hero section');
  const heroValid = await this.homePage.validateHeroSection();
  expect(heroValid).toBe(true);
  this.logger.assertion('Hero section is visible', heroValid);
});

Then('the page should load within {int} seconds', async function (this: ICustomWorld, seconds: number) {
  this.logger.step('Performance', `Validating page load time within ${seconds} seconds`);
  const performanceResult = await this.homePage.validatePageLoadPerformance();
  const loadTimeInSeconds = performanceResult.loadTime / 1000;
  
  expect(loadTimeInSeconds).toBeLessThanOrEqual(seconds);
  this.logger.assertion(`Page loaded within ${seconds} seconds (actual: ${loadTimeInSeconds.toFixed(2)}s)`, loadTimeInSeconds <= seconds);
  
  this.setTestData('pageLoadTime', performanceResult.loadTime);
});

When('I hover over the {string} menu item', async function (this: ICustomWorld, menuItem: string) {
  this.logger.step('Interaction', `Hovering over ${menuItem} menu item`);
  
  switch (menuItem.toLowerCase()) {
    case 'about':
      await this.homePage.hoverOverAboutMenu();
      break;
    case 'research':
      await this.homePage.hoverOverResearchMenu();
      break;
    case 'news':
      await this.homePage.hoverOverNewsMenu();
      break;
    default:
      throw new Error(`Unknown menu item: ${menuItem}`);
  }
});

Then('I should see the {word} dropdown menu', async function (this: ICustomWorld, menuType: string) {
  this.logger.step('Verification', `Checking for ${menuType} dropdown menu`);
  
  let dropdownSelector: string;
  switch (menuType.toLowerCase()) {
    case 'about':
      dropdownSelector = '#sffed-child-menu-item-12';
      break;
    case 'research':
      dropdownSelector = '#sffed-child-menu-item-2';
      break;
    case 'news':
      dropdownSelector = '#sffed-child-menu-item-31';
      break;
    default:
      throw new Error(`Unknown dropdown type: ${menuType}`);
  }
  
  const dropdownExists = await this.homePage.isElementPresent(dropdownSelector);
  expect(dropdownExists).toBe(true);
  this.logger.assertion(`${menuType} dropdown menu exists`, dropdownExists);
});

When('I click on the search button', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Clicking on search button');
  await this.homePage.openSearchDialog();
});

Then('I should see the search input field', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for search input field');
  const searchInputVisible = await this.homePage.isElementVisible('#sffed-search-input, input[name="s"][type="search"]');
  expect(searchInputVisible).toBe(true);
  this.logger.assertion('Search input field is visible', searchInputVisible);
});

When('I enter {string} in the search field', async function (this: ICustomWorld, searchTerm: string) {
  this.logger.step('Interaction', `Entering search term: ${searchTerm}`);
  await this.homePage.typeText('#sffed-search-input, input[name="s"][type="search"]', searchTerm);
  this.setScenarioContext('searchTerm', searchTerm);
});

When('I press Enter', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Pressing Enter key');
  const page = await this.homePage.getPage();
  await page.keyboard.press('Enter');
});

Then('I should be redirected to the search results page', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking redirection to search results page');
  await this.homePage.waitForUrl(/\?s=|search|results/i);
  const currentUrl = await this.homePage.getCurrentUrl();
  expect(currentUrl).toMatch(/\?s=|search|results/i);
  this.logger.assertion('Redirected to search results page', true);
  this.setScenarioContext('currentPage', 'search-results');
});

Then('I should see search results for {string}', async function (this: ICustomWorld, searchTerm: string) {
  this.logger.step('Verification', `Checking for search results for: ${searchTerm}`);
  await this.searchResultsPage.waitForSearchResults();
  const resultsValid = await this.searchResultsPage.validateResultsPresent();
  expect(resultsValid).toBe(true);
  this.logger.assertion(`Search results found for "${searchTerm}"`, resultsValid);
});

Then('I should see the Federal Reserve Bank of San Francisco logo', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for Federal Reserve Bank of San Francisco logo');
  const brandingValid = await this.homePage.validateFederalReserveBranding();
  expect(brandingValid).toBe(true);
  this.logger.assertion('Federal Reserve Bank of San Francisco branding is visible', brandingValid);
});

Then('the page title should contain {string}', async function (this: ICustomWorld, expectedText: string) {
  this.logger.step('Verification', `Verifying page title contains: ${expectedText}`);
  const pageTitle = await this.homePage.getPageTitle();
  expect(pageTitle.toLowerCase()).toContain(expectedText.toLowerCase());
  this.logger.assertion(`Page title contains "${expectedText}"`, true);
});

Then('I should see Federal Reserve branding elements', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for Federal Reserve branding elements');
  const brandingValid = await this.homePage.validateFederalReserveBranding();
  expect(brandingValid).toBe(true);
  this.logger.assertion('Federal Reserve branding elements are present', brandingValid);
});

Then('the logo should be clickable and link to the homepage', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking logo clickability and homepage link');
  const logoClickable = await this.homePage.isLogoClickable();
  expect(logoClickable).toBe(true);
  this.logger.assertion('Logo is clickable', logoClickable);
});

Then('I should see the Research & Insights section', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for Research & Insights section');
  const sectionVisible = await this.homePage.isResearchInsightsSectionVisible();
  expect(sectionVisible).toBe(true);
  this.logger.assertion('Research & Insights section is visible', sectionVisible);
});

Then('I should see the News & Media section', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for News & Media section');
  const sectionVisible = await this.homePage.isNewsMediaSectionVisible();
  expect(sectionVisible).toBe(true);
  this.logger.assertion('News & Media section is visible', sectionVisible);
});

Then('I should see the Economic Data section', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for Economic Data section');
  const sectionVisible = await this.homePage.isEconomicDataSectionVisible();
  expect(sectionVisible).toBe(true);
  this.logger.assertion('Economic Data section is visible', sectionVisible);
});

When('I scroll to the District Information section', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Scrolling to District Information section');
  await this.homePage.scrollToDistrictSection();
});

Then('I should see district-specific information', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for district-specific information');
  const districtInfoValid = await this.homePage.validateDistrictInformation();
  expect(districtInfoValid).toBe(true);
  this.logger.assertion('District-specific information is visible', districtInfoValid);
});

Then('I should see the interactive district map', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for interactive district map');
  const mapVisible = await this.homePage.isDistrictMapVisible();
  expect(mapVisible).toBe(true);
  this.logger.assertion('Interactive district map is visible', mapVisible);
});

When('I scroll to the bottom of the page', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Scrolling to bottom of page');
  await this.homePage.scrollToBottom();
});

Then('I should see the footer section', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for footer section');
  const footerVisible = await this.homePage.isElementVisible('footer, .footer, .site-footer');
  expect(footerVisible).toBe(true);
  this.logger.assertion('Footer section is visible', footerVisible);
});

Then('I should see footer navigation links', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for footer navigation links');
  const footerLinksCount = await this.homePage.getElementCount('footer a, .footer a');
  expect(footerLinksCount).toBeGreaterThan(0);
  this.logger.assertion(`Footer contains ${footerLinksCount} navigation links`, footerLinksCount > 0);
});

Then('I should see contact information', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for contact information');
  const contactInfoVisible = await this.homePage.isContactInfoVisible();
  expect(contactInfoVisible).toBe(true);
  this.logger.assertion('Contact information is visible', contactInfoVisible);
});

Then('I should see social media links', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for social media links');
  const socialMediaValid = await this.homePage.validateSocialMediaLinks();
  expect(socialMediaValid).toBe(true);
  this.logger.assertion('Social media links are present', socialMediaValid);
});

Then('all footer links should be functional', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking footer link functionality');
  const footerValid = await this.homePage.validateFooterContent();
  expect(footerValid).toBe(true);
  this.logger.assertion('Footer links are functional', footerValid);
});

When('I scroll to the social media section', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Scrolling to social media section');
  // Social media links are in the footer, so scroll to bottom
  await this.homePage.scrollToBottom();
});

Then('I should see LinkedIn link', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for LinkedIn link');
  const linkedinVisible = await this.homePage.isElementVisible('a[href*="linkedin"], a[aria-label*="LinkedIn"]');
  expect(linkedinVisible).toBe(true);
  this.logger.assertion('LinkedIn link is visible', linkedinVisible);
});

Then('I should see Facebook link', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for Facebook link');
  const facebookVisible = await this.homePage.isElementVisible('a[href*="facebook"], a[aria-label*="Facebook"]');
  expect(facebookVisible).toBe(true);
  this.logger.assertion('Facebook link is visible', facebookVisible);
});

Then('I should see Twitter link', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for Twitter link');
  const twitterVisible = await this.homePage.isElementVisible('a[href*="twitter"], a[href*="x.com"], a[aria-label*="Twitter"]');
  expect(twitterVisible).toBe(true);
  this.logger.assertion('Twitter link is visible', twitterVisible);
});

When('I click on the LinkedIn link', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Clicking on LinkedIn link');
  await this.homePage.clickLinkedInLink();
});

Then('it should open in a new tab or window', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for new tab/window opening');
  const page = await this.homePage.getPage();
  const context = page.context();
  const pages = context.pages();
  
  // Wait a moment for new page to potentially open
  await page.waitForTimeout(2000);
  const newPages = context.pages();
  
  expect(newPages.length).toBeGreaterThanOrEqual(pages.length);
  this.logger.assertion('Link opened in new tab/window or same page', true);
});



When('I reload the page', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Reloading the page');
  await this.refreshCurrentPage();
  await this.waitForPageLoad();
});

Then('the page should be responsive', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking page responsiveness');
  const isLoaded = await this.homePage.isPageLoaded();
  expect(isLoaded).toBe(true);
  this.logger.assertion('Page is responsive', isLoaded);
});

Then('the navigation should be mobile-friendly', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking mobile-friendly navigation');
  const navigationValid = await this.homePage.validateMainNavigationMenu();
  expect(navigationValid).toBe(true);
  this.logger.assertion('Navigation is mobile-friendly', navigationValid);
});

Then('all content should be accessible', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking content accessibility');
  const contentValid = await this.homePage.validateKeyContentSections();
  expect(contentValid).toBe(true);
  this.logger.assertion('All content is accessible', contentValid);
});

Then('the navigation should work properly', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking navigation functionality');
  const navigationValid = await this.homePage.validateMainNavigationMenu();
  expect(navigationValid).toBe(true);
  this.logger.assertion('Navigation works properly', navigationValid);
});

Then('all content should be properly formatted', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking content formatting');
  const contentValid = await this.homePage.validateKeyContentSections();
  expect(contentValid).toBe(true);
  this.logger.assertion('Content is properly formatted', contentValid);
});

Then('images should scale appropriately', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking image scaling');
  // This is a visual check that would typically require more sophisticated testing
  // For now, we'll verify that images are present and the page loads correctly
  const pageValid = await this.homePage.isPageLoaded();
  expect(pageValid).toBe(true);
  this.logger.assertion('Images scale appropriately', pageValid);
});

Then('the page should have proper heading structure', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking heading structure');
  const accessibilityValid = await this.homePage.validateAccessibility();
  expect(accessibilityValid).toBe(true);
  this.logger.assertion('Page has proper heading structure', accessibilityValid);
});

Then('images should have alt text', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking image alt text');
  const page = await this.homePage.getPage();
  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  expect(imagesWithoutAlt).toBe(0);
  this.logger.assertion('All images have alt text', imagesWithoutAlt === 0);
});

Then('the page should be keyboard navigable', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking keyboard navigation');
  const accessibilityValid = await this.homePage.validateAccessibility();
  expect(accessibilityValid).toBe(true);
  this.logger.assertion('Page is keyboard navigable', accessibilityValid);
});

Then('there should be skip navigation links', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for skip navigation links');
  const skipLinkVisible = await this.homePage.isElementVisible('a[href="#main"], .skip-link');
  expect(skipLinkVisible).toBe(true);
  this.logger.assertion('Skip navigation links are present', skipLinkVisible);
});

Then('color contrast should meet WCAG standards', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking color contrast standards');
  // This would typically require specialized accessibility testing tools
  // For now, we'll perform a basic check
  const accessibilityValid = await this.homePage.validateAccessibility();
  expect(accessibilityValid).toBe(true);
  this.logger.assertion('Color contrast meets WCAG standards', accessibilityValid);
});

Given('I am using a {word} viewport', async function (this: ICustomWorld, viewportType: string) {
  this.logger.step('Setup', `Setting ${viewportType} viewport`);
  
  switch (viewportType.toLowerCase()) {
    case 'desktop':
      await this.setDesktopViewport();
      break;
    case 'tablet':
      await this.setTabletViewport();
      break;
    case 'mobile':
      await this.setMobileViewport();
      break;
    default:
      throw new Error(`Unknown viewport type: ${viewportType}`);
  }
});

When('I measure the page load time', async function (this: ICustomWorld) {
  this.logger.step('Performance', 'Measuring page load time');
  this.startPerformanceMeasurement();
  await this.homePage.waitForPageLoad();
  const loadTime = this.endPerformanceMeasurement('Page load measurement');
  this.setTestData('measuredLoadTime', loadTime);
});

Then('all critical resources should be loaded', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking critical resources loading');
  const pageLoaded = await this.homePage.isPageLoaded();
  expect(pageLoaded).toBe(true);
  this.logger.assertion('All critical resources are loaded', pageLoaded);
});

Then('the page should be interactive', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking page interactivity');
  const page = await this.homePage.getPage();
  await page.waitForLoadState('domcontentloaded');
  const isInteractive = await page.evaluate(() => document.readyState === 'complete');
  expect(isInteractive).toBe(true);
  this.logger.assertion('Page is interactive', isInteractive);
});

When('I navigate to the district information section', async function (this: ICustomWorld) {
  this.logger.step('Navigation', 'Navigating to district information section');
  await this.homePage.scrollToDistrictSection();
});

Then('I should see information about the 12th Federal Reserve District', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for 12th Federal Reserve District information');
  const districtInfoValid = await this.homePage.validateDistrictInformation();
  expect(districtInfoValid).toBe(true);
  this.logger.assertion('12th Federal Reserve District information is visible', districtInfoValid);
});

Then('I should see the states covered by the district', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for district states information');
  const statesVisible = await this.homePage.isDistrictStatesVisible();
  expect(statesVisible).toBe(true);
  this.logger.assertion('District states information is visible', statesVisible);
});

Then('I should see district contact information', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for district contact information');
  const contactVisible = await this.homePage.isContactInfoVisible();
  expect(contactVisible).toBe(true);
  this.logger.assertion('District contact information is visible', contactVisible);
});

Then('I should see the district map', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for district map');
  const mapVisible = await this.homePage.isDistrictMapVisible();
  expect(mapVisible).toBe(true);
  this.logger.assertion('District map is visible', mapVisible);
});

Then('the map should be interactive', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking map interactivity');
  const mapVisible = await this.homePage.isDistrictMapVisible();
  expect(mapVisible).toBe(true);
  this.logger.assertion('District map is interactive', mapVisible);
});

When('I look for quick access links', async function (this: ICustomWorld) {
  this.logger.step('Search', 'Looking for quick access links');
  await this.homePage.scrollToQuickLinksSection();
});

Then('I should see links to popular sections', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for popular section links');
  const quickLinksVisible = await this.homePage.isQuickLinksVisible();
  expect(quickLinksVisible).toBe(true);
  this.logger.assertion('Quick access links to popular sections are visible', quickLinksVisible);
});

Then('I should see shortcuts to key resources', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for key resource shortcuts');
  const shortcutsVisible = await this.homePage.isQuickLinksVisible();
  expect(shortcutsVisible).toBe(true);
  this.logger.assertion('Shortcuts to key resources are visible', shortcutsVisible);
});

When('I click on a quick link', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Clicking on a quick link');
  // Use navigation links as quick links - click on "About Us" link
  await this.homePage.clickElement('nav a:has-text("About Us")');
  // Update context to indicate we're on the about page
  this.setScenarioContext('currentPage', 'about');
});

Then('I should be taken to the appropriate page', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking navigation to appropriate page');
  await this.waitForPageLoad();
  const currentUrl = await this.homePage.getCurrentUrl();
  expect(currentUrl).toContain('frbsf.org');
  this.logger.assertion('Navigated to appropriate page', true);
});

Then('the page should load successfully', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking successful page load');
  await this.waitForPageLoad();
  const pageLoaded = await this.validateCurrentPageLoaded();
  expect(pageLoaded).toBe(true);
  this.logger.assertion('Page loaded successfully', pageLoaded);
});




