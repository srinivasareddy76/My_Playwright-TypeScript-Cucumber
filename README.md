

# Playwright TypeScript Cucumber Framework

A comprehensive, enterprise-ready test automation framework built with Playwright, TypeScript, and Cucumber BDD. This framework supports multi-application testing, API testing, cross-browser testing, and provides extensive reporting capabilities.

## 🏗️ Framework Architecture

```
My_Playwright-TypeScript-Cucumber/
├── applications/           # Application-specific tests
│   ├── frbsf/             # FRBSF website tests
│   │   ├── features/      # Feature files
│   │   ├── pages/         # Page Object Models
│   │   └── step-definitions/ # Step definitions
│   └── app1/              # Example application tests
│       ├── features/
│       ├── pages/
│       └── step-definitions/
├── api/                   # API testing framework
│   ├── clients/           # API clients
│   ├── features/          # API feature files
│   ├── payloads/          # Request payloads
│   ├── schemas/           # Response schemas
│   └── step-definitions/  # API step definitions
├── core/                  # Core framework components
│   ├── base/              # Base classes
│   │   ├── basePage.ts    # Base page class
│   │   └── baseAPI.ts     # Base API class
│   ├── hooks/             # Cucumber hooks
│   │   ├── beforeHooks.ts
│   │   └── afterHooks.ts
│   ├── utilities/         # Utility classes
│   │   ├── browserManager.ts
│   │   └── logger.ts
│   └── world/             # Custom world
│       └── customWorld.ts
├── config/                # Configuration files
│   ├── env/               # Environment configs
│   │   ├── dev.env.ts
│   │   ├── qa.env.ts
│   │   └── prod.env.ts
│   └── environment.ts     # Environment manager
├── credentials/           # Test credentials
│   ├── users.json         # User credentials
│   └── serviceAccounts.json # Service accounts
├── certs/                 # SSL certificates
├── scripts/               # Shell scripts
│   ├── run-tests.sh       # Test execution script
│   └── setup.sh           # Setup script
├── reports/               # Test reports
├── playwright.config.ts   # Playwright configuration
├── cucumber.config.ts     # Cucumber configuration
└── package.json           # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/srinivasareddy76/My_Playwright-TypeScript-Cucumber.git
   cd My_Playwright-TypeScript-Cucumber
   ```

2. **Run the setup script:**
   ```bash
   ./scripts/setup.sh
   ```

3. **Update configuration:**
   - Edit `.env` file with your environment settings
   - Update `credentials/users.json` with test user credentials
   - Add SSL certificates to `certs/` directory if needed

### Running Tests

#### Using npm scripts:
```bash
# Run smoke tests
npm run test:smoke

# Run tests in headed mode
npm run test:headed

# Run specific application tests
npm run test:frbsf
npm run test:app1

# Run API tests
npm run test:api

# Run tests in different environments
npm run test:dev
npm run test:qa
npm run test:prod

# Run cross-browser tests
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run responsive tests
npm run test:mobile
npm run test:tablet
npm run test:desktop
```

#### Using the test runner script:
```bash
# Basic usage
./scripts/run-tests.sh

# With options
./scripts/run-tests.sh --env qa --browser firefox --tags '@regression'
./scripts/run-tests.sh --headed --tags '@smoke or @critical'
./scripts/run-tests.sh --env prod --tags '@api' --parallel 5

# Get help
./scripts/run-tests.sh --help
```

## 🧪 Test Organization

### Feature Files
Feature files are organized by application and follow BDD principles:

```gherkin
@ui @login @smoke
Feature: User Login Functionality
  As a user
  I want to be able to log into the application
  So that I can access my account

  @positive @critical
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid credentials
    Then I should be redirected to the dashboard
```

### Tags
The framework uses a comprehensive tagging strategy:

- **Test Types**: `@ui`, `@api`, `@integration`, `@e2e`
- **Priority**: `@smoke`, `@critical`, `@regression`
- **Applications**: `@frbsf`, `@app1`
- **Browsers**: `@cross-browser`
- **Devices**: `@mobile`, `@tablet`, `@desktop`, `@responsive`
- **Features**: `@login`, `@homepage`, `@search`
- **Quality**: `@performance`, `@accessibility`, `@security`
- **Environment**: `@prod-safe`

## 🔧 Configuration

### Environment Configuration
The framework supports multiple environments with specific configurations:

```typescript
// config/env/dev.env.ts
export const devConfig = {
  environment: 'dev',
  baseUrl: 'https://dev.frbsf.org',
  apiUrl: 'https://api-dev.frbsf.org',
  // ... other settings
};
```

