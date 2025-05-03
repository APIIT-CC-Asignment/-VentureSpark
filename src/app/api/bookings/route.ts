import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

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
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Connected to database');

    const [rows] = await connection.execute(
      'SELECT id, Requstedservice as service, request_date as date, status FROM booking WHERE email = ? ORDER BY request_date DESC',
      [email]
    );

    await connection.end();

    console.log('Query results:', rows);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}