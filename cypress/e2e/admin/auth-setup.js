// Helper functions for authentication in admin tests

/**
 * Sets up admin authentication by setting localStorage values
 */
Cypress.Commands.add('adminLogin', () => {
  // Skip auth for testing purposes - directly visit admin page
  cy.visit('http://localhost:3000/pages/admin');

  // Set localStorage values to bypass auth check in frontend
  cy.window().then((win) => {
    // Set mock auth values
    win.localStorage.setItem('token', 'test-mock-token');
    win.localStorage.setItem('email', 'admin@gmail.com');
    win.localStorage.setItem('username', 'admin');
    win.localStorage.setItem('typegroup', 'admin');
  });

  // Reload the page with localStorage values set
  cy.visit('http://localhost:3000/pages/admin');
  
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
  cy.get('nav div').eq(tabs[tab]).click({force: true});
  
  // Wait for tab switch
  cy.wait(1000);
}); 