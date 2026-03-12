







import { After, AfterAll, AfterStep } from '@cucumber/cucumber';
import { ICustomWorld } from '../world/customWorld';
import { createLogger } from '../utilities/logger';
import * as fs from 'fs';
import * as path from 'path';

// Global logger for hooks
const logger = createLogger({ filePath: './reports/hooks.log' });

/**
 * After Step Hook - Runs after each step
 */
AfterStep(async function (this: ICustomWorld, { result, pickleStep }) {
  const stepText = pickleStep.text;
  const stepStatus = result.status;
  
  this.logger.step(`Completed: ${stepText} - ${stepStatus.toUpperCase()}`);
  
  // Take screenshot on step failure
  if (stepStatus === 'FAILED' && this.page) {
    const screenshotName = `failed-step-${Date.now()}`;
    await this.takeScreenshot(screenshotName);
    this.logger.info('Screenshot taken for failed step', { screenshot: screenshotName });
  }
  
  // Take screenshot for debugging if enabled
  if (process.env.DEBUG === 'true' && this.page) {
    await this.takeScreenshot(`after-step-${Date.now()}`);
  }
});

/**
 * After Hook - Runs after each scenario
 */
After(async function (this: ICustomWorld, scenario) {
  const scenarioName = scenario.pickle.name;
  const scenarioStatus = scenario.result?.status || 'UNKNOWN';
  
  this.stopTimer();
  this.setTestResult(scenarioStatus as any, scenario.result?.message ? new Error(scenario.result.message) : undefined);
  
  // Take screenshot on failure
  if (scenarioStatus === 'FAILED' && this.page) {
    const screenshotName = `failed-scenario-${scenarioName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
    await this.takeScreenshot(screenshotName);
    this.logger.info('Screenshot taken for failed scenario', { screenshot: screenshotName });
  }
  
  // Stop video recording
  if (this.config.enableVideoRecording && this.page) {
    const videoPath = await this.stopVideoRecording();
    if (videoPath) {
      this.logger.info('Video recording stopped', { video: videoPath });
    }
  }
  
  // Stop tracing
  if (this.config.enableTracing && this.context) {
    const traceName = `trace-${scenarioName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
    const tracePath = await this.stopTracing(traceName);
    if (tracePath) {
      this.logger.info('Tracing stopped', { trace: tracePath });
    }
  }
  
  // Collect performance metrics for performance tests
  if (scenario.pickle.tags.some(tag => tag.name === '@performance') && this.page) {
    await this.collectPerformanceMetrics();
  }
  
  // Run accessibility checks for accessibility tests
  if (scenario.pickle.tags.some(tag => tag.name === '@accessibility') && this.page) {
    await this.runAccessibilityChecks();
  }
  
  // Close browser context
  if (this.context) {
    await this.context.close();
    this.context = undefined;
  }
  
  // Close API client
  if (this.apiClient) {
    await this.apiClient.close();
    this.apiClient = undefined;
  }
  
  // Close database client
  if (this.dbClient) {
    await this.dbClient.disconnect();
    this.dbClient = undefined;
  }
  
  // Log scenario completion
  const testSummary = this.getTestSummary();
  this.logger.scenarioEnd(scenarioName, scenarioStatus, testSummary.duration);
  
  this.logger.info('Scenario cleanup completed', {
    scenario: scenarioName,
    status: scenarioStatus,
    duration: testSummary.duration,
    screenshots: testSummary.screenshots?.length || 0,
    videos: testSummary.videos?.length || 0,
    traces: testSummary.traces?.length || 0
  });
});

/**
 * After Hook for failed scenarios - Additional cleanup and reporting
 */
After({ tags: 'not @skip' }, async function (this: ICustomWorld, scenario) {
  if (scenario.result?.status === 'FAILED') {
    this.logger.error('Scenario failed', {
      scenario: scenario.pickle.name,
      error: scenario.result.message,
      duration: scenario.result.duration
    });
    
    // Collect additional debug information
    if (this.page) {
      try {
        // Get page URL
        const currentUrl = this.page.url();
        this.logger.info('Page URL at failure', { url: currentUrl });
        
        // Get page title
        const pageTitle = await this.page.title();
        this.logger.info('Page title at failure', { title: pageTitle });
        
        // Get console logs
        const consoleLogs = await this.page.evaluate(() => {
          return (window as any).testLogs || [];
        });
        if (consoleLogs.length > 0) {
          this.logger.info('Console logs at failure', { logs: consoleLogs });
        }
        
        // Get network failures
        const networkFailures = this.getTestData('networkFailures') || [];
        if (networkFailures.length > 0) {
          this.logger.info('Network failures', { failures: networkFailures });
        }
        
      } catch (error) {
        this.logger.warn('Failed to collect debug information', error);
      }
    }
  }
});

/**
 * After Hook for performance tests - Collect and validate performance metrics
 */
After({ tags: '@performance' }, async function (this: ICustomWorld, scenario) {
  if (this.page) {
    const performanceData = this.getTestData('performanceMetrics');
    const thresholds = this.config.performance;
    
    if (performanceData && thresholds) {
      const metrics = await this.browserManager.getPerformanceMetrics(this.page);
      
      // Validate against thresholds
      const violations = [];
      
      if (metrics.totalLoadTime > thresholds.pageLoadTime) {
        violations.push(`Page load time ${metrics.totalLoadTime}ms exceeds threshold ${thresholds.pageLoadTime}ms`);
      }
      
      if (violations.length > 0) {
        this.logger.warn('Performance threshold violations', { violations, metrics });
      } else {
        this.logger.info('Performance thresholds met', { metrics, thresholds });
      }
      
      // Store performance results
      this.setTestData('performanceResults', {
        metrics,
        thresholds,
        violations,
        passed: violations.length === 0
      });
    }
  }
});

/**
 * After Hook for accessibility tests - Run accessibility validation
 */
After({ tags: '@accessibility' }, async function (this: ICustomWorld, scenario) {
  if (this.page) {
    const accessibilityResults = this.getTestData('accessibilityResults');
    
    if (accessibilityResults) {
      const violations = accessibilityResults.violations || [];
      
      if (violations.length > 0) {
        this.logger.warn('Accessibility violations found', { 
          count: violations.length,
          violations: violations.slice(0, 5) // Log first 5 violations
        });
      } else {
        this.logger.info('No accessibility violations found');
      }
      
      // Generate accessibility report
      await this.generateAccessibilityReport(accessibilityResults);
    }
  }
});

/**
 * After All Hook - Runs once after all scenarios
 */
AfterAll(async function () {
  logger.info('===============================================================================');
  logger.info('TEST EXECUTION COMPLETED');
  logger.info('===============================================================================');
  
  // Generate final test report
  await generateFinalTestReport();
  
  // Clean up temporary files
  await cleanupTempFiles();
  
  // Archive logs
  logger.archiveLogFile();
  
  logger.info('Test execution cleanup completed');
});

/**
 * Helper method to collect performance metrics
 */
declare module '../world/customWorld' {
  interface ICustomWorld {
    collectPerformanceMetrics(): Promise<void>;
    runAccessibilityChecks(): Promise<void>;
    generateAccessibilityReport(results: any): Promise<void>;
  }
}

// Extend CustomWorld with helper methods
const { CustomWorld } = require('../world/customWorld');

CustomWorld.prototype.collectPerformanceMetrics = async function(): Promise<void> {
  try {
    if (!this.page) return;
    
    const metrics = await this.browserManager.getPerformanceMetrics(this.page);
    this.setTestData('performanceMetrics', metrics);
    
    this.logger.performance('Page Load Time', metrics.totalLoadTime);
    this.logger.performance('DOM Content Loaded', metrics.domContentLoaded);
    this.logger.performance('First Paint', metrics.firstPaint);
    this.logger.performance('First Contentful Paint', metrics.firstContentfulPaint);
    
  } catch (error) {
    this.logger.error('Failed to collect performance metrics', error);
  }
};

CustomWorld.prototype.runAccessibilityChecks = async function(): Promise<void> {
  try {
    if (!this.page) return;
    
    // Run axe-core accessibility checks
    const results = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        if (typeof (window as any).axe !== 'undefined') {
          (window as any).axe.run((err: any, results: any) => {
            if (err) {
              resolve({ error: err.message });
            } else {
              resolve(results);
            }
          });
        } else {
          resolve({ error: 'Axe-core not available' });
        }
      });
    });
    
    this.setTestData('accessibilityResults', results);
    
    if (results.violations) {
      this.logger.info('Accessibility check completed', {
        violations: results.violations.length,
        passes: results.passes.length,
        incomplete: results.incomplete.length
      });
    }
    
  } catch (error) {
    this.logger.error('Failed to run accessibility checks', error);
  }
};

