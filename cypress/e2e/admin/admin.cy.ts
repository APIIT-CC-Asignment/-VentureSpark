describe('Admin Functionality', () => {
    before(() => {
        cy.clearTestData();
        cy.adminLogin();
    });

    beforeEach(() => {
        cy.visit('/pages/admin');
    });

    describe('User Management', () => {
        it('should add a new user with all required fields', () => {
            cy.navigateToAdminTab('users');
            cy.get('[data-testid="add-user-button"]').click();

            const testEmail = `test${Date.now()}@example.com`;
            cy.get('input[name="email"]').type(testEmail);
            cy.get('input[name="password"]').type('testpassword123');
            cy.get('input[name="name"]').type('Test User');
            cy.get('select[name="role"]').select('user');
            cy.get('input[name="phone"]').type('1234567890');
            cy.get('textarea[name="address"]').type('123 Test Street');

            cy.get('button[type="submit"]').click();

            // Verify user was added
            cy.contains(testEmail).should('exist');
            cy.contains('Test User').should('exist');
            cy.contains('user').should('exist');
        });

        it('should validate required fields when adding user', () => {
            cy.navigateToAdminTab('users');
            cy.get('[data-testid="add-user-button"]').click();
            cy.get('button[type="submit"]').click();

            // Verify validation messages
            cy.contains('Email is required').should('exist');
            cy.contains('Password is required').should('exist');
            cy.contains('Name is required').should('exist');
        });

        it('should edit user profile with all fields', () => {
            cy.navigateToAdminTab('users');
            cy.get('[data-testid="add-user-button"]').click();
            const testEmail = `test${Date.now()}@example.com`;
            cy.get('input[name="email"]').type(testEmail);
            cy.get('input[name="password"]').type('testpassword123');
            cy.get('input[name="name"]').type('Test User');
            cy.get('select[name="role"]').select('user');
            cy.get('button[type="submit"]').click();

            cy.get('[data-testid="edit-user-button"]').first().click();
            const newName = 'Updated Name';
            const newPhone = '9876543210';
            const newAddress = '456 New Street';
            cy.get('input[name="name"]').clear().type(newName);
            cy.get('input[name="phone"]').clear().type(newPhone);
            cy.get('textarea[name="address"]').clear().type(newAddress);
            cy.get('select[name="role"]').select('admin');
            cy.get('button[type="submit"]').click();

            cy.contains(newName).should('exist');
            cy.contains(newPhone).should('exist');
            cy.contains(newAddress).should('exist');
            cy.contains('admin').should('exist');
        });

        it('should delete a user with confirmation', () => {
            cy.navigateToAdminTab('users');
            cy.get('[data-testid="add-user-button"]').click();
            const testEmail = `test${Date.now()}@example.com`;
            cy.get('input[name="email"]').type(testEmail);
            cy.get('input[name="password"]').type('testpassword123');
            cy.get('input[name="name"]').type('Test User');
            cy.get('select[name="role"]').select('user');
            cy.get('button[type="submit"]').click();

            cy.get('[data-testid="user-row"]').then(($rows) => {
                const initialCount = $rows.length;
                cy.get('[data-testid="delete-user-button"]').first().click();
                cy.get('[data-testid="confirm-delete"]').click();
                cy.get('[data-testid="user-row"]').should('have.length', initialCount - 1);
                cy.contains(testEmail).should('not.exist');
            });
        });

        it('should cancel user deletion', () => {
            cy.navigateToAdminTab('users');
            cy.get('[data-testid="add-user-button"]').click();
            const testEmail = `test${Date.now()}@example.com`;
            cy.get('input[name="email"]').type(testEmail);
            cy.get('input[name="password"]').type('testpassword123');
            cy.get('input[name="name"]').type('Test User');
            cy.get('select[name="role"]').select('user');
            cy.get('button[type="submit"]').click();

            cy.get('[data-testid="user-row"]').then(($rows) => {
                const initialCount = $rows.length;
                cy.get('[data-testid="delete-user-button"]').first().click();
                cy.get('[data-testid="cancel-delete"]').click();
                cy.get('[data-testid="user-row"]').should('have.length', initialCount);
                cy.contains(testEmail).should('exist');
            });
        });
    });

    describe('Admin Dashboard UI', () => {
        it('should display admin dashboard with correct elements', () => {
            cy.navigateToAdminTab('dashboard');
            cy.get('[data-testid="admin-header"]').should('exist');
            cy.get('[data-testid="user-management-section"]').should('exist');
            cy.get('[data-testid="stats-section"]').should('exist');
            cy.get('[data-testid="recent-activity"]').should('exist');
        });

        it('should show user statistics', () => {
            cy.navigateToAdminTab('dashboard');
            cy.get('[data-testid="total-users"]').should('exist');
            cy.get('[data-testid="active-users"]').should('exist');
            cy.get('[data-testid="new-users-today"]').should('exist');
        });

        it('should have working navigation', () => {
            cy.navigateToAdminTab('users');
            cy.url().should('include', '/pages/admin');
            cy.navigateToAdminTab('dashboard');
            cy.url().should('include', '/pages/admin');
            cy.navigateToAdminTab('settings');
            cy.url().should('include', '/pages/admin');
        });
    });

    describe('Admin Settings', () => {
        it('should update admin profile', () => {
            cy.navigateToAdminTab('settings');
            const newName = 'Updated Admin Name';
            const newPhone = '5555555555';
            cy.get('input[name="name"]').clear().type(newName);
            cy.get('input[name="phone"]').clear().type(newPhone);
            cy.get('button[type="submit"]').click();
            cy.contains('Settings updated successfully').should('exist');
            cy.contains(newName).should('exist');
            cy.contains(newPhone).should('exist');
        });

        it('should change admin password', () => {
            cy.navigateToAdminTab('settings');
            cy.get('[data-testid="change-password-button"]').click();
            const newPassword = 'newadminpass123';
            cy.get('input[name="currentPassword"]').type('123');
            cy.get('input[name="newPassword"]').type(newPassword);
            cy.get('input[name="confirmPassword"]').type(newPassword);
            cy.get('button[type="submit"]').click();
            cy.contains('Password updated successfully').should('exist');
        });
    });
}); 