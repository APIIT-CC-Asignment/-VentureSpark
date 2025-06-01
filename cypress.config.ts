import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'https://venture-spark.vercel.app',
        supportFile: 'cypress/support/e2e.ts',
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        video: false,
        screenshotOnRunFailure: true,
        setupNodeEvents(on, config) {
            // implement node event listeners here
            on('task', {
                log(message) {
                    console.log(message);
                    return null;
                },
            });
        },
        failOnStatusCode: false,
    },
    env: {
        apiUrl: 'http://https://venture-spark.vercel.app/api',
    },
    retries: {
        runMode: 2,
        openMode: 0
    },
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    viewportWidth: 1280,
    viewportHeight: 720,
}); 