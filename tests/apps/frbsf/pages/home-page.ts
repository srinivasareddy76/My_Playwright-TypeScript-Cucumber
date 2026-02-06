



import { Page } from '@playwright/test';
import { BasePage } from '../../../pages/base-page';

export class HomePage extends BasePage {
  // Page selectors
  private readonly selectors = {
    // Header elements
    logo: '[data-testid="frbsf-logo"], .logo, img[alt*="Federal Reserve"]',
    mainNavigation: 'nav[role="navigation"], .main-nav, .primary-navigation',
    searchButton: '[data-testid="search-button"], .search-toggle, button[aria-label*="search"]',
    searchInput: '[data-testid="search-input"], input[type="search"], #search-input',
    
    // Hero section
    heroSection: '[data-testid="hero-section"], .hero, .banner, .main-banner',
    heroTitle: '[data-testid="hero-title"], .hero h1, .banner h1',
    heroDescription: '[data-testid="hero-description"], .hero p, .banner p',
    
    // Main navigation menu items
    aboutMenu: 'a[href*="about"], nav a:has-text("About")',
    researchMenu: 'a[href*="research"], nav a:has-text("Research")',
    newsMenu: 'a[href*="news"], nav a:has-text("News")',
    dataMenu: 'a[href*="data"], nav a:has-text("Data")',
    publicationsMenu: 'a[href*="publications"], nav a:has-text("Publications")',
    
    // Dropdown menus
    aboutDropdown: '.about-dropdown, [data-menu="about"]',
    researchDropdown: '.research-dropdown, [data-menu="research"]',
    newsDropdown: '.news-dropdown, [data-menu="news"]',
    
    // Key sections
    researchInsightsSection: '[data-testid="research-insights"], .research-section, section:has-text("Research")',
    newsMediaSection: '[data-testid="news-media"], .news-section, section:has-text("News")',
    economicDataSection: '[data-testid="economic-data"], .data-section, section:has-text("Data")',
    districtInfoSection: '[data-testid="district-info"], .district-section, section:has-text("District")',
    
    // Featured content
    featuredArticles: '[data-testid="featured-articles"], .featured-content, .highlight-articles',
    latestNews: '[data-testid="latest-news"], .latest-news, .recent-news',
    economicIndicators: '[data-testid="economic-indicators"], .economic-data, .indicators',
    
    // Footer elements
    footer: 'footer, .footer, .site-footer',
    footerLinks: 'footer a, .footer a',
    contactInfo: '[data-testid="contact-info"], .contact, footer .contact',
    socialMediaLinks: '[data-testid="social-links"], .social-media, .social-links',
    
    // Social media specific links
    linkedinLink: 'a[href*="linkedin"], a[aria-label*="LinkedIn"]',
    facebookLink: 'a[href*="facebook"], a[aria-label*="Facebook"]',
    twitterLink: 'a[href*="twitter"], a[href*="x.com"], a[aria-label*="Twitter"]',
    youtubeLink: 'a[href*="youtube"], a[aria-label*="YouTube"]',
    
    // District map and information
    districtMap: '[data-testid="district-map"], .district-map, .interactive-map',
    districtStates: '.district-states, .coverage-area',
    
    // Quick links
    quickLinks: '[data-testid="quick-links"], .quick-links, .shortcuts',
    
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
    await this.clickElement(this.selectors.searchButton);
    await this.waitForElement(this.selectors.searchInput);
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
      await this.waitForElement(this.selectors.logo, { timeout: 10000 });
      await this.waitForElement(this.selectors.mainNavigation, { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
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
    const heroVisible = await this.isElementVisible(this.selectors.heroSection);
    
    if (!heroVisible) {
      return false;
    }

    const heroTitleVisible = await this.isElementVisible(this.selectors.heroTitle);
    return heroTitleVisible;
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




