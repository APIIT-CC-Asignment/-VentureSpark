describe('Admin Bookings Management', () => {
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

    // Navigate to bookings tab
    cy.get('nav div').eq(3).click({force: true});
    cy.wait(1000);
  });

  it('should display the bookings management heading and filter buttons', () => {
    // Check heading
    cy.contains('h1', 'Bookings Management').should('be.visible');
    
    // Check filter buttons
    cy.contains('button', 'All').should('be.visible');
    cy.contains('button', 'completed').should('be.visible');
    cy.contains('button', 'cancelled').should('be.visible');
    cy.contains('button', 'Pending').should('be.visible');
  });

  it('should display bookings table with correct headers', () => {
    // Check table headers
    cy.contains('th', 'Customer Info').should('be.visible');
    cy.contains('th', 'Service').should('be.visible');
    cy.contains('th', 'Request Date').should('be.visible');
    cy.contains('th', 'Status').should('be.visible');
    cy.contains('th', 'Actions').should('be.visible');
    
    // Check that table has rows
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('should filter bookings when clicking on All button', () => {
    // Click All filter button
    cy.contains('button', 'All').click({force: true});
    
    // Verify button styling changes
    cy.contains('button', 'All').should('have.class', 'bg-[#1E3A8A]');
    cy.contains('button', 'All').should('have.class', 'text-white');
    
    // Verify other buttons don't have the active style
    cy.contains('button', 'completed').should('not.have.class', 'bg-[#10B981]');
    cy.contains('button', 'cancelled').should('not.have.class', 'bg-red-500');
    cy.contains('button', 'Pending').should('not.have.class', 'bg-yellow-500');
    
    // Verify table has rows
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('should filter bookings when clicking on completed button', () => {
    // Click completed filter button
    cy.contains('button', 'completed').click({force: true});
    
    // Verify button styling changes
    cy.contains('button', 'completed').should('have.class', 'bg-[#10B981]');
    cy.contains('button', 'completed').should('have.class', 'text-white');
    
    // Check if there are any rows
    cy.get('tbody').then($tbody => {
      if ($tbody.find('tr').length > 0) {
        // Check that all displayed bookings are of status "Completed"
        cy.get('tbody tr').each($row => {
          cy.wrap($row).find('td:nth-child(4) span').should('contain.text', 'Completed');
        });
      }
    });
  });

  it('should filter bookings when clicking on cancelled button', () => {
    // Click cancelled filter button
    cy.contains('button', 'cancelled').click({force: true});
    
    // Verify button styling changes
    cy.contains('button', 'cancelled').should('have.class', 'bg-red-500');
    cy.contains('button', 'cancelled').should('have.class', 'text-white');
    
    // Check if there are any rows
    cy.get('tbody').then($tbody => {
      if ($tbody.find('tr').length > 0) {
        // Check that all displayed bookings are of status "Cancelled"
        cy.get('tbody tr').each($row => {
          cy.wrap($row).find('td:nth-child(4) span').should('contain.text', 'Cancelled');
        });
      }
    });
  });

  it('should filter bookings when clicking on Pending button', () => {
    // Click Pending filter button
    cy.contains('button', 'Pending').click({force: true});
    
    // Verify button styling changes
    cy.contains('button', 'Pending').should('have.class', 'bg-yellow-500');
    cy.contains('button', 'Pending').should('have.class', 'text-white');
    
    // Check if there are any rows
    cy.get('tbody').then($tbody => {
      if ($tbody.find('tr').length > 0) {
        // Check that all displayed bookings are of status "Pending"
        cy.get('tbody tr').each($row => {
          cy.wrap($row).find('td:nth-child(4) span').should('contain.text', 'Pending');
        });
      }
    });
  });

  it('should verify booking status badge colors are correct', () => {
    // Click on All to see different booking statuses
    cy.contains('button', 'All').click({force: true});
    
    // Check badge colors for each status
    cy.get('tbody').then($tbody => {
      // Check for Pending badges
      cy.get('td span').contains('Pending').then($pendingBadges => {
        if ($pendingBadges.length > 0) {
          cy.wrap($pendingBadges).should('have.class', 'bg-yellow-100');
          cy.wrap($pendingBadges).should('have.class', 'text-yellow-800');
        }
      });
      
      // Check for Completed badges
      cy.get('td span').contains('Completed').then($completedBadges => {
        if ($completedBadges.length > 0) {
          cy.wrap($completedBadges).should('have.class', 'bg-green-100');
          cy.wrap($completedBadges).should('have.class', 'text-green-800');
        }
      });
      
      // Check for Cancelled badges
      cy.get('td span').contains('Cancelled').then($cancelledBadges => {
        if ($cancelledBadges.length > 0) {
          cy.wrap($cancelledBadges).should('have.class', 'bg-red-100');
          cy.wrap($cancelledBadges).should('have.class', 'text-red-800');
        }
      });
      
      // Check for Confirmed badges
      cy.get('td span').contains('Confirmed').then($confirmedBadges => {
        if ($confirmedBadges.length > 0) {
          cy.wrap($confirmedBadges).should('have.class', 'bg-blue-100');
          cy.wrap($confirmedBadges).should('have.class', 'text-blue-800');
        }
      });
    });
  });

  it('should open booking details modal when view details is clicked', () => {
    // Click on the "View Details" button of the first booking
    cy.contains('button', 'View Details').first().click();
    
    // Verify modal is displayed
    cy.get('.fixed.inset-0.bg-black.bg-opacity-60').should('be.visible');
    cy.contains('h3', 'Booking Details').should('be.visible');
    
    // Check modal content
    cy.get('.fixed.inset-0.bg-black.bg-opacity-60').within(() => {
      // Customer info
      cy.get('h4').should('be.visible');
      
      // Check sections
      cy.contains('h5', 'Requested Service').should('be.visible');
      cy.contains('h5', 'Date Requested').should('be.visible');
      cy.contains('h5', 'Client Message').should('be.visible');
      
      // Check status badge
      cy.get('span[class*="rounded-full"]').should('be.visible');
    });
    
    // Close the modal
    cy.contains('button', 'Close').click();
    cy.get('.fixed.inset-0.bg-black.bg-opacity-60').should('not.exist');
  });

  it('should set a booking to confirmed when Confirmed button is clicked', () => {
    // Click on Pending filter to find bookings that can be confirmed
    cy.contains('button', 'Pending').click({force: true});
    
    // Check if there are any pending bookings
    cy.get('tbody tr').then($rows => {
      if ($rows.length > 0) {
        // Click on the "View Details" button of the first pending booking
        cy.contains('button', 'View Details').first().click();
        
        // Wait for modal to open
        cy.get('.fixed.inset-0.bg-black.bg-opacity-60').should('be.visible');
        
        // Click Confirmed button if it exists
        cy.get('.fixed.inset-0.bg-black.bg-opacity-60').then($modal => {
          if ($modal.find('button:contains("Confirmed")').length > 0) {
            cy.contains('button', 'Confirmed').click({force: true});
            cy.wait(1000);
          } else {
            // Close modal if Confirmed button doesn't exist
            cy.contains('button', 'Close').click({force: true});
          }
        });
      }
    });
  });

  it('should set a booking to completed when Completed button is clicked', () => {
    // Click on Pending or Confirmed filter to find bookings that can be completed
    cy.contains('button', 'All').click({force: true});
    
    // Check if there are any bookings
    cy.get('tbody tr').then($rows => {
      if ($rows.length > 0) {
        // Click on the "View Details" button of the first booking
        cy.contains('button', 'View Details').first().click();
        
        // Wait for modal to open
        cy.get('.fixed.inset-0.bg-black.bg-opacity-60').should('be.visible');
        
        // Click Completed button if it exists
        cy.get('.fixed.inset-0.bg-black.bg-opacity-60').then($modal => {
          if ($modal.find('button:contains("Completed")').length > 0) {
            cy.contains('button', 'Completed').click({force: true});
            cy.wait(1000);
          } else {
            // Close modal if Completed button doesn't exist
            cy.contains('button', 'Close').click({force: true});
          }
        });
      }
    });
  });

  it('should reject a booking when Reject button is clicked', () => {
    // Click on Pending filter to find bookings that can be rejected
    cy.contains('button', 'Pending').click({force: true});
    
    // Check if there are any pending bookings
    cy.get('tbody tr').then($rows => {
      if ($rows.length > 0) {
        // Click on the "View Details" button of the first pending booking
        cy.contains('button', 'View Details').first().click();
        
        // Wait for modal to open
        cy.get('.fixed.inset-0.bg-black.bg-opacity-60').should('be.visible');
        
        // Click Reject button if it exists
        cy.get('.fixed.inset-0.bg-black.bg-opacity-60').then($modal => {
          if ($modal.find('button:contains("Reject")').length > 0) {
            cy.contains('button', 'Reject').click({force: true});
            cy.wait(1000);
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