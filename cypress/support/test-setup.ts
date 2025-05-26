// Test setup file for Cypress

beforeEach(() => {
    // Set up localStorage items needed for tests
    cy.window().then((win) => {
        win.localStorage.setItem('email', 'admin@admin.com');
        win.localStorage.setItem('typegroup', 'Admin');
        win.localStorage.setItem('cypress_test', 'true');
    });
});

// Add custom command to check if we're in a test environment
Cypress.Commands.add('isTestEnvironment', () => {
    return cy.window().then((win) => {
        return win.localStorage.getItem('cypress_test') === 'true';
    });
}); 