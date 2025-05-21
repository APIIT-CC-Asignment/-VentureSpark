// Helper functions for authentication in admin tests

/**
 * Sets up admin authentication by setting localStorage values
 * @param {Object} options - Options for the visit command
 */
Cypress.Commands.add('adminLogin', (options = {}) => {
  // Visit a neutral page first to set localStorage values
  cy.visit('http://localhost:3000', { failOnStatusCode: false, ...options });

  // Set localStorage values to bypass auth check in frontend
  cy.window().then((win) => {
    // Set mock auth values
    win.localStorage.setItem('token', 'test-mock-token');
    win.localStorage.setItem('email', 'admin@admin.com');
    win.localStorage.setItem('username', 'admin');
    // Fix: Change 'admin' to 'Admin' with capital 'A' to match the check in the admin page
    win.localStorage.setItem('typegroup', 'Admin');
    // Set a flag to indicate we're running in Cypress
    win.localStorage.setItem('cypress_test', 'true');
  });

  // Now visit the admin page with localStorage values set
  cy.visit('http://localhost:3000/pages/admin', { failOnStatusCode: false, ...options });

  // Give page time to load
  cy.wait(2000);
});

/**
 * Navigates to a specific tab in the admin dashboard
 * @param {string} tab - The tab to navigate to: 'dashboard', 'users', 'services', or 'bookings'
 */
Cypress.Commands.add('navigateToAdminTab', (tab) => {
  const tabs = {
    dashboard: 0,
    users: 1,
    services: 2,
    bookings: 3
  };

  if (tabs[tab] === undefined) {
    throw new Error(`Invalid tab: ${tab}. Valid options are: dashboard, users, services, bookings`);
  }

  // Click the tab
  cy.get('nav div').eq(tabs[tab]).click({ force: true });

  // Wait for tab switch
  cy.wait(1000);
}); 