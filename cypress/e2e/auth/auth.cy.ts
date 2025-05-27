describe('Authentication', () => {
    const adminEmail = 'admin@admin.com';
    const adminPassword = '123';
    const testEmail = 'test@example.com';
    const testPassword = 'testpassword123';

    beforeEach(() => {
        cy.clearTestData();
    });

    describe('Login Flow', () => {
        it('should login as admin with correct credentials', () => {
            cy.adminLogin();
            cy.isLoggedIn();
            cy.url().should('include', '/pages/admin');
        });

        it('should handle invalid admin login attempts', () => {
            cy.visit('/pages/loginpage');
            cy.get('input[name="email"]').type(adminEmail);
            cy.get('input[name="password"]').type('wrongpassword');
            cy.get('button[type="submit"]').click();
            cy.contains('Error:').should('be.visible');
        });

        it('should login as regular user after registration and approval', () => {
            // Register new user
            cy.visit('/pages/signup');
            cy.get('input[name="username"]').type('Test User');
            cy.get('input[name="email"]').type(testEmail);
            cy.get('input[name="password"]').type(testPassword);
            cy.get('button[type="submit"]').click();
            cy.contains('Registration successful').should('be.visible');

            // Login as admin to approve
            cy.adminLogin();
            // TODO: Add approval steps here

            // Login as regular user
            cy.userLogin(testEmail, testPassword);
            cy.isLoggedIn();
        });

        it('should prevent unapproved user login', () => {
            cy.userLogin(testEmail, testPassword);
            cy.contains('Error:').should('be.visible');
        });

        it('should handle vendor registration', () => {
            cy.visit('/pages/signup-vendor');
            cy.get('input[name="username"]').type('Test Vendor');
            cy.get('input[name="email"]').type('vendor@example.com');
            cy.get('input[name="password"]').type(testPassword);
            cy.get('button[type="submit"]').click();
            cy.contains('Registration successful').should('be.visible');
        });
    });

    describe('Logout Flow', () => {
        it('should logout successfully from admin account', () => {
            cy.adminLogin();
            cy.get('button').contains('Log In Again').click();
            cy.url().should('include', '/pages/loginpage');
            cy.window().then((win) => {
                expect(win.localStorage.getItem('email')).to.be.null;
                expect(win.localStorage.getItem('typegroup')).to.be.null;
            });
        });

        it('should redirect to login after session expiry', () => {
            cy.adminLogin();
            cy.clearLocalStorage();
            cy.reload();
            cy.url().should('include', '/pages/loginpage');
        });
    });
}); 