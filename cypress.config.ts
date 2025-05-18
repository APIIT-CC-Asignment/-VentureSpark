<<<<<<< Updated upstream
import { defineConfig } from 'cypress'
 
=======
import { defineConfig } from "cypress";

>>>>>>> Stashed changes
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
<<<<<<< Updated upstream
    baseUrl: 'http://localhost:3000',
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
})
=======
  },
});
>>>>>>> Stashed changes
