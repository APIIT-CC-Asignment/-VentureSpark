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
      console.log(`Resolved email ${vendorId} to user ID ${userId}`);
    }

    // Join users and Vendor tables to get complete vendor info with all merged fields
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
        expertise_in: '',
        website_url: '',
        portfolio_documents: '[]',
        years_in_business: 0,
        business_registration_number: '',
        tax_identification_number: '',
        social_media_links: '{}',
        certifications: '[]',
        profile_completion_percentage: 0,
        verification_status: 'pending',
        verification_notes: '',
        reviewed_by: null,
        reviewed_at: null,
        availability_slots: null,
        status: 'pending'
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

// POST method - Create or update vendor profile
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('POST to vendor API with data:', data);

    if (!data.id && !data.email) {
      return NextResponse.json({ error: 'Vendor ID or email is required' }, { status: 400 });
    }

    let vendorId = data.id;

    // If only email is provided, get the ID
    if (!vendorId && data.email) {
      const [userRows] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ? AND typegroup = ?',
        [data.email, 'vendor']
      );

      if (!userRows || userRows.length === 0) {
        return NextResponse.json({ error: 'Vendor not found with provided email' }, { status: 404 });
      }

      vendorId = userRows[0].id;
      console.log(`Resolved email ${data.email} to vendor ID ${vendorId}`);
    }

    // Check if vendor record exists in Vendor table
    const [checkResult] = await pool.execute<RowDataPacket[]>(
      'SELECT id, email FROM Vendor WHERE id = ?',
      [vendorId]
    );

    // Also check if the email already exists in another vendor record
    const [emailCheckResult] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM Vendor WHERE email = ? AND id != ?',
      [data.email, vendorId]
    );

    if (emailCheckResult && emailCheckResult.length > 0) {
      return NextResponse.json({
        error: `Email ${data.email} is already associated with another vendor account`
      }, { status: 409 });
    }

    // Ensure selected_services is properly formatted
    const selectedServices = data.selected_services || '[]';

    // Prepare availability slots if provided
    const availabilitySlots = data.availability_slots || null;

    let result;
    if (checkResult && checkResult.length > 0) {
      // Update existing vendor record with all merged fields
      console.log(`Updating vendor with service_name: "${data.service_name}"`);

      // Use the original service_name value directly from the request
      const serviceName = data.service_name;
      console.log(`Service name from request data: "${serviceName}"`);

      result = await pool.execute<OkPacket>(
        `UPDATE Vendor SET 
          service_name = ?,
          years_of_excellence = ?,
          contact_number = ?,
          address = ?,
          selected_services = ?,
          expertise_in = ?,
          type = ?,
          website_url = ?,
          portfolio_documents = ?,
          years_in_business = ?,
          business_registration_number = ?,
          tax_identification_number = ?,
          social_media_links = ?,
          certifications = ?,
          profile_completion_percentage = ?,
          verification_status = ?,
          availability_slots = ?,
          status = 'pending',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
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
      console.log(`Updated existing vendor record for ID ${vendorId}, affected rows: ${result[0].affectedRows}`);
    } else {
      // Check if this email already exists in Vendor table
      const [emailExists] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM Vendor WHERE email = ?',
        [data.email]
      );

      if (emailExists && emailExists.length > 0) {
        return NextResponse.json({
          error: `Email ${data.email} is already registered in the Vendor table`
        }, { status: 409 });
      }

      // Create new vendor record with all fields
      console.log(`Creating new vendor record with ID ${vendorId} and email ${data.email}`);
      result = await pool.execute<OkPacket>(
        `INSERT INTO Vendor 
          (id, service_name, years_of_excellence, email, contact_number, address, selected_services, expertise_in, 
           type, active, website_url, portfolio_documents, years_in_business, 
           business_registration_number, tax_identification_number, social_media_links, 
           certifications, profile_completion_percentage, verification_status, availability_slots, status,
           created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
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
      console.log(`Created new vendor record for ID ${vendorId}, affected rows: ${result[0].affectedRows}`);
    }

    // Fetch the updated record to return
    const [updatedRows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM Vendor WHERE id = ?`,
      [vendorId]
    );

    // Return the updated vendor data
    if (updatedRows && updatedRows.length > 0) {
      console.log('Vendor data updated successfully:', updatedRows[0]);
      return NextResponse.json(updatedRows[0]);
    }

    return NextResponse.json({
      success: true,
      message: 'Vendor information updated successfully',
      vendorId
    });
  } catch (error) {
    console.error('Error updating vendor:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT method - Update vendor information (same as POST but with PUT method)
export async function PUT(req: NextRequest) {
  return POST(req);
}