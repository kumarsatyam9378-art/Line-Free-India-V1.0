# Implementation Plan: Premium Customer Home Redesign

## Overview

This implementation plan transforms the existing CustomerHome page into a premium discovery portal with modern UI patterns, smooth animations, and enhanced business browsing. The implementation uses TypeScript/React with Framer Motion for animations, maintaining full compatibility with existing AppContext data and BottomNav component.

**Key Technologies:**
- TypeScript/React for component development
- Framer Motion for animations
- Tailwind CSS for styling
- Existing AppContext for data management

**Implementation Approach:**
- Incremental refactoring of CustomerHome.tsx
- Create new reusable components
- Maintain backward compatibility
- Progressive enhancement with animations

## Tasks

- [x] 1. Set up component structure and design system integration
  - Review existing design tokens in `src/config/designTokens.ts`
  - Create utility functions for glass morphism effects
  - Set up Framer Motion animation configurations
  - Create shared animation variants for reuse across components
  - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6, 4.9_

- [x] 2. Implement Discovery Portal section
  - [x] 2.1 Create DiscoveryPortal component
    - Build horizontal scrollable container with touch support
    - Implement category data integration from BUSINESS_CATEGORIES
    - Add "VIEW ALL" link at the end of category list
    - Apply glass morphism styling with backdrop blur
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.9_
  
  - [x] 2.2 Create CategoryPill component
    - Implement pill button with icon and label display
    - Add active/inactive state styling with gradients
    - Implement hover and focus states with scale animations
    - Add click handler for category selection
    - Ensure accessibility with proper ARIA labels
    - _Requirements: 1.6, 1.7, 1.8, 1.10, 12.1, 12.2_
  
  - [ ]* 2.3 Write unit tests for Discovery Portal
    - Test category pill rendering with correct icons and labels
    - Test horizontal scroll functionality
    - Test category selection updates filtered businesses
    - Test "VIEW ALL" link navigation
    - Test keyboard navigation through category pills
    - _Requirements: 1.1, 1.2, 1.6, 12.2_

- [x] 3. Implement image handling system
  - [x] 3.1 Create image priority utility function
    - Implement getBusinessImage() with priority logic (bannerImageURL → photoURL → fallback)
    - Create getCategoryFallbackImage() for gradient backgrounds
    - Add category-specific gradient definitions
    - Handle image loading errors gracefully
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.9_
  
  - [x] 3.2 Implement lazy loading for images
    - Use Intersection Observer for lazy loading
    - Add loading placeholder with gradient
    - Implement progressive image loading
    - Optimize image aspect ratios
    - _Requirements: 3.6, 3.7, 3.8, 3.10, 10.1_
  
  - [ ]* 3.3 Write unit tests for image handling
    - Test bannerImageURL priority
    - Test photoURL fallback when bannerImageURL missing
    - Test category gradient fallback when both URLs missing
    - Test image error handling
    - Test lazy loading triggers correctly
    - _Requirements: 3.1, 3.2, 3.3, 3.9_

- [x] 4. Create BusinessCard component
  - [x] 4.1 Build BusinessCard component structure
    - Create card layout with image section and info section
    - Implement 16:9 aspect ratio image container
    - Add business name, location, and rating display
    - Add pricing display in "FROM ₹{price}" format
    - Apply glass morphism card styling with shadows
    - _Requirements: 2.1, 2.5, 2.6, 2.8, 2.10, 2.11, 4.1, 4.2_
  
  - [x] 4.2 Implement business status indicators
    - Add "LIVE NOW" badge for open businesses
    - Add status indicators for closed/on break states
    - Style badges with appropriate colors and positioning
    - _Requirements: 2.7, 2.15_
  
  - [x] 4.3 Add favorite functionality
    - Integrate heart icon with isFavorite state from AppContext
    - Implement toggleFavorite click handler
    - Add heart animation on favorite toggle
    - Style favorite button with proper touch target size
    - _Requirements: 2.9, 9.11, 9.12, 12.7_
  
  - [x] 4.4 Implement card click navigation
    - Add onClick handler to navigate to /customer/salon/{businessId}
    - Ensure entire card is clickable except favorite button
    - Add active state feedback (scale down on press)
    - _Requirements: 2.12, 6.1_
  
  - [ ]* 4.5 Write unit tests for BusinessCard
    - Test business name and location display
    - Test image priority logic (bannerImageURL → photoURL → fallback)
    - Test "LIVE NOW" badge appears when business.isOpen is true
    - Test favorite button toggles state correctly
    - Test card click navigates to correct detail page
    - Test pricing display format
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.12_

