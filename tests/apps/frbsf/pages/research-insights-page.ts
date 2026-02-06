






import { Page } from '@playwright/test';
import { BasePage } from '../../../pages/base-page';

export class ResearchInsightsPage extends BasePage {
  // Page selectors
  private readonly selectors = {
    // Page header
    pageTitle: '[data-testid="page-title"], h1, .page-title',
    pageDescription: '[data-testid="page-description"], .page-description, .intro-text',
    
    // Navigation and breadcrumbs
    breadcrumbs: '[data-testid="breadcrumbs"], .breadcrumbs, .breadcrumb-nav',
    sectionNavigation: '[data-testid="section-nav"], .section-nav, .sub-navigation',
    
    // Research categories
    researchCategories: '[data-testid="research-categories"], .research-categories, .topic-filters',
    categoryFilter: '[data-testid="category-filter"], .category-filter, select[name*="category"]',
    
    // Featured research
    featuredResearch: '[data-testid="featured-research"], .featured-research, .highlight-research',
    featuredArticle: '[data-testid="featured-article"], .featured-article, .featured-item',
    
    // Research listings
    researchContainer: '[data-testid="research-container"], .research-list, .publications-list',
    researchItem: '[data-testid="research-item"], .research-item, .publication-item',
    researchTitle: '[data-testid="research-title"], .research-title, .publication-title',
    researchAuthor: '[data-testid="research-author"], .research-author, .author-name',
    researchDate: '[data-testid="research-date"], .research-date, .publish-date',
    researchSummary: '[data-testid="research-summary"], .research-summary, .abstract',
    researchLink: '[data-testid="research-link"], .research-link, .read-more',
    researchType: '[data-testid="research-type"], .research-type, .publication-type',
    
    // Publication types
    workingPapers: '[data-testid="working-papers"], .working-papers, a[href*="working-papers"]',
    economicLetters: '[data-testid="economic-letters"], .economic-letters, a[href*="economic-letter"]',
    policyBriefs: '[data-testid="policy-briefs"], .policy-briefs, a[href*="policy"]',
    speeches: '[data-testid="speeches"], .speeches, a[href*="speech"]',
    
    // Filters and sorting
    filtersContainer: '[data-testid="filters"], .filters, .research-filters',
    dateFilter: '[data-testid="date-filter"], .date-filter, select[name*="date"]',
    authorFilter: '[data-testid="author-filter"], .author-filter, select[name*="author"]',
    topicFilter: '[data-testid="topic-filter"], .topic-filter, select[name*="topic"]',
    sortOptions: '[data-testid="sort-options"], .sort-options, select[name*="sort"]',
    
    // Search within research
    researchSearch: '[data-testid="research-search"], .research-search, input[placeholder*="research"]',
    searchButton: '[data-testid="search-button"], .search-button, button[type="submit"]',
    
    // Pagination
    pagination: '[data-testid="pagination"], .pagination, .pager',
    nextButton: '[data-testid="next-page"], .next, button:has-text("Next")',
    prevButton: '[data-testid="prev-page"], .prev, button:has-text("Previous")',
    
    // Research details
    downloadLink: '[data-testid="download-link"], .download-link, a[href*=".pdf"]',
    citationInfo: '[data-testid="citation"], .citation, .cite-info',
    relatedResearch: '[data-testid="related-research"], .related-research, .related-items',
    
    // Economic data and charts
    economicCharts: '[data-testid="economic-charts"], .charts, .data-visualization',
    chartContainer: '[data-testid="chart-container"], .chart-container, .chart-wrapper',
    dataTable: '[data-testid="data-table"], .data-table, table',
    
    // Newsletter signup
    newsletterSignup: '[data-testid="newsletter-signup"], .newsletter-signup, .subscribe',
    emailInput: '[data-testid="email-input"], input[type="email"], input[name*="email"]',
    subscribeButton: '[data-testid="subscribe-button"], .subscribe-button, button:has-text("Subscribe")',
    
    // Social sharing
    shareButtons: '[data-testid="share-buttons"], .share-buttons, .social-share',
    shareLinkedIn: '[data-testid="share-linkedin"], .share-linkedin, a[href*="linkedin"]',
    shareTwitter: '[data-testid="share-twitter"], .share-twitter, a[href*="twitter"]',
    shareEmail: '[data-testid="share-email"], .share-email, a[href*="mailto"]',
    
    // Loading states
    loadingIndicator: '[data-testid="loading"], .loading, .spinner',
    
    // Error states
    errorMessage: '[data-testid="error-message"], .error-message, .alert-error'
  };

  constructor(page?: Page) {
    super(page);
  }

  // Navigation methods
  public async navigateToResearchPage(): Promise<void> {
    await this.navigateTo('/research');
    await this.waitForPageLoad();
  }

  public async navigateToWorkingPapers(): Promise<void> {
    await this.clickElement(this.selectors.workingPapers);
    await this.waitForPageLoad();
  }

  public async navigateToEconomicLetters(): Promise<void> {
    await this.clickElement(this.selectors.economicLetters);
    await this.waitForPageLoad();
  }

