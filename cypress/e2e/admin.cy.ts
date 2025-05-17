describe('User Management Dashboard', () => {
  beforeEach(() => {
    // Make sure your server is running before executing tests
    // Update this URL to match your application's structure
    cy.visit('http://localhost:3002/pages/admin');
    
    // If you need to navigate to a specific page after visiting the base URL
    // For example, if you have a menu navigation:
    // cy.get('a[href="/pages/admin"]').click();
    
    // Ensure we're on the users tab (if your app has a tab navigation system)
    cy.contains('Users Management').should('be.visible');
  });

  it('should display all users when the "All" button is clicked', () => {
    // Click on the "All" button
    cy.contains('button', 'All').click();
    
    // Verify the "All" button is active (has the correct styling)
    cy.contains('button', 'All')
      .should('have.class', 'bg-[#1E3A8A]')
      .should('have.class', 'text-white');
    
    // Verify that all users are displayed in the table
    // This checks users of all types: client, vendor, and Admin
    cy.get('tbody tr').should('have.length.at.least', 1);
    cy.contains('td', 'client').should('exist');
    cy.contains('td', 'vendor').should('exist');
    cy.contains('td', 'Admin').should('exist');
  });

  it('should filter and display only regular users when the "Regular Users" button is clicked', () => {
    // Click on the "Regular Users" button
    cy.contains('button', 'Regular Users').click();
    
    // Verify the "Regular Users" button is active (has the correct styling)
    cy.contains('button', 'Regular Users')
      .should('have.class', 'bg-[#10B981]')
      .should('have.class', 'text-white');
    
    // Verify that only regular users (with typegroup "client") are displayed
    cy.get('tbody tr').each(($row) => {
      // Within each row, check that the user type cell contains "client"
      cy.wrap($row).find('td:nth-child(2) span').should('contain.text', 'client');
    });
    
    // Verify no vendors or admins are displayed
    cy.contains('td span', 'vendor').should('not.exist');
    cy.contains('td span', 'Admin').should('not.exist');
  });

  it('should filter and display only vendors when the "Vendors" button is clicked', () => {
    // Click on the "Vendors" button
    cy.contains('button', 'Vendors').click();
    
    // Verify the "Vendors" button is active (has the correct styling)
    cy.contains('button', 'Vendors')
      .should('have.class', 'bg-blue-500')
      .should('have.class', 'text-white');
    
    // Verify that only vendors (with typegroup "vendor") are displayed
    cy.get('tbody tr').each(($row) => {
      // Within each row, check that the user type cell contains "vendor"
      cy.wrap($row).find('td:nth-child(2) span').should('contain.text', 'vendor');
    });
    
    // Verify no clients or admins are displayed
    cy.contains('td span', 'client').should('not.exist');
    cy.contains('td span', 'Admin').should('not.exist');
  });

  it('should filter and display only administrators when the "Administrators" button is clicked', () => {
    // Click on the "Administrators" button
    cy.contains('button', 'Administrators').click();
    
    // Verify the "Administrators" button is active (has the correct styling)
    cy.contains('button', 'Administrators')
      .should('have.class', 'bg-yellow-500')
      .should('have.class', 'text-white');
    
    // Verify that only administrators (with typegroup "Admin") are displayed
    cy.get('tbody tr').each(($row) => {
      // Within each row, check that the user type cell contains "Admin"
      cy.wrap($row).find('td:nth-child(2) span').should('contain.text', 'Admin');
    });
    
    // Verify no clients or vendors are displayed
    cy.contains('td span', 'client').should('not.exist');
    cy.contains('td span', 'vendor').should('not.exist');
  });

  it('should maintain filter selection when navigating through pagination', () => {
    // This test is relevant if you have pagination and enough users to span multiple pages
    
    // First, select a filter (e.g., Regular Users)
    cy.contains('button', 'Regular Users').click();
    
    // If there's pagination and a next page button is available and not disabled
    cy.get('nav button:contains("Next")').then($button => {
      if (!$button.prop('disabled') && $button.is(':visible')) {
        // Click on next page
        cy.wrap($button).click();
        
        // Verify we're still showing only regular users on the new page
        cy.get('tbody tr').each(($row) => {
          cy.wrap($row).find('td:nth-child(2) span').should('contain.text', 'client');
        });
        
        // Check that the Regular Users button is still active
        cy.contains('button', 'Regular Users')
          .should('have.class', 'bg-[#10B981]')
          .should('have.class', 'text-white');
      }
    });
  });

  it('should show correct user counts in pagination info text', () => {
    // Test for the All filter
    cy.contains('button', 'All').click();
    cy.get('p.text-sm.text-gray-700').should('contain', 'results');
    
    // Test for the Regular Users filter
    cy.contains('button', 'Regular Users').click();
    cy.contains('p', /Showing.*results/).should('exist');
    
    // Test for the Vendors filter
    cy.contains('button', 'Vendors').click();
    cy.contains('p', /Showing.*results/).should('exist');
    
    // Test for the Administrators filter
    cy.contains('button', 'Administrators').click();
    cy.contains('p', /Showing.*results/).should('exist');
  });

  // Additional test for user interface elements
  it('should display all required UI elements in the user management dashboard', () => {
    // Verify the heading
    cy.contains('h1', 'Users Management').should('be.visible');
    
    // Verify filter buttons
    cy.contains('button', 'All').should('be.visible');
    cy.contains('button', 'Regular Users').should('be.visible');
    cy.contains('button', 'Vendors').should('be.visible');
    cy.contains('button', 'Administrators').should('be.visible');
    
    // Verify table headers
    cy.contains('th', 'Name & Email').should('be.visible');
    cy.contains('th', 'User Type').should('be.visible');
    cy.contains('th', 'Joined Date').should('be.visible');
    cy.contains('th', 'Status').should('be.visible');
    cy.contains('th', 'Actions').should('be.visible');
    
    // Verify that table has at least one row
    cy.get('tbody tr').should('have.length.at.least', 1);
    
    // Verify that each row has an Edit and Delete button
    cy.get('tbody tr:first-child').within(() => {
      cy.contains('button', 'Edit').should('be.visible');
      cy.contains('button', 'Delete').should('be.visible');
    });
  });
});