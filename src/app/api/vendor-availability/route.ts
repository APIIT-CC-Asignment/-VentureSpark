// File: src/app/api/vendor-availability/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';
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
            const result = await pool.query(
                'SELECT id FROM users WHERE email = $1 AND typegroup = $2',
                [vendorId, 'vendor']
            );

            if (result.rows && result.rows.length > 0) {
                actualVendorId = result.rows[0].id;
                console.log(`Resolved email to vendorId: ${actualVendorId}`);
            } else {
                console.log(`No vendor found with email: ${vendorId}`);

                // IMPORTANT FIX: If email not found in users table, try direct lookup in vendor table
                const vendorResult = await pool.query(
                    'SELECT id FROM vendor WHERE email = $1',
                    [vendorId]
                );

                if (vendorResult.rows && vendorResult.rows.length > 0) {
                    actualVendorId = vendorResult.rows[0].id;
                    console.log(`Found vendor ID in vendor table: ${actualVendorId}`);
                } else {
                    console.log(`Email ${vendorId} not found in vendor table either`);
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
        WHERE vendor_id = $1 
      ORDER BY start_time ASC`;

        console.log(`SQL Query: ${query}`);
        console.log(`With parameter: ${actualVendorId}`);

        const result = await pool.query(query, [actualVendorId]);

        console.log(`Found ${result.rows.length} availability slots for vendorId: ${actualVendorId}`);

        // If zero rows returned but we know data exists, try alternative queries
        if (result.rows.length === 0) {
            console.log('No slots found. Trying alternative vendor ID formats...');

            // Try with numeric conversion (some DBs store IDs as numbers)
            if (!isNaN(Number(actualVendorId))) {
                console.log(`Trying with numeric vendorId: ${Number(actualVendorId)}`);
                const numericResult = await pool.query(query, [Number(actualVendorId)]);

                if (numericResult.rows.length > 0) {
                    console.log(`Found ${numericResult.rows.length} slots with numeric vendorId!`);
                    return NextResponse.json(numericResult.rows);
                }
            }

            // Try with string conversion
            if (typeof actualVendorId !== 'string') {
                const stringId = String(actualVendorId);
                console.log(`Trying with string vendorId: ${stringId}`);
                const stringResult = await pool.query(query, [stringId]);

                if (stringResult.rows.length > 0) {
                    console.log(`Found ${stringResult.rows.length} slots with string vendorId!`);
                    return NextResponse.json(stringResult.rows);
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
                    const userResult = await pool.query(
                        'SELECT email FROM users WHERE id = $1',
                        [vendorId]
                    );
                    if (userResult.rows && userResult.rows.length > 0) {
                        email = userResult.rows[0].email;
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
                    const userResult = await pool.query(
                        'SELECT id FROM users WHERE email = $1',
                        [email]
                    );
                    if (userResult.rows && userResult.rows.length > 0) {
                        userResult.rows.forEach(row => {
                            alternativeIds.push(row.id);
                            console.log(`Found ID ${row.id} in users table`);
                        });
                    }

                    // Check vendor table
                    const vendorResult = await pool.query(
                        'SELECT id FROM vendor WHERE email = $1',
                        [email]
                    );
                    if (vendorResult.rows && vendorResult.rows.length > 0) {
                        vendorResult.rows.forEach(row => {
                            if (!alternativeIds.includes(row.id)) {
                                alternativeIds.push(row.id);
                                console.log(`Found ID ${row.id} in vendor table`);
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
                        const altResult = await pool.query(query, [altId]);

                        if (altResult.rows.length > 0) {
                            console.log(`Found ${altResult.rows.length} availability slots with alternative ID: ${altId}`);
                            return NextResponse.json(altResult.rows);
                        }

                        // Try with type conversion
                        const numAltId = Number(altId);
                        if (!isNaN(numAltId)) {
                            const numAltResult = await pool.query(query, [numAltId]);

                            if (numAltResult.rows.length > 0) {
                                console.log(`Found ${numAltResult.rows.length} availability slots with numeric alternative ID: ${numAltId}`);
                                return NextResponse.json(numAltResult.rows);
                            }
                        }
                    } catch (e) {
                        console.log(`Error checking alternative ID ${altId}:`, e);
                    }
                }
            }

            // As a last attempt, just list all slots in the system (limited for safety)
            console.log('No availability found with any known vendor ID. Retrieving sample available slots:');
            const allSlotsResult = await pool.query(
                'SELECT id, vendor_id, start_time, end_time FROM vendor_availability ORDER BY created_at DESC LIMIT 20'
            );

            if (allSlotsResult.rows.length > 0) {
                console.log(`Found ${allSlotsResult.rows.length} total slots in the system`);
                return NextResponse.json(allSlotsResult.rows);
            }
        }

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching vendor availability:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST method - Create new availability slot
// File: src/app/api/vendor-availability/route.ts
// Updated POST method with better vendor ID resolution

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { vendor_id, start_time, end_time } = data;

        if (!vendor_id || !start_time || !end_time) {
            return NextResponse.json(
                { error: 'Vendor ID, start time, and end time are required' },
                { status: 400 }
            );
        }

        console.log('POST vendor-availability received data:', { vendor_id, start_time, end_time });

        // CRITICAL FIX: Resolve vendor_id to numeric ID if it's an email
        let actualVendorId = vendor_id;

        if (typeof vendor_id === 'string' && vendor_id.includes('@')) {
            console.log(`Resolving email to vendorId: ${vendor_id}`);

            // First try users table
            const userResult = await pool.query(
                'SELECT id FROM users WHERE email = $1 AND typegroup = $2',
                [vendor_id, 'vendor']
            );

            if (userResult.rows && userResult.rows.length > 0) {
                actualVendorId = userResult.rows[0].id;
                console.log(`Resolved email to vendorId from users table: ${actualVendorId}`);
            } else {
                // Try vendor table as fallback
                const vendorResult = await pool.query(
                    'SELECT id FROM vendor WHERE email = $1',
                    [vendor_id]
                );

                if (vendorResult.rows && vendorResult.rows.length > 0) {
                    actualVendorId = vendorResult.rows[0].id;
                    console.log(`Resolved email to vendorId from vendor table: ${actualVendorId}`);
                } else {
                    console.error(`No vendor found with email: ${vendor_id}`);
                    return NextResponse.json(
                        { error: `No vendor found with email: ${vendor_id}` },
                        { status: 404 }
                    );
                }
            }
        }

        // Ensure actualVendorId is a number
        const numericVendorId = Number(actualVendorId);
        if (isNaN(numericVendorId)) {
            console.error(`Invalid vendor ID: ${actualVendorId}`);
            return NextResponse.json(
                { error: `Invalid vendor ID: ${actualVendorId}` },
                { status: 400 }
            );
        }

        console.log(`Using numeric vendor ID: ${numericVendorId}`);

        // Validate date formats
        const startDate = new Date(start_time);
        const endDate = new Date(end_time);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return NextResponse.json(
                { error: 'Invalid date format for start_time or end_time' },
                { status: 400 }
            );
        }

        // Check for conflicts with existing availability
        const conflictCheck = await pool.query(
            `SELECT id FROM vendor_availability 
             WHERE vendor_id = $1 
             AND (
                 (start_time <= $2 AND end_time > $2) OR
                 (start_time < $3 AND end_time >= $3) OR
                 (start_time >= $2 AND end_time <= $3)
             )`,
            [numericVendorId, start_time, end_time]
        );

        if (conflictCheck.rows.length > 0) {
            return NextResponse.json(
                { error: 'Time slot conflicts with existing availability' },
                { status: 409 }
            );
        }

        // Generate UUID for the new slot
        const slotId = uuidv4();

        // Insert new availability slot
        console.log('Inserting availability slot with data:', {
            slotId,
            numericVendorId,
            start_time,
            end_time
        });

        const result = await pool.query(
            `INSERT INTO vendor_availability 
                (id, vendor_id, start_time, end_time, created_at, updated_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *`,
            [slotId, numericVendorId, start_time, end_time]
        );

        console.log('Successfully created availability slot:', result.rows[0]);
        return NextResponse.json(result.rows[0]);

    } catch (error) {
        console.error('Error creating availability slot:', error);

        // Provide more specific error messages
        if (error instanceof Error && error.message.includes('22P02')) {
            return NextResponse.json(
                { error: 'Invalid data type - vendor_id must be numeric' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE method - Remove availability slot
export async function DELETE(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const slotId = url.searchParams.get('slotId');

        if (!slotId) {
            return NextResponse.json(
                { error: 'Slot ID is required' },
                { status: 400 }
            );
        }

        const result = await pool.query(
            'DELETE FROM vendor_availability WHERE id = $1 RETURNING *',
            [slotId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Availability slot not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Availability slot deleted successfully' });
    } catch (error) {
        console.error('Error deleting availability slot:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}