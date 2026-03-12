




import { Page } from '@playwright/test';
import { BasePage } from '../../../pages/base-page';

export class SearchResultsPage extends BasePage {
  // Page selectors
  private readonly selectors = {
    // Search elements
    searchInput: '[data-testid="search-input"], input[type="search"], #search-input, .search-field',
    searchButton: '[data-testid="search-button"], button[type="submit"], .search-submit',
    searchQuery: '[data-testid="search-query"], .search-term, .query-display',
    
    // Results container
    resultsContainer: 'main#wp--skip-link--target, main, [data-testid="search-results"]',
    resultsList: '[class*="post"], .results-list, .search-items, [data-testid="results-list"]',
    
    // Individual result items
    resultItem: '[class*="post"], .result-item, .search-result, [data-testid="result-item"]',
    resultTitle: '[data-testid="result-title"], .result-title, .result h3, .result h2',
    resultDescription: '[data-testid="result-description"], .result-description, .result-snippet',
    resultLink: '[data-testid="result-link"], .result-link, .result a',
    resultDate: '[data-testid="result-date"], .result-date, .publish-date',
    resultType: '[data-testid="result-type"], .result-type, .content-type',
    
    // Results metadata
    resultsCount: '[data-testid="results-count"], .results-count, .search-stats',
    resultsInfo: '[data-testid="results-info"], .results-info, .search-summary',
    
    // Pagination
    pagination: '[data-testid="pagination"], .pagination, .pager',
    nextButton: '[data-testid="next-page"], .next, button:has-text("Next")',
    prevButton: '[data-testid="prev-page"], .prev, button:has-text("Previous")',
    pageNumbers: '[data-testid="page-numbers"], .page-numbers, .pagination-numbers',
    
    // Filters and sorting
    filtersContainer: '[data-testid="search-filters"], .filters, .search-options',
    sortDropdown: '[data-testid="sort-dropdown"], .sort-options, select[name*="sort"]',
    dateFilter: '[data-testid="date-filter"], .date-filter, select[name*="date"]',
    typeFilter: '[data-testid="type-filter"], .type-filter, select[name*="type"]',
    
    // No results
    noResultsMessage: '[data-testid="no-results"], .no-results, .empty-results',
    suggestedSearches: '[data-testid="suggested-searches"], .suggestions, .related-searches',
    
    // Loading states
    loadingIndicator: '[data-testid="loading"], .loading, .spinner',
    
    // Breadcrumbs
    breadcrumbs: '[data-testid="breadcrumbs"], .breadcrumbs, .breadcrumb-nav',
    
    // Search suggestions/autocomplete
    searchSuggestions: '[data-testid="search-suggestions"], .suggestions, .autocomplete',
    suggestionItem: '[data-testid="suggestion-item"], .suggestion-item, .autocomplete-item'
  };

  constructor(page?: Page) {
    super(page);
  }

  // Navigation methods
  public async navigateToSearchResults(query: string): Promise<void> {
    await this.navigateTo(`/search?q=${encodeURIComponent(query)}`);
    await this.waitForPageLoad();
  }

  // Search methods
  public async performNewSearch(searchTerm: string): Promise<void> {
    await this.typeText(this.selectors.searchInput, searchTerm, { clear: true });
    await this.clickElement(this.selectors.searchButton);
    await this.waitForSearchResults();
  }

  public async refineSearch(additionalTerm: string): Promise<void> {
    const currentQuery = await this.getElementValue(this.selectors.searchInput);
    const newQuery = `${currentQuery} ${additionalTerm}`;
    await this.performNewSearch(newQuery);
  }

  public async clearSearch(): Promise<void> {
    await this.typeText(this.selectors.searchInput, '', { clear: true });
  }

  // Results interaction methods
  public async clickResultByIndex(index: number): Promise<void> {
    const resultItems = await this.findElements(this.selectors.resultItem);
    const targetResult = resultItems.nth(index);
    const resultLink = targetResult.locator(this.selectors.resultTitle).or(targetResult.locator('a')).first();
    
    await resultLink.click();
  }

  public async clickResultByTitle(title: string): Promise<void> {
    const resultTitle = this.page.locator(this.selectors.resultTitle).filter({ hasText: title });
    await resultTitle.click();
  }