  public async navigateToPolicyBriefs(): Promise<void> {
    await this.clickElement(this.selectors.policyBriefs);
    await this.waitForPageLoad();
  }

  public async navigateToSpeeches(): Promise<void> {
    await this.clickElement(this.selectors.speeches);
    await this.waitForPageLoad();
  }

  // Research interaction methods
  public async clickResearchItemByIndex(index: number): Promise<void> {
    const researchItems = await this.findElements(this.selectors.researchItem);
    const targetItem = researchItems.nth(index);
    const itemLink = targetItem.locator(this.selectors.researchTitle).or(targetItem.locator('a')).first();
    
    await itemLink.click();
  }

  public async clickResearchItemByTitle(title: string): Promise<void> {
    const researchTitle = this.page.locator(this.selectors.researchTitle).filter({ hasText: title });
    await researchTitle.click();
  }

  public async downloadResearchPaper(index: number): Promise<void> {
    const researchItems = await this.findElements(this.selectors.researchItem);
    const targetItem = researchItems.nth(index);
    const downloadLink = targetItem.locator(this.selectors.downloadLink);
    
    await downloadLink.click();
  }

  // Filter and search methods
  public async filterByCategory(category: string): Promise<void> {
    await this.selectOption(this.selectors.categoryFilter, category);
    await this.waitForResearchResults();
  }

  public async filterByDate(dateOption: string): Promise<void> {
    await this.selectOption(this.selectors.dateFilter, dateOption);
    await this.waitForResearchResults();
  }

  public async filterByAuthor(author: string): Promise<void> {
    await this.selectOption(this.selectors.authorFilter, author);
    await this.waitForResearchResults();
  }

  public async filterByTopic(topic: string): Promise<void> {
    await this.selectOption(this.selectors.topicFilter, topic);
    await this.waitForResearchResults();
  }

  public async sortResearchBy(sortOption: string): Promise<void> {
    await this.selectOption(this.selectors.sortOptions, sortOption);
    await this.waitForResearchResults();
  }

  public async searchResearch(searchTerm: string): Promise<void> {
    await this.typeText(this.selectors.researchSearch, searchTerm, { clear: true });
    await this.clickElement(this.selectors.searchButton);
    await this.waitForResearchResults();
  }

  // Newsletter and sharing methods
  public async subscribeToNewsletter(email: string): Promise<void> {
    await this.typeText(this.selectors.emailInput, email);
    await this.clickElement(this.selectors.subscribeButton);
  }

  public async shareOnLinkedIn(): Promise<void> {
    await this.clickElement(this.selectors.shareLinkedIn);
  }

  public async shareOnTwitter(): Promise<void> {
    await this.clickElement(this.selectors.shareTwitter);
  }

  public async shareViaEmail(): Promise<void> {
    await this.clickElement(this.selectors.shareEmail);
  }

  // Wait methods
  public async waitForResearchResults(): Promise<void> {
    try {
      // Wait for loading to disappear if present
      const loadingElement = await this.findElement(this.selectors.loadingIndicator);
      if (await loadingElement.isVisible()) {
        await this.waitForElement(this.selectors.loadingIndicator, { state: 'hidden', timeout: 10000 });
      }
    } catch {
      // Loading indicator might not be present
    }

    // Wait for research container to be visible
    await this.waitForElement(this.selectors.researchContainer, { timeout: 15000 });
  }

  // Validation methods
  public async isPageLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(this.selectors.pageTitle, { timeout: 10000 });
      await this.waitForElement(this.selectors.researchContainer, { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  public async validateResearchContent(): Promise<boolean> {
    const researchContainerVisible = await this.isElementVisible(this.selectors.researchContainer);
    
    if (!researchContainerVisible) {
      return false;
    }

    const researchCount = await this.getResearchItemsCount();
    return researchCount > 0;
  }

  public async validateFeaturedResearch(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.featuredResearch);
  }

  public async validateFiltersPresent(): Promise<boolean> {
    const filtersVisible = await this.isElementVisible(this.selectors.filtersContainer);
    const categoryFilterVisible = await this.isElementVisible(this.selectors.categoryFilter);
    
    return filtersVisible || categoryFilterVisible;
  }

  public async validatePublicationTypes(): Promise<boolean> {
    const workingPapersVisible = await this.isElementVisible(this.selectors.workingPapers);
    const economicLettersVisible = await this.isElementVisible(this.selectors.economicLetters);
    const policyBriefsVisible = await this.isElementVisible(this.selectors.policyBriefs);
    
    return workingPapersVisible || economicLettersVisible || policyBriefsVisible;
  }

  public async validateSearchFunctionality(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.researchSearch);
  }

  public async validateNewsletterSignup(): Promise<boolean> {
    const signupVisible = await this.isElementVisible(this.selectors.newsletterSignup);
    const emailInputVisible = await this.isElementVisible(this.selectors.emailInput);
    
    return signupVisible && emailInputVisible;
  }

