import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { username, email, password, typegroup } = await req.json();
        console.log('Registration attempt for:', { username, email, typegroup });

        // Validate input
        if (!username || !email || !password || !typegroup) {
            console.log('Missing required fields:', { username, email, typegroup });
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        console.log('Checking for existing user with email:', email);
        const result = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length > 0) {
            console.log('User already exists with email:', email);
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        console.log('Creating new user...');
        const insertResult = await pool.query(
            'INSERT INTO users (username, email, password, typegroup) VALUES ($1, $2, $3, $4) RETURNING id',
            [username, email, hashedPassword, typegroup]
        );
        console.log('User created successfully');

        return NextResponse.json({
            success: true,
            userId: insertResult.rows[0].id
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 