
export interface DatabaseConfig {
  host: string;
  port: number;
  serviceId: string;
  username: string;
  password: string;
}

export interface BrowserConfig {
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
  timeout: number;
  slowMo: number;
  video: boolean;
  screenshot: boolean;
}

export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  applicationPassword: string;
  isvaPassword: string;
  database: DatabaseConfig;
  browser: BrowserConfig;
  apiTimeout: number;
  pageLoadTimeout: number;
  elementTimeout: number;
}

export const environments: Record<string, EnvironmentConfig> = {
  t3: {
    name: 't3',
    baseUrl: 'https://frbsf.org',
    applicationPassword: 't3_app_password_2024',
    isvaPassword: 't3_isva_password_2024',
    database: {
      host: 't3-db-host.example.com',
      port: 1521,
      serviceId: 'T3DB',
      username: 't3_db_user',
      password: 't3_db_password_2024'
    },
    browser: {
      headless: process.env.HEADED !== 'true',
      viewport: {
        width: 1920,
        height: 1080
      },
      timeout: 30000,
      slowMo: 0,
      video: true,
      screenshot: true
    },
    apiTimeout: 10000,
    pageLoadTimeout: 30000,
    elementTimeout: 10000
  },
  t5: {
    name: 't5',
    baseUrl: 'https://frbsf.org',
    applicationPassword: 't5_app_password_2024',
    isvaPassword: 't5_isva_password_2024',
    database: {
      host: 't5-db-host.example.com',
      port: 1521,
      serviceId: 'T5DB',
      username: 't5_db_user',
      password: 't5_db_password_2024'
    },
    browser: {
      headless: process.env.HEADED !== 'true',
      viewport: {
        width: 1920,
        height: 1080
      },
      timeout: 30000,
      slowMo: 0,
      video: true,
      screenshot: true
    },
    apiTimeout: 10000,
    pageLoadTimeout: 30000,
    elementTimeout: 10000
  }
};

export class EnvironmentManager {
  private static instance: EnvironmentManager;
  private currentEnvironment: EnvironmentConfig;

  private constructor() {
    const envName = process.env.ENV || 't3';
    this.currentEnvironment = environments[envName];
    
    if (!this.currentEnvironment) {
      throw new Error(`Environment '${envName}' not found. Available environments: ${Object.keys(environments).join(', ')}`);
    }

    // Override browser settings based on environment variables
    this.applyEnvironmentOverrides();
  }

  public static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  public getConfig(): EnvironmentConfig {
    return this.currentEnvironment;
  }

  public getBaseUrl(): string {
    return this.currentEnvironment.baseUrl;
  }

  public getDatabaseConfig(): DatabaseConfig {
    return this.currentEnvironment.database;
  }

  public getBrowserConfig(): BrowserConfig {
    return this.currentEnvironment.browser;
  }

  public getApplicationPassword(): string {
    return this.currentEnvironment.applicationPassword;
  }

  public getIsvaPassword(): string {
    return this.currentEnvironment.isvaPassword;
  }

  public getEnvironmentName(): string {
    return this.currentEnvironment.name;
  }

  private applyEnvironmentOverrides(): void {
    // Browser type override
    const browserType = process.env.BROWSER || 'chromium';
    
    // Viewport overrides
    const viewportType = process.env.VIEWPORT;
    if (viewportType) {
      switch (viewportType) {
        case 'mobile':
          this.currentEnvironment.browser.viewport = { width: 375, height: 667 };
          break;
        case 'tablet':
          this.currentEnvironment.browser.viewport = { width: 768, height: 1024 };
          break;
        case 'desktop':
          this.currentEnvironment.browser.viewport = { width: 1920, height: 1080 };
          break;
      }
    }

    // Headless override
    if (process.env.HEADED === 'true') {
      this.currentEnvironment.browser.headless = false;
    }

    // Timeout overrides
    if (process.env.TIMEOUT) {
      const timeout = parseInt(process.env.TIMEOUT, 10);
      this.currentEnvironment.browser.timeout = timeout;
      this.currentEnvironment.pageLoadTimeout = timeout;
    }

    // Slow motion override for debugging
    if (process.env.SLOW_MO) {
      this.currentEnvironment.browser.slowMo = parseInt(process.env.SLOW_MO, 10);
    }
  }

  public updateConfig(updates: Partial<EnvironmentConfig>): void {
    this.currentEnvironment = { ...this.currentEnvironment, ...updates };
  }

  public isProduction(): boolean {
    return this.currentEnvironment.name === 'prod';
  }

  public isTestEnvironment(): boolean {
    return ['t3', 't5'].includes(this.currentEnvironment.name);
  }
}

export default EnvironmentManager;

