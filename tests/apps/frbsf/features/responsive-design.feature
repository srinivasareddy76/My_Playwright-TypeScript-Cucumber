


























@smoke @responsive @cross-platform
Feature: FRBSF Responsive Design and Cross-Platform Compatibility
  As a user accessing the FRBSF website from various devices
  I want the website to work seamlessly across different screen sizes and platforms
  So that I can access Federal Reserve information regardless of my device

  Background:
    Given I am on the FRBSF website

  @mobile @viewport @navigation
  Scenario: Mobile navigation works effectively
    Given I am using a mobile viewport (375x667)
    When I navigate to the homepage
    Then the mobile navigation menu should be accessible
    And the hamburger menu should work properly
    And all navigation items should be reachable
    And dropdown menus should work on touch devices
    And the navigation should not overlap content

  @tablet @viewport @layout
  Scenario: Tablet layout adapts appropriately
    Given I am using a tablet viewport (768x1024)
    When I browse different sections of the website
    Then the layout should adapt to tablet dimensions
    And content should be properly spaced
    And navigation should remain functional
    And images should scale appropriately
    And text should remain readable

  @desktop @viewport @full-features
  Scenario: Desktop version provides full functionality
    Given I am using a desktop viewport (1920x1080)
    When I access all website features
    Then all functionality should be available
    And the layout should utilize the full screen effectively
    And hover effects should work properly
    And all interactive elements should be accessible
    And the design should look professional and polished

  @cross-browser @compatibility
  Scenario Outline: Website works across different browsers
    Given I am using "<browser>" browser
    When I navigate through the website
    Then all features should work correctly
    And the layout should render properly
    And JavaScript functionality should work
    And CSS styles should be applied correctly
    And performance should be acceptable

    Examples:
      | browser  |
      | chromium |
      | firefox  |
      | webkit   |

  @touch @interaction
  Scenario: Touch interactions work properly on mobile devices
    Given I am using a mobile viewport with touch capability
    When I interact with touch elements
    Then buttons should respond to touch
    And swipe gestures should work where implemented
    And pinch-to-zoom should work appropriately
    And touch targets should be appropriately sized
    And there should be no accidental touch triggers

  @orientation @rotation
  Scenario: Device orientation changes are handled gracefully
    Given I am using a mobile or tablet viewport
    When I rotate the device from portrait to landscape
    Then the layout should adapt to the new orientation
    And content should remain accessible
    And navigation should continue to work
    And no content should be cut off or hidden
    And the user experience should remain smooth

  @images @media @scaling
  Scenario: Images and media scale appropriately across devices
    When I view pages with images across different viewports
    Then images should scale proportionally
    And image quality should remain acceptable
    And images should not overflow their containers
    And loading times should be reasonable
    And alternative formats should be used when appropriate

  @typography @readability
  Scenario Outline: Typography remains readable across different screen sizes
    Given I am using a "<viewport>" viewport
    When I read content on various pages
    Then text should be legible and appropriately sized
    And line spacing should be comfortable
    And font choices should render correctly
    And contrast should meet accessibility standards
    And text should not require horizontal scrolling

    Examples:
      | viewport |
      | mobile   |
      | tablet   |
      | desktop  |

  @forms @input @mobile
  Scenario: Forms work effectively on mobile devices
    Given I am using a mobile viewport
    When I interact with forms (search, newsletter signup, etc.)
    Then form fields should be appropriately sized
    And the virtual keyboard should not obscure form fields
    And form validation should work correctly
    And submission should work properly
    And error messages should be clearly visible

  @performance @mobile @speed
  Scenario: Mobile performance meets acceptable standards
    Given I am using a mobile viewport
    When I navigate through the website
    Then pages should load within 7 seconds on mobile
    And the site should be responsive during loading
    And critical content should load first
    And the site should work on slower connections
    And battery usage should be reasonable

  @accessibility @responsive @compliance
  Scenario: Responsive design maintains accessibility standards
    When I test accessibility across different viewports
    Then screen readers should work on all device sizes
    And keyboard navigation should work on all devices
    And focus indicators should be visible
    And color contrast should meet standards on all screens
    And content should be accessible regardless of viewport

  @content @priority @mobile-first
  Scenario: Content prioritization works effectively on smaller screens
    Given I am using a mobile viewport
    When I view content-heavy pages
    Then the most important content should be prioritized
    And secondary content should be accessible but not prominent
    And content hierarchy should be clear
    And users should be able to find what they need quickly
    And content should not be unnecessarily hidden

  @navigation @breadcrumbs @mobile
  Scenario: Navigation aids work across all device sizes
    When I navigate deep into the site structure on various devices
    Then breadcrumbs should be visible and functional
    And the current page should be clearly indicated
    And users should be able to navigate back easily
    And site structure should remain clear
    And navigation should not take up excessive screen space

  @search @mobile @functionality
  Scenario: Search functionality adapts to mobile constraints
    Given I am using a mobile viewport
    When I use the search functionality
    Then the search interface should be mobile-optimized
    And search results should display properly on mobile
    And filtering options should be accessible
    And search should work with mobile keyboards
    And results should be easy to navigate on touch devices

  @tables @data @responsive
  Scenario: Data tables adapt appropriately to smaller screens
    When I view pages with data tables on mobile devices
    Then tables should be readable on small screens
    And horizontal scrolling should be minimal
    And important data should remain visible
    And table navigation should work on touch devices
    And alternative views should be provided when necessary

  @video @multimedia @responsive
  Scenario: Video and multimedia content works across devices
    When I view multimedia content on different devices
    Then videos should scale appropriately
    And video controls should be touch-friendly on mobile
    And videos should not autoplay on mobile to save bandwidth
    And multimedia should not break the layout
    And alternative formats should be available when needed

  @progressive @enhancement
  Scenario: Progressive enhancement ensures basic functionality
    When I disable JavaScript or use a basic browser
    Then core content should still be accessible
    And basic navigation should work
    And forms should submit properly
    And the site should degrade gracefully
    And essential information should remain available

  @offline @connectivity
  Scenario: Site handles poor connectivity gracefully
    When I access the site with poor or intermittent connectivity
    Then the site should provide feedback about connection status
    And critical content should be prioritized for loading
    And the site should not break with slow connections
    And users should be informed about loading delays
    And cached content should be utilized when appropriate



























