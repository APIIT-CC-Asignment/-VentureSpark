import { NextResponse } from "next/server"; // ✅ Fix: Import NextResponse
import db from "../../lib/db"; // ✅ Fix: Make sure this path is correct
import { RowDataPacket } from "mysql2"; // ✅ Fix: Add this import if using TypeScript

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    const [vendors]: [RowDataPacket[], any] = await db.query(
      "SELECT * FROM Vendor WHERE status = ?",
      [status]
    );

    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { message: "Error fetching vendors" },
      { status: 500 }
    );
  }
}
