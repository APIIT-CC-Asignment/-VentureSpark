import { NextResponse } from "next/server";
import pool from "../../lib/db";

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
      const slotResult = await pool.query(
        "SELECT * FROM vendor_availability WHERE id = $1",
        [slotId]
      );

      if (slotResult.rows.length === 0) {
        return NextResponse.json(
          { message: "Selected time slot is no longer available" },
          { status: 400 }
        );
      }

      // Check if the slot is already booked
      const bookingCheckResult = await pool.query(
        "SELECT * FROM booking WHERE slot_id = $1",
        [slotId]
      );

      if (bookingCheckResult.rows.length > 0) {
        return NextResponse.json(
          { message: "This time slot has already been booked" },
          { status: 409 }
        );
      }

      // Get the slot details for use in the booking
      const slot = slotResult.rows[0];
      const bookingDate = new Date(slot.start_time);
      const formattedDate = bookingDate.toISOString().split('T')[0];

      // Get the vendor ID from the slot to associate with the booking
      const vendorId = slot.vendor_id;

      // Insert booking with slot information
      const insertResult = await pool.query(
        "INSERT INTO booking (name, email, request_date, what_you_need, requstedservice, slot_id, vendor_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
        [name, email, formattedDate, message, servicename, slotId, vendorId, "pending"]
      );

      // Mark the availability slot as booked
      await pool.query(
        "UPDATE vendor_availability SET is_booked = true WHERE id = $1",
        [slotId]
      );

      return NextResponse.json({
        message: "Booked successfully!",
        bookingId: insertResult.rows[0].id
      });
    } else {
      // Traditional booking without a specific slot
      // Try to find the vendor ID by service name
      const vendorResult = await pool.query(
        "SELECT id FROM vendor WHERE service_name = $1",
        [servicename]
      );

      let vendorId = null;
      if (vendorResult.rows.length > 0) {
        vendorId = vendorResult.rows[0].id;
      }

      // Insert booking without slot information
      const insertResult = await pool.query(
        "INSERT INTO booking (name, email, request_date, what_you_need, requstedservice, vendor_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [name, email, date, message, servicename, vendorId, "pending"]
      );

      return NextResponse.json({
        message: "Booked successfully!",
        bookingId: insertResult.rows[0].id
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