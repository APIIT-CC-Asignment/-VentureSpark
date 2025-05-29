import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';
import { GoogleCalendarService } from '../../lib/google-calendar';

// GET method - Fetch vendor's booked sessions
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const vendorId = url.searchParams.get('vendorId');

        console.log('Vendor Sessions API called with vendorId:', vendorId);

        if (!vendorId) {
            return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
        }

        // First resolve the vendor ID properly if it's an email
        let actualVendorId = vendorId;

        if (vendorId.includes('@')) {
            console.log('Looking up vendor ID for email:', vendorId);
            const userResult = await pool.query(
                'SELECT id FROM users WHERE email = $1 AND typegroup = $2',
                [vendorId, 'vendor']
            );

            console.log('User rows found:', userResult.rows);

            if (!userResult.rows || userResult.rows.length === 0) {
                console.log('No vendor found for email:', vendorId);
                return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
            }

            actualVendorId = userResult.rows[0].id;
            console.log('Resolved vendor ID:', actualVendorId);
        }

        // Query for all bookings related to this vendor, including slot times
        const result = await pool.query(`
            SELECT 
                b.id,
                b.name AS userName,
                b.email AS userEmail,
                b.request_date,
                b.what_you_need AS message,
                b.requstedservice AS serviceName,
                b.committed,
                b.status,
                v.service_name AS vendorServiceName,
                v.type AS vendorType,
                va.start_time,
                va.end_time
            FROM booking b
            JOIN vendor v ON b.requstedservice = v.service_name
            LEFT JOIN vendor_availability va ON b.slot_id = va.id::text
            WHERE v.id = $1
            ORDER BY b.request_date DESC
        `, [actualVendorId]);

        console.log('Found bookings:', result.rows);

        return NextResponse.json(result.rows || []);
    } catch (error) {
        console.error('Error fetching vendor sessions:', error);
        return NextResponse.json({
            error: 'Failed to fetch sessions',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { sessionId, vendorId, status, accessToken, refreshToken } = await req.json();

        if (!sessionId || !vendorId || !status) {
            return NextResponse.json({ error: 'Session ID, vendor ID, and status are required' }, { status: 400 });
        }

        if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status. Must be "confirmed", "completed", or "cancelled"' }, { status: 400 });
        }

        // First resolve the vendor ID properly if it's an email
        let actualVendorId = vendorId;

        if (typeof vendorId === 'string' && vendorId.includes('@')) {
            const userResult = await pool.query(
                'SELECT id FROM users WHERE email = $1 AND typegroup = $2',
                [vendorId, 'vendor']
            );

            if (!userResult.rows || userResult.rows.length === 0) {
                return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
            }

            actualVendorId = userResult.rows[0].id;
        }

        // Verify the booking belongs to this vendor
        const bookingResult = await pool.query(`
            SELECT 
                b.*,
                b.name AS userName,
                b.email AS userEmail,
                b.what_you_need AS message,
                b.requstedservice AS serviceName,
                v.email as vendor_email, 
                v.service_name
            FROM booking b
            JOIN vendor v ON b.requstedservice = v.service_name
            WHERE b.id = $1 AND v.id = $2
        `, [sessionId, actualVendorId]);

        if (!bookingResult.rows || bookingResult.rows.length === 0) {
            return NextResponse.json({ error: 'Booking not found or does not belong to this vendor' }, { status: 404 });
        }

        const booking = bookingResult.rows[0];

        // Update the booking status
        await pool.query(
            'UPDATE booking SET status = $1, committed = $2 WHERE id = $3',
            [status, status === 'confirmed' || status === 'completed', sessionId]
        );

        // If the booking is confirmed, create a Google Calendar event
        if (status === 'confirmed' && accessToken) {
            try {
                // Debug the booking data first
                console.log('=== BOOKING DATA DEBUG ===');
                console.log('Complete booking object:', booking);
                console.log('Available booking keys:', Object.keys(booking));
                console.log('request_date:', booking.request_date);
                console.log('request_date type:', typeof booking.request_date);

                // Let's see what other date/time fields might be available
                Object.keys(booking).forEach(key => {
                    if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time')) {
                        console.log(`${key}:`, booking[key]);
                    }
                });
                console.log('=== END BOOKING DEBUG ===');

                // Create proper dates - try multiple approaches
                let startTime: Date;
                let endTime: Date;

                // Approach 1: Try to use request_date if it's a valid datetime
                if (booking.request_date) {
                    console.log('Trying to parse request_date:', booking.request_date);
                    const testDate = new Date(booking.request_date);

                    if (!isNaN(testDate.getTime())) {
                        console.log('request_date parsed successfully:', testDate.toString());
                        startTime = testDate;
                        endTime = new Date(testDate.getTime() + 60 * 60 * 1000); // 1 hour later
                    } else {
                        throw new Error(`Cannot parse request_date: ${booking.request_date}`);
                    }
                } else {
                    // Fallback: Create a default date/time
                    console.log('No valid request_date, using fallback');
                    const now = new Date();
                    startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
                    startTime.setHours(18, 30, 0, 0); // 6:30 PM
                    endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later
                }

                console.log('Final dates before calendar service:', {
                    startTime: startTime.toString(),
                    endTime: endTime.toString(),
                    startTimeISO: startTime.toISOString(),
                    endTimeISO: endTime.toISOString(),
                    startTimeValid: !isNaN(startTime.getTime()),
                    endTimeValid: !isNaN(endTime.getTime())
                });

                // Double-check dates are valid
                if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                    throw new Error(`Invalid dates created. Start: ${startTime}, End: ${endTime}`);
                }

                const calendarService = new GoogleCalendarService(accessToken, refreshToken);

                // Validate attendee emails first
                const attendees = [
                    { email: booking.userEmail, name: booking.userName },
                ].filter(attendee => attendee.email && attendee.email.trim() !== '');

                // Create calendar event with correct structure
                const event = {
                    summary: `Consultation Session: ${booking.serviceName}`,
                    description: `Session with ${booking.userName} (${booking.userEmail})\n\nMessage: ${booking.message || 'No message provided'}`,
                    startTime: startTime,
                    endTime: endTime,
                    attendees: attendees
                };

                console.log('Event object being passed to calendar service:', {
                    summary: event.summary,
                    startTime: event.startTime?.toString(),
                    endTime: event.endTime?.toString(),
                    attendees: event.attendees
                });

                const calendarResult = await calendarService.createEvent(event);

                // Update booking with calendar event details
                if (calendarResult.eventId) {
                    await pool.query(
                        'UPDATE booking SET calendar_event_id = $1, meet_link = $2 WHERE id = $3',
                        [calendarResult.eventId, calendarResult.meetLink || null, sessionId]
                    );
                }

                const responsePayload: Record<string, unknown> = {
                    message: 'Booking confirmed and calendar event created',
                    calendarEvent: calendarResult
                };

                if (calendarResult.newAccessToken) {
                    responsePayload.newAccessToken = calendarResult.newAccessToken;
                }

                return NextResponse.json(responsePayload);

            } catch (error) {
                console.error('Error creating calendar event:', error);
                // Continue with the booking confirmation even if calendar creation fails
                return NextResponse.json({
                    message: 'Booking status updated successfully, but calendar event creation failed',
                    error: error instanceof Error ? error.message : 'Calendar creation failed'
                });
            }
        }

        return NextResponse.json({ message: 'Booking status updated successfully' });
    } catch (error) {
        console.error('Error updating booking status:', error);
        return NextResponse.json(
            { error: 'Failed to update booking status' },
            { status: 500 }
        );
    }
}