import { NextResponse } from 'next/server';
import pool from '../../lib/db'; // Adjust path as needed

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  console.log('API Request - Fetching bookings for email:', email);

  if (!email) {
    console.log('No email provided');
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    );
  }

  try {
    console.log('Connecting to PostgreSQL database');

    const result = await pool.query(
      'SELECT id, requstedservice as service, request_date as date, status FROM booking WHERE email = $1 ORDER BY request_date DESC',
      [email]
    );

    console.log('Query results:', result.rows);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}