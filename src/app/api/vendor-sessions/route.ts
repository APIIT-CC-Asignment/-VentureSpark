import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';
import { RowDataPacket } from 'mysql2';
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
            const [userRows] = await pool.execute<RowDataPacket[]>(
                'SELECT id FROM users WHERE email = ? AND typegroup = ?',
                [vendorId, 'vendor']
            );

            console.log('User rows found:', userRows);

            if (!userRows || userRows.length === 0) {
                console.log('No vendor found for email:', vendorId);
                return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
            }

            actualVendorId = userRows[0].id;
            console.log('Resolved vendor ID:', actualVendorId);
        }

        // Query for all bookings related to this vendor
        console.log('Querying bookings for vendor ID:', actualVendorId);
        const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT 
                b.id,
                b.name AS userName,
                b.email AS userEmail,
                b.request_date,
                b.what_you_need AS message,
                b.Requstedservice AS serviceName,
                b.committed,
                b.status,
                v.service_name AS vendorServiceName,
                v.type AS vendorType
            FROM booking b
            JOIN Vendor v ON b.Requstedservice = v.service_name
            WHERE v.id = ?
            ORDER BY b.request_date DESC
        `, [actualVendorId]);

        console.log('Found bookings:', rows);

        return NextResponse.json(rows || []);
    } catch (error) {
        console.error('Error fetching vendor sessions:', error);
        return NextResponse.json({
            error: 'Failed to fetch sessions',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST method - Update session status (accept/reject)
export async function POST(req: NextRequest) {
    try {
        const { sessionId, vendorId, status, accessToken } = await req.json();

        if (!sessionId || !vendorId || !status) {
            return NextResponse.json({ error: 'Session ID, vendor ID, and status are required' }, { status: 400 });
        }

        if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status. Must be "confirmed", "completed", or "cancelled"' }, { status: 400 });
        }

        // First resolve the vendor ID properly if it's an email
        let actualVendorId = vendorId;

        if (typeof vendorId === 'string' && vendorId.includes('@')) {
            const [userRows] = await pool.execute<RowDataPacket[]>(
                'SELECT id FROM users WHERE email = ? AND typegroup = ?',
                [vendorId, 'vendor']
            );

            if (!userRows || userRows.length === 0) {
                return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
            }

            actualVendorId = userRows[0].id;
        }

        // Verify the booking belongs to this vendor
        const [bookingCheck] = await pool.execute<RowDataPacket[]>(`
            SELECT b.*, v.email as vendor_email, v.service_name
            FROM booking b
            JOIN Vendor v ON b.Requstedservice = v.service_name
            WHERE b.id = ? AND v.id = ?
        `, [sessionId, actualVendorId]);

        if (!bookingCheck || bookingCheck.length === 0) {
            return NextResponse.json({ error: 'Booking not found or does not belong to this vendor' }, { status: 404 });
        }

        const booking = bookingCheck[0];

        // Update the booking status
        await pool.execute(
            'UPDATE booking SET status = ?, committed = ? WHERE id = ?',
            [status, status === 'confirmed' || status === 'completed', sessionId]
        );

        // If the booking is confirmed, create a Google Calendar event
        if (status === 'confirmed' && accessToken) {
            try {
                const calendarService = new GoogleCalendarService(accessToken);

                // Create calendar event
                const event = {
                    summary: `Consultation: ${booking.service_name}`,
                    description: booking.what_you_need || 'Consultation session',
                    startTime: new Date(booking.request_date),
                    endTime: new Date(new Date(booking.request_date).getTime() + 60 * 60 * 1000), // 1 hour duration
                    attendees: [
                        { email: booking.email, name: booking.name },
                        { email: booking.vendor_email, name: booking.service_name }
                    ]
                };

                const calendarResult = await calendarService.createEvent(event);

                // Update booking with calendar event details
                await pool.execute(
                    'UPDATE booking SET calendar_event_id = ?, meet_link = ? WHERE id = ?',
                    [calendarResult.eventId, calendarResult.meetLink, sessionId]
                );

                return NextResponse.json({
                    message: 'Booking confirmed and calendar event created',
                    calendarEvent: calendarResult
                });
            } catch (error) {
                console.error('Error creating calendar event:', error);
                // Continue with the booking confirmation even if calendar creation fails
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