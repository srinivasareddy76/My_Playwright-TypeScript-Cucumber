



import { Page } from '@playwright/test';
import { BasePage } from '../../../pages/base-page';

export class HomePage extends BasePage {
  // Page selectors
  private readonly selectors = {
    // Header elements
    logo: 'a[href="/"], a:has(.sffed-logo-org__logotype), a:has([class*="logo"])',
    mainNavigation: '.main-nav, nav, header nav',
    searchButton: '#sffed-search-input, input[name="s"][type="search"]',
    searchInput: '#sffed-search-input, input[name="s"][type="search"]',
    
    // Hero section
    heroSection: '.wp-block-cover, .sffed-intro--home, [class*="hero"], .banner',
    heroTitle: '[data-testid="hero-title"], .hero h1, .banner h1',
    heroDescription: '[data-testid="hero-description"], .hero p, .banner p',
    
    // Main navigation menu items
    aboutMenu: 'nav a:has-text("About"), .menu-item:has-text("About"), a[href*="about"]',
    researchMenu: 'a[href*="research"], nav a:has-text("Research")',
    newsMenu: 'a[href*="news"], nav a:has-text("News")',
    dataMenu: 'a[href*="data"], nav a:has-text("Data")',
    publicationsMenu: 'a[href*="publications"], nav a:has-text("Publications")',
    
    // Dropdown menus
    aboutDropdown: '.about-dropdown, [data-menu="about"]',
    researchDropdown: '.research-dropdown, [data-menu="research"]',
    newsDropdown: '.news-dropdown, [data-menu="news"]',
    
    // Key sections
    researchInsightsSection: 'h2:has-text("What We Study"), h3:has-text("Monetary Policy"), h3:has-text("Labor Markets")',
    newsMediaSection: 'h2:has-text("News & Media"), h2:has-text("The Latest")',
    economicDataSection: 'h3:has-text("Financial Markets"), h3:has-text("Banking")',
    districtInfoSection: 'h3:has-text("Explore the 12th District")',
    
    // Featured content
    featuredArticles: '[data-testid="featured-articles"], .featured-content, .highlight-articles',
    latestNews: '[data-testid="latest-news"], .latest-news, .recent-news',
    economicIndicators: '[data-testid="economic-indicators"], .economic-data, .indicators',
    
    // Footer elements
    footer: 'footer, .footer, .site-footer',
    footerLinks: 'footer a, .footer a',
    contactInfo: 'a:has-text("Contact Us"), a[href*="contact"]',
    socialMediaLinks: '[data-testid="social-links"], .social-media, .social-links',
    
    // Social media specific links
    linkedinLink: 'footer a[href*="linkedin"][aria-label*="LinkedIn"]',
    facebookLink: 'a[href*="facebook"], a[aria-label*="Facebook"]',
    twitterLink: 'a[href*="twitter"], a[href*="x.com"], a[aria-label*="Twitter"]',
    youtubeLink: 'a[href*="youtube"], a[aria-label*="YouTube"]',
    
    // District map and information
    districtMap: 'a:has-text("Our District"), a[href*="district"]',
    districtStates: 'a:has-text("Explore Our Region"), a:has-text("Our District")',
    
    // Quick links (using navigation menu as quick access)
    quickLinks: '.main-nav',
    
    // Accessibility elements
    skipToContent: 'a[href="#main"], .skip-link',
    mainContent: '#main, main, [role="main"]'
  };

  constructor(page?: Page) {
    super(page);
  }