  public async openResultInNewTab(index: number): Promise<void> {
    const resultItems = await this.findElements(this.selectors.resultItem);
    const targetResult = resultItems.nth(index);
    const resultLink = targetResult.locator('a').first();
    
    await resultLink.click({ modifiers: ['Control'] }); // Ctrl+Click to open in new tab
  }

  // Pagination methods
  public async goToNextPage(): Promise<void> {
    await this.clickElement(this.selectors.nextButton);
    await this.waitForSearchResults();
  }

  public async goToPreviousPage(): Promise<void> {
    await this.clickElement(this.selectors.prevButton);
    await this.waitForSearchResults();
  }

  public async goToPage(pageNumber: number): Promise<void> {
    const pageLink = this.page.locator(this.selectors.pageNumbers).locator(`text="${pageNumber}"`);
    await pageLink.click();
    await this.waitForSearchResults();
  }

  // Filter and sorting methods
  public async sortResultsBy(sortOption: string): Promise<void> {
    await this.selectOption(this.selectors.sortDropdown, sortOption);
    await this.waitForSearchResults();
  }

  public async filterByDate(dateOption: string): Promise<void> {
    await this.selectOption(this.selectors.dateFilter, dateOption);
    await this.waitForSearchResults();
  }

  public async filterByType(typeOption: string): Promise<void> {
    await this.selectOption(this.selectors.typeFilter, typeOption);
    await this.waitForSearchResults();
  }

  // Wait methods
  public async waitForSearchResults(): Promise<void> {
    try {
      // Wait for loading to disappear if present
      const loadingElement = await this.findElement(this.selectors.loadingIndicator);
      if (await loadingElement.isVisible()) {
        await this.waitForElement(this.selectors.loadingIndicator, { state: 'hidden', timeout: 10000 });
      }
    } catch {
      // Loading indicator might not be present
    }

    // Wait for either results or no results message
    await Promise.race([
      this.waitForElement(this.selectors.resultsContainer, { timeout: 15000 }),
      this.waitForElement(this.selectors.noResultsMessage, { timeout: 15000 })
    ]);
  }

  // Validation methods
  public async isPageLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(this.selectors.searchInput, { timeout: 10000 });
      
      // Check if we have results or no results message
      const hasResults = await this.isElementVisible(this.selectors.resultsContainer);
      const hasNoResults = await this.isElementVisible(this.selectors.noResultsMessage);
      
