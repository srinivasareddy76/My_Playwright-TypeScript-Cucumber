









@smoke @critical @homepage
Feature: FRBSF Homepage Functionality
  As a visitor to the Federal Reserve Bank of San Francisco website
  I want to access and navigate the homepage effectively
  So that I can find information about the Federal Reserve and its services

  Background:
    Given I am on the FRBSF homepage
    And the page has loaded completely

  @desktop @performance
  Scenario: Homepage loads successfully with all key elements
    When I verify the page title contains "Federal Reserve"
    Then I should see the FRBSF logo
    And I should see the main navigation menu
    And I should see the hero section
    And the page should load within 5 seconds

  @navigation @dropdown
  Scenario: Main navigation menu displays correctly with dropdown functionality
    When I hover over the "About" menu item
    Then I should see the About dropdown menu
    When I hover over the "Research" menu item
    Then I should see the Research dropdown menu
    When I hover over the "News" menu item
    Then I should see the News dropdown menu

  @search @functionality
  Scenario: Search functionality works correctly
    When I click on the search button
    Then I should see the search input field
    When I enter "economic policy" in the search field
    And I press Enter
    Then I should be redirected to the search results page
    And I should see search results for "economic policy"

  @branding @validation
  Scenario: Federal Reserve branding is properly displayed
    Then I should see the Federal Reserve Bank of San Francisco logo
    And the page title should contain "Federal Reserve"
    And I should see Federal Reserve branding elements
    And the logo should be clickable and link to the homepage

  @content @sections
  Scenario: Key content sections are visible and accessible
    Then I should see the Research & Insights section
    And I should see the News & Media section
    And I should see the Economic Data section
    When I scroll to the District Information section
    Then I should see district-specific information
    And I should see the interactive district map

  @footer @links
  Scenario: Footer contains required links and information
    When I scroll to the bottom of the page
    Then I should see the footer section
    And I should see footer navigation links
    And I should see contact information
    And I should see social media links
    And all footer links should be functional

  @social-media @external-links
  Scenario: Social media links are present and functional
    When I scroll to the social media section
    Then I should see LinkedIn link
    And I should see Facebook link
    And I should see Twitter link
    When I click on the LinkedIn link
    Then it should open in a new tab or window

  @responsive @mobile
  Scenario: Homepage displays correctly on mobile devices
    Given I am using a mobile viewport
    When I reload the page
    Then the page should be responsive
    And the navigation should be mobile-friendly
    And all content should be accessible
    And the page should load within 5 seconds

  @responsive @tablet
  Scenario: Homepage displays correctly on tablet devices
    Given I am using a tablet viewport
    When I reload the page
    Then the page should be responsive
    And the navigation should work properly
    And all content should be properly formatted
    And images should scale appropriately

  @accessibility @compliance
  Scenario: Homepage meets accessibility standards
    Then the page should have proper heading structure
    And images should have alt text
    And the page should be keyboard navigable
    And there should be skip navigation links
    And color contrast should meet WCAG standards

  @performance @load-time
  Scenario Outline: Homepage performance across different viewports
    Given I am using a <viewport> viewport
    When I measure the page load time
    Then the page should load within <threshold> seconds
    And all critical resources should be loaded
    And the page should be interactive

    Examples:
      | viewport | threshold |
      | desktop  | 5         |
      | tablet   | 6         |
      | mobile   | 7         |

  @district @information
  Scenario: District-specific information is displayed correctly
    When I navigate to the district information section
    Then I should see information about the 12th Federal Reserve District
    And I should see the states covered by the district
    And I should see district contact information
    And I should see the district map
    And the map should be interactive

  @quick-links @navigation
  Scenario: Quick links and shortcuts work properly
    When I look for quick access links
    Then I should see links to popular sections
    And I should see shortcuts to key resources
    When I click on a quick link
    Then I should be taken to the appropriate page
    And the page should load successfully










