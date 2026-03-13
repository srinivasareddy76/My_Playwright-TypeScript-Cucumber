







import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../../core/world/customWorld';
import { UserApiClient } from '../clients/userClient';
import { UserPayload } from '../payloads/userPayload';
import { UserSchema } from '../schemas/userSchema';

let userApiClient: UserApiClient;
let apiResponse: any;
let testUser: any;
let testUsers: any[] = [];

// Background Steps
Given('the API is available', async function (this: ICustomWorld) {
  userApiClient = new UserApiClient(this.logger);
  await userApiClient.initialize();
  
  // Health check
  const healthResponse = await userApiClient.get('/health');
  expect(healthResponse.status).toBe(200);
  
  this.logger.info('API is available and healthy');
});

Given('I have valid API credentials', async function (this: ICustomWorld) {
  const token = process.env.API_TOKEN || 'test_api_token';
  userApiClient.setAuthToken(token);
  this.logger.info('API credentials set');
});

Given('I have no API credentials', async function (this: ICustomWorld) {
  userApiClient.removeAuthToken();
  this.logger.info('API credentials removed');
});

Given('I have an invalid API token', async function (this: ICustomWorld) {
  userApiClient.setAuthToken('invalid_token_12345');
  this.logger.info('Invalid API token set');
});

// Test Data Setup
Given('a user exists with ID {string}', async function (this: ICustomWorld, userId: string) {
  // Create test user if it doesn't exist
  try {
    const existingUser = await userApiClient.get(`/api/users/${userId}`);
    if (existingUser.status === 200) {
      testUser = existingUser.data;
      this.logger.info(`User ${userId} already exists`);
    }
  } catch (error) {
    // User doesn't exist, create it
    const userData = UserPayload.createValidUser({ id: userId });
    const createResponse = await userApiClient.post('/api/users', userData);
    testUser = createResponse.data;
    this.logger.info(`Created test user with ID ${userId}`);
  }
});

Given('I have valid user data', async function (this: ICustomWorld) {
  testUser = UserPayload.createValidUser();
  this.logger.info('Valid user data prepared', { user: testUser });
});

Given('I have updated user data', async function (this: ICustomWorld) {
  testUser = {
    ...testUser,
    ...UserPayload.createUpdateData()
  };
  this.logger.info('Updated user data prepared');
});

Given('I have invalid user data', async function (this: ICustomWorld) {
  testUser = UserPayload.createInvalidUser();
  this.logger.info('Invalid user data prepared');
});

// API Request Steps
When('I send a GET request to {string}', async function (this: ICustomWorld, endpoint: string) {
  this.logger.apiRequest('GET', endpoint);
  apiResponse = await userApiClient.get(endpoint);
  this.logger.apiResponse(apiResponse.status, endpoint, { 
    responseTime: apiResponse.responseTime 
  });
});

When('I send a POST request to {string} with user data', async function (this: ICustomWorld, endpoint: string) {
  this.logger.apiRequest('POST', endpoint, { data: testUser });
  apiResponse = await userApiClient.post(endpoint, testUser);
  this.logger.apiResponse(apiResponse.status, endpoint, { 
    responseTime: apiResponse.responseTime 
  });
});

When('I send a POST request to {string} with invalid data', async function (this: ICustomWorld, endpoint: string) {
  this.logger.apiRequest('POST', endpoint, { data: testUser });
  apiResponse = await userApiClient.post(endpoint, testUser);
  this.logger.apiResponse(apiResponse.status, endpoint, { 
    responseTime: apiResponse.responseTime 
  });
});

When('I send a PUT request to {string} with updated data', async function (this: ICustomWorld, endpoint: string) {
  this.logger.apiRequest('PUT', endpoint, { data: testUser });
  apiResponse = await userApiClient.put(endpoint, testUser);
  this.logger.apiResponse(apiResponse.status, endpoint, { 
    responseTime: apiResponse.responseTime 
  });
});

