import { NextResponse } from "next/server";
import pool from "../../lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT id, service_name, years_of_excellence, email, contact_number, address,
             selected_services, type, active, created_at, updated_at, expertise_in
      FROM Vendor
    `);

    console.log("✅ Vendor rows from DB:", rows);

    // ✅ Always return JSON (even if empty array)
    return NextResponse.json(rows || []);
  } catch (error) {
    console.error("❌ Error fetching vendors:", error);

    // ✅ Return consistent error format
    return new NextResponse(
      JSON.stringify({
        message: "Failed to fetch vendors",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}