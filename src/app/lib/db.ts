import mysql, { PoolConnection } from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

// Helper function for database queries
export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Transaction helpers
let connection: PoolConnection | null = null;

export async function beginTransaction() {
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    return connection;
  } catch (error) {
    if (connection) {
      connection.release();
    }
    console.error('Transaction begin error:', error);
    throw error;
  }
}

export async function commitTransaction() {
  try {
    if (connection) {
      await connection.commit();
      connection.release();
      connection = null;
    }
  } catch (error) {
    console.error('Transaction commit error:', error);
    throw error;
  }
}

export async function rollbackTransaction() {
  try {
    if (connection) {
      await connection.rollback();
      connection.release();
      connection = null;
    }
  } catch (error) {
    console.error('Transaction rollback error:', error);
    throw error;
  }
}