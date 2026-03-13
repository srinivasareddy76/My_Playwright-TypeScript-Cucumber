














export class UserSchema {
  /**
   * User schema definition
   */
  private static readonly userSchema = {
    type: 'object',
    required: ['id', 'username', 'email', 'firstName', 'lastName', 'status', 'createdAt'],
    properties: {
      id: {
        type: 'string',
        minLength: 1
      },
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        pattern: '^[a-zA-Z0-9_]+$'
      },
      email: {
        type: 'string',
        format: 'email'
      },
      firstName: {
        type: 'string',
        minLength: 1,
        maxLength: 50
      },
      lastName: {
        type: 'string',
        minLength: 1,
        maxLength: 50
      },
      phone: {
        type: 'string',
        pattern: '^\\+?[1-9]\\d{1,14}$'
      },
      dateOfBirth: {
        type: 'string',
        format: 'date'
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'pending', 'suspended']
      },
      role: {
        type: 'string',
        enum: ['admin', 'user', 'readonly', 'moderator']
      },
      permissions: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      profile: {
        type: 'object',
        properties: {
          bio: { type: 'string', maxLength: 500 },
          website: { type: 'string', format: 'uri' },
          location: { type: 'string', maxLength: 100 },
          timezone: { type: 'string' },
          avatar: { type: 'string', format: 'uri' }
        }
      },
      preferences: {
        type: 'object',
        properties: {
          language: { type: 'string', minLength: 2, maxLength: 5 },
          theme: { type: 'string', enum: ['light', 'dark'] },
          notifications: {
            type: 'object',
            properties: {
              email: { type: 'boolean' },
              sms: { type: 'boolean' },
              push: { type: 'boolean' }
            }
          }
        }
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time'
      },
      lastLoginAt: {
        type: 'string',
        format: 'date-time'
      }
    }
  };

  /**
   * User list schema definition
   */
  private static readonly userListSchema = {
    type: 'object',
    required: ['users', 'pagination'],
    properties: {
      users: {
        type: 'array',
        items: this.userSchema
      },
      pagination: {
        type: 'object',
        required: ['page', 'limit', 'total', 'totalPages'],
        properties: {
          page: { type: 'number', minimum: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100 },
          total: { type: 'number', minimum: 0 },
          totalPages: { type: 'number', minimum: 0 },
          hasNext: { type: 'boolean' },
          hasPrev: { type: 'boolean' }
        }
      }
    }
  };

  /**
   * Error response schema definition
   */
  private static readonly errorSchema = {
    type: 'object',
    required: ['error'],
    properties: {
      error: { type: 'string' },
      message: { type: 'string' },
      code: { type: 'string' },
      details: { type: 'object' },
      timestamp: { type: 'string', format: 'date-time' }
    }
  };

  /**
   * Validation error schema definition
   */
  private static readonly validationErrorSchema = {
    type: 'object',
    required: ['errors'],
    properties: {
      errors: {
        type: 'array',
        items: {
          type: 'object',
          required: ['field', 'message'],
          properties: {
            field: { type: 'string' },
            message: { type: 'string' },
            code: { type: 'string' },
            value: {}
          }
        }
      },
      message: { type: 'string' }
    }
  };

  /**
   * Validate a single user object
   */
  static validateUser(user: any): boolean {
    try {
      return this.validateAgainstSchema(user, this.userSchema);
    } catch (error) {
      console.error('User validation error:', error);
      return false;
    }
  }

  /**
   * Validate user list response
   */
  static validateUserList(response: any): boolean {
    try {
      return this.validateAgainstSchema(response, this.userListSchema);
    } catch (error) {
      console.error('User list validation error:', error);
      return false;
    }
  }

  /**
   * Validate error response
   */
  static validateError(response: any): boolean {
    try {
      return this.validateAgainstSchema(response, this.errorSchema);
    } catch (error) {
      console.error('Error response validation error:', error);
      return false;
    }
  }

  /**
   * Validate validation error response
   */
  static validateValidationError(response: any): boolean {
    try {
      return this.validateAgainstSchema(response, this.validationErrorSchema);
    } catch (error) {
      console.error('Validation error response validation error:', error);
      return false;
    }
  }

  /**
   * Get detailed validation results for a user
   */
  static validateUserDetailed(user: any): {
    isValid: boolean;
    errors: Array<{ field: string; message: string; value?: any }>;
  } {
    const errors: Array<{ field: string; message: string; value?: any }> = [];

    // Required fields validation
    const requiredFields = this.userSchema.required;
    for (const field of requiredFields) {
      if (!user.hasOwnProperty(field) || user[field] === null || user[field] === undefined) {
        errors.push({
          field,
          message: `${field} is required`,
          value: user[field]
        });
      }
    }

    // Type and format validation
    if (user.id && typeof user.id !== 'string') {
      errors.push({
        field: 'id',
        message: 'id must be a string',
        value: user.id
      });
    }

    if (user.username) {
      if (typeof user.username !== 'string') {
        errors.push({
          field: 'username',
          message: 'username must be a string',
          value: user.username
        });
      } else if (user.username.length < 3 || user.username.length > 50) {
        errors.push({
          field: 'username',
          message: 'username must be between 3 and 50 characters',
          value: user.username
        });
      } else if (!/^[a-zA-Z0-9_]+$/.test(user.username)) {
        errors.push({
          field: 'username',
          message: 'username can only contain letters, numbers, and underscores',
          value: user.username
        });
      }
    }

    if (user.email) {
      if (typeof user.email !== 'string') {
        errors.push({
          field: 'email',
          message: 'email must be a string',
          value: user.email
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        errors.push({
          field: 'email',
          message: 'email must be a valid email address',
          value: user.email
        });
      }
    }

    if (user.status && !['active', 'inactive', 'pending', 'suspended'].includes(user.status)) {
      errors.push({
        field: 'status',
        message: 'status must be one of: active, inactive, pending, suspended',
        value: user.status
      });
    }

    if (user.role && !['admin', 'user', 'readonly', 'moderator'].includes(user.role)) {
      errors.push({
        field: 'role',
        message: 'role must be one of: admin, user, readonly, moderator',
        value: user.role
      });
    }

    if (user.permissions && !Array.isArray(user.permissions)) {
      errors.push({
        field: 'permissions',
        message: 'permissions must be an array',
        value: user.permissions
      });
    }

    if (user.createdAt && !this.isValidDateTime(user.createdAt)) {
      errors.push({
        field: 'createdAt',
        message: 'createdAt must be a valid ISO 8601 date-time string',
        value: user.createdAt
      });
    }

    if (user.updatedAt && !this.isValidDateTime(user.updatedAt)) {
      errors.push({
        field: 'updatedAt',
        message: 'updatedAt must be a valid ISO 8601 date-time string',
        value: user.updatedAt
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate user creation payload
   */
  static validateUserCreation(payload: any): {
    isValid: boolean;
    errors: Array<{ field: string; message: string; value?: any }>;
  } {
    const errors: Array<{ field: string; message: string; value?: any }> = [];

    // Required fields for creation
    const requiredFields = ['username', 'email', 'firstName', 'lastName', 'password'];
    for (const field of requiredFields) {
      if (!payload.hasOwnProperty(field) || payload[field] === null || payload[field] === undefined || payload[field] === '') {
        errors.push({
          field,
          message: `${field} is required for user creation`,
          value: payload[field]
        });
      }
    }

    // Password validation
    if (payload.password) {
      if (typeof payload.password !== 'string') {
        errors.push({
          field: 'password',
          message: 'password must be a string',
          value: typeof payload.password
        });
      } else if (payload.password.length < 8) {
        errors.push({
          field: 'password',
          message: 'password must be at least 8 characters long',
          value: payload.password.length
        });
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(payload.password)) {
        errors.push({
          field: 'password',
          message: 'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
          value: payload.password
        });
      }
    }

    // Password confirmation validation
    if (payload.confirmPassword && payload.password !== payload.confirmPassword) {
      errors.push({
        field: 'confirmPassword',
        message: 'password and confirmPassword must match',
        value: 'passwords do not match'
      });
    }

    // Use existing user validation for other fields
    const userValidation = this.validateUserDetailed(payload);
    errors.push(...userValidation.errors);

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate user update payload
   */
  static validateUserUpdate(payload: any): {
    isValid: boolean;
    errors: Array<{ field: string; message: string; value?: any }>;
  } {
    const errors: Array<{ field: string; message: string; value?: any }> = [];

    // For updates, no fields are required, but if present, they must be valid
    const validatableFields = ['username', 'email', 'firstName', 'lastName', 'status', 'role', 'permissions'];
    
    for (const field of validatableFields) {
      if (payload.hasOwnProperty(field)) {
        const fieldValidation = this.validateUserDetailed({ [field]: payload[field] });
        const fieldErrors = fieldValidation.errors.filter(error => error.field === field);
        errors.push(...fieldErrors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate pagination parameters
   */
  static validatePagination(params: any): {
    isValid: boolean;
    errors: Array<{ field: string; message: string; value?: any }>;
  } {
    const errors: Array<{ field: string; message: string; value?: any }> = [];

    if (params.page !== undefined) {
      const page = parseInt(params.page);
      if (isNaN(page) || page < 1) {
        errors.push({
          field: 'page',
          message: 'page must be a positive integer',
          value: params.page
        });
      }
    }

    if (params.limit !== undefined) {
      const limit = parseInt(params.limit);
      if (isNaN(limit) || limit < 1 || limit > 100) {
        errors.push({
          field: 'limit',
          message: 'limit must be an integer between 1 and 100',
          value: params.limit
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate search parameters
   */
  static validateSearchParams(params: any): {
    isValid: boolean;
    errors: Array<{ field: string; message: string; value?: any }>;
  } {
    const errors: Array<{ field: string; message: string; value?: any }> = [];

    if (params.status && !['active', 'inactive', 'pending', 'suspended'].includes(params.status)) {
      errors.push({
        field: 'status',
        message: 'status must be one of: active, inactive, pending, suspended',
        value: params.status
      });
    }

    if (params.role && !['admin', 'user', 'readonly', 'moderator'].includes(params.role)) {
      errors.push({
        field: 'role',
        message: 'role must be one of: admin, user, readonly, moderator',
        value: params.role
      });
    }

    if (params.createdAfter && !this.isValidDate(params.createdAfter)) {
      errors.push({
        field: 'createdAfter',
        message: 'createdAfter must be a valid date string (YYYY-MM-DD)',
        value: params.createdAfter
      });
    }

    if (params.createdBefore && !this.isValidDate(params.createdBefore)) {
      errors.push({
        field: 'createdBefore',
        message: 'createdBefore must be a valid date string (YYYY-MM-DD)',
        value: params.createdBefore
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Basic schema validation against a schema object
   */
  private static validateAgainstSchema(data: any, schema: any): boolean {
    // This is a simplified validation. In a real implementation,
    // you would use a proper JSON schema validator like Ajv
    
    if (schema.required) {
      for (const field of schema.required) {
        if (!data.hasOwnProperty(field)) {
          return false;
        }
      }
    }

    if (schema.properties) {
      for (const [key, value] of Object.entries(schema.properties)) {
        if (data.hasOwnProperty(key)) {
          const fieldSchema = value as any;
          if (fieldSchema.type && typeof data[key] !== fieldSchema.type) {
            // Special handling for arrays
            if (fieldSchema.type === 'array' && !Array.isArray(data[key])) {
              return false;
            }
            // Special handling for objects
            if (fieldSchema.type === 'object' && (typeof data[key] !== 'object' || Array.isArray(data[key]))) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  /**
   * Check if a string is a valid ISO 8601 date-time
   */
  private static isValidDateTime(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && dateString.includes('T');
  }

  /**
   * Check if a string is a valid date (YYYY-MM-DD)
   */
  private static isValidDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Get schema for a specific entity type
   */
  static getSchema(entityType: 'user' | 'userList' | 'error' | 'validationError'): any {
    switch (entityType) {
      case 'user':
        return this.userSchema;
      case 'userList':
        return this.userListSchema;
      case 'error':
        return this.errorSchema;
      case 'validationError':
        return this.validationErrorSchema;
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  }

  /**
   * Generate example data that matches the schema
   */
  static generateExampleUser(): any {
    return {
      id: 'user_12345',
      username: 'example_user',
      email: 'example@test.com',
      firstName: 'Example',
      lastName: 'User',
      phone: '+1-555-0123',
      dateOfBirth: '1990-01-01',
      status: 'active',
      role: 'user',
      permissions: ['read', 'write'],
      profile: {
        bio: 'Example user biography',
        website: 'https://example.com',
        location: 'San Francisco, CA',
        timezone: 'America/Los_Angeles',
        avatar: 'https://example.com/avatar.jpg'
      },
      preferences: {
        language: 'en',
        theme: 'light',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
  }
}














