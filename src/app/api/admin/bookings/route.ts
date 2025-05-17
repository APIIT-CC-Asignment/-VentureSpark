// src/app/api/admin/bookings/route.ts

import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import pool from '../../../lib/db'; 

type Booking = {
  id: string;
  name: string;
  email: string;
  request_date: string;
  what_you_need: string;
  createdate: string;
  committed: string;
  Requstedservice: string;
  status: string;
};

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, email, request_date, what_you_need, createdate, committed, Requstedservice,status FROM Booking"
    );

    const bookings: Booking[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      request_date: row.request_date,
      what_you_need: row.what_you_need,
      createdate: row.createdate,
      committed: row.committed,
      Requstedservice: row.Requstedservice,
      status: row.status,
    }));

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to fetch bookings", error: errorMessage },
      { status: 500 }
    );
  }
}
