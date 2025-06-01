// Alternative solution: Fix the vendor-sessions API without changing database schema
// This approach uses explicit casting in the queries to handle type mismatches

import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';
import { GoogleCalendarService } from '../../lib/google-calendar';

// Timeout wrapper for database queries
const queryWithTimeout = async (query: string, params: any[] = [], timeoutMs: number = 8000) => {
    return Promise.race([
        pool.query(query, params),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Database query timeout')), timeoutMs)
        )
    ]) as Promise<any>;
};

// GET method - Fetch vendor's booked sessions
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const vendorId = url.searchParams.get('vendorId');

        console.log('[vendor-sessions] GET request for vendorId:', vendorId);

        if (!vendorId) {
            return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
        }

        // Quick connection test
        try {
            await queryWithTimeout('SELECT 1', [], 3000);
            console.log('[vendor-sessions] Database connection successful');
        } catch (connectionError) {
            console.error('[vendor-sessions] Database connection failed, returning empty array');
            return NextResponse.json([]);
        }

        // First resolve the vendor ID properly if it's an email
        let actualVendorId = vendorId;

        if (vendorId.includes('@')) {
            console.log('[vendor-sessions] Looking up vendor ID for email:', vendorId);
            try {
                const userResult = await queryWithTimeout(
                    'SELECT id FROM users WHERE email = $1 AND typegroup = $2',
                    [vendorId, 'vendor'],
                    5000
                );

                if (!userResult.rows || userResult.rows.length === 0) {
                    console.log('[vendor-sessions] No vendor found for email:', vendorId);
                    return NextResponse.json([]);
                }

                actualVendorId = String(userResult.rows[0].id);
                console.log('[vendor-sessions] Resolved vendor ID:', actualVendorId);
            } catch (lookupError) {
                console.error('[vendor-sessions] Error resolving email to ID:', lookupError);
                return NextResponse.json([]);
            }
        }

        // SIMPLIFIED: Use a much simpler query that avoids complex joins and casting
        try {
            // First, get bookings for this vendor
            const bookingQuery = `
                SELECT 
                    b.id,
                    b.name AS "userName",
                    b.email AS "userEmail",
                    b.request_date,
                    b.what_you_need AS message,
                    b.requstedservice AS "serviceName",
                    b.committed,
                    b.status,
                    b.slot_id,
                    b.calendar_event_id,
                    b.meet_link,
                    b.createdate
                FROM booking b
                WHERE b.vendor_id::text = $1::text
                ORDER BY b.createdate DESC NULLS LAST, b.id DESC
            `;

            const result = await queryWithTimeout(bookingQuery, [actualVendorId], 8000);
            console.log('[vendor-sessions] Found bookings:', result.rows.length);

            // For each booking with a slot_id, get the slot details separately
            const sessionsWithSlots = await Promise.all(
                result.rows.map(async (session: { slot_id: any; id: any; userName: any; userEmail: any; request_date: string | number | Date; message: any; serviceName: any; status: any; committed: any; calendar_event_id: any; meet_link: any; createdate: string | number | Date; }) => {
                    let slotDetails = null;

                    if (session.slot_id) {
                        try {
                            const slotQuery = `
                                SELECT start_time, end_time 
                                FROM vendor_availability 
                                WHERE id::text = $1::text
                            `;
                            const slotResult = await queryWithTimeout(slotQuery, [session.slot_id], 3000);
                            if (slotResult.rows.length > 0) {
                                slotDetails = slotResult.rows[0];
                            }
                        } catch (slotError) {
                            console.log('[vendor-sessions] Could not fetch slot details for slot:', session.slot_id);
                        }
                    }

                    return {
                        id: session.id,
                        userName: session.userName || 'Unknown Client',
                        userEmail: session.userEmail || '',
                        request_date: session.request_date ? new Date(session.request_date).toISOString() : null,
                        message: session.message || '',
                        serviceName: session.serviceName || '',
                        status: session.status || 'pending',
                        committed: session.committed || false,
                        slot_id: session.slot_id,
                        calendar_event_id: session.calendar_event_id,
                        meet_link: session.meet_link,
                        created_at: session.createdate ? new Date(session.createdate).toISOString() : null,
                        // Include slot timing if available
                        start_time: slotDetails?.start_time ? new Date(slotDetails.start_time).toISOString() : null,
                        end_time: slotDetails?.end_time ? new Date(slotDetails.end_time).toISOString() : null
                    };
                })
            );

            console.log('[vendor-sessions] Processed sessions:', sessionsWithSlots.length);
            return NextResponse.json(sessionsWithSlots);

        } catch (queryError) {
            console.error('[vendor-sessions] Query error:', queryError);
            // If the main query fails, try a fallback without vendor_id filtering
            try {
                console.log('[vendor-sessions] Trying fallback query...');
                const fallbackQuery = `
                    SELECT 
                        b.id,
                        b.name AS "userName",
                        b.email AS "userEmail",
                        b.request_date,
                        b.what_you_need AS message,
                        b.requstedservice AS "serviceName",
                        b.committed,
                        b.status,
                        b.slot_id,
                        b.calendar_event_id,
                        b.meet_link,
                        b.createdate
                    FROM booking b
                    ORDER BY b.createdate DESC NULLS LAST
                    LIMIT 50
                `;

                const fallbackResult = await queryWithTimeout(fallbackQuery, [], 5000);

                // Filter results by matching service name to vendor
                const vendorQuery = `SELECT service_name FROM vendor WHERE id::text = $1::text`;
                const vendorResult = await queryWithTimeout(vendorQuery, [actualVendorId], 3000);

                if (vendorResult.rows.length > 0) {
                    const vendorServiceName = vendorResult.rows[0].service_name;
                    const filteredBookings = fallbackResult.rows.filter(
                        (booking: { serviceName: any; }) => booking.serviceName === vendorServiceName
                    );

                    const processedSessions = filteredBookings.map((session: { id: any; userName: any; userEmail: any; request_date: string | number | Date; message: any; serviceName: any; status: any; committed: any; slot_id: any; calendar_event_id: any; meet_link: any; createdate: string | number | Date; }) => ({
                        id: session.id,
                        userName: session.userName || 'Unknown Client',
                        userEmail: session.userEmail || '',
                        request_date: session.request_date ? new Date(session.request_date).toISOString() : null,
                        message: session.message || '',
                        serviceName: session.serviceName || '',
                        status: session.status || 'pending',
                        committed: session.committed || false,
                        slot_id: session.slot_id,
                        calendar_event_id: session.calendar_event_id,
                        meet_link: session.meet_link,
                        created_at: session.createdate ? new Date(session.createdate).toISOString() : null,
                        start_time: null,
                        end_time: null
                    }));

                    console.log('[vendor-sessions] Fallback found sessions:', processedSessions.length);
                    return NextResponse.json(processedSessions);
                }

                return NextResponse.json([]);
            } catch (fallbackError) {
                console.error('[vendor-sessions] Fallback query also failed:', fallbackError);
                return NextResponse.json([]);
            }
        }

    } catch (error) {
        console.error('[vendor-sessions] Error fetching sessions:', error);
        return NextResponse.json([]);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { sessionId, vendorId, status, accessToken, refreshToken } = await req.json();

        console.log('[vendor-sessions] POST request:', { sessionId, vendorId, status });

        if (!sessionId || !status) {
            return NextResponse.json({ error: 'Session ID and status are required' }, { status: 400 });
        }

        if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status. Must be "confirmed", "completed", or "cancelled"' }, { status: 400 });
        }

        // Quick connection test
        try {
            await queryWithTimeout('SELECT 1', [], 3000);
        } catch (connectionError) {
            return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
        }

        // SIMPLIFIED: Update booking status with simple casting
        try {
            // First verify the booking exists
            const checkQuery = `SELECT * FROM booking WHERE id::text = $1::text`;
            const bookingCheck = await queryWithTimeout(checkQuery, [sessionId], 5000);

            if (!bookingCheck.rows || bookingCheck.rows.length === 0) {
                return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
            }

            const booking = bookingCheck.rows[0];

            // Update the booking status
            const updateQuery = `
                UPDATE booking 
                SET status = $1, committed = $2 
                WHERE id::text = $3::text
            `;

            await queryWithTimeout(updateQuery, [
                status,
                status === 'confirmed' || status === 'completed',
                sessionId
            ], 5000);

            console.log('[vendor-sessions] Updated booking status to:', status);

            // If confirmed and we have Google access, try to create calendar event
            if (status === 'confirmed' && accessToken) {
                try {
                    console.log('[vendor-sessions] Creating calendar event...');

                    // Use booking date or default
                    let startTime: Date;
                    let endTime: Date;

                    if (booking.request_date) {
                        const requestDate = new Date(booking.request_date);
                        startTime = new Date(requestDate);
                        startTime.setHours(18, 30, 0, 0); // Default to 6:30 PM
                        endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later
                    } else {
                        // Fallback to tomorrow at 6:30 PM
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        startTime = new Date(tomorrow);
                        startTime.setHours(18, 30, 0, 0);
                        endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
                    }

                    const calendarService = new GoogleCalendarService(accessToken, refreshToken);

                    const event = {
                        summary: `Consultation Session: ${booking.requstedservice}`,
                        description: `Session with ${booking.name} (${booking.email})\n\nMessage: ${booking.what_you_need || 'No message provided'}`,
                        startTime: startTime,
                        endTime: endTime,
                        attendees: [
                            { email: booking.email, name: booking.name }
                        ].filter(attendee => attendee.email && attendee.email.trim() !== '')
                    };

                    const calendarResult = await calendarService.createEvent(event);

                    // Update booking with calendar details
                    if (calendarResult.eventId) {
                        const calendarUpdateQuery = `
                            UPDATE booking 
                            SET calendar_event_id = $1, meet_link = $2 
                            WHERE id::text = $3::text
                        `;
                        await queryWithTimeout(calendarUpdateQuery, [
                            calendarResult.eventId,
                            calendarResult.meetLink || null,
                            sessionId
                        ], 5000);
                    }

                    const responsePayload: Record<string, unknown> = {
                        message: 'Booking confirmed and calendar event created',
                        calendarEvent: calendarResult
                    };

                    if (calendarResult.newAccessToken) {
                        responsePayload.newAccessToken = calendarResult.newAccessToken;
                    }

                    return NextResponse.json(responsePayload);

                } catch (calendarError) {
                    console.error('[vendor-sessions] Calendar creation failed:', calendarError);
                    return NextResponse.json({
                        message: 'Booking status updated successfully, but calendar event creation failed',
                        error: calendarError instanceof Error ? calendarError.message : 'Calendar creation failed'
                    });
                }
            }

            return NextResponse.json({ message: 'Booking status updated successfully' });

        } catch (updateError) {
            console.error('[vendor-sessions] Update error:', updateError);
            return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
        }

    } catch (error) {
        console.error('[vendor-sessions] Error in POST:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}