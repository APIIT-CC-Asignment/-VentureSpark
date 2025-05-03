import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: Request) {
  try {
    const { email, currentPassword, newPassword } = await request.json();
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Verify current password
    const [users] = await connection.execute(
      'SELECT id FROM users WHERE email = ? AND password = ?',
      [email, currentPassword]
    );

    if (!Array.isArray(users) || users.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Update password
    await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [newPassword, email]
    );

    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}