




@api @users @smoke
Feature: User API Management
  As an API consumer
  I want to manage users through the API
  So that I can perform CRUD operations on user data

  Background:
    Given the API is available
    And I have valid API credentials

  @positive @critical
  Scenario: Get all users
    When I send a GET request to "/api/users"
    Then the response status should be 200
    And the response should contain a list of users
    And each user should have required fields
    And the response time should be less than 2000ms

  @positive @critical
  Scenario: Get user by ID
    Given a user exists with ID "123"
    When I send a GET request to "/api/users/123"
    Then the response status should be 200
    And the response should contain user details
    And the user ID should be "123"
    And the response should match the user schema

  @positive
  Scenario: Create a new user
    Given I have valid user data
    When I send a POST request to "/api/users" with user data
    Then the response status should be 201
    And the response should contain the created user
    And the user should have a generated ID
    And the user should be retrievable by ID

  @positive
  Scenario: Update an existing user
    Given a user exists with ID "123"
    And I have updated user data
    When I send a PUT request to "/api/users/123" with updated data
    Then the response status should be 200
    And the response should contain the updated user
    And the user data should be updated in the system

  @positive
  Scenario: Delete a user
    Given a user exists with ID "123"
    When I send a DELETE request to "/api/users/123"
    Then the response status should be 204
    And the user should no longer exist in the system

  @negative
  Scenario: Get non-existent user
    When I send a GET request to "/api/users/999999"
    Then the response status should be 404
    And the response should contain an error message
    And the error message should be "User not found"

  @negative
  Scenario: Create user with invalid data
    Given I have invalid user data
    When I send a POST request to "/api/users" with invalid data
    Then the response status should be 400
    And the response should contain validation errors
    And the errors should specify which fields are invalid

  @negative @security
  Scenario: Access API without authentication
    Given I have no API credentials
    When I send a GET request to "/api/users"
    Then the response status should be 401
    And the response should contain an authentication error

  @negative @security
  Scenario: Access API with invalid token
    Given I have an invalid API token
    When I send a GET request to "/api/users"
    Then the response status should be 401
    And the response should contain an authentication error

  @performance
  Scenario: API performance under load
    When I send 100 concurrent GET requests to "/api/users"
    Then all responses should have status 200
    And the average response time should be less than 1000ms
    And no requests should timeout

  @schema
  Scenario Outline: User API schema validation
    When I send a GET request to "<endpoint>"
    Then the response status should be <status>
    And the response should match the "<schema>" schema

    Examples:
      | endpoint      | status | schema    |
      | /api/users    | 200    | userList  |
      | /api/users/1  | 200    | user      |

  @pagination
  Scenario: Users API pagination
    When I send a GET request to "/api/users?page=1&limit=10"
    Then the response status should be 200
    And the response should contain pagination metadata
    And the response should contain at most 10 users
    And the pagination should include total count and page info

  @filtering
  Scenario: Filter users by status
    When I send a GET request to "/api/users?status=active"
    Then the response status should be 200
    And all returned users should have status "active"
    And the response should contain only active users

  @sorting
  Scenario: Sort users by creation date
    When I send a GET request to "/api/users?sort=createdAt&order=desc"
    Then the response status should be 200
    And the users should be sorted by creation date in descending order

  @rate-limiting
  Scenario: API rate limiting
    When I send 1000 requests to "/api/users" within 1 minute
    Then some requests should return status 429
    And the rate limit headers should be present
    And the retry-after header should indicate when to retry




