// File: app/api/vendor/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from "../../lib/db";
import { RowDataPacket, OkPacket } from 'mysql2';

// GET /api/vendor/profile - Fetch vendor profile data
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const vendorId = url.searchParams.get('vendorId');

        if (!vendorId) {
            return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM vendor_profiles WHERE vendor_id = ?',
            [vendorId]
        );

        if (!rows || rows.length === 0) {
            // Return null instead of error for 404, let the frontend handle creating the profile
            return NextResponse.json(null, { status: 404 });
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

        // Check if profile already exists
        const [checkResult] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM vendor_profiles WHERE vendor_id = ?',
            [data.vendor_id]
        );

        if (checkResult && checkResult.length > 0) {
            return NextResponse.json({ error: 'Profile already exists for this vendor' }, { status: 400 });
        }

        // Safe JSON parsing with defaults
        const parseJSON = (jsonString: string, defaultValue: any) => {
            try {
                return jsonString ? JSON.parse(jsonString) : defaultValue;
            } catch {
                return defaultValue;
            }
        };

        // Calculate profile completion percentage
        const portfolioDocs = parseJSON(data.portfolio_documents, []);
        const socialLinks = parseJSON(data.social_media_links, {});
        const certifications = parseJSON(data.certifications, []);

        const profileFields = [
            data.website_url,
            portfolioDocs.length > 0,
            data.years_in_business > 0,
            data.business_registration_number,
            data.tax_identification_number,
            Object.keys(socialLinks).length > 0,
            certifications.length > 0
        ];

        const filledFields = profileFields.filter(Boolean).length;
        const completionPercentage = Math.round((filledFields / profileFields.length) * 100);

        // Insert new profile
        const [result] = await pool.execute<OkPacket>(
            `INSERT INTO vendor_profiles (
                vendor_id,
                website_url,
                portfolio_documents,
                years_in_business,
                business_registration_number,
                tax_identification_number,
                social_media_links,
                certifications,
                profile_completion_percentage,
                verification_status,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
                data.vendor_id,
                data.website_url || null,
                data.portfolio_documents || '[]',
                data.years_in_business || 0,
                data.business_registration_number || null,
                data.tax_identification_number || null,
                data.social_media_links || '{}',
                data.certifications || '[]',
                completionPercentage,
                'pending',
            ]
        );

        // Return the created profile
        const [newProfile] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM vendor_profiles WHERE vendor_id = ?',
            [data.vendor_id]
        );

        return NextResponse.json(newProfile[0], { status: 201 });
    } catch (error) {
        console.error('Error creating vendor profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/vendor/profile - Update vendor profile
export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();

        if (!data.id) {
            return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
        }

        // Safe JSON parsing with defaults
        const parseJSON = (jsonString: string, defaultValue: any) => {
            try {
                return jsonString ? JSON.parse(jsonString) : defaultValue;
            } catch {
                return defaultValue;
            }
        };

        // Calculate profile completion percentage
        const portfolioDocs = parseJSON(data.portfolio_documents, []);
        const socialLinks = parseJSON(data.social_media_links, {});
        const certifications = parseJSON(data.certifications, []);

        const profileFields = [
            data.website_url,
            portfolioDocs.length > 0,
            data.years_in_business > 0,
            data.business_registration_number,
            data.tax_identification_number,
            Object.keys(socialLinks).length > 0,
            certifications.length > 0
        ];

        const filledFields = profileFields.filter(Boolean).length;
        const completionPercentage = Math.round((filledFields / profileFields.length) * 100);

        // Update profile
        await pool.execute<OkPacket>(
            `UPDATE vendor_profiles SET
                website_url = ?,
                portfolio_documents = ?,
                years_in_business = ?,
                business_registration_number = ?,
                tax_identification_number = ?,
                social_media_links = ?,
                certifications = ?,
                profile_completion_percentage = ?,
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
                data.id
            ]
        );

        // Return the updated profile
        const [updatedProfile] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM vendor_profiles WHERE id = ?',
            [data.id]
        );

        return NextResponse.json(updatedProfile[0]);
    } catch (error) {
        console.error('Error updating vendor profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}