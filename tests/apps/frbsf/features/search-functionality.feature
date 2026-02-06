












@smoke @search @functionality
Feature: FRBSF Search Functionality
  As a visitor to the FRBSF website
  I want to search for information effectively
  So that I can quickly find relevant content and research

  Background:
    Given I am on the FRBSF homepage
    And the search functionality is available

  @basic-search @validation
  Scenario: Basic search functionality works correctly
    When I perform a search for "monetary policy"
    Then I should be on the search results page
    And I should see search results for "monetary policy"
    And the search query should be displayed
    And I should see the number of results found

  @search-results @content
  Scenario: Search results display comprehensive information
    When I search for "economic research"
    Then I should see a list of search results
    And each result should have a title
    And each result should have a description or summary
    And each result should have a publication date
    And each result should have a clickable link

  @search-filters @refinement
  Scenario: Search results can be filtered and refined
    Given I have performed a search for "inflation"
    When I am on the search results page
    Then I should see filter options
    And I should be able to filter by date
    And I should be able to filter by content type
    And I should be able to sort results
    When I apply a date filter
    Then the results should be updated accordingly

  @search-pagination @navigation
  Scenario: Search results pagination works correctly
    Given I have searched for a term with many results
    When I am on the search results page
    And there are more than 10 results
    Then I should see pagination controls
    And I should see page numbers
    When I click on the next page
    Then I should see the next set of results
    And the page number should be updated

  @search-performance @speed
  Scenario: Search performs within acceptable time limits
    When I perform a search for "federal reserve policy"
    Then the search results should load within 3 seconds
    And the page should be fully interactive
    And all search result elements should be visible

  @empty-search @validation
  Scenario: Empty search is handled appropriately
    When I perform an empty search
    Then I should see an appropriate message
    Or I should remain on the current page
    And no error should occur

  @no-results @handling
  Scenario: No search results scenario is handled gracefully
    When I search for "xyzabc123nonexistentterm"
    Then I should see a "no results found" message
    And I should see suggestions for improving my search
    And I should be able to perform a new search

  @search-suggestions @autocomplete
  Scenario: Search provides helpful suggestions
    When I start typing in the search field
    Then I should see search suggestions or autocomplete
    When I click on a suggestion
    Then the search should be performed with that term
    And I should see relevant results

  @advanced-search @features
  Scenario: Advanced search features work correctly
    Given I am on the search page
    When I look for advanced search options
    Then I should be able to search within specific sections
    And I should be able to use search operators
    And I should be able to search by author or publication type

  @search-within-results @refinement
  Scenario: Search within results functionality
    Given I have search results for "economic outlook"
    When I use the search within results feature
    And I enter additional terms "2024"
    Then the results should be further refined
    And I should see fewer, more specific results

  @search-accessibility @compliance
  Scenario: Search functionality is accessible
    When I navigate to the search using keyboard only
    Then I should be able to access the search field
    And I should be able to perform a search using keyboard
    And search results should be accessible via screen reader
    And the search interface should meet accessibility standards

  @mobile-search @responsive
  Scenario: Search works correctly on mobile devices
    Given I am using a mobile viewport
    When I access the search functionality
    Then the search interface should be mobile-friendly
    And I should be able to type in the search field
    And search results should display properly on mobile
    And pagination should work on mobile devices

  @search-history @user-experience
  Scenario: Search maintains user context appropriately
    When I perform multiple searches in sequence
    Then I should be able to navigate back to previous results
    And the browser back button should work correctly
    And my search terms should be preserved appropriately

  @search-integration @cross-platform
  Scenario Outline: Search works across different content types
    When I search for content in "<content_type>"
    Then I should find relevant "<content_type>" results
    And the results should be properly categorized
    And I should be able to access the full content

    Examples:
      | content_type     |
      | research papers  |
      | economic letters |
      | press releases   |
      | speeches         |
      | policy briefs    |

  @search-export @functionality
  Scenario: Search results can be shared or exported
    Given I have search results for "banking supervision"
    When I look for sharing options
    Then I should be able to share the search results URL
    And the shared URL should reproduce the same results
    And I should be able to bookmark the search

  @search-analytics @tracking
  Scenario: Search provides useful analytics and insights
    When I perform various searches
    Then popular search terms should be highlighted
    And I should see related search suggestions
    And trending topics should be visible
    And search should help me discover related content













