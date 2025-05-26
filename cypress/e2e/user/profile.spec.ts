describe('User Profile Management', () => {
    const testEmail = 'test@example.com';
    const testPassword = 'testpassword123';

    beforeEach(() => {
        // Create a test user and login
        cy.adminLogin();
        cy.visit('/admin/users');
        cy.get('[data-testid="add-user-button"]').click();
        cy.get('input[name="email"]').type(testEmail);
        cy.get('input[name="password"]').type(testPassword);
        cy.get('input[name="name"]').type('Test User');
        cy.get('select[name="role"]').select('user');
        cy.get('button[type="submit"]').click();

        // Login as the test user
        cy.visit('/pages/loginpage');
        cy.userLogin(testEmail, testPassword);
    });

    it('should update user profile information', () => {
        cy.visit('/profile');

        const newName = 'Updated User Name';
        const newBio = 'This is my new bio';

        cy.get('input[name="name"]').clear().type(newName);
        cy.get('textarea[name="bio"]').clear().type(newBio);
        cy.get('button[type="submit"]').click();

        // Verify changes
        cy.contains(newName).should('exist');
        cy.contains(newBio).should('exist');
    });

    it('should update user password', () => {
        cy.visit('/profile');
        cy.get('[data-testid="change-password-button"]').click();

        const newPassword = 'newpassword123';
        cy.get('input[name="currentPassword"]').type(testPassword);
        cy.get('input[name="newPassword"]').type(newPassword);
        cy.get('input[name="confirmPassword"]').type(newPassword);
        cy.get('button[type="submit"]').click();

        // Verify password change
        cy.contains('Password updated successfully').should('exist');

        // Test new password
        cy.get('[data-testid="logout-button"]').click();
        cy.visit('/pages/loginpage');
        cy.userLogin(testEmail, newPassword);
        cy.url().should('include', '/dashboard');
    });

    it('should handle invalid profile updates', () => {
        cy.visit('/profile');

        // Try to submit empty name
        cy.get('input[name="name"]').clear();
        cy.get('button[type="submit"]').click();
        cy.contains('Name is required').should('exist');
    });
}); 