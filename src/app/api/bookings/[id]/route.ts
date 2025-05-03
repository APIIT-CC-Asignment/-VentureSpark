import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await connection.execute(
      'UPDATE booking SET status = ? WHERE id = ?',
      [status, params.id]
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