# Admin Dashboard Test Suite

This directory contains Cypress tests for the Admin Dashboard application.

## Test Organization

The tests are organized as follows:

1. **auth-setup.js**: Shared authentication helper used across all admin tests
2. **basic.cy.ts**: Basic dashboard functionality tests (✅ All tests passing)
3. **navigation.cy.ts**: Navigation between dashboard tabs (⚠️ Some failing tests)
4. **dashboard.cy.ts**: Tests for the main dashboard view and metrics (⚠️ Some failing tests)
5. **users.cy.ts**: Tests for the user management functionality (⚠️ Some failing tests)
6. **services.cy.ts**: Tests for the service management functionality (⚠️ Some failing tests)
7. **bookings.cy.ts**: Tests for the booking management functionality (⚠️ Some failing tests)
8. **ui.cy.ts**: UI-specific tests for styling and appearance (⚠️ Most tests failing)
9. **avatar-fix.cy.ts**: Fix for the default avatar 404 errors (⚠️ Failing)
10. **general.cy.ts**: General admin dashboard tests (✅ All tests passing)
11. **index.cy.ts**: Entry point file that imports all admin tests

## Test Helper Commands

### Authentication

```javascript
// Login as admin
cy.adminLogin();

// Navigate to a specific tab
cy.navigateToAdminTab('dashboard');
cy.navigateToAdminTab('users');
cy.navigateToAdminTab('services');
cy.navigateToAdminTab('bookings');
```

### Common Utilities

```javascript
// Fix for avatar 404 errors
cy.intercept('GET', '**/default-avatar.png', {
  statusCode: 200,
  body: '', 
  headers: { 'Content-Type': 'image/png' },
});
```

## Test Execution

To run all admin tests:

```bash
cd D:\-VentureSpark
npx cypress run --spec "cypress/e2e/admin/index.cy.ts"
```

To run a specific test file:

```bash
cd D:\-VentureSpark
npx cypress run --spec "cypress/e2e/admin/basic.cy.ts"
```

To run in interactive mode:

```bash
cd D:\-VentureSpark
npx cypress open
```

## Test Status

The test suite has **64** tests in total:
- **46** passing tests (after updating general.cy.ts)
- **18** failing tests

### Fully Passing Test Files
- basic.cy.ts (5/5 tests passing)
- general.cy.ts (5/5 tests passing)

### Common Issues

1. **Avatar 404 Errors**: Fixed by intercepting the default-avatar.png requests
2. **Selector mismatches**: Some selectors in UI tests don't match the actual elements in the application
3. **Visibility issues**: Some elements might be hidden due to CSS overflow properties
4. **Test timing**: Some tests might be failing due to timing issues (elements not loaded yet)

### Improvement Opportunities

1. Fix failing tests by updating selectors to match the actual application
2. Improve test coverage for edge cases
3. Add more data validation tests
4. Implement visual regression testing for UI components
5. Add tests for error handling
6. Add tests for form validation
7. Add tests for API integration 