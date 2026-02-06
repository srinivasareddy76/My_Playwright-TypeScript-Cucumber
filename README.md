






# My_Playwright-TypeScript-Cucumber

A comprehensive test automation framework for the Federal Reserve Bank of San Francisco (FRBSF) website using Playwright, TypeScript, and Cucumber with BDD approach.

## 🚀 Framework Overview

This framework provides robust end-to-end testing capabilities for the FRBSF website with:

- **Playwright 1.58.1** for reliable browser automation
- **TypeScript** for type safety and better development experience
- **Cucumber** with Gherkin syntax for BDD testing
- **Page Object Model (POM)** design pattern
- **Multi-environment support** (t3, t5)
- **Cross-browser testing** (Chromium, Firefox, WebKit)
- **Responsive design testing** (Desktop, Tablet, Mobile)
- **Performance testing** capabilities
- **Comprehensive reporting** with HTML and JSON outputs

## 📁 Project Structure

```
My_Playwright-TypeScript-Cucumber/
├── tests/
│   ├── apps/
│   │   └── frbsf/
│   │       ├── features/           # Gherkin feature files
│   │       ├── pages/              # Page Object Models
│   │       └── steps/              # Step definitions
│   └── pages/                      # Base page classes
├── src/
│   ├── config/                     # Environment management
│   ├── utils/                      # Test utilities
│   ├── common/                     # Cucumber hooks & world
│   └── database/                   # SQL utilities (optional)
├── reports/                        # Generated test reports
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── cucumber.js                     # Cucumber profiles
└── README.md                       # This file
```

## 🛠 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Git** for version control

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd My_Playwright-TypeScript-Cucumber
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install
```

### 3. Environment Setup

Copy the environment template and configure:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
ENV=t3
BROWSER=chromium
HEADED=false
VIEWPORT=desktop
```

### 4. Run Tests

```bash
# Run all smoke tests
npm run test:smoke:t3

# Run tests in headed mode
npm run test:headed

# Run specific feature tests
npm run test:homepage
```

## 🎯 Test Execution Commands

### Basic Test Execution

```bash
# Run all tests
npm test

# Run in headed mode (visible browser)
npm run test:headed

# Run in headless mode
npm run test:headless
```

### Environment-Specific Tests

```bash
# Run tests in T3 environment
npm run test:smoke:t3

# Run tests in T5 environment
npm run test:smoke:t5
```

### Feature-Specific Tests

```bash
# Homepage functionality tests
npm run test:homepage

# Search functionality tests
npm run test:search

# Research section tests
npm run test:research

# News and media tests
npm run test:news

# Critical tests only
npm run test:critical
```

### Cross-Browser Testing

```bash
# Run tests in Chromium
npm run test:chromium

# Run tests in Firefox
npm run test:firefox

# Run tests in WebKit
npm run test:webkit
```

### Responsive Design Testing

```bash
# Mobile viewport tests
npm run test:mobile

# Tablet viewport tests
npm run test:tablet

# Desktop viewport tests
npm run test:desktop
```

### Advanced Execution

```bash
# Parallel execution
npm run test:parallel

# Retry failed tests
npm run test:retry

# Custom test runner
npm run test:runner
```

## 🏗 Framework Architecture

### Page Object Model

The framework uses the Page Object Model pattern with a hierarchical structure:

```typescript
BasePage (Abstract)
├── HomePage
├── SearchResultsPage
├── ResearchInsightsPage
└── NewsMediaPage
```

### Environment Management

Multi-environment support with configuration for:

- **Application URLs**
- **Database connections**
- **Browser settings**
- **Timeouts and performance thresholds**

### Custom World Context

Cucumber World provides:

- **Browser management**
- **Page object instances**
- **Test data storage**
- **Screenshot and trace capture**
- **Performance measurement**

## 📊 Test Scenarios Coverage

### 1. Homepage Functionality (15+ scenarios)
- Page loading and performance
- Navigation menu functionality
- Search functionality
- Federal Reserve branding
- Content sections validation
- Footer and social media links
- Responsive design testing
- Accessibility compliance

### 2. Search Functionality (17+ scenarios)
- Basic and advanced search
- Search results validation
- Filtering and sorting
- Pagination
- Performance testing
- Mobile search experience
- Search suggestions and autocomplete

### 3. Research & Insights (18+ scenarios)
- Research content accessibility
- Publication types (Working Papers, Economic Letters)
- Filtering and categorization
- Author information and citations
- Newsletter subscription
- Social sharing capabilities
- Mobile optimization

### 4. News & Media (22+ scenarios)
- News content organization
- Press releases and speeches
- Media contacts and events
- Content freshness validation
- RSS feeds and subscriptions
- Archive accessibility
- Performance and accessibility

