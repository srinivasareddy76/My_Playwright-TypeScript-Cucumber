











export class UserPayload {
  /**
   * Create a valid user payload for testing
   */
  static createValidUser(overrides?: Partial<any>): any {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 10000);
    
    const defaultUser = {
      username: `testuser_${timestamp}_${randomId}`,
      email: `testuser_${timestamp}_${randomId}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      phone: '+1-555-0123',
      dateOfBirth: '1990-01-01',
      status: 'active',
      role: 'user',
      permissions: ['read', 'write'],
      profile: {
        bio: 'Test user for automation testing',
        website: 'https://example.com',
        location: 'San Francisco, CA',
        timezone: 'America/Los_Angeles'
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
      metadata: {
        source: 'automation_test',
        testRun: timestamp,
        environment: process.env.ENV || 'test'
      }
    };

    return { ...defaultUser, ...overrides };
  }

  /**
   * Create an invalid user payload for negative testing
   */
  static createInvalidUser(): any {
    return {
      username: '', // Invalid: empty username
      email: 'invalid-email', // Invalid: malformed email
      firstName: '', // Invalid: empty first name
      lastName: '', // Invalid: empty last name
      password: '123', // Invalid: too short password
      confirmPassword: '456', // Invalid: passwords don't match
      phone: 'invalid-phone', // Invalid: malformed phone
      dateOfBirth: '2030-01-01', // Invalid: future date
      status: 'invalid_status', // Invalid: unknown status
      role: 'invalid_role', // Invalid: unknown role
      permissions: ['invalid_permission'] // Invalid: unknown permission
    };
  }

  /**
   * Create user payload with missing required fields
   */
  static createIncompleteUser(): any {
    return {
      email: 'incomplete@example.com'
      // Missing username, firstName, lastName, password
    };
  }

  /**
   * Create user payload for update operations
   */
  static createUpdateData(overrides?: Partial<any>): any {
    const timestamp = Date.now();
    
    const defaultUpdate = {
      firstName: 'Updated',
      lastName: 'User',
      phone: '+1-555-9999',
      profile: {
        bio: 'Updated bio for test user',
        website: 'https://updated-example.com',
        location: 'Updated Location'
      },
      preferences: {
        theme: 'dark',
        notifications: {
          email: false,
          sms: true,
          push: false
        }
      },
      metadata: {
        lastUpdated: timestamp,
        updatedBy: 'automation_test'
      }
    };

    return { ...defaultUpdate, ...overrides };
  }

  /**
   * Create admin user payload
   */
  static createAdminUser(overrides?: Partial<any>): any {
    const baseUser = this.createValidUser();
    
    const adminUser = {
      ...baseUser,
      username: `admin_${Date.now()}`,
      email: `admin_${Date.now()}@example.com`,
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'admin'],
      profile: {
        ...baseUser.profile,
        bio: 'Admin user for automation testing'
      }
    };

    return { ...adminUser, ...overrides };
  }

  /**
   * Create readonly user payload
   */
  static createReadonlyUser(overrides?: Partial<any>): any {
    const baseUser = this.createValidUser();
    
    const readonlyUser = {
      ...baseUser,
      username: `readonly_${Date.now()}`,
      email: `readonly_${Date.now()}@example.com`,
      role: 'readonly',
      permissions: ['read'],
      profile: {
        ...baseUser.profile,
        bio: 'Readonly user for automation testing'
      }
    };

    return { ...readonlyUser, ...overrides };
  }

  /**
   * Create bulk users payload
   */
  static createBulkUsers(count: number): any[] {
    const users = [];
    
    for (let i = 0; i < count; i++) {
      users.push(this.createValidUser({
        username: `bulkuser_${Date.now()}_${i}`,
        email: `bulkuser_${Date.now()}_${i}@example.com`
      }));
    }
    
    return users;
  }

  /**
   * Create user with specific status
   */
  static createUserWithStatus(status: 'active' | 'inactive' | 'pending' | 'suspended'): any {
    return this.createValidUser({ status });
  }

  /**
   * Create user with specific role
   */
  static createUserWithRole(role: 'admin' | 'user' | 'readonly' | 'moderator'): any {
    const permissions = this.getPermissionsForRole(role);
    return this.createValidUser({ role, permissions });
  }

  /**
   * Create user profile update payload
   */
  static createProfileUpdate(overrides?: Partial<any>): any {
    const defaultProfile = {
      bio: 'Updated user biography',
      website: 'https://updated-website.com',
      location: 'Updated City, State',
      timezone: 'America/New_York',
      avatar: 'https://example.com/avatar.jpg',
      socialLinks: {
        twitter: '@updateduser',
        linkedin: 'https://linkedin.com/in/updateduser',
        github: 'https://github.com/updateduser'
      }
    };

    return { ...defaultProfile, ...overrides };
  }

  /**
   * Create password reset payload
   */
  static createPasswordReset(newPassword?: string): any {
    return {
      password: newPassword || 'NewPassword123!',
      confirmPassword: newPassword || 'NewPassword123!',
      resetToken: 'mock_reset_token_12345'
    };
  }

  /**
   * Create notification payload
   */
  static createNotification(type: 'email' | 'sms' | 'push', overrides?: Partial<any>): any {
    const defaultNotification = {
      type,
      subject: 'Test Notification',
      message: 'This is a test notification from automation testing',
      priority: 'normal' as const,
      metadata: {
        source: 'automation_test',
        timestamp: Date.now()
      }
    };

    return { ...defaultNotification, ...overrides };
  }

  /**
   * Create search criteria payload
   */
  static createSearchCriteria(overrides?: Partial<any>): any {
    const defaultCriteria = {
      query: 'test',
      status: 'active',
      role: 'user',
      createdAfter: '2023-01-01',
      createdBefore: new Date().toISOString().split('T')[0]
    };

    return { ...defaultCriteria, ...overrides };
  }

  /**
   * Create pagination parameters
   */
  static createPaginationParams(page: number = 1, limit: number = 10): any {
    return {
      page,
      limit,
      offset: (page - 1) * limit
    };
  }

  /**
   * Create sorting parameters
   */
  static createSortParams(sortBy: string = 'createdAt', order: 'asc' | 'desc' = 'desc'): any {
    return {
      sort: sortBy,
      order
    };
  }

  /**
   * Create filter parameters
   */
  static createFilterParams(overrides?: Partial<any>): any {
    const defaultFilters = {
      status: 'active',
      role: 'user',
      verified: true,
      lastLoginAfter: '2023-01-01'
    };

    return { ...defaultFilters, ...overrides };
  }

  /**
   * Get permissions for a specific role
   */
  private static getPermissionsForRole(role: string): string[] {
    const rolePermissions: Record<string, string[]> = {
      admin: ['read', 'write', 'delete', 'admin', 'manage_users', 'manage_roles'],
      moderator: ['read', 'write', 'moderate', 'manage_content'],
      user: ['read', 'write', 'comment'],
      readonly: ['read']
    };

    return rolePermissions[role] || ['read'];
  }

  /**
   * Create user with custom permissions
   */
  static createUserWithPermissions(permissions: string[]): any {
    return this.createValidUser({ permissions });
  }

  /**
   * Create user for specific test scenario
   */
  static createUserForScenario(scenario: string, overrides?: Partial<any>): any {
    const scenarioUsers: Record<string, any> = {
      'login_test': {
        username: 'login_test_user',
        email: 'login.test@example.com',
        password: 'LoginTest123!'
      },
      'permission_test': {
        username: 'permission_test_user',
        email: 'permission.test@example.com',
        permissions: ['read', 'write', 'test_permission']
      },
      'profile_test': {
        username: 'profile_test_user',
        email: 'profile.test@example.com',
        profile: {
          bio: 'Profile test user',
          completeness: 100
        }
      },
      'security_test': {
        username: 'security_test_user',
        email: 'security.test@example.com',
        securitySettings: {
          twoFactorEnabled: true,
          passwordExpiry: 90,
          loginAttempts: 0
        }
      }
    };

    const baseUser = this.createValidUser();
    const scenarioData = scenarioUsers[scenario] || {};
    
    return { ...baseUser, ...scenarioData, ...overrides };
  }

  /**
   * Validate user payload structure
   */
  static validatePayload(payload: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Required fields validation
    const requiredFields = ['username', 'email', 'firstName', 'lastName', 'password'];
    
    for (const field of requiredFields) {
      if (!payload[field] || payload[field].trim() === '') {
        errors.push(`${field} is required`);
      }
    }
    
    // Email format validation
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      errors.push('Invalid email format');
    }
    
    // Password validation
    if (payload.password && payload.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    // Password confirmation validation
    if (payload.password && payload.confirmPassword && payload.password !== payload.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}











