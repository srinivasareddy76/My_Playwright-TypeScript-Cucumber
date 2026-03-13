

@ui @login @smoke
Feature: User Login Functionality
  As a user
  I want to be able to log into the application
  So that I can access my account and use the system

  Background:
    Given I am on the login page
    And the login form is displayed

  @positive @critical
  Scenario: Successful login with valid credentials
    When I enter valid username "test_user"
    And I enter valid password "TestPassword123!"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see a welcome message
    And the user menu should be visible

  @negative
  Scenario: Login fails with invalid username
    When I enter invalid username "invalid_user"
    And I enter valid password "TestPassword123!"
    And I click the login button
    Then I should see an error message "Invalid username or password"
    And I should remain on the login page

  @negative
  Scenario: Login fails with invalid password
    When I enter valid username "test_user"
    And I enter invalid password "wrong_password"
    And I click the login button
    Then I should see an error message "Invalid username or password"
    And I should remain on the login page

  @negative
  Scenario: Login fails with empty credentials
    When I leave the username field empty
    And I leave the password field empty
    And I click the login button
    Then I should see validation errors
    And the username field should show "Username is required"
    And the password field should show "Password is required"

  @security
  Scenario: Account lockout after multiple failed attempts
    When I enter valid username "test_user"
    And I enter invalid password "wrong_password"
    And I click the login button 5 times
    Then I should see an error message "Account has been locked due to multiple failed login attempts"
    And the login form should be disabled

  @accessibility
  Scenario: Login form is accessible
    Then the login form should have proper labels
    And the form should be keyboard navigable
    And the form should have appropriate ARIA attributes
    And the error messages should be announced to screen readers

  @responsive @mobile
  Scenario: Login works on mobile devices
    Given I am using a mobile viewport
    When I enter valid username "test_user"
    And I enter valid password "TestPassword123!"
    And I click the login button
    Then I should be redirected to the dashboard
    And the mobile navigation should be visible

