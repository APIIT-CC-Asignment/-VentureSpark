// import { NextResponse } from "next/server";
// import pool from "../../lib/db";
// import { RowDataPacket } from "mysql2";

// export async function GET() {
//   try {
//     const [rows] = await pool.query<RowDataPacket[]>(`
//       SELECT id, service_name, years_of_excellence, email, contact_number, address,
//              selected_services, type, active, created_at, updated_at, expertise_in
//       FROM Vendor
//     `);

//     console.log("✅ Vendor rows from DB:", rows);

//     // ✅ Always return JSON (even if empty array)
//     return NextResponse.json(rows || []);
//   } catch (error) {
//     console.error("❌ Error fetching vendors:", error);

//     // ✅ Return consistent error format
//     return new NextResponse(
//       JSON.stringify({
//         message: "Failed to fetch vendors",
//         error: error instanceof Error ? error.message : String(error),
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
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
    return NextResponse.json(rows || []);
  } catch (error) {
    console.error("❌ Error fetching vendors:", error);
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

// Add PUT handler for vendor ID updates
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await request.json();

    // Check if we have the active status update
    if (data.active === undefined) {
      return new NextResponse(
        JSON.stringify({
          message: "Missing 'active' field",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [result] = await pool.query(
      `UPDATE Vendor SET active = ? WHERE id = ?`,
      [data.active, id]
    );

    console.log("✅ Vendor status updated:", result);
    return NextResponse.json({
      message: "Vendor status updated successfully",
      updated: true,
      id: id
    });
  } catch (error) {
    console.error("❌ Error updating vendor status:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Failed to update vendor status",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}