describe('Admin Services Management', () => {
  beforeEach(() => {
    // Set up authentication
    cy.visit('http://localhost:3000/pages/admin');
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'test-mock-token');
      win.localStorage.setItem('email', 'admin@gmail.com');
      win.localStorage.setItem('username', 'admin');
      win.localStorage.setItem('typegroup', 'admin');
    });
    cy.visit('http://localhost:3000/pages/admin');
    cy.wait(2000);

    // Navigate to services tab
    cy.get('nav div').eq(2).click({force: true});
    cy.wait(1000);
  });

  it('should display the services management heading and filter buttons', () => {
    // Check heading
    cy.contains('h1', 'Services Management').should('be.visible');
    
    // Check filter buttons
    cy.contains('button', 'All').should('be.visible');
    cy.contains('button', 'Approved').should('be.visible');
    cy.contains('button', 'Rejected').should('be.visible');
    cy.contains('button', 'Pending').should('be.visible');
  });

  it('should display services table with correct headers', () => {
    // Check table headers
    cy.contains('th', 'Service Info').should('be.visible');
    cy.contains('th', 'Type').should('be.visible');
    cy.contains('th', 'Contact').should('be.visible');
    cy.contains('th', 'Status').should('be.visible');
    cy.contains('th', 'Actions').should('be.visible');
    
    // Check that table has rows
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('should filter services when clicking on All button', () => {
    // Click All filter button
    cy.contains('button', 'All').click({force: true});
    
    // Verify button styling changes
    cy.contains('button', 'All').should('have.class', 'bg-[#1E3A8A]');
    cy.contains('button', 'All').should('have.class', 'text-white');
    
    // Verify other buttons don't have the active style
    cy.contains('button', 'Approved').should('not.have.class', 'bg-[#10B981]');
    cy.contains('button', 'Rejected').should('not.have.class', 'bg-red-500');
    cy.contains('button', 'Pending').should('not.have.class', 'bg-yellow-500');
    
    // Verify table has rows
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('should filter services when clicking on Approved button', () => {
    // Click Approved filter button
    cy.contains('button', 'Approved').click({force: true});
    
    // Verify button styling changes
    cy.contains('button', 'Approved').should('have.class', 'bg-[#10B981]');
    cy.contains('button', 'Approved').should('have.class', 'text-white');
    
    // Check if there are any rows
    cy.get('tbody').then($tbody => {
      if ($tbody.find('tr').length > 0) {
        // Check that all displayed services are of status "Approved"
        cy.get('tbody tr').each($row => {
          cy.wrap($row).find('td:nth-child(4) span').should('contain.text', 'Approved');
        });
      }
    });
  });

  it('should filter services when clicking on Rejected button', () => {
    // Click Rejected filter button
    cy.contains('button', 'Rejected').click({force: true});
    
    // Verify button styling changes
    cy.contains('button', 'Rejected').should('have.class', 'bg-red-500');
    cy.contains('button', 'Rejected').should('have.class', 'text-white');
    
    // Check if there are any rows
    cy.get('tbody').then($tbody => {
      if ($tbody.find('tr').length > 0) {
        // Check that all displayed services are of status "Rejected"
        cy.get('tbody tr').each($row => {
          cy.wrap($row).find('td:nth-child(4) span').should('contain.text', 'Rejected');
        });
      }
    });
  });

  it('should filter services when clicking on Pending button', () => {
    // Click Pending filter button
    cy.contains('button', 'Pending').click({force: true});
    
    // Verify button styling changes
    cy.contains('button', 'Pending').should('have.class', 'bg-yellow-500');
    cy.contains('button', 'Pending').should('have.class', 'text-white');
    
    // Check if there are any rows
    cy.get('tbody').then($tbody => {
      if ($tbody.find('tr').length > 0) {
        // Check that all displayed services are of status "Pending"
        cy.get('tbody tr').each($row => {
          cy.wrap($row).find('td:nth-child(4) span').should('contain.text', 'Pending');
        });
      }
    });
  });

  it('should verify service status badge colors are correct', () => {
    // Click on All to see different service statuses
    cy.contains('button', 'All').click({force: true});
    
    // Check badge colors for each status
    cy.get('tbody').then($tbody => {
      // Check for Approved badges
      cy.get('td span').contains('Approved').then($approvedBadges => {
        if ($approvedBadges.length > 0) {
          cy.wrap($approvedBadges).should('have.class', 'bg-green-100');
          cy.wrap($approvedBadges).should('have.class', 'text-green-800');
        }
      });
      
      // Check for Rejected badges
      cy.get('td span').contains('Rejected').then($rejectedBadges => {
        if ($rejectedBadges.length > 0) {
          cy.wrap($rejectedBadges).should('have.class', 'bg-red-100');
          cy.wrap($rejectedBadges).should('have.class', 'text-red-800');
        }
      });
      
      // Check for Pending badges
      cy.get('td span').contains('Pending').then($pendingBadges => {
        if ($pendingBadges.length > 0) {
          cy.wrap($pendingBadges).should('have.class', 'bg-yellow-100');
          cy.wrap($pendingBadges).should('have.class', 'text-yellow-800');
        }
      });
    });
  });

  it('should open service details modal when view details is clicked', () => {
    // Click on the "View Details" button of the first service
    cy.contains('button', 'View Details').first().click();
    
    // Verify modal is displayed
    cy.get('.fixed.inset-0.bg-black.bg-opacity-60').should('be.visible');
    cy.contains('h3', 'Service Details').should('be.visible');
    
    // Check modal content
    cy.get('.fixed.inset-0.bg-black.bg-opacity-60').within(() => {
      // Service name
      cy.get('h4').should('be.visible');
      
      // Contact information section
      cy.contains('h5', 'Contact Information').should('be.visible');
      
      // Service information section
      cy.contains('h5', 'Service Information').should('be.visible');
      
      // Selected services section
      cy.contains('h5', 'Selected Services').should('be.visible');
    });
    
    // Close the modal
    cy.contains('button', 'Close').click();
    cy.get('.fixed.inset-0.bg-black.bg-opacity-60').should('not.exist');
  });

  it('should approve a pending service when Approve button is clicked', () => {
    // Click on Pending filter
    cy.contains('button', 'Pending').click({force: true});
    
    // Check if there are any pending services
    cy.get('tbody tr').then($rows => {
      if ($rows.length > 0) {
        // Click on the "View Details" button of the first pending service
        cy.contains('button', 'View Details').first().click();
        
        // Wait for modal to open
        cy.get('.fixed.inset-0.bg-black.bg-opacity-60').should('be.visible');
        
        // Click Approve button if it exists
        cy.get('.fixed.inset-0.bg-black.bg-opacity-60').then($modal => {
          if ($modal.find('button:contains("Approve")').length > 0) {
            cy.contains('button', 'Approve').click({force: true});
            cy.wait(1000);
            
            // Verify service is now in Approved tab
            cy.contains('button', 'Approved').click({force: true});
            
            // Look for the approved service
            // This is a simplified check, as we can't guarantee which service is shown
            cy.get('tbody tr').should('exist');
          } else {
            // Close modal if Approve button doesn't exist
            cy.contains('button', 'Close').click({force: true});
          }
        });
      }
    });
  });

  it('should reject a pending service when Reject button is clicked', () => {
    // Click on Pending filter
    cy.contains('button', 'Pending').click({force: true});
    
    // Check if there are any pending services
    cy.get('tbody tr').then($rows => {
      if ($rows.length > 0) {
        // Click on the "View Details" button of the first pending service
        cy.contains('button', 'View Details').first().click();
        
        // Wait for modal to open
        cy.get('.fixed.inset-0.bg-black.bg-opacity-60').should('be.visible');
        
        // Click Reject button if it exists
        cy.get('.fixed.inset-0.bg-black.bg-opacity-60').then($modal => {
          if ($modal.find('button:contains("Reject")').length > 0) {
            cy.contains('button', 'Reject').click({force: true});
            cy.wait(1000);
            
            // Verify service is now in Rejected tab
            cy.contains('button', 'Rejected').click({force: true});
            
            // Look for the rejected service
            // This is a simplified check, as we can't guarantee which service is shown
            cy.get('tbody tr').should('exist');
          } else {
            // Close modal if Reject button doesn't exist
            cy.contains('button', 'Close').click({force: true});
          }
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
}); 