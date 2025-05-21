import { NextResponse } from "next/server";
import pool from "../../lib/db";
import { RowDataPacket, OkPacket } from "mysql2";

export async function POST(req: Request) {
  try {
    const { name, email, date, message, servicename, slotId } = await req.json();

    if (!name || !email || !servicename) {
      return NextResponse.json(
        { message: "Name, email, and service name are required!" },
        { status: 400 }
      );
    }

    // Validate either date or slotId must be provided
    if (!date && !slotId) {
      return NextResponse.json(
        { message: "Either a date or a specific time slot must be selected" },
        { status: 400 }
      );
    }

    // If slotId is provided, verify it exists and isn't already booked
    if (slotId) {
      const [slotRows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM vendor_availability WHERE id = ?",
        [slotId]
      );

      if (slotRows.length === 0) {
        return NextResponse.json(
          { message: "Selected time slot is no longer available" },
          { status: 400 }
        );
      }

      // Check if the slot is already booked
      const [bookingCheck] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM booking WHERE slot_id = ?",
        [slotId]
      );

      if (bookingCheck.length > 0) {
        return NextResponse.json(
          { message: "This time slot has already been booked" },
          { status: 409 }
        );
      }

      // Get the slot details for use in the booking
      const slot = slotRows[0];
      const bookingDate = new Date(slot.start_time);
      const formattedDate = bookingDate.toISOString().split('T')[0];

      // Get the vendor ID from the slot to associate with the booking
      const vendorId = slot.vendor_id;

      // Insert booking with slot information
      const [result] = await pool.query<OkPacket>(
        "INSERT INTO booking (name, email, request_date, what_you_need, Requstedservice, slot_id, vendor_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [name, email, formattedDate, message, servicename, slotId, vendorId, "pending"]
      );

      // Mark the availability slot as booked
      await pool.query(
        "UPDATE vendor_availability SET is_booked = 1 WHERE id = ?",
        [slotId]
      );

      return NextResponse.json({
        message: "Booked successfully!",
        bookingId: result.insertId
      });
    } else {
      // Traditional booking without a specific slot
      // Try to find the vendor ID by service name
      const [vendorRows] = await pool.query<RowDataPacket[]>(
        "SELECT id FROM Vendor WHERE service_name = ?",
        [servicename]
      );

      let vendorId = null;
      if (vendorRows.length > 0) {
        vendorId = vendorRows[0].id;
      }

      // Insert booking without slot information
      const [result] = await pool.query<OkPacket>(
        "INSERT INTO booking (name, email, request_date, what_you_need, Requstedservice, vendor_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, email, date, message, servicename, vendorId, "pending"]
      );

      return NextResponse.json({
        message: "Booked successfully!",
        bookingId: result.insertId
      });
    }
  } catch (error) {
    console.error("Booking Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Booking failed", error: errorMessage },
      { status: 500 }
    );
  }
}
