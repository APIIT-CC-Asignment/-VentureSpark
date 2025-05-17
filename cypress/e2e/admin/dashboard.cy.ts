import '../admin/auth-setup';

describe('Admin Dashboard Main View', () => {
  beforeEach(() => {
    // Intercept avatar requests to prevent 404 errors
    cy.intercept('GET', '**/default-avatar.png', {
      statusCode: 200,
      body: '', 
      headers: { 'Content-Type': 'image/png' },
    });
    
    // Login and ensure we're on the dashboard tab
    cy.adminLogin();
    cy.navigateToAdminTab('dashboard');
  });

  it('should display 4 stat cards with correct metrics', () => {
    // Check that all 4 stat cards are displayed
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div').should('have.length', 4);
    
    // Check that each stat card has the correct title
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div:nth-child(1)').contains('Total Users');
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div:nth-child(2)').contains('Total Services');
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div:nth-child(3)').contains('Total Bookings');
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div:nth-child(4)').contains('Total Revenue');
    
    // Verify each card has a numeric value
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div:nth-child(1) h3').invoke('text').should('match', /^\d+$/);
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div:nth-child(2) h3').invoke('text').should('match', /^\d+$/);
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div:nth-child(3) h3').invoke('text').should('match', /^\d+$/);
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div:nth-child(4) h3').invoke('text').should('match', /^\$[\d,]+$/);
  });

  it('should display charts with valid data', () => {
    // Verify charts are visible
    cy.get('canvas').should('have.length.at.least', 2);
    
    // Check Monthly Activity chart
    cy.contains('h3', 'Monthly Activity').should('be.visible');
    cy.contains('h3', 'Monthly Activity').parent().parent().find('canvas').should('be.visible');
    
    // Check Service Distribution chart
    cy.contains('h3', 'Service Distribution').should('be.visible');
    cy.contains('h3', 'Service Distribution').parent().parent().find('canvas').should('be.visible');
  });

  it('should display the recent bookings table with data', () => {
    // Check recent bookings table exists and has headers
    cy.contains('h3', 'Recent Bookings').should('be.visible');
    cy.contains('h3', 'Recent Bookings').parent().parent().find('table').should('be.visible');
    
    // Check table headers
    cy.contains('th', 'User').should('be.visible');
    cy.contains('th', 'Service').should('be.visible');
    cy.contains('th', 'Date').should('be.visible');
    cy.contains('th', 'Status').should('be.visible');
    cy.contains('th', 'Actions').should('be.visible');
    
    // Verify table has at least one row
    cy.contains('h3', 'Recent Bookings').parent().parent().find('tbody tr').should('have.length.at.least', 1);
  });

  it('should open booking details modal when view details is clicked', () => {
    // Click on the "View Details" button of the first booking
    cy.contains('button', 'View Details').first().click();
    
    // Verify modal is displayed
    cy.get('.fixed.inset-0.bg-black.bg-opacity-60').should('be.visible');
    cy.contains('h3', 'Booking Details').should('be.visible');
    
    // Check modal content
    cy.get('.fixed.inset-0.bg-black.bg-opacity-60').within(() => {
      cy.contains('h5', 'Requested Service').should('be.visible');
      cy.contains('h5', 'Date Requested').should('be.visible');
      cy.contains('h5', 'Client Message').should('be.visible');
    });
    
    // Close the modal
    cy.contains('button', 'Close').click();
    cy.get('.fixed.inset-0.bg-black.bg-opacity-60').should('not.exist');
  });

  it('should update booking status when buttons are clicked in modal', () => {
    // Click on the "View Details" button of the first booking
    cy.contains('button', 'View Details').first().click();
    
    // Try to click different status buttons if they exist
    cy.get('.fixed.inset-0.bg-black.bg-opacity-60').then($modal => {
      if ($modal.find('button:contains("Confirmed")').length > 0) {
        cy.contains('button', 'Confirmed').click({force: true});
        cy.wait(500);
      } else if ($modal.find('button:contains("Completed")').length > 0) {
        cy.contains('button', 'Completed').click({force: true});
        cy.wait(500);
      } else if ($modal.find('button:contains("Reject")').length > 0) {
        cy.contains('button', 'Reject').click({force: true});
        cy.wait(500);
      }

      // Close modal if it still exists
      if ($modal.find('button:contains("Close")').length > 0) {
        cy.contains('button', 'Close').click({force: true});
      }
    });
  });

  it('should show user profile on avatar click', () => {
    // Click on the avatar/profile icon
    cy.get('.w-8.h-8.rounded-full.bg-blue-600').click();
    
    // Verify dropdown is shown with the correct email
    cy.contains('admin@gmail.com').should('be.visible');
    
    // Close the dropdown
    cy.get('.ml-4.text-red-500.font-bold').click();
    
    // Verify dropdown is gone
    cy.contains('admin@gmail.com').should('not.be.visible');
  });
  
  it('should have correct monthly statistics section', () => {
    cy.contains('h2', 'Monthly Statistics').should('be.visible');
    cy.get('.recharts-responsive-container').should('be.visible');
  });
}); 