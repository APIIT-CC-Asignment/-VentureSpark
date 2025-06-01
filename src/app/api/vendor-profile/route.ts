// src/app/api/vendor-profile/route.ts - Optimized with longer timeouts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';

// Longer timeout for database queries
const queryWithTimeout = async (query: string, params: any[] = [], timeoutMs: number = 15000) => {
    return Promise.race([
        pool.query(query, params),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Database query timeout')), timeoutMs)
        )
    ]) as Promise<any>;
};

function calculateCompletionPercentage(data: any): number {
    const fields = [
        !!data.website_url,
        !!data.business_registration_number,
        !!data.tax_identification_number,
        data.years_in_business > 0,
        data.portfolio_documents && data.portfolio_documents !== '[]' && data.portfolio_documents !== '',
        data.social_media_links && data.social_media_links !== '{}' && data.social_media_links !== '',
        data.certifications && data.certifications !== '[]' && data.certifications !== ''
    ];

    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
}

// Helper function to create fallback profile
function createFallbackProfile(vendorId: string) {
    return {
        vendor_id: vendorId,
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
}

// GET /api/vendor-profile - Fetch vendor profile data
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const vendorId = url.searchParams.get('vendorId');

    console.log('[vendor-profile] GET request received for vendorId:', vendorId);

    if (!vendorId) {
        return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
    }

    try {
        // Longer connection test timeout
        console.log('[vendor-profile] Testing database connection...');
        await queryWithTimeout('SELECT 1', [], 8000);
        console.log('[vendor-profile] Database connection successful');

        // Try to get the profile data from the vendor table with longer timeout
        console.log('[vendor-profile] Fetching vendor profile data...');
        const result = await queryWithTimeout(`
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
            WHERE id::text = $1::text
        `, [vendorId], 12000); // 12 second timeout for main query

        console.log('[vendor-profile] Query executed, rows found:', result.rows.length);

        if (!result.rows || result.rows.length === 0) {
            console.log('[vendor-profile] No profile found, returning default profile');
            return NextResponse.json(createFallbackProfile(vendorId));
        }

        const profileData = result.rows[0];
        console.log('[vendor-profile] Raw profile data:', profileData);

        // Process the data to ensure proper format
        const processedProfile = {
            vendor_id: profileData.vendor_id,
            website_url: profileData.website_url || '',
            portfolio_documents: Array.isArray(profileData.portfolio_documents)
                ? JSON.stringify(profileData.portfolio_documents)
                : profileData.portfolio_documents || '[]',
            years_in_business: profileData.years_in_business || 0,
            business_registration_number: profileData.business_registration_number || '',
            tax_identification_number: profileData.tax_identification_number || '',
            social_media_links: typeof profileData.social_media_links === 'object'
                ? JSON.stringify(profileData.social_media_links)
                : profileData.social_media_links || '{}',
            certifications: Array.isArray(profileData.certifications)
                ? JSON.stringify(profileData.certifications)
                : profileData.certifications || '[]',
            profile_completion_percentage: profileData.profile_completion_percentage || calculateCompletionPercentage(profileData),
            verification_status: profileData.verification_status || 'pending',
            verification_notes: profileData.verification_notes || '',
            reviewed_by: profileData.reviewed_by,
            reviewed_at: profileData.reviewed_at,
            created_at: profileData.created_at || new Date().toISOString(),
            updated_at: profileData.updated_at || new Date().toISOString()
        };

        console.log('[vendor-profile] Successfully returning processed profile data');
        return NextResponse.json(processedProfile);

    } catch (connectionError) {
        console.error('[vendor-profile] Database connection/query failed:', connectionError);
        console.log('[vendor-profile] Returning fallback profile data');
        return NextResponse.json(createFallbackProfile(vendorId));
    }
}

// POST /api/vendor-profile - Create/Update vendor profile
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        console.log('[vendor-profile] POST request received with data:', data);

        if (!data.vendor_id) {
            console.error('[vendor-profile] No vendor_id provided in request');
            return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
        }

        // Calculate completion percentage
        const completionPercentage = calculateCompletionPercentage(data);

        try {
            // Longer connection test timeout
            await queryWithTimeout('SELECT 1', [], 8000);
            console.log('[vendor-profile] Database connection successful for POST');
        } catch (connectionError) {
            console.error('[vendor-profile] Database connection failed for POST:', connectionError);
            return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
        }

        try {
            // Check if vendor exists with longer timeout
            const vendorCheck = await queryWithTimeout(
                'SELECT id FROM vendor WHERE id::text = $1::text',
                [data.vendor_id], 10000
            );

            if (!vendorCheck.rows || vendorCheck.rows.length === 0) {
                console.error('[vendor-profile] Vendor not found:', data.vendor_id);
                return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
            }

            // Update the existing vendor record with profile data - longer timeout
            const result = await queryWithTimeout(
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
                WHERE id::text = $9::text
                RETURNING *`,
                [
                    data.website_url || null,
                    typeof data.portfolio_documents === 'string' ? data.portfolio_documents : JSON.stringify(data.portfolio_documents || []),
                    data.years_in_business || 0,
                    data.business_registration_number || null,
                    data.tax_identification_number || null,
                    typeof data.social_media_links === 'string' ? data.social_media_links : JSON.stringify(data.social_media_links || {}),
                    typeof data.certifications === 'string' ? data.certifications : JSON.stringify(data.certifications || []),
                    completionPercentage,
                    data.vendor_id
                ], 12000 // 12 second timeout for update
            );

            if (!result.rows || result.rows.length === 0) {
                console.error('[vendor-profile] Failed to update vendor profile for:', data.vendor_id);
                return NextResponse.json({ error: 'Failed to update vendor profile' }, { status: 500 });
            }

            console.log('[vendor-profile] Successfully updated profile for vendor:', data.vendor_id);

            // Return the updated profile in the same format as GET
            const updatedProfile = result.rows[0];
            const responseProfile = {
                vendor_id: updatedProfile.id,
                website_url: updatedProfile.website_url || '',
                portfolio_documents: typeof updatedProfile.portfolio_documents === 'string'
                    ? updatedProfile.portfolio_documents
                    : JSON.stringify(updatedProfile.portfolio_documents || []),
                years_in_business: updatedProfile.years_in_business || 0,
                business_registration_number: updatedProfile.business_registration_number || '',
                tax_identification_number: updatedProfile.tax_identification_number || '',
                social_media_links: typeof updatedProfile.social_media_links === 'string'
                    ? updatedProfile.social_media_links
                    : JSON.stringify(updatedProfile.social_media_links || {}),
                certifications: typeof updatedProfile.certifications === 'string'
                    ? updatedProfile.certifications
                    : JSON.stringify(updatedProfile.certifications || []),
                profile_completion_percentage: updatedProfile.profile_completion_percentage || 0,
                verification_status: updatedProfile.verification_status || 'pending',
                verification_notes: updatedProfile.verification_notes || '',
                reviewed_by: updatedProfile.reviewed_by,
                reviewed_at: updatedProfile.reviewed_at,
                created_at: updatedProfile.created_at,
                updated_at: updatedProfile.updated_at
            };

            return NextResponse.json(responseProfile, { status: 201 });
        } catch (queryError) {
            console.error('[vendor-profile] Query error:', queryError);
            return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
        }
    } catch (error) {
        console.error('[vendor-profile] Error in POST:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `Internal server error: ${errorMessage}` },
            { status: 500 }
        );
    }
}

// PUT /api/vendor-profile - Update vendor profile
export async function PUT(req: NextRequest) {
    // Use the same logic as POST since we're updating the same table
    return POST(req);
}