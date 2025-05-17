// src/app/api/admin/updateBookingStatus/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { bookingId, status } = await req.json();

    if (!bookingId || !status) {
      return NextResponse.json({ message: 'Missing bookingId or status' }, { status: 400 });
    }

    const [result] = await pool.query(
      'UPDATE booking SET status = ? WHERE id = ?',
      [status, bookingId]
    );

    return NextResponse.json({ message: 'Booking status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { message: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
