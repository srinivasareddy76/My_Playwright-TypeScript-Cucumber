

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '@common/world';

Given('I am on the News & Media page', async function (this: ICustomWorld) {
  this.logger.step('Navigation', 'Navigating to News & Media page');
  await this.newsMediaPage.navigateToNewsPage();
  this.setScenarioContext('currentPage', 'news');
});

When('I browse the latest news', async function (this: ICustomWorld) {
  this.logger.step('Browse', 'Browsing latest news');
  await this.newsMediaPage.browseLatestNews();
});

Then('I should see recent news articles', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for recent news articles');
  const newsVisible = await this.newsMediaPage.validateNewsArticlesPresent();
  expect(newsVisible).toBe(true);
  this.logger.assertion('Recent news articles are visible', newsVisible);
});

When('I filter news by {string}', async function (this: ICustomWorld, filterType: string) {
  this.logger.step('Filter', `Filtering news by: ${filterType}`);
  await this.newsMediaPage.filterNews(filterType);
});

Then('I should see {string} news items', async function (this: ICustomWorld, newsType: string) {
  this.logger.step('Verification', `Checking for ${newsType} news items`);
  const filteredNews = await this.newsMediaPage.validateFilteredNews(newsType);
  expect(filteredNews).toBe(true);
  this.logger.assertion(`${newsType} news items are displayed`, filteredNews);
});

When('I click on a press release', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Clicking on press release');
  await this.newsMediaPage.clickPressRelease();
});

Then('I should see the press release details', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking press release details');
  const detailsVisible = await this.newsMediaPage.validatePressReleaseDetails();
  expect(detailsVisible).toBe(true);
  this.logger.assertion('Press release details are visible', detailsVisible);
});

When('I look for upcoming events', async function (this: ICustomWorld) {
  this.logger.step('Search', 'Looking for upcoming events');
  await this.newsMediaPage.findUpcomingEvents();
});

Then('I should see a list of events', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for events list');
  const eventsVisible = await this.newsMediaPage.validateEventsPresent();
  expect(eventsVisible).toBe(true);
  this.logger.assertion('Events list is visible', eventsVisible);
});

When('I search for news about {string}', async function (this: ICustomWorld, topic: string) {
  this.logger.step('Search', `Searching for news about: ${topic}`);
  await this.newsMediaPage.searchNews(topic);
  this.setScenarioContext('newsTopic', topic);
});

Then('I should see news results about {string}', async function (this: ICustomWorld, topic: string) {
  this.logger.step('Verification', `Checking news results for: ${topic}`);
  const resultsValid = await this.newsMediaPage.validateNewsResults(topic);
  expect(resultsValid).toBe(true);
  this.logger.assertion(`News results for ${topic} are displayed`, resultsValid);
});

When('I look for media contacts', async function (this: ICustomWorld) {
  this.logger.step('Search', 'Looking for media contacts');
  await this.newsMediaPage.findMediaContacts();
});

Then('I should see contact information for media inquiries', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking media contact information');
  const contactsVisible = await this.newsMediaPage.validateMediaContacts();
  expect(contactsVisible).toBe(true);
  this.logger.assertion('Media contact information is visible', contactsVisible);
});

When('I browse speeches and presentations', async function (this: ICustomWorld) {
  this.logger.step('Browse', 'Browsing speeches and presentations');
  await this.newsMediaPage.browseSpeechesAndPresentations();
});

Then('I should see available speeches and presentations', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking speeches and presentations');
  const speechesVisible = await this.newsMediaPage.validateSpeechesPresent();
  expect(speechesVisible).toBe(true);
  this.logger.assertion('Speeches and presentations are visible', speechesVisible);
});

When('I subscribe to news updates', async function (this: ICustomWorld) {
  this.logger.step('Subscription', 'Subscribing to news updates');
  await this.newsMediaPage.subscribeToNewsUpdates();
});

Then('I should see a subscription confirmation', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking subscription confirmation');
  const confirmationVisible = await this.newsMediaPage.validateSubscriptionConfirmation();
  expect(confirmationVisible).toBe(true);
  this.logger.assertion('Subscription confirmation is visible', confirmationVisible);
});

When('I check the RSS feed', async function (this: ICustomWorld) {
  this.logger.step('Check', 'Checking RSS feed');
  await this.newsMediaPage.checkRSSFeed();
});

Then('the RSS feed should be accessible', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking RSS feed accessibility');
  const rssAccessible = await this.newsMediaPage.validateRSSFeed();
  expect(rssAccessible).toBe(true);
  this.logger.assertion('RSS feed is accessible', rssAccessible);
});

When('I browse the news archive', async function (this: ICustomWorld) {
  this.logger.step('Browse', 'Browsing news archive');
  await this.newsMediaPage.browseNewsArchive();
});

Then('I should see archived news organized by date', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking archived news organization');
  const archiveOrganized = await this.newsMediaPage.validateNewsArchive();
  expect(archiveOrganized).toBe(true);
  this.logger.assertion('News archive is organized by date', archiveOrganized);
});

When('I share a news article', async function (this: ICustomWorld) {
  this.logger.step('Share', 'Sharing news article');
  await this.newsMediaPage.shareNewsArticle();
});

Then('the sharing options should be available', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking sharing options');
  const sharingAvailable = await this.newsMediaPage.validateSharingOptions();
  expect(sharingAvailable).toBe(true);
  this.logger.assertion('Sharing options are available', sharingAvailable);
});

When('I check for content freshness', async function (this: ICustomWorld) {
  this.logger.step('Check', 'Checking content freshness');
  await this.newsMediaPage.checkContentFreshness();
});

Then('the content should be recent and up-to-date', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking content recency');
  const contentFresh = await this.newsMediaPage.validateContentFreshness();
  expect(contentFresh).toBe(true);
  this.logger.assertion('Content is recent and up-to-date', contentFresh);
});


