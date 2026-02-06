





















@smoke @news @media
Feature: FRBSF News & Media Section
  As a journalist, researcher, or interested citizen
  I want to access current news and media content from the FRBSF
  So that I can stay informed about Federal Reserve activities and economic developments

  Background:
    Given I am on the FRBSF website
    And I navigate to the News & Media section

  @news-homepage @layout
  Scenario: News & Media homepage displays current and relevant content
    Then I should see the News & Media page title
    And I should see featured news prominently displayed
    And I should see recent news articles
    And I should see different types of media content
    And the page should load within 5 seconds

  @press-releases @official
  Scenario: Press releases are current and properly formatted
    When I navigate to the Press Releases section
    Then I should see recent press releases
    And each press release should have a clear headline
    And each press release should have a publication date
    And each press release should have the full text available
    And press releases should be in reverse chronological order

  @speeches @leadership
  Scenario: Speeches and remarks from Fed leadership are accessible
    When I navigate to the Speeches section
    Then I should see recent speeches and remarks
    And each speech should identify the speaker
    And each speech should have the event context
    And each speech should have the full text or transcript
    And I should be able to find speeches by specific speakers

  @media-advisories @alerts
  Scenario: Media advisories provide timely information
    When I look for media advisories
    Then I should see current media advisories
    And advisories should be clearly marked as such
    And they should provide relevant contact information
    And they should include event details when applicable

  @news-search @discovery
  Scenario: News content can be searched effectively
    When I use the news search functionality
    And I search for "interest rates"
    Then I should see news articles related to interest rates
    And results should include various content types
    And I should be able to filter results by date
    And I should be able to filter by content type

  @news-categories @organization
  Scenario Outline: News content is organized by relevant categories
    When I filter news by "<category>"
    Then I should see news items specific to "<category>"
    And the content should be relevant and current
    And I should be able to browse chronologically
    And category filtering should work correctly

    Examples:
      | category           |
      | Monetary Policy    |
      | Banking Supervision|
      | Financial Stability|
      | Community Development|
      | Economic Research  |

  @featured-news @prominence
  Scenario: Featured news highlights important developments
    Then I should see featured news on the main news page
    And featured news should be current and significant
    And featured content should be visually prominent
    And I should be able to access the full article easily
    And featured news should rotate or update regularly

  @media-contacts @accessibility
  Scenario: Media contacts are easily accessible
    When I look for media contact information
    Then I should find dedicated media contacts
    And contact information should include names and titles
    And phone numbers and email addresses should be provided
    And contact hours or availability should be indicated
    And contacts should be organized by topic or expertise

  @news-images @multimedia
  Scenario: News articles include appropriate multimedia content
    When I view news articles
    Then relevant articles should include images
    And images should have appropriate captions
    And multimedia content should enhance the story
    And images should be optimized for web viewing
    And alt text should be provided for accessibility

  @news-sharing @social
  Scenario: News content can be shared across platforms
    Given I am viewing a news article
    When I look for sharing options
    Then I should be able to share via social media
    And I should be able to share via email
    And I should be able to copy the article link
    And sharing should include appropriate metadata and previews

  @news-archive @historical
  Scenario: Historical news content is accessible
    When I look for older news content
    Then I should find a news archive
    And I should be able to browse by date
    And I should be able to search historical content
    And older articles should remain accessible and properly formatted

  @news-rss @syndication
  Scenario: RSS feeds are available for news syndication
    When I look for RSS feed options
    Then I should find RSS feeds for news content
    And feeds should be organized by content type
    And RSS feeds should be properly formatted
    And feeds should update automatically with new content

  @news-mobile @responsive
  Scenario: News section works effectively on mobile devices
    Given I am using a mobile viewport
    When I navigate through the news section
    Then the layout should be mobile-optimized
    And articles should be easy to read on mobile
    And navigation should work smoothly
    And sharing features should work on mobile

  @news-performance @speed
  Scenario: News section loads quickly and efficiently
    When I navigate between news sections
    Then each section should load within 3 seconds
    And images should load progressively
    And the page should remain responsive
    And search results should appear quickly

  @events-calendar @scheduling
  Scenario: Upcoming events are clearly displayed
    When I look for upcoming events
    Then I should see a calendar or list of events
    And each event should have date and time information
    And event locations should be specified
    And I should be able to get event details
    And I should be able to add events to my calendar

  @newsletter-signup @subscription
  Scenario: Newsletter subscription is available and functional
    When I look for newsletter subscription
    Then I should find a newsletter signup form
    And I should be able to enter my email address
    And I should be able to choose subscription preferences
    And I should receive confirmation of subscription
    And I should be able to unsubscribe easily

  @news-accessibility @compliance
  Scenario: News content meets accessibility standards
    When I navigate news content using assistive technology
    Then all content should be screen reader accessible
    And images should have descriptive alt text
    And videos should have captions when available
    And the interface should be keyboard navigable
    And color contrast should meet WCAG standards

  @breaking-news @alerts
  Scenario: Breaking news or urgent updates are prominently displayed
    When there is breaking news or urgent updates
    Then urgent content should be prominently featured
    And breaking news should be clearly marked
    And urgent updates should be easily accessible
    And the most current information should be prioritized

  @news-credibility @transparency
  Scenario: News content maintains credibility and transparency
    When I review news articles
    Then sources should be clearly attributed
    And publication dates should be prominent
    And author information should be available
    And editorial standards should be evident
    And corrections or updates should be clearly marked

  @media-kit @resources
  Scenario: Media resources and press kits are available
    When I look for media resources
    Then I should find downloadable media kits
    And high-resolution images should be available
    And fact sheets should be accessible
    And background information should be provided
    And usage guidelines should be clear






















