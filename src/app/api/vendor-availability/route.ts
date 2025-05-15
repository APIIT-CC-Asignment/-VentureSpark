// File: src/app/api/vendor-availability/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';
import { RowDataPacket, OkPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';

// GET method - Fetch vendor availability
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const vendorId = url.searchParams.get('vendorId');

        if (!vendorId) {
            return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
        }

        // Get vendor's availability
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT 
        id,
        vendor_id,
        start_time,
        end_time,
        created_at,
        updated_at
      FROM vendor_availability 
      WHERE vendor_id = ? 
      ORDER BY start_time ASC`,
            [vendorId]
        );

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching vendor availability:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Helper function to convert ISO string to MySQL datetime format
const formatDateForMySQL = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

// POST method - Add vendor availability
export async function POST(req: NextRequest) {
    try {
        const { vendorId, availabilitySlots } = await req.json();

        if (!vendorId || !availabilitySlots || !Array.isArray(availabilitySlots)) {
            return NextResponse.json(
                { error: 'Vendor ID and availability slots are required' },
                { status: 400 }
            );
        }

        // First, resolve the vendor ID properly
        let actualVendorId = vendorId;
        let vendorEmail = '';

        if (typeof vendorId === 'string' && vendorId.includes('@')) {
            // Get user ID from email
            const [userRows] = await pool.execute<RowDataPacket[]>(
                'SELECT id, email FROM users WHERE email = ? AND typegroup = ?',
                [vendorId, 'vendor']
            );

            if (!userRows || userRows.length === 0) {
                return NextResponse.json(
                    { error: 'Vendor not found with this email' },
                    { status: 404 }
                );
            }

            actualVendorId = userRows[0].id;
            vendorEmail = userRows[0].email;
        } else {
            // Get email from user ID
            const [userRows] = await pool.execute<RowDataPacket[]>(
                'SELECT email FROM users WHERE id = ? AND typegroup = ?',
                [actualVendorId, 'vendor']
            );

            if (!userRows || userRows.length === 0) {
                return NextResponse.json(
                    { error: 'User not found or not a vendor' },
                    { status: 404 }
                );
            }

            vendorEmail = userRows[0].email;
        }

        // Now check for existing vendor record with comprehensive search
        const [existingVendor] = await pool.execute<RowDataPacket[]>(
            'SELECT id, email FROM Vendor WHERE id = ? OR email = ?',
            [actualVendorId, vendorEmail]
        );

        if (!existingVendor || existingVendor.length === 0) {
            // No vendor exists, create one
            const [userDetails] = await pool.execute<RowDataPacket[]>(
                'SELECT email, username FROM users WHERE id = ? AND typegroup = ?',
                [actualVendorId, 'vendor']
            );

            if (!userDetails || userDetails.length === 0) {
                return NextResponse.json(
                    { error: 'User details not found' },
                    { status: 404 }
                );
            }

            // Use INSERT ... ON DUPLICATE KEY UPDATE to handle any remaining conflicts
            await pool.execute<OkPacket>(
                `INSERT INTO Vendor 
         (id, email, service_name, years_of_excellence, contact_number, address, selected_services, type, active, expertise_in, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON DUPLICATE KEY UPDATE 
         email = VALUES(email),
         updated_at = CURRENT_TIMESTAMP`,
                [
                    actualVendorId,
                    userDetails[0].email,
                    userDetails[0].username || '', // Use username as default service name
                    0, // years_of_excellence
                    '', // contact_number
                    '', // address
                    '', // selected_services
                    'business', // type
                    1, // active
                    '', // expertise_in
                ]
            );
        } else {
            // Vendor exists, ensure we're using the correct ID
            if (existingVendor[0].id !== actualVendorId) {
                // There's a mismatch, use the existing vendor's ID to avoid conflicts
                actualVendorId = existingVendor[0].id;
            }
        }

        // Validate each slot
        for (const slot of availabilitySlots) {
            if (!slot.startTime || !slot.endTime) {
                return NextResponse.json(
                    { error: 'Each slot must have start and end time' },
                    { status: 400 }
                );
            }

            // Validate that start time is before end time
            if (new Date(slot.startTime) >= new Date(slot.endTime)) {
                return NextResponse.json(
                    { error: 'Start time must be before end time' },
                    { status: 400 }
                );
            }
        }

        // Check for overlapping slots
        for (let i = 0; i < availabilitySlots.length; i++) {
            for (let j = i + 1; j < availabilitySlots.length; j++) {
                const slot1 = availabilitySlots[i];
                const slot2 = availabilitySlots[j];

                const start1 = new Date(slot1.startTime);
                const end1 = new Date(slot1.endTime);
                const start2 = new Date(slot2.startTime);
                const end2 = new Date(slot2.endTime);

                // Check for overlap
                if (start1 < end2 && start2 < end1) {
                    return NextResponse.json(
                        { error: 'Availability slots cannot overlap' },
                        { status: 400 }
                    );
                }
            }
        }

        // Check for overlapping slots with existing availability
        for (const slot of availabilitySlots) {
            const startTime = formatDateForMySQL(slot.startTime);
            const endTime = formatDateForMySQL(slot.endTime);

            const [existingSlots] = await pool.execute<RowDataPacket[]>(
                `SELECT id FROM vendor_availability 
         WHERE vendor_id = ? 
         AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))`,
                [actualVendorId, startTime, startTime, endTime, endTime]
            );

            if (existingSlots && existingSlots.length > 0) {
                return NextResponse.json(
                    { error: 'Some time slots overlap with existing availability' },
                    { status: 400 }
                );
            }
        }

        // Insert availability slots
        const insertPromises = availabilitySlots.map(async (slot) => {
            const id = uuidv4();

            // Convert ISO strings to MySQL datetime format
            const startTime = formatDateForMySQL(slot.startTime);
            const endTime = formatDateForMySQL(slot.endTime);

            return pool.execute<OkPacket>(
                `INSERT INTO vendor_availability 
         (id, vendor_id, start_time, end_time, created_at, updated_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [id, actualVendorId, startTime, endTime]
            );
        });

        await Promise.all(insertPromises);

        return NextResponse.json({
            success: true,
            message: `Successfully added ${availabilitySlots.length} availability slot(s)`,
            count: availabilitySlots.length
        });
    } catch (error) {
        console.error('Error adding vendor availability:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// DELETE method - Remove availability slot
export async function DELETE(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const slotId = url.searchParams.get('slotId');
        const vendorId = url.searchParams.get('vendorId');

        if (!slotId || !vendorId) {
            return NextResponse.json(
                { error: 'Slot ID and Vendor ID are required' },
                { status: 400 }
            );
        }

        // Delete the specific slot for this vendor
        const [result] = await pool.execute<OkPacket>(
            'DELETE FROM vendor_availability WHERE id = ? AND vendor_id = ?',
            [slotId, vendorId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'Availability slot not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Availability slot removed successfully'
        });
    } catch (error) {
        console.error('Error deleting vendor availability:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// PUT method - Update availability slot
export async function PUT(req: NextRequest) {
    try {
        const { slotId, vendorId, startTime, endTime } = await req.json();

        if (!slotId || !vendorId || !startTime || !endTime) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate that start time is before end time
        if (new Date(startTime) >= new Date(endTime)) {
            return NextResponse.json(
                { error: 'Start time must be before end time' },
                { status: 400 }
            );
        }

        // Convert ISO strings to MySQL datetime format
        const formattedStartTime = formatDateForMySQL(startTime);
        const formattedEndTime = formatDateForMySQL(endTime);

        // Update the slot
        const [result] = await pool.execute<OkPacket>(
            `UPDATE vendor_availability 
       SET start_time = ?, end_time = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND vendor_id = ?`,
            [formattedStartTime, formattedEndTime, slotId, vendorId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'Availability slot not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Availability slot updated successfully'
        });
    } catch (error) {
        console.error('Error updating vendor availability:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}