import '../admin/auth-setup';

describe('Default Avatar Fix Tests', () => {
  beforeEach(() => {
    // Intercept requests to default-avatar.png and respond with a blank image
    cy.intercept('GET', '**/default-avatar.png', {
      statusCode: 200,
      body: '', // Empty response
      headers: {
        'Content-Type': 'image/png',
      },
    }).as('avatarRequest');
    
    cy.adminLogin();
  });

  it('should handle missing avatar images gracefully', () => {
    // Navigate to users tab where avatars are displayed
    cy.navigateToAdminTab('users');
    
    // Wait for the avatar request to be intercepted
    cy.wait('@avatarRequest', { timeout: 10000 }).then((interception) => {
      // Verify the request was intercepted and our mock response was used
      expect(interception.response.statusCode).to.equal(200);
    });
    
    // Verify the user list is displayed properly despite avatar issues
    cy.contains('h1', 'Users Management').should('be.visible');
    cy.get('table').should('be.visible');
  });
}); 