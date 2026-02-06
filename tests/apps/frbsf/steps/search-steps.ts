import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../../../src/common/world';

Given('I am on the search page', async function (this: ICustomWorld) {
  this.logger.step('Navigation', 'Navigating to search page');
  await this.homePage.navigateToHomePage();
  await this.homePage.openSearchDialog();
});

When('I search for {string}', async function (this: ICustomWorld, searchTerm: string) {
  this.logger.step('Search', `Searching for: ${searchTerm}`);
  await this.searchResultsPage.performSearch(searchTerm);
  this.setScenarioContext('searchTerm', searchTerm);
});

Then('I should see search results', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking for search results');
  await this.searchResultsPage.waitForSearchResults();
  const resultsPresent = await this.searchResultsPage.validateResultsPresent();
  expect(resultsPresent).toBe(true);
  this.logger.assertion('Search results are present', resultsPresent);
});

Then('the results should contain {string}', async function (this: ICustomWorld, expectedText: string) {
  this.logger.step('Verification', `Checking results contain: ${expectedText}`);
  const resultsContainText = await this.searchResultsPage.validateResultsContainText(expectedText);
  expect(resultsContainText).toBe(true);
  this.logger.assertion(`Results contain "${expectedText}"`, resultsContainText);
});

When('I filter results by {string}', async function (this: ICustomWorld, filterType: string) {
  this.logger.step('Filter', `Applying filter: ${filterType}`);
  await this.searchResultsPage.applyFilter(filterType);
});

Then('the results should be filtered accordingly', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking filtered results');
  const resultsFiltered = await this.searchResultsPage.validateFilteredResults();
  expect(resultsFiltered).toBe(true);
  this.logger.assertion('Results are properly filtered', resultsFiltered);
});

When('I sort results by {string}', async function (this: ICustomWorld, sortOption: string) {
  this.logger.step('Sort', `Sorting results by: ${sortOption}`);
  await this.searchResultsPage.sortResults(sortOption);
});

Then('the results should be sorted by {string}', async function (this: ICustomWorld, sortOption: string) {
  this.logger.step('Verification', `Checking results sorted by: ${sortOption}`);
  const resultsSorted = await this.searchResultsPage.validateSortOrder(sortOption);
  expect(resultsSorted).toBe(true);
  this.logger.assertion(`Results sorted by ${sortOption}`, resultsSorted);
});

When('I navigate to page {int}', async function (this: ICustomWorld, pageNumber: number) {
  this.logger.step('Navigation', `Navigating to page: ${pageNumber}`);
  await this.searchResultsPage.navigateToPage(pageNumber);
});

Then('I should be on page {int}', async function (this: ICustomWorld, pageNumber: number) {
  this.logger.step('Verification', `Checking current page: ${pageNumber}`);
  const currentPage = await this.searchResultsPage.getCurrentPage();
  expect(currentPage).toBe(pageNumber);
  this.logger.assertion(`Current page is ${pageNumber}`, currentPage === pageNumber);
});

When('I click on the first search result', async function (this: ICustomWorld) {
  this.logger.step('Interaction', 'Clicking on first search result');
  await this.searchResultsPage.clickFirstResult();
});

Then('I should be taken to the result page', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking navigation to result page');
  await this.waitForPageLoad();
  const pageLoaded = await this.validateCurrentPageLoaded();
  expect(pageLoaded).toBe(true);
  this.logger.assertion('Navigated to result page', pageLoaded);
});

Then('I should see the number of results', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking results count display');
  const resultsCountVisible = await this.searchResultsPage.isResultsCountVisible();
  expect(resultsCountVisible).toBe(true);
  this.logger.assertion('Results count is visible', resultsCountVisible);
});

When('I perform an advanced search with:', async function (this: ICustomWorld, dataTable: any) {
  this.logger.step('Advanced Search', 'Performing advanced search');
  const searchParams = dataTable.rowsHash();
  await this.searchResultsPage.performAdvancedSearch(searchParams);
});

Then('the advanced search results should match the criteria', async function (this: ICustomWorld) {
  this.logger.step('Verification', 'Checking advanced search results');
  const resultsValid = await this.searchResultsPage.validateAdvancedSearchResults();
  expect(resultsValid).toBe(true);
  this.logger.assertion('Advanced search results match criteria', resultsValid);
});
