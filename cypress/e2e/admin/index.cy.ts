/**
 * Admin Dashboard Test Suite
 * 
 * This file serves as an entry point for all admin dashboard tests.
 * It helps organize and document the testing structure.
 */

// Setup
import './auth-setup';

// Basic tests
import './basic.cy.ts';

// Navigation and UI tests
import './navigation.cy.ts';
import './ui.cy.ts';

// Feature-specific tests
import './dashboard.cy.ts';
import './users.cy.ts';
import './services.cy.ts';
import './bookings.cy.ts';

// General tests
import './general.cy.ts';

// Fix tests
import './avatar-fix.cy.ts';

// This file doesn't contain any tests itself, it just imports the other test files
// You can run this file to run all admin dashboard tests: 
// npx cypress run --spec "cypress/e2e/admin/index.cy.ts" 