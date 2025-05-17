import '../admin/auth-setup';

describe('Admin Users Management', () => {
  beforeEach(() => {
    // Intercept avatar requests to prevent 404 errors
    cy.intercept('GET', '**/default-avatar.png', {
      statusCode: 200,
      body: '', 
      headers: { 'Content-Type': 'image/png' },
    });
    
    // Login and navigate to users tab
    cy.adminLogin();
    cy.navigateToAdminTab('users');
  });

  it('should display the users management heading and filter buttons', () => {
    // Check heading
    cy.contains('h1', 'Users Management').should('be.visible');
    
    // Check filter buttons
    cy.contains('button', 'All').should('be.visible');
    cy.contains('button', 'Regular Users').should('be.visible');
    cy.contains('button', 'Vendors').should('be.visible');
    cy.contains('button', 'Administrators').should('be.visible');
  });

  it('should display users table with correct headers', () => {
    // Check table headers
    cy.contains('th', 'Name & Email').should('be.visible');
    cy.contains('th', 'User Type').should('be.visible');
    cy.contains('th', 'Joined Date').should('be.visible');
    cy.contains('th', 'Status').should('be.visible');
    cy.contains('th', 'Actions').should('be.visible');
    
    // Check that table has rows
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('should filter users when clicking on All button', () => {
    // Click All filter button
    cy.contains('button', 'All').click({force: true});
    
    // Verify button styling changes
    cy.contains('button', 'All').should('have.class', 'bg-[#1E3A8A]');
    cy.contains('button', 'All').should('have.class', 'text-white');
    
    // Verify other buttons don't have the active style
    cy.contains('button', 'Regular Users').should('not.have.class', 'bg-[#10B981]');
    cy.contains('button', 'Vendors').should('not.have.class', 'bg-blue-500');
    cy.contains('button', 'Administrators').should('not.have.class', 'bg-yellow-500');
    
    // Verify table has rows
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('should filter users when clicking on Regular Users button', () => {
    // Click Regular Users filter button
    cy.contains('button', 'Regular Users').click({force: true});
    
    // Verify button styling changes
    cy.contains('button', 'Regular Users').should('have.class', 'bg-[#10B981]');
    cy.contains('button', 'Regular Users').should('have.class', 'text-white');
    
    // Check if there are any rows
    cy.get('tbody').then($tbody => {
      if ($tbody.find('tr').length > 0) {
        // Check that all displayed users are of type "client"
        cy.get('tbody tr').each($row => {
          cy.wrap($row).find('td:nth-child(2) span').should('contain.text', 'client');
        });
      }
    });
  });

  it('should filter users when clicking on Vendors button', () => {
    // Click Vendors filter button
    cy.contains('button', 'Vendors').click({force: true});
    
    // Verify button styling changes
    cy.contains('button', 'Vendors').should('have.class', 'bg-blue-500');
    cy.contains('button', 'Vendors').should('have.class', 'text-white');
    
    // Check if there are any rows
    cy.get('tbody').then($tbody => {
      if ($tbody.find('tr').length > 0) {
        // Check that all displayed users are of type "vendor"
        cy.get('tbody tr').each($row => {
          cy.wrap($row).find('td:nth-child(2) span').should('contain.text', 'vendor');
        });
      }
    });
  });

  it('should filter users when clicking on Administrators button', () => {
    // Click Administrators filter button
    cy.contains('button', 'Administrators').click({force: true});
    
    // Verify button styling changes
    cy.contains('button', 'Administrators').should('have.class', 'bg-yellow-500');
    cy.contains('button', 'Administrators').should('have.class', 'text-white');
    
    // Check if there are any rows
    cy.get('tbody').then($tbody => {
      if ($tbody.find('tr').length > 0) {
        // Check that all displayed users are of type "Admin"
        cy.get('tbody tr').each($row => {
          cy.wrap($row).find('td:nth-child(2) span').should('contain.text', 'Admin');
        });
      }
    });
  });

  it('should verify pagination works', () => {
    // Check if pagination exists
    cy.get('nav[aria-label="Pagination"]').then($pagination => {
      if ($pagination.length > 0) {
        // Try clicking on page 1
        cy.contains('button', '1').click({force: true});
        cy.wait(500);
        
        // Check if there's a next button and it's not disabled
        cy.get('button[aria-label="Next"]').then($nextBtn => {
          if ($nextBtn.length > 0 && !$nextBtn.prop('disabled')) {
            // Click next button
            cy.wrap($nextBtn).click({force: true});
            cy.wait(500);
            
            // Verify we're on a different page
            cy.get('tbody tr').should('exist');
          }
        });
      }
    });
  });

  it('should have functioning Edit and Delete buttons for users', () => {
    // Check if there are any rows
    cy.get('tbody tr').then($rows => {
      if ($rows.length > 0) {
        // Check that Edit button exists
        cy.get('tbody tr:first-child').contains('button', 'Edit').should('be.visible');
        
        // Check that Delete button exists
        cy.get('tbody tr:first-child').contains('button', 'Delete').should('be.visible');
      }
    });
  });

  it('should verify user type badge colors are correct', () => {
    // Click on All to see different user types
    cy.contains('button', 'All').click({force: true});
    
    // Check badge colors for each user type
    cy.get('tbody').then($tbody => {
      // Check for Admin badges
      cy.get('td span').contains('Admin').then($adminBadges => {
        if ($adminBadges.length > 0) {
          cy.wrap($adminBadges).should('have.class', 'bg-red-100');
          cy.wrap($adminBadges).should('have.class', 'text-red-800');
        }
      });
      
      // Check for vendor badges
      cy.get('td span').contains('vendor').then($vendorBadges => {
        if ($vendorBadges.length > 0) {
          cy.wrap($vendorBadges).should('have.class', 'bg-blue-100');
          cy.wrap($vendorBadges).should('have.class', 'text-blue-800');
        }
      });
      
      // Check for client badges
      cy.get('td span').contains('client').then($clientBadges => {
        if ($clientBadges.length > 0) {
          cy.wrap($clientBadges).should('have.class', 'bg-green-100');
          cy.wrap($clientBadges).should('have.class', 'text-green-800');
        }
      });
    });
  });

  it('should render the user initials correctly', () => {
    // Check if there are any rows with user initials
    cy.get('tbody tr:first-child .w-10.h-10.rounded-full').should('exist');
    
    // Check that the initials container exists and has content
    cy.get('tbody tr:first-child .w-10.h-10.rounded-full span').should('exist');
  });
}); 