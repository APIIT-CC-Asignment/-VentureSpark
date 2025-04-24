import { NextResponse } from 'next/server';
import pool from '../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vendorId = searchParams.get('vendorId');

  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, expertise, bio, hourly_rate FROM vendors WHERE id = ?',
      [vendorId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name, expertise, bio, hourly_rate } = body;

  try {
    await pool.query(
      'UPDATE vendors SET name = ?, expertise = ?, bio = ?, hourly_rate = ? WHERE id = ?',
      [name, expertise, bio, hourly_rate, id]
    );
    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}