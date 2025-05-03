import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import db from "../../lib/db";

export async function POST(req: { json: () => Promise<{ service_name: string; years_of_excellence: number; email: string; contact_number: string; address: string; selected_services: string[]; type: string,expertise_in: string }> }) {
  try {
    const {
      service_name,
      years_of_excellence,
      email,
      contact_number,
      address,
      selected_services,
      type,
      expertise_in,
    } = await req.json();

    if (!service_name || !years_of_excellence || !email || !contact_number || !address || !type || !expertise_in) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    const [rows]: [RowDataPacket[], any] = await db.query(
      "SELECT email FROM Vendor WHERE email = ?",
      [email]
    );
    const existingVendor = rows;

    if (existingVendor.length > 0) {
      return NextResponse.json(
        { message: `Vendor already registered with email: ${email}` },
        { status: 409 }
      );
    }

    const selectedServicesString = JSON.stringify(selected_services);

    await db.query(
      "INSERT INTO Vendor (service_name, years_of_excellence, email, contact_number, address, selected_services, type, expertise_in) VALUES (?, ?, ?, ?, ?, ?, ?,?)",
      [service_name, years_of_excellence, email, contact_number, address, selectedServicesString, type, expertise_in]
    );

    // Return a success message
    return NextResponse.json({ message: "Vendor registered successfully!" });
  } catch (error) {
    console.error("Registration Error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Registration failed", error: errorMessage },
      { status: 500 }
    );
  }
}
