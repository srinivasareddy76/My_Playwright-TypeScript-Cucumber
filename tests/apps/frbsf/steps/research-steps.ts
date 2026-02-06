
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../../../../src/common/world';

Given('I am on the Research & Insights page', async function (this: ICustomWorld) {
  this.logger.step('Navigation', 'Navigating to Research & Insights page');
  await this.researchInsightsPage.navigateToResearchPage();
  this.setScenarioContext('currentPage', 'research');
});

When('I browse the research publications', async function (this: ICustomWorld) {
  this.logger.step('Browse', 'Browsing research publications');
  await this.researchInsightsPage.browsePublications();
});

Then('I should see a list of publications', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for publications list');
  const publicationsVisible = await this.researchInsightsPage.validatePublicationsPresent();
  expect(publicationsVisible).toBe(true);
  this.logger.assertion('Publications list is visible', publicationsVisible);
});

When('I filter publications by {string}', async function (this: ICustomWorld, filterType: string) {
  this.logger.step('Filter', `Filtering publications by: ${filterType}`);
  await this.researchInsightsPage.filterPublications(filterType);
});

Then('I should see {string} publications', async function (this: ICustomWorld, publicationType: string) {
  this.logger.step('Verification', `Checking for ${publicationType} publications`);
  const filteredResults = await this.researchInsightsPage.validateFilteredPublications(publicationType);
  expect(filteredResults).toBe(true);
  this.logger.assertion(`${publicationType} publications are displayed`, filteredResults);
});

When('I click on a Working Paper', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Clicking on Working Paper');
  await this.researchInsightsPage.clickWorkingPaper();
});

Then('I should see the Working Paper details', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking Working Paper details');
  const detailsVisible = await this.researchInsightsPage.validateWorkingPaperDetails();
  expect(detailsVisible).toBe(true);
  this.logger.assertion('Working Paper details are visible', detailsVisible);
});

When('I click on an Economic Letter', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Clicking on Economic Letter');
  await this.researchInsightsPage.clickEconomicLetter();
});

Then('I should see the Economic Letter content', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking Economic Letter content');
  const contentVisible = await this.researchInsightsPage.validateEconomicLetterContent();
  expect(contentVisible).toBe(true);
  this.logger.assertion('Economic Letter content is visible', contentVisible);
});

When('I search for research on {string}', async function (this: ICustomWorld, topic: string) {
  this.logger.step('Search', `Searching for research on: ${topic}`);
  await this.researchInsightsPage.searchResearch(topic);
  this.setScenarioContext('searchTopic', topic);
});

Then('I should see research results related to {string}', async function (this: ICustomWorld, topic: string) {
  this.logger.step('Verification', `Checking research results for: ${topic}`);
  const resultsValid = await this.researchInsightsPage.validateResearchResults(topic);
  expect(resultsValid).toBe(true);
  this.logger.assertion(`Research results for ${topic} are displayed`, resultsValid);
});

When('I look for author information', async function (this: ICustomWorld) {
  this.logger.step('Search', 'Looking for author information');
  await this.researchInsightsPage.findAuthorInformation();
});

Then('I should see author details and affiliations', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking author details');
  const authorInfoVisible = await this.researchInsightsPage.validateAuthorInformation();
  expect(authorInfoVisible).toBe(true);
  this.logger.assertion('Author information is visible', authorInfoVisible);
});

When('I try to download a publication', async function (this: ICustomWorld) {
  this.logger.step('Download', 'Attempting to download publication');
  await this.researchInsightsPage.downloadPublication();
});

Then('the download should be available', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking download availability');
  const downloadAvailable = await this.researchInsightsPage.validateDownloadAvailable();
  expect(downloadAvailable).toBe(true);
  this.logger.assertion('Download is available', downloadAvailable);
});

When('I subscribe to the newsletter', async function (this: ICustomWorld) {
  this.logger.step('Subscription', 'Subscribing to newsletter');
  await this.researchInsightsPage.subscribeToNewsletter();
});

Then('I should see a subscription confirmation', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking subscription confirmation');
  const confirmationVisible = await this.researchInsightsPage.validateSubscriptionConfirmation();
  expect(confirmationVisible).toBe(true);
  this.logger.assertion('Subscription confirmation is visible', confirmationVisible);
});

When('I share a publication on social media', async function (this: ICustomWorld) {
  this.logger.step('Share', 'Sharing publication on social media');
  await this.researchInsightsPage.shareOnSocialMedia();
});

Then('the social sharing options should be available', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking social sharing options');
  const sharingAvailable = await this.researchInsightsPage.validateSocialSharing();
  expect(sharingAvailable).toBe(true);
  this.logger.assertion('Social sharing options are available', sharingAvailable);
});

When('I browse by publication date', async function (this: ICustomWorld) {
  this.logger.step('Browse', 'Browsing by publication date');
  await this.researchInsightsPage.browseByDate();
});

Then('I should see publications organized by date', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking date organization');
  const dateOrganized = await this.researchInsightsPage.validateDateOrganization();
  expect(dateOrganized).toBe(true);
  this.logger.assertion('Publications are organized by date', dateOrganized);
});

When('I look for citation information', async function (this: ICustomWorld) {
  this.logger.step('Search', 'Looking for citation information');
  await this.researchInsightsPage.findCitationInfo();
});

Then('I should see proper citation formats', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking citation formats');
  const citationVisible = await this.researchInsightsPage.validateCitationFormats();
  expect(citationVisible).toBe(true);
  this.logger.assertion('Citation formats are available', citationVisible);
});

