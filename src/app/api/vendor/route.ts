// src/app/api/vendor/route.ts - Comprehensive fix with single query
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';

// Longer timeout wrapper for database queries
const queryWithTimeout = async (query: string, params: any[] = [], timeoutMs: number = 15000) => {
  return Promise.race([
    pool.query(query, params),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timeout')), timeoutMs)
    )
  ]) as Promise<any>;
};

// GET method - Fetch ALL vendor information in one query
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const vendorId = url.searchParams.get('vendorId');

  console.log('[vendor] API called with vendorId:', vendorId);

  if (!vendorId) {
    return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
  }

  try {
    // Test connection first
    console.log('[vendor] Testing database connection...');
    await queryWithTimeout('SELECT 1', [], 5000);
    console.log('[vendor] Database connection successful');

    let actualVendorId = vendorId;

    // If vendorId is an email, resolve it to ID first
    if (vendorId.includes('@')) {
      console.log('[vendor] Resolving email to vendor ID...');
      const emailResult = await queryWithTimeout(
        'SELECT id FROM users WHERE email = $1 AND typegroup = $2',
        [vendorId, 'vendor'], 8000
      );

      if (!emailResult.rows || emailResult.rows.length === 0) {
        console.log('[vendor] No vendor found with email:', vendorId);
        return NextResponse.json(createFallbackVendorInfo(vendorId, vendorId));
      }

      actualVendorId = String(emailResult.rows[0].id);
      console.log('[vendor] Resolved email to vendor ID:', actualVendorId);
    }

    // Single comprehensive query to get ALL vendor data
    console.log('[vendor] Fetching comprehensive vendor data for ID:', actualVendorId);

    const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.typegroup,
        u.createdat,
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
        v.created_at as vendor_created_at,
        v.updated_at as vendor_updated_at
      FROM users u
      LEFT JOIN vendor v ON u.id = v.id
      WHERE u.id = $1 AND u.typegroup = 'vendor'
    `;

    const result = await queryWithTimeout(query, [parseInt(actualVendorId)], 12000);

    console.log('[vendor] Query executed, rows found:', result.rows.length);

    if (!result.rows || result.rows.length === 0) {
      console.log('[vendor] No vendor found with ID:', actualVendorId);
      return NextResponse.json(createFallbackVendorInfo(actualVendorId, vendorId));
    }

    const data = result.rows[0];
    console.log('[vendor] Raw vendor data from DB:', {
      id: data.id,
      username: data.username,
      email: data.email,
      service_name: data.service_name,
      years_of_excellence: data.years_of_excellence,
      verification_status: data.verification_status
    });

    // Process and return comprehensive vendor data
    const vendorResponse = {
      // Basic user info
      id: data.id,
      username: data.username || 'Vendor User',
      email: data.email || vendorId,
      typegroup: data.typegroup || 'vendor',
      created_at: data.createdat || new Date().toISOString(),

      // Basic vendor info
      service_name: data.service_name || '',
      years_of_excellence: data.years_of_excellence || 0,
      contact_number: data.contact_number || '',
      address: data.address || '',
      selected_services: data.selected_services || '[]',
      type: data.type || 'vendor',
      active: data.active !== undefined ? data.active : true,
      expertise_in: data.expertise_in || '',

      // Profile info (for compatibility with profile API)
      website_url: data.website_url || '',
      portfolio_documents: Array.isArray(data.portfolio_documents)
        ? JSON.stringify(data.portfolio_documents)
        : data.portfolio_documents || '[]',
      years_in_business: data.years_in_business || 0,
      business_registration_number: data.business_registration_number || '',
      tax_identification_number: data.tax_identification_number || '',
      social_media_links: typeof data.social_media_links === 'object'
        ? JSON.stringify(data.social_media_links)
        : data.social_media_links || '{}',
      certifications: Array.isArray(data.certifications)
        ? JSON.stringify(data.certifications)
        : data.certifications || '[]',
      profile_completion_percentage: data.profile_completion_percentage || 0,
      verification_status: data.verification_status || 'pending',
      verification_notes: data.verification_notes || '',
      reviewed_by: data.reviewed_by,
      reviewed_at: data.reviewed_at,
      vendor_created_at: data.vendor_created_at,
      vendor_updated_at: data.vendor_updated_at
    };

    console.log('[vendor] Successfully returning comprehensive vendor data:', {
      id: vendorResponse.id,
      username: vendorResponse.username,
      email: vendorResponse.email,
      service_name: vendorResponse.service_name
    });

    return NextResponse.json(vendorResponse);

  } catch (error) {
    console.error('[vendor] Error fetching vendor data:', error);
    return NextResponse.json(createFallbackVendorInfo(vendorId, vendorId));
  }
}

// Helper function to create fallback vendor info
function createFallbackVendorInfo(vendorId: string, originalId: string) {
  console.log('[vendor] Creating fallback data for:', vendorId);
  return {
    id: vendorId,
    username: 'Vendor User',
    email: originalId.includes('@') ? originalId : 'vendor@example.com',
    typegroup: 'vendor',
    created_at: new Date().toISOString(),
    service_name: 'Professional Services',
    years_of_excellence: 1,
    contact_number: '',
    address: '',
    selected_services: '[]',
    type: 'vendor',
    active: true,
    expertise_in: 'Business Consultation',
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
    reviewed_at: null
  };
}

// POST method - Create or update vendor profile
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('[vendor] POST called with data keys:', Object.keys(data));

    // Handle registration case
    if (data.password) {
      console.log('[vendor] Handling new vendor registration...');

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
            data.type || 'vendor',
            data.active !== undefined ? data.active : true,
            data.expertise_in || ''
          ]
        );

        await client.query('COMMIT');
        console.log('[vendor] Registration successful for user ID:', userId);

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

    // Handle vendor update case
    if (!data.id && !data.email) {
      return NextResponse.json({ error: 'Vendor ID or email is required for update' }, { status: 400 });
    }

    let vendorId = data.id;

    // If only email is provided, get the ID
    if (!vendorId && data.email) {
      const userResult = await queryWithTimeout(
        'SELECT id FROM users WHERE email = $1 AND typegroup = $2',
        [data.email, 'vendor'], 8000
      );

      if (!userResult.rows || userResult.rows.length === 0) {
        return NextResponse.json({ error: 'Vendor not found with provided email' }, { status: 404 });
      }

      vendorId = userResult.rows[0].id;
    }

    console.log('[vendor] Updating vendor with ID:', vendorId);

    // Update vendor record
    const result = await queryWithTimeout(
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
      WHERE id::text = $9::text
      RETURNING *`,
      [
        data.service_name || '',
        data.years_of_excellence || 0,
        data.contact_number || '',
        data.address || '',
        data.selected_services || '[]',
        data.expertise_in || '',
        data.type || 'vendor',
        data.active !== undefined ? data.active : true,
        vendorId
      ], 10000
    );

    console.log('[vendor] Vendor update successful');
    return NextResponse.json({
      success: true,
      vendor: result.rows[0]
    });

  } catch (error) {
    console.error('[vendor] Error in POST:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT method
export async function PUT(req: NextRequest) {
  return POST(req);
}