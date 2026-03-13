



import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../../../core/world/customWorld';
import { LoginPage } from '../pages/loginPage';

let loginPage: LoginPage;

// Background Steps
Given('I am on the login page', async function (this: ICustomWorld) {
  loginPage = new LoginPage(this.page!, this.logger);
  await loginPage.navigateTo('/login');
});

Given('the login form is displayed', async function (this: ICustomWorld) {
  await loginPage.waitForLoginForm();
  const isVisible = await loginPage.isLoginFormVisible();
  expect(isVisible).toBe(true);
});

// When Steps - Actions
When('I enter valid username {string}', async function (this: ICustomWorld, username: string) {
  await loginPage.enterUsername(username);
});

When('I enter valid password {string}', async function (this: ICustomWorld, password: string) {
  await loginPage.enterPassword(password);
});

When('I enter invalid username {string}', async function (this: ICustomWorld, username: string) {
  await loginPage.enterUsername(username);
});

When('I enter invalid password {string}', async function (this: ICustomWorld, password: string) {
  await loginPage.enterPassword(password);
});

When('I click the login button', async function (this: ICustomWorld) {
  await loginPage.clickLoginButton();
});

When('I leave the username field empty', async function (this: ICustomWorld) {
  await loginPage.clearUsername();
});

When('I leave the password field empty', async function (this: ICustomWorld) {
  await loginPage.clearPassword();
});

When('I click the login button {int} times', async function (this: ICustomWorld, times: number) {
  for (let i = 0; i < times; i++) {
    await loginPage.clickLoginButton();
    await this.page!.waitForTimeout(1000); // Wait between attempts
  }
});

// Then Steps - Assertions
Then('I should be redirected to the dashboard', async function (this: ICustomWorld) {
  await loginPage.waitForUrl(/\/dashboard/);
  const currentUrl = this.page!.url();
  expect(currentUrl).toContain('/dashboard');
});

Then('I should see a welcome message', async function (this: ICustomWorld) {
  const welcomeMessage = await loginPage.getWelcomeMessage();
  expect(welcomeMessage).toContain('Welcome');
});

Then('the user menu should be visible', async function (this: ICustomWorld) {
  const isVisible = await loginPage.isUserMenuVisible();
  expect(isVisible).toBe(true);
});

Then('I should see an error message {string}', async function (this: ICustomWorld, expectedMessage: string) {
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toContain(expectedMessage);
});

Then('I should remain on the login page', async function (this: ICustomWorld) {
  const currentUrl = this.page!.url();
  expect(currentUrl).toContain('/login');
});

Then('I should see validation errors', async function (this: ICustomWorld) {
  const hasValidationErrors = await loginPage.hasValidationErrors();
  expect(hasValidationErrors).toBe(true);
});

Then('the username field should show {string}', async function (this: ICustomWorld, expectedError: string) {
  const usernameError = await loginPage.getUsernameError();
  expect(usernameError).toContain(expectedError);
});

Then('the password field should show {string}', async function (this: ICustomWorld, expectedError: string) {
  const passwordError = await loginPage.getPasswordError();
  expect(passwordError).toContain(expectedError);
});

Then('the login form should be disabled', async function (this: ICustomWorld) {
  const isDisabled = await loginPage.isLoginFormDisabled();
  expect(isDisabled).toBe(true);
});

// Accessibility Steps
Then('the login form should have proper labels', async function (this: ICustomWorld) {
  const hasProperLabels = await loginPage.hasProperLabels();
  expect(hasProperLabels).toBe(true);
});

Then('the form should be keyboard navigable', async function (this: ICustomWorld) {
  const isKeyboardNavigable = await loginPage.isKeyboardNavigable();
  expect(isKeyboardNavigable).toBe(true);
});

Then('the form should have appropriate ARIA attributes', async function (this: ICustomWorld) {
  const hasAriaAttributes = await loginPage.hasAriaAttributes();
  expect(hasAriaAttributes).toBe(true);
});

Then('the error messages should be announced to screen readers', async function (this: ICustomWorld) {
  const hasAriaLive = await loginPage.hasAriaLiveRegion();
  expect(hasAriaLive).toBe(true);
});

// Mobile Steps
Then('the mobile navigation should be visible', async function (this: ICustomWorld) {
  const isMobileNavVisible = await loginPage.isMobileNavigationVisible();
  expect(isMobileNavVisible).toBe(true);
});


