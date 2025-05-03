import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

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
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Connected to database');

    const [rows] = await connection.execute(
      'SELECT id, username, email, typegroup, createdAt FROM users WHERE email = ?',
      [email]
    );

    await connection.end();

    console.log('Query results:', rows);

    if (!Array.isArray(rows)) {
      console.log('Unexpected query result format');
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    if (rows.length === 0) {
      console.log('No user found with this email');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}