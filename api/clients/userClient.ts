









import { BaseAPI, ApiResponse } from '../../core/base/baseAPI';
import { Logger } from '../../core/utilities/logger';

export class UserApiClient extends BaseAPI {
  constructor(logger?: Logger) {
    super(logger);
  }

  /**
   * Get all users with optional query parameters
   */
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<ApiResponse> {
    const queryParams: Record<string, string> = {};
    
    if (params) {
      if (params.page) queryParams.page = params.page.toString();
      if (params.limit) queryParams.limit = params.limit.toString();
      if (params.status) queryParams.status = params.status;
      if (params.sort) queryParams.sort = params.sort;
      if (params.order) queryParams.order = params.order;
    }

    return this.get('/api/users', { params: queryParams });
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<ApiResponse> {
    return this.get(`/api/users/${userId}`);
  }

  /**
   * Create a new user
   */
  async createUser(userData: any): Promise<ApiResponse> {
    return this.post('/api/users', userData);
  }

  /**
   * Update an existing user
   */
  async updateUser(userId: string, userData: any): Promise<ApiResponse> {
    return this.put(`/api/users/${userId}`, userData);
  }

  /**
   * Partially update a user
   */
  async patchUser(userId: string, userData: any): Promise<ApiResponse> {
    return this.patch(`/api/users/${userId}`, userData);
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<ApiResponse> {
    return this.delete(`/api/users/${userId}`);
  }

  /**
   * Search users by criteria
   */
  async searchUsers(searchCriteria: {
    query?: string;
    email?: string;
    username?: string;
    status?: string;
    role?: string;
    createdAfter?: string;
    createdBefore?: string;
  }): Promise<ApiResponse> {
    const params: Record<string, string> = {};
    
    Object.entries(searchCriteria).forEach(([key, value]) => {
      if (value) {
        params[key] = value.toString();
      }
    });

    return this.get('/api/users/search', { params });
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<ApiResponse> {
    return this.get(`/api/users/${userId}/profile`);
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, profileData: any): Promise<ApiResponse> {
    return this.put(`/api/users/${userId}/profile`, profileData);
  }

  /**
   * Get user permissions
   */
  async getUserPermissions(userId: string): Promise<ApiResponse> {
    return this.get(`/api/users/${userId}/permissions`);
  }

  /**
   * Update user permissions
   */
  async updateUserPermissions(userId: string, permissions: string[]): Promise<ApiResponse> {
    return this.put(`/api/users/${userId}/permissions`, { permissions });
  }

  /**
   * Activate user account
   */
  async activateUser(userId: string): Promise<ApiResponse> {
    return this.post(`/api/users/${userId}/activate`);
  }

  /**
   * Deactivate user account
   */
  async deactivateUser(userId: string): Promise<ApiResponse> {
    return this.post(`/api/users/${userId}/deactivate`);
  }

  /**
   * Reset user password
   */
  async resetUserPassword(userId: string, newPassword?: string): Promise<ApiResponse> {
    const data = newPassword ? { password: newPassword } : {};
    return this.post(`/api/users/${userId}/reset-password`, data);
  }

  /**
   * Get user activity log
   */
  async getUserActivity(userId: string, params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse> {
    const queryParams: Record<string, string> = {};
    
    if (params) {
      if (params.startDate) queryParams.startDate = params.startDate;
      if (params.endDate) queryParams.endDate = params.endDate;
      if (params.limit) queryParams.limit = params.limit.toString();
      if (params.offset) queryParams.offset = params.offset.toString();
    }

    return this.get(`/api/users/${userId}/activity`, { params: queryParams });
  }

  /**
   * Bulk create users
   */
  async bulkCreateUsers(usersData: any[]): Promise<ApiResponse> {
    return this.post('/api/users/bulk', { users: usersData });
  }

  /**
   * Bulk update users
   */
  async bulkUpdateUsers(updates: Array<{ id: string; data: any }>): Promise<ApiResponse> {
    return this.put('/api/users/bulk', { updates });
  }

  /**
   * Bulk delete users
   */
  async bulkDeleteUsers(userIds: string[]): Promise<ApiResponse> {
    return this.delete('/api/users/bulk', { data: { userIds } });
  }

  /**
   * Export users data
   */
  async exportUsers(format: 'csv' | 'json' | 'xlsx' = 'json', filters?: any): Promise<ApiResponse> {
    const params: Record<string, string> = { format };
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params[key] = value.toString();
        }
      });
    }

    return this.get('/api/users/export', { params });
  }

