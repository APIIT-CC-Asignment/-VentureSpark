describe('Admin Service and Booking Management', () => {
    before(() => {
        cy.clearTestData();
        cy.adminLogin();
    });

    beforeEach(() => {
        cy.visit('/pages/admin');
    });

    describe('Service Management', () => {
        it('should approve a pending service', () => {
            cy.navigateToAdminTab('services');

            // Set filter to show pending services
            cy.get('select').first().select('pending');

            // Find and approve a pending service
            cy.get('[data-testid="service-row"]').first().within(() => {
                cy.get('[data-testid="approve-service"]').click();
            });

            // Verify success message
            cy.contains('Service status updated successfully').should('exist');

            // Verify service status changed
            cy.get('[data-testid="service-row"]').first().should('not.contain', 'pending');
        });

        it('should reject a pending service', () => {
            cy.navigateToAdminTab('services');

            // Set filter to show pending services
            cy.get('select').first().select('pending');

            cy.get('[data-testid="service-row"]').first().within(() => {
                cy.get('[data-testid="reject-service"]').click();
            });

            // Verify rejection modal
            cy.get('[data-testid="rejection-reason"]').type('Service does not meet requirements');
            cy.get('[data-testid="confirm-reject"]').click();

            // Verify success message
            cy.contains('Service status updated successfully').should('exist');
        });

        it('should edit service details', () => {
            cy.navigateToAdminTab('services');

            // Find and edit an existing service
            cy.get('[data-testid="service-row"]').first().within(() => {
                cy.get('[data-testid="edit-service"]').click();
            });

            // Update service details
            const newPrice = '299.99';
            const newDescription = 'Updated service description';

            cy.get('input[name="price"]').clear().type(newPrice);
            cy.get('textarea[name="description"]').clear().type(newDescription);
            cy.get('button[type="submit"]').click();

            // Verify updates
            cy.contains(newPrice).should('exist');
            cy.contains(newDescription).should('exist');
        });
    });

    describe('Booking Management', () => {
        it('should approve a pending booking', () => {
            cy.navigateToAdminTab('bookings');

            // Set filter to show pending bookings
            cy.get('select').first().select('pending');

            // Find and approve a pending booking
            cy.get('[data-testid="booking-row"]').first().within(() => {
                cy.get('[data-testid="approve-booking"]').click();
            });

            // Verify success message
            cy.contains('Booking status updated successfully').should('exist');

            // Verify booking status changed
            cy.get('[data-testid="booking-row"]').first().should('not.contain', 'pending');
        });

        it('should reject a pending booking', () => {
            cy.navigateToAdminTab('bookings');

            // Set filter to show pending bookings
            cy.get('select').first().select('pending');

            cy.get('[data-testid="booking-row"]').first().within(() => {
                cy.get('[data-testid="reject-booking"]').click();
            });

            // Verify rejection modal
            cy.get('[data-testid="rejection-reason"]').type('Time slot not available');
            cy.get('[data-testid="confirm-reject"]').click();

            // Verify success message
            cy.contains('Booking status updated successfully').should('exist');
        });

        it('should reschedule a booking', () => {
            cy.navigateToAdminTab('bookings');

            // Find and reschedule an existing booking
            cy.get('[data-testid="booking-row"]').first().within(() => {
                cy.get('[data-testid="reschedule-booking"]').click();
            });

            // Select new date and time
            const newDate = '2024-04-01';
            const newTime = '14:00';

            cy.get('input[name="date"]').clear().type(newDate);
            cy.get('input[name="time"]').clear().type(newTime);
            cy.get('button[type="submit"]').click();

            // Verify updates
            cy.contains(newDate).should('exist');
            cy.contains(newTime).should('exist');
        });

        it('should cancel a booking', () => {
            cy.navigateToAdminTab('bookings');

            // Find and cancel an existing booking
            cy.get('[data-testid="booking-row"]').first().within(() => {
                cy.get('[data-testid="cancel-booking"]').click();
            });

            // Confirm cancellation
            cy.get('[data-testid="confirm-cancel"]').click();

            // Verify success message
            cy.contains('Booking status updated successfully').should('exist');
        });
    });
}); 