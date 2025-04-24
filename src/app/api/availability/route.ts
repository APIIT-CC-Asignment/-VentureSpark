import { NextResponse } from 'next/server';
import pool from '../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vendorId = searchParams.get('vendorId');

  try {
    const [rows] = await pool.query(
      'SELECT id, vendor_id, start_time, end_time FROM availability WHERE vendor_id = ?',
      [vendorId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { vendorId, startTime, endTime } = body;

  try {
    await pool.query(
      'INSERT INTO availability (vendor_id, start_time, end_time) VALUES (?, ?, ?)',
      [vendorId, startTime, endTime]
    );
    return NextResponse.json({ message: 'Availability added successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add availability' }, { status: 500 });
  }
}