### Playwright Configuration
Multi-browser support with comprehensive settings:

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
  // ... other configurations
});
```

### Cucumber Configuration
Profile-based test execution:

```typescript
// cucumber.config.ts
profiles: {
  smoke: { tags: '@smoke', parallel: 3, retry: 1 },
  regression: { tags: 'not @skip', parallel: 5, retry: 2 },
  api: { tags: '@api', parallel: 5, retry: 2 },
  // ... other profiles
}
```

## 📊 Reporting

The framework generates multiple types of reports:

### HTML Reports
```bash
npm run report:html
```
- Location: `reports/cucumber-html/index.html`
- Features: Interactive HTML report with screenshots and videos

### Allure Reports
```bash
npm run report:allure
```
- Location: `reports/allure-html/index.html`
- Features: Advanced reporting with trends, history, and analytics

### JSON Reports
- Location: `reports/cucumber-report.json`
- Usage: For CI/CD integration and custom reporting

## 🔐 Security & Credentials

### Credential Management
- Test credentials are stored in `credentials/users.json`
- Service account credentials in `credentials/serviceAccounts.json`
- **Never commit real credentials to version control**

### SSL Certificates
- Client certificates stored in `certs/` directory
- Configured automatically in Playwright
- See `certs/README.md` for setup instructions

### Environment Variables
Sensitive data is managed through environment variables:
```bash
# .env file
API_TOKEN=your_api_token_here
CLIENT_CERT_PASSPHRASE=your_passphrase
DB_PASSWORD=your_db_password
```

## 🏗️ Core Components

### CustomWorld
Central context for test execution:
```typescript
export interface ICustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  config: EnvironmentConfig;
  logger: Logger;
  // ... other properties
}
```

### BasePage
Common page operations:
```typescript
export abstract class BasePage {
  async clickElement(selector: string): Promise<void>
  async typeText(selector: string, text: string): Promise<void>
  async waitForElement(selector: string): Promise<Locator>
  // ... other methods
}
```

### BaseAPI
API testing foundation:
```typescript
export abstract class BaseAPI {
  async get(endpoint: string): Promise<ApiResponse>
  async post(endpoint: string, data?: any): Promise<ApiResponse>
  async validateStatus(response: ApiResponse, expectedStatus: number): void
  // ... other methods
}
```

## 🧪 Writing Tests

### Page Object Model
```typescript
export class LoginPage extends BasePage {
  private readonly usernameInput = '#username';
  private readonly passwordInput = '#password';
  private readonly loginButton = '#login-btn';

  async login(username: string, password: string): Promise<void> {
    await this.typeText(this.usernameInput, username);
    await this.typeText(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }
}
```

### Step Definitions
```typescript
Given('I am on the login page', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!, this.logger);
  await loginPage.navigateTo('/login');
});

When('I enter valid credentials', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!, this.logger);
  await loginPage.login('testuser', 'password123');
});
```

### API Testing
```typescript
When('I send a GET request to {string}', async function (endpoint: string) {
  const apiClient = new UserApiClient(this.logger);
  const response = await apiClient.get(endpoint);
  this.setTestData('apiResponse', response);
});

Then('the response status should be {int}', function (expectedStatus: number) {
  const response = this.getTestData('apiResponse');
  expect(response.status).toBe(expectedStatus);
});
```

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
- name: Run Tests
  run: |
    npm run ci:smoke
    npm run report:allure

- name: Upload Reports
  uses: actions/upload-artifact@v3
  with:
    name: test-reports
    path: reports/
```

## 🐛 Debugging

### Debug Mode
```bash
npm run debug
# or
DEBUG=true HEADED=true npm test -- --tags @debug
```

### Screenshots and Videos
- Automatic screenshots on failure
- Video recording for failed tests
- Traces for detailed debugging

### Logging
```typescript
this.logger.info('Test step executed');
this.logger.error('Test failed', error);
this.logger.performance('Page load time', 1500, 'ms');
```

## 📈 Performance Testing

### Performance Tags
```gherkin
@performance
Scenario: Page load performance
  When I navigate to the homepage
  Then the page should load within 3 seconds
```

## ♿ Accessibility Testing

### Accessibility Tags
```gherkin
@accessibility
Scenario: Login form accessibility
  Given I am on the login page
  Then the form should be accessible
```

## 🔒 Security Testing

### Security Tags
```gherkin
@security
Scenario: SQL injection protection
  When I attempt SQL injection in the search field
  Then the application should reject the input
```

## 📱 Mobile Testing

### Mobile Configuration
```typescript
// Mobile viewport testing
test:mobile: "VIEWPORT=mobile cucumber-js --tags '@mobile'"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following the coding standards
4. Run tests: `npm run validate`
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

### Coding Standards
- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Write comprehensive tests
- Document new features
- Use meaningful commit messages

## 📚 Documentation

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🆘 Troubleshooting

### Common Issues

1. **Browser not found**
   ```bash
   npx playwright install
   ```

2. **TypeScript compilation errors**
   ```bash
   npm run type-check
   ```

3. **Test failures**
   - Check logs in `reports/test-execution.log`
   - Review screenshots in `reports/screenshots/`
   - Examine traces in `reports/traces/`

4. **Permission denied on scripts**
   ```bash
   chmod +x scripts/*.sh
   ```

### Getting Help

- Check the [Issues](https://github.com/srinivasareddy76/My_Playwright-TypeScript-Cucumber/issues) page
- Review the troubleshooting section in individual component READMEs
- Run tests with `--verbose` flag for detailed output

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Playwright Team](https://github.com/microsoft/playwright) for the excellent testing framework
- [Cucumber Team](https://github.com/cucumber/cucumber-js) for BDD support
- [TypeScript Team](https://github.com/microsoft/TypeScript) for type safety
- Open source community for various tools and libraries

---

**Happy Testing! 🎉**

For more information, please refer to the individual component documentation in their respective directories.

