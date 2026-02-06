

import winston from 'winston';
import path from 'path';

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor() {
    const logLevel = process.env.DEBUG === 'true' ? 'debug' : 'info';
    const isVerbose = process.env.VERBOSE === 'true';

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ level, message, timestamp, stack }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}${stack ? '\n' + stack : ''}`;
        })
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
          silent: !isVerbose && process.env.CI === 'true'
        }),
        new winston.transports.File({
          filename: path.join(process.cwd(), 'reports', 'test-execution.log'),
          maxsize: 5242880, // 5MB
          maxFiles: 5
        }),
        new winston.transports.File({
          filename: path.join(process.cwd(), 'reports', 'error.log'),
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 3
        })
      ]
    });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  public error(message: string, error?: Error | any): void {
    this.logger.error(message, error);
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  public step(stepName: string, action: string): void {
    this.logger.info(`STEP: ${stepName} - ${action}`);
  }

  public pageAction(page: string, action: string, element?: string): void {
    const elementInfo = element ? ` on element: ${element}` : '';
    this.logger.info(`PAGE ACTION: ${page} - ${action}${elementInfo}`);
  }

  public assertion(description: string, result: boolean): void {
    const status = result ? 'PASSED' : 'FAILED';
    this.logger.info(`ASSERTION [${status}]: ${description}`);
  }

  public performance(action: string, duration: number): void {
    this.logger.info(`PERFORMANCE: ${action} took ${duration}ms`);
  }

  public screenshot(path: string): void {
    this.logger.info(`SCREENSHOT: Captured at ${path}`);
  }

  public testStart(testName: string): void {
    this.logger.info(`TEST START: ${testName}`);
  }

  public testEnd(testName: string, status: 'PASSED' | 'FAILED' | 'SKIPPED'): void {
    this.logger.info(`TEST END: ${testName} - ${status}`);
  }

  public scenario(scenarioName: string, action: 'START' | 'END', status?: string): void {
    if (action === 'START') {
      this.logger.info(`SCENARIO START: ${scenarioName}`);
    } else {
      this.logger.info(`SCENARIO END: ${scenarioName} - ${status || 'COMPLETED'}`);
    }
  }
}

export default Logger;