- [ ] 5. Checkpoint - Verify core components render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement Premium Partners Section
  - [x] 6.1 Create PremiumPartnersSection component
    - Build section container with title
    - Implement business cards grid layout (responsive)
    - Integrate filtered business data from AppContext
    - Add empty state when no businesses available
    - _Requirements: 2.1, 9.1, 9.2, 11.7_
  
  - [x] 6.2 Integrate business filtering logic
    - Connect to selectedCategory state
    - Filter businesses by businessType property
    - Display filtered results in grid
    - Handle category "all" to show all businesses
    - _Requirements: 1.6, 9.5, 9.6_
  
  - [ ]* 6.3 Write integration tests for Premium Partners Section
    - Test section displays correct number of business cards
    - Test filtering by category updates displayed businesses
    - Test empty state displays when no businesses match filter
    - Test grid layout adapts to different screen sizes
    - _Requirements: 2.1, 1.6, 11.7, 8.7_

- [x] 7. Implement LoyaltyPointsCard component
  - [x] 7.1 Create LoyaltyPointsCard component
    - Display loyalty points from customerProfile
    - Add gradient background (gold to primary)
    - Include trophy emoji and "Your Rewards" label
    - Add click handler to navigate to /customer/rewards
    - Apply glass morphism styling
    - _Requirements: 9.1, 9.10, 4.1, 4.2_
  
  - [x] 7.2 Add conditional rendering
    - Only display card when customerProfile.loyaltyPoints > 0
    - Handle missing customerProfile gracefully
    - _Requirements: 9.1, 11.4_
  
  - [ ]* 7.3 Write unit tests for LoyaltyPointsCard
    - Test card displays correct points value
    - Test card only renders when points > 0
    - Test click navigates to rewards page
    - Test handles missing customerProfile
    - _Requirements: 9.1, 9.10, 11.4_

- [x] 8. Implement QuickActionsGrid component
  - [x] 8.1 Create QuickActionsGrid component
    - Build 4-column grid layout (2x2 on mobile)
    - Create action buttons: Search, Activity, Explore, Profile
    - Add icons and labels for each action
    - Implement navigation for each action
    - Apply glass morphism card styling
    - _Requirements: 4.1, 4.2, 8.3, 8.5_
  
  - [ ]* 8.2 Write unit tests for QuickActionsGrid
    - Test all 4 action buttons render
    - Test each button navigates to correct route
    - Test grid layout is responsive
    - Test touch targets meet minimum size
    - _Requirements: 8.3, 8.5, 12.7_

- [ ] 9. Checkpoint - Verify all sections integrate correctly
  - Ensure all tests pass, ask the user if questions arise.

- [-] 10. Implement Framer Motion animations
  - [x] 10.1 Add page entrance animations
    - Implement fade-in and slide-up animation for page load
    - Add stagger animation for business cards
    - Configure animation timing and easing
    - _Requirements: 7.1, 7.2, 7.5, 7.9_
  
  - [ ] 10.2 Add interaction animations
    - Implement hover animations for business cards (scale 1.02)
    - Add click feedback animations (scale 0.98)
    - Implement category pill hover and tap animations
    - Add favorite button animation on toggle
    - _Requirements: 2.13, 7.3, 7.6_
  
  - [ ] 10.3 Implement reduced motion support
    - Detect prefers-reduced-motion media query
    - Disable animations when reduced motion is preferred
    - Ensure functionality works without animations
    - _Requirements: 7.8, 12.8_
  
  - [ ]* 10.4 Write tests for animations
    - Test animations trigger on page load
    - Test hover animations work correctly
    - Test reduced motion disables animations
    - Test animation performance (no jank)
    - _Requirements: 7.1, 7.2, 7.7, 7.8_

- [ ] 11. Implement responsive design
  - [ ] 11.1 Add mobile layout (0-639px)
    - Single column business cards
    - Horizontal scroll for category pills
    - 2x2 grid for quick actions
    - Full-width components
    - _Requirements: 8.1, 8.2, 8.6, 8.8_
  
  - [ ] 11.2 Add tablet layout (640-1023px)
    - 2-column business cards grid
    - Wider category pills
    - 4-column quick actions
    - Optimized spacing
    - _Requirements: 8.1, 8.7_
  
  - [ ] 11.3 Add desktop layout (1024px+)
    - 3-column business cards grid
    - All categories visible (no scroll if possible)
    - Centered layout with max-width
    - Enhanced spacing
    - _Requirements: 8.1, 8.7_
  
  - [ ]* 11.4 Write responsive design tests
    - Test layout adapts at each breakpoint
    - Test touch targets are appropriately sized
    - Test horizontal scrolling works on touch devices
    - Test images optimize for different viewports
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6_

