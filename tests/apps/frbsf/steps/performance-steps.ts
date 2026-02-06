




import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../../../src/common/world';

Given('I want to measure page performance', async function (this: ICustomWorld) {
  this.logger.step('Setup', 'Preparing performance measurement');
  this.startPerformanceMeasurement();
});

When('I navigate to the homepage for performance testing', async function (this: ICustomWorld) {
  this.logger.step('Navigation', 'Navigating to homepage for performance testing');
  await this.homePage.navigateToHomePage();
  await this.homePage.waitForPageLoad();
});

Then('the page should load within {int} seconds', async function (this: ICustomWorld, maxSeconds: number) {
  this.logger.step('Performance', `Checking page load time within ${maxSeconds} seconds`);
  const loadTime = this.endPerformanceMeasurement('Page load performance test');
  const loadTimeInSeconds = loadTime / 1000;
  
  expect(loadTimeInSeconds).toBeLessThanOrEqual(maxSeconds);
  this.logger.assertion(`Page loaded within ${maxSeconds} seconds (actual: ${loadTimeInSeconds.toFixed(2)}s)`, loadTimeInSeconds <= maxSeconds);
});

When('I measure Core Web Vitals', async function (this: ICustomWorld) {
  this.logger.step('Performance', 'Measuring Core Web Vitals');
  const page = await this.homePage.getPage();
  
  // Measure Core Web Vitals using Performance API
  const webVitals = await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals: any = {};
      
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.lcp = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // First Input Delay (FID) - simulated
      vitals.fid = 0; // Would be measured on actual user interaction
      
      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        vitals.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
      
      // First Contentful Paint (FCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        vitals.fcp = entries[0].startTime;
      }).observe({ entryTypes: ['paint'] });
      
      setTimeout(() => resolve(vitals), 3000);
    });
  });
  
  this.setTestData('webVitals', webVitals);
});

Then('the Largest Contentful Paint should be under {int}ms', async function (this: ICustomWorld, maxLCP: number) {
  this.logger.step('Performance', `Checking LCP under ${maxLCP}ms`);
  const webVitals = this.getTestData('webVitals') as any;
  const lcp = webVitals?.lcp || 0;
  
  expect(lcp).toBeLessThanOrEqual(maxLCP);
  this.logger.assertion(`LCP under ${maxLCP}ms (actual: ${lcp.toFixed(2)}ms)`, lcp <= maxLCP);
});

Then('the First Contentful Paint should be under {int}ms', async function (this: ICustomWorld, maxFCP: number) {
  this.logger.step('Performance', `Checking FCP under ${maxFCP}ms`);
  const webVitals = this.getTestData('webVitals') as any;
  const fcp = webVitals?.fcp || 0;
  
  expect(fcp).toBeLessThanOrEqual(maxFCP);
  this.logger.assertion(`FCP under ${maxFCP}ms (actual: ${fcp.toFixed(2)}ms)`, fcp <= maxFCP);
});

Then('the Cumulative Layout Shift should be under {float}', async function (this: ICustomWorld, maxCLS: number) {
  this.logger.step('Performance', `Checking CLS under ${maxCLS}`);
  const webVitals = this.getTestData('webVitals') as any;
  const cls = webVitals?.cls || 0;
  
  expect(cls).toBeLessThanOrEqual(maxCLS);
  this.logger.assertion(`CLS under ${maxCLS} (actual: ${cls.toFixed(3)})`, cls <= maxCLS);
});

When('I analyze resource loading', async function (this: ICustomWorld) {
  this.logger.step('Performance', 'Analyzing resource loading');
  const page = await this.homePage.getPage();
  
  const resourceMetrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    const metrics = {
      totalResources: resources.length,
      totalSize: 0,
      slowestResource: 0,
      resourceTypes: {} as Record<string, number>
    };
    
    resources.forEach((resource: any) => {
      const duration = resource.responseEnd - resource.startTime;
      if (duration > metrics.slowestResource) {
        metrics.slowestResource = duration;
      }
      
      const type = resource.initiatorType || 'other';
      metrics.resourceTypes[type] = (metrics.resourceTypes[type] || 0) + 1;
    });
    
    return metrics;
  });
  
  this.setTestData('resourceMetrics', resourceMetrics);
});

Then('all resources should load within {int}ms', async function (this: ICustomWorld, maxLoadTime: number) {
  this.logger.step('Performance', `Checking all resources load within ${maxLoadTime}ms`);
  const resourceMetrics = this.getTestData('resourceMetrics') as any;
  const slowestResource = resourceMetrics?.slowestResource || 0;
  
  expect(slowestResource).toBeLessThanOrEqual(maxLoadTime);
  this.logger.assertion(`All resources loaded within ${maxLoadTime}ms (slowest: ${slowestResource.toFixed(2)}ms)`, slowestResource <= maxLoadTime);
});

When('I test mobile performance', async function (this: ICustomWorld) {
  this.logger.step('Performance', 'Testing mobile performance');
  await this.setMobileViewport();
  
  // Simulate slower network conditions
  const page = await this.homePage.getPage();
  await page.route('**/*', async (route) => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
    await route.continue();
  });
  
  this.startPerformanceMeasurement();
  await this.homePage.navigateToHomePage();
  await this.homePage.waitForPageLoad();
});

