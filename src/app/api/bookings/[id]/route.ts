import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // Use your centralized pool

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();

    // Use PostgreSQL syntax with the shared pool
    await pool.query(
      'UPDATE booking SET status = $1 WHERE id = $2',
      [status, params.id]
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