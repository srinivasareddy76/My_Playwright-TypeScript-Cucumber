

import { devConfig } from './env/dev.env';
import { qaConfig } from './env/qa.env';
import { prodConfig } from './env/prod.env';

export interface EnvironmentConfig {
  environment: string;
  baseUrl: string;
  apiUrl: string;
  browser: string;
  headed: boolean;
  viewport: { width: number; height: number };
  timeout: number;
  slowMo: number;
  parallel: number;
  retry: number;
  enableVideoRecording: boolean;
  enableScreenshots: boolean;
  enableTracing: boolean;
  enableNetworkLogs: boolean;
  database: {
    host: string;
    port: number;
    serviceName: string;
    username: string;
    password: string;
    readOnly?: boolean;
  };
  api: {
    timeout: number;
    retries: number;
    headers: Record<string, string>;
  };
  auth: {
    enabled: boolean;
    type: string;
    clientId?: string;
    clientSecret?: string;
    tokenUrl?: string;
  };
  logging: {
    level: string;
    enableConsole: boolean;
    enableFile: boolean;
    filePath: string;
  };
  testData: {
    users: Record<string, { username: string; password?: string }>;
  };
  performance?: {
    pageLoadTime: number;
    apiResponseTime: number;
    resourceLoadTime: number;
  };
  accessibility?: {
    enabled: boolean;
    standards: string[];
    includeWarnings: boolean;
  };
  security?: {
    enableSSLVerification: boolean;
    allowSelfSignedCerts?: boolean;
    allowInsecureRequests?: boolean;
    enableCSPValidation?: boolean;
    enableCertificateValidation?: boolean;
  };
  rateLimiting?: {
    enabled: boolean;
    requestsPerSecond: number;
    burstLimit: number;
  };
  monitoring?: {
    enableMetrics: boolean;
    enableAlerts: boolean;
    alertThresholds: {
      errorRate: number;
      responseTime: number;
    };
  };
}

/**
 * Get environment configuration based on ENV variable
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = process.env.ENV || 'dev';
  
  switch (env.toLowerCase()) {
    case 'dev':
    case 'development':
      return devConfig;
    case 'qa':
    case 'test':
      return qaConfig;
    case 'prod':
    case 'production':
      return prodConfig;
    case 't3':
      return {
        ...devConfig,
        environment: 't3',
        baseUrl: 'https://frbsf.org'
      };
    case 't5':
      return {
        ...qaConfig,
        environment: 't5',
        baseUrl: 'https://frbsf.org'
      };
    default:
      console.warn(`Unknown environment: ${env}. Defaulting to dev configuration.`);
      return devConfig;
  }
}

/**
 * Get base URL for the current environment
 */
export function getBaseUrl(): string {
  return getEnvironmentConfig().baseUrl;
}

/**
 * Get API URL for the current environment
 */
export function getApiUrl(): string {
  return getEnvironmentConfig().apiUrl;
}

/**
 * Get database configuration for the current environment
 */
export function getDatabaseConfig() {
  return getEnvironmentConfig().database;
}

/**
 * Get authentication configuration for the current environment
 */
export function getAuthConfig() {
  return getEnvironmentConfig().auth;
}

/**
 * Get test users for the current environment
 */
export function getTestUsers() {
  return getEnvironmentConfig().testData.users;
}

/**
 * Get performance thresholds for the current environment
 */
export function getPerformanceThresholds() {
  return getEnvironmentConfig().performance;
}

/**
 * Check if feature is enabled in current environment
 */
export function isFeatureEnabled(feature: keyof EnvironmentConfig): boolean {
  const config = getEnvironmentConfig();
  return Boolean(config[feature]);
}

/**
 * Get viewport configuration
 */
export function getViewportConfig() {
  const viewport = process.env.VIEWPORT || 'desktop';
  
  switch (viewport.toLowerCase()) {
    case 'mobile':
      return { width: 375, height: 667 };
    case 'tablet':
      return { width: 768, height: 1024 };
    case 'desktop':
    default:
      return { width: 1920, height: 1080 };
  }
}

/**
 * Get browser configuration
 */
export function getBrowserConfig() {
  const config = getEnvironmentConfig();
  return {
    browser: process.env.BROWSER || config.browser,
    headed: process.env.HEADED === 'true' || config.headed,
    viewport: getViewportConfig(),
    timeout: parseInt(process.env.TIMEOUT || config.timeout.toString()),
    slowMo: parseInt(process.env.SLOW_MO || config.slowMo.toString())
  };
}

/**
 * Get execution configuration
 */
export function getExecutionConfig() {
  const config = getEnvironmentConfig();
  return {
    parallel: parseInt(process.env.PARALLEL || config.parallel.toString()),
    retry: parseInt(process.env.RETRY || config.retry.toString()),
    tags: process.env.TAGS || '@smoke',
    timeout: parseInt(process.env.TIMEOUT || config.timeout.toString())
  };
}

export default getEnvironmentConfig;


