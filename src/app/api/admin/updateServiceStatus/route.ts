// src/app/api/admin/updateServiceStatus/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { serviceId, status } = await req.json();

    if (!serviceId || !status) {
      return NextResponse.json({ message: 'Missing serviceId or status' }, { status: 400 });
    }

    const [result] = await pool.query(
      'UPDATE Vendor SET status = ? WHERE id = ?',
      [status, serviceId]
    );

    return NextResponse.json({ message: 'Service status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating service status:', error);
    return NextResponse.json(
      { message: 'Failed to update service status' },
      { status: 500 }
    );
  }
}
