import { NextResponse } from 'next/server';
import pool from '../../lib/db'; // Adjust path as needed

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  console.log('API Request - Fetching user for email:', email);

  if (!email) {
    console.log('No email provided');
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    );
  }

  try {
    console.log('Connected to PostgreSQL database');

    const result = await pool.query(
      'SELECT id, username, email, typegroup, createdat FROM users WHERE email = $1',
      [email]
    );

    console.log('Query results:', result.rows);

    if (result.rows.length === 0) {
      console.log('No user found with this email');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}