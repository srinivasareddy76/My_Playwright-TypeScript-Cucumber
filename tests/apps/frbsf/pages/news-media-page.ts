








import { Page } from '@playwright/test';
import { BasePage } from '../../../pages/base-page';

export class NewsMediaPage extends BasePage {
  // Page selectors
  private readonly selectors = {
    // Page header
    pageTitle: '[data-testid="page-title"], h1, .page-title',
    pageDescription: '[data-testid="page-description"], .page-description, .intro-text',
    
    // Navigation
    breadcrumbs: '[data-testid="breadcrumbs"], .breadcrumbs, .breadcrumb-nav',
    sectionNavigation: '[data-testid="section-nav"], .section-nav, .sub-navigation',
    
    // Featured news
    featuredNews: '[data-testid="featured-news"], .featured-news, .hero-news',
    featuredArticle: '[data-testid="featured-article"], .featured-article, .featured-story',
    featuredTitle: '[data-testid="featured-title"], .featured-title, .featured h2',
    featuredSummary: '[data-testid="featured-summary"], .featured-summary, .featured-excerpt',
    featuredImage: '[data-testid="featured-image"], .featured-image, .featured img',
    featuredDate: '[data-testid="featured-date"], .featured-date, .featured .date',
    
    // News listings
    newsContainer: '[data-testid="news-container"], .news-list, .articles-list',
    newsItem: '[data-testid="news-item"], .news-item, .article-item',
    newsTitle: '[data-testid="news-title"], .news-title, .article-title',
    newsDate: '[data-testid="news-date"], .news-date, .publish-date',
    newsSummary: '[data-testid="news-summary"], .news-summary, .article-excerpt',
    newsImage: '[data-testid="news-image"], .news-image, .article-image',
    newsLink: '[data-testid="news-link"], .news-link, .read-more',
    newsCategory: '[data-testid="news-category"], .news-category, .article-category',
    
    // News categories and types
    pressReleases: '[data-testid="press-releases"], .press-releases, a[href*="press-release"]',
    speeches: '[data-testid="speeches"], .speeches, a[href*="speech"]',
    mediaAdvisories: '[data-testid="media-advisories"], .media-advisories, a[href*="advisory"]',
    newsletters: '[data-testid="newsletters"], .newsletters, a[href*="newsletter"]',
    
    // Filters and sorting
    filtersContainer: '[data-testid="filters"], .filters, .news-filters',
    categoryFilter: '[data-testid="category-filter"], .category-filter, select[name*="category"]',
    dateFilter: '[data-testid="date-filter"], .date-filter, select[name*="date"]',
    typeFilter: '[data-testid="type-filter"], .type-filter, select[name*="type"]',
    sortOptions: '[data-testid="sort-options"], .sort-options, select[name*="sort"]',
    
    // Search functionality
    newsSearch: '[data-testid="news-search"], .news-search, input[placeholder*="news"]',
    searchButton: '[data-testid="search-button"], .search-button, button[type="submit"]',
    
    // Pagination
    pagination: '[data-testid="pagination"], .pagination, .pager',
    nextButton: '[data-testid="next-page"], .next, button:has-text("Next")',
    prevButton: '[data-testid="prev-page"], .prev, button:has-text("Previous")',
    pageNumbers: '[data-testid="page-numbers"], .page-numbers, .pagination-numbers',
    
    // Media contacts
    mediaContacts: '[data-testid="media-contacts"], .media-contacts, .press-contacts',
    contactName: '[data-testid="contact-name"], .contact-name, .media-contact-name',
    contactPhone: '[data-testid="contact-phone"], .contact-phone, .phone',
    contactEmail: '[data-testid="contact-email"], .contact-email, .email',
    
    // Events
    eventsSection: '[data-testid="events"], .events, .upcoming-events',
    eventItem: '[data-testid="event-item"], .event-item, .event',
    eventTitle: '[data-testid="event-title"], .event-title, .event h3',
    eventDate: '[data-testid="event-date"], .event-date, .event-time',
    eventLocation: '[data-testid="event-location"], .event-location, .venue',
    eventDescription: '[data-testid="event-description"], .event-description, .event-summary',
    
    // Newsletter signup
    newsletterSignup: '[data-testid="newsletter-signup"], .newsletter-signup, .subscribe',
    emailInput: '[data-testid="email-input"], input[type="email"], input[name*="email"]',
    subscribeButton: '[data-testid="subscribe-button"], .subscribe-button, button:has-text("Subscribe")',
    
    // Social media and sharing
    shareButtons: '[data-testid="share-buttons"], .share-buttons, .social-share',
    shareLinkedIn: '[data-testid="share-linkedin"], .share-linkedin, a[href*="linkedin"]',
    shareTwitter: '[data-testid="share-twitter"], .share-twitter, a[href*="twitter"]',
    shareFacebook: '[data-testid="share-facebook"], .share-facebook, a[href*="facebook"]',
    shareEmail: '[data-testid="share-email"], .share-email, a[href*="mailto"]',
    
    // RSS feeds
    rssFeeds: '[data-testid="rss-feeds"], .rss-feeds, .feeds',
    rssLink: '[data-testid="rss-link"], .rss-link, a[href*="rss"]',
    
    // Archive
    newsArchive: '[data-testid="news-archive"], .news-archive, .archive',
    archiveLink: '[data-testid="archive-link"], .archive-link, a[href*="archive"]',
    
    // Loading and error states
    loadingIndicator: '[data-testid="loading"], .loading, .spinner',
    errorMessage: '[data-testid="error-message"], .error-message, .alert-error',
    noResultsMessage: '[data-testid="no-results"], .no-results, .empty-results'
  };

