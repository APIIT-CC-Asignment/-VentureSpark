import '../admin/auth-setup';

describe('Admin Dashboard General Functionality', () => {
  beforeEach(() => {
    // Intercept avatar requests to prevent 404 errors
    cy.intercept('GET', '**/default-avatar.png', {
      statusCode: 200,
      body: '', 
      headers: { 'Content-Type': 'image/png' },
    });
    
    cy.adminLogin();
  });

  it('should have a responsive layout', () => {
    // Test desktop view first
    cy.viewport(1280, 800);
    cy.get('[class*="w-64"], [class*="w-20"]').should('be.visible');
    
    // Test tablet view
    cy.viewport(768, 1024);
    cy.get('body').should('be.visible');
    
    // Test mobile view
    cy.viewport(375, 667);
    cy.get('body').should('be.visible');
  });

  it('should allow navigation through all tabs', () => {
    // Test navigation through all tabs
    cy.navigateToAdminTab('dashboard');
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4').should('exist');
    
    cy.navigateToAdminTab('users');
    cy.contains('h1', 'Users Management').should('be.visible');
    
    cy.navigateToAdminTab('services');
    cy.contains('h1', 'Services Management').should('be.visible');
    
    cy.navigateToAdminTab('bookings');
    cy.contains('h1', 'Bookings Management').should('be.visible');
  });

  it('should have a working search functionality', () => {
    cy.get('input[placeholder="Search..."]').should('exist');
    cy.get('input[placeholder="Search..."]').type('test search');
    cy.get('input[placeholder="Search..."]').should('have.value', 'test search');
    cy.get('input[placeholder="Search..."]').clear();
  });

  it('should show user profile dropdown when clicked', () => {
    // Click on the avatar/profile icon
    cy.get('.w-8.h-8.rounded-full.bg-blue-600').click();
    
    // Verify dropdown is shown with the correct email
    cy.contains('admin@gmail.com').should('be.visible');
    
    // Close the dropdown
    cy.get('.ml-4.text-red-500.font-bold').click();
    
    // Verify dropdown is gone
    cy.contains('admin@gmail.com').should('not.be.visible');
  });
  
  it('should toggle sidebar when button is clicked', () => {
    // Test sidebar toggle functionality if available
    cy.get('button').first().click({force: true});
    cy.wait(300);
    cy.get('button').first().click({force: true});
    cy.wait(300);
  });
});