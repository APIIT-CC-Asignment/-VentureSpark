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

        console.log(`GET vendor-availability received request for vendorId: ${vendorId}`);

        // Handle case where vendorId might be an email
        let actualVendorId = vendorId;
        if (typeof vendorId === 'string' && vendorId.includes('@')) {
            // Get user ID from email
            console.log(`Resolving email to vendorId: ${vendorId}`);
            const [userRows] = await pool.execute<RowDataPacket[]>(
                'SELECT id FROM users WHERE email = ? AND typegroup = ?',
                [vendorId, 'vendor']
            );

            if (userRows && userRows.length > 0) {
                actualVendorId = userRows[0].id;
                console.log(`Resolved email to vendorId: ${actualVendorId}`);
            } else {
                console.log(`No vendor found with email: ${vendorId}`);

                // IMPORTANT FIX: If email not found in users table, try direct lookup in Vendor table
                const [vendorRows] = await pool.execute<RowDataPacket[]>(
                    'SELECT id FROM Vendor WHERE email = ?',
                    [vendorId]
                );

                if (vendorRows && vendorRows.length > 0) {
                    actualVendorId = vendorRows[0].id;
                    console.log(`Found vendor ID in Vendor table: ${actualVendorId}`);
                } else {
                    console.log(`Email ${vendorId} not found in Vendor table either`);
                }
            }
        }

        // Type check for debugging
        console.log(`ActualVendorId type: ${typeof actualVendorId}, value: ${actualVendorId}`);

        // Get vendor's availability
        console.log(`Executing SQL query for vendorId: ${actualVendorId}`);
        const query = `SELECT 
        id,
        vendor_id,
        start_time,
        end_time,
        created_at,
        updated_at
      FROM vendor_availability 
      WHERE vendor_id = ? 
      ORDER BY start_time ASC`;

        console.log(`SQL Query: ${query}`);
        console.log(`With parameter: ${actualVendorId}`);

        const [rows] = await pool.execute<RowDataPacket[]>(
            query,
            [actualVendorId]
        );

        console.log(`Found ${rows.length} availability slots for vendorId: ${actualVendorId}`);

        // If zero rows returned but we know data exists, try alternative queries
        if (rows.length === 0) {
            console.log('No slots found. Trying alternative vendor ID formats...');

            // Try with numeric conversion (some DBs store IDs as numbers)
            if (!isNaN(Number(actualVendorId))) {
                console.log(`Trying with numeric vendorId: ${Number(actualVendorId)}`);
                const [numericRows] = await pool.execute<RowDataPacket[]>(
                    query,
                    [Number(actualVendorId)]
                );

                if (numericRows.length > 0) {
                    console.log(`Found ${numericRows.length} slots with numeric vendorId!`);
                    return NextResponse.json(numericRows);
                }
            }

            // Try with string conversion
            if (typeof actualVendorId !== 'string') {
                const stringId = String(actualVendorId);
                console.log(`Trying with string vendorId: ${stringId}`);
                const [stringRows] = await pool.execute<RowDataPacket[]>(
                    query,
                    [stringId]
                );

                if (stringRows.length > 0) {
                    console.log(`Found ${stringRows.length} slots with string vendorId!`);
                    return NextResponse.json(stringRows);
                }
            }

            // Last resort: Check if there might be other availability records using different vendor IDs
            console.log('Trying to find the correct vendor ID from various tables...');

            let alternativeIds: (string | number)[] = [];
            let email = '';

            if (typeof vendorId === 'string' && vendorId.includes('@')) {
                email = vendorId;
            } else {
                // Try to get the email from the ID
                try {
                    const [userRow] = await pool.execute<RowDataPacket[]>(
                        'SELECT email FROM users WHERE id = ?',
                        [vendorId]
                    );
                    if (userRow && userRow.length > 0) {
                        email = userRow[0].email;
                        console.log(`Found email ${email} for vendorId ${vendorId}`);
                    }
                } catch (e) {
                    console.log(`Error looking up email for ID ${vendorId}:`, e);
                }
            }

            // Now gather all possible vendor IDs from different tables
            if (email) {
                try {
                    // Find associated IDs with this email
                    console.log(`Looking for vendor IDs associated with email: ${email}`);

                    // Check users table
                    const [userRows] = await pool.execute<RowDataPacket[]>(
                        'SELECT id FROM users WHERE email = ?',
                        [email]
                    );
                    if (userRows && userRows.length > 0) {
                        userRows.forEach(row => {
                            alternativeIds.push(row.id);
                            console.log(`Found ID ${row.id} in users table`);
                        });
                    }

                    // Check Vendor table
                    const [vendorRows] = await pool.execute<RowDataPacket[]>(
                        'SELECT id FROM Vendor WHERE email = ?',
                        [email]
                    );
                    if (vendorRows && vendorRows.length > 0) {
                        vendorRows.forEach(row => {
                            if (!alternativeIds.includes(row.id)) {
                                alternativeIds.push(row.id);
                                console.log(`Found ID ${row.id} in Vendor table`);
                            }
                        });
                    }
                } catch (e) {
                    console.log('Error looking up alternative IDs:', e);
                }
            }

            // Now try to find availability with any of these IDs
            if (alternativeIds.length > 0) {
                console.log(`Checking availability with ${alternativeIds.length} alternative IDs:`, alternativeIds);

                for (const altId of alternativeIds) {
                    try {
                        const [altRows] = await pool.execute<RowDataPacket[]>(
                            query,
                            [altId]
                        );

                        if (altRows.length > 0) {
                            console.log(`Found ${altRows.length} availability slots with alternative ID: ${altId}`);
                            return NextResponse.json(altRows);
                        }

                        // Try with type conversion
                        const numAltId = Number(altId);
                        if (!isNaN(numAltId)) {
                            const [numAltRows] = await pool.execute<RowDataPacket[]>(
                                query,
                                [numAltId]
                            );

                            if (numAltRows.length > 0) {
                                console.log(`Found ${numAltRows.length} availability slots with numeric alternative ID: ${numAltId}`);
                                return NextResponse.json(numAltRows);
                            }
                        }
                    } catch (e) {
                        console.log(`Error checking alternative ID ${altId}:`, e);
                    }
                }
            }

            // As a last attempt, just list all slots in the system (limited for safety)
            console.log('No availability found with any known vendor ID. Retrieving sample available slots:');
            const [allSlots] = await pool.execute<RowDataPacket[]>(
                'SELECT id, vendor_id, start_time, end_time FROM vendor_availability ORDER BY created_at DESC LIMIT 20'
            );

            if (allSlots.length > 0) {
                console.log(`Found ${allSlots.length} total slots in the system. Sample vendor_ids:`);
                const vendorIds = new Set();
                allSlots.forEach(slot => {
                    vendorIds.add(slot.vendor_id);
                });
                console.log('Unique vendor_ids in the database:', Array.from(vendorIds));
            } else {
                console.log('No availability slots found in the entire system.');
            }
        }

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
        console.log(`POST vendor-availability received request for vendorId: ${vendorId}`);

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
            console.log(`Resolving email to vendorId: ${vendorId}`);
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
            console.log(`Resolved email to vendorId: ${actualVendorId}, type: ${typeof actualVendorId}`);
        } else {
            // Get email from user ID
            console.log(`Looking up email for vendorId: ${vendorId}`);
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
            console.log(`Found email: ${vendorEmail} for vendorId: ${actualVendorId}`);
        }

        // IMPORTANT: Store the vendor ID in localStorage for future reference
        console.log(`Final resolved vendorId: ${actualVendorId}`);

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

            // Always store vendor ID as string to avoid type inconsistencies
            const vendorIdToStore = String(actualVendorId);

            console.log(`Inserting availability with vendor_id: ${vendorIdToStore}`);

            return pool.execute<OkPacket>(
                `INSERT INTO vendor_availability 
                (id, vendor_id, start_time, end_time, created_at, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [id, vendorIdToStore, startTime, endTime]
            );
        });

        await Promise.all(insertPromises);

        return NextResponse.json({
            success: true,
            message: `Successfully added ${availabilitySlots.length} availability slot(s)`,
            count: availabilitySlots.length,
            vendorId: actualVendorId
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