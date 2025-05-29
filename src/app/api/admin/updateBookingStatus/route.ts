// src/app/api/admin/updateBookingStatus/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { bookingId, status } = await req.json();

    if (!bookingId || !status) {
      return NextResponse.json({ message: 'Missing bookingId or status' }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE booking SET status = $1 WHERE id = $2 RETURNING *',
      [status, bookingId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking status updated successfully', booking: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { message: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
