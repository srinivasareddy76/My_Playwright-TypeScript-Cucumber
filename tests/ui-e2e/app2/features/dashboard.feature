@ui @app2 @dashboard
Feature: Dashboard Functionality
  As a user
  I want to access the dashboard
  So that I can view my account information

  Background:
    Given I am logged into app2

  @smoke @critical
  Scenario: View dashboard overview
    Given I am on the dashboard page
    When I view the dashboard overview
    Then I should see my account summary
    And I should see recent activity

  @regression
  Scenario: Navigate to different dashboard sections
    Given I am on the dashboard page
    When I click on the "Profile" section
    Then I should be redirected to the profile page
    And the profile information should be displayed

  @responsive @mobile
  Scenario: Mobile dashboard view
    Given I am using a mobile viewport
    And I am on the dashboard page
    When I view the dashboard
    Then the mobile layout should be displayed
    And all elements should be accessible

  @performance
  Scenario: Dashboard load performance
    Given I am on the dashboard page
    When I measure the page load time
    Then the dashboard should load within 3 seconds
