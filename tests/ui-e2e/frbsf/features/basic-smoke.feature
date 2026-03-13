@smoke
Feature: Basic Smoke Test
  As a user
  I want to verify the basic functionality works
  So that I can confirm the test framework is operational

  @smoke @basic
  Scenario: Framework smoke test
    Given the framework is working
    Then the test should pass
