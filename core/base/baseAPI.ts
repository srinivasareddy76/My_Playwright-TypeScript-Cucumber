











import { APIRequestContext, APIResponse, request } from '@playwright/test';
import { Logger } from '../utilities/logger';
import { getEnvironmentConfig } from '../../config/environment';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, string>;
  timeout?: number;
  ignoreHTTPSErrors?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
  url: string;
}

export abstract class BaseAPI {
  protected apiContext: APIRequestContext;
  protected logger: Logger;
  protected config: ReturnType<typeof getEnvironmentConfig>;
  protected baseUrl: string;
  protected defaultHeaders: Record<string, string>;
  protected authToken?: string;

  constructor(logger?: Logger) {
    this.config = getEnvironmentConfig();
    this.baseUrl = this.config.apiUrl;
    this.logger = logger || new Logger({
      level: 'info',
      enableConsole: true,
      enableFile: false,
      filePath: ''
    });
    
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Playwright-Test-Automation/1.0',
      ...this.config.api.headers
    };
  }

  /**
   * Initialize API context
   */
  async initialize(): Promise<void> {
    try {
      this.apiContext = await request.newContext({
        baseURL: this.baseUrl,
        timeout: this.config.api.timeout,
        ignoreHTTPSErrors: true,
        extraHTTPHeaders: this.defaultHeaders
      });
      
      this.logger.info('API context initialized', { baseUrl: this.baseUrl });
    } catch (error) {
      this.logger.error('Failed to initialize API context', error);
      throw error;
    }
  }

  /**
   * Close API context
   */
  async close(): Promise<void> {
    try {
      if (this.apiContext) {
        await this.apiContext.dispose();
        this.logger.info('API context closed');
      }
    } catch (error) {
      this.logger.error('Failed to close API context', error);
    }
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    this.logger.info('Authentication token set');
  }

  /**
   * Remove authentication token
   */
  removeAuthToken(): void {
    this.authToken = undefined;
    delete this.defaultHeaders['Authorization'];
    this.logger.info('Authentication token removed');
  }

  /**
   * Make HTTP request
   */
  async makeRequest(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse> {
    const startTime = Date.now();
    const method = options.method || 'GET';
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    // Prepare headers
    const headers = {
      ...this.defaultHeaders,
      ...options.headers
    };

    // Prepare request options
    const requestOptions: any = {
      method,
      headers,
      timeout: options.timeout || this.config.api.timeout,
      ignoreHTTPSErrors: options.ignoreHTTPSErrors !== false
    };

    // Add data for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(method) && options.data) {
      requestOptions.data = typeof options.data === 'string' 
        ? options.data 
        : JSON.stringify(options.data);
    }

    // Add query parameters
    if (options.params) {
      const urlObj = new URL(url);
      Object.entries(options.params).forEach(([key, value]) => {
        urlObj.searchParams.append(key, value);
      });
      requestOptions.url = urlObj.toString();
    }

    this.logger.apiRequest(method, url, {
      headers: this.sanitizeHeaders(headers),
      data: options.data,
      params: options.params
    });

    let response: APIResponse;
    let attempt = 0;
    const maxRetries = options.maxRetries || this.config.api.retries;
    const retryDelay = options.retryDelay || 1000;

    while (attempt <= maxRetries) {
      try {
        response = await this.apiContext.fetch(url, requestOptions);
        const responseTime = Date.now() - startTime;
        
        // Parse response data
        let responseData: any;
        const contentType = response.headers()['content-type'] || '';
        
        if (contentType.includes('application/json')) {
          try {
            responseData = await response.json();
          } catch (error) {
            responseData = await response.text();
          }
        } else {
          responseData = await response.text();
        }

        const apiResponse: ApiResponse = {
          status: response.status(),
          statusText: response.statusText(),
          headers: response.headers(),
          data: responseData,
          responseTime,
          url: response.url()
        };

        this.logger.apiResponse(response.status(), url, {
          responseTime,
          dataSize: JSON.stringify(responseData).length
        });

        // Check if request was successful or should be retried
        if (response.ok() || !this.shouldRetry(response.status())) {
          return apiResponse;
        }

        // If not successful and should retry, continue to retry logic
        if (attempt < maxRetries) {
          this.logger.warn(`Request failed, retrying (${attempt + 1}/${maxRetries})`, {
            status: response.status(),
            url
          });
          await this.wait(retryDelay * (attempt + 1)); // Exponential backoff
          attempt++;
          continue;
        }

        return apiResponse;

      } catch (error) {
        attempt++;
        
        if (attempt > maxRetries) {
          this.logger.error('Request failed after all retries', {
            url,
            method,
            attempts: attempt,
            error
          });
          throw error;
        }

        this.logger.warn(`Request failed, retrying (${attempt}/${maxRetries})`, {
          url,
          method,
          error: error.message
        });
        
        await this.wait(retryDelay * attempt);
      }
    }

    throw new Error(`Request failed after ${maxRetries} retries`);
  }

  /**
   * GET request
   */
  async get(endpoint: string, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<ApiResponse> {
    return this.makeRequest(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint: string, data?: any, options: Omit<ApiRequestOptions, 'method' | 'data'> = {}): Promise<ApiResponse> {
    return this.makeRequest(endpoint, { ...options, method: 'POST', data });
  }

  /**
   * PUT request
   */
  async put(endpoint: string, data?: any, options: Omit<ApiRequestOptions, 'method' | 'data'> = {}): Promise<ApiResponse> {
    return this.makeRequest(endpoint, { ...options, method: 'PUT', data });
  }

  /**
   * DELETE request
   */
  async delete(endpoint: string, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<ApiResponse> {
    return this.makeRequest(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch(endpoint: string, data?: any, options: Omit<ApiRequestOptions, 'method' | 'data'> = {}): Promise<ApiResponse> {
    return this.makeRequest(endpoint, { ...options, method: 'PATCH', data });
  }

  /**
   * Upload file
   */
  async uploadFile(endpoint: string, filePath: string, fieldName: string = 'file', additionalData?: Record<string, any>): Promise<ApiResponse> {
    const fs = require('fs');
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const formData = new FormData();
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = filePath.split('/').pop() || 'file';
    
    formData.append(fieldName, new Blob([fileBuffer]), fileName);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    const headers = { ...this.defaultHeaders };
    delete headers['Content-Type']; // Let browser set multipart boundary

    this.logger.apiRequest('POST', endpoint, { 
      file: filePath, 
      fieldName, 
      additionalData 
    });

    try {
      const response = await this.apiContext.post(endpoint, {
        multipart: {
          [fieldName]: {
            name: fileName,
            mimeType: this.getMimeType(filePath),
            buffer: fileBuffer
          },
          ...additionalData
        },
        headers,
        timeout: this.config.api.timeout * 2 // Double timeout for file uploads
      });

      const responseTime = Date.now();
      let responseData: any;
      
      try {
        responseData = await response.json();
      } catch (error) {
        responseData = await response.text();
      }

      const apiResponse: ApiResponse = {
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        data: responseData,
        responseTime,
        url: response.url()
      };

      this.logger.apiResponse(response.status(), endpoint, { 
        responseTime, 
        fileSize: fileBuffer.length 
      });

      return apiResponse;

    } catch (error) {
      this.logger.error('File upload failed', { endpoint, filePath, error });
      throw error;
    }
  }

  /**
   * Download file
   */
  async downloadFile(endpoint: string, savePath: string, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<void> {
    const fs = require('fs');
    const path = require('path');
    
    this.logger.apiRequest('GET', endpoint, { savePath });

    try {
      const response = await this.apiContext.get(endpoint, {
        headers: { ...this.defaultHeaders, ...options.headers },
        timeout: options.timeout || this.config.api.timeout * 3 // Triple timeout for downloads
      });

      if (!response.ok()) {
        throw new Error(`Download failed: ${response.status()} ${response.statusText()}`);
      }

      const buffer = await response.body();
      
      // Ensure directory exists
      const dir = path.dirname(savePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(savePath, buffer);
      
      this.logger.apiResponse(response.status(), endpoint, { 
        savePath, 
        fileSize: buffer.length 
      });

    } catch (error) {
      this.logger.error('File download failed', { endpoint, savePath, error });
      throw error;
    }
  }

  /**
   * Validate response status
   */
  validateStatus(response: ApiResponse, expectedStatus: number | number[]): void {
    const expected = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    
    if (!expected.includes(response.status)) {
      const error = new Error(`Expected status ${expected.join(' or ')}, got ${response.status}`);
      this.logger.error('Status validation failed', {
        expected,
        actual: response.status,
        url: response.url
      });
      throw error;
    }

    this.logger.info('Status validation passed', {
      expected,
      actual: response.status
    });
  }

  /**
   * Validate response schema
   */
  validateSchema(response: ApiResponse, schema: any): void {
    // This would typically use a JSON schema validator like Ajv
    // For now, we'll do basic validation
    try {
      if (typeof schema === 'object' && schema.required) {
        const data = response.data;
        
        for (const field of schema.required) {
          if (!(field in data)) {
            throw new Error(`Required field '${field}' is missing from response`);
          }
        }
      }

      this.logger.info('Schema validation passed');
    } catch (error) {
      this.logger.error('Schema validation failed', { schema, data: response.data, error });
      throw error;
    }
  }

  /**
   * Validate response time
   */
  validateResponseTime(response: ApiResponse, maxTime: number): void {
    if (response.responseTime > maxTime) {
      const error = new Error(`Response time ${response.responseTime}ms exceeds maximum ${maxTime}ms`);
      this.logger.error('Response time validation failed', {
        responseTime: response.responseTime,
        maxTime,
        url: response.url
      });
      throw error;
    }

    this.logger.info('Response time validation passed', {
      responseTime: response.responseTime,
      maxTime
    });
  }

  /**
   * Extract data from response using JSONPath
   */
  extractData(response: ApiResponse, path: string): any {
    try {
      // Simple dot notation path extraction
      const keys = path.split('.');
      let data = response.data;
      
      for (const key of keys) {
        if (data && typeof data === 'object' && key in data) {
          data = data[key];
        } else {
          throw new Error(`Path '${path}' not found in response data`);
        }
      }

      this.logger.info('Data extracted successfully', { path, value: data });
      return data;
    } catch (error) {
      this.logger.error('Data extraction failed', { path, error });
      throw error;
    }
  }

  /**
   * Wait for specified time
   */
  private async wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Check if request should be retried based on status code
   */
  private shouldRetry(status: number): boolean {
    // Retry on server errors and some client errors
    return status >= 500 || status === 429 || status === 408;
  }

  /**
   * Sanitize headers for logging (remove sensitive information)
   */
  private sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized = { ...headers };
    
    // Remove or mask sensitive headers
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
    
    sensitiveHeaders.forEach(header => {
      const key = Object.keys(sanitized).find(k => k.toLowerCase() === header);
      if (key && sanitized[key]) {
        sanitized[key] = '***MASKED***';
      }
    });

    return sanitized;
  }

  /**
   * Get MIME type for file
   */
  private getMimeType(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    const mimeTypes: Record<string, string> = {
      'json': 'application/json',
      'xml': 'application/xml',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'txt': 'text/plain',
      'csv': 'text/csv',
      'zip': 'application/zip'
    };

    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  /**
   * Create request interceptor
   */
  async addRequestInterceptor(callback: (request: any) => void): Promise<void> {
    // This would be implemented based on specific needs
    this.logger.info('Request interceptor added');
  }

  /**
   * Create response interceptor
   */
  async addResponseInterceptor(callback: (response: ApiResponse) => void): Promise<void> {
    // This would be implemented based on specific needs
    this.logger.info('Response interceptor added');
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): any {
    // This would collect and return API performance metrics
    return {
      totalRequests: 0,
      averageResponseTime: 0,
      errorRate: 0
    };
  }
}











