declare namespace Cypress {
    interface Chainable {
        adminLogin(): Chainable<Element>
        userLogin(email: string, password: string): Chainable<Element>
        isLoggedIn(): Chainable<Element>
        clearTestData(): Chainable<Element>
        navigateToAdminTab(tabName: string): Chainable<Element>
        isTestEnvironment(): Chainable<boolean>
    }
} 