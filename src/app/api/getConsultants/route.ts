import { NextResponse } from 'next/server';
import pool from '../../lib/db';

// Consultant type definition
type ConsultantType = 'finance' | 'legal' | 'business';

interface Consultant {
  id: string;
  name: string;
  type: ConsultantType;
  description: string;
}

export async function POST(req: Request) {
  try {
    console.log("[getConsultants] Fetching consultants...");

    // Query for consultants (finance, legal, business)
    const result = await pool.query(
      "SELECT id, service_name, type, expertise_in FROM vendor WHERE type IN ('finance', 'legal', 'business')"
    );

    console.log(`[getConsultants] Found ${result.rows.length} consultants`);

    if (result.rows.length === 0) {
      console.log("[getConsultants] No consultants found, checking for any non-service vendors...");

      // Fallback query
      const fallbackResult = await pool.query(
        "SELECT id, service_name, type, expertise_in FROM vendor WHERE type <> 'Services' LIMIT 10"
      );

      console.log(`[getConsultants] Found ${fallbackResult.rows.length} non-service vendors`);

      if (fallbackResult.rows.length > 0) {
        const consultants: Consultant[] = fallbackResult.rows.map((row) => ({
          id: row.id || '',
          name: row.service_name || 'Consultant',
          type: (row.type as ConsultantType) || 'business',
          description: row.expertise_in || 'Professional consultant',
        }));

        console.log(`[getConsultants] Returning ${consultants.length} fallback consultants`);
        return NextResponse.json(consultants);
      }
    }

    const consultants: Consultant[] = result.rows.map((row) => ({
      id: row.id || '',
      name: row.service_name || 'Consultant',
      type: (row.type as ConsultantType) || 'business',
      description: row.expertise_in || 'Professional consultant',
    }));

    console.log(`[getConsultants] Returning ${consultants.length} consultants`);
    return NextResponse.json(consultants);
  } catch (error) {
    console.error("Error fetching consultants:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to fetch consultants", error: errorMessage },
      { status: 500 }
    );
  }
}