When('I send a DELETE request to {string}', async function (this: ICustomWorld, endpoint: string) {
  this.logger.apiRequest('DELETE', endpoint);
  apiResponse = await userApiClient.delete(endpoint);
  this.logger.apiResponse(apiResponse.status, endpoint, { 
    responseTime: apiResponse.responseTime 
  });
});

// Performance Testing Steps
When('I send {int} concurrent GET requests to {string}', async function (this: ICustomWorld, count: number, endpoint: string) {
  this.logger.info(`Sending ${count} concurrent requests to ${endpoint}`);
  
  const promises = Array.from({ length: count }, () => 
    userApiClient.get(endpoint)
  );
  
  const responses = await Promise.all(promises);
  apiResponse = {
    responses,
    averageResponseTime: responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length,
    successCount: responses.filter(r => r.status === 200).length,
    totalCount: responses.length
  };
  
  this.logger.performance('Concurrent requests completed', apiResponse.averageResponseTime);
});

When('I send {int} requests to {string} within {int} minute', async function (this: ICustomWorld, count: number, endpoint: string, minutes: number) {
  this.logger.info(`Sending ${count} requests to ${endpoint} within ${minutes} minute(s)`);
  
  const startTime = Date.now();
  const endTime = startTime + (minutes * 60 * 1000);
  const responses = [];
  
  while (Date.now() < endTime && responses.length < count) {
    try {
      const response = await userApiClient.get(endpoint);
      responses.push(response);
    } catch (error) {
      responses.push({ status: 0, error: error.message });
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  apiResponse = {
    responses,
    rateLimitedCount: responses.filter(r => r.status === 429).length,
    successCount: responses.filter(r => r.status === 200).length,
    totalCount: responses.length
  };
  
  this.logger.info('Rate limiting test completed', apiResponse);
});

// Response Validation Steps
Then('the response status should be {int}', async function (this: ICustomWorld, expectedStatus: number) {
  expect(apiResponse.status).toBe(expectedStatus);
  this.logger.info(`Response status validation passed: ${expectedStatus}`);
});

Then('the response should contain a list of users', async function (this: ICustomWorld) {
  expect(Array.isArray(apiResponse.data)).toBe(true);
  expect(apiResponse.data.length).toBeGreaterThan(0);
  this.logger.info(`Response contains ${apiResponse.data.length} users`);
});

Then('each user should have required fields', async function (this: ICustomWorld) {
  const requiredFields = ['id', 'username', 'email', 'createdAt'];
  
  for (const user of apiResponse.data) {
    for (const field of requiredFields) {
      expect(user).toHaveProperty(field);
    }
  }
  
  this.logger.info('All users have required fields');
});

Then('the response time should be less than {int}ms', async function (this: ICustomWorld, maxTime: number) {
  expect(apiResponse.responseTime).toBeLessThan(maxTime);
  this.logger.performance('Response time validation passed', apiResponse.responseTime, 'ms');
});

Then('the response should contain user details', async function (this: ICustomWorld) {
  expect(apiResponse.data).toBeDefined();
  expect(typeof apiResponse.data).toBe('object');
  expect(apiResponse.data.id).toBeDefined();
  this.logger.info('Response contains user details');
});

Then('the user ID should be {string}', async function (this: ICustomWorld, expectedId: string) {
  expect(apiResponse.data.id.toString()).toBe(expectedId);
  this.logger.info(`User ID validation passed: ${expectedId}`);
});

Then('the response should match the user schema', async function (this: ICustomWorld) {
  const isValid = UserSchema.validateUser(apiResponse.data);
  expect(isValid).toBe(true);
  this.logger.info('User schema validation passed');
});

Then('the response should contain the created user', async function (this: ICustomWorld) {
  expect(apiResponse.data).toBeDefined();
  expect(apiResponse.data.id).toBeDefined();
  expect(apiResponse.data.username).toBe(testUser.username);
  expect(apiResponse.data.email).toBe(testUser.email);
  this.logger.info('Created user validation passed');
});

Then('the user should have a generated ID', async function (this: ICustomWorld) {
  expect(apiResponse.data.id).toBeDefined();
  expect(typeof apiResponse.data.id).toBe('string');
  expect(apiResponse.data.id.length).toBeGreaterThan(0);
  this.logger.info(`Generated user ID: ${apiResponse.data.id}`);
});

Then('the user should be retrievable by ID', async function (this: ICustomWorld) {
  const userId = apiResponse.data.id;
  const getResponse = await userApiClient.get(`/api/users/${userId}`);
  
  expect(getResponse.status).toBe(200);
  expect(getResponse.data.id).toBe(userId);
  this.logger.info('User retrieval validation passed');
});

Then('the response should contain the updated user', async function (this: ICustomWorld) {
  expect(apiResponse.data).toBeDefined();
  expect(apiResponse.data.id).toBe(testUser.id);
  
  // Check that updated fields are present
  if (testUser.username) {
    expect(apiResponse.data.username).toBe(testUser.username);
  }
  if (testUser.email) {
    expect(apiResponse.data.email).toBe(testUser.email);
  }
  
  this.logger.info('Updated user validation passed');
});

Then('the user data should be updated in the system', async function (this: ICustomWorld) {
  const userId = testUser.id;
  const getResponse = await userApiClient.get(`/api/users/${userId}`);
  
  expect(getResponse.status).toBe(200);
  expect(getResponse.data.username).toBe(testUser.username);
  expect(getResponse.data.email).toBe(testUser.email);
  this.logger.info('System update validation passed');
});

Then('the user should no longer exist in the system', async function (this: ICustomWorld) {
  const userId = testUser.id;
  const getResponse = await userApiClient.get(`/api/users/${userId}`);
  
  expect(getResponse.status).toBe(404);
  this.logger.info('User deletion validation passed');
});

Then('the response should contain an error message', async function (this: ICustomWorld) {
  expect(apiResponse.data).toBeDefined();
  expect(apiResponse.data.error || apiResponse.data.message).toBeDefined();
  this.logger.info('Error message validation passed');
});

Then('the error message should be {string}', async function (this: ICustomWorld, expectedMessage: string) {
  const actualMessage = apiResponse.data.error || apiResponse.data.message;
  expect(actualMessage).toContain(expectedMessage);
  this.logger.info(`Error message validation passed: ${expectedMessage}`);
});

Then('the response should contain validation errors', async function (this: ICustomWorld) {
  expect(apiResponse.data).toBeDefined();
  expect(apiResponse.data.errors || apiResponse.data.validationErrors).toBeDefined();
  this.logger.info('Validation errors present in response');
});

Then('the errors should specify which fields are invalid', async function (this: ICustomWorld) {
  const errors = apiResponse.data.errors || apiResponse.data.validationErrors;
  expect(Array.isArray(errors) || typeof errors === 'object').toBe(true);
  expect(Object.keys(errors).length).toBeGreaterThan(0);
  this.logger.info('Field-specific validation errors present');
});

Then('the response should contain an authentication error', async function (this: ICustomWorld) {
  expect(apiResponse.data).toBeDefined();
  const message = apiResponse.data.error || apiResponse.data.message;
  expect(message.toLowerCase()).toMatch(/auth|unauthorized|token|credential/);
  this.logger.info('Authentication error validation passed');
});

// Performance Validation Steps
Then('all responses should have status {int}', async function (this: ICustomWorld, expectedStatus: number) {
  expect(apiResponse.successCount).toBe(apiResponse.totalCount);
  this.logger.info(`All ${apiResponse.totalCount} requests succeeded`);
});

Then('the average response time should be less than {int}ms', async function (this: ICustomWorld, maxTime: number) {
  expect(apiResponse.averageResponseTime).toBeLessThan(maxTime);
  this.logger.performance('Average response time validation passed', apiResponse.averageResponseTime, 'ms');
});

Then('no requests should timeout', async function (this: ICustomWorld) {
  const timeoutCount = apiResponse.responses.filter((r: any) => r.status === 0).length;
  expect(timeoutCount).toBe(0);
  this.logger.info('No request timeouts detected');
});

// Schema Validation Steps
Then('the response should match the {string} schema', async function (this: ICustomWorld, schemaName: string) {
  let isValid = false;
  
  switch (schemaName) {
    case 'userList':
      isValid = UserSchema.validateUserList(apiResponse.data);
      break;
    case 'user':
      isValid = UserSchema.validateUser(apiResponse.data);
      break;
    default:
      throw new Error(`Unknown schema: ${schemaName}`);
  }
  
  expect(isValid).toBe(true);
  this.logger.info(`Schema validation passed: ${schemaName}`);
});

// Pagination Steps
Then('the response should contain pagination metadata', async function (this: ICustomWorld) {
  expect(apiResponse.data.pagination).toBeDefined();
  expect(apiResponse.data.pagination.page).toBeDefined();
  expect(apiResponse.data.pagination.limit).toBeDefined();
  expect(apiResponse.data.pagination.total).toBeDefined();
  this.logger.info('Pagination metadata validation passed');
});

Then('the response should contain at most {int} users', async function (this: ICustomWorld, maxUsers: number) {
  expect(apiResponse.data.users.length).toBeLessThanOrEqual(maxUsers);
  this.logger.info(`User count validation passed: ${apiResponse.data.users.length} <= ${maxUsers}`);
});

Then('the pagination should include total count and page info', async function (this: ICustomWorld) {
  const pagination = apiResponse.data.pagination;
  expect(pagination.total).toBeGreaterThanOrEqual(0);
  expect(pagination.page).toBeGreaterThan(0);
  expect(pagination.totalPages).toBeGreaterThan(0);
  this.logger.info('Pagination info validation passed');
});

// Filtering Steps
Then('all returned users should have status {string}', async function (this: ICustomWorld, expectedStatus: string) {
  for (const user of apiResponse.data) {
    expect(user.status).toBe(expectedStatus);
  }
  this.logger.info(`All users have status: ${expectedStatus}`);
});

Then('the response should contain only active users', async function (this: ICustomWorld) {
  for (const user of apiResponse.data) {
    expect(user.status).toBe('active');
  }
  this.logger.info('All returned users are active');
});

// Sorting Steps
Then('the users should be sorted by creation date in descending order', async function (this: ICustomWorld) {
  const users = apiResponse.data;
  
  for (let i = 1; i < users.length; i++) {
    const prevDate = new Date(users[i - 1].createdAt);
    const currDate = new Date(users[i].createdAt);
    expect(prevDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
  }
  
  this.logger.info('Users are sorted by creation date in descending order');
});

// Rate Limiting Steps
Then('some requests should return status {int}', async function (this: ICustomWorld, expectedStatus: number) {
  expect(apiResponse.rateLimitedCount).toBeGreaterThan(0);
  this.logger.info(`${apiResponse.rateLimitedCount} requests were rate limited`);
});

Then('the rate limit headers should be present', async function (this: ICustomWorld) {
  // Check the last response for rate limit headers
  const lastResponse = apiResponse.responses[apiResponse.responses.length - 1];
  const headers = lastResponse.headers;
  
  expect(headers['x-ratelimit-limit'] || headers['ratelimit-limit']).toBeDefined();
  expect(headers['x-ratelimit-remaining'] || headers['ratelimit-remaining']).toBeDefined();
  this.logger.info('Rate limit headers validation passed');
});

Then('the retry-after header should indicate when to retry', async function (this: ICustomWorld) {
  const rateLimitedResponse = apiResponse.responses.find((r: any) => r.status === 429);
  
  if (rateLimitedResponse) {
    expect(rateLimitedResponse.headers['retry-after']).toBeDefined();
    this.logger.info('Retry-after header validation passed');
  }
});







