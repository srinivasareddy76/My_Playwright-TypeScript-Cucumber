
















@smoke @research @content
Feature: FRBSF Research & Insights Section
  As a researcher, economist, or policy maker
  I want to access comprehensive research and insights from the FRBSF
  So that I can stay informed about economic trends and Federal Reserve research

  Background:
    Given I am on the FRBSF website
    And I navigate to the Research & Insights section

  @research-navigation @accessibility
  Scenario: Research section is accessible and well-organized
    Then I should see the Research & Insights page title
    And I should see navigation to different research categories
    And I should see featured research prominently displayed
    And the page should load within 5 seconds

  @working-papers @publications
  Scenario: Working Papers section contains comprehensive research
    When I navigate to the Working Papers section
    Then I should see a list of working papers
    And each paper should have a title and author
    And each paper should have a publication date
    And each paper should have an abstract or summary
    And I should be able to download PDF versions

  @economic-letters @publications
  Scenario: Economic Letters provide accessible research insights
    When I navigate to the Economic Letters section
    Then I should see recent economic letters
    And each letter should have a clear title
    And each letter should have author information
    And the content should be accessible to general audiences
    And I should be able to read the full text online

  @research-filters @functionality
  Scenario: Research content can be filtered and sorted effectively
    Given I am viewing research publications
    When I use the filter options
    Then I should be able to filter by publication type
    And I should be able to filter by topic or subject
    And I should be able to filter by author
    And I should be able to filter by publication date
    And I should be able to sort by relevance or date

  @research-search @discovery
  Scenario: Research-specific search helps find relevant content
    When I use the research search functionality
    And I search for "inflation expectations"
    Then I should see research specifically related to inflation expectations
    And the results should include various publication types
    And I should be able to refine my search further
    And search results should be ranked by relevance

  @featured-research @prominence
  Scenario: Featured research is prominently displayed and current
    Then I should see featured research on the main research page
    And featured research should be recent and relevant
    And I should be able to access featured research easily
    And featured research should represent diverse topics
    And it should link to the full research content

  @research-authors @expertise
  Scenario: Research authors and their expertise are clearly presented
    When I view research publications
    Then I should see author names and affiliations
    And I should be able to view author profiles or bios
    And I should be able to find other works by the same author
    And author contact information should be available when appropriate

  @research-citations @academic
  Scenario: Research includes proper citation information
    When I view a research publication
    Then I should see proper citation formatting
    And I should be able to copy citation information
    And citation should include all necessary academic details
    And different citation formats should be available

  @research-data @supporting-materials
  Scenario: Research includes supporting data and materials
    Given I am viewing a research publication with data
    When I look for supporting materials
    Then I should find links to datasets when available
    And I should see charts and visualizations
    And data should be presented in accessible formats
    And I should be able to download data files when permitted

  @research-categories @organization
  Scenario Outline: Different research categories are well-organized
    When I navigate to the "<category>" section
    Then I should see publications specific to "<category>"
    And the content should be relevant to the category
    And I should be able to browse chronologically
    And I should see the most recent publications first

    Examples:
      | category          |
      | Monetary Policy   |
      | Banking           |
      | Financial Markets |
      | Economic Outlook  |
      | Regional Economy  |

  @research-newsletter @subscription
  Scenario: Research newsletter subscription is available
    When I look for newsletter subscription options
    Then I should find a research newsletter signup
    And I should be able to enter my email address
    And I should receive confirmation of subscription
    And I should be able to choose subscription preferences

  @research-sharing @social
  Scenario: Research can be shared through various channels
    Given I am viewing a research publication
    When I look for sharing options
    Then I should be able to share via social media
    And I should be able to share via email
    And I should be able to copy a direct link
    And sharing should include appropriate metadata

  @research-mobile @responsive
  Scenario: Research section works well on mobile devices
    Given I am using a mobile viewport
    When I navigate through the research section
    Then the layout should be mobile-optimized
    And I should be able to read research content easily
    And navigation should work smoothly on mobile
    And PDF downloads should work on mobile devices

  @research-performance @speed
  Scenario: Research section loads efficiently
    When I navigate between different research sections
    Then each section should load within 3 seconds
    And PDF previews should load quickly
    And search results should appear promptly
    And the page should remain responsive during loading

  @research-accessibility @compliance
  Scenario: Research content meets accessibility standards
    When I navigate the research section using assistive technology
    Then all content should be screen reader accessible
    And PDFs should have accessible alternatives when possible
    And navigation should work with keyboard only
    And color contrast should meet WCAG guidelines

  @research-archive @historical
  Scenario: Historical research is accessible through archives
    When I look for older research publications
    Then I should find an archive or historical section
    And I should be able to browse by year
    And older publications should remain accessible
    And archive search should work effectively

  @research-related @discovery
  Scenario: Related research suggestions enhance discovery
    Given I am viewing a specific research publication
    When I look for related content
    Then I should see suggestions for related research
    And related content should be topically relevant
    And I should be able to easily navigate to related items
    And the system should learn from user behavior

  @research-quality @standards
  Scenario: Research publications meet quality and editorial standards
    When I review research publications
    Then all publications should have proper peer review indicators
    And editorial standards should be clearly stated
    And publication processes should be transparent
    And quality metrics should be available when appropriate

















