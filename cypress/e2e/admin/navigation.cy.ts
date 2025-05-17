import '../admin/auth-setup';

describe('Admin Dashboard Navigation', () => {
  beforeEach(() => {
    cy.adminLogin();
  });

  it('should have a dashboard tab that is active by default', () => {
    // Check that dashboard tab is active
    cy.get('nav div').eq(0).should('have.class', 'bg-blue-50');
    // Check that dashboard content is visible
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4').should('be.visible');
  });

  it('should navigate to users tab when clicked', () => {
    // Click on users tab using our custom command
    cy.navigateToAdminTab('users');
    
    // Verify users tab is active
    cy.get('nav div').eq(1).should('have.class', 'bg-blue-50');
    
    // Verify users content is visible
    cy.contains('h1', 'Users Management').should('be.visible');
  });

  it('should navigate to services tab when clicked', () => {
    // Click on services tab using our custom command
    cy.navigateToAdminTab('services');
    
    // Verify services tab is active
    cy.get('nav div').eq(2).should('have.class', 'bg-blue-50');
    
    // Verify services content is visible
    cy.contains('h1', 'Services Management').should('be.visible');
  });

  it('should navigate to bookings tab when clicked', () => {
    // Click on bookings tab using our custom command
    cy.navigateToAdminTab('bookings');
    
    // Verify bookings tab is active
    cy.get('nav div').eq(3).should('have.class', 'bg-blue-50');
    
    // Verify bookings content is visible
    cy.contains('h1', 'Bookings Management').should('be.visible');
  });

  it('should toggle sidebar when sidebar toggle button is clicked', () => {
    // Get initial width
    cy.get('[class*="w-20"]').should('be.visible');
    
    // Click toggle button
    cy.get('button').contains('svg').first().click({force: true});
    cy.wait(300);
    
    // Check that sidebar is expanded
    cy.get('[class*="w-64"]').should('be.visible');
    
    // Click toggle button again
    cy.get('button').contains('svg').first().click({force: true});
    cy.wait(300);
    
    // Check that sidebar is collapsed again
    cy.get('[class*="w-20"]').should('be.visible');
  });
  
  it('should have working navigation between all tabs', () => {
    // Test navigation in sequence
    cy.navigateToAdminTab('users');
    cy.contains('h1', 'Users Management').should('be.visible');
    
    cy.navigateToAdminTab('services');
    cy.contains('h1', 'Services Management').should('be.visible');
    
    cy.navigateToAdminTab('bookings');
    cy.contains('h1', 'Bookings Management').should('be.visible');
    
    cy.navigateToAdminTab('dashboard');
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4').should('be.visible');
  });
}); 