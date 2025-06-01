// src/app/api/postbooking/route.ts - Fixed with multiple vendor lookup strategies
import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, date, preferred_time, message, servicename, slotId } = await req.json();

    console.log('[postbooking] Received data:', {
      name, email, date, preferred_time, servicename, slotId
    });

    if (!name || !email || !servicename) {
      return NextResponse.json(
        { message: "Name, email, and service name are required!" },
        { status: 400 }
      );
    }

    // Validate either date+time or slotId must be provided
    if (!slotId && (!date || !preferred_time)) {
      return NextResponse.json(
        { message: "Either select a time slot or provide both date and preferred time" },
        { status: 400 }
      );
    }

    let vendorId = null;
    let bookingDate = null;

    // CRITICAL FIX: Multiple strategies to find vendor
    console.log(`[postbooking] Looking for vendor with name: "${servicename}"`);

    // Strategy 1: Look by service_name in vendor table
    let vendorResult = await pool.query(
      "SELECT v.id, v.service_name, u.username FROM vendor v LEFT JOIN users u ON v.id = u.id WHERE v.service_name ILIKE $1",
      [`%${servicename}%`]
    );
    console.log(`[postbooking] Strategy 1 (service_name): Found ${vendorResult.rows.length} vendors`);

    // Strategy 2: Look by username in users table (THIS IS THE KEY FIX)
    if (vendorResult.rows.length === 0) {
      vendorResult = await pool.query(
        "SELECT v.id, v.service_name, u.username FROM vendor v LEFT JOIN users u ON v.id = u.id WHERE u.username ILIKE $1",
        [`%${servicename}%`]
      );
      console.log(`[postbooking] Strategy 2 (username): Found ${vendorResult.rows.length} vendors`);
    }

    // Strategy 3: Exact match on username (case-insensitive)
    if (vendorResult.rows.length === 0) {
      vendorResult = await pool.query(
        "SELECT v.id, v.service_name, u.username FROM vendor v LEFT JOIN users u ON v.id = u.id WHERE LOWER(u.username) = LOWER($1)",
        [servicename]
      );
      console.log(`[postbooking] Strategy 3 (exact username): Found ${vendorResult.rows.length} vendors`);
    }

    // Strategy 4: Exact match on service_name (case-insensitive)
    if (vendorResult.rows.length === 0) {
      vendorResult = await pool.query(
        "SELECT v.id, v.service_name, u.username FROM vendor v LEFT JOIN users u ON v.id = u.id WHERE LOWER(v.service_name) = LOWER($1)",
        [servicename]
      );
      console.log(`[postbooking] Strategy 4 (exact service_name): Found ${vendorResult.rows.length} vendors`);
    }

    // Strategy 5: Search by vendor email (in case service name matches email)
    if (vendorResult.rows.length === 0) {
      vendorResult = await pool.query(
        "SELECT v.id, v.service_name, u.username FROM vendor v LEFT JOIN users u ON v.id = u.id WHERE v.email ILIKE $1",
        [`%${servicename}%`]
      );
      console.log(`[postbooking] Strategy 5 (email): Found ${vendorResult.rows.length} vendors`);
    }

    // Log all vendor details for debugging
    if (vendorResult.rows.length > 0) {
      console.log('[postbooking] Found vendor details:', vendorResult.rows[0]);
      vendorId = vendorResult.rows[0].id;
      console.log('[postbooking] Using vendor ID:', vendorId);
    } else {
      console.log('[postbooking] No vendor found for service:', servicename);

      // DEBUGGING: Let's see what vendors actually exist
      const allVendors = await pool.query(
        "SELECT v.id, v.service_name, u.username, v.email FROM vendor v LEFT JOIN users u ON v.id = u.id ORDER BY v.id"
      );
      console.log('[postbooking] All available vendors:', allVendors.rows);

      return NextResponse.json(
        {
          message: `No vendor found for "${servicename}". Please try again or contact support.`,
          availableVendors: allVendors.rows.map(v => ({
            id: v.id,
            service_name: v.service_name,
            username: v.username,
            email: v.email
          }))
        },
        { status: 404 }
      );
    }

    // Handle slot-based booking
    if (slotId) {
      console.log('[postbooking] Processing slot booking for slot:', slotId);

      // Verify slot exists and get details
      const slotResult = await pool.query(
        "SELECT * FROM vendor_availability WHERE id = $1 AND vendor_id = $2",
        [slotId, vendorId]
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

      // Get the slot details and extract date for booking
      const slot = slotResult.rows[0];
      const slotStartTime = new Date(slot.start_time);

      // Format date for the booking table (date only)
      bookingDate = slotStartTime.toLocaleDateString('en-CA', {
        timeZone: 'Asia/Colombo'
      }); // YYYY-MM-DD format

      console.log('[postbooking] Slot booking details:', {
        slotId,
        slotStartTime: slotStartTime.toISOString(),
        bookingDate
      });

      // Insert booking with slot information
      const insertResult = await pool.query(
        `INSERT INTO booking 
         (name, email, request_date, what_you_need, requstedservice, slot_id, vendor_id, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING id`,
        [name, email, bookingDate, message || '', servicename, slotId, vendorId, "pending"]
      );

      // Mark the availability slot as booked
      await pool.query(
        "UPDATE vendor_availability SET is_booked = true WHERE id = $1",
        [slotId]
      );

      console.log('[postbooking] Slot booking successful, booking ID:', insertResult.rows[0].id);

      return NextResponse.json({
        message: "Booking request submitted successfully! The vendor will confirm your appointment.",
        bookingId: insertResult.rows[0].id,
        selectedSlot: true
      });

    } else {
      // Handle preferred time booking (no specific slot)
      console.log('[postbooking] Processing preferred time booking');

      // Validate the preferred time is in business hours (8 AM to 8 PM Sri Lanka time)
      const [hours, minutes] = preferred_time.split(':').map(Number);
      if (hours < 8 || hours >= 20) {
        return NextResponse.json(
          { message: "Please select a time between 8:00 AM and 8:00 PM (Sri Lanka time)" },
          { status: 400 }
        );
      }

      // Create date object in Sri Lanka timezone
      const [year, month, day] = date.split('-').map(Number);
      const sriLankaDateTime = new Date();
      sriLankaDateTime.setFullYear(year, month - 1, day);
      sriLankaDateTime.setHours(hours, minutes, 0, 0);

      // Convert to Sri Lanka timezone for validation
      const nowInSriLanka = new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
      const currentSriLanka = new Date(nowInSriLanka);

      if (sriLankaDateTime <= currentSriLanka) {
        return NextResponse.json(
          { message: "Please select a future date and time" },
          { status: 400 }
        );
      }

      console.log('[postbooking] Preferred time booking details:', {
        date,
        preferred_time,
        sriLankaDateTime: sriLankaDateTime.toISOString()
      });

      // Insert booking without slot information
      const insertResult = await pool.query(
        `INSERT INTO booking 
         (name, email, request_date, what_you_need, requstedservice, vendor_id, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING id`,
        [name, email, date, message || '', servicename, vendorId, "pending"]
      );

      console.log('[postbooking] Preferred time booking successful, booking ID:', insertResult.rows[0].id);

      return NextResponse.json({
        message: "Booking request submitted successfully! The vendor will review and confirm your preferred time.",
        bookingId: insertResult.rows[0].id,
        selectedSlot: false
      });
    }

  } catch (error) {
    console.error("[postbooking] Booking Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Booking failed", error: errorMessage },
      { status: 500 }
    );
  }
}