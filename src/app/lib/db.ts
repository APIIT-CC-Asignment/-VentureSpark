// lib/db.ts - PostgreSQL Configuration
import { Pool } from 'pg';

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Add error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

export default pool;