### 5. Responsive Design (18+ scenarios)
- Cross-viewport compatibility
- Touch interactions
- Device orientation handling
- Performance across devices
- Progressive enhancement
- Offline functionality

### 6. Performance Testing (20+ scenarios)
- Page load time validation
- Resource optimization
- Core Web Vitals measurement
- Mobile performance
- Caching effectiveness
- Third-party integration impact

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ENV` | Test environment (t3, t5) | t3 |
| `BROWSER` | Browser type (chromium, firefox, webkit) | chromium |
| `HEADED` | Run in headed mode | false |
| `VIEWPORT` | Viewport size (desktop, tablet, mobile) | desktop |
| `TIMEOUT` | Default timeout in milliseconds | 30000 |
| `PARALLEL` | Number of parallel workers | 3 |
| `RETRY` | Number of retry attempts | 2 |

### Browser Configuration

```typescript
browser: {
  headless: process.env.HEADED !== 'true',
  viewport: { width: 1920, height: 1080 },
  timeout: 30000,
  slowMo: 0,
  video: true,
  screenshot: true
}
```

### Environment-Specific Settings

```typescript
environments: {
  t3: {
    baseUrl: 'https://frbsf.org',
    database: {
      host: 't3-db-host.example.com',
      port: 1521,
      serviceId: 'T3DB'
    }
  },
  t5: {
    baseUrl: 'https://frbsf.org',
    database: {
      host: 't5-db-host.example.com',
      port: 1521,
      serviceId: 'T5DB'
    }
  }
}
```

## 📈 Reporting

### HTML Reports

Interactive HTML reports are generated at:
- `reports/cucumber-report.html`

### JSON Reports

Machine-readable JSON reports for CI/CD integration:
- `reports/cucumber-report.json`

### Screenshots and Videos

Automatic capture on test failures:
- `reports/screenshots/`
- `reports/videos/`

### Performance Reports

Performance metrics and Core Web Vitals:
- `reports/test-summary.json`

## 🔍 Debugging

### Debug Mode

```bash
# Run with debug logging
DEBUG=true npm test

# Run with verbose output
VERBOSE=true npm test

# Run specific scenario with debugging
npm test -- --tags "@debug"
```

### Screenshot Capture

Screenshots are automatically captured:
- On test failures
- At specific test steps
- On demand via API

### Trace Files

Playwright traces for detailed debugging:
- Automatically generated for failed tests
- Include network activity, console logs, and DOM snapshots

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:ci
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: reports/
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test:ci'
            }
        }
    }
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports',
                reportFiles: 'cucumber-report.html',
                reportName: 'Test Report'
            ])
        }
    }
}
```

## 🛡 Best Practices

### Test Writing Guidelines

1. **Use descriptive scenario names**
2. **Follow Given-When-Then structure**
3. **Keep scenarios focused and atomic**
4. **Use appropriate tags for organization**
5. **Implement proper error handling**

### Page Object Guidelines

1. **Encapsulate page-specific logic**
2. **Use meaningful selector strategies**
3. **Implement proper waiting mechanisms**
4. **Provide clear method names**
5. **Handle dynamic content appropriately**

### Performance Guidelines

1. **Set appropriate timeouts**
2. **Use efficient selectors**
3. **Minimize unnecessary waits**
4. **Implement proper resource cleanup**
5. **Monitor test execution times**

## 🔧 Troubleshooting

### Common Issues

#### Browser Launch Failures
```bash
# Install system dependencies
npx playwright install-deps

# Clear browser cache
rm -rf ~/.cache/ms-playwright
npx playwright install
```

#### TypeScript Compilation Errors
```bash
# Clean and rebuild
npm run clean
npm run type-check
```

#### Test Timeouts
```bash
# Increase timeout
TIMEOUT=60000 npm test

# Run in headed mode for debugging
HEADED=true npm test
```

### Debug Commands

```bash
# Check browser installation
npx playwright install --dry-run

# Validate configuration
npm run type-check

# Test specific browser
BROWSER=firefox npm test

# Run with maximum logging
DEBUG=* VERBOSE=true npm test
```

## 📚 Additional Resources

### Documentation Links

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Framework Extensions

- **Database Testing**: SQL utilities in `src/database/`
- **API Testing**: REST API validation capabilities
- **Visual Testing**: Screenshot comparison features
- **Accessibility Testing**: WCAG compliance validation

### Support and Contribution

- **Issues**: Report bugs and feature requests
- **Pull Requests**: Contribute improvements
- **Documentation**: Help improve documentation
- **Testing**: Add new test scenarios

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Test Automation Team**
- **Quality Assurance Engineers**
- **DevOps Engineers**

---

**Happy Testing! 🎉**

For questions or support, please contact the Test Automation Team.






