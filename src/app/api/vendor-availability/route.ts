// File: app/api/vendor/availability/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from "../../lib/db";
import { RowDataPacket, OkPacket } from 'mysql2';

// GET /api/vendor/availability - Fetch vendor availability
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const vendorId = url.searchParams.get('vendorId');

        if (!vendorId) {
            return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM vendor_availability WHERE vendor_id = ? ORDER BY start_time ASC',
            [vendorId]
        );

        return NextResponse.json(rows || []);
    } catch (error) {
        console.error('Error fetching vendor availability:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/vendor/availability - Add new availability slot
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        if (!data.vendorId || !data.startTime || !data.endTime) {
            return NextResponse.json({ error: 'Vendor ID, start time, and end time are required' }, { status: 400 });
        }

        // Validate that end time is after start time
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);

        if (endTime <= startTime) {
            return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 });
        }

        // Insert new availability
        const [result] = await pool.execute<OkPacket>(
            `INSERT INTO vendor_availability (
        vendor_id,
        start_time,
        end_time
      ) VALUES (?, ?, ?)`,
            [
                data.vendorId,
                data.startTime,
                data.endTime
            ]
        );

        return NextResponse.json({ success: !!result?.affectedRows });
    } catch (error) {
        console.error('Error adding availability:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/vendor/availability - Remove availability slot
export async function DELETE(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Availability ID is required' }, { status: 400 });
        }

        const [result] = await pool.execute<OkPacket>('DELETE FROM availability WHERE id = ?', [id]);

        return NextResponse.json({ success: !!result?.affectedRows });
    } catch (error) {
        console.error('Error removing availability:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}