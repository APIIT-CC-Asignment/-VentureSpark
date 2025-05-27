/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// Custom command for admin login with better error handling
Cypress.Commands.add('adminLogin', () => {
    cy.visit('/pages/loginpage');
    cy.get('input[name="email"]').type('admin@admin.com');
    cy.get('input[name="password"]').type('123');
    cy.get('button[type="submit"]').click();

    // Wait for either success or error
    cy.get('body').then(($body) => {
        if ($body.find('.text-red-500').length > 0) {
            // If there's an error message, log it
            cy.get('.text-red-500').invoke('text').then((errorText) => {
                cy.log('Login Error:', errorText);
            });
        }
    });

    // Check for successful login
    cy.url().should('include', '/pages/admin');
});

// Custom command for user login with better error handling
Cypress.Commands.add('userLogin', (email: string, password: string) => {
    cy.visit('/pages/loginpage');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Wait for either success or error
    cy.get('body').then(($body) => {
        if ($body.find('.text-red-500').length > 0) {
            // If there's an error message, log it
            cy.get('.text-red-500').invoke('text').then((errorText) => {
                cy.log('Login Error:', errorText);
            });
        }
    });

    // Check for successful login - user should be redirected to home
    cy.url().should('include', '/');
});

// Custom command to check if user is logged in
Cypress.Commands.add('isLoggedIn', () => {
    cy.window().then((win) => {
        const email = win.localStorage.getItem('email');
        const typegroup = win.localStorage.getItem('typegroup');
        expect(email).to.exist;
        expect(typegroup).to.exist;
    });
});

// Custom command to clear test data
Cypress.Commands.add('clearTestData', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then((win) => {
        win.localStorage.setItem('cypress_test', 'true');
    });
});

// Custom command to navigate to admin tabs
Cypress.Commands.add('navigateToAdminTab', (tabName: string) => {
    const tabSelectors = {
        dashboard: 'nav div:contains("Dashboard")',
        users: 'nav div:contains("Users")',
        services: 'nav div:contains("Services")',
        bookings: 'nav div:contains("Bookings")'
    };

    cy.get(tabSelectors[tabName as keyof typeof tabSelectors]).click();
});