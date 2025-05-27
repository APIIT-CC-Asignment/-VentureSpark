import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { RowDataPacket } from 'mysql2';
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
        const [existingUsers] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
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
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password, typegroup) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, typegroup]
        );
        console.log('User created successfully');

        // Get the inserted user's ID
        console.log('Retrieving new user ID...');
        const [newUser] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (!newUser || newUser.length === 0) {
            console.error('Failed to retrieve new user ID after creation');
            throw new Error('Failed to retrieve new user ID');
        }

        console.log('Registration successful for user ID:', newUser[0].id);
        return NextResponse.json({
            success: true,
            userId: newUser[0].id,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Registration error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });

        // Check if it's a database error
        if (error instanceof Error && error.message.includes('ER_')) {
            return NextResponse.json(
                { error: 'Database error occurred. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 