import { NextResponse } from "next/server";
import pool from "../../lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  try {
    const { name, email, date,message,servicename } = await req.json();

    if (!name || !email  || !date || !message) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    
    await pool.query(
      "INSERT INTO Booking (name, email, request_date,what_you_need,Requstedservice) VALUES (?, ?, ?,?,?)",
      [name, email, date,message,servicename]
    );

    return NextResponse.json({ message: "Booked successfully!" });
  } catch (error) {
    console.error("Booked Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Booked failed", error: errorMessage },
      { status: 500 }
    );
  }
}
