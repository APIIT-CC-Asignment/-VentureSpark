// File: src/app/api/vendor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';
import { RowDataPacket, OkPacket } from 'mysql2';

// GET method - Fetch vendor information
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const vendorId = url.searchParams.get('vendorId');

    console.log('Vendor API called with vendorId:', vendorId);

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
    }

    // First, check if vendorId is an actual ID or email
    let userId = vendorId;

    // If vendorId looks like an email, get the actual ID
    if (vendorId.includes('@')) {
      const [userRows] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ? AND typegroup = ?',
        [vendorId, 'vendor']
      );

      if (!userRows || userRows.length === 0) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }

      userId = userRows[0].id;
    }

    // Join users and Vendor tables to get complete vendor info
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.typegroup,
        u.createdAt as created_at,
        v.service_name,
        v.years_of_excellence,
        v.contact_number,
        v.address,
        v.selected_services,
        v.type,
        v.active,
        v.expertise_in
      FROM users u
      LEFT JOIN Vendor v ON u.id = v.id
      WHERE u.id = ? AND u.typegroup = 'vendor'
    `, [userId]);

    console.log('Combined query result:', rows);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // If no vendor record exists, create a basic structure
    const vendorData = rows[0];
    if (!vendorData.service_name) {
      // Return user data with empty vendor fields
      const basicVendorData = {
        id: vendorData.id,
        username: vendorData.username,
        email: vendorData.email,
        typegroup: vendorData.typegroup,
        created_at: vendorData.created_at,
        service_name: '',
        years_of_excellence: 0,
        contact_number: '',
        address: '',
        selected_services: '',
        type: '',
        active: true,
        expertise_in: ''
      };
      return NextResponse.json(basicVendorData);
    }

    return NextResponse.json(vendorData);
  } catch (error) {
    console.error('Error in vendor GET API:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST method - Create vendor registration
export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUser] = await pool.execute<RowDataPacket[]>(
      "SELECT username FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: `User already registered as ${existingUser[0].username}` },
        { status: 409 }
      );
    }

    // Create new user with vendor typegroup
    const [result] = await pool.execute<OkPacket>(
      "INSERT INTO users (username, email, password, typegroup) VALUES (?, ?, ?, ?)",
      [username, email, password, 'vendor']
    );

    return NextResponse.json({
      message: "Vendor registered successfully!",
      userId: result.insertId
    });
  } catch (error) {
    console.error("Vendor registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Registration failed", error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT method - Update vendor information
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
    }

    // First check if vendor record exists in Vendor table
    const [checkResult] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM Vendor WHERE id = ?',
      [data.id]
    );

    let result;
    if (checkResult && checkResult.length > 0) {
      // Update existing vendor record
      result = await pool.execute<OkPacket>(
        `UPDATE Vendor SET 
          service_name = ?,
          years_of_excellence = ?,
          contact_number = ?,
          address = ?,
          expertise_in = ?,
          type = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          data.service_name || '',
          data.years_of_excellence || 0,
          data.contact_number || '',
          data.address || '',
          data.expertise_in || '',
          data.type || 'business',
          data.id
        ]
      );
    } else {
      // Create new vendor record
      result = await pool.execute<OkPacket>(
        `INSERT INTO Vendor 
          (id, service_name, years_of_excellence, email, contact_number, address, expertise_in, type, active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          data.id,
          data.service_name || '',
          data.years_of_excellence || 0,
          data.email,
          data.contact_number || '',
          data.address || '',
          data.expertise_in || '',
          data.type || 'business',
          1
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Vendor information updated successfully'
    });
  } catch (error) {
    console.error('Error updating vendor:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}