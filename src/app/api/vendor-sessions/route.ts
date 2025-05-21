import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';
import { RowDataPacket } from 'mysql2';

// GET method - Fetch vendor's booked sessions
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const vendorId = url.searchParams.get('vendorId');

        if (!vendorId) {
            return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
        }

        console.log(`Getting sessions for vendor ID: ${vendorId}`);

        // First resolve the vendor ID properly if it's an email
        let actualVendorId = vendorId;

        if (vendorId.includes('@')) {
            const [userRows] = await pool.execute<RowDataPacket[]>(
                'SELECT id FROM users WHERE email = ? AND typegroup = ?',
                [vendorId, 'vendor']
            );

            if (!userRows || userRows.length === 0) {
                return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
            }

            actualVendorId = userRows[0].id;
        }

        // Query for all bookings related to this vendor
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
        const { sessionId, vendorId, status } = await req.json();

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
            SELECT b.id 
            FROM booking b
            JOIN Vendor v ON b.Requstedservice = v.service_name
            WHERE b.id = ? AND v.id = ?
        `, [sessionId, actualVendorId]);

        if (!bookingCheck || bookingCheck.length === 0) {
            return NextResponse.json({ error: 'Booking not found or does not belong to this vendor' }, { status: 404 });
        }

        // Update the booking status
        await pool.execute(
            'UPDATE booking SET status = ?, committed = ? WHERE id = ?',
            [status, status === 'confirmed' || status === 'completed', sessionId]
        );

        return NextResponse.json({
            success: true,
            message: `Session ${status === 'confirmed' ? 'accepted' : status === 'completed' ? 'marked as completed' : 'rejected'} successfully`
        });
    } catch (error) {
        console.error('Error updating session status:', error);
        return NextResponse.json({
            error: 'Failed to update session status',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 