- [ ] 12. Integrate with existing components
  - [ ] 12.1 Ensure BottomNav integration
    - Verify BottomNav renders at bottom of page
    - Add appropriate padding to page content (pb-32)
    - Test navigation between pages works correctly
    - Ensure BottomNav doesn't overlap content
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [ ] 12.2 Verify SalonDetail page navigation
    - Test navigation to /customer/salon/{businessId} works
    - Verify business data passes correctly to detail page
    - Ensure back navigation returns to home page
    - Test page transitions are smooth
    - _Requirements: 6.1, 6.7, 6.8, 7.4_
  
  - [ ]* 12.3 Write integration tests for navigation
    - Test BottomNav navigation works from home page
    - Test business card click navigates to detail page
    - Test back button returns to home page
    - Test deep links work correctly
    - _Requirements: 5.1, 5.4, 6.1, 6.7_

- [ ] 13. Checkpoint - Verify full integration and navigation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Implement error handling
  - [ ] 14.1 Add business data error handling
    - Display error message when allSalons fails to load
    - Provide retry button for failed data loads
    - Show cached data if available during errors
    - Log errors for debugging
    - _Requirements: 11.1, 11.5, 11.6_
  
  - [ ] 14.2 Add image error handling
    - Implement onError handler for image elements
    - Fallback to photoURL when bannerImageURL fails
    - Fallback to category gradient when both fail
    - Log image errors for monitoring
    - _Requirements: 11.2, 3.9_
  
  - [ ] 14.3 Add empty state handling
    - Display empty state when no businesses available
    - Show appropriate message for empty category filter
    - Provide action to clear filters or browse all
    - _Requirements: 11.7_
  
  - [ ]* 14.4 Write error handling tests
    - Test error message displays on data load failure
    - Test image fallback on load error
    - Test empty state displays correctly
    - Test retry functionality works
    - _Requirements: 11.1, 11.2, 11.7_

- [ ] 15. Implement performance optimizations
  - [ ] 15.1 Add React.memo to components
    - Memoize BusinessCard component
    - Memoize CategoryPill component
    - Memoize LoyaltyPointsCard component
    - Add proper dependency arrays to useMemo/useCallback
    - _Requirements: 10.2, 10.3_
  
  - [ ] 15.2 Optimize filtering logic
    - Use useMemo for filtered businesses calculation
    - Debounce category selection if needed
    - Cache category info lookups
    - _Requirements: 10.2, 10.6_
  
  - [ ] 15.3 Implement code splitting
    - Lazy load SalonDetail page component
    - Lazy load heavy components (if any)
    - Add loading fallbacks for lazy components
    - _Requirements: 10.5_
  
  - [ ]* 15.4 Write performance tests
    - Test component re-renders are minimized
    - Test filtering performance with large datasets
    - Test animation frame rate stays at 60fps
    - Test lazy loading works correctly
    - _Requirements: 10.1, 10.2, 10.7, 10.9_

- [ ] 16. Implement accessibility features
  - [ ] 16.1 Add ARIA labels and roles
    - Add aria-label to category pills
    - Add aria-label to favorite buttons
    - Add role="button" to clickable cards
    - Add aria-live for dynamic content updates
    - _Requirements: 12.1, 12.9_
  
  - [ ] 16.2 Implement keyboard navigation
    - Ensure all interactive elements are focusable
    - Add visible focus indicators
    - Implement logical tab order
    - Add keyboard shortcuts documentation
    - _Requirements: 12.2, 12.3, 12.5_
  
  - [ ] 16.3 Ensure color contrast compliance
    - Verify text contrast ratios meet WCAG AA (4.5:1)
    - Verify interactive element contrast (3:1)
    - Verify focus indicator contrast (3:1)
    - Test with color contrast analyzer tools
    - _Requirements: 12.4, 4.11_
  
  - [ ] 16.4 Add image alt text
    - Add descriptive alt text for business images
    - Add alt text for category icons
    - Add alt text for status badges
    - _Requirements: 12.4_
  
  - [ ]* 16.5 Write accessibility tests
    - Test keyboard navigation works for all elements
    - Test screen reader announces content correctly
    - Test color contrast meets WCAG AA standards
    - Test focus indicators are visible
    - Test reduced motion is respected
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_