  constructor(page?: Page) {
    super(page);
  }

  // Navigation methods
  public async navigateToNewsPage(): Promise<void> {
    await this.navigateTo('/news');
    await this.waitForPageLoad();
  }

  public async navigateToPressReleases(): Promise<void> {
    await this.clickElement(this.selectors.pressReleases);
    await this.waitForPageLoad();
  }

  public async navigateToSpeeches(): Promise<void> {
    await this.clickElement(this.selectors.speeches);
    await this.waitForPageLoad();
  }

  public async navigateToMediaAdvisories(): Promise<void> {
    await this.clickElement(this.selectors.mediaAdvisories);
    await this.waitForPageLoad();
  }

  public async navigateToNewsletters(): Promise<void> {
    await this.clickElement(this.selectors.newsletters);
    await this.waitForPageLoad();
  }

  public async navigateToArchive(): Promise<void> {
    await this.clickElement(this.selectors.archiveLink);
    await this.waitForPageLoad();
  }

  // News interaction methods
  public async clickFeaturedArticle(): Promise<void> {
    await this.clickElement(this.selectors.featuredArticle);
  }

  public async clickNewsItemByIndex(index: number): Promise<void> {
    const newsItems = await this.findElements(this.selectors.newsItem);
    const targetItem = newsItems.nth(index);
    const itemLink = targetItem.locator(this.selectors.newsTitle).or(targetItem.locator('a')).first();
    
    await itemLink.click();
  }

  public async clickNewsItemByTitle(title: string): Promise<void> {
    const newsTitle = this.page.locator(this.selectors.newsTitle).filter({ hasText: title });
    await newsTitle.click();
  }

  public async openNewsItemInNewTab(index: number): Promise<void> {
    const newsItems = await this.findElements(this.selectors.newsItem);
    const targetItem = newsItems.nth(index);
    const itemLink = targetItem.locator('a').first();
    
    await itemLink.click({ modifiers: ['Control'] }); // Ctrl+Click to open in new tab
  }

  // Filter and search methods
  public async filterByCategory(category: string): Promise<void> {
    await this.selectOption(this.selectors.categoryFilter, category);
    await this.waitForNewsResults();
  }

  public async filterByDate(dateOption: string): Promise<void> {
    await this.selectOption(this.selectors.dateFilter, dateOption);
    await this.waitForNewsResults();
  }

  public async filterByType(type: string): Promise<void> {
    await this.selectOption(this.selectors.typeFilter, type);
    await this.waitForNewsResults();
  }

  public async sortNewsBy(sortOption: string): Promise<void> {
    await this.selectOption(this.selectors.sortOptions, sortOption);
    await this.waitForNewsResults();
  }

  public async searchNews(searchTerm: string): Promise<void> {
    await this.typeText(this.selectors.newsSearch, searchTerm, { clear: true });
    await this.clickElement(this.selectors.searchButton);
    await this.waitForNewsResults();
  }

  // Pagination methods
  public async goToNextPage(): Promise<void> {
    await this.clickElement(this.selectors.nextButton);
    await this.waitForNewsResults();
  }

  public async goToPreviousPage(): Promise<void> {
    await this.clickElement(this.selectors.prevButton);
    await this.waitForNewsResults();
  }

