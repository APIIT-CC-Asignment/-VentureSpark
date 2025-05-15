// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from "../../../lib/db";
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    id: number;
    email: string;
    typegroup: string;
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Query database for user
        const [rows] = await pool.query<User[]>(
            `SELECT id, email, typegroup FROM users WHERE email = ? AND password = ?`,
            [email, password]
        );

        // Check if user exists
        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const user = rows[0];

        // Ensure the user is a vendor/consultant
        if (user.typegroup !== 'vendor') {
            return NextResponse.json(
                { error: 'Account is not a consultant account' },
                { status: 403 }
            );
        }

        // Return success with vendor ID
        return NextResponse.json({
            success: true,
            vendorId: user.id.toString(),
            email: user.email
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
