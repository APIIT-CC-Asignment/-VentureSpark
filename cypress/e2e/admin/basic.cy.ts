import '../admin/auth-setup';

describe('Admin Dashboard Basic Tests', () => {
  beforeEach(() => {
    cy.adminLogin();
  });

  it('should load the admin dashboard', () => {
    // Basic verification that the page loads
    cy.get('body').should('be.visible');
    
    // Verify some basic navigation exists
    cy.get('nav').should('exist');
  });

  it('should display main content area', () => {
    // Check that main content area exists
    cy.get('.flex-1.overflow-y-auto').should('exist');
  });

  it('should display the sidebar with navigation options', () => {
    // Check that the sidebar contains the expected navigation items
    cy.get('nav div').eq(0).should('contain.text', 'Dashboard');
    cy.get('nav div').eq(1).should('contain.text', 'Users');
    cy.get('nav div').eq(2).should('contain.text', 'Services');
    cy.get('nav div').eq(3).should('contain.text', 'Bookings');
  });

  it('should have a working search input', () => {
    cy.get('input[placeholder="Search..."]').should('exist');
    cy.get('input[placeholder="Search..."]').type('test search');
    cy.get('input[placeholder="Search..."]').should('have.value', 'test search');
  });

  it('should have a notification button', () => {
    cy.get('button.p-2.text-gray-500.rounded-full').should('exist');
  });
}); 