- [x] 17. Refactor CustomerHome.tsx to use new components
  - [x] 17.1 Replace existing header with new components
    - Integrate GreetingHeader component
    - Replace loyalty points section with LoyaltyPointsCard
    - Replace quick actions with QuickActionsGrid
    - Maintain existing functionality
    - _Requirements: 9.1, 9.2_
  
  - [x] 17.2 Replace category filter with DiscoveryPortal
    - Remove existing category filter UI
    - Integrate DiscoveryPortal component
    - Connect category selection state
    - Maintain filtering logic
    - _Requirements: 1.1, 1.2, 1.6, 9.3_
  
  - [x] 17.3 Replace business list with PremiumPartnersSection
    - Remove existing business card list
    - Integrate PremiumPartnersSection component
    - Connect filtered business data
    - Maintain navigation functionality
    - _Requirements: 2.1, 9.2, 9.5_
  
  - [x] 17.4 Clean up unused code
    - Remove old styling classes
    - Remove unused state variables
    - Remove unused imports
    - Update comments and documentation
    - _Requirements: 9.1, 9.2_

- [ ] 18. Final checkpoint - End-to-end testing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Visual polish and final adjustments
  - [ ] 19.1 Fine-tune animations
    - Adjust animation timing for smoothness
    - Ensure stagger animations feel natural
    - Test animations on different devices
    - Optimize animation performance
    - _Requirements: 7.7, 7.9, 10.9_
  
  - [ ] 19.2 Refine spacing and typography
    - Verify consistent spacing throughout
    - Check typography hierarchy is clear
    - Ensure readability across screen sizes
    - Adjust padding and margins for visual balance
    - _Requirements: 4.3, 4.7, 8.5_
  
  - [ ] 19.3 Polish glass morphism effects
    - Fine-tune backdrop blur values
    - Adjust transparency levels
    - Ensure effects work on different backgrounds
    - Test performance of blur effects
    - _Requirements: 4.1, 4.6_
  
  - [ ] 19.4 Verify premium styling consistency
    - Check all rounded corners use consistent values
    - Verify shadow effects are consistent
    - Ensure color palette is consistent
    - Check hover states are consistent
    - _Requirements: 4.2, 4.5, 4.6, 4.10, 4.12_

- [ ] 20. Final integration and deployment preparation
  - [ ] 20.1 Run full test suite
    - Run all unit tests
    - Run all integration tests
    - Run accessibility tests
    - Run performance tests
    - _Requirements: All testing requirements_
  
  - [ ] 20.2 Conduct manual testing
    - Test on multiple mobile devices
    - Test on tablet and desktop
    - Test with different data scenarios
    - Test error scenarios
    - _Requirements: 8.1, 8.2, 11.1, 11.4_
  
  - [ ] 20.3 Performance audit
    - Run Lighthouse audit
    - Check bundle size
    - Verify load times meet targets
    - Check animation performance
    - _Requirements: 10.1, 10.5, 10.7, 10.9_
  
  - [ ] 20.4 Accessibility audit
    - Run axe DevTools audit
    - Test with screen reader (NVDA/JAWS)
    - Test keyboard-only navigation
    - Verify WCAG 2.1 Level AA compliance
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9_

- [ ] 21. Final checkpoint - Production readiness verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and user feedback
- Implementation uses TypeScript/React with Framer Motion for animations
- All components integrate with existing AppContext for data management
- BottomNav component integration is maintained throughout
- Performance optimizations are applied progressively
- Accessibility is built in from the start, not added later
- Testing covers unit, integration, accessibility, and performance aspects

## Implementation Strategy

1. **Phase 1 (Tasks 1-5)**: Build core components and image handling
2. **Phase 2 (Tasks 6-9)**: Integrate sections and add supporting components
3. **Phase 3 (Tasks 10-13)**: Add animations, responsive design, and navigation
4. **Phase 4 (Tasks 14-16)**: Implement error handling, optimization, and accessibility
5. **Phase 5 (Tasks 17-21)**: Refactor main component, polish, and prepare for production

## Success Criteria

- All acceptance criteria from requirements document are met
- All non-optional tests pass
- Page loads in under 2.5 seconds (LCP)
- Animations run at 60fps
- WCAG 2.1 Level AA compliance achieved
- No console errors or warnings
- Works on iOS Safari, Android Chrome, and desktop browsers
- Smooth navigation between home and detail pages
- BottomNav integration works seamlessly