  public async goToPage(pageNumber: number): Promise<void> {
    const pageLink = this.page.locator(this.selectors.pageNumbers).locator(`text="${pageNumber}"`);
    await pageLink.click();
    await this.waitForNewsResults();
  }

  // Events interaction methods
  public async clickEventByIndex(index: number): Promise<void> {
    const eventItems = await this.findElements(this.selectors.eventItem);
    const targetEvent = eventItems.nth(index);
    const eventLink = targetEvent.locator(this.selectors.eventTitle).or(targetEvent.locator('a')).first();
    
    await eventLink.click();
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

  public async shareOnFacebook(): Promise<void> {
    await this.clickElement(this.selectors.shareFacebook);
  }

  public async shareViaEmail(): Promise<void> {
    await this.clickElement(this.selectors.shareEmail);
  }

  public async subscribeToRSSFeed(): Promise<void> {
    await this.clickElement(this.selectors.rssLink);
  }

  // Wait methods
  public async waitForNewsResults(): Promise<void> {
    try {
      // Wait for loading to disappear if present
      const loadingElement = await this.findElement(this.selectors.loadingIndicator);
      if (await loadingElement.isVisible()) {
        await this.waitForElement(this.selectors.loadingIndicator, { state: 'hidden', timeout: 10000 });
      }
    } catch {
      // Loading indicator might not be present
    }

    // Wait for news container to be visible
    await this.waitForElement(this.selectors.newsContainer, { timeout: 15000 });
  }

  // Validation methods
  public async isPageLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(this.selectors.pageTitle, { timeout: 10000 });
      
      // Check if we have news content or featured content
      const newsContainerVisible = await this.isElementVisible(this.selectors.newsContainer);
      const featuredNewsVisible = await this.isElementVisible(this.selectors.featuredNews);
      
      return newsContainerVisible || featuredNewsVisible;
    } catch {
      return false;
    }
  }

  public async validateFeaturedNews(): Promise<boolean> {
    const featuredVisible = await this.isElementVisible(this.selectors.featuredNews);
    
    if (!featuredVisible) {
      return false;
    }

    const featuredTitleVisible = await this.isElementVisible(this.selectors.featuredTitle);
    return featuredTitleVisible;
  }

  public async validateNewsContent(): Promise<boolean> {
    const newsContainerVisible = await this.isElementVisible(this.selectors.newsContainer);
    
    if (!newsContainerVisible) {
      return false;
    }

    const newsCount = await this.getNewsItemsCount();
    return newsCount > 0;
  }

  public async validateNewsCategories(): Promise<boolean> {
    const pressReleasesVisible = await this.isElementVisible(this.selectors.pressReleases);
    const speechesVisible = await this.isElementVisible(this.selectors.speeches);
    const advisoriesVisible = await this.isElementVisible(this.selectors.mediaAdvisories);
    
    return pressReleasesVisible || speechesVisible || advisoriesVisible;
  }

  public async validateFiltersPresent(): Promise<boolean> {
    const filtersVisible = await this.isElementVisible(this.selectors.filtersContainer);
    const categoryFilterVisible = await this.isElementVisible(this.selectors.categoryFilter);
    
    return filtersVisible || categoryFilterVisible;
  }

  public async validateSearchFunctionality(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.newsSearch);
  }

  public async validateEventsSection(): Promise<boolean> {
    const eventsVisible = await this.isElementVisible(this.selectors.eventsSection);
    
    if (!eventsVisible) {
      return false;
    }

    const eventsCount = await this.getEventsCount();
    return eventsCount > 0;
  }

  public async validateMediaContacts(): Promise<boolean> {
    const contactsVisible = await this.isElementVisible(this.selectors.mediaContacts);
    
    if (!contactsVisible) {
      return false;
    }

    const contactNameVisible = await this.isElementVisible(this.selectors.contactName);
    const contactEmailVisible = await this.isElementVisible(this.selectors.contactEmail);
    
    return contactNameVisible || contactEmailVisible;
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

  public async validateRSSFeeds(): Promise<boolean> {
    const rssFeedsVisible = await this.isElementVisible(this.selectors.rssFeeds);
    const rssLinkVisible = await this.isElementVisible(this.selectors.rssLink);
    
    return rssFeedsVisible || rssLinkVisible;
  }

  public async validateArchiveAccess(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.newsArchive);
  }

  // Information retrieval methods
  public async getPageTitle(): Promise<string> {
    return await this.getElementText(this.selectors.pageTitle);
  }

  public async getFeaturedNewsTitle(): Promise<string> {
    return await this.getElementText(this.selectors.featuredTitle);
  }

  public async getFeaturedNewsSummary(): Promise<string> {
    return await this.getElementText(this.selectors.featuredSummary);
  }

  public async getFeaturedNewsDate(): Promise<string> {
    return await this.getElementText(this.selectors.featuredDate);
  }

  public async getNewsItemsCount(): Promise<number> {
    return await this.getElementCount(this.selectors.newsItem);
  }

  public async getEventsCount(): Promise<number> {
    return await this.getElementCount(this.selectors.eventItem);
  }

  public async getNewsTitles(): Promise<string[]> {
    const titleElements = await this.findElements(this.selectors.newsTitle);
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

  public async getNewsItemByIndex(index: number): Promise<{
    title: string;
    date: string;
    summary: string;
    category: string;
    link: string;
    hasImage: boolean;
  }> {
    const newsItems = await this.findElements(this.selectors.newsItem);
    const targetItem = newsItems.nth(index);

    const title = await targetItem.locator(this.selectors.newsTitle).textContent() || '';
    const date = await targetItem.locator(this.selectors.newsDate).textContent() || '';
    const summary = await targetItem.locator(this.selectors.newsSummary).textContent() || '';
    const category = await targetItem.locator(this.selectors.newsCategory).textContent() || '';
    const link = await targetItem.locator('a').first().getAttribute('href') || '';
    const hasImage = await targetItem.locator(this.selectors.newsImage).isVisible();

    return {
      title: title.trim(),
      date: date.trim(),
      summary: summary.trim(),
      category: category.trim(),
      link,
      hasImage
    };
  }

  public async getEventByIndex(index: number): Promise<{
    title: string;
    date: string;
    location: string;
    description: string;
  }> {
    const eventItems = await this.findElements(this.selectors.eventItem);
    const targetEvent = eventItems.nth(index);

    const title = await targetEvent.locator(this.selectors.eventTitle).textContent() || '';
    const date = await targetEvent.locator(this.selectors.eventDate).textContent() || '';
    const location = await targetEvent.locator(this.selectors.eventLocation).textContent() || '';
    const description = await targetEvent.locator(this.selectors.eventDescription).textContent() || '';

    return {
      title: title.trim(),
      date: date.trim(),
      location: location.trim(),
      description: description.trim()
    };
  }

  public async getMediaContacts(): Promise<Array<{
    name: string;
    phone: string;
    email: string;
  }>> {
    const contactElements = await this.findElements(this.selectors.mediaContacts);
    const count = await contactElements.count();
    const contacts: Array<{ name: string; phone: string; email: string }> = [];

    for (let i = 0; i < count; i++) {
      const contactElement = contactElements.nth(i);
      const name = await contactElement.locator(this.selectors.contactName).textContent() || '';
      const phone = await contactElement.locator(this.selectors.contactPhone).textContent() || '';
      const email = await contactElement.locator(this.selectors.contactEmail).textContent() || '';

      contacts.push({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim()
      });
    }

    return contacts;
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

  // Performance validation
  public async validatePageLoadPerformance(): Promise<{ loadTime: number; isAcceptable: boolean }> {
    const loadTime = await this.measurePageLoadTime();
    const isAcceptable = loadTime < 5000; // 5 seconds threshold

    this.logger.performance('News page load time', loadTime);

    return { loadTime, isAcceptable };
  }

  // Content freshness validation
  public async validateContentFreshness(): Promise<{
    hasFeaturedNews: boolean;
    hasRecentNews: boolean;
    hasUpcomingEvents: boolean;
  }> {
    const hasFeaturedNews = await this.validateFeaturedNews();
    const newsCount = await this.getNewsItemsCount();
    const eventsCount = await this.getEventsCount();

    return {
      hasFeaturedNews,
      hasRecentNews: newsCount > 0,
      hasUpcomingEvents: eventsCount > 0
    };
  }

  // Accessibility validation
  public async validateAccessibility(): Promise<boolean> {
    const pageTitle = await this.getElementAttribute(this.selectors.pageTitle, 'role');
    const searchInput = await this.getElementAttribute(this.selectors.newsSearch, 'aria-label');
    const featuredImage = await this.getElementAttribute(this.selectors.featuredImage, 'alt');
    
    // Check if page has proper heading structure, accessible search, and image alt text
    return pageTitle !== null || searchInput !== null || featuredImage !== null;
  }
}

export default NewsMediaPage;









