import { NextResponse } from 'next/server';
import pool from '../../lib/db';

type ConsultantType = 'finance' | 'legal' | 'business';

interface Consultant {
  id: string;
  name: string;
  type: ConsultantType;
  description: string;
}

export async function GET(req: Request) {
  try {
    console.log("[getConsultants] Starting consultant fetch...");

    let result;

    // STRATEGY 1: Get all vendors and convert them to consultants
    // Since your data doesn't have specific consultant types, we'll create them
    try {
      console.log("[getConsultants] Fetching all vendors from vendor table...");
      result = await pool.query(
        `SELECT v.id, v.service_name, v.type, v.expertise_in, v.email, u.username
         FROM vendor v 
         LEFT JOIN users u ON v.id = u.id 
         WHERE v.active = true
         ORDER BY v.created_at DESC`
      );
      console.log(`[getConsultants] Found ${result.rows.length} active vendors`);
    } catch (error) {
      console.error("[getConsultants] Error fetching vendors:", error);
    }

    // STRATEGY 2: If no vendors found, get from users table
    if (!result || result.rows.length === 0) {
      console.log("[getConsultants] No vendors found, trying users table...");

      try {
        result = await pool.query(
          `SELECT id, username, email, 'business' as type, '' as expertise_in 
           FROM users 
           WHERE typegroup = 'vendor' 
           ORDER BY createdat DESC`
        );
        console.log(`[getConsultants] Found ${result.rows.length} vendor users`);
      } catch (error) {
        console.error("[getConsultants] Error with users query:", error);
      }
    }

    // Process results if we have any
    if (result && result.rows.length > 0) {
      console.log("[getConsultants] Processing results...");

      const consultants: Consultant[] = result.rows.map((row, index) => {
        // Create consultant name from available data
        let consultantName = '';
        if (row.service_name && row.service_name.trim() && row.service_name !== 'New Vendor') {
          consultantName = row.service_name;
        } else if (row.username && row.username.trim()) {
          consultantName = row.username;
        } else {
          consultantName = `Professional Consultant ${index + 1}`;
        }

        // Assign consultant types in a round-robin fashion to create variety
        const types: ConsultantType[] = ['business', 'finance', 'legal'];
        const assignedType = types[index % types.length];

        // Create description from available data
        let description = '';
        if (row.expertise_in && row.expertise_in.trim() && row.expertise_in !== 'To be updated') {
          description = row.expertise_in;
        } else {
          // Create type-specific descriptions
          switch (assignedType) {
            case 'finance':
              description = 'Expert financial advisor specializing in startup funding, financial planning, and investment strategies.';
              break;
            case 'legal':
              description = 'Experienced legal consultant providing business law, compliance, and regulatory guidance for startups.';
              break;
            case 'business':
            default:
              description = 'Strategic business consultant helping startups with growth planning, market analysis, and operational excellence.';
              break;
          }
        }

        const consultant: Consultant = {
          id: row.id?.toString() || `consultant_${index}`,
          name: consultantName,
          type: assignedType,
          description: description
        };

        console.log(`[getConsultants] Processed consultant ${index + 1}:`, consultant);
        return consultant;
      });

      console.log(`[getConsultants] Successfully returning ${consultants.length} consultants`);
      return NextResponse.json(consultants);
    }

    // If no results found, return empty array
    console.log("[getConsultants] No consultants found, returning empty array");
    return NextResponse.json([]);

  } catch (error) {
    console.error("[getConsultants] Critical error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        message: "Failed to fetch consultants",
        error: errorMessage,
        debug: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}