  /**
   * Import users data
   */
  async importUsers(filePath: string, format: 'csv' | 'json' | 'xlsx' = 'json'): Promise<ApiResponse> {
    return this.uploadFile('/api/users/import', filePath, 'file', { format });
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(params?: {
    groupBy?: 'status' | 'role' | 'createdDate';
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse> {
    const queryParams: Record<string, string> = {};
    
    if (params) {
      if (params.groupBy) queryParams.groupBy = params.groupBy;
      if (params.startDate) queryParams.startDate = params.startDate;
      if (params.endDate) queryParams.endDate = params.endDate;
    }

    return this.get('/api/users/statistics', { params: queryParams });
  }

  /**
   * Validate user data
   */
  async validateUserData(userData: any): Promise<ApiResponse> {
    return this.post('/api/users/validate', userData);
  }

  /**
   * Check if username is available
   */
  async checkUsernameAvailability(username: string): Promise<ApiResponse> {
    return this.get(`/api/users/check-username/${username}`);
  }

  /**
   * Check if email is available
   */
  async checkEmailAvailability(email: string): Promise<ApiResponse> {
    return this.get(`/api/users/check-email/${encodeURIComponent(email)}`);
  }

  /**
   * Get user roles
   */
  async getUserRoles(): Promise<ApiResponse> {
    return this.get('/api/users/roles');
  }

  /**
   * Assign role to user
   */
  async assignUserRole(userId: string, roleId: string): Promise<ApiResponse> {
    return this.post(`/api/users/${userId}/roles`, { roleId });
  }

  /**
   * Remove role from user
   */
  async removeUserRole(userId: string, roleId: string): Promise<ApiResponse> {
    return this.delete(`/api/users/${userId}/roles/${roleId}`);
  }

  /**
   * Get user sessions
   */
  async getUserSessions(userId: string): Promise<ApiResponse> {
    return this.get(`/api/users/${userId}/sessions`);
  }

  /**
   * Terminate user session
   */
  async terminateUserSession(userId: string, sessionId: string): Promise<ApiResponse> {
    return this.delete(`/api/users/${userId}/sessions/${sessionId}`);
  }

  /**
   * Terminate all user sessions
   */
  async terminateAllUserSessions(userId: string): Promise<ApiResponse> {
    return this.delete(`/api/users/${userId}/sessions`);
  }

  /**
   * Send user notification
   */
  async sendUserNotification(userId: string, notification: {
    type: 'email' | 'sms' | 'push';
    subject?: string;
    message: string;
    priority?: 'low' | 'normal' | 'high';
  }): Promise<ApiResponse> {
    return this.post(`/api/users/${userId}/notifications`, notification);
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, params?: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse> {
    const queryParams: Record<string, string> = {};
    
    if (params) {
      if (params.unreadOnly) queryParams.unreadOnly = params.unreadOnly.toString();
      if (params.limit) queryParams.limit = params.limit.toString();
      if (params.offset) queryParams.offset = params.offset.toString();
    }

    return this.get(`/api/users/${userId}/notifications`, { params: queryParams });
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(userId: string, notificationId: string): Promise<ApiResponse> {
    return this.put(`/api/users/${userId}/notifications/${notificationId}/read`);
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<ApiResponse> {
    return this.get('/health');
  }

  /**
   * API version info
   */
  async getApiVersion(): Promise<ApiResponse> {
    return this.get('/api/version');
  }

  /**
   * Get API documentation
   */
  async getApiDocumentation(): Promise<ApiResponse> {
    return this.get('/api/docs');
  }
}









