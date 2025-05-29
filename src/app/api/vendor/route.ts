// File: src/app/api/vendor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';

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
      const result = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND typegroup = $2',
        [vendorId, 'vendor']
      );

      if (!result.rows || result.rows.length === 0) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }

      userId = result.rows[0].id;
      console.log(`Resolved email ${vendorId} to user ID ${userId}`);
    }

    // Join users and vendor tables to get complete vendor info with all merged fields
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.typegroup,
        u.createdat as created_at,
        v.service_name,
        v.years_of_excellence,
        v.contact_number,
        v.address,
        v.selected_services,
        v.type,
        v.active,
        v.expertise_in,
        v.website_url,
        v.portfolio_documents,
        v.years_in_business,
        v.business_registration_number,
        v.tax_identification_number,
        v.social_media_links,
        v.certifications,
        v.profile_completion_percentage,
        v.verification_status,
        v.verification_notes,
        v.reviewed_by,
        v.reviewed_at,
        v.availability_slots,
        v.status
      FROM users u
      LEFT JOIN vendor v ON u.id = v.id
      WHERE u.id = $1 AND u.typegroup = 'vendor'
    `, [userId]);

    console.log('Combined query result:', result.rows);

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // If no vendor record exists, create a basic structure
    const vendorData = result.rows[0];
    return NextResponse.json(vendorData);

  } catch (error) {
    console.error('Error fetching vendor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST method - Create or update vendor profile
export async function POST(req: NextRequest) {
  let client;
  try {
    const data = await req.json();
    console.log('POST to vendor API with data:', data);

    // Handle registration case
    if (data.password) {
      // Get a client for transaction
      client = await pool.connect();
      await client.query('BEGIN');

      try {
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
            data.service_name,
            data.years_of_excellence,
            data.email,
            data.contact_number,
            data.address,
            data.selected_services,
            data.type,
            data.active,
            data.expertise_in
          ]
        );

        // Commit the transaction
        await client.query('COMMIT');

        return NextResponse.json({
          success: true,
          message: 'Registration successful',
          userId: userId
        });
      } catch (error) {
        // Rollback the transaction on error
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }

    // Handle existing vendor update case
    if (!data.id && !data.email) {
      return NextResponse.json({ error: 'Vendor ID or email is required' }, { status: 400 });
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

    // Check if vendor record exists in vendor table
    const checkResult = await pool.query(
      'SELECT id, email FROM vendor WHERE id = $1',
      [vendorId]
    );

    // Also check if the email already exists in another vendor record
    const emailCheckResult = await pool.query(
      'SELECT id FROM vendor WHERE email = $1 AND id != $2',
      [data.email, vendorId]
    );

    if (emailCheckResult.rows && emailCheckResult.rows.length > 0) {
      return NextResponse.json({
        error: `Email ${data.email} is already associated with another vendor account`
      }, { status: 409 });
    }

    // Ensure selected_services is properly formatted
    const selectedServices = data.selected_services || '[]';

    // Prepare availability slots if provided
    const availabilitySlots = data.availability_slots || null;

    let result;
    if (checkResult.rows && checkResult.rows.length > 0) {
      // Update existing vendor record with all merged fields
      console.log(`Updating vendor with service_name: "${data.service_name}"`);

      // Use the original service_name value directly from the request
      const serviceName = data.service_name;
      console.log(`Service name from request data: "${serviceName}"`);

      result = await pool.query(
        `UPDATE vendor SET 
          service_name = $1,
          years_of_excellence = $2,
          contact_number = $3,
          address = $4,
          selected_services = $5,
          expertise_in = $6,
          type = $7,
          website_url = $8,
          portfolio_documents = $9,
          years_in_business = $10,
          business_registration_number = $11,
          tax_identification_number = $12,
          social_media_links = $13,
          certifications = $14,
          profile_completion_percentage = $15,
          verification_status = $16,
          availability_slots = $17,
          status = 'pending',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $18
        RETURNING *`,
        [
          serviceName,
          data.years_of_excellence || 0,
          data.contact_number || '',
          data.address || '',
          selectedServices,
          data.expertise_in || '',
          data.type || 'business',
          data.website_url || '',
          data.portfolio_documents || '[]',
          data.years_in_business || 0,
          data.business_registration_number || '',
          data.tax_identification_number || '',
          data.social_media_links || '{}',
          data.certifications || '[]',
          data.profile_completion_percentage || 0,
          data.verification_status || 'pending',
          availabilitySlots,
          vendorId
        ]
      );
      console.log(`Updated existing vendor record for ID ${vendorId}`);
    } else {
      // Check if this email already exists in vendor table
      const emailExists = await pool.query(
        'SELECT id FROM vendor WHERE email = $1',
        [data.email]
      );

      if (emailExists.rows && emailExists.rows.length > 0) {
        return NextResponse.json({
          error: `Email ${data.email} is already registered in the vendor table`
        }, { status: 409 });
      }

      // Create new vendor record with all fields
      console.log(`Creating new vendor record with ID ${vendorId} and email ${data.email}`);
      result = await pool.query(
        `INSERT INTO vendor 
          (id, service_name, years_of_excellence, email, contact_number, address, selected_services, expertise_in, 
           type, active, website_url, portfolio_documents, years_in_business, 
           business_registration_number, tax_identification_number, social_media_links, 
           certifications, profile_completion_percentage, verification_status, availability_slots, status,
           created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *`,
        [
          vendorId,
          data.service_name || '',
          data.years_of_excellence || 0,
          data.email || '',
          data.contact_number || '',
          data.address || '',
          selectedServices,
          data.expertise_in || '',
          data.type || 'business',
          1,
          data.website_url || '',
          data.portfolio_documents || '[]',
          data.years_in_business || 0,
          data.business_registration_number || '',
          data.tax_identification_number || '',
          data.social_media_links || '{}',
          data.certifications || '[]',
          data.profile_completion_percentage || 0,
          data.verification_status || 'pending',
          availabilitySlots,
          'pending'
        ]
      );
    }

    return NextResponse.json({
      success: true,
      vendor: result.rows[0]
    });

  } catch (error) {
    console.error('Error in vendor API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT method - Update vendor information (same as POST but with PUT method)
export async function PUT(req: NextRequest) {
  return POST(req);
}