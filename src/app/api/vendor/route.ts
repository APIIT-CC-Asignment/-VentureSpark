// Simplified and fixed version of src/app/api/vendor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';

// GET method - Fetch vendor information (BASIC USER INFO ONLY)
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
      console.log('Resolving email to ID...');
      const result = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND typegroup = $2',
        [vendorId, 'vendor']
      );

      if (!result.rows || result.rows.length === 0) {
        console.log('No user found with email:', vendorId);
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }

      userId = result.rows[0].id;
      console.log(`Resolved email ${vendorId} to user ID ${userId}`);
    }

    // Get basic user info from users table only
    console.log('Fetching user data for ID:', userId);
    const userResult = await pool.query(`
      SELECT 
        id,
        username,
        email,
        typegroup,
        createdat
      FROM users
      WHERE id = $1 AND typegroup = 'vendor'
    `, [userId]);

    console.log('User query executed, rows found:', userResult.rows.length);

    if (!userResult.rows || userResult.rows.length === 0) {
      console.log('No vendor user found with ID:', userId);
      return NextResponse.json({ error: 'Vendor not found in users table' }, { status: 404 });
    }

    const userData = userResult.rows[0];
    console.log('User data retrieved:', userData);

    // Now try to get vendor-specific info from vendor table
    let vendorData = null;
    try {
      console.log('Fetching vendor-specific data...');
      const vendorResult = await pool.query(`
        SELECT 
          service_name,
          years_of_excellence,
          contact_number,
          address,
          selected_services,
          type,
          active,
          expertise_in
        FROM vendor
        WHERE id = $1
      `, [userId]);

      console.log('Vendor query executed, rows found:', vendorResult.rows.length);

      if (vendorResult.rows && vendorResult.rows.length > 0) {
        vendorData = vendorResult.rows[0];
        console.log('Vendor data retrieved:', vendorData);
      } else {
        console.log('No vendor record found, using defaults');
      }
    } catch (vendorError) {
      console.error('Error fetching vendor data (continuing with defaults):', vendorError);
      // Continue with null vendorData
    }

    // Create response with basic user info and vendor defaults
    const responseData = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      typegroup: userData.typegroup,
      created_at: userData.createdat,
      // Vendor-specific fields with safe defaults
      service_name: vendorData?.service_name || '',
      years_of_excellence: vendorData?.years_of_excellence || 0,
      contact_number: vendorData?.contact_number || '',
      address: vendorData?.address || '',
      selected_services: vendorData?.selected_services || '[]',
      type: vendorData?.type || 'business',
      active: vendorData?.active !== undefined ? vendorData.active : true,
      expertise_in: vendorData?.expertise_in || ''
    };

    console.log('Sending response data:', responseData);
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error in GET /api/vendor:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', errorMessage);
    if (errorStack) console.error('Error stack:', errorStack);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: errorMessage,
        vendorId: req.url.includes('vendorId') ? new URL(req.url).searchParams.get('vendorId') : 'unknown'
      },
      { status: 500 }
    );
  }
}

// POST method - Create or update vendor profile (VENDOR TABLE ONLY)
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('POST /api/vendor called with data keys:', Object.keys(data));

    // Handle registration case (create both user and vendor records)
    if (data.password) {
      console.log('Handling new vendor registration...');

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Check if user already exists
        const existingUsers = await client.query(
          'SELECT id FROM users WHERE email = $1',
          [data.email]
        );

        if (existingUsers.rows.length > 0) {
          await client.query('ROLLBACK');
          return NextResponse.json(
            { error: 'User with this email already exists' },
            { status: 409 }
          );
        }

        // Create user
        const userResult = await client.query(
          'INSERT INTO users (username, email, password, typegroup) VALUES ($1, $2, $3, $4) RETURNING id',
          [data.username, data.email, data.password, data.typegroup]
        );

        const userId = userResult.rows[0].id;

        // Create vendor profile
        await client.query(
          `INSERT INTO vendor 
            (id, service_name, years_of_excellence, email, contact_number, address, selected_services, type, active, expertise_in)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            userId,
            data.service_name || '',
            data.years_of_excellence || 0,
            data.email,
            data.contact_number || '',
            data.address || '',
            data.selected_services || '[]',
            data.type || 'business',
            data.active !== undefined ? data.active : true,
            data.expertise_in || ''
          ]
        );

        await client.query('COMMIT');
        console.log('Registration successful for user ID:', userId);

        return NextResponse.json({
          success: true,
          message: 'Registration successful',
          userId: userId
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }

    // Handle vendor update case (update vendor table only)
    if (!data.id && !data.email) {
      return NextResponse.json({ error: 'Vendor ID or email is required for update' }, { status: 400 });
    }

    let vendorId = data.id;

    // If only email is provided, get the ID
    if (!vendorId && data.email) {
      const userResult = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND typegroup = $2',
        [data.email, 'vendor']
      );

      if (!userResult.rows || userResult.rows.length === 0) {
        return NextResponse.json({ error: 'Vendor not found with provided email' }, { status: 404 });
      }

      vendorId = userResult.rows[0].id;
    }

    console.log('Updating vendor with ID:', vendorId);

    // Check if vendor record exists
    const checkResult = await pool.query(
      'SELECT id FROM vendor WHERE id = $1',
      [vendorId]
    );

    let result;
    if (checkResult.rows && checkResult.rows.length > 0) {
      // Update existing vendor record
      console.log('Updating existing vendor record...');
      result = await pool.query(
        `UPDATE vendor SET 
          service_name = $1,
          years_of_excellence = $2,
          contact_number = $3,
          address = $4,
          selected_services = $5,
          expertise_in = $6,
          type = $7,
          active = $8,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *`,
        [
          data.service_name || '',
          data.years_of_excellence || 0,
          data.contact_number || '',
          data.address || '',
          data.selected_services || '[]',
          data.expertise_in || '',
          data.type || 'business',
          data.active !== undefined ? data.active : true,
          vendorId
        ]
      );
    } else {
      // Create new vendor record
      console.log('Creating new vendor record...');
      result = await pool.query(
        `INSERT INTO vendor 
          (id, service_name, years_of_excellence, email, contact_number, address, selected_services, expertise_in, type, active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *`,
        [
          vendorId,
          data.service_name || '',
          data.years_of_excellence || 0,
          data.email || '',
          data.contact_number || '',
          data.address || '',
          data.selected_services || '[]',
          data.expertise_in || '',
          data.type || 'business',
          data.active !== undefined ? data.active : true
        ]
      );
    }

    console.log('Vendor operation successful');
    return NextResponse.json({
      success: true,
      vendor: result.rows[0]
    });

  } catch (error) {
    console.error('Error in POST /api/vendor:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', errorMessage);
    if (errorStack) console.error('Error stack:', errorStack);

    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT method - Update vendor information
export async function PUT(req: NextRequest) {
  return POST(req);
}