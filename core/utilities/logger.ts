




import * as fs from 'fs';
import * as path from 'path';

export interface LoggerConfig {
  level: string;
  enableConsole: boolean;
  enableFile: boolean;
  filePath: string;
}

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export class Logger {
  private config: LoggerConfig;
  private logLevelMap: Record<string, LogLevel> = {
    'error': LogLevel.ERROR,
    'warn': LogLevel.WARN,
    'info': LogLevel.INFO,
    'debug': LogLevel.DEBUG
  };

  constructor(config: LoggerConfig) {
    this.config = config;
    this.ensureLogDirectory();
  }

  /**
   * Ensure log directory exists
   */
  private ensureLogDirectory(): void {
    if (this.config.enableFile) {
      const logDir = path.dirname(this.config.filePath);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    }
  }

  /**
   * Check if log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const configLevel = this.logLevelMap[this.config.level.toLowerCase()] || LogLevel.INFO;
    return level <= configLevel;
  }

  /**
   * Format log message
   */
  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const logData = data ? ` ${JSON.stringify(data)}` : '';
    return `${timestamp} [${level.toUpperCase()}] ${message}${logData}`;
  }

  /**
   * Write log to console
   */
  private logToConsole(level: string, formattedMessage: string): void {
    if (!this.config.enableConsole) return;

    switch (level.toLowerCase()) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  }

  /**
   * Write log to file
   */
  private logToFile(formattedMessage: string): void {
    if (!this.config.enableFile) return;

    try {
      fs.appendFileSync(this.config.filePath, formattedMessage + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Log message with specified level
   */
  private log(level: string, message: string, data?: any): void {
    const logLevel = this.logLevelMap[level.toLowerCase()];
    if (!this.shouldLog(logLevel)) return;

    const formattedMessage = this.formatMessage(level, message, data);
    
    this.logToConsole(level, formattedMessage);
    this.logToFile(formattedMessage);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | any): void {
    const errorData = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error;
    
    this.log('error', message, errorData);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  /**
   * Log info message
   */
  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  /**
   * Log test step
   */
  step(stepName: string, data?: any): void {
    this.info(`STEP: ${stepName}`, data);
  }

  /**
   * Log test scenario start
   */
  scenarioStart(scenarioName: string, tags?: string[]): void {
    this.info(`SCENARIO START: ${scenarioName}`, { tags });
  }

  /**
   * Log test scenario end
   */
  scenarioEnd(scenarioName: string, status: string, duration?: number): void {
    this.info(`SCENARIO END: ${scenarioName} - ${status.toUpperCase()}`, { duration });
  }

  /**
   * Log feature start
   */
  featureStart(featureName: string): void {
    this.info(`FEATURE START: ${featureName}`);
  }

  /**
   * Log feature end
   */
  featureEnd(featureName: string): void {
    this.info(`FEATURE END: ${featureName}`);
  }

  /**
   * Log page action
   */
  pageAction(action: string, details?: any): void {
    this.info(`PAGE ACTION: ${action}`, details);
  }

  /**
   * Log API request
   */
  apiRequest(method: string, url: string, data?: any): void {
    this.info(`API REQUEST: ${method} ${url}`, data);
  }

  /**
   * Log API response
   */
  apiResponse(status: number, url: string, data?: any): void {
    this.info(`API RESPONSE: ${status} ${url}`, data);
  }

  /**
   * Log performance metrics
   */
  performance(metric: string, value: number, unit: string = 'ms'): void {
    this.info(`PERFORMANCE: ${metric}`, { value, unit });
  }

  /**
   * Log test execution summary
   */
  testSummary(summary: any): void {
    this.info('TEST EXECUTION SUMMARY', summary);
  }

  /**
   * Create child logger with prefix
   */
  child(prefix: string): Logger {
    const childConfig = { ...this.config };
    const originalFormatMessage = this.formatMessage.bind(this);
    
    // Override format message to include prefix
    (this as any).formatMessage = (level: string, message: string, data?: any): string => {
      return originalFormatMessage(level, `[${prefix}] ${message}`, data);
    };
    
    return this;
  }

  /**
   * Clear log file
   */
  clearLogFile(): void {
    if (this.config.enableFile && fs.existsSync(this.config.filePath)) {
      fs.writeFileSync(this.config.filePath, '');
      this.info('Log file cleared');
    }
  }

  /**
   * Get log file content
   */
  getLogFileContent(): string {
    if (this.config.enableFile && fs.existsSync(this.config.filePath)) {
      return fs.readFileSync(this.config.filePath, 'utf8');
    }
    return '';
  }

  /**
   * Archive current log file
   */
  archiveLogFile(): void {
    if (this.config.enableFile && fs.existsSync(this.config.filePath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const archivePath = this.config.filePath.replace('.log', `-${timestamp}.log`);
      
      fs.copyFileSync(this.config.filePath, archivePath);
      fs.writeFileSync(this.config.filePath, '');
      
      this.info('Log file archived', { archivePath });
    }
  }

  /**
   * Set log level dynamically
   */
  setLogLevel(level: string): void {
    if (this.logLevelMap[level.toLowerCase()] !== undefined) {
      this.config.level = level.toLowerCase();
      this.info('Log level changed', { level });
    } else {
      this.warn('Invalid log level', { level, validLevels: Object.keys(this.logLevelMap) });
    }
  }

  /**
   * Enable/disable console logging
   */
  setConsoleLogging(enabled: boolean): void {
    this.config.enableConsole = enabled;
    this.info('Console logging changed', { enabled });
  }

  /**
   * Enable/disable file logging
   */
  setFileLogging(enabled: boolean): void {
    this.config.enableFile = enabled;
    if (enabled) {
      this.ensureLogDirectory();
    }
    this.info('File logging changed', { enabled });
  }
}

/**
 * Create default logger instance
 */
export function createLogger(config?: Partial<LoggerConfig>): Logger {
  const defaultConfig: LoggerConfig = {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: process.env.LOG_CONSOLE !== 'false',
    enableFile: process.env.LOG_FILE !== 'false',
    filePath: process.env.LOG_FILE_PATH || './reports/test-execution.log'
  };

  return new Logger({ ...defaultConfig, ...config });
}

/**
 * Global logger instance
 */
export const logger = createLogger();

export default Logger;