  public async validateSocialSharing(): Promise<boolean> {
    const shareButtonsVisible = await this.isElementVisible(this.selectors.shareButtons);
    const linkedInShareVisible = await this.isElementVisible(this.selectors.shareLinkedIn);
    const twitterShareVisible = await this.isElementVisible(this.selectors.shareTwitter);
    
    return shareButtonsVisible || linkedInShareVisible || twitterShareVisible;
  }

  // Information retrieval methods
  public async getPageTitle(): Promise<string> {
    return await this.getElementText(this.selectors.pageTitle);
  }

  public async getPageDescription(): Promise<string> {
    return await this.getElementText(this.selectors.pageDescription);
  }

  public async getResearchItemsCount(): Promise<number> {
    return await this.getElementCount(this.selectors.researchItem);
  }

  public async getFeaturedResearchTitle(): Promise<string> {
    const featuredTitle = await this.findElement(`${this.selectors.featuredResearch} ${this.selectors.researchTitle}`);
    return await featuredTitle.textContent() || '';
  }

  public async getResearchTitles(): Promise<string[]> {
    const titleElements = await this.findElements(this.selectors.researchTitle);
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

  public async getResearchAuthors(): Promise<string[]> {
    const authorElements = await this.findElements(this.selectors.researchAuthor);
    const count = await authorElements.count();
    const authors: string[] = [];

    for (let i = 0; i < count; i++) {
      const author = await authorElements.nth(i).textContent();
      if (author) {
        authors.push(author.trim());
      }
    }

    return authors;
  }

  public async getResearchItemByIndex(index: number): Promise<{
    title: string;
    author: string;
    date: string;
    summary: string;
    type: string;
    link: string;
  }> {
    const researchItems = await this.findElements(this.selectors.researchItem);
    const targetItem = researchItems.nth(index);

    const title = await targetItem.locator(this.selectors.researchTitle).textContent() || '';
    const author = await targetItem.locator(this.selectors.researchAuthor).textContent() || '';
    const date = await targetItem.locator(this.selectors.researchDate).textContent() || '';
    const summary = await targetItem.locator(this.selectors.researchSummary).textContent() || '';
    const type = await targetItem.locator(this.selectors.researchType).textContent() || '';
    const link = await targetItem.locator('a').first().getAttribute('href') || '';

    return {
      title: title.trim(),
      author: author.trim(),
      date: date.trim(),
      summary: summary.trim(),
      type: type.trim(),
      link
    };
  }

  public async getAvailableCategories(): Promise<string[]> {
    const categoryOptions = await this.findElements(`${this.selectors.categoryFilter} option`);
    const count = await categoryOptions.count();
    const categories: string[] = [];

    for (let i = 0; i < count; i++) {
      const category = await categoryOptions.nth(i).textContent();
      if (category && category.trim() !== '') {
        categories.push(category.trim());
      }
    }

    return categories;
  }

  public async getAvailableAuthors(): Promise<string[]> {
    const authorOptions = await this.findElements(`${this.selectors.authorFilter} option`);
    const count = await authorOptions.count();
    const authors: string[] = [];

    for (let i = 0; i < count; i++) {
      const author = await authorOptions.nth(i).textContent();
      if (author && author.trim() !== '') {
        authors.push(author.trim());
      }
    }

    return authors;
  }

  // Chart and data methods
  public async validateEconomicCharts(): Promise<boolean> {
    const chartsVisible = await this.isElementVisible(this.selectors.economicCharts);
    const chartContainerVisible = await this.isElementVisible(this.selectors.chartContainer);
    
    return chartsVisible || chartContainerVisible;
  }

  public async validateDataTables(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.dataTable);
  }

  public async getChartsCount(): Promise<number> {
    return await this.getElementCount(this.selectors.chartContainer);
  }

  // Performance validation
  public async validatePageLoadPerformance(): Promise<{ loadTime: number; isAcceptable: boolean }> {
    const loadTime = await this.measurePageLoadTime();
    const isAcceptable = loadTime < 5000; // 5 seconds threshold

    this.logger.performance('Research page load time', loadTime);

    return { loadTime, isAcceptable };
  }

  // Accessibility validation
  public async validateAccessibility(): Promise<boolean> {
    const pageTitle = await this.getElementAttribute(this.selectors.pageTitle, 'role');
    const searchInput = await this.getElementAttribute(this.selectors.researchSearch, 'aria-label');
    
    // Check if page has proper heading structure and accessible search
    return pageTitle !== null || searchInput !== null;
  }

  // Content validation
  public async validateResearchQuality(): Promise<{
    hasAuthors: boolean;
    hasDates: boolean;
    hasSummaries: boolean;
    hasDownloadLinks: boolean;
  }> {
    const authorsCount = await this.getElementCount(this.selectors.researchAuthor);
    const datesCount = await this.getElementCount(this.selectors.researchDate);
    const summariesCount = await this.getElementCount(this.selectors.researchSummary);
    const downloadLinksCount = await this.getElementCount(this.selectors.downloadLink);

    return {
      hasAuthors: authorsCount > 0,
      hasDates: datesCount > 0,
      hasSummaries: summariesCount > 0,
      hasDownloadLinks: downloadLinksCount > 0
    };
  }
}

export default ResearchInsightsPage;







