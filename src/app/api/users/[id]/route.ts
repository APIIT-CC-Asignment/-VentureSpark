import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // Adjust path as needed

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { username, email } = await request.json();

    // Use PostgreSQL syntax with the shared pool
    await pool.query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3',
      [username, email, params.id]
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