CustomWorld.prototype.generateAccessibilityReport = async function(results: any): Promise<void> {
  try {
    const reportPath = './reports/accessibility-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    this.logger.info('Accessibility report generated', { path: reportPath });
  } catch (error) {
    this.logger.error('Failed to generate accessibility report', error);
  }
};

/**
 * Generate final test report
 */
async function generateFinalTestReport(): Promise<void> {
  try {
    const reportData = {
      executionSummary: {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        environment: process.env.ENV || 'unknown',
        browser: process.env.BROWSER || 'chromium',
        viewport: process.env.VIEWPORT || 'desktop'
      },
      // Additional report data would be collected here
    };
    
    const reportPath = './reports/final-test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    logger.info('Final test report generated', { path: reportPath });
    
  } catch (error) {
    logger.error('Failed to generate final test report', error);
  }
}

/**
 * Clean up temporary files
 */
async function cleanupTempFiles(): Promise<void> {
  try {
    // Clean up old screenshots (keep last 10)
    const screenshotDir = './reports/screenshots';
    if (fs.existsSync(screenshotDir)) {
      const files = fs.readdirSync(screenshotDir)
        .map(file => ({
          name: file,
          path: path.join(screenshotDir, file),
          time: fs.statSync(path.join(screenshotDir, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);
      
      // Keep only the latest 10 files
      files.slice(10).forEach(file => {
        fs.unlinkSync(file.path);
      });
      
      logger.info('Cleaned up old screenshots', { kept: Math.min(files.length, 10), removed: Math.max(0, files.length - 10) });
    }
    
    // Clean up old videos (keep last 5)
    const videoDir = './reports/videos';
    if (fs.existsSync(videoDir)) {
      const files = fs.readdirSync(videoDir)
        .map(file => ({
          name: file,
          path: path.join(videoDir, file),
          time: fs.statSync(path.join(videoDir, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);
      
      // Keep only the latest 5 files
      files.slice(5).forEach(file => {
        fs.unlinkSync(file.path);
      });
      
      logger.info('Cleaned up old videos', { kept: Math.min(files.length, 5), removed: Math.max(0, files.length - 5) });
    }
    
  } catch (error) {
    logger.error('Failed to clean up temporary files', error);
  }
}







