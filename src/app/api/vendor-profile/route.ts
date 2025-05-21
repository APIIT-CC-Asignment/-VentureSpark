// File: app/api/vendor/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from "../../lib/db";
import { RowDataPacket, OkPacket } from 'mysql2';

function calculateCompletionPercentage(data: any): number {
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
}

// GET /api/vendor/profile - Fetch vendor profile data
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const vendorId = url.searchParams.get('vendorId');

        if (!vendorId) {
            return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
        }

        // Now we're getting the profile data directly from the Vendor table
        const [rows] = await pool.execute<RowDataPacket[]>(`
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
            FROM Vendor
            WHERE id = ?
        `, [vendorId]);

        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Error fetching vendor profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/vendor/profile - Create new vendor profile
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        if (!data.vendor_id) {
            return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
        }

        // Calculate completion percentage
        const completionPercentage = calculateCompletionPercentage(data);

        // Check if vendor exists
        const [vendorCheck] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM Vendor WHERE id = ?',
            [data.vendor_id]
        );

        if (!vendorCheck || vendorCheck.length === 0) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        // Update the existing vendor record with profile data
        const [result] = await pool.execute<OkPacket>(
            `UPDATE Vendor SET
                website_url = ?,
                portfolio_documents = ?,
                years_in_business = ?,
                business_registration_number = ?,
                tax_identification_number = ?,
                social_media_links = ?,
                certifications = ?,
                profile_completion_percentage = ?,
                verification_status = 'pending',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
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

        // Return the updated profile
        const [updatedProfile] = await pool.execute<RowDataPacket[]>(
            `SELECT 
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
            FROM Vendor
            WHERE id = ?`,
            [data.vendor_id]
        );

        return NextResponse.json(updatedProfile[0], { status: 201 });
    } catch (error) {
        console.error('Error creating vendor profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/vendor/profile - Update vendor profile
export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();

        if (!data.vendor_id) {
            return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
        }

        // Calculate completion percentage
        const completionPercentage = calculateCompletionPercentage(data);

        // Update the vendor record
        const [result] = await pool.execute<OkPacket>(
            `UPDATE Vendor SET
                website_url = ?,
                portfolio_documents = ?,
                years_in_business = ?,
                business_registration_number = ?,
                tax_identification_number = ?,
                social_media_links = ?,
                certifications = ?,
                profile_completion_percentage = ?,
                verification_status = 'pending',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
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

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
        }

        // Return the updated profile
        const [updatedProfile] = await pool.execute<RowDataPacket[]>(
            `SELECT 
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
            FROM Vendor
            WHERE id = ?`,
            [data.vendor_id]
        );

        return NextResponse.json(updatedProfile[0]);
    } catch (error) {
        console.error('Error updating vendor profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}