      return hasResults || hasNoResults;
    } catch {
      return false;
    }
  }

  public async validateSearchQuery(expectedQuery: string): Promise<boolean> {
    try {
      const displayedQuery = await this.getElementText(this.selectors.searchQuery);
      const inputQuery = await this.getElementValue(this.selectors.searchInput);
      
      return displayedQuery.includes(expectedQuery) || inputQuery.includes(expectedQuery);
    } catch {
      return false;
    }
  }

  public async validateResultsPresent(): Promise<boolean> {
    const resultsVisible = await this.isElementVisible(this.selectors.resultsContainer);
    
    if (!resultsVisible) {
      return false;
    }

    // For FRBSF search results, just check if we have any post elements
    const resultCount = await this.getElementCount(this.selectors.resultItem);
    return resultCount > 0;
  }

  public async validateNoResultsMessage(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.noResultsMessage);
  }

  public async validatePaginationPresent(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.pagination);
  }

  public async validateFiltersPresent(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.filtersContainer);
  }

  // Information retrieval methods
  public async getSearchQuery(): Promise<string> {
    try {
      return await this.getElementText(this.selectors.searchQuery);
    } catch {
      return await this.getElementValue(this.selectors.searchInput);
    }
  }

  public async getResultsCount(): Promise<number> {
    try {
      const resultsCountText = await this.getElementText(this.selectors.resultsCount);
      const match = resultsCountText.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    } catch {
      return await this.getElementCount(this.selectors.resultItem);
    }
  }

  public async getResultsInfo(): Promise<string> {
    return await this.getElementText(this.selectors.resultsInfo);
  }

  public async getResultTitles(): Promise<string[]> {
    const titleElements = await this.findElements(this.selectors.resultTitle);
    const count = await titleElements.count();
    const titles: string[] = [];

    for (let i = 0; i < count; i++) {
      const title = await titleElements.nth(i).textContent();
      if (title) {
        titles.push(title.trim());
      }
    }

    return titles;
  }

  public async getResultDescriptions(): Promise<string[]> {
    const descriptionElements = await this.findElements(this.selectors.resultDescription);
    const count = await descriptionElements.count();
    const descriptions: string[] = [];

    for (let i = 0; i < count; i++) {
      const description = await descriptionElements.nth(i).textContent();
      if (description) {
        descriptions.push(description.trim());
      }
    }

    return descriptions;
  }

  public async getResultByIndex(index: number): Promise<{
    title: string;
    description: string;
    link: string;
    date?: string;
    type?: string;
  }> {
    const resultItems = await this.findElements(this.selectors.resultItem);
    const targetResult = resultItems.nth(index);

    const title = await targetResult.locator(this.selectors.resultTitle).textContent() || '';
    const description = await targetResult.locator(this.selectors.resultDescription).textContent() || '';
    const link = await targetResult.locator('a').first().getAttribute('href') || '';
    
    let date = '';
    let type = '';

    try {
      date = await targetResult.locator(this.selectors.resultDate).textContent() || '';
    } catch {
      // Date might not be present
    }

    try {
      type = await targetResult.locator(this.selectors.resultType).textContent() || '';
    } catch {
      // Type might not be present
    }

    return {
      title: title.trim(),
      description: description.trim(),
      link,
      date: date.trim(),
      type: type.trim()
    };
  }

  public async getCurrentPageNumber(): Promise<number> {
    try {
      const activePageElement = this.page.locator(this.selectors.pageNumbers).locator('.active, .current, [aria-current="page"]');
      const pageText = await activePageElement.textContent();
      return pageText ? parseInt(pageText, 10) : 1;
    } catch {
      return 1;
    }
  }

  public async getTotalPages(): Promise<number> {
    try {
      const pageElements = await this.findElements(`${this.selectors.pageNumbers} a, ${this.selectors.pageNumbers} button`);
      const count = await pageElements.count();
      
      // Find the highest page number
      let maxPage = 1;
      for (let i = 0; i < count; i++) {
        const pageText = await pageElements.nth(i).textContent();
        if (pageText && /^\d+$/.test(pageText.trim())) {
          const pageNum = parseInt(pageText.trim(), 10);
          if (pageNum > maxPage) {
            maxPage = pageNum;
          }
        }
      }
      
      return maxPage;
    } catch {
      return 1;
    }
  }

  // Search suggestions methods
  public async getSearchSuggestions(): Promise<string[]> {
    const suggestionElements = await this.findElements(this.selectors.suggestionItem);
    const count = await suggestionElements.count();
    const suggestions: string[] = [];

    for (let i = 0; i < count; i++) {
      const suggestion = await suggestionElements.nth(i).textContent();
      if (suggestion) {
        suggestions.push(suggestion.trim());
      }
    }

    return suggestions;
  }

  public async clickSuggestion(suggestionText: string): Promise<void> {
    const suggestion = this.page.locator(this.selectors.suggestionItem).filter({ hasText: suggestionText });
    await suggestion.click();
    await this.waitForSearchResults();
  }

  // Performance validation
  public async validateSearchPerformance(): Promise<{ searchTime: number; isAcceptable: boolean }> {
    const startTime = Date.now();
    await this.waitForSearchResults();
    const searchTime = Date.now() - startTime;
    const isAcceptable = searchTime < 3000; // 3 seconds threshold for search results

    this.logger.performance('Search results load time', searchTime);

    return { searchTime, isAcceptable };
  }

  // Accessibility validation
  public async validateSearchAccessibility(): Promise<boolean> {
    const searchInputHasLabel = await this.getElementAttribute(this.selectors.searchInput, 'aria-label') !== null;
    const searchButtonHasLabel = await this.getElementAttribute(this.selectors.searchButton, 'aria-label') !== null;
    
    return searchInputHasLabel || searchButtonHasLabel;
  }
}

export default SearchResultsPage;





