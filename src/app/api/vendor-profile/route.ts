// File: app/api/vendor/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from "../../lib/db";

function calculateCompletionPercentage(data: any): number {
    try {
        // Fields to check for completion
        const fields = [
            !!data.website_url,
            !!data.business_registration_number,
            !!data.tax_identification_number,
            data.years_in_business > 0,
            data.portfolio_documents && data.portfolio_documents !== '[]',
            data.social_media_links && data.social_media_links !== '{}',
            data.certifications && data.certifications !== '[]'
        ];

        const filledFields = fields.filter(Boolean).length;
        return Math.round((filledFields / fields.length) * 100);
    } catch (error) {
        console.error('Error calculating completion percentage:', error);
        return 0;
    }
}

// GET /api/vendor/profile - Fetch vendor profile data
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const vendorId = url.searchParams.get('vendorId');

        if (!vendorId) {
            return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
        }

        // Now we're getting the profile data directly from the vendor table
        const result = await pool.query(`
            SELECT 
                id as vendor_id,
                website_url,
                portfolio_documents,
                years_in_business,
                business_registration_number,
                tax_identification_number,
                social_media_links,
                certifications,
                profile_completion_percentage,
                verification_status,
                verification_notes,
                reviewed_by,
                reviewed_at,
                created_at,
                updated_at
            FROM vendor
            WHERE id = $1
        `, [vendorId]);

        if (!result.rows || result.rows.length === 0) {
            return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching vendor profile:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: `Internal server error: ${errorMessage}` }, { status: 500 });
    }
}

// POST /api/vendor/profile - Create new vendor profile
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        console.log('Received data for creation:', data); // Debug log

        if (!data.vendor_id) {
            return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
        }

        // Calculate completion percentage
        const completionPercentage = calculateCompletionPercentage(data);

        // Check if vendor exists
        const vendorCheck = await pool.query(
            'SELECT id FROM vendor WHERE id = $1',
            [data.vendor_id]
        );

        if (!vendorCheck.rows || vendorCheck.rows.length === 0) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        // Update the existing vendor record with profile data
        const result = await pool.query(
            `UPDATE vendor SET
                website_url = $1,
                portfolio_documents = $2,
                years_in_business = $3,
                business_registration_number = $4,
                tax_identification_number = $5,
                social_media_links = $6,
                certifications = $7,
                profile_completion_percentage = $8,
                verification_status = 'pending',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $9
            RETURNING *`,
            [
                data.website_url || null,
                data.portfolio_documents || '[]',
                data.years_in_business || 0,
                data.business_registration_number || null,
                data.tax_identification_number || null,
                data.social_media_links || '{}',
                data.certifications || '[]',
                completionPercentage,
                data.vendor_id
            ]
        );

        if (!result.rows || result.rows.length === 0) {
            return NextResponse.json({ error: 'Failed to create vendor profile' }, { status: 500 });
        }

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error creating vendor profile:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: `Internal server error: ${errorMessage}` }, { status: 500 });
    }
}

// PUT /api/vendor/profile - Update vendor profile
export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        console.log('Received data for update:', data); // Debug log

        if (!data.vendor_id) {
            return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
        }

        // Calculate completion percentage
        const completionPercentage = calculateCompletionPercentage(data);

        // First check if vendor exists
        const vendorCheck = await pool.query(
            'SELECT id FROM vendor WHERE id = $1',
            [data.vendor_id]
        );

        if (!vendorCheck.rows || vendorCheck.rows.length === 0) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        // Update the vendor record
        const updateResult = await pool.query(
            `UPDATE vendor SET
                website_url = $1,
                portfolio_documents = $2,
                years_in_business = $3,
                business_registration_number = $4,
                tax_identification_number = $5,
                social_media_links = $6,
                certifications = $7,
                profile_completion_percentage = $8,
                verification_status = 'pending',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $9
            RETURNING *`,
            [
                data.website_url || null,
                data.portfolio_documents || '[]',
                data.years_in_business || 0,
                data.business_registration_number || null,
                data.tax_identification_number || null,
                data.social_media_links || '{}',
                data.certifications || '[]',
                completionPercentage,
                data.vendor_id
            ]
        );

        if (!updateResult.rows || updateResult.rows.length === 0) {
            return NextResponse.json({ error: 'Failed to update vendor profile' }, { status: 500 });
        }

        return NextResponse.json(updateResult.rows[0]);
    } catch (error) {
        console.error('Error updating vendor profile:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: `Internal server error: ${errorMessage}` }, { status: 500 });
    }
}