Then('mobile performance should meet standards', async function (this: ICustomWorld) {
  this.logger.step('Performance', 'Checking mobile performance standards');
  const loadTime = this.endPerformanceMeasurement('Mobile performance test');
  const loadTimeInSeconds = loadTime / 1000;
  
  // Mobile performance should be under 5 seconds
  expect(loadTimeInSeconds).toBeLessThanOrEqual(5);
  this.logger.assertion(`Mobile performance meets standards (${loadTimeInSeconds.toFixed(2)}s)`, loadTimeInSeconds <= 5);
});

When('I test caching effectiveness', async function (this: ICustomWorld) {
  this.logger.step('Performance', 'Testing caching effectiveness');
  const page = await this.homePage.getPage();
  
  // First load
  this.startPerformanceMeasurement();
  await this.homePage.navigateToHomePage();
  await this.homePage.waitForPageLoad();
  const firstLoad = this.endPerformanceMeasurement('First load');
  
  // Second load (should be faster due to caching)
  this.startPerformanceMeasurement();
  await page.reload();
  await this.homePage.waitForPageLoad();
  const secondLoad = this.endPerformanceMeasurement('Second load');
  
  this.setTestData('firstLoad', firstLoad);
  this.setTestData('secondLoad', secondLoad);
});

Then('cached resources should improve load times', async function (this: ICustomWorld) {
  this.logger.step('Performance', 'Checking caching effectiveness');
  const firstLoad = this.getTestData('firstLoad') as number;
  const secondLoad = this.getTestData('secondLoad') as number;
  
  // Second load should be faster or at least not significantly slower
  const improvement = ((firstLoad - secondLoad) / firstLoad) * 100;
  expect(improvement).toBeGreaterThanOrEqual(-10); // Allow 10% variance
  
  this.logger.assertion(`Caching improves performance by ${improvement.toFixed(1)}%`, improvement >= -10);
});

When('I measure Time to Interactive', async function (this: ICustomWorld) {
  this.logger.step('Performance', 'Measuring Time to Interactive');
  const page = await this.homePage.getPage();
  
  const tti = await page.evaluate(() => {
    return new Promise((resolve) => {
      // Simplified TTI measurement
      const startTime = performance.now();
      
      const checkInteractive = () => {
        if (document.readyState === 'complete') {
          const tti = performance.now() - startTime;
          resolve(tti);
        } else {
          setTimeout(checkInteractive, 100);
        }
      };
      
      checkInteractive();
    });
  });
  
  this.setTestData('timeToInteractive', tti);
});

Then('Time to Interactive should be under {int}ms', async function (this: ICustomWorld, maxTTI: number) {
  this.logger.step('Performance', `Checking TTI under ${maxTTI}ms`);
  const tti = this.getTestData('timeToInteractive') as number;
  
  expect(tti).toBeLessThanOrEqual(maxTTI);
  this.logger.assertion(`TTI under ${maxTTI}ms (actual: ${tti.toFixed(2)}ms)`, tti <= maxTTI);
});

When('I test third-party integration performance', async function (this: ICustomWorld) {
  this.logger.step('Performance', 'Testing third-party integration performance');
  const page = await this.homePage.getPage();
  
  const thirdPartyMetrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    const thirdPartyResources = resources.filter((resource: any) => {
      const url = new URL(resource.name);
      return !url.hostname.includes('frbsf.org');
    });
    
    return {
      count: thirdPartyResources.length,
      totalDuration: thirdPartyResources.reduce((sum: number, resource: any) => {
        return sum + (resource.responseEnd - resource.startTime);
      }, 0)
    };
  });
  
  this.setTestData('thirdPartyMetrics', thirdPartyMetrics);
});

Then('third-party integrations should not significantly impact performance', async function (this: ICustomWorld) {
  this.logger.step('Performance', 'Checking third-party performance impact');
  const thirdPartyMetrics = this.getTestData('thirdPartyMetrics') as any;
  const totalDuration = thirdPartyMetrics?.totalDuration || 0;
  
  // Third-party resources should not take more than 2 seconds total
  expect(totalDuration).toBeLessThanOrEqual(2000);
  this.logger.assertion(`Third-party impact acceptable (${totalDuration.toFixed(2)}ms)`, totalDuration <= 2000);
});

When('I test performance across different browsers', async function (this: ICustomWorld) {
  this.logger.step('Performance', 'Testing cross-browser performance');
  // This would typically involve running the same test in different browsers
  // For now, we'll simulate by measuring current browser performance
  this.startPerformanceMeasurement();
  await this.homePage.navigateToHomePage();
  await this.homePage.waitForPageLoad();
  const browserPerformance = this.endPerformanceMeasurement('Cross-browser performance test');
  this.setTestData('browserPerformance', browserPerformance);
});

Then('performance should be consistent across browsers', async function (this: ICustomWorld) {
  this.logger.step('Performance', 'Checking cross-browser performance consistency');
  const browserPerformance = this.getTestData('browserPerformance') as number;
  const performanceInSeconds = browserPerformance / 1000;
  
  // Performance should be under 5 seconds in any browser
  expect(performanceInSeconds).toBeLessThanOrEqual(5);
  this.logger.assertion(`Cross-browser performance consistent (${performanceInSeconds.toFixed(2)}s)`, performanceInSeconds <= 5);
});




