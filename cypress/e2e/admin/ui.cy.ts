describe('Admin Dashboard UI Elements', () => {
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
  });

  it('should verify sidebar styling and colors', () => {
    // Verify sidebar has gradient background
    cy.get('.bg-gradient-to-b.from-\\[\\#1E3A8A\\].to-\\[\\#10B981\\]').should('be.visible');
    
    // Verify sidebar width when collapsed
    cy.get('.w-20').should('be.visible');
    
    // Expand sidebar and verify width
    cy.get('button').contains('svg').first().click({force: true});
    cy.wait(300);
    cy.get('.w-64').should('be.visible');
    
    // Check nav items have icons
    cy.get('nav div .text-black').should('have.length.at.least', 4);
  });

  it('should verify header styling and colors', () => {
    // Check header has shadow
    cy.get('header.bg-white.shadow-sm').should('be.visible');
    
    // Check search bar styling
    cy.get('input[placeholder="Search..."]').should('have.class', 'bg-gray-50');
    cy.get('input[placeholder="Search..."]').should('have.class', 'rounded-lg');
    
    // Check notification bell
    cy.get('button[class*="p-2 text-gray-500 rounded-full"]').should('be.visible');
    
    // Check avatar styling
    cy.get('.w-8.h-8.rounded-full.bg-blue-600').should('be.visible');
  });

  it('should verify dashboard cards have correct styling', () => {
    // Check all 4 stat cards
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div').should('have.length', 4);
    
    // Check each card has rounded corners
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div').each($card => {
      cy.wrap($card).should('have.class', 'rounded-xl');
      cy.wrap($card).should('have.class', 'shadow-sm');
    });
    
    // Check icons have colored backgrounds
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div:nth-child(1) .bg-blue-50').should('be.visible');
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div:nth-child(2) .bg-purple-50').should('be.visible');
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div:nth-child(3) .bg-yellow-50').should('be.visible');
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div:nth-child(4) .bg-green-50').should('be.visible');
  });

  it('should verify chart containers have correct styling', () => {
    // Check chart containers
    cy.contains('h3', 'Monthly Activity').parent().parent().should('have.class', 'bg-white');
    cy.contains('h3', 'Monthly Activity').parent().parent().should('have.class', 'rounded-xl');
    cy.contains('h3', 'Monthly Activity').parent().parent().should('have.class', 'shadow-sm');
    
    cy.contains('h3', 'Service Distribution').parent().parent().should('have.class', 'bg-white');
    cy.contains('h3', 'Service Distribution').parent().parent().should('have.class', 'rounded-xl');
    cy.contains('h3', 'Service Distribution').parent().parent().should('have.class', 'shadow-sm');
  });

  it('should verify table styling in dashboard', () => {
    // Check recent bookings table container
    cy.contains('h3', 'Recent Bookings').parent().parent().should('have.class', 'bg-white');
    cy.contains('h3', 'Recent Bookings').parent().parent().should('have.class', 'rounded-xl');
    cy.contains('h3', 'Recent Bookings').parent().parent().should('have.class', 'shadow-sm');
    
    // Check table headers
    cy.contains('h3', 'Recent Bookings').parent().parent().find('th').each($th => {
      cy.wrap($th).should('have.class', 'px-6');
      cy.wrap($th).should('have.class', 'py-3');
      cy.wrap($th).should('have.class', 'text-left');
      cy.wrap($th).should('have.class', 'text-xs');
      cy.wrap($th).should('have.class', 'font-medium');
      cy.wrap($th).should('have.class', 'text-gray-500');
      cy.wrap($th).should('have.class', 'uppercase');
      cy.wrap($th).should('have.class', 'tracking-wider');
    });
    
    // Check table rows
    cy.contains('h3', 'Recent Bookings').parent().parent().find('tbody tr').each($tr => {
      cy.wrap($tr).should('have.class', 'bg-white');
    });
  });

  it('should verify status badges have correct styling', () => {
    // Go to users tab to check user type badges
    cy.get('nav div').eq(1).click({force: true});
    cy.wait(500);
    
    // Check user type badges
    cy.get('td span[class*="rounded-full"]').should('have.length.at.least', 1);
    cy.get('td span[class*="rounded-full"]').each($badge => {
      cy.wrap($badge).should('have.class', 'px-2');
      cy.wrap($badge).should('have.class', 'py-1');
      cy.wrap($badge).should('have.class', 'inline-flex');
      cy.wrap($badge).should('have.class', 'text-xs');
      cy.wrap($badge).should('have.class', 'leading-5');
      cy.wrap($badge).should('have.class', 'font-semibold');
      cy.wrap($badge).should('have.class', 'rounded-full');
    });
  });

  it('should verify filter buttons have correct styling', () => {
    // Go to services tab to check filter buttons
    cy.get('nav div').eq(2).click({force: true});
    cy.wait(500);
    
    // Check inactive button styling
    cy.contains('button', 'All').should('have.class', 'bg-[#1E3A8A]');
    cy.contains('button', 'All').should('have.class', 'text-white');
    cy.contains('button', 'Approved').should('have.class', 'bg-white');
    cy.contains('button', 'Approved').should('have.class', 'text-gray-700');
    
    // Check active button styling when clicked
    cy.contains('button', 'Approved').click({force: true});
    cy.contains('button', 'Approved').should('have.class', 'bg-[#10B981]');
    cy.contains('button', 'Approved').should('have.class', 'text-white');
    
    cy.contains('button', 'Rejected').click({force: true});
    cy.contains('button', 'Rejected').should('have.class', 'bg-red-500');
    cy.contains('button', 'Rejected').should('have.class', 'text-white');
    
    cy.contains('button', 'Pending').click({force: true});
    cy.contains('button', 'Pending').should('have.class', 'bg-yellow-500');
    cy.contains('button', 'Pending').should('have.class', 'text-white');
  });

  it('should verify modal styling', () => {
    // Go to bookings tab
    cy.get('nav div').eq(3).click({force: true});
    cy.wait(500);
    
    // Open a booking modal
    cy.contains('button', 'View Details').first().click();
    
    // Verify modal background
    cy.get('.fixed.inset-0.bg-black.bg-opacity-60').should('be.visible');
    
    // Verify modal container
    cy.get('.bg-white.rounded-xl.shadow-xl').should('be.visible');
    
    // Verify header gradient
    cy.get('.bg-gradient-to-r.from-blue-800.to-blue-600.text-white').should('be.visible');
    
    // Verify close button
    cy.get('.text-white.hover\\:bg-white.hover\\:bg-opacity-20.rounded-full').should('be.visible');
    
    // Verify action buttons
    cy.get('.fixed.inset-0.bg-black.bg-opacity-60').find('button[class*="px-4 py-2 text-sm"]').should('have.length.at.least', 1);
    
    // Close the modal
    cy.contains('button', 'Close').click();
  });

  it('should verify responsive layout', () => {
    // Test large screen by default (Cypress default viewport)
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div').should('have.length', 4);
    
    // Test medium screen
    cy.viewport(800, 800);
    cy.wait(500);
    // On medium screens, we should still see the cards but in a different layout
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div').should('have.length', 4);
    
    // Test small screen
    cy.viewport(500, 800);
    cy.wait(500);
    // On small screens, we should still see the cards but in a single column
    cy.get('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div').should('have.length', 4);
    
    // Verify sidebar is collapsed on small screens
    cy.get('.w-20').should('be.visible');
  });

  it('should verify loading spinner styling', () => {
    // Create a stub for API requests to simulate loading state
    cy.intercept('GET', '/api/admin/users', (req) => {
      req.on('response', (res) => {
        // Delay the response to show loading state
        res.setDelay(2000);
      });
    }).as('getUsers');
    
    // Refresh page to trigger loading state
    cy.reload();
    
    // Verify loading spinner is visible
    cy.get('.animate-spin.rounded-full.h-32.w-32.border-t-2.border-b-2.border-\\[\\#1E6F9F\\]').should('be.visible');
    
    // Wait for loading to complete
    cy.wait('@getUsers');
  });

  it('should verify color scheme and branding', () => {
    // Primary blue color
    cy.get('.bg-\\[\\#1E3A8A\\]').should('be.visible');
    
    // Primary green color
    cy.get('.bg-\\[\\#10B981\\]').should('be.visible');
    
    // Check logo/title is visible when sidebar is expanded
    cy.get('button').contains('svg').first().click({force: true});
    cy.wait(300);
    cy.contains('Service Admin').should('be.visible');
  });
}); 