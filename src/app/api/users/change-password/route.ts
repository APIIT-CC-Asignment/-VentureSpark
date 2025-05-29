import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // Adjust path as needed

export async function POST(request: Request) {
  try {
    const { email, currentPassword, newPassword } = await request.json();

    // Verify current password
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND password = $2',
      [email, currentPassword]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Update password
    await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [newPassword, email]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}