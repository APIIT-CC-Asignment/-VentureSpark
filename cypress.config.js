const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        baseUrl: 'http://localhost:3000',
        viewportWidth: 1280,
        viewportHeight: 720,
        defaultCommandTimeout: 10000,
        // Add this to prevent Cypress from failing on status code errors
        // This makes tests more resilient during development
        experimentalSessionAndOrigin: true,
        env: {
            DB_HOST: 'localhost',
            DB_USER: 'root',
            DB_PASSWORD: '',
            DB_NAME: 'venturespark',
            DB_PORT: 3306,
            JWT_SECRET: 'test_secret',
            NEXTAUTH_URL: 'http://localhost:3000',
            NEXTAUTH_SECRET: 'test_secret'
        }
    },
}); 