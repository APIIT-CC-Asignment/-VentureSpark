// src/app/api/check-db/route.ts
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // Ensure correct import path

// Export the GET handler
export async function GET() {
  try {
    // Try to get a connection from the pool
    const connection = await pool.getConnection();
    
    // Release the connection after use
    connection.release();

    return NextResponse.json({ success: true, message: 'Connected to the database' });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Database connection error:", error);

    // Return a detailed error message
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