  // Navigation methods
  public async navigateToHomePage(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  public async clickLogo(): Promise<void> {
    await this.clickElement(this.selectors.logo);
  }

  // Header interactions
  public async openSearchDialog(): Promise<void> {
    // For FRBSF website, search input is already visible, just focus on it
    await this.waitForElement(this.selectors.searchInput);
    await this.clickElement(this.selectors.searchInput);
  }

  public async performSearch(searchTerm: string): Promise<void> {
    await this.openSearchDialog();
    await this.typeText(this.selectors.searchInput, searchTerm);
    await this.page.keyboard.press('Enter');
  }

  // Main navigation interactions
  public async hoverOverAboutMenu(): Promise<void> {
    await this.hoverElement(this.selectors.aboutMenu);
    await this.waitForElement(this.selectors.aboutDropdown, { timeout: 5000 });
  }

  public async hoverOverResearchMenu(): Promise<void> {
    await this.hoverElement(this.selectors.researchMenu);
    await this.waitForElement(this.selectors.researchDropdown, { timeout: 5000 });
  }

  public async hoverOverNewsMenu(): Promise<void> {
    await this.hoverElement(this.selectors.newsMenu);
    await this.waitForElement(this.selectors.newsDropdown, { timeout: 5000 });
  }

  public async clickResearchMenu(): Promise<void> {
    await this.clickElement(this.selectors.researchMenu);
  }

  public async clickNewsMenu(): Promise<void> {
    await this.clickElement(this.selectors.newsMenu);
  }

  public async clickDataMenu(): Promise<void> {
    await this.clickElement(this.selectors.dataMenu);
  }

  // Content section interactions
  public async scrollToResearchSection(): Promise<void> {
    await this.scrollToElement(this.selectors.researchInsightsSection);
  }

  public async scrollToNewsSection(): Promise<void> {
    await this.scrollToElement(this.selectors.newsMediaSection);
  }

  public async scrollToDistrictSection(): Promise<void> {
    await this.scrollToElement(this.selectors.districtInfoSection);
  }

  public async scrollToQuickLinksSection(): Promise<void> {
    await this.scrollToElement(this.selectors.quickLinks);
  }

  public async isQuickLinksVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.quickLinks);
  }

  public async isDistrictStatesVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.districtStates);
  }

  public async isContactInfoVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.contactInfo);
  }

  public async isDistrictMapVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.districtMap);
  }

  public async isResearchInsightsSectionVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.researchInsightsSection);
  }

  public async isNewsMediaSectionVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.newsMediaSection);
  }

  public async isEconomicDataSectionVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.economicDataSection);
  }

  public async isLogoClickable(): Promise<boolean> {
    return await this.isElementEnabled(this.selectors.logo);
  }

  // Social media interactions
  public async clickLinkedInLink(): Promise<void> {
    await this.clickElement(this.selectors.linkedinLink);
  }

  public async clickFacebookLink(): Promise<void> {
    await this.clickElement(this.selectors.facebookLink);
  }

  public async clickTwitterLink(): Promise<void> {
    await this.clickElement(this.selectors.twitterLink);
  }

  public async clickYouTubeLink(): Promise<void> {
    await this.clickElement(this.selectors.youtubeLink);
  }

  // Validation methods
  public async isPageLoaded(): Promise<boolean> {
    try {
      // Wait for page to be in a stable state
      const page = await this.getPage();
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      
      // Check if key elements are present (not necessarily visible)
      const logoCount = await page.locator(this.selectors.logo).count();
      const navCount = await page.locator(this.selectors.mainNavigation).count();
      
      this.logger.info(`Logo elements found: ${logoCount}, Nav elements found: ${navCount}`);
      
      return logoCount > 0 && navCount > 0;
    } catch (error) {
      this.logger.error('Page load validation failed', error);
      return false;
    }
  }

  // Public methods for step definitions
  public async isElementVisible(selector: string): Promise<boolean> {
    return super.isElementVisible(selector);
  }

  public async isElementEnabled(selector: string): Promise<boolean> {
    return super.isElementEnabled(selector);
  }

  public async typeText(selector: string, text: string, options?: { clear?: boolean; delay?: number }): Promise<void> {
    return super.typeText(selector, text, options);
  }

  public async getPage(): Promise<Page> {
    return super.getPage();
  }

  public async waitForUrl(urlPattern: string | RegExp, timeout?: number): Promise<void> {
    return super.waitForUrl(urlPattern, timeout);
  }

  public async getElementCount(selector: string): Promise<number> {
    return super.getElementCount(selector);
  }

  public async scrollToBottom(): Promise<void> {
    return super.scrollToBottom();
  }

  public async scrollToElement(selector: string): Promise<void> {
    return super.scrollToElement(selector);
  }

  public async clickElement(selector: string, options?: { timeout?: number; force?: boolean }): Promise<void> {
    return super.clickElement(selector, options);
  }

  public async validateFederalReserveBranding(): Promise<boolean> {
    const title = await this.getPageTitle();
    const logoVisible = await this.isElementVisible(this.selectors.logo);
    
    return title.toLowerCase().includes('federal reserve') && logoVisible;
  }

  public async validateMainNavigationMenu(): Promise<boolean> {
    const navigationVisible = await this.isElementVisible(this.selectors.mainNavigation);
    const aboutMenuVisible = await this.isElementVisible(this.selectors.aboutMenu);
    const researchMenuVisible = await this.isElementVisible(this.selectors.researchMenu);
    
    return navigationVisible && aboutMenuVisible && researchMenuVisible;
  }

  public async validateHeroSection(): Promise<boolean> {
    // For FRBSF homepage, just check if hero section is visible
    // The hero section contains navigation elements rather than traditional title/description
    const heroVisible = await this.isElementVisible(this.selectors.heroSection);
    return heroVisible;
  }

  public async validateKeyContentSections(): Promise<boolean> {
    const researchSectionVisible = await this.isElementVisible(this.selectors.researchInsightsSection);
    const newsSectionVisible = await this.isElementVisible(this.selectors.newsMediaSection);
    
    return researchSectionVisible || newsSectionVisible; // At least one should be visible
  }

  public async validateFooterContent(): Promise<boolean> {
    const footerVisible = await this.isElementVisible(this.selectors.footer);
    
    if (!footerVisible) {
      return false;
    }

    const footerLinksCount = await this.getElementCount(this.selectors.footerLinks);
    return footerLinksCount > 0;
  }

  public async validateSocialMediaLinks(): Promise<boolean> {
    const socialLinksVisible = await this.isElementVisible(this.selectors.socialMediaLinks);
    
    if (!socialLinksVisible) {
      // Check for individual social media links
      const linkedinVisible = await this.isElementVisible(this.selectors.linkedinLink);
      const facebookVisible = await this.isElementVisible(this.selectors.facebookLink);
      const twitterVisible = await this.isElementVisible(this.selectors.twitterLink);
      
      return linkedinVisible || facebookVisible || twitterVisible;
    }
    
    return true;
  }

  public async validateDistrictInformation(): Promise<boolean> {
    const districtSectionVisible = await this.isElementVisible(this.selectors.districtInfoSection);
    const districtMapVisible = await this.isElementVisible(this.selectors.districtMap);
    
    return districtSectionVisible || districtMapVisible;
  }

  // Performance validation
  public async validatePageLoadPerformance(): Promise<{ loadTime: number; isAcceptable: boolean }> {
    const loadTime = await this.measurePageLoadTime();
    const isAcceptable = loadTime < 5000; // 5 seconds threshold
    
    this.logger.performance('Homepage load time validation', loadTime);
    
    return { loadTime, isAcceptable };
  }

  // Accessibility validation
  public async validateAccessibility(): Promise<boolean> {
    const skipLinkVisible = await this.isElementVisible(this.selectors.skipToContent);
    const mainContentExists = await this.isElementVisible(this.selectors.mainContent);
    
    return skipLinkVisible || mainContentExists; // At least one accessibility feature should be present
  }

  // Responsive design validation
  public async validateResponsiveDesign(): Promise<{ mobile: boolean; tablet: boolean; desktop: boolean }> {
    const results = {
      mobile: false,
      tablet: false,
      desktop: false
    };

    // Test mobile viewport
    await this.setViewport(375, 667);
    await this.waitForPageLoad();
    results.mobile = await this.isPageLoaded();

    // Test tablet viewport
    await this.setViewport(768, 1024);
    await this.waitForPageLoad();
    results.tablet = await this.isPageLoaded();

    // Test desktop viewport
    await this.setViewport(1920, 1080);
    await this.waitForPageLoad();
    results.desktop = await this.isPageLoaded();

    return results;
  }

  // Get page information
  public async getHeroTitle(): Promise<string> {
    return await this.getElementText(this.selectors.heroTitle);
  }

  public async getHeroDescription(): Promise<string> {
    return await this.getElementText(this.selectors.heroDescription);
  }

  public async getFeaturedArticlesCount(): Promise<number> {
    return await this.getElementCount(this.selectors.featuredArticles);
  }

  public async getLatestNewsCount(): Promise<number> {
    return await this.getElementCount(this.selectors.latestNews);
  }

  public async getSocialMediaLinksCount(): Promise<number> {
    const linkedinCount = await this.getElementCount(this.selectors.linkedinLink);
    const facebookCount = await this.getElementCount(this.selectors.facebookLink);
    const twitterCount = await this.getElementCount(this.selectors.twitterLink);
    const youtubeCount = await this.getElementCount(this.selectors.youtubeLink);
    
    return linkedinCount + facebookCount + twitterCount + youtubeCount;
  }
}

